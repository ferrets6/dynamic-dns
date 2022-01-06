import { NamecheapApi } from "../../../index.js";
import parseOptions from "../../utils/parseOptions.js";

const basicTokenUsage = "dynamic-dns namecheap --dynDnsPassword xxxxxxxxxxxxxxxxxxxxxxxx";
const helpMessage = `
Help: Namecheap Provider - CLI
Usage: ${basicTokenUsage}
Information about the commands:
  * The "--dynDnsPassword" flag is required to authenticate and MUST be defined BEFORE the command name.

Commands:
  * help => Shows this help message.
  * update [DOMAIN_NAME] [SUB_DOMAIN] => Update a DNS record in a specific zone.
    - [--ip X.X.X.X] => Optional: DNS record IP. Defaults to your public IPv4.

    - Notes:
      * [DOMAIN_NAME]: Domain name as written in your dashboard (eg.: example.com).
      * [SUB_DOMAIN]: Record to update (eg.: www). For root domain, type "@".
`;

export default async function handleCommand (args: string[]) {
  // Show help message.
  if (!args[0] || args[0] === "help") return console.info(helpMessage);

  // Verify token.
  const parsedOptions = parseOptions([args[0], args[1]]);
  if (!parsedOptions.dynDnsPassword) return console.error(
    "DynamicDNS Password (--dynDnsPassword) not defined !\n"
    + `Usage: ${basicTokenUsage} [command]`
  );

  const api = new NamecheapApi({
    dynamicDnsPassword: parsedOptions.dynDnsPassword as string
  });

  const commandName = args[2];
  const commandArguments = args.slice(3);

  switch (commandName) {
  case "update": {
    const [domainName, subDomain] = commandArguments;
    const options = parseOptions(commandArguments.slice(2));

    /**
     * `--ip`: Defaults to current public IPv4.
     * Using `public-ip` module to get the public IP.
     */
    const ip = options.ip as string | undefined;

    try {
      await api.updateDnsRecord({
        domain: domainName,
        host: subDomain,
        ip
      });

      return console.info("Update succeed");
    }
    catch (e) {
      return console.error("Failed to update. Error thrown:\n", e);
    }
  }
  default:
    return console.info(helpMessage);
  }
}