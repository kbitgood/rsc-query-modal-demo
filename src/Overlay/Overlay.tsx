"use client";

import { ReactNode, useEffect, useRef } from "react";

import { useOverlay } from "@/Overlay/OverlayContext";

export function Overlay({ children }: { children?: ReactNode }) {
  const { isOpen, close, setIsTransitioning } = useOverlay("/overlay/[id]");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const div = ref.current;
      const handler = () => setIsTransitioning(false);
      div.addEventListener("transitionend", handler);
      return () => div.removeEventListener("transitionend", handler);
    }
  }, [setIsTransitioning]);
  return (
    <div
      ref={ref}
      className={
        "fixed inset-0 z-40 h-full w-full backdrop-blur-[2px] transition-opacity duration-300 ease-out " +
        (isOpen ? "opacity-100" : "pointer-events-none opacity-0")
      }
    >
      <div
        onClick={() => close()}
        className={
          "absolute inset-0 h-full w-full bg-slate-700 transition-opacity duration-300 ease-out " +
          (isOpen ? "opacity-25 blur-3xl" : "opacity-0")
        }
      />
      <div
        className={
          "bg-white absolute right-0 flex h-full w-1/3 flex-col items-stretch justify-stretch bg-carbon-50 shadow transition-transform duration-300 ease-out " +
          (isOpen ? "" : "translate-x-full")
        }
      >
        {children}
      </div>
    </div>
  );
}
