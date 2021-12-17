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

/**
 * A limited form of data representing a Team,
 * due to the authentication token missing privileges
 * to read the full Team data.
 */
export interface TeamLimited {
  /** Property indicating that this Team data contains only limited information, due to the authentication token missing privileges to read the full Team data. Re-login with the Team's configured SAML Single Sign-On provider in order to upgrade the authentication token with the necessary privileges. */
  limited: boolean
  /** When "Single Sign-On (SAML)" is configured, this object contains information that allows the client-side to identify whether or not this Team has SAML enforced. */
  saml?: {
    /** Information for the SAML Single Sign-On configuration. */
    connection?: {
      /** The Identity Provider "type", for example Okta. */
      type: string
      /** Current status of the connection. */
      status: string
      /** Current state of the connection. */
      state: string
      /** Timestamp (in milliseconds) of when the configuration was connected. */
      connectedAt: number
    }
    /** When `true`, interactions with the Team **must** be done with an authentication token that has been authenticated with the Team's SAML Single Sign-On provider. */
    enforced: boolean
  }
  /** The Team's unique identifier. */
  id: string
  /** The Team's slug, which is unique across the Vercel platform. */
  slug: string
  /** Name associated with the Team account, or `null` if none has been provided. */
  name: string | null
  /** The ID of the file used as avatar for this Team. */
  avatar: string | null
  membership:
    | {
        confirmed: boolean
        accessRequestedAt?: number
        role: "OWNER" | "MEMBER"
        teamId?: string
        uid: string
        createdAt: number
        created: number
        joinedFrom?: {
          origin:
            | "mail"
            | "link"
            | "import"
            | "teams"
            | "github"
            | "gitlab"
            | "bitbucket"
            | "saml"
            | "dsync"
          commitId?: string
          repoId?: string
          repoPath?: string
          gitUserId?: string | number
          gitUserLogin?: string
          ssoUserId?: string
          ssoConnectedAt?: number
          idpUserId?: string
          dsyncUserId?: string
          dsyncConnectedAt?: number
        }
      }
    | {
        confirmed: boolean
        accessRequestedAt: number
        role: "OWNER" | "MEMBER"
        teamId?: string
        uid: string
        createdAt: number
        created: number
        joinedFrom?: {
          origin:
            | "mail"
            | "link"
            | "import"
            | "teams"
            | "github"
            | "gitlab"
            | "bitbucket"
            | "saml"
            | "dsync"
          commitId?: string
          repoId?: string
          repoPath?: string
          gitUserId?: string | number
          gitUserLogin?: string
          ssoUserId?: string
          ssoConnectedAt?: number
          idpUserId?: string
          dsyncUserId?: string
          dsyncConnectedAt?: number
        }
      }
  /** Will remain undocumented. Remove in v3 API. */
  created: string
  /** UNIX timestamp (in milliseconds) when the Team was created. */
  createdAt: number
}

export interface VercelListTeamsProps {
  until?: number;
  since?: number;
  limit?: number;
}

export interface VercelListTeamsResponse {
  teams: TeamLimited[];
  pagination: Pagination;
}