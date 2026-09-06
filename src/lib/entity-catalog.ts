if (kind === "code") {
    const { data, error } = await supabase.from("game_nexus_matrix")
      .select("slug, title, sample_review, target_market, target_language, aggregate_rating")
      .eq("slug", slug)
      .maybeSingle();
    
    if (error || !data) return null;

    const market = data.target_market || "Global Market";
    const lang = data.target_language || "EN";
    const rating = data.aggregate_rating || 4.9;

    const richDescription = `
      Complete activation guide, secure region keys, and verified user insights for ${data.title}. 
      Engineered specifically for ${market} (${lang}) users. 
      ${data.sample_review || 'Redeem instantly to unlock official digital rewards, high-speed regional server access, and premium gaming perks.'} 
      Verified safety protocols, instant delivery code mapping, and step-by-step redemption instructions included.
    `.trim();

    return {
      slug: data.slug,
      name: data.title ?? data.slug,
      description: richDescription,
      image_url: "https://gamecastle.store/og-codes-nexus.jpg",
      entity_type: "code",
      status: "active",
      source_name: "GameCastle Nexus Engine",
      source_url: null,
      aggregate_rating: rating,
      target_market: market,
      target_language: lang,
      sample_review: data.sample_review,
    };
  }
