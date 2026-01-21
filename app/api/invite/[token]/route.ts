import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    // Fetch the guest by token
    const { data: guest, error } = await supabase
      .from("guests")
      .select("*")
      .eq("link_token", token)
      .maybeSingle();

    if (error || !guest) {
      return NextResponse.redirect(
        new URL("/?error=invalid_token", request.url),
      );
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL("/", request.url));

    // Set cookies with redirect URL params instead
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("guest", guest.name);
    redirectUrl.searchParams.set("guestId", guest.id.toString());

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Invite API error:", error);
    return NextResponse.redirect(new URL("/?error=unexpected", request.url));
  }
}
