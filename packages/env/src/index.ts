import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const KNOWN_STAGES = {
  staging: "staging",
  production: "production",
} as const;

// Create a schema for known stages (i.e. non-ephemeral deployed stages)
export const KnownStageSchema = z.enum(
  Object.values(KNOWN_STAGES) as [string, ...string[]]
);

// Extend the known stage schema to allow for custom stages (i.e. local or pr deployments)
export const StageSchema = KnownStageSchema.or(z.string().min(1));

/**
 * Common env
 */
export const env = createEnv({
  server: {
    STAGE: StageSchema,
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
