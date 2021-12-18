import type { Got } from "got";
import type { VercelDomain } from "./types/VercelDomain";

class VercelDomainsApi {
  private api: Got;
  public rawData: VercelDomain;

  constructor (api: Got, rawData: VercelDomain) {
    this.api = api;
    this.rawData = rawData;
  }
}

export default VercelDomainsApi;