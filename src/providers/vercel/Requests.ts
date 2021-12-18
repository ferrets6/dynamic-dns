import type { VercelRequestsInstanceOptions } from "./types/VercelApi";

import type {
  VercelRequestsDomainsProps,
  VercelRequestsDomainsResponse
} from "./types/VercelRequests";

import got from "got";

class VercelApiRequests {
  protected api: typeof got;

  constructor (options: VercelRequestsInstanceOptions) {
    if (!options.token) throw new Error("VercelApi: `token` property is missing !");
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
  }: VercelRequestsDomainsProps) {
    const body = await this.api.get("v5/domains", {
      searchParams: {
        limit,
        since,
        until
      }
    }).json<VercelRequestsDomainsResponse>();
    return body;
  }
}

export default VercelApiRequests;