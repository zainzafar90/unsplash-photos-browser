"use client";

import { cn } from "@/app/lib/utils";
import { QuoteIcon } from "lucide-react";
import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { useInterval } from "usehooks-ts";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useInterval(() => setTime(new Date()), 1000);

  return (
    <h1 className="relative text-shadow-lg text-5xl sm:text-7xl md:text-9xl font-semibold flex tracking-tighter text-white">
      <div className="flex items-center justify-center">
        <ShadowOverlay />
        <NumberFlow
          value={time.getHours() % 12 || 12}
          format={{ notation: "standard", minimumIntegerDigits: 2 }}
          locales="en-US"
        />
        <span className="text-5xl sm:text-7xl md:text-9xl font-semibold mx-1 relative z-10">
          :
        </span>
        <NumberFlow
          value={time.getMinutes()}
          format={{ notation: "standard", minimumIntegerDigits: 2 }}
          locales="en-US"
        />
      </div>
    </h1>
  );
};

const Greeting = () => {
  return (
    <div className="relative cursor-pointer space-y-4 md:space-y-6">
      <h2 className="relative font-semibold text-xl sm:text-2xl md:text-4xl lg:text-4xl mb-8 mt-2 md:mb-12 lg:mb-16 [text-shadow:_0_1px_2px_rgba(0,0,0,0.1)]">
        <ShadowOverlay />
        Do great work.
      </h2>
    </div>
  );
};

const Quote = () => {
  return (
    <div className="relative mx-auto max-w-xs rounded-lg border border-white/10 bg-gray-900/5 p-3 text-center backdrop-blur-lg sm:max-w-xs sm:px-4 md:max-w-md lg:max-w-lg">
      <p className="text-shadow-lg md:text-md my-2 text-sm leading-relaxed lg:text-lg">
        The only way to do great work is to love what you do.
      </p>
      <span className="text-xxs text-white/50 sm:text-xs md:text-sm">
        &mdash; Steve Jobs
      </span>
      <QuoteIcon
        className="absolute bottom-2 right-2 hidden size-6 text-white/20 sm:block"
        aria-hidden="true"
      />
    </div>
  );
};

const ShadowOverlay = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/20 blur-[50px] rounded-full scale-110" />
  );
};

export const Content = () => {
  return (
    <div
      className={cn(
        "text-white",
        "absolute inset-0 h-screen",
        "flex min-h-screen flex-col top-52",
        "transition-opacity duration-300 ease-out"
      )}
    >
      <div className="flex flex-col items-center justify-center gap-8">
        <Clock />
        <Greeting />
        <Quote />
      </div>
    </div>
  );
};
