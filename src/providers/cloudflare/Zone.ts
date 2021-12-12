import type { Got } from "got";
import type {
  CloudflareResponse
} from "./types/CloudflareApi";
import type {
  CloudflareZone,

  // this.createDnsRecord
  CloudflareZoneCreateDnsRecordProps,
  CloudflareZoneCreateDnsRecordResponse,

  // this.listDnsRecords
  CloudflareZoneListDnsRecordsProps,
  CloudflareZoneListDnsRecordsResponse
} from "./types/CloudflareZone";

import CloudflareApiDnsRecord from "./DnsRecord";
import handleError from "./utils/errorHandler";

class CloudflareApiZone {
  public rawData: CloudflareZone;
  private api: Got;

  constructor (api: Got, rawData: CloudflareZone) {
    /** From constructor of CloudflareApi. */
    this.api = api;

    /** Returned data of a zone from Cloudflare API. */
    this.rawData = rawData;
  }

  public async listDnsRecords ({
    match = "all",
    content,
    name,
    order,
    page = 1,
    per_page = 20,
    direction,
    proxied,
    type
  }: CloudflareZoneListDnsRecordsProps) {
    if (page < 1) throw Error("Page can't be under 1 as it's the minimum value.");
    if (per_page > 100) throw Error("You can't show more than 100 results per page.");
    if (per_page < 5) throw Error("You can't show less than 5 results per page.");

    try {
      const body = await this.api.get(`zones/${this.rawData.id}/dns_records`, {
        searchParams: {
          match,
          content,
          name,
          order,
          page,
          per_page,
          direction,
          proxied,
          type
        }
      }).json<CloudflareZoneListDnsRecordsResponse>();

      return body.result.map(record => new CloudflareApiDnsRecord(this.api, record));
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  /** Create a DNS record inside this zone. */
  public async createDnsRecord ({
    type,
    name,
    content,
    ttl = 1,
    priority,
    proxied
  }: CloudflareZoneCreateDnsRecordProps) {
    if (!type || !name || !content) {
      throw Error("It's required to set `type`, `name` and `content properties.");
    }

    // Check `priority`.
    if (type === "MX" || type === "SRV" || type === "URI") {
      if (!priority) throw Error("Property `priority` is required for MX, SRV and URI records.");
    }

    // Check `ttl`.
    if (ttl < 60 && ttl !== 1) throw Error("TTL can't be under 60s. Otherwise, you can set it to 1 to set it to 'automatic'.");
    if (ttl > 86400) throw Error("TTL can't be more than 86400s");

    try {
      const body = await this.api.post(`zones/${this.rawData.id}/dns_records`, {
        json: {
          type,
          name,
          content,
          ttl,
          priority,
          proxied
        }
      }).json<CloudflareZoneCreateDnsRecordResponse>();

      return new CloudflareApiDnsRecord(this.api, body.result);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async purgeAllFiles () {
    try {
      const body = await this.api.post(`zones/${this.rawData.id}/purge_cache`, {
        json: {
          purge_everything: true
        }
      }).json<CloudflareResponse>();

      return body.success;
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}


export default CloudflareApiZone;