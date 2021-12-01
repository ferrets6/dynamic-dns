import { CloudflareApi } from "../src";

async function updateMyDns (): Promise<void> {
    const api = new CloudflareApi({
        authKey: "",
        authEmail: ""
    });

    await api.getZones();
}


// Update the Cloudflare DNS every 24 hours.
// const interval = 1000 * 60 * 60 * 24;
// setInterval(updateMyDns, interval);
updateMyDns();