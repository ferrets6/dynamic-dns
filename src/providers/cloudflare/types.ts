export type CloudflareInstanceOptions = {
    // API Token
    token?: string;

    // API Key
    authEmail?: string;
    authKey?: string;
}

export type CloudflareUpdateDnsRecordProps = {
  zone_identifier: string;
  identifier: string;

  type: "A" | "AAAA"; // "A"
  name: string; // "example.com"
  content: string; // 127.0.0.1
  ttl?: number; // Default: 3600
  proxied?: boolean;
}

export type CloudflareListZonesProps = {
  name?: string; // A domain name to search.
  page?: number; // Default: 1 ; Current page.
  per_page?: number; // Default: 20 ; Min: 5 ; Max: 50 ; Number of zones per page.

}