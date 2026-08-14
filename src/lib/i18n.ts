import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export type LocaleCode =
  | "en" | "ar" | "es" | "fr" | "de" | "pt" | "it" | "tr" | "ja" | "id" | "hi" | "zh";

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
  hrefLang: string;
}

export const LOCALES: Locale[] = [
  { code: "en", label: "English",    short: "EN", english: "English",    dir: "ltr", hrefLang: "en" },
  { code: "ar", label: "العربية",     short: "AR", english: "Arabic",     dir: "rtl", hrefLang: "ar" },
  { code: "es", label: "Español",    short: "ES", english: "Spanish",    dir: "ltr", hrefLang: "es" },
  { code: "fr", label: "Français",   short: "FR", english: "French",     dir: "ltr", hrefLang: "fr" },
  { code: "de", label: "Deutsch",    short: "DE", english: "German",     dir: "ltr", hrefLang: "de" },
  { code: "pt", label: "Português",  short: "PT", english: "Portuguese", dir: "ltr", hrefLang: "pt" },
  { code: "it", label: "Italiano",   short: "IT", english: "Italian",    dir: "ltr", hrefLang: "it" },
  { code: "tr", label: "Türkçe",     short: "TR", english: "Turkish",    dir: "ltr", hrefLang: "tr" },
  { code: "ja", label: "日本語",       short: "JA", english: "Japanese",   dir: "ltr", hrefLang: "ja" },
  { code: "id", label: "Indonesia",  short: "ID", english: "Indonesian", dir: "ltr", hrefLang: "id" },
  { code: "hi", label: "हिन्दी",       short: "HI", english: "Hindi",      dir: "ltr", hrefLang: "hi" },
  { code: "zh", label: "中文",         short: "ZH", english: "Chinese",    dir: "ltr", hrefLang: "zh" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";
export const SITE_URL = "https://gamecastle.store";
export const LOCALE_STORAGE_KEY = "gamecastle.locale";
export const LOCALE_EXPLICIT_STORAGE_KEY = "gamecastle.locale.explicit";

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

/**
 * Locales that currently have real, indexable content. Every other locale in
 * LOCALES is still a translation-in-progress placeholder served as
 * `noindex, follow`, so we must NOT advertise it via hreflang — pointing an
 * alternate at a noindex URL makes Google drop the whole cluster.
 *
 * Add a locale code here only once its pages carry translated content.
 */
export const INDEXABLE_LOCALES: LocaleCode[] = ["en", "ar"];

/**
 * Locales that have real translated content a visitor can browse today, even
 * if we don't advertise them through hreflang yet. Used by the language
 * selector to show which editions are live.
 */
export const READY_LOCALES: LocaleCode[] = ["en", "ar"];

export function isReadyLocale(code: string | undefined): boolean {
  return isLocaleCode(code) && READY_LOCALES.includes(code);
}

/**
 * Entry point for a locale from the language selector. Ready locales with a
 * dedicated hub land on that hub instead of an untranslated mirror path.
 */
const LOCALE_ENTRY: Partial<Record<LocaleCode, string>> = {
  ar: "/ar/anime",
};

export function localeEntryPath(pathname: string, locale: LocaleCode): string {
  const target = localizePath(pathname, locale);
  const base = stripLocale(pathname);
  if (
    (base === "/rewards/anime-wallpapers" || base === "/explore" || base.startsWith("/explore/")) &&
    (locale === "en" || locale === "ar")
  ) {
    return target;
  }
  const entry = LOCALE_ENTRY[locale];
  if (!entry) return target;
  // Already inside the localized hub? keep the current page.
  return target.startsWith(entry) ? target : entry;
}

export function isIndexableLocale(code: string | undefined): boolean {
  return isLocaleCode(code) && INDEXABLE_LOCALES.includes(code);
}


/**
 * hreflang alternates (plus x-default) for a canonical path, restricted to
 * locales with indexable content. With a single active locale there is no
 * cluster to declare, so we emit nothing at all.
 */
export function hreflangLinks(pathname: string) {
  if (INDEXABLE_LOCALES.length < 2) return [];
  const base = stripLocale(pathname);
  return [
    ...INDEXABLE_LOCALES.map((code) => ({
      rel: "alternate",
      hreflang: getLocale(code).hrefLang,
      href: `${SITE_URL}${localizePath(base, code)}`,
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
    el.lang = locale.hrefLang;
    el.dir = locale.dir;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale.code);
    } catch {
      /* storage may be unavailable */
    }
  }, [locale]);
}
