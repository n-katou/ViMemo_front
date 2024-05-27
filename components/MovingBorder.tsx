"use client";
import React, { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/utils/cn";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  isActive = false, // 新しく追加したプロパティ
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  isActive?: boolean; // 新しく追加したプロパティ
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative text-xl h-16 w-40 p-[1px] overflow-hidden",
        containerClassName,
        isActive
          ? "bg-gradient-to-r from-[#38bdf8] via-[#818cf8] via-[#c084fc] via-[#e879f9] to-[#22eec5] text-white"
          : "bg-black text-white" // アクティブなタブの場合のスタイルを追加
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%" isActive={isActive}>
          <div
            className={cn(
              "h-20 w-20 opacity-[0.8]",
              borderClassName
            )}
            style={{
              background: "linear-gradient(45deg, #38bdf8, #818cf8, #c084fc, #e879f9, #22eec5)", // レインボーグラデーションを適用
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
  duration = 7000,
  rx,
  ry,
  isActive = false, // 新しく追加したプロパティ
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  isActive?: boolean; // 新しく追加したプロパティ
  [key: string]: any;
}) => {
  const pathRef = useRef<any>();
  const progress = useMotionValue<number>(0);
  const lengthRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathRef.current) {
      lengthRef.current = pathRef.current.getTotalLength();
    }
  }, []);

  useAnimationFrame((time) => {
    if (isActive || !lengthRef.current) return; // isActiveの場合は動きを止める
    const pxPerMillisecond = lengthRef.current / duration;
    progress.set((time * pxPerMillisecond) % lengthRef.current);
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
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
          d="M 0,0 L 100,0 L 100,100 L 0,100 Z"
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
          background: "linear-gradient(45deg, #38bdf8, #818cf8, #c084fc, #e879f9, #22eec5)", // レインボーグラデーションを適用
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
