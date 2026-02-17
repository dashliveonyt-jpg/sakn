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
          <div className="flex overflow-hidden">
            {comingSoonLetters.map((letter, i) => (
              <motion.span
                key={i}
                className="text-2xl font-bold uppercase tracking-[0.3em] text-foreground sm:text-3xl md:text-4xl"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  delay: i * 0.08,
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: comingSoonLetters.length * 0.08,
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block", minWidth: letter === " " ? "0.5em" : undefined }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
