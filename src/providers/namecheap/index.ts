import type { Element } from "xml-js";
import type {
  NamecheapInstanceOptions,
  NamecheapUpdateDnsRecordProps
} from "./types/NamecheapApi.js";

import { xml2js } from "xml-js";
import got from "got";

export class NamecheapApi {
  private api: typeof got;

  /**
   * Namecheap API new instance.
   * @param {NamecheapInstanceOptions} options - Options for the Namecheap API
   */
  constructor (options: NamecheapInstanceOptions) {
    if (!options.dynamicDnsPassword) throw Error("[NamecheapApi] Property `dynamicDnsPassword` is missing.");

    this.api = got.extend({
      url: "https://dynamicdns.park-your-domain.com/update",
      searchParams: {
        password: options.dynamicDnsPassword
      }
    });
  }

  private getElementsOf (toSearch: string, elements: Element[]) {
    // We force the type because it's always there in the response.
    const element = elements.find(el => el.name === toSearch) as Element;
    return element.elements as Element[];
  }

  public async updateDnsRecord({ domain, host, ip = null }: NamecheapUpdateDnsRecordProps) {
    if (!domain || !host) throw Error("[NamecheapApi] Properties `domain` or `host` are missing.");

    const body = await this.api.post({
      searchParams: {
        domain,
        host,
        ip
      }
    }).text();

    // We parse the XML body.
    // (Please, APIs, stop that, XML is so hard to use...)
    const parsedBody: Element = xml2js(body).elements[0];
    const response = parsedBody.elements as Element[];

    // Know if there's errors.
    const errorCountElements = this.getElementsOf("ErrCount", response);
    const errorCount = parseInt(errorCountElements[0].text as string);

    // There's no errors ? We return true.
    if (errorCount === 0) return true;

    // If there's an error, handle it.
    if (errorCount > 0) {
      const errorsElements = this.getElementsOf("errors", response);
      const errors = errorsElements.map(errorElement => {
        const errorTextElements = errorElement.elements as Element[];
        const errorText = errorTextElements[0].text;

        return errorText;
      });

      throw new Error(`[NamecheapApi] Errors:\n${errors.map(error => `- ${error}`).join("\n")}`);
    }
  }
}