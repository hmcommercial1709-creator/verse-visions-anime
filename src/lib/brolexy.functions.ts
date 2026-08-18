import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getFeaturedProducts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z
      .object({ limit: z.number().int().min(1).max(24).default(8) })
      .parse(data ?? { limit: 8 }),
  )
  .handler(async ({ data }) => {
    const { fetchBrolexyFeatured } = await import("./brolexy.server");
    return fetchBrolexyFeatured(data.limit);
  });
