import { useEffect, useRef } from "react";

export function useCaptureRelativeLinkClicks(handler: (e: MouseEvent) => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      const div = ref.current;
      let anchorTags: NodeListOf<HTMLAnchorElement> | undefined = undefined;

      const cleanup = () => {
        anchorTags?.forEach((a) => a.removeEventListener("click", handler));
      };

      const onMutate = () => {
        cleanup();
        anchorTags = div.querySelectorAll('a[href^="/"]');
        anchorTags.forEach((a) => a.addEventListener("click", handler));
      };

      const observer = new MutationObserver(onMutate);
      observer.observe(div, { childList: true, subtree: true });

      onMutate();

      return () => {
        cleanup();
        observer.disconnect();
      };
    }
  }, [handler]);
  return ref;
}
