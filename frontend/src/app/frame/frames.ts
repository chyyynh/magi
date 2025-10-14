import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/examples/basic/frames",
  baseUrl: "/frame",
  debug: process.env.NODE_ENV === "development",
});
