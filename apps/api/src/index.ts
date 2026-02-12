export default {
  fetch(_request: Request, env: Env) {
    // Typed env from the alchemy.run.ts file
    return new Response(`Hello, world! ${env.STAGE}`);
  },
} satisfies ExportedHandler<Env>;
