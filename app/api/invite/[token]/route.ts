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

    // Set secure cookies
    response.cookies.set("guest_name", guest.name, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set("guest_id", guest.id.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Invite API error:", error);
    return NextResponse.redirect(new URL("/?error=unexpected", request.url));
  }
}
