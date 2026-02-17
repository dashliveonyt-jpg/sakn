import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  created_at: string;
  user_id: string;
}

interface ProfileData {
  username: string;
}

const VideoView = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) { setNotFound(true); setLoading(false); return; }

      const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!data) { setNotFound(true); setLoading(false); return; }
      setVideo(data);

      const { data: prof } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", data.user_id)
        .maybeSingle();
      if (prof) setProfile(prof);
      setLoading(false);
    };
    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <CursorGlow />
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-bold">Video not found</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div
          className="rounded-xl border border-border bg-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="aspect-video bg-background">
            <video
              src={video.video_url}
              className="w-full h-full object-contain"
              controls
              autoPlay
              preload="metadata"
            />
          </div>
          <div className="p-6">
            <h1 className="text-xl font-bold mb-2">{video.title}</h1>
            {video.description && (
              <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{profile?.username ?? "Unknown"}</span>
              <span>·</span>
              <span>{new Date(video.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoView;
