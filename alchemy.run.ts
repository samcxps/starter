import alchemy from "alchemy";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

// Load alchemy env
config({ path: ".env.alchemy", quiet: true });

export const app = await alchemy("starter", {
  adopt: true,
  password: process.env.ALCHEMY_SECRET_PASSWORD,
  profile: "samsonc99",
  stateStore: (scope) =>
    new CloudflareStateStore(scope, {
      scriptName: `${scope.appName}-alchemy-state`,
    }),
});

// Load app env based on stage
config({ path: `.env.${app.stage}`, quiet: true });

await import("./infra");

await app.finalize();
