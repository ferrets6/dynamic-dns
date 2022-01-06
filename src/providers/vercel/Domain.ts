import type { VercelApiBrowseProps } from "./types/VercelApi.js";
import type { VercelDnsRecord } from "./types/VercelDnsRecord.js";
import type { Got } from "got";
import type {
  VercelDomain,
  VercelDomainCreateDnsRecordProps,
  VercelDomainListDnsRecordsResponse
} from "./types/VercelDomain.js";

import VercelDnsRecordsApi from "./DnsRecord.js";
import handleError from "./utils/errorHandler.js";

class VercelDomainsApi {
  private api: Got;
  public rawData: VercelDomain;

  constructor (api: Got, rawData: VercelDomain) {
    this.api = api;
    this.rawData = rawData;
  }

  public async listDnsRecords ({
    limit,
    since,
    until
  }: VercelApiBrowseProps) {
    try {
      const body = await this.api.get(`v4/domains/${this.rawData.name}/records`, {
        searchParams: {
          limit,
          since,
          until
        }
      }).json<VercelDomainListDnsRecordsResponse>();

      return {
        records: body.records.map(record => new VercelDnsRecordsApi(
          this.api,
          record,
          this.rawData
        )),
        resultInfo: body.pagination
      };
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async createDnsRecord ({
    type,
    name,
    value,
    ttl = 60 // Default value: 60s.
  }: VercelDomainCreateDnsRecordProps) {
    if (ttl < 60) throw Error("[VercelApi] `ttl` can't be under 60.");
    if (ttl > 2147483647) throw Error("[VercelApi] `ttl` can't be upper 2147483647.");

    try {
      const { uid } = await this.api.post(`v2/domains/${this.rawData.name}/records`, {
        json: {
          type,
          name,
          value,
          ttl
        }
      }).json<{
        /** The id of the newly created DNS record. */
        uid: string;
      }>();

      return {
        success: true,
        uid
      };
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async delete () {
    try {
      const { statusCode } = await this.api.delete(`v6/domains/${this.rawData.name}`);

      if (statusCode === 200) return true;
      return false;
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async updateRecordFromId (recordId: string, options: VercelDomainCreateDnsRecordProps) {
    try {
      const record = await this.api.patch(`v4/domains/records/${recordId}`, {
        json: options
      }).json<VercelDnsRecord>();

      return new VercelDnsRecordsApi(this.api, record, this.rawData);
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }

  public async deleteRecordFromId (recordId: string) {
    try {
      const { statusCode } = await this.api.delete(`v2/domains/${this.rawData.name}/records/${recordId}`);

      if (statusCode === 200) return true;
      return false;
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}

export default VercelDomainsApi;