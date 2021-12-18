import type { Got } from "got";
import type {
  VercelDnsRecord,
  VercelDnsRecordUpdateProps
} from "./types/VercelDnsRecord";
import type { VercelDomain } from "./types/VercelDomain";

import handleError from "./utils/errorHandler";

class VercelDnsRecordsApi {
  private api: Got;
  public rawData: VercelDnsRecord;
  public domainRawData: VercelDomain;

  constructor (
    api: Got,
    rawData: VercelDnsRecord,
    domainRawData: VercelDomain
  ) {
    this.api = api;
    this.rawData = rawData;
    this.domainRawData = domainRawData;
  }

  /** Update this DNS record. */
  public async update ({
    name = this.rawData.name,
    value = this.rawData.value,
    ttl = this.rawData.ttl
  }: VercelDnsRecordUpdateProps) {
    try {
      const url = `v4/domains/records/${this.rawData.id}`;
      const body = await this.api.patch(url, {
        json: {
          name,
          value,
          ttl
        }
      }).json<VercelDnsRecord>();

      return new VercelDnsRecordsApi(this.api, body, this.domainRawData);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  /** Removes an existing DNS record from a domain name. */
  public async delete () {
    try {
      const url = `v4/domains/${this.domainRawData.name}/records/${this.rawData.id}`;
      const { statusCode } = await this.api.delete(url);

      if (statusCode === 200) return true;
      return false;
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}

export default VercelDnsRecordsApi;