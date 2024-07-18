"use client";

import { ComponentPropsWithoutRef } from "react";

import { useOverlay } from "@/Overlay/OverlayContext";

export function CloseOverlayButton({
  children,
  onClick,
  ...props
}: ComponentPropsWithoutRef<"button">) {
  const { close } = useOverlay();
  return (
    <button
      onClick={(...args) => {
        close();
        onClick?.(...args);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
