import { CloudflareApi } from "../../../index.js";
import publicIp from "public-ip";

import parseOptions from "../../utils/parseOptions.js";
import sentenceFromArray from "../../utils/sentenceFromArray.js";

const basicTokenUsage = "dynamic-dns cloudflare --token XXXXXXXXXXXXXX";
const helpMessage = `
Help: Cloudflare Provider - CLI
Usage: ${basicTokenUsage}
Informations about the commands:
  * The "--token" flag is required to authenticate and MUST be defined BEFORE the command name.
  * authKeys aren't currently supported.

Commands:
  * help => Shows this help message.
  * update [ZONE_ID] [DNS_RECORD_ID] => Update a DNS record in a specific zone.
    - [--ip X.X.X.X] => Optional: DNS record IP. Defaults to your public IPv4.
    - [--dns-type A|AAAA] => Optional: DNS record type. Defaults to A (IPv4).
    - [--cloudflare-proxied 0|1] => Optional: Proxy the record with Cloudflare. Defaults to 0 (false). Write 1 to make it true.
  * listZones => Get a list of zones with their identifier.
    - [--page 1] => Optional: Page to fetch. Defaults to 1.
    - [--per-page 20] => Optional: Zones per page. Defaults to 20.
  * listRecords [ZONE_ID] => Get a list of DNS records in a specific zone.
    - [--page 1] => Optional: Page to fetch. Defaults to 1.
    - [--per-page 20] => Optional: Records per page. Defaults to 20.
`;

export default async function handleCommand (args: string[]) {
  // Show help message.
  if (!args[0] || args[0] === "help") return console.info(helpMessage);

  // Verify token.
  const parsedOptions = parseOptions([args[0], args[1]]);
  if (!parsedOptions.token) return console.error(
    "Token not defined !\n"
    + `Usage: ${basicTokenUsage} [command]`
  );

  const api = new CloudflareApi({
    token: parsedOptions.token as string
  });

  const commandName = args[2];
  const commandArguments = args.slice(3);

  // Command handler.
  switch (commandName) {
  case "update": {
    const [zoneId, dnsRecordId] = commandArguments;
    const options = parseOptions(commandArguments.slice(2));

    // Check if ZONE_ID and DNS_RECORD_ID was given.
    if (!zoneId || !dnsRecordId) {
      return console.error(
        "You must give ZONE_ID and then DNS_RECORD_ID in the command.\n"
        + `Usage: ${basicTokenUsage} update ZONE_ID DNS_RECORD_ID`
      );
    }

    /**
     * `--dns-type`: Defaults to A.
     * Only A and AAAA currently supported.
     */
    const dnsType = (options.dnsType as string | undefined) || "A";
    const supportedDnsTypes = ["A", "AAAA"];
    if (!supportedDnsTypes.includes(dnsType)) return console.error(
      `Currently, only ${sentenceFromArray(supportedDnsTypes)} record types are available.`
    );

    /**
     * `--ip`: Defaults to current public IPv4.
     * Using `public-ip` module to get the public IP.
     */
    let ip = options.ip;
    if (!ip && (dnsType === "A" || dnsType === "AAAA")) {
      if (dnsType === "A") ip = await publicIp.v4();
      else if (dnsType === "AAAA") ip = await publicIp.v6();
      else return console.error(
        `Can't get your current public IP for ${dnsType} DNS type.`
      );
    }

    /**
     * `--cloudflare-proxied`: Defaults to 0 (false).
     * Write 1 to pass it as true.
     */
    const cloudflareProxied = options.cloudflareProxied as number || 0;

    const zone = await api.getZoneFromId(zoneId);
    const record = await zone.getRecordFromId(dnsRecordId);

    try {
      const newRecord = await record.update({
        type: dnsType,
        content: ip as string,
        proxied: !! cloudflareProxied
      });

      return console.info(`Update from ${record.rawData.content} to ${newRecord.rawData.content} succeed`);
    }
    catch (e) {
      return console.error("Failed to update. Error thrown:\n", e);
    }
  }
  /** dynamic-dns cloudflare listZones [--page 1] [--per-page 20] */
  case "listZones": {
    const options = parseOptions(commandArguments);
    const page = options.page as number || 1;
    const perPage = options.perPage as number || 20;

    const { resultInfo: {
      page: resultPage,
      count: resultCount,
      per_page: resultPerPage,
      total_count: resultTotalCount,
      total_pages: resultTotalPages
    }, zones } = await api.listZones({
      per_page: perPage,
      page
    });

    // Fix the way they gave the count.
    // Example with 5 per page: write "10/15" instead of "5/15".
    const currentCountState = resultCount + resultPerPage * (resultPage - 1);
    const header = `Listing of ${currentCountState}/${resultTotalCount} zones\n`
      + `Page ${resultPage}/${resultTotalPages} (${perPage} per page)`;

    const message = header + "\n\n"
      + zones.map(({ rawData }) => `* ${rawData.name} (${rawData.id})`)
        .join("\n");

    return console.log(message);
  }
  /** dynamic-dns cloudflare listRecords [ZONE_ID] [--page 1] [--per-page 20] */
  case "listRecords": {
    const [givenZoneId] = commandArguments;
    const options = parseOptions(commandArguments.slice(1));

    // Parameters and default values.
    const page = options.page as number || 1;
    const perPage = options.perPage as number || 20;

    // Fetch the zone's data.
    const zone = await api.getZoneFromId(givenZoneId);
    const {
      name: zoneName,
      id: zoneId
    } = zone.rawData;

    // Fetch the records inside this zone.
    const {
      resultInfo: {
        total_count: resultTotalCount,
        total_pages: resultTotalPages,
        per_page: resultPerPage,
        count: resultCount,
        page: resultPage
      },
      records
    } = await zone.listDnsRecords({
      per_page: perPage,
      page
    });

    // Fix the way they gave the count.
    // Example with 5 per page: write "10/15" instead of "5/15".
    const currentCountState = resultCount + resultPerPage * (resultPage - 1);

    const header =
      `Listing of ${currentCountState}/${resultTotalCount} records of zone "${zoneName}" (${zoneId})\n`
      + `Page ${resultPage}/${resultTotalPages} (${perPage} per page)`;

    const message = header + "\n\n"
      + records.map(({ rawData: record }) => `* [${record.type}] ${record.name} (${record.id})\n  - Content: ${record.content}`)
        .join("\n");

    return console.log(message);
  }
  case "help":
  default:
    return console.info(helpMessage);
  }
}