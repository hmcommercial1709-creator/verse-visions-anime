import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { EXPLORE_PAGES } from "@/data/explore-pages";
import {
  LOCALE_EXPLICIT_STORAGE_KEY,
  localeFromPath,
  localizePath,
  stripLocale,
  type LocaleCode,
} from "@/lib/i18n";

const translatedPaths = new Set([
  "/explore",
  "/rewards/anime-wallpapers",
  ...EXPLORE_PAGES.map((page) => `/explore/${page.slug}`),
]);

/** Redirects only pages with a real counterpart, preserving crawlable alternates. */
export function LocaleRedirectGuard() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const base = stripLocale(pathname).replace(/\/$/, "") || "/";
    if (!translatedPaths.has(base)) return;

    let preferred: LocaleCode;
    try {
      const explicit = localStorage.getItem(LOCALE_EXPLICIT_STORAGE_KEY);
      preferred = explicit === "ar" || explicit === "en"
        ? explicit
        : navigator.languages?.some((language) => language.toLowerCase().startsWith("ar"))
          ? "ar"
          : "en";
    } catch {
      preferred = navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
    }

    if (localeFromPath(pathname) === preferred) return;
    const destination = localizePath(base, preferred);
    window.location.replace(`${destination}${window.location.search}${window.location.hash}`);
  }, [pathname]);

  return null;
}
