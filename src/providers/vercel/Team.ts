import type { VercelRequestsInstanceOptions } from "./types/VercelApi";
import VercelApiRequests from "./Requests";

class VercelTeamsApi extends VercelApiRequests {
  public rawData: Record<string, unknown>;

  constructor (
    options: VercelRequestsInstanceOptions,
    rawData: Record<string, unknown>
  ) {
    super(options);
    this.api = this.api.extend({
      searchParams: {
        teamId: "1"
      }
    });

    // Data of the team.
    this.rawData = rawData;
  }
}

export default VercelTeamsApi;