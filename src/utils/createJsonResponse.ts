interface CreateJsonResponseArgs {
  body: Record<string, unknown>;
  status?: number;
}

export function createJsonResponse({ body, status }: CreateJsonResponseArgs) {
  try {
    const json = JSON.stringify(body);

    return new Response(json, {
      status: status ?? 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : String(error),
        error: "failed to serialise JSON response",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
