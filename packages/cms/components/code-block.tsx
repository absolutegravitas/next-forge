"use client";
import { type ComponentProps } from "react";

// This component is now a simple wrapper.
// The `data-rehype-pretty-code-fragment` and `data-rehype-pretty-code-title` attributes
// will be added automatically by the MDX compiler.
export const CodeBlock = (props: ComponentProps<"div">) => {
  return <div {...props} />;
};
