import type { NetlifyDnsRecord } from "./NetlifyDnsRecord";

export interface NetlifyDnsZone {
  id: string;
  name: string;
  supported_record_types: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  records: NetlifyDnsRecord[];
  dns_servers: string[];
  account_id: string;
  site_id: string | null;
  account_slug: string;
  account_name: string;
  domain: string | null;
  ipv6_enabled: boolean;
}