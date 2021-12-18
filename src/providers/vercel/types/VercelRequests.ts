import type { VercelResponsePagination } from "./VercelApi";
import type { VercelDomain } from "./VercelDomain";

/**
 * Parameters of listDomains.
 * Documentation: https://vercel.com/docs/rest-api#endpoints/domains/list-all-the-domains.
 */
export interface VercelRequestsDomainsProps {
  limit?: number;
  since?: number;
  until?: number;
}

/**
 * Response of listDomains.
 * Documentation: https://vercel.com/docs/rest-api#endpoints/domains/list-all-the-domains.
 */
export interface VercelRequestsDomainsResponse {
  domains: VercelDomain[]
  pagination: VercelResponsePagination;
}

/**
 * Response of getDomainFromName.
 * Documentation: https://vercel.com/docs/rest-api#endpoints/domains/get-information-for-a-single-domain.
 */
export interface VercelRequestsGetDomainFromNameResponse {
  domain: VercelDomain;
}