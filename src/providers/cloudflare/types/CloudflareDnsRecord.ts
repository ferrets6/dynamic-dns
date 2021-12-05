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

/** Same as CloudflareDnsRecords but in string format. */
export type CloudflareDnsRecordsString = "A"
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
export type CloudflareDnsRecords = CloudflareDnsRecordA
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