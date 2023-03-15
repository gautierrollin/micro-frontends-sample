import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./Root";

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent : Root,
  errorBoundary : () => (
    <div>
      Error
    </div>
  )
});

export const { bootstrap, mount, unmount } = lifecycles;
