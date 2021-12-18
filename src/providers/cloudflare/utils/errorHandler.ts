import type { CloudflareResponse } from "../types/CloudflareApi";
import { HTTPError } from "got";

export default function errorHandler (error: unknown) {
  if (error instanceof HTTPError) {
    const body: CloudflareResponse = JSON.parse(error.response.body as string);
    const errorsMessage = body.errors.map(({ code, message }) => `- [${code}] ${message}`).join("\n");

    throw new Error(`[CloudflareApi] Error with status code: ${error.response.statusCode}.\n${errorsMessage}`);
  }
}