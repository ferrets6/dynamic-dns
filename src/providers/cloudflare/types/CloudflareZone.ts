import type {
  CloudflareDnsRecordTypes,
  CloudflareDnsRecord
} from "./CloudflareDnsRecord.js";

import type {
  CloudflareResponse,
  CloudflareResponseResultInfo
} from "./CloudflareApi.js";

export type CloudflareZoneStatus = "active"
| "pending"
| "initializing"
|  "moved"
|  "deleted"
| "deactivated";

/** Documentation: https://api.cloudflare.com/#zone-properties */
export interface CloudflareZone {
  id: string;
  name: string;
  status: CloudflareZoneStatus;

  /** Is zone using Cloudflare DNS services. */
  paused: boolean;

  /**
   * - `full`: DNS is hosted with Cloudflare.
   * - `partial`: Partner-hosted zone or a CNAME setup.
   */
  type: "full" | "partial";

  /**
   * Interval, in seconds, from when development mode
   * expires (positive integer) or last expired (negative integer)
   * for the domain.
   * Value is `0` when development mode has never been enabled.
   */
  development_mode: number;

  /** Name servers assigned by Cloudflare, if zone is using Cloudflare DNS. */
  name_servers: string[];
  /** Name servers before moving to Cloudflare. */
  original_name_servers: string[];
  /** Registrar for the domain at the time of switching to Cloudflare. */
  original_registrar: string | null;
  /** DNS host at the time of switching to Cloudflare. */
  original_dnshost: string | null;

  activated_on: string;
  modified_on: string;
  created_on: string;

  /** Available permissions on the zone for the current user requesting the item. */
  permissions: string[];

  /** Information about the owner of the zone. */
  owner: {
    id: string;
    type: "user" | "organization";

    /** Available if `type === "user"`. */
    email: string;
    /** Available if `type === "organization"`. */
    name: string;
  };

  /** Information about the account the zone belongs to. */
  account: {
    id: string;
    name: string;
  };
}

/**
 * Function: zone.listDnsRecords
 * API: GET zones/:zone_identifier/dns_records
 * Documentation: https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
 */
export type CloudflareZoneListDnsRecordsProps = {
  /** Whether to match all search requirements or at least one (any). */
  match?: "any" | "all";

  /** Field to order records by. */
  order?: "type" | "name" | "content" | "ttl" | "proxied";

  /** DNS record name. */
  name?: string;
  /** DNS record content. */
  content?: string;
  /** DNS record type. */
  type?: CloudflareDnsRecordTypes;
  /** DNS record proxied status. */
  proxied?: boolean;

  /** Page number of paginated results. Default and minimum value is 1. */
  page?: number;
  /** Number of DNS records per page. Default is 20. Minimum is 5 and maximum is 100. */
  per_page?: number;
  /** Direction to order domains */
  direction?: "asc" | "desc";
}

/** Response of a zone's DNS records. */
export interface CloudflareZoneListDnsRecordsResponse extends CloudflareResponse {
  result: CloudflareDnsRecord[];
  result_info: CloudflareResponseResultInfo;
}

/**
 * Function: zone.createDnsRecord
 * API: POST zones/:zone_identifier/dns_records
 * Documentation: https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
 */
export type CloudflareZoneCreateDnsRecordProps = {
  /** DNS record type. */
  type: CloudflareDnsRecordTypes;
  /** DNS record name. */
  name: string;
  /** DNS record content. */
  content: string;

  /**
   * Time to live, in seconds, of the DNS record.
   * Must be between `60` and `86400`, or `1` for "automatic".
   * Default value is `1` (automatic).
   */
  ttl?: number;

  /**
   * Required for MX, SRV and URI records; unused by other record types.
   * Records with lower priorities are preferred.
   */
  priority?: number;
  /** Whether the record is receiving the performance and security benefits of Cloudflare. */
  proxied?: boolean;
}

export interface CloudflareZoneCreateDnsRecordResponse extends CloudflareResponse {
  result: CloudflareDnsRecord;
}

export interface CloudflareZoneGetRecordFromIdResponse extends CloudflareResponse {
  result: CloudflareDnsRecord;
}