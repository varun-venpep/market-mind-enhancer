
export async function parseBody(req: Request) {
  let body;
  let text = '';
  try {
    text = await req.text();
    body = text ? JSON.parse(text) : {};
    return { body, error: null };
  } catch (error: any) {
    return {
      body: null,
      error: {
        message: `Invalid JSON in request body`,
        details: error?.message,
        receivedText: text.substring(0, 100),
      },
    };
  }
}
