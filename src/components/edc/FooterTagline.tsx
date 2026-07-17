import { useEffect, useState } from "react";

const MESSAGES = [
  "Built for ideas worth pursuing",
  "Made for those building what comes next",
  "From first idea to lasting impact",
];

export function FooterTagline() {
  return (
    <div className="pb-6 px-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      {MESSAGES.map((msg, i) => (
        <span key={i} className="flex items-center gap-3">
          <span className="text-base md:text-lg font-medium text-muted-foreground">{msg}</span>
          {i < MESSAGES.length - 1 && (
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          )}
        </span>
      ))}
    </div>
  );
}