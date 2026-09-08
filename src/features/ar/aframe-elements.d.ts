import type { HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "a-video": HTMLAttributes<HTMLElement> & Record<string, unknown>;
    }
  }
}
