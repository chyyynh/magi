/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
// import { frames } from "./frames";

const frames = createFrames({
  basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <span>
        Hello there: {ctx.pressedButton ? "✅" : "❌"}
        {ctx.message?.inputText ? `, Typed: ${ctx.message?.inputText}` : ""}
      </span>
    ),
    buttons: [<Button action="post">Get Proposal</Button>],
    textInput: "Type something!",
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
