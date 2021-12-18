import type {
  VercelInstanceOptions,
  VercelApiBrowseProps,

  VercelListTeamsResponse
} from "./types/VercelApi";

import handleError from "./utils/errorHandler";
import VercelApiRequests from "./Requests";
import VercelTeamsApi from "./Team";

export class VercelApi extends VercelApiRequests {
  private options: VercelInstanceOptions;

  /**
   * Vercel API new instance.
   * @param {VercelInstanceOptions} options - Options for the Vercel API
   */
  constructor (options: VercelInstanceOptions) {
    super(options);

    // Used when instancing VercelTeamsApi class.
    this.options = options;
  }

  /**
   * Get a paginated list of all the Teams the authenticated User is a member of.
   * Documentation: https://vercel.com/docs/rest-api#endpoints/teams/list-all-teams.
   */
  public async listTeams ({
    limit,
    since,
    until
  }: VercelApiBrowseProps) {
    try {
      const body = await this.api.get("v2/teams", {
        searchParams: {
          limit,
          since,
          until
        }
      }).json<VercelListTeamsResponse>();

      return {
        resultInfo: body.pagination,
        teams: body.teams.map(team => new VercelTeamsApi(
          this.options,
          team
        ))
      };
    }
    catch (error) {
      handleError(error);
      throw error;
    }
  }
}