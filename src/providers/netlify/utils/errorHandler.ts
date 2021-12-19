import type { NetlifyErrorResponse } from "../types/NetlifyApi";
import { HTTPError } from "got";

export default function errorHandler (error: unknown) {
  if (error instanceof HTTPError) {
    const body: NetlifyErrorResponse = JSON.parse(error.response.body as string);
    const errorMessage = `- [${body.code}] ${body.message}`;

    throw new Error(`[NetlifyApi] Error with status code: ${error.response.statusCode}.\n${errorMessage}`);
  }
}