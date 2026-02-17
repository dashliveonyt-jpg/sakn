import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const videoId = url.searchParams.get("id");

  if (!videoId) {
    return new Response("Missing video id", { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: video } = await supabase
    .from("videos")
    .select("title, description, video_url")
    .eq("id", videoId)
    .maybeSingle();

  if (!video) {
    return new Response("Video not found", { status: 404, headers: corsHeaders });
  }

  const siteUrl = Deno.env.get("SITE_URL") || "https://sakns-entrance-magic.lovable.app";
  const pageUrl = `${siteUrl}/video/${videoId}`;
  const title = video.title || "Sakn's Video Hosting";
  const description = video.description || "Watch this video on Sakn's Video Hosting";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="og:type" content="video.other">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:video" content="${video.video_url}">
  <meta property="og:video:url" content="${video.video_url}">
  <meta property="og:video:secure_url" content="${video.video_url}">
  <meta property="og:video:type" content="video/mp4">
  <meta property="og:video:width" content="1280">
  <meta property="og:video:height" content="720">
  <meta property="og:site_name" content="Sakn's Video Hosting">
  <meta name="twitter:card" content="player">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:player" content="${video.video_url}">
  <meta name="twitter:player:width" content="1280">
  <meta name="twitter:player:height" content="720">
  <meta name="twitter:player:stream" content="${video.video_url}">
  <meta name="twitter:player:stream:content_type" content="video/mp4">
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <p>Redirecting...</p>
  <script>window.location.replace("${pageUrl}");</script>
  <noscript><meta http-equiv="refresh" content="0;url=${pageUrl}"></noscript>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
    },
  });
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
