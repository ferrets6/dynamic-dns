export interface VercelInstanceOptions {
  token: string;
}

export interface VercelRequestsInstanceOptions extends VercelInstanceOptions {
  teamId?: string;
}

export interface VercelErrorResponse {
  error: {
    code: string;
    message: string;
  }
}

/**
 * This object contains information related to the pagination of the current request,
 * including the necessary parameters to get the next or previous page of data.
 */
export interface VercelResponsePagination {
  /** Amount of items in the current page. */
  count: number;
  /** Timestamp that must be used to request the next page. */
  next: number | null;
  /** Timestamp that must be used to request the previous page. */
  prev: number | null;
}

/**
 * A limited form of data representing a Team.
 * Documentation: https://vercel.com/docs/rest-api#interfaces/team-limited.
 */
export interface VercelTeam {
  /** The Team's unique identifier. */
  id: string;
  /** The Team's slug, which is unique across the Vercel platform. */
  slug: string;
  /** Name associated with the Team account, or `null` if none has been provided. */
  name: string | null;
  /** The ID of the file used as avatar for this Team. */
  avatar: string | null;
  /** Will remain undocumented. Remove in v3 API. */
  created: string;
  /** UNIX timestamp (in milliseconds) when the Team was created. */
  createdAt: number;
}

/**
 * Parameters of listTeams.
 * Documentation: https://vercel.com/docs/rest-api#endpoints/teams/list-all-teams.
 */
export interface VercelListTeamsProps {
  until?: number;
  since?: number;
  limit?: number;
}

/**
 * Response of listTeams.
 * Documentation: https://vercel.com/docs/rest-api#endpoints/teams/list-all-teams.
 */
export interface VercelListTeamsResponse {
  teams: VercelTeam[];
  pagination: VercelResponsePagination;
}