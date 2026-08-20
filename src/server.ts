import "./lib/error-capture";

import { importAnimeBatch } from "./anilist-importer";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response> | Response;
};

type ImportEnv = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  IMPORT_SECRET?: string;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }

  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (response.status < 500) return response;

  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();

  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(
    consumeLastCapturedError() ??
      new Error(`h3 swallowed SSR error: ${body}`),
  );

  return new Response(renderErrorPage(), {
    status: 500,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as {
      unhandled?: unknown;
      message?: unknown;
    };

    return (
      payload.unhandled === true &&
      payload.message === "HTTPError"
    );
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Protected internal importer endpoint.
    // Nothing happens unless the request is explicitly made to this path.
    if (url.pathname === "/api/internal/import-anime") {
      const importEnv = env as ImportEnv;

      const secret = request.headers.get("x-import-secret");

      if (
        !secret ||
        !importEnv.IMPORT_SECRET ||
        secret !== importEnv.IMPORT_SECRET
      ) {
        return new Response("Unauthorized", {
          status: 401,
        });
      }

      if (
        !importEnv.SUPABASE_URL ||
        !importEnv.SUPABASE_SERVICE_ROLE_KEY
      ) {
        return Response.json(
          {
            ok: false,
            error: "Supabase server environment variables are missing.",
          },
          { status: 500 },
        );
      }

      try {
        const page = Number(
          url.searchParams.get("page") ?? "1",
        );

        const result = await importAnimeBatch(
          {
            SUPABASE_URL: importEnv.SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY:
              importEnv.SUPABASE_SERVICE_ROLE_KEY,
          },
          {
            startPage:
              Number.isFinite(page) && page > 0 ? page : 1,
            maxPages: 1,
            perPage: 25,
          },
        );

        return Response.json(result);
      } catch (error) {
        console.error("Anime importer failed:", error);

        return Response.json(
          {
            ok: false,
            error:
              error instanceof Error
                ? error.message
                : String(error),
          },
          { status: 500 },
        );
      }
    }

    try {
      const handler = await getServerEntry();

      const response = await handler.fetch(
        request,
        env,
        ctx,
      );

      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);

      return new Response(renderErrorPage(), {
        status: 500,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }
  },
};
