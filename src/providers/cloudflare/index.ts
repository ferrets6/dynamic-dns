import type {
  CloudflareInstanceOptions,
  CloudflareListZonesProps,
  CloudflareUpdateDnsRecordProps
} from "./types";
import got from "got";

export class CloudflareApi {
  private api: typeof got;

  /**
   * Cloudflare API new instance.
   * @param {CloudflareInstanceOptions} options - Options for the Cloudflare API
   */
  constructor (options: CloudflareInstanceOptions) {
    this.api = got.extend({
      prefixUrl: "https://api.cloudflare.com/client/v4/"
    });

    // Authenticate with API Token.
    if (options.token) {
      this.api = this.api.extend({
        headers: {
          "Authorization": `Bearer ${options.token}`
        }
      });
    }
    // Authenticate with authKeys
    else if (options.authEmail && options.authKey) {
      this.api = this.api.extend({
        headers: {
          "X-Auth-Key": options.authKey,
          "X-Auth-Email": options.authEmail
        }
      });
    }
    // If we can't authenticate, send error.
    else {
      throw new Error("{token} or {authEmail, authKey} not passed ! Can't login.");
    }
  }

  public async listZones ({
    name,
    page = 1,
    per_page = 20
  }: CloudflareListZonesProps) {
    if (page < 1) throw Error("Page can't be under 1. 1 is the minimum value.");
    if (per_page > 50) throw Error("You can't show more than 50 results per page.");
    if (per_page < 5) throw Error("You can't show less than 5 results per page.");

    const body = await this.api.get("zones", {
      searchParams: {
        name,
        page,
        per_page
      }
    }).json();
    console.log(body);
  }

  public async updateDnsRecord ({
    zone_identifier,
    identifier,
    content,
    name,
    type,
    ttl = 3600,
    proxied
  }: CloudflareUpdateDnsRecordProps) {
    try {
      const res = await this.api.put(`zones/${zone_identifier}/dns_records/${identifier}`, {
        json: {
          content,
          name,
          type,
          ttl,
          ...(proxied && { proxied })
        }
      }).json();
      console.log(res);
    }
    catch (error) {
      console.error(error);
    }
  }
}