import { HTTPError } from "got";

import type { VercelErrorResponse } from "../types/VercelApi";

export default function errorHandler (error: unknown) {
  if (error instanceof HTTPError) {
    const body: VercelErrorResponse = JSON.parse(error.response.body as string);
    const errorMessage = `[${body.error.code}] ${body.error.message}`;

    throw new Error(`[VercelApi] Error with status code: ${error.response.statusCode}.\n- ${errorMessage}`);
  }
}