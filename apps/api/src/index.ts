export default {
  fetch() {
    return new Response("Hello, world!");
  },
} satisfies ExportedHandler;
