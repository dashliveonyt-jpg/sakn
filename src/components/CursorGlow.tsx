import { useEffect, useRef, useState } from "react";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const [trails] = useState(() => Array.from({ length: 5 }, (_, i) => i));

  useEffect(() => {
    let animFrame: number;
    const positions = trails.map(() => ({ x: 0, y: 0 }));

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      positions.forEach((pos, i) => {
        const target = i === 0 ? mousePos.current : positions[i - 1];
        pos.x += (target.x - pos.x) * (0.15 - i * 0.02);
        pos.y += (target.y - pos.y) * (0.15 - i * 0.02);

        const el = trailsRef.current[i];
        if (el) {
          el.style.left = `${pos.x}px`;
          el.style.top = `${pos.y}px`;
          el.style.opacity = `${0.4 - i * 0.07}`;
          el.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.15})`;
        }
      });
      animFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, [trails]);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" />
      {trails.map((i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailsRef.current[i] = el; }}
          className="cursor-trail"
        />
      ))}
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
};

export default CursorGlow;
