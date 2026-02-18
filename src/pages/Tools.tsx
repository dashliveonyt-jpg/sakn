import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Film, Code, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import CursorGlow from "@/components/CursorGlow";

const Tools = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<null | object>(null);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleVideoHosting = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login?redirect=/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />
      <Navbar />

      <section className="max-w-4xl mx-auto px-6 pt-32 pb-32">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Tools
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          check out what's available.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2">
          <motion.button
            onClick={handleVideoHosting}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-primary/40 hover:bg-white/[0.06] transition-all duration-300 text-left card-tilt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Video className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                New
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">video hosting</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {user ? "upload and share your videos." : "log in to upload and share videos."}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              {user ? "Go to Profile" : "Log In to Use"} <ArrowRight className="h-4 w-4" />
            </span>
          </motion.button>

          <motion.div
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6 opacity-60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                <Code className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Soon
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">More Tools</h3>
            <p className="text-sm text-muted-foreground mb-4">
              more tools coming soon, stay tuned.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground/50">
              Coming Soon <ArrowRight className="h-4 w-4" />
            </span>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
