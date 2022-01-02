import type {
  VercelRequestsInstanceOptions,
  VercelApiBrowseProps
} from "./types/VercelApi.js";

import type {
  VercelRequestsDomainsResponse,
  VercelRequestsGetDomainFromNameResponse
} from "./types/VercelRequests.js";

import got from "got";
import handleError from "./utils/errorHandler.js";

import VercelDomainsApi from "./Domain.js";

class VercelApiRequests {
  protected api: typeof got;

  constructor (options: VercelRequestsInstanceOptions) {
    if (!options.token) throw new Error("[VercelApi] `token` property is missing !");
    this.api = got.extend({
      prefixUrl: "https://api.vercel.com",
      headers: {
        "Authorization": `Bearer ${options.token}`
      }
    });
  }

  /**
   * Retrieves a list of domains registered for the authenticating user.
   * By default it returns the last 20 domains if no limit is provided.
   */
  public async listDomains ({
    limit,
    since,
    until
  }: VercelApiBrowseProps) {
    try {
      const body = await this.api.get("v5/domains", {
        searchParams: {
          limit,
          since,
          until
        }
      }).json<VercelRequestsDomainsResponse>();

      return {
        resultInfo: body.pagination,
        domains: body.domains.map(domain => new VercelDomainsApi(this.api, domain))
      };
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  /** Get information for a single domain in an account or team. */
  public async getDomainFromName (domainName: string) {
    try {
      const body = await this.api.get(`v5/domains/${domainName}`)
        .json<VercelRequestsGetDomainFromNameResponse>();

      return new VercelDomainsApi(this.api, body.domain);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}

export default VercelApiRequests;