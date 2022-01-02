// import { CloudflareApi } from "../../../";
import parseOptions from "../../utils/parseOptions.js";
import publicIp from "public-ip";

const helpMessage = `
Help: Cloudflare Provider - CLI

* update [ZONE_ID] [DNS_RECORD_ID]
[--ip X.X.X.X] => defaults to the current public IP.
[--dns-type A|AAAA] => defaults to A. Only A and AAA are currently supported.
`;

export default async function handleCommand (args: string[]) {
  const commandName = args[0];
  const commandArguments = args.slice(1);

  switch (commandName) {
  case "update": {
    const [zoneId, dnsRecordId] = commandArguments;
    const options = parseOptions(commandArguments.slice(2));

    if (!zoneId || !dnsRecordId) {
      return console.error(
        "You must use pass your ZONE_ID and then your dnsRecordId in the command.\n"
        + "- Usage: dynamic-dns cloudflare update ZONE_ID RECORD_ID"
      );
    }

    console.log(publicIp);

    /**
     * `--dns-type`: Defaults to A.
     * Only A and AAAA currently supported.
     */
    const dnsType = (options.dnsType as string | null) || "A";
    const supportedDnsTypes = ["A", "AAAA"];
    if (!supportedDnsTypes.includes(dnsType)) return console.error(
      `Currently, only ${supportedDnsTypes.join(", ")} record types are available.`
    );

    // const ip = options.ip || dnsType === "A" ? await publicIp.v4() : dnsType === "AAAA" && await publicIp.default.v6();
    // console.log(ip);
    break;
  }
  case "find": {
    return console.log(commandArguments);
  }
  default:
    return console.info(helpMessage);
  }
}