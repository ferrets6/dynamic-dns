import type { Got } from "got";
import type {
  CloudflareDnsRecords
} from "./types/CloudflareDnsRecord";


class CloudflareApiDnsRecord {
  public rawData: CloudflareDnsRecords;
  private api: Got;

  constructor (api: Got, rawData: CloudflareDnsRecords) {
    /** From constructor of CloudflareApi. */
    this.api = api;

    /** Returned data of a DNS record from Cloudflare API. */
    this.rawData = rawData;
  }

}

export default CloudflareApiDnsRecord;