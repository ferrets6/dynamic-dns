import type { Got } from "got";
import type { NetlifyDnsRecord } from "./types/NetlifyDnsRecord.js";

import handleError from "./utils/errorHandler.js";

class NetlifyApiDnsRecord {
  private api: Got;
  public rawData: NetlifyDnsRecord;

  constructor (api: Got, rawData: NetlifyDnsRecord) {
    this.api = api;
    this.rawData = rawData;
  }

  /** Delete this record from the zone. */
  public async delete () {
    try {
      const url = `dns_zones/${this.rawData.dns_zone_id}/dns_records/${this.rawData.id}`;
      const { statusCode } = await this.api.delete(url);

      if (statusCode === 204) return true;
      return false;
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}

export default NetlifyApiDnsRecord;