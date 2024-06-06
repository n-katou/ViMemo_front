"use client";
import React, { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { useTheme } from "next-themes";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  isActive = false,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  isActive?: boolean;
  [key: string]: any;
}) {
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';

  return (
    <Component
      className={cn(
        "relative text-xl h-16 w-40 p-[1px] overflow-hidden",
        containerClassName,
        isActive
          ? "bg-gradient-to-r from-[#38bdf8] via-[#818cf8] via-[#c084fc] via-[#e879f9] to-[#22eec5]"
          : isLightTheme
            ? "bg-white text-white"
            : "bg-black text-white"
      )}
      style={{
        borderRadius: borderRadius,
        border: isActive ? "2px solid lightgray" : "1px solid gray",
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="50%" ry="25%">
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8]",
              borderClassName
            )}
            style={{
              background: "linear-gradient(45deg, #38bdf8, #818cf8, #c084fc, #e879f9, #22eec5)",
            }}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 8000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const progress = useMotionValue<number>(0);
  const lengthRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathRef.current) {
      lengthRef.current = pathRef.current.getTotalLength();
    }

    const animate = (time: number) => {
      if (!lengthRef.current) return;
      const pxPerMillisecond = lengthRef.current / duration;
      progress.set((time * pxPerMillisecond) % lengthRef.current);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [duration, progress]);

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x || 0
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y || 0
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <path
          fill="none"
          d={`M 50,0 A 50,25 0 1,1 49.9,0 Z`}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
          background: "linear-gradient(45deg, #38bdf8, #818cf8, #c084fc, #e879f9, #22eec5)",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
