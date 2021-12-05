import type {
  CloudflareZone,
  CloudflareZoneStatus
} from "./CloudflareZone";

export type CloudflareInstanceOptions = {
  // API Token
  token?: string;

  // API Key
  authEmail?: string;
  authKey?: string;
}

/** Documentation: https://api.cloudflare.com/#getting-started-responses */
export interface CloudflareResponse {
  success: boolean;
  messages: string[];

  /** Only available if (success === false). */
  errors: {
    code: number;
    message: string;
  }[];
}

/** Available when `result` property is an Array. */
export interface CloudflareResponseResultInfo {
  page: number;
  per_page: number;
  count: number;
  total_count: number;
  total_pages: number;
}

/**
 * API: GET zones
 * Documentation: https://api.cloudflare.com/#zone-list-zones
 */
export type CloudflareListZonesProps = {
  /** Page number of paginated results. Default and minimum value is 1. */
  page?: number;
  /** Number of zones per page. Default is 20, minimum is 5 and maximum is 50. */
  per_page?: number;

  name?: string;
  accountId?: string;
  accountName?: string;
  status?: CloudflareZoneStatus;

  /** Whether to match all search requirements or at least one (any). */
  match?: "all" | "any";
  /** Field to order zones by. */
  order?: "name" | "status" | "account.id" | "account.name";
  /** Direction to order zones. */
  direction?: "asc" | "desc";
}

/** Documentation: https://api.cloudflare.com/#zone-list-zones */
export interface CloudflareListZonesResponse extends CloudflareResponse {
  result: CloudflareZone[];
  result_info: CloudflareResponseResultInfo;
}

/** Documentation: https://api.cloudflare.com/#zone-zone-details. */
export interface CloudflareGetZoneFromIdResponse extends CloudflareResponse {
  result: CloudflareZone;
}