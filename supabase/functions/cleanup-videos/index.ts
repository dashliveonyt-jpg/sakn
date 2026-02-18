import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROTECTED_EMAIL = "sakn@gmail.com";

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get videos older than 2 days
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

    const { data: videos, error: fetchError } = await supabase
      .from("videos")
      .select("id, user_id, video_url, thumbnail_url")
      .lt("created_at", twoDaysAgo);

    if (fetchError) throw fetchError;
    if (!videos || videos.length === 0) {
      return new Response(JSON.stringify({ deleted: 0 }), { headers: { "Content-Type": "application/json" } });
    }

    // Get protected user id
    const { data: protectedUsers } = await supabase.auth.admin.listUsers();
    const protectedUserId = protectedUsers?.users?.find(
      (u) => u.email === PROTECTED_EMAIL
    )?.id;

    const toDelete = videos.filter((v) => v.user_id !== protectedUserId);

    let deleted = 0;
    for (const video of toDelete) {
      // Delete storage file
      const path = video.video_url?.split("/videos/")[1];
      if (path) {
        await supabase.storage.from("videos").remove([decodeURIComponent(path)]);
      }
      // Delete thumbnail if exists
      if (video.thumbnail_url) {
        const thumbPath = video.thumbnail_url.split("/videos/")[1];
        if (thumbPath) {
          await supabase.storage.from("videos").remove([decodeURIComponent(thumbPath)]);
        }
      }
      // Delete db row
      await supabase.from("videos").delete().eq("id", video.id);
      deleted++;
    }

    return new Response(JSON.stringify({ deleted }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
