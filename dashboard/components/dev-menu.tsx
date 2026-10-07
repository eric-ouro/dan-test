"use client";

import React from "react";
import { Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEV_FLAGS, type DevFlag, useDevFlags } from "@/lib/dev-flags";

const SHOW_TRIGGER = process.env.NODE_ENV !== "production";

export default function DevMenu() {
  const { flags, setFlag } = useDevFlags();
  const [open, setOpen] = React.useState(false);

  // Ctrl+Shift+D opens the menu everywhere, including production builds
  // where the floating trigger is hidden.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setOpen((current) => !current);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-dm-mono text-xs">
      {open && (
        <div
          role="dialog"
          aria-label="Dev menu"
          className="w-72 rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-neutral-300 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="uppercase tracking-wider text-neutral-500">
              Dev menu
            </span>
            <button
              type="button"
              aria-label="Close dev menu"
              onClick={() => {
                setOpen(false);
              }}
              className="rounded p-1 text-neutral-500 hover:bg-white/5 hover:text-neutral-200"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {(Object.keys(DEV_FLAGS) as DevFlag[]).map((flag) => (
              <li key={flag}>
                <label className="flex cursor-pointer items-start justify-between gap-3 rounded-md p-2 hover:bg-white/5">
                  <span className="flex flex-col gap-1">
                    <span className="text-neutral-100">
                      {DEV_FLAGS[flag].label}
                    </span>
                    <span className="text-neutral-500">
                      {DEV_FLAGS[flag].description}
                    </span>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={flags[flag]}
                    onClick={() => {
                      setFlag(flag, !flags[flag]);
                    }}
                    className={cn(
                      "relative mt-0.5 h-4 w-7 shrink-0 rounded-full transition-colors",
                      flags[flag] ? "bg-white" : "bg-neutral-700",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0.5 top-0.5 size-3 rounded-full transition-transform",
                        flags[flag]
                          ? "translate-x-3 bg-neutral-950"
                          : "bg-neutral-400",
                      )}
                    />
                  </button>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-neutral-600">Toggle with Ctrl + Shift + D</p>
        </div>
      )}
      {SHOW_TRIGGER && (
        <button
          type="button"
          aria-label="Toggle dev menu"
          aria-expanded={open}
          onClick={() => {
            setOpen((current) => !current);
          }}
          className="flex size-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 shadow-lg hover:text-neutral-100"
        >
          <Wrench className="size-4" />
        </button>
      )}
    </div>
  );
}
