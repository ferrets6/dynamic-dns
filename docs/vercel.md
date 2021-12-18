# dynamic-dns - Vercel Provider

```typescript
// CommonJS
const { VercelApi } = require("dynamic-dns");

// ESM
import { VercelApi } from "dynamic-dns";
```

## Configure your Vercel DNS

You have a **full explanation** about the process to **add your domain to Vercel** on [their official documentation](https://vercel.com/docs/concepts/projects/custom-domains#dns-records).

You should also make sure you use the `Nameservers` method. That means that your domain's nameservers should be pointing to the Vercel's nameservers.

My domain's nameservers is configured like this...

![NS Configuration](./assets/vercel-1.png)

## Set-up the Vercel Provider

You'll need to [generate an account token](https://vercel.com/account/tokens).

You can name it the way you want and, by the way, **you'll not be able to see your token** again. So store it somewhere safe.

## Usage

Now that you have your token, you can insert it to the provider like this...

```typescript
const api = new VercelApi({
  token: "xxxxxxxxxxxxxxxxxxx"
});
```

## List the teams

You can directly perform requests to the authenticated user but if you need to access DNS records from domains that are on a different team, you'll need to get the `teamId`.

To do that, you can list all the teams found on the current authenticated user.

This method is adapted from <https://vercel.com/docs/rest-api#endpoints/teams/list-all-teams>. You'll find the documentation for the optional parameters there.

```typescript
try {
  const { resultInfo, teams } = await api.listTeams({
    // limit: number,
    // since: number,
    // until: number
  });

  console.info(`The authenticated user have ${resultInfo.count} team(s).`);

  // Retreive the first returned team.
  const myTeam = teams[0];

  // Get the informations about it.
  const myTeamId = myTeam.rawData.id;
  const myTeamSlug = myTeam.rawData.slug;
  console.info(`The first team returned is ${myTeamSlug} (${myTeamId}).`);

}
catch (error) {
  // Error handling.
  console.error(error);
}
```

With the returned team class, you can perform every methods listed below.

```typescript
const { resultInfo, domains } = await myTeam.listDomains({
  // Parameters in the "List domains" section.
});

console.info(`The first team have ${resultInfo.count} domain(s).`);
```

## List domains

Adapted from <https://vercel.com/docs/rest-api#endpoints/domains/list-all-the-domains>. You'll find the documentation for the optional parameters there.

> `teamId` parameter, in the Vercel's documentation, is automatically filled when using a team class (mentionned above).

```typescript
const { resultInfo, domains } = await api.listDomains({
  // limit: number,
  // since: number,
  // until: number
})
```