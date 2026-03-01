import type { PlopTypes } from "@turbo/gen";

/**
 * Generator function for creating a new package in the Monorepo
 *
 * @param plop - The plop instance
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("Package", {
    description: "Generate a new package for the Monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "What is the name of the package? (You can skip the `@repo/` prefix)",
      },
    ],
    actions: [
      (answers) => {
        if (
          "name" in answers &&
          typeof answers.name === "string" &&
          answers.name.startsWith("@repo/")
        ) {
          answers.name = answers.name.replace("@repo/", "");
        }
        return "Config sanitized";
      },
      {
        type: "add",
        path: "packages/{{ name }}/package.json",
        templateFile: "templates/package/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/tsconfig.json",
        templateFile: "templates/package/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{ name }}/src/index.ts",
      },
    ],
  });

  plop.setGenerator("App", {
    description: "Generate a new app for the Monorepo",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the app?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "apps/{{ name }}/package.json",
        templateFile: "templates/app/package.json.hbs",
      },
      {
        type: "add",
        path: "apps/{{ name }}/tsconfig.json",
        templateFile: "templates/app/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "apps/{{ name }}/src/index.ts",
        templateFile: "templates/app/src.ts.hbs",
      },
      {
        type: "add",
        path: "apps/{{ name }}/alchemy.run.ts",
        templateFile: "templates/app/alchemy.run.ts.hbs",
      },
      {
        type: "add",
        path: "apps/{{ name }}/types/env.d.ts",
        templateFile: "templates/app/env.d.ts.hbs",
      },
    ],
  });
}
