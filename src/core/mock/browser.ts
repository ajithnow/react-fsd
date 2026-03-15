import { setupWorker } from "msw/browser";
import { ENV } from "../utils/env.utils";
import { mockRegistry } from "@/core/registry";

export const worker = setupWorker(...mockRegistry.getAll());

mockRegistry.freeze();

if (ENV.IS_DEV) {
  (window as unknown as { mswWorker: typeof worker }).mswWorker = worker;
}
