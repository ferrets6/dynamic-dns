import type { VercelInstanceOptions, VercelListTeamsProps, VercelListTeamsResponse } from "./types/VercelApi";

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

    // Accessing when creating VercelTeamsApi classes.
    this.options = options;
  }

  /**
   * Get a paginated list of all the Teams the authenticated User is a member of.
   * https://vercel.com/docs/rest-api#endpoints/teams/get-a-team
   */
  public async listTeams ({
    limit,
    since,
    until
  }: VercelListTeamsProps) {
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
}