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

type CloudflareZoneStatus = "active"
  | "pending"
  | "initializing"
  |  "moved"
  |  "deleted"
  | "deactivated";

/** Defining DNS record properties from https://api.cloudflare.com/#dns-records-for-a-zone-properties. */
type CloudflareDnsRecord = {
  id: string;
  name: string;
  proxiable: boolean;
  proxied: boolean;
  /** 3600 is default value. 1 is for "Automatic". */
  ttl: number;
  locked: number;
  zone_id: string;
  zone_name: string;
  created_on: string;
  modified_on: string;
  meta: {
    auto_added: boolean;
    source: string;
  };
}

export interface CloudflareDnsRecordA extends CloudflareDnsRecord {
  type: "A";
  content: string;
}

export interface CloudflareDnsRecordAAAA extends CloudflareDnsRecord {
  type: "AAAA";
  content: string;
}

export interface CloudflareDnsRecordCNAME extends CloudflareDnsRecord {
  type: "CNAME";
  content: string;
}

export interface CloudflareDnsRecordHTTPS extends CloudflareDnsRecord {
  type: "HTTPS";
  content: string;

  data: {
    /** Minimum value: 0 ; Maximum value: 65535 */
    priority: number;
    target: string;
    value: string;
  }
}

export interface CloudflareDnsRecordNS extends CloudflareDnsRecord {
  type: "NS";
  content: string;
}

export interface CloudflareDnsRecordMX extends CloudflareDnsRecord {
  type: "MX";
  content: string;
}

export interface CloudflareDnsRecordTXT extends CloudflareDnsRecord {
  type: "TXT";
  content: string;
}

export interface CloudflareDnsRecordLOC extends CloudflareDnsRecord {
  type: "LOC";
  content: string;

  /** Components of a LOC record. */
  data: {
    size: number;
    altitude: number;
    long_degrees: number;
    lat_degrees: number;
    precision_horz: number;
    precision_vert: number;
    long_direction: "E" | "W";
    lat_direction: "N" | "S";
    long_minutes: number;
    long_seconds: number;
    lat_minutes: number;
    lat_seconds: number;
  }
}

export interface CloudflareDnsRecordSRV extends CloudflareDnsRecord {
  type: "SRV";
  content: string;

  data: {
    service: string;
    proto: string;
    name: string;
    priority: number;
    weight: number;
    port: number;
    target: string;
  }
}

export interface CloudflareDnsRecordCERT extends CloudflareDnsRecord {
  type: "CERT";
  content?: string;

  data: {
    type: number;
    key_tag: number;
    algorithm: number;
    certificate: string;
  };
}

export interface CloudflareDnsRecordDNSKEY extends CloudflareDnsRecord {
  type: "DNSKEY";
  content?: string;

  data: {
    flags: number;
    protocol: number;
    algorithm: number;
    public_key: string;
  };
}

export interface CloudflareDnsRecordDS extends CloudflareDnsRecord {
  type: "DS";
  content?: string;

  data: {
    key_tag: number;
    algorithm: number;
    digest_type: number;
    digest: string;
  };
}

export interface CloudflareDnsRecordNAPTR extends CloudflareDnsRecord {
  type: "NAPTR";
  content?: string;

  data: {
    order: number;
    preference: number;
    flags: string;
    service: string;
    regex: string;
    replacement: string;
  };
}

export interface CloudflareDnsRecordSMIMEA extends CloudflareDnsRecord {
  type: "SMIMEA";
  content?: string;

  data: {
    usage: number;
    selector: number;
    matching_type: number;
    certificate: string;
  };
}

export interface CloudflareDnsRecordSSHFP extends CloudflareDnsRecord {
  type: "SSHFP";
  content?: string;

  data: {
    algorithm: number;
    type: number;
    fingerprint: string;
  };
}

export interface CloudflareDnsRecordSVCB extends CloudflareDnsRecord {
  type: "SVCB";
  content?: string;

  data: {
    priority: number;
    target: string;
    value: string;
  };
}

export interface CloudflareDnsRecordTLSA extends CloudflareDnsRecord {
  type: "TLSA";
  content?: string;

  data: {
    usage: number;
    selector: number;
    matching_type: number;
    certificate: string;
  };
}

export interface CloudflareDnsRecordURI extends CloudflareDnsRecord {
  type: "URI";
  content?: string;

  data: {
    weight: number;
    content: string;
  };
}

/** Same as CloudflareDnsRecordTypes but in string format. */
export type CloudflareDnsRecordTypesString = "A"
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

/** Strongly typing all the DNS record types. */
export type CloudflareDnsRecordTypes = CloudflareDnsRecordA
  | CloudflareDnsRecordAAAA
  | CloudflareDnsRecordCNAME
  | CloudflareDnsRecordHTTPS
  | CloudflareDnsRecordNS
  | CloudflareDnsRecordMX
  | CloudflareDnsRecordTXT
  | CloudflareDnsRecordLOC
  | CloudflareDnsRecordSRV
  | CloudflareDnsRecordCERT
  | CloudflareDnsRecordDNSKEY
  | CloudflareDnsRecordDS
  | CloudflareDnsRecordNAPTR
  | CloudflareDnsRecordSMIMEA
  | CloudflareDnsRecordSSHFP
  | CloudflareDnsRecordSVCB
  | CloudflareDnsRecordTLSA
  | CloudflareDnsRecordURI;

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

/**
 * Defining zone properties from https://api.cloudflare.com/#zone-properties.
 * `plan`, `meta`, `pending-plan` aren't typed because unnecessary here.
 */
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

    /** Information about the account the zone belongs to. */
    account: {
      id: string;
      name: string;
    };
  }[];
  result_info: CloudflareResponseResultInfo;
}

/**
 * Function: this.api.listZoneDnsRecords();
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
  type?: CloudflareDnsRecordTypesString;
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
export interface CloudflareListZoneDnsRecordsResponse extends CloudflareResponse {
  result: CloudflareDnsRecordTypes[];
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