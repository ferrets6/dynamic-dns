import type { Got } from "got";
import type { NetlifyDnsZone } from "./types/NetlifyDnsZone";
import type {
  NetlifyApiDnsZoneCreateDnsRecordProps,
  NetlifyApiDnsZoneCreateDnsRecordResponse,

  NetlifyApiDnsZoneGetDnsRecordsResponse,

  NetlifyApiDnsZoneGetDnsRecordFromIdResponse
} from "./types/NetlifyDnsRecord";

import NetlifyApiDnsRecord from "./DnsRecord";
import handleError from "./utils/errorHandler";

class NetlifyApiDnsZone {
  private api: Got;
  public rawData: NetlifyDnsZone;

  constructor (api: Got, rawData: NetlifyDnsZone) {
    this.api = api;
    this.rawData = rawData;
  }

  /** List all the DNS records of this zone. */
  public async getDnsRecords () {
    const body = await this.api.get(`dns_zones/${this.rawData.id}/dns_records`)
      .json<NetlifyApiDnsZoneGetDnsRecordsResponse>();

    return {
      resultInfo: {
        count: body.length
      },
      records: body.map(record => new NetlifyApiDnsRecord(this.api, record))
    };
  }

  /** Create a DNS record inside this zone. */
  public async createDnsRecord ({
    type,
    flag,
    hostname,
    port,
    priority,
    tag,
    ttl, // Defaults to 3600.
    value,
    weight,
    protocol,
    service
  }: NetlifyApiDnsZoneCreateDnsRecordProps) {
    if (type === "MX") {
      if (!priority)
        throw Error("You're creating a MX record, so you need to add the `priority` property.");
    }

    if (type === "CAA") {
      if (!flag || !tag)
        throw Error("You're creating a CAA record, so you need to add the `flag` and `tag` properties.");
    }

    if (type === "SRV") {
      if (!port || !priority || !protocol || !service || !weight)
        throw Error("You're creating a SRV record, so you need to add the following properties: `port`, `priority`, `protocol`, `service` and `weight`.");
    }

    try {
      const url = `dns_zones/${this.rawData.id}/dns_records`;
      const body = await this.api.post(url, {
        json: {
          type,
          flag,
          hostname,
          port,
          priority,
          tag,
          ttl,
          value,
          weight,
          protocol,
          service
        }
      }).json<NetlifyApiDnsZoneCreateDnsRecordResponse>();

      return new NetlifyApiDnsRecord(this.api, body);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async getDnsRecordFromId (recordId: string) {
    try {
      const url = `dns_zones/${this.rawData.id}/dns_records/${recordId}`;
      const body = await this.api.get(url).json<NetlifyApiDnsZoneGetDnsRecordFromIdResponse>();

      return new NetlifyApiDnsRecord(this.api, body);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  /** Delete this DNS zone. */
  public async delete () {
    try {
      const { statusCode } = await this.api.delete(`dns_zones/${this.rawData.id}`);

      if (statusCode === 204) return true;
      return false;
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}

export default NetlifyApiDnsZone;