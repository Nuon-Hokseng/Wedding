import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  // Fetch guest by token
  const { data: guest, error } = await supabase
    .from("guests")
    .select("*")
    .eq("link_token", token)
    .single();

  // Debug logging (will show in Vercel logs)
  console.log("Token:", token);
  console.log("Guest data:", guest);
  console.log("Error:", error);

  if (error || !guest) {
    // Invalid token, redirect to home with error indicator
    console.log("Guest not found, redirecting to home");
    redirect("/?error=invalid_token");
  }

  // Redirect to home with guest data in URL params
  const redirectUrl = `/?guest=${encodeURIComponent(guest.name)}&guestId=${guest.id}`;
  console.log("Redirecting to:", redirectUrl);
  redirect(redirectUrl);
}
}
