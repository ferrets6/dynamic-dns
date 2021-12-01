import got, { Got } from "got";

// export const Endpoints = {
//     base: "",
//     listZones: "zones",
//     listDnsRecords: "zones/:zoneId/dns_records",
//     createDnsRecord: ["POST", "zones/:zoneId/dns_records"],
//     updateDnsRecord: ["PUT", "zones/:zoneId/dns_records/:recordId"]
// };

import { CloudflareInstanceOptions } from "./types";

export const CfBaseEndpoint = "https://api.cloudflare.com/client/v4/";

export class CfRequests {
    private cfRequest: Got;

    constructor (options: CloudflareInstanceOptions) {
        this.cfRequest = got;

        // Authenticate with API Token.
        if (options.token) {
            this.cfRequest = got.extend({
                prefixUrl: CfBaseEndpoint,
                headers: {
                    "Authorization": `Bearer ${options.token}`
                }
            })
        }
        // Authenticate with authKeys
        else if (options.authEmail && options.authKey) {
            this.cfRequest = got.extend({
                prefixUrl: CfBaseEndpoint,
                headers: {
                    "X-Auth-Key": options.authKey,
                    "X-Auth-Email": options.authEmail
                }
            })
        }
        // If we can't authenticate, send error.
        else {
            throw new Error("{token} or {authEmail, authKey} not passed ! Can't login.");
        }
    }

    public async listZones (): Promise<void> {
        try {
            const { body } = await this.cfRequest.get<{
                success: boolean;
            }>("zones");

            console.log(body.success);
        }
        catch (error) {
            console.error("Can't get zones", error);
        }
    }
}