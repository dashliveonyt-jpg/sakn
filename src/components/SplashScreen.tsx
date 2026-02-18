import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
  isVisible: boolean;
}

const SplashScreen = ({ onComplete, isVisible }: SplashScreenProps) => {
  const letters1 = "sakn's".split("");
  const letters2 = "edits".split("");

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft pulsing glow */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(190, 80%, 45%, 0.2) 0%, hsla(190, 80%, 45%, 0.05) 40%, transparent 70%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.2, 1], opacity: [0, 0.8, 0.5] }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Single expanding ring */}
          <motion.div
            className="absolute rounded-full border border-primary/15"
            style={{ width: 200, height: 200 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 3, opacity: [0, 0.3, 0] }}
            transition={{ delay: 0.4, duration: 2.5, ease: "easeOut" }}
          />

          <div className="relative flex items-baseline gap-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl" style={{ perspective: 600 }}>
            {/* "sakn's" — smooth fade-slide */}
            <motion.span
              className="text-primary"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {letters1.join("")}
            </motion.span>

            {/* "edits" — smooth fade-slide, slightly delayed */}
            <motion.span
              className="text-foreground"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {letters2.join("")}
            </motion.span>
          </div>

          {/* Underline sweep */}
          <motion.div
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ width: "30%", bottom: "46%" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ delay: 1, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
