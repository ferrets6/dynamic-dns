export type NamecheapInstanceOptions = {
  /** Password found when you enabled the Dynamic DNS option in Namecheap. */
  dynamicDnsPassword: string;
}

export type NamecheapUpdateDnsRecordProps = {
  /** Domain to update. Ex.: `example.com`. */
  domain: string;
  /** DNS record name. Ex.: `www`. */
  host: string;
  /** DNS record value. Defaults to the IP of the request sender. */
  ip?: string | null;
}