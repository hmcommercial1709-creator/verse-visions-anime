if (kind === "code") {
    const { data, error } = await supabase.from("game_nexus_matrix")
      .select("slug, title, sample_review, target_market, target_language, aggregate_rating")
      .eq("slug", slug)
      .maybeSingle();
    
    if (error || !data) return null;
    
    // بناء محتوى غني ومتكامل يملأ الصفحة بالمعلومات
    const richDescription = `
      Official digital code overview and region activation guide for ${data.title}. 
      Target Region: ${data.target_market || 'Global'} (${data.target_language || 'EN'}). 
      ${data.sample_review || 'Redeem your code instantly to unlock exclusive digital rewards, premium in-game items, and verified community perks.'} 
      How to use: Copy the secure code provided, navigate to your target gaming platform store, paste the code in the redemption field, and enjoy your instant rewards safely.
    `.trim();

    return {
      slug: data.slug,
      name: data.title ?? data.slug,
      description: richDescription,
      image_url: null,
      entity_type: "code",
      status: "active",
      source_name: null,
      source_url: null,
    };
  }
