import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Common env
 */
export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    STAGE: z.enum(["production", "staging"] as const),
  },
});
