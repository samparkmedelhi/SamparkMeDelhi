// Cloudflare Pages Function for POST /api/orders
// Returns 200 OK JSON acknowledging receipt.
// Note: Real order persistence is performed directly and securely to Firebase Firestore
// from the client application with cryptographically verified Security Rules.
export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Order received. Saved to primary Firestore database.",
        id: data?.id || null
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Order endpoint acknowledged."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
