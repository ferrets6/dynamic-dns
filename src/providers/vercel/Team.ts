import type {
  VercelTeam,
  VercelRequestsInstanceOptions
} from "./types/VercelApi.js";

import VercelApiRequests from "./Requests.js";

class VercelTeamsApi extends VercelApiRequests {
  public rawData: VercelTeam;

  constructor (
    options: VercelRequestsInstanceOptions,
    rawData: VercelTeam
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