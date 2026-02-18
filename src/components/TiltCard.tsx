import { useEffect, useRef, useCallback } from "react";
import VanillaTilt from "vanilla-tilt";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  options?: {
    max?: number;
    speed?: number;
    glare?: boolean;
    "max-glare"?: number;
    perspective?: number;
    scale?: number;
  };
  as?: "div" | "button" | "a";
  [key: string]: any;
}

const TiltCard = ({ children, className = "", options, as: Tag = "div", ...props }: TiltCardProps) => {
  const ref = useRef<HTMLElement>(null);

  const initTilt = useCallback(() => {
    if (!ref.current) return;
    VanillaTilt.init(ref.current, {
      max: 10,
      speed: 1200,
      glare: true,
      "max-glare": 0.12,
      perspective: 1000,
      scale: 1.02,
      reverse: true,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      ...options,
    });
  }, [options]);

  useEffect(() => {
    initTilt();
    return () => {
      if (ref.current && (ref.current as any).vanillaTilt) {
        (ref.current as any).vanillaTilt.destroy();
      }
    };
  }, [initTilt]);

  // @ts-ignore - dynamic tag
  return <Tag ref={ref} className={className} {...props}>{children}</Tag>;
};

export default TiltCard;
