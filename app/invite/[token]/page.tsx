import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  try {
    // First, let's check if we can connect to Supabase at all
    const { data: allGuests, error: listError } = await supabase
      .from("guests")
      .select("link_token")
      .limit(5);

    console.log("=== DEBUG INFO ===");
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Can list guests:", !listError);
    console.log(
      "Sample tokens in DB:",
      allGuests?.map((g) => g.link_token),
    );
    console.log("Looking for token:", token);
    console.log("Token length:", token.length);
    console.log("Token type:", typeof token);

    // Now fetch the specific guest by token
    const { data: guest, error } = await supabase
      .from("guests")
      .select("*")
      .eq("link_token", token)
      .maybeSingle();

    console.log("Guest found:", !!guest);
    console.log("Error:", error?.message || "none");
    console.log("Guest data:", guest);

    if (error || !guest) {
      console.log("Redirecting with error");
      // Return a debug page instead of redirecting
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Debug Info</h1>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Token:</strong> {token}
              </p>
              <p>
                <strong>Token Length:</strong> {token.length}
              </p>
              <p>
                <strong>Error:</strong> {error?.message || "Guest not found"}
              </p>
              <p>
                <strong>Can connect to Supabase:</strong>{" "}
                {listError ? "No" : "Yes"}
              </p>
              <p>
                <strong>Sample tokens in database:</strong>
              </p>
              <ul className="list-disc pl-5">
                {allGuests?.map((g, i) => (
                  <li key={i}>{g.link_token}</li>
                ))}
              </ul>
              <a
                href="/"
                className="inline-block mt-4 px-4 py-2 bg-rose-500 text-white rounded"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Redirect to home with guest data in URL params
    const redirectUrl = `/?guest=${encodeURIComponent(guest.name)}&guestId=${guest.id}`;
    console.log("Success! Redirecting to:", redirectUrl);
    redirect(redirectUrl);
  } catch (err) {
    // Let Next.js redirects pass through
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    
    console.error("Unexpected error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Unexpected Error
          </h1>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Error:</strong> {errorMessage}
            </p>
            <p>
              <strong>Error Type:</strong>{" "}
              {err instanceof Error ? err.constructor.name : typeof err}
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {err instanceof Error ? err.stack : JSON.stringify(err, null, 2)}
            </pre>
            <a
              href="/"
              className="inline-block mt-4 px-4 py-2 bg-rose-500 text-white rounded"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
