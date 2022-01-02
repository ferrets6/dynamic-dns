import type { NetlifyDnsZone } from "./NetlifyDnsZone.js";

export interface NetlifyInstanceOptions {
  token: string;
}

export interface NetlifyErrorResponse {
  code: number;
  message: string;
}

/**
 * Parameters of getDnsZones.
 * Documentation: https://open-api.netlify.com/#operation/getDnsZones.
 */
export interface NetlifyApiGetDnsZonesProps {
  account_slug?: string;
}

/** https://open-api.netlify.com/#operation/getDnsZones */
export type NetlifyApiGetDnsZonesResponse = NetlifyDnsZone[];

/** https://open-api.netlify.com/#operation/getDnsZone */
export type NetlifyApiGetDnsZoneFromIdResponse = NetlifyDnsZone;

/** https://open-api.netlify.com/#operation/getDNSForSite */
export type NetlifyApiGetDnsZonesFromSiteIdResponse = NetlifyDnsZone[];