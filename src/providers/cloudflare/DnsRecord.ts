import type { Got } from "got";
import type {
  CloudflareDnsRecord,

  CloudflareDnsRecordUpdateProps,
  CloudflareDnsRecordUpdateResponse,

  CloudflareDnsRecordDeleteResponse
} from "./types/CloudflareDnsRecord";

import handleError from "./utils/errorHandler";

class CloudflareApiDnsRecord {
  public rawData: CloudflareDnsRecord;
  private api: Got;

  constructor (api: Got, rawData: CloudflareDnsRecord) {
    /** From constructor of CloudflareApi. */
    this.api = api;

    /** Returned data of a DNS record from Cloudflare API. */
    this.rawData = rawData;
  }

  public async update ({
    type,
    name,
    content,
    ttl,
    proxied
  }: CloudflareDnsRecordUpdateProps) {
    try {
      const body = await this.api.patch(`zones/${this.rawData.zone_id}/dns_records/${this.rawData.id}`, {
        json: {
          type,
          name,
          content,
          ttl,
          proxied
        }
      }).json<CloudflareDnsRecordUpdateResponse>();

      // Return the new DNS record.
      return new CloudflareApiDnsRecord(this.api, body.result);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async delete () {
    try {
      const body = await this.api.delete(`zones/${this.rawData.zone_id}/dns_records/${this.rawData.id}`)
        .json<CloudflareDnsRecordDeleteResponse>();

      // A little check.
      if (body.result.id === this.rawData.id) return true;
      return false;
    }
    catch (error) {
      // handleError(error);
      console.log(error);
      throw error;
    }
  }
}

export default CloudflareApiDnsRecord;