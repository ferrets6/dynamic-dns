import type {
  NetlifyApiGetDnsZonesProps,
  NetlifyApiGetDnsZonesResponse,

  NetlifyApiGetDnsZoneFromIdResponse,

  NetlifyApiGetDnsZonesFromSiteIdResponse,

  NetlifyInstanceOptions
} from "./types/NetlifyApi.js";

import got from "got";
import handleError from "./utils/errorHandler.js";

import NetlifyApiDnsZone from "./DnsZone.js";

export class NetlifyApi {
  private api: typeof got;

  /**
   * Netlify API new instance.
   * @param {NetlifyInstanceOptions} options - Options for the Netlify API
   */
  constructor (options: NetlifyInstanceOptions) {
    if (!options.token) throw Error("[NetlifyApi] token is missing.");

    /** From https://docs.netlify.com/api/get-started/#make-a-request. */
    this.api = got.extend({
      prefixUrl: "https://api.netlify.com/api/v1",
      headers: {
        "Authorization": `Bearer ${options.token}`,
        "User-Agent": "dynamic-dns (vexitofficial@gmail.com)"
      }
    });
  }

  public async getDnsZones ({ account_slug }: NetlifyApiGetDnsZonesProps) {
    try {
      const body = await this.api.get("dns_zones", {
        searchParams: {
          account_slug
        }
      }).json<NetlifyApiGetDnsZonesResponse>();

      return {
        resultInfo: {
          count: body.length
        },
        zones: body.map(zone => new NetlifyApiDnsZone(this.api, zone))
      };
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async getDnsZoneFromId (zone_id: string) {
    try {
      const body = await this.api.get(`dns_zones/${zone_id}`)
        .json<NetlifyApiGetDnsZoneFromIdResponse>();

      return new NetlifyApiDnsZone(this.api, body);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async getDnsZonesFromSiteId (site_id: string) {
    try {
      const body = await this.api.get(`sites/${site_id}/dns`)
        .json<NetlifyApiGetDnsZonesFromSiteIdResponse>();

      return {
        resultInfo: {
          count: body.length
        },
        zones: body.map(zone => new NetlifyApiDnsZone(this.api, zone))
      };
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}