import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Waits for the route commit; location.key also changes for repeated links. */
export function NavigationArrival() {
  const location = useLocation();
  const previous = useRef(location);

  useEffect(() => {
    const before = previous.current;
    previous.current = location;
    // Filters and map selections own their focus; a query change is not an arrival.
    if (
      before.pathname === location.pathname &&
      before.hash === location.hash &&
      before.search !== location.search
    )
      return;
    const frame = requestAnimationFrame(() => {
      let anchor = location.hash.slice(1);
      try {
        anchor = decodeURIComponent(anchor);
      } catch {
        return;
      }
      const target = location.hash
        ? document.getElementById(anchor)
        : document.querySelector<HTMLElement>("main");
      if (!target) return;
      // Focus the visible label, not the entire region. Keep scrolling to the anchor.
      const labelId = target.getAttribute("aria-labelledby")?.split(/\s+/)[0];
      const label = labelId ? document.getElementById(labelId) : null;
      const focusTarget = label && target.contains(label) ? label : target;
      focusTarget.setAttribute("tabindex", "-1");
      focusTarget.setAttribute("data-arrival-focus", "true");
      focusTarget.focus({ preventScroll: true });
      const header = document.querySelector("header");
      const offset = (header?.getBoundingClientRect().height ?? 0) + 16;
      window.scrollTo({
        top: Math.max(
          0,
          window.scrollY + target.getBoundingClientRect().top - offset,
        ),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [location]);

  return null;
}
