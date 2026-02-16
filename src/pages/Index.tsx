import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import CursorGlow from "@/components/CursorGlow";

const comingSoonLetters = "Coming Soon".split("");

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CursorGlow />

      <SplashScreen
        isVisible={showSplash}
        onComplete={() => setShowContent(true)}
      />

      {showContent && (
        <motion.div
          className="flex min-h-screen flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Wavy Coming Soon */}
          <div className="flex overflow-hidden">
            {comingSoonLetters.map((letter, i) => (
              <motion.span
                key={i}
                className="text-lg font-bold uppercase tracking-[0.3em] text-muted-foreground sm:text-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + i * 0.05,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block", minWidth: letter === " " ? "0.4em" : undefined }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="mt-6 h-px w-16 bg-primary/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            className="mt-5 text-sm font-bold text-muted-foreground/40"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            sakn's edits
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
