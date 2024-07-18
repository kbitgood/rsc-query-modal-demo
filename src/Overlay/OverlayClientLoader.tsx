"use client";

import { useQuery } from "@tanstack/react-query";
import { ReactElement, ReactNode, useEffect, useState } from "react";

import { useOverlay } from "@/Overlay/OverlayContext";
import { ParamsFromPath } from "@/Overlay/overlayLib";
import { RequireAll } from "@/types";

export function OverlayClientLoader<Path extends string>({
  pathDef,
  // this is fine because it should be a React server action marked with "use server"
  loader,
  initial,
  fallback,
}: {
  pathDef: Path;
  loader: (params: RequireAll<ParamsFromPath<Path>>) => Promise<ReactElement>;
  initial: ReactNode;
  fallback: ReactNode;
}) {
  const overlayState = useOverlay(pathDef);
  const paramsKey = JSON.stringify(overlayState.params);

  // change initialData when params changes to prevent initial payload from a
  // different page showing while loading
  const [initialData, setInitialData] = useState<ReactNode>(initial);
  useEffect(() => {
    if (initialData) setInitialData(null);
  }, [paramsKey, initialData, setInitialData]);

  const { data: payload, isLoading } = useQuery(
    ["overlay", paramsKey],
    () => loader(overlayState.params as any),
    {
      enabled: overlayState.isOpen,
      initialData,
      refetchOnMount: false,
    },
  );

  if (isLoading || !payload) return fallback;

  return payload;
}
