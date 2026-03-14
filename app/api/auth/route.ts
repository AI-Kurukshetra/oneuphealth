import { authActionSchema } from "@/lib/validators";
import { ok, routeError } from "@/lib/api";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = authActionSchema.parse(await request.json().catch(() => ({})));
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return ok({
        session: {
          userId: "00000000-0000-0000-0000-000000000002",
          organizationId: "00000000-0000-0000-0000-000000000001",
          role: "admin",
          mode: "demo",
        },
      });
    }

    if (body.action === "logout") {
      await supabase.auth.signOut();
      return ok({ success: true });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return ok({ session: data.session });
  } catch (error) {
    return routeError(error);
  }
}
