import handlers from "@/features/mocks";
import { setupWorker } from "msw/browser";
import { ENV } from "../utils/env.utils";

export const worker = setupWorker(...handlers);

if (ENV.IS_DEV) {
  (window as unknown as { mswWorker: typeof worker }).mswWorker = worker;
}
