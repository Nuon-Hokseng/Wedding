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

    // Create response with redirect - no query params exposed
    const response = NextResponse.redirect(new URL("/", request.url));

    // Set secure HTTP-only cookies to store guest info
    response.cookies.set("guest_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set("guest_name", guest.name, {
      httpOnly: false, // Need to read on client
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    response.cookies.set("guest_id", guest.id.toString(), {
      httpOnly: false, // Need to read on client
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Invite API error:", error);
    return NextResponse.redirect(new URL("/?error=unexpected", request.url));
  }
}
