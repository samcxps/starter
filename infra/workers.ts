import { Worker } from "alchemy/cloudflare";
import { app } from "../alchemy.run";

export const api = await Worker("api", {
  entrypoint: "apps/api/src/index.ts",
  compatibility: "node",
  bindings: {
    STAGE: app.stage,
  },
});
