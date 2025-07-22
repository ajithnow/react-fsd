import handlers from "@/features/mocks";
import { setupWorker } from "msw/browser";

export const worker = setupWorker(...handlers);

if (process.env.NODE_ENV === "development") {
  (window as unknown as { mswWorker: typeof worker }).mswWorker = worker;
}
