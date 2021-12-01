# dynamic-dns - Cloudflare Provider

```typescript
// CommonJS
const { CloudflareApi } = require("dynamic-dns");

// ESM
import { CloudflareApi } from "dynamic-dns";
```

## Login

To login, you have [two methods](https://dash.cloudflare.com/profile/api-tokens):
- Token (more secure)
- Auth Keys

You can't give both at the same time.

If you're doing a `token`, don't forget to give these permissions:
- `dns_records:edit`
- `zone:read`

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

### List Zones

You can list all your zones by running this.
All the parameters are optionnal.

```typescript
const zones = await api.listZones({
  name: "example.com",
  per_page: 10,
  page: 2
});
```

- `name`: *optional* => Zone's name.
- `page`: *optional* => Current page. With **page > 1**. Default value is `1`.
- `per_page`: *optional* => Number of results within a page. With **5 > per_page > 50**. Default value is `20`.

## Updating a DNS record
```typescript
await cloudflare.updateDnsRecord({
    zone_identifier: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    identifier: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

    content: "76.76.21.22",
    name: "vexcited.me",
    type: "A",
    proxied: false,
    ttl: 1 // 1 is for "automatic"
});
```

- `zone_identifier`: Cloudflare Zone ID.
- `identifier`: Your ID.
- `name`: DNS Record's name.
- `content`: DNS Record's content.
- `type`: DNS Record content's type. (Here it's an IPv4 so I use "A" ; For IPv6, use "AAAA").
- `ttl`: (optional) -> Default value is 3600. Here we use 1 for "automatic".
- `proxied`: (optional) -> If this record is proxied by Cloudflare or not.