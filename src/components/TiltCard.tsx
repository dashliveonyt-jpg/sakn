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
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      perspective: 800,
      scale: 1.02,
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
