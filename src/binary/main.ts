#!/usr/bin/env node
import inquirer from "inquirer";
import * as commands from "./commands";

const availableProviders = [
  "Cloudflare",
  "Netlify",
  "Namecheap",
  "Vercel"
] as const;

(async () => {
  const args = process.argv.slice(2);

  // Define the DNS provider.
  let provider = args[0];

  if (!provider) {
    const response = await inquirer.prompt([
      {
        type: "list",
        name: "provider",
        choices: availableProviders,
        message: "DNS Provider"
      }
    ]);

    const responseProvider: typeof availableProviders[number] = response.provider;
    provider = responseProvider;
  }

  // Validate the DNS provider input.
  provider = provider.toLowerCase();
  if (!availableProviders.map(providerName => providerName.toLowerCase()).includes(provider))
    throw Error(`"${provider}" is not a supported DNS provider.`);

  const commandArgs = args.slice(1);
  switch (provider) {
  case "cloudflare":
    await commands.cloudflare(commandArgs);
    break;
  case "netlify":
    await commands.netlify(commandArgs);
    break;
  case "vercel":
    await commands.vercel(commandArgs);
    break;
  case "namecheap":
    await commands.namecheap(commandArgs);
    break;
  default:
    throw Error(`Currently, the "${provider}" provider isn't supported by the CLI. However, you can still use its API, or better, contribute to the project to make it supported !`);
  }
})();

