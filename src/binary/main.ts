#!/usr/bin/env node
import * as commands from "./commands/index.js";

const availableProviders = [
  "Cloudflare",
  "Netlify",
  "Namecheap",
  "Vercel"
];

const helpMessage = `
Help: dynamic-dns - CLI
GitHub: https://github.com/Vexcited/dynamic-dns

  * help => Show this message.

  ${availableProviders.map(provider =>
    `* ${provider.toLowerCase()} => Show the help message for the ${provider} provider.`
  ).join("\n  ")}
`;

(async () => {
  const args = process.argv.slice(2);
  if (!args[0] || args[0] === "help") return console.info(helpMessage);

  // Check given provider.
  const provider = args[0].toLowerCase();
  if (!availableProviders.map(providerName => providerName.toLowerCase()).includes(provider))
    return console.error(`"${provider}" is a currently not supported dynamic-dns DNS provider.`);

  // Execute provider command with arguments.
  const commandArgs = args.slice(1);
  switch (provider) {
  case "cloudflare":
    await commands.cloudflare(commandArgs);
    break;
  case "namecheap":
    await commands.namecheap(commandArgs);
    break;
  case "netlify":
    await commands.netlify(commandArgs);
    break;
  case "vercel":
    await commands.vercel(commandArgs);
    break;
  default:
    console.info(
      `Currently, the "${provider}" provider isn't supported by the CLI.\n`
      + "However, you can still use its API, or better, contribute to the project to make it supported !"
    );
  }
})();

