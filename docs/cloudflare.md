# dynamic-dns - Cloudflare Provider

```typescript
// CommonJS
const { CloudflareApi } = require("dynamic-dns");

// ESM
import { CloudflareApi } from "dynamic-dns";
```

## Use the Cloudflare provider

You can use [tokens (more secure) or auth-keys](https://dash.cloudflare.com/profile/api-tokens).

If you're using a `token`, don't forget to give these permissions.
- `dns_records:edit`
- `zone:read`

### Example

```typescript
// With a login token.
const cloudflare = new CloudflareApi({
  token: "xxxxxxxxxxxxxxxxxx"
});

// With a auth key.
const cloudfalre = new CloudflareApi({
  authEmail: "mail@example.com",
  authKey: "xxxxxxxxxxxxxxxxxxxxxxxx"
});
```

## Listing your Cloudflare zones

Adapted from <https://api.cloudflare.com/#zone-list-zones>.
All the optional parameters are available.

> Warning: if you want to add `account.name` or `account.id` parameters, you should use `accountName` and `accountId` instead.

### Example

```typescript
try {
  const zones = await api.listZones({
    match: "all", // The zones returned should match with `name` and `accountName`.

    name: "example.com", // Zone's name that should match.
    accountName: "Vexcited", // Zone owner's name that should match.

    per_page: 10, // I want to display 10 results per page.
    direction: "desc", // I also want to have descending results.
    page: 1
  });

  // Get the first result.
  const zone = zones.result[0];

  // Retreive its informations.
  const zoneId = zone.id;
  const zoneName = zone.name;
  const zoneAccountId = zone.account.id;
  const zoneCreatedOn = new Date(zone.created_on);

  // Log these informations.
  console.info(zoneAccountId, zoneId, zoneName, zoneCreatedOn);
}
catch (error) {
  // Error handling.
  console.error(error);
}
```

## Listing a zone's DNS records

