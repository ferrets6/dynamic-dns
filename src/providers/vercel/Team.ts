import type {
  TeamLimited,
  VercelRequestsInstanceOptions
} from "./types/VercelApi";

import VercelApiRequests from "./Requests";

class VercelTeamsApi extends VercelApiRequests {
  public rawData: TeamLimited;

  constructor (
    options: VercelRequestsInstanceOptions,
    rawData: TeamLimited
  ) {
    super(options);
    this.api = this.api.extend({
      searchParams: {
        teamId: rawData.id
      }
    });

    // Data of the team.
    this.rawData = rawData;
  }
}

export default VercelTeamsApi;