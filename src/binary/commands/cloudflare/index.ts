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
  case "update":
    console.log(commandArguments);
    break;
  default:
    return console.info(helpMessage);
  }
}