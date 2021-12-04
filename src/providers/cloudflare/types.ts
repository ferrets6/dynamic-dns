export type CloudflareInstanceOptions = {
    // API Token
    token?: string;

    // API Key
    authEmail?: string;
    authKey?: string;
}

/**
 * Documentation: https://api.cloudflare.com/#getting-started-responses
 */
interface CloudflareResponse {
  success: boolean;
  messages: string[];

  /** Only available if (success === false). */
  errors: {
    code: number;
    message: string;
  }[];
}

/** Found on responses when you browse records/zones. */
type CloudflareResponseResultInfo = {
  page: number;
  per_page: number;
  count: number;
  total_count: number;
  total_pages: number;
}

/** Strongly typing all the DNS record types. */
type CloudflareDnsRecordTypes =
  "A"
  | "AAAA"
  | "CNAME"
  | "HTTPS"
  | "TXT"
  | "SRV"
  | "LOC"
  | "MX"
  | "NS"
  | "CERT"
  | "DNSKEY"
  | "DS"
  | "NAPTR"
  | "SMIMEA"
  | "SSHFP"
  | "SVCB"
  | "TLSA"
  | "URI";

type CloudflareZoneStatus = "active" | "pending" | "initializing" |  "moved" |  "deleted" | "deactivated";

/**
 * Function: this.api.listZones();
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

/** Defining zone property from https://api.cloudflare.com/#zone-properties. */
export interface CloudflareListZonesResponse extends CloudflareResponse {
  result: {
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
      email?: string;
      /** Available if `type === "organization"`. */
      name?: string;
    };

    meta: {
      step: number;
      wildcard_proxiable: false;
      custom_certificate_quota: number;
      page_rule_quota: number;
      phishing_detected: boolean;
      multiple_railguns_allowed: boolean;
    };

    /** Information about the account the zone belongs to. */
    account: {
      id: string;
      name: string;
    };
  }[];
  result_info: CloudflareResponseResultInfo;
}

/**
 * Function: this.api.listZones();
 * API: GET zones/:zone_identifier/dns_records
 * Documentation: https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
 */
export type CloudflareListZoneDnsRecordsProps = {
  zone_identifier: string;

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

// Response.
export interface CloudflareListZoneDnsRecordsResponse extends CloudflareResponse {
  result: {
    id: string;
    zone_id: string;
    zone_name: string;
    name: string;
    type: CloudflareDnsRecordTypes;
    content: string;
    proxiable: boolean;
    proxied: boolean;
    ttl: number; // 1 for Automatic ; 3600 is Default.
    locked: boolean;
    created_on: string;
    modified_on: string;
    meta: {
      auto_added: boolean;
      managed_by_apps: boolean;
      managed_by_argo_tunnel: boolean;
      source: string;
    };
  }[];
  result_info: CloudflareResponseResultInfo;
}

// TODO
export type CloudflareUpdateDnsRecordProps = {
  zone_identifier: string;
  identifier: string;

  type: CloudflareDnsRecordTypes;
  name: string;
  content: string;

  /** 1 is for "Automatic". Default is 3600. */
  ttl?: number;

  /** Proxied by Cloudflare services. */
  proxied?: boolean;
}