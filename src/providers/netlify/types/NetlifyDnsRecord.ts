export type NetlifyDnsRecordTypes =
  | "A"
  | "AAAA"
  | "MX"
  | "CNAME"
  | "TXT"
  | "SPF"
  | "ALIAS"
  | "SRV"
  | "CAA"
  | "NETLIFY"
  | "NETLIFYv6"
  | "NS";

export interface NetlifyDnsRecord {
  id: string;
  hostname: string;
  type: NetlifyDnsRecordTypes;
  value: string;
  ttl: number;
  priority: number;
  dns_zone_id: string;
  site_id: string;
  flag: number;
  tag: string;
  managed: boolean;
}

/**
 * Parameters of createDnsRecord.
 * Documentation: https://open-api.netlify.com/#operation/createDnsRecord.
 */
export interface NetlifyApiDnsZoneCreateDnsRecordProps {
  type: NetlifyDnsRecordTypes;
  hostname: string;
  value: string;

  /**
   * The amount of time the record is allowed to be cached by a resolver.
   * Optional and defaults to 3600.
   */
  ttl?: number;

  // Only for "MX" type.
  /** The priority of the target host, lower value means more preferred. */
  priority?: number;

  // Only for "SRV" type.
  port?: number;
  weight?: number;
  service?: string;
  protocol?: string;

  // Only for "CAA" type.
  tag?: string;
  flag?: number;
}

/** https://open-api.netlify.com/#operation/createDnsRecord. */
export type NetlifyApiDnsZoneCreateDnsRecordResponse = NetlifyDnsRecord;

/** https://open-api.netlify.com/#operation/getIndividualDnsRecord. */
export type NetlifyApiDnsZoneGetDnsRecordFromIdResponse = NetlifyDnsRecord;

/** https://open-api.netlify.com/#operation/getDnsRecords. */
export type NetlifyApiDnsZoneGetDnsRecordsResponse = NetlifyDnsRecord[];