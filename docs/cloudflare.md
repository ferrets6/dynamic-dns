# dynamic-dns - Cloudflare Provider

```typescript
// CommonJS
const { CloudflareApi } = require("dynamic-dns");

// ESM
import { CloudflareApi } from "dynamic-dns";
```

## Set-up the Cloudflare Provider

You can use [tokens (more secure) or auth-keys](https://dash.cloudflare.com/profile/api-tokens).

If you're using a `token`, don't forget to give these permissions.
- `dns_records:edit`
- `zone:read`
- `cache_purge:edit` (Optional) => Only if you need to purge all files of a zone from Cloudflare's cache.

### Example

```typescript
// With a login token.
const cloudflare = new CloudflareApi({
  token: "xxxxxxxxxxxxxxxxxx"
});

// With a auth key.
const cloudflare = new CloudflareApi({
  authEmail: "mail@example.com",
  authKey: "xxxxxxxxxxxxxxxxxxxxxxxx"
});
```

## List your zones

Adapted from <https://api.cloudflare.com/#zone-list-zones>.
All the optional parameters are available.

> Warning: if you want to add `account.name` or `account.id` parameters, you should use `accountName` and `accountId` instead.

### Example

```typescript
try {
  // All the parameters here are optionnal. So, you can also do listZones({})
  const { zones, resultInfo } = await cloudflare.listZones({
    match: "all", // The zones returned should match with `name` and `accountName`.

    name: "example.com", // Zone's name that should match.
    accountName: "Vexcited", // Zone owner's name that should match.

    per_page: 10, // I want to display 10 results per page.
    direction: "desc", // I also want to have descending results.
    page: 1
  });

  // You can get informations about the current page, zones per page, zones count, ...
  console.log(resultInfo); 

  // Get the first zone.
  const zone = zones[0];

  // You can extract the zone's informations with the `rawData` property.
  const zoneName = zone.rawData.name; // string
  const zoneNameServers = zone.rawData.name_servers; // string[]
  console.log(zoneName, zoneNameServers);
}
catch (error) {
  // Error handling.
  console.error(error);
}
```

## Get a zone from its ID

```typescript
try {
  const zoneId = "xxxxxxxxxxxxxxxx";
  const zone = await cloudflare.getZoneFromId(zoneId);

  // You can extract the zone's informations with the `rawData` property.
  const zoneName = zone.rawData.name; // string
  const zoneNameServers = zone.rawData.name_servers; // string[]
  console.log(zoneName, zoneNameServers);
}
catch (error) {
  // Error handling.
  console.error(error);
}
```


## Purge all files from a zone

```typescript
  try {
    const purged = await zone.purgeAllFiles();
    console.log(purged); // returns true if okay.
  }
  catch (error) {
    // Error handling.
    console.error(error);
  }
```