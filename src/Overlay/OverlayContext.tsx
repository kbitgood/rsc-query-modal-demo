"use client";

import { useSearchParams } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ParamsFromPath,
  areAllParamsDefined,
  createPath,
  doesPathMatch,
  getParamsFromPath,
  once,
} from "@/Overlay/overlayLib";
import * as navigation from "@/lib/navigation";
import { useCaptureRelativeLinkClicks } from "@/lib/useCaptureRelativeLinkClicks";
import { useWindowListener } from "@/lib/useWindowListener";
import { Prettify, RequireAll } from "@/types";

type OverlayContext<Path extends string> = {
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
  params: Prettify<ParamsFromPath<Path>>;
  open: (
    params: Prettify<RequireAll<ParamsFromPath<Path>>>,
    searchParams: Record<string, string>,
  ) => void;
  close: () => void;
} & OverlayContextState<Path>;
type OverlayContextState<Path extends string> =
  | { isOpen: false; params: Prettify<ParamsFromPath<Path>> }
  | { isOpen: true; params: Prettify<RequireAll<ParamsFromPath<Path>>> };
// once call here is necessary for setting up generic context
const OverlayContext = once(<Path extends string>() =>
  createContext<OverlayContext<Path>>(undefined as any),
);

export const useOverlay = <Path extends string>(_path?: Path) => {
  const context = useContext(OverlayContext<Path>());
  if (context === undefined) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};

export function OverlayProvider<
  Path1 extends `/${string}`,
  Path2 extends `/${string}`,
>({
  sharedPath,
  overlaySubPath,
  excludeSubPaths = [],
  params: defaultParams,
  children,
}: PropsWithChildren<{
  sharedPath: Path1;
  overlaySubPath: Path2;
  excludeSubPaths?: string[];
  params: ParamsFromPath<`${Path1}${Path2}`>;
}>) {
  const searchParams = useSearchParams();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [params, setParams] =
    useState<ParamsFromPath<`${Path1}${Path2}`>>(defaultParams);
  const isOpen = useMemo(
    () => areAllParamsDefined(`${sharedPath}${overlaySubPath}`, params),
    [sharedPath, overlaySubPath, params],
  );
  const [savedSearchParams, setSavedSearchParams] = useState(
    searchParams.toString(),
  );
  const setPath = useCallback(
    (path: string) => {
      setParams(getParamsFromPath(`${sharedPath}${overlaySubPath}`, path));
    },
    [sharedPath, overlaySubPath],
  );
  useEffect(() => {
    if (!isOpen) {
      setSavedSearchParams(searchParams.toString());
    }
  }, [searchParams, isOpen]);

  useEffect(() => {
    setPath(window.location.pathname);
  }, [setPath]);

  const handlePopstate = useCallback(
    (e: PopStateEvent) => {
      const path = window.location.pathname;
      if (
        (doesPathMatch(`${sharedPath}${overlaySubPath}`, path) ||
          doesPathMatch(sharedPath, path)) &&
        !excludeSubPaths?.some((exclude) =>
          doesPathMatch(`${sharedPath}${exclude}`, path),
        )
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
        setPath(path);
      } else {
        window.location.reload();
      }
    },
    [sharedPath, overlaySubPath, excludeSubPaths, setPath],
  );
  useWindowListener("popstate", handlePopstate);

  const linkClickHandler = useCallback(
    (e: MouseEvent) => {
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (href) {
        const url = new URL(href, window.location.origin);
        const path = url.pathname;
        if (
          doesPathMatch(`${sharedPath}${overlaySubPath}`, path) &&
          !excludeSubPaths?.some((exclude) =>
            doesPathMatch(`${sharedPath}${exclude}`, path),
          )
        ) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setIsTransitioning(true);
          setPath(path);
          const search = url.searchParams.toString();
          const s = [savedSearchParams, search].filter(Boolean).join("&");
          navigation.push(path + (s.length ? "?" + s : ""));
        }
      }
    },
    [sharedPath, overlaySubPath, excludeSubPaths, setPath, savedSearchParams],
  );
  const ref = useCaptureRelativeLinkClicks(linkClickHandler);

  const Context = OverlayContext<`${Path1}${Path2}`>();
  return (
    <Context.Provider
      value={{
        isOpen,
        params: params as any,
        isTransitioning,
        setIsTransitioning,
        open: (params, searchParams) => {
          const path = createPath(`${sharedPath}${overlaySubPath}`, params);
          setIsTransitioning(true);
          setPath(path);
          const search = new URLSearchParams(searchParams).toString();
          const s = [savedSearchParams, search].filter(Boolean).join("&");
          navigation.push(path + (s.length ? "?" + s : ""));
        },
        close: () => {
          setIsTransitioning(true);
          const path = createPath(`${sharedPath}`, params as any);
          setPath(path);
          const s = savedSearchParams.length ? "?" + savedSearchParams : "";
          navigation.push(path + s);
        },
      }}
    >
      <div className="contents" ref={ref}>
        {children}
      </div>
    </Context.Provider>
  );
}
