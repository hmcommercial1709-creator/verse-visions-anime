import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export type LocaleCode =
  | "en" | "ar" | "es" | "fr" | "de" | "pt" | "it" | "tr" | "ja" | "id";

export interface Locale {
  code: LocaleCode;
  /** Native language name shown in the selector */
  label: string;
  /** Short code shown in the compact trigger */
  short: string;
  /** English name, used for a11y labels and hreflang copy */
  english: string;
  dir: "ltr" | "rtl";
  /** BCP-47 value used for hreflang + <html lang> */
  hreflang: string;
}

export const LOCALES: Locale[] = [
  { code: "en", label: "English",    short: "EN", english: "English",    dir: "ltr", hreflang: "en" },
  { code: "ar", label: "العربية",     short: "AR", english: "Arabic",     dir: "rtl", hreflang: "ar" },
  { code: "es", label: "Español",    short: "ES", english: "Spanish",    dir: "ltr", hreflang: "es" },
  { code: "fr", label: "Français",   short: "FR", english: "French",     dir: "ltr", hreflang: "fr" },
  { code: "de", label: "Deutsch",    short: "DE", english: "German",     dir: "ltr", hreflang: "de" },
  { code: "pt", label: "Português",  short: "PT", english: "Portuguese", dir: "ltr", hreflang: "pt" },
  { code: "it", label: "Italiano",   short: "IT", english: "Italian",    dir: "ltr", hreflang: "it" },
  { code: "tr", label: "Türkçe",     short: "TR", english: "Turkish",    dir: "ltr", hreflang: "tr" },
  { code: "ja", label: "日本語",       short: "JA", english: "Japanese",   dir: "ltr", hreflang: "ja" },
  { code: "id", label: "Indonesia",  short: "ID", english: "Indonesian", dir: "ltr", hreflang: "id" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";
export const SITE_URL = "https://verse-visions-anime.lovable.app";
export const LOCALE_STORAGE_KEY = "animeverse.locale";

const BY_CODE = new Map(LOCALES.map((l) => [l.code, l]));

export function isLocaleCode(value: string | undefined): value is LocaleCode {
  return !!value && BY_CODE.has(value as LocaleCode);
}

export function getLocale(code: string | undefined): Locale {
  return BY_CODE.get((code ?? "") as LocaleCode) ?? BY_CODE.get(DEFAULT_LOCALE)!;
}

/** Removes a leading locale segment: "/ar/anime/x" -> "/anime/x" */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split("/");
  if (isLocaleCode(first)) {
    const remainder = rest.join("/");
    return remainder ? `/${remainder}` : "/";
  }
  return pathname || "/";
}

/** Reads the locale encoded in a pathname (defaults to English). */
export function localeFromPath(pathname: string): LocaleCode {
  const first = pathname.split("/")[1];
  return isLocaleCode(first) ? first : DEFAULT_LOCALE;
}

/** Builds the localized equivalent of a path: ("/anime/x","ar") -> "/ar/anime/x" */
export function localizePath(pathname: string, locale: LocaleCode): string {
  const base = stripLocale(pathname);
  if (locale === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}

/** hreflang alternates (plus x-default) for a given canonical English path. */
export function hreflangLinks(pathname: string) {
  const base = stripLocale(pathname);
  return [
    ...LOCALES.map((l) => ({
      rel: "alternate",
      hreflang: l.hreflang,
      href: `${SITE_URL}${localizePath(base, l.code)}`,
    })),
    { rel: "alternate", hreflang: "x-default", href: `${SITE_URL}${base}` },
  ];
}

/** Current locale for the active route. */
export function useLocale(): Locale {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return getLocale(localeFromPath(pathname));
}

/**
 * Keeps <html lang> / <html dir> in sync with the URL locale so Arabic renders
 * RTL and every other language renders LTR. Client-only, zero render cost.
 */
export function useLocaleDocumentSync() {
  const locale = useLocale();
  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale.hreflang;
    el.dir = locale.dir;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale.code);
    } catch {
      /* storage may be unavailable */
    }
  }, [locale]);
}
