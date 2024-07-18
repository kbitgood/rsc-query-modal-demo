import React, { PropsWithChildren, ReactElement, Suspense } from "react";

import { Overlay } from "@/Overlay/Overlay";
import { OverlayClientLoader } from "@/Overlay/OverlayClientLoader";
import { OverlayProvider } from "@/Overlay/OverlayContext";
import { ParamsFromPath, areAllParamsDefined } from "@/Overlay/overlayLib";
import { RequireAll } from "@/types";

export async function OverlayPage<
  Path1 extends `/${string}`,
  Path2 extends `/${string}`,
>({
  sharedPath,
  overlaySubPath,
  excludeSubPaths = [],
  params: defaultParams,
  children,
  overlayFallback,
  overlayLoaderAction,
}: PropsWithChildren<{
  sharedPath: Path1;
  overlaySubPath: Path2;
  excludeSubPaths?: string[];
  params: ParamsFromPath<`${Path1}${Path2}`>;
  overlayFallback: ReactElement;
  // overlayLoaderAction must be marked with "use server"
  overlayLoaderAction: (
    params: RequireAll<ParamsFromPath<`${Path1}${Path2}`>>,
  ) => Promise<ReactElement>;
}>) {
  return (
    <OverlayProvider<Path1, Path2>
      sharedPath={sharedPath}
      overlaySubPath={overlaySubPath}
      excludeSubPaths={excludeSubPaths}
      params={defaultParams}
    >
      {children}
      <Overlay>
        <Suspense fallback={overlayFallback}>
          <OverlayClientLoader
            pathDef={`${sharedPath}${overlaySubPath}`}
            initial={
              areAllParamsDefined(
                `${sharedPath}${overlaySubPath}`,
                defaultParams,
              ) ? (
                <ActionLoaderComponent
                  overlayComponent={overlayLoaderAction}
                  params={defaultParams}
                />
              ) : (
                overlayFallback
              )
            }
            loader={overlayLoaderAction}
            fallback={overlayFallback}
          />
        </Suspense>
      </Overlay>
    </OverlayProvider>
  );
}

async function ActionLoaderComponent<P>({
  overlayComponent,
  params,
}: {
  overlayComponent: (params: P) => Promise<ReactElement>;
  params: P;
}) {
  return await overlayComponent(params);
}
