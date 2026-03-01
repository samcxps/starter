import { join } from "node:path";
import { createApp, createResourceName } from "@repo/infra/util";
import { Worker } from "alchemy/cloudflare";

// Create a root app for shared infra and resources
const app = await createApp("api");

/**
 * @see https://alchemy.run/providers/cloudflare/worker/
 */
export const worker = await Worker("worker", {
  name: createResourceName("worker"),
  entrypoint: join(import.meta.dirname, "src", "index.ts"),
  compatibility: "node",
  bindings: {
    STAGE: app.stage,
  },
});

await app.finalize();
