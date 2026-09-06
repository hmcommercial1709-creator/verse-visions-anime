export async function loadEntity(kind: EntityKind, slug: string) {
  if (kind === "code") {
    const { data, error } = await supabase.from("generated_pages")
      .select("slug, title")
      .eq("slug", slug)
      .maybeSingle();
    
    if (error || !data) return null;
    
    return {
      slug: data.slug,
      name: data.title ?? data.slug,
      description: `GameCastle digital code and region guide for ${data.slug}.`,
      image_url: null,
      entity_type: "code" as EntityKind,
      status: "active",
      source_name: null,
      source_url: null,
    };
  }

  const { data, error } = await catalog.from("entities")
    .select("slug, name, description, image_url, entity_type, status, source_name, source_url")
    .eq("status", "active").eq("entity_type", kind).eq("slug", slug).maybeSingle();
  if (error) throw new Error("The catalog is temporarily unavailable. Please try again later.");
  return data?.name && data.description?.trim() ? data : null;
}

export async function loadEntities(kind: EntityKind) {
  if (kind === "code") {
    const { data, error } = await supabase.from("generated_pages")
      .select("slug, title")
      .limit(100);
    
    if (error || !data) return [];
    
    return data.map((item) => ({
      slug: item.slug,
      name: item.title ?? item.slug,
      description: `GameCastle digital code and region guide for ${item.slug}.`,
      image_url: null,
      entity_type: "code" as EntityKind,
      status: "active",
      source_name: null,
      source_url: null,
    }));
  }

  const { data, error } = await catalog.from("entities")
    .select("slug, name, description, image_url, entity_type, status, source_name, source_url")
    .eq("status", "active").eq("entity_type", kind).order("slug").limit(100);
  if (error) throw new Error("The catalog is temporarily unavailable. Please try again later.");
  return (data ?? []).filter((item) => item.name && item.description?.trim());
}
