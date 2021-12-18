export type VercelDnsRecordTypes =
  | "A"
  | "AAAA"
  | "ALIAS"
  | "CAA"
  | "CNAME"
  | "MX"
  | "SRV"
  | "TXT";

export interface VercelDnsRecord {
  id: string;
  ttl: number;
  slug: string;
  name: string;
  value: string;
  type: VercelDnsRecordTypes;
  mxPriority?: number;
  priority?: number;
  creator: string;
  created: number | null;
  updated: number | null;
  createdAt: number | null;
  updatedAt: number | null;
}

/** Parameters of update. */
export interface VercelDnsRecordUpdateProps {
  name?: string;
  value?: string;
  ttl?: number;
}