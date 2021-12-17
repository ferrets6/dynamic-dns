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

