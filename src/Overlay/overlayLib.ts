import { Equal, Expect, RequireAll } from "@/types";

type Pieces<Path extends string> = Path extends `/${infer First extends
  string}/${infer Rest extends string}`
  ? [First, ...Pieces<`/${Rest}`>]
  : Path extends `/${infer Last extends string}`
    ? [Last]
    : [];
type ParamPieces<Pieces extends string[]> = {
  [K in keyof Pieces]: Pieces[K] extends `[${infer paramName extends string}]`
    ? paramName
    : never;
}[number];
export type ParamsFromPath<Path extends string> = Record<
  ParamPieces<Pieces<Path>>,
  string | undefined
>;

// noinspection JSUnusedLocalSymbols
type test = Expect<
  Equal<
    ParamsFromPath<"/path/[param1]/path/[param2]">,
    {
      param1: string | undefined;
      param2: string | undefined;
    }
  >
>;

export function getParamNames<Path extends string>(path: Path) {
  return path.match(/\[[^\]]+]/g)?.map((p) => p.slice(1, -1)) ?? [];
}

export function doesPathMatch(pathDef: string, currentPath: string) {
  const pathPieces = pathDef.split("/");
  const currentPieces = currentPath.split("/");
  if (pathPieces.length !== currentPieces.length) {
    return false;
  }
  for (const [pathPiece, currentPiece] of pathPieces.map((p, i) => [
    p,
    currentPieces[i],
  ])) {
    if (pathPiece === currentPiece) {
      continue;
    }
    if (pathPiece.match(/^\[[^\]]+]$/) && currentPiece) {
      continue;
    }
    return false;
  }
  return true;
}

export function areAllParamsDefined<Path extends string>(
  pathDef: Path,
  params: ParamsFromPath<Path>,
): params is RequireAll<ParamsFromPath<Path>> {
  const paramNames = getParamNames(pathDef);
  return paramNames.every(
    (p) => p in params && params[p as keyof typeof params] !== undefined,
  );
}

export function getParamsFromPath<Path extends string>(
  pathDef: Path,
  currentPath: string,
): ParamsFromPath<Path> {
  const params = Object.fromEntries(
    getParamNames(pathDef).map((p) => [p, undefined]),
  ) as ParamsFromPath<Path>;
  const pathPieces = pathDef.split("/");
  const currentPieces = currentPath.split("/");
  for (const [pathPiece, currentPiece] of pathPieces.map((p, i) => [
    p,
    currentPieces[i],
  ])) {
    const paramName = pathPiece.match(/^\[(.*)]$/)?.[1];
    if (paramName && paramName in params && currentPiece) {
      (params as any)[paramName] = currentPiece;
    }
  }
  return params;
}

export function createPath<Path extends string>(
  pathDef: Path,
  params: Required<ParamsFromPath<Path>>,
) {
  const pathPieces = pathDef.split("/");
  return pathPieces
    .map((p) => {
      const paramName = p.match(/^\[(.*)]$/)?.[1];
      if (paramName && paramName in params) {
        return (params as any)[paramName] as string;
      }
      return p;
    })
    .join("/");
}

export function once<T extends any[], R>(fn: (...args: T) => R) {
  let called = false;
  let result: R;
  return (...args: T) => {
    if (called) {
      return result;
    }
    called = true;
    result = fn(...args);
    return result;
  };
}
