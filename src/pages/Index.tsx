import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import { ArrowRight, Video, Code, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TiltCard from "@/components/TiltCard";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<null | object>(null);
  const [showSplash, setShowSplash] = useState(() => {
    if (sessionStorage.getItem("splash_shown")) return false;
    return true;
  });
  const [showContent, setShowContent] = useState(() => {
    return !!sessionStorage.getItem("splash_shown");
  });

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
    if (user) navigate("/profile");
    else navigate("/login?redirect=/profile");
  };

  useEffect(() => {
    if (!showSplash) return;
    sessionStorage.setItem("splash_shown", "true");
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, [showSplash]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />

      <SplashScreen
        isVisible={showSplash}
        onComplete={() => setShowContent(true)}
      />

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />

          {/* Hero */}
          <section id="home" className="flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-3 w-3 text-primary" />
              SAKN'S EDITS
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              edits by{" "}
              <span className="text-primary">@Uhsakn</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              clean and creative edits, check them out on tiktok.
            </motion.p>
          </section>

          {/* Cards */}
          <section id="tools" className="max-w-4xl mx-auto px-6 pb-32 grid gap-6 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <TiltCard
                as="button"
                onClick={handleVideoHosting}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-primary/40 hover:bg-white/[0.06] transition-all duration-300 text-left w-full"
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
              </TiltCard>
            </motion.div>

            <motion.div
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6 opacity-60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
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
          </section>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
