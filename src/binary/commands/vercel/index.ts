import publicIp from "public-ip";

import { VercelApi } from "../../../index.js";
import parseOptions from "../../utils/parseOptions.js";
import VercelTeamsApi from "../../../providers/vercel/Team.js";
import sentenceFromArray from "../../utils/sentenceFromArray.js";

const basicTokenUsage = "dynamic-dns vercel --token XXXXXXXXXXXXXX";
const vercelTeamOptionHelp = "[--team-id XXXXXXXXX] => Optional: Perform the request in a Vercel Team.";
const helpMessage = `
Help: Vercel Provider - CLI
Usage: ${basicTokenUsage}
Information about the commands:
  * The "--token" flag is required to authenticate and MUST be defined BEFORE the command name.

Commands:
  * help => Shows this help message.
  * update [DOMAIN_NAME] [DNS_RECORD_ID] => Update a DNS record of a specific domain.
    - [--ip X.X.X.X] => Optional: DNS record IP. Defaults to your public IPv4.
    - [--dns-type A|AAAA] => Optional: DNS record type. Defaults to A (IPv4).
    - ${vercelTeamOptionHelp}
  * listDomains => Get a list of domains.
    - [--limit 20] => Optional: Set a limit to the list. Defaults to 20.
    - ${vercelTeamOptionHelp}
  * listRecords [DOMAIN_NAME] => Get a list of DNS records of a specific domain.
    - [--limit 20] => Optional: Set a limit to the list. Defaults to 20.
    - ${vercelTeamOptionHelp}
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

  const vercel = new VercelApi({
    token: parsedOptions.token as string
  });

  const apiAsTeam = async (teamId: string) => {
    const { teams } = await vercel.listTeams({ limit: 50 });
    const team = teams.find(team => team.rawData.id === teamId);
    return team;
  };

  const commandName = args[2];
  const commandArguments = args.slice(3);

  // Command handler.
  switch (commandName) {
  case "update": {
    const [domainName, dnsRecordId] = commandArguments;
    const options = parseOptions(commandArguments.slice(2));

    // Check if ZONE_ID and DNS_RECORD_ID was given.
    if (!domainName || !dnsRecordId) {
      return console.error(
        "You must give DOMAIN_NAME and then DNS_RECORD_ID in the command.\n"
        + `Usage: ${basicTokenUsage} update DOMAIN_NAME DNS_RECORD_ID`
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
     * `--team-id`: Optional.
     * Perform the request in a Vercel Team.
     */
    const teamId = options.teamId as string | undefined;
    let api: VercelApi | VercelTeamsApi = vercel;
    if (teamId) {
      const teamApi = await apiAsTeam(teamId);
      if (!teamApi) return console.error(`Team ${teamId} doesn't exist or is not found !`);

      // Use the Team API as default.
      api = teamApi;
    }

    const domain = await api.getDomainFromName(domainName);
    const { records } = await domain.listDnsRecords({ limit: 50 });

    // Find the recordId in the record list.
    const record = records.find(record => record.rawData.id === dnsRecordId);
    if (!record) return console.error(`Record ${dnsRecordId} not found in domain ${domainName} !`);

    try {
      // Update the record by deleting it and creating a new one.
      await record.delete();
      await domain.createDnsRecord({
        name: record.rawData.name,
        ttl: record.rawData.ttl,
        type: dnsType as "A" | "AAAA",
        value: ip as string
      });

      return console.info(`Update from ${record.rawData.value} to ${ip} succeed`);
    }
    catch (e) {
      // Revert deletion.
      await domain.createDnsRecord({
        value: record.rawData.value,
        name: record.rawData.name,
        type: record.rawData.type,
        ttl: record.rawData.ttl
      });

      return console.error("Failed to update. Re-created deleted record. Error thrown:\n", e);
    }
  }
  /** dynamic-dns vercel listDomains [--limit 20] */
  case "listDomains": {
    const options = parseOptions(commandArguments);
    const limit = options.limit as number || 20;
    const teamId = options.teamId as string | undefined;

    let api: VercelApi | VercelTeamsApi = vercel;
    if (teamId) {
      const teamApi = await apiAsTeam(teamId);
      if (!teamApi) return console.error(`Team ${teamId} doesn't exist or is not found !`);

      // Use the Team API as default.
      api = teamApi;
    }

    const {
      resultInfo: {
        count: resultCount
      },
      domains
    } = await api.listDomains({
      limit
    });

    const header = `Listing ${resultCount} domains.\n\n`;
    const content = domains
      .map(({ rawData: domain }) => `* ${domain.name}`)
      .join("\n");

    return console.log(header + content);
  }
  /** dynamic-dns vercel listRecords [DOMAIN_NAME] */
  case "listRecords": {
    const [domainName] = commandArguments;

    const options = parseOptions(commandArguments.slice(1));
    const limit = options.limit as number || 20;
    const teamId = options.teamId as string | undefined;

    let api: VercelApi | VercelTeamsApi = vercel;
    if (teamId) {
      const teamApi = await apiAsTeam(teamId);
      if (!teamApi) return console.error(`Team ${teamId} doesn't exist or is not found !`);

      // Use the Team API as default.
      api = teamApi;
    }

    const domain = api.getDomainFromName(domainName);
    const {
      resultInfo: {
        count: resultCount
      },
      records
    } = await (await domain).listDnsRecords({
      limit
    });

    const header = `Listing ${resultCount} records in domain ${domainName}.\n\n`;
    const content = records
      .map(({ rawData: record }) => `* [${record.type}] ${record.name.trim() ? record.name : "(no name)"} (${record.id})`)
      .join("\n");

    return console.log(header + content);
  }
  default:
    return console.info(helpMessage);
  }
}