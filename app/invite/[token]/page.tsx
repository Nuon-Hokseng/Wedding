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

  if (error || !guest) {
    // Invalid token, redirect to home
    redirect("/");
  }

  // Redirect to home with guest data in URL params
  redirect(`/?guest=${encodeURIComponent(guest.name)}&guestId=${guest.id}`);
}
