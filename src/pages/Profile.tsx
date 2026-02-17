import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Upload, Trash2, Link as LinkIcon, User } from "lucide-react";
import type { User as SupaUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
}

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      await fetchProfile(session.user.id);
      await fetchVideos(session.user.id);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) setProfile(data);
  };

  const fetchVideos = async (userId: string) => {
    const { data } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setVideos(data);
  };

  const handleUpload = async () => {
    if (!fileRef.current?.files?.[0] || !user || !title.trim()) return;

    const file = fileRef.current.files[0];
    if (file.size > 20 * 1024 * 1024) {
      alert("File must be under 20MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(path, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(path);

    const { error: insertError } = await supabase.from("videos").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      video_url: urlData.publicUrl,
    });

    if (insertError) {
      alert("Failed to save: " + insertError.message);
    } else {
      setTitle("");
      setDescription("");
      if (fileRef.current) fileRef.current.value = "";
      await fetchVideos(user.id);
    }
    setUploading(false);
  };

  const handleDelete = async (video: Video) => {
    if (!user) return;
    // Extract path from URL
    const urlParts = video.video_url.split("/videos/");
    const filePath = urlParts[urlParts.length - 1];

    await supabase.storage.from("videos").remove([filePath]);
    await supabase.from("videos").delete().eq("id", video.id);
    await fetchVideos(user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Profile Header */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.username ?? "User"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          className="rounded-xl border border-white/10 bg-white/[0.03] p-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold mb-4">Post a Video</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
            />
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={uploading || !title.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </motion.div>

        {/* Videos Grid */}
        <h2 className="text-lg font-bold mb-4">Your Videos</h2>
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-sm">No videos yet. Upload your first one!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <div className="relative aspect-video bg-black">
                  <video
                    src={video.video_url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{video.title}</h3>
                      {video.description && (
                        <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground/50 mt-2">
                        {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/video/${video.id}`;
                          navigator.clipboard.writeText(url);
                          alert("Link copied!");
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                        title="Copy share link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(video)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
