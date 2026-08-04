import { useLocale, type LocaleCode } from "@/lib/i18n";

/**
 * Lightweight UI dictionary for chrome-level strings (header, selector,
 * related-links network). Editorial body copy stays English until the
 * localized edition ships; only navigation furniture is translated here.
 */
export type UiKey =
  | "browse"
  | "genres"
  | "editorial"
  | "studios"
  | "search"
  | "menu"
  | "language"
  | "readMore"
  | "related"
  | "advertisement"
  | "home";

type Dict = Record<UiKey, string>;

const en: Dict = {
  browse: "Browse",
  genres: "Genres",
  editorial: "Editorial",
  studios: "Studios",
  search: "Search",
  menu: "Menu",
  language: "Language",
  readMore: "Read more",
  related: "Related on GameCastle Anime",
  advertisement: "Advertisement",
  home: "Home",
};

const TRANSLATIONS: Record<LocaleCode, Partial<Dict>> = {
  en: {},
  ar: {
    browse: "تصفح", genres: "التصنيفات", editorial: "التحرير", studios: "الاستوديوهات",
    search: "بحث", menu: "القائمة", language: "اللغة", readMore: "اقرأ المزيد",
    related: "مواضيع ذات صلة", advertisement: "إعلان", home: "الرئيسية",
  },
  es: {
    browse: "Explorar", genres: "Géneros", editorial: "Editorial", studios: "Estudios",
    search: "Buscar", menu: "Menú", language: "Idioma", readMore: "Leer más",
    related: "Relacionado", advertisement: "Publicidad", home: "Inicio",
  },
  fr: {
    browse: "Parcourir", genres: "Genres", editorial: "Éditorial", studios: "Studios",
    search: "Rechercher", menu: "Menu", language: "Langue", readMore: "Lire la suite",
    related: "À lire aussi", advertisement: "Publicité", home: "Accueil",
  },
  de: {
    browse: "Entdecken", genres: "Genres", editorial: "Redaktion", studios: "Studios",
    search: "Suche", menu: "Menü", language: "Sprache", readMore: "Weiterlesen",
    related: "Ähnliche Beiträge", advertisement: "Anzeige", home: "Startseite",
  },
  pt: {
    browse: "Explorar", genres: "Gêneros", editorial: "Editorial", studios: "Estúdios",
    search: "Pesquisar", menu: "Menu", language: "Idioma", readMore: "Ler mais",
    related: "Relacionados", advertisement: "Publicidade", home: "Início",
  },
  it: {
    browse: "Sfoglia", genres: "Generi", editorial: "Editoriale", studios: "Studi",
    search: "Cerca", menu: "Menu", language: "Lingua", readMore: "Leggi di più",
    related: "Correlati", advertisement: "Pubblicità", home: "Home",
  },
  tr: {
    browse: "Keşfet", genres: "Türler", editorial: "Editöryel", studios: "Stüdyolar",
    search: "Ara", menu: "Menü", language: "Dil", readMore: "Devamını oku",
    related: "İlgili içerikler", advertisement: "Reklam", home: "Ana sayfa",
  },
  ja: {
    browse: "さがす", genres: "ジャンル", editorial: "特集", studios: "スタジオ",
    search: "検索", menu: "メニュー", language: "言語", readMore: "続きを読む",
    related: "関連記事", advertisement: "広告", home: "ホーム",
  },
  id: {
    browse: "Jelajahi", genres: "Genre", editorial: "Editorial", studios: "Studio",
    search: "Cari", menu: "Menu", language: "Bahasa", readMore: "Baca selengkapnya",
    related: "Terkait", advertisement: "Iklan", home: "Beranda",
  },
  hi: {
    browse: "ब्राउज़ करें", genres: "श्रेणियाँ", editorial: "संपादकीय", studios: "स्टूडियो",
    search: "खोजें", menu: "मेन्यू", language: "भाषा", readMore: "और पढ़ें",
    related: "संबंधित", advertisement: "विज्ञापन", home: "होम",
  },
  zh: {
    browse: "浏览", genres: "类型", editorial: "专题", studios: "制作公司",
    search: "搜索", menu: "菜单", language: "语言", readMore: "阅读更多",
    related: "相关内容", advertisement: "广告", home: "首页",
  },
};

export function translate(locale: LocaleCode, key: UiKey): string {
  return TRANSLATIONS[locale]?.[key] ?? en[key];
}

/** Hook form: `const t = useUi(); t("search")`. */
export function useUi() {
  const locale = useLocale();
  return (key: UiKey) => translate(locale.code, key);
}
