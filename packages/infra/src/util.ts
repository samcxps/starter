import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import alchemy, { type Scope } from "alchemy";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

export const KNOWN_STAGES = {
  staging: "staging",
  production: "production",
} as const;

/**
 * Helper fn to find the root directory of the project by looking
 * for the .gitignore file and traversing up the directory tree
 *
 * @param cwd - The current working directory
 * @returns The root directory of the project
 */
function findRootDir(cwd: string) {
  const gitignore = join(cwd, ".gitignore");

  if (existsSync(gitignore)) {
    return cwd;
  }

  return findRootDir(join(cwd, ".."));
}

export function getAppName(entryCwd?: string) {
  const cwd = entryCwd ?? process.cwd();
  const packageJson = readFileSync(join(cwd, "package.json"), "utf8");
  const packageJsonObj = JSON.parse(packageJson);
  return packageJsonObj.name;
}

export const BASE_APP_NAME = getAppName(findRootDir(process.cwd()));

/**
 * Create a new app scope and load the env files for the given stage
 *
 * @param stage - The stage of the app
 * @returns The app scope
 */
export async function createApp(appName: string) {
  // Load shared env required by alchemy
  loadAlchemyEnv();

  // Create new app scope for this app
  const app = await alchemy(appName, {
    password: process.env.ALCHEMY_SECRET_PASSWORD,
    // stateStore: (scope) => getSharedStateStore(scope),
  });

  // Load env based on stage
  loadEnvForStage(app.stage);

  return app;
}

/**
 * Get shared state store for this app
 *
 * @param scope - The scope of the app
 * @returns The shared state store
 */
export function getSharedStateStore(scope: Scope) {
  return new CloudflareStateStore(scope, {
    scriptName: `${BASE_APP_NAME}-alchemy-state`,
  });
}

/**
 * Helper fn to create a normalized resource name
 *
 * @param name - The name of the resource
 * @returns The normalized name of the resource
 */
export function createResourceName(name: string) {
  return `${BASE_APP_NAME}-${name}`;
}

/**
 * Load the Alchemy env files for a given stage
 */
export function loadAlchemyEnv() {
  const cwd = findRootDir(process.cwd());
  const path = join(cwd, ".env.alchemy");

  if (existsSync(path)) {
    config({ path, quiet: true });
  } else {
    throw new Error(`${path} file not found`);
  }
}

/**
 * Load the env files for a given stage
 */
export function loadEnvForStage(stage: string) {
  const cwd = findRootDir(process.cwd());
  const path = join(cwd, `.env.${stage}`);

  if (existsSync(path)) {
    config({ path, quiet: true });
  } else {
    throw new Error(`${path} file not found`);
  }
}
