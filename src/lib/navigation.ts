export function push(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.history.pushState({ ...window.history.state, as: url, url }, "", url);
}

/**
 * @param url Must include de basePath
 */
export function replace(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.history.replaceState(
    { ...window.history.state, as: url, url },
    "",
    url,
  );
}
