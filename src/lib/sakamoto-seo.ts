import { absoluteUrl } from "@/lib/seo";

export function sakamotoHead(path: string, title: string, description: string, image: string) {
  const url = absoluteUrl(path), img = absoluteUrl(image);
  return {
    meta: [{ title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large" }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { property: "og:url", content: url }, { property: "og:image", content: img }, { property: "og:image:width", content: "1600" }, { property: "og:image:height", content: "900" }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: img }],
    links: [{ rel: "canonical", href: url }, { rel: "alternate", hreflang: "en", href: url }, { rel: "alternate", hreflang: "x-default", href: url }, { rel: "preload", as: "image", href: img, type: "image/webp" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify([{"@context":"https://schema.org","@type":"WebPage",name:title,description,url,inLanguage:"en",about:{"@type":"TVSeries",name:"SAKAMOTO DAYS",genre:["Anime","Action comedy","Assassin fiction"],sameAs:["https://sakamotodays.jp/en/","https://www.netflix.com/tudum/sakamoto-days","https://www.viz.com/shonenjump/chapters/sakamoto-days"]},primaryImageOfPage:{"@type":"ImageObject",url:img,width:1600,height:900}},{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:absoluteUrl("/")},{"@type":"ListItem",position:2,name:"Sakamoto Days",item:absoluteUrl("/anime/sakamoto-days")},{"@type":"ListItem",position:3,name:title,item:url}]}]) }],
  };
}
