import { createApp } from "./src/util";

// Create a root app for shared infra and resources
const app = await createApp("starter");

// Maybe a shared r2 bucket? Who knows
// const _sharedBucket = await R2Bucket("shared-bucket");

await app.finalize();
