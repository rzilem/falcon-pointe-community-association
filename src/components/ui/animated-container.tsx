
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "fade" | "slide";
  delay?: "none" | "short" | "medium" | "long";
}

const AnimatedContainer = ({
  children,
  animation = "fade",
  delay = "none",
  className,
  ...props
}: AnimatedContainerProps) => {
  const delayClasses = {
    none: "",
    short: "delay-100",
    medium: "delay-200",
    long: "delay-300",
  };

  const animationClasses = {
    fade: "animate-fade-in opacity-0",
    slide: "animate-slide-in",
  };

  return (
    <div
      className={cn(
        animationClasses[animation],
        delayClasses[delay],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
