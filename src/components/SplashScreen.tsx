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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Animated background rings */}
          <motion.div
            className="absolute rounded-full border border-primary/10"
            style={{ width: 300, height: 300 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5], opacity: [0.4, 0] }}
            transition={{ delay: 0.2, duration: 2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full border border-primary/10"
            style={{ width: 300, height: 300 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5], opacity: [0.3, 0] }}
            transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          />

          {/* Glow behind text */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(190, 80%, 45%, 0.3) 0%, transparent 70%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5], opacity: [0, 1, 0.6] }}
            transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
          />

          <div className="relative flex items-baseline gap-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
            {/* Letter-by-letter "sakn's" */}
            <span className="flex text-primary">
              {letters1.map((letter, i) => (
                <motion.span
                  key={`w1-${i}`}
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>

            {/* Letter-by-letter "edits" */}
            <span className="flex text-foreground">
              {letters2.map((letter, i) => (
                <motion.span
                  key={`w2-${i}`}
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.7 + i * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </div>

          {/* Underline sweep */}
          <motion.div
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ width: "40%", bottom: "46%" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
            transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
