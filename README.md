# dynamic-dns [![WakaTime](https://wakatime.com/badge/user/0839e595-e07a-435c-8d59-ed95f2a3d6dd/project/9c25322f-0486-4f84-bb88-086c57a8e56b.svg?style=flat-square)](https://wakatime.com/@Vexcited/projects/ngorfgqkor)

> API and CLI to dynamically update your DNS for Cloudflare, Namecheap, Netlify, Vercel, and maybe more in the future.

## Installation

You can install this module **globally** or **in a specific project**.

### Install globally

```bash
# With Yarn
yarn global add @vexcited/dynamic-dns

# With NPM
npm install --global @vexcited/dynamic-dns
```

### Install in a specific project
```bash
# With Yarn
yarn add @vexcited/dynamic-dns

# With NPM
npm install --save @vexcited/dynamic-dns
```

## CLI

### Usage

You can get the default help message when executing this command.

`$ dynamic-dns help`

Execute a command on a provider using the following command.

`$ dynamic-dns [provider] [command] [...arguments]`

### Supported providers

You can show the help message for each providers.

- Cloudflare: `$ dynamic-dns cloudflare`
- Namecheap: `$ dynamic-dns namecheap`
- Netlify: `$ dynamic-dns netlify`
- Vercel: `$ dynamic-dns vercel`

Their documentation is the help message given on the `help` command
provided on each providers.

This is an example help message.
```
Help: [provider] Provider - CLI
Usage: dynamic-dns [provider] [command] [--required-example-token XXXXXXXXX]
Informations about the commands:
  * The "--required-example-token" flag is required to authenticate.

Commands:
  * help => Shows this help message.
  * update [DNS_RECORD_ID] => Update a DNS record.
    - [--ip X.X.X.X] => Optional: DNS record IP. Defaults to your public IPv4.
    - [--dns-type A|AAAA] => Optional: DNS record type. Defaults to A (IPv4). 
```
## API

`dynamic-dns` has built-in types so you can also use it with TypeScript.

You can see the API documentation for each providers.
- [Cloudflare](./docs/cloudflare.md)
- [Namecheap](./docs/namecheap.md)
- [Netlify](./docs/netlify.md)
- [Vercel](./docs/vercel.md)
