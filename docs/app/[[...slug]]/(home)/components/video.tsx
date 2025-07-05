"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import * as React from "react";

// Use the prop types from react-player directly for correct prop inference
// Fallback to any for props if type import fails
type VideoProps = {
  aspectRatio: string;
  [key: string]: any;
};

const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className='h-full w-full bg-black' />,
  }
);

export const Video = ({ aspectRatio, ...props }: VideoProps) => (
  <div className='relative w-full' style={{ aspectRatio }}>
    <ReactPlayer
      {...props}
      width='100%'
      height='100%'
      style={{
        position: "absolute",
      }}
    />
  </div>
);
