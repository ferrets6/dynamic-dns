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
  * listZones => Get a list of zones with their identifier.
  * listRecords [ZONE_ID] => Get a list of DNS records in a specific zone.
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

    console.log(zoneId, dnsRecordId, api, commandArguments, dnsType, ip);
    break;
  }
  case "find": {
    return console.log(commandArguments);
  }
  case "help":
  default:
    return console.info(helpMessage);
  }
}