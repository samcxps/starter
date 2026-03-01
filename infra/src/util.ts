import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import alchemy from "alchemy";
import { CloudflareStateStore } from "alchemy/state";
import { config } from "dotenv";

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

/**
 * Helper fn to get the app name from the package.json file
 *
 * @param entryCwd - The current working directory
 * @returns The app name
 */
export function getPackageJsonName(entryCwd?: string) {
  const cwd = entryCwd ?? process.cwd();

  const packageJson = readFileSync(join(cwd, "package.json"), "utf8");
  const packageJsonObj = JSON.parse(packageJson);
  return packageJsonObj.name;
}

/**
 * Create a new app scope and load the env files for the given stage
 *
 * @param stage - The stage of the app
 * @returns The app scope
 */
export async function createApp(appName: string) {
  // Load shared env required by alchemy
  loadAlchemyEnv();

  const baseAppName = getPackageJsonName(findRootDir(process.cwd()));

  // Create new app scope for this app
  const app = await alchemy(appName, {
    adopt: true,
    rootDir: findRootDir(process.cwd()),
    profile: "default", // change me if you have multiple profiles
    password: process.env.ALCHEMY_SECRET_PASSWORD,
    stateStore: (scope) =>
      new CloudflareStateStore(scope, {
        scriptName: `${baseAppName}-alchemy-state`,
      }),
  });

  // Load env based on stage
  loadEnvForStage(app.stage);

  return app;
}

/**
 * Helper fn to create a normalized resource name
 *
 * @param name - The name of the resource
 * @returns The normalized name of the resource
 */
export function createResourceName(name: string) {
  const baseAppName = getPackageJsonName(findRootDir(process.cwd()));
  return `${baseAppName}-${name}`;
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
