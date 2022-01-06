import publicIp from "public-ip";

import { NetlifyApi } from "../../../index.js";
import parseOptions from "../../utils/parseOptions.js";
import sentenceFromArray from "../../utils/sentenceFromArray.js";

const basicTokenUsage = "dynamic-dns netlify --token xxxxxxxxxxxxxxxxxxxxxxxx";
const helpMessage = `
Help: Netlify Provider - CLI
Usage: ${basicTokenUsage}
Information about the commands:
  * The "--token" flag is required to authenticate and MUST be defined BEFORE the command name.

Commands:
  * help => Shows this help message.
  * update [ZONE_ID] [DNS_RECORD_ID] => Update a DNS record in a specific zone.
    - [--ip X.X.X.X] => Optional: DNS record IP. Defaults to your public IPv4.
    - [--dns-type A|AAAA] => Optional: DNS record type. Defaults to A (IPv4).
  * listZones => List DNS zones.
    - [--account-slug "myAccountSlug"] => Filter with an account slug.
  * listRecords [ZONE_ID] => List DNS records of a specific zone.
`;

export default async function handleCommand (args: string[]) {
  // Show help message.
  if (!args[0] || args[0] === "help") return console.info(helpMessage);

  // Verify token.
  const parsedOptions = parseOptions([args[0], args[1]]);
  if (!parsedOptions.token) return console.error(
    "API Token (--token) not defined !\n"
    + `Usage: ${basicTokenUsage} [command]`
  );

  const api = new NetlifyApi({
    token:  parsedOptions.token as string
  });

  const commandName = args[2];
  const commandArguments = args.slice(3);

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

    try {
      const zone = await api.getDnsZoneFromId(zoneId);
      const record = await zone.getDnsRecordFromId(dnsRecordId);

      // Delete the record.
      await record.delete();

      // Re-create a new record with updated parameters.
      const newRecord = await zone.createDnsRecord({
        hostname: record.rawData.hostname,
        type: dnsType as "A" | "AAAA",
        ttl: record.rawData.ttl,
        value: ip as string
      });

      return console.info(`Update from ${record.rawData.value} to ${newRecord.rawData.value} succeed`);
    }
    catch (e) {
      return console.error("Failed to update. Error thrown:\n", e);
    }
  }
  /** dynamic-dns netlify --token ... listZones --account-slug "myAccountSlug" */
  case "listZones": {
    const options = parseOptions(commandArguments);

    /**
     * `--account-slug`
     * Filter with an account slug.
     */
    const accountSlug = options.accountSlug as string | undefined;

    const {
      zones,
      resultInfo: {
        count: resultCount
      }
    } = await api.getDnsZones({
      account_slug: accountSlug
    });

    const header = `Listing ${resultCount} zones.\n\n`;
    const content = zones
      .map(({ rawData: zone }) => `* ${zone.name} (${zone.id})`)
      .join("\n");

    return console.log(header + content);
  }
  case "listRecords": {
    const [zoneId] = commandArguments;

    const zone = await api.getDnsZoneFromId(zoneId);
    const {
      records,
      resultInfo: {
        count: resultCount
      }
    } = await zone.getDnsRecords();

    const header = `Listing ${resultCount} records in zone ${zoneId}.\n\n`;
    const content = records
      .map(({ rawData: record }) => `* ${record.hostname} (${record.id})`)
      .join("\n");

    return console.log(header + content);
  }
  default:
    return console.info(helpMessage);
  }
}