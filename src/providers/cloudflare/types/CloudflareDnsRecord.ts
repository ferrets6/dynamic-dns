import type { CloudflareResponse } from "./CloudflareApi.js";

/** Every type of DNS records avalaible on Cloudflare. */
export type CloudflareDnsRecordTypes = "A"
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

/** Defining DNS record properties from https://api.cloudflare.com/#dns-records-for-a-zone-properties. */
export interface CloudflareDnsRecord {
  id: string;
  type: CloudflareDnsRecordTypes;
  name: string;

  proxiable: boolean;
  proxied: boolean;

  /**
   * 3600 is default value.
   * 1 is for "Automatic".
   */
  ttl: number;

  content: string;
  data?: {
    [key: string]: string | number;
  }

  zone_id: string;
  zone_name: string;

  created_on: string;
  modified_on: string;

  locked: number;
  meta: {
    auto_added: boolean;
    source: string;
  };
}

/** Documentation: https://api.cloudflare.com/#dns-records-for-a-zone-patch-dns-record */
export interface CloudflareDnsRecordUpdateProps {
  type?: string;
  name?: string;
  content?: string;
  ttl?: number;
  proxied?: boolean;
}

/** Documentation: https://api.cloudflare.com/#dns-records-for-a-zone-patch-dns-record */
export interface CloudflareDnsRecordUpdateResponse extends CloudflareResponse {
  result: CloudflareDnsRecord;
}

/** Documentation: https://api.cloudflare.com/#dns-records-for-a-zone-delete-dns-record */
export interface CloudflareDnsRecordDeleteResponse {
  result: {
    id: string;
  }
}