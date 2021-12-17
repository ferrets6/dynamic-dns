export interface VercelInstanceOptions {
  token: string;
}

export interface VercelRequestsInstanceOptions extends VercelInstanceOptions {
  teamId?: string;
}

/**
 * This object contains information related to the pagination of the current request,
 * including the necessary parameters to get the next or
 * previous page of data.
 */
export interface Pagination {
  /** Amount of items in the current page. */
  count: number;
  /** Timestamp that must be used to request the next page. */
  next: number | null;
  /** Timestamp that must be used to request the previous page. */
  prev: number | null;
}

export interface VercelListTeamsProps {
  until?: number;
  since?: number;
  limit?: number;
}