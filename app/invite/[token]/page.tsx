import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import HomePage from "@/app/page";

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

  // Pass guest data to the home page
  return <HomePage guestName={guest.name} guestId={guest.id} />;
}
