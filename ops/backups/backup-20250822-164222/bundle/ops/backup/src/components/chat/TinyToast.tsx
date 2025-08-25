"use client";
import React, { useEffect, useState } from "react";

export type TinyToastProps = {
  message: string;
  visible: boolean;
  onHide?: () => void;
  duration?: number;
  className?: string;
};

export default function TinyToast({
  message,
  visible,
  onHide,
  duration = 3000,
  className
}: TinyToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onHide?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  if (!show) return null;

  return (
    <div className={`
      fixed top-4 left-1/2 -translate-x-1/2 z-50
      px-4 py-2 rounded-lg
      bg-black/80 text-white text-sm
      backdrop-blur-sm border border-white/20
      transition-all duration-300
      ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      ${className || ""}
    `}>
      {message}
    </div>
  );
}
