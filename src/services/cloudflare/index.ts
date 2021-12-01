import { CloudflareInstanceOptions } from "./types";
import { CfRequests } from "./requests";

export class CloudflareApi {
    private requests: CfRequests;

    /**
     * Cloudflare API new instance.
     * @param {CloudflareInstanceOptions} options - Options for the Cloudflare API
     */
    constructor (options: CloudflareInstanceOptions) {
        this.requests = new CfRequests(options);
    }

    async getZones (): Promise<void> {
        // TO-DO: Cloudflare GET /zones
        // const { data } = await CfRequests.listZones();

        await this.requests.listZones();
    }
}