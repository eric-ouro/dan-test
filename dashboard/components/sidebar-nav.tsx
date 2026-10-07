"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDevFlag } from "@/lib/dev-flags";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarNavGroup {
  id: string;
  label: string;
  items: SidebarNavItem[];
}

interface SidebarNavProps {
  groups: SidebarNavGroup[];
  activeIds: string[];
  onSelect: (id: string) => void;
  className?: string;
}

type Segment = "none" | "solid" | "dashed";

export default function SidebarNav({
  groups,
  activeIds,
  onSelect,
  className,
}: SidebarNavProps) {
  const showDots = useDevFlag("navTrackingDots");
  const lastGroupIndex = groups.length - 1;

  return (
    <nav
      aria-label="Main"
      className={cn("w-60 bg-black px-3 py-6 font-inter", className)}
    >
      {groups.map((group, groupIndex) => (
        <React.Fragment key={group.id}>
          {groupIndex > 0 && <GroupGap showDots={showDots} />}
          <ul aria-label={group.label}>
            {group.items.map((item, itemIndex) => {
              const isFirstInGroup = itemIndex === 0;
              const isLastInGroup = itemIndex === group.items.length - 1;
              return (
                <NavRow
                  key={item.id}
                  item={item}
                  active={activeIds.includes(item.id)}
                  onSelect={onSelect}
                  showDots={showDots}
                  top={
                    groupIndex === 0 && isFirstInGroup
                      ? "none"
                      : isFirstInGroup
                        ? "dashed"
                        : "solid"
                  }
                  bottom={
                    groupIndex === lastGroupIndex && isLastInGroup
                      ? "none"
                      : isLastInGroup
                        ? "dashed"
                        : "solid"
                  }
                />
              );
            })}
          </ul>
        </React.Fragment>
      ))}
    </nav>
  );
}

function NavRow({
  item,
  active,
  onSelect,
  showDots,
  top,
  bottom,
}: {
  item: SidebarNavItem;
  active: boolean;
  onSelect: (id: string) => void;
  showDots: boolean;
  top: Segment;
  bottom: Segment;
}) {
  const Icon = item.icon;
  return (
    <li className="group flex">
      <Rail visible={showDots}>
        <RailLine segment={top} className="top-0 h-1/2" />
        <RailLine segment={bottom} className="bottom-0 h-1/2" />
        <span
          className={cn(
            "absolute left-1/2 top-1/2 size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors",
            active
              ? "bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.12)]"
              : "bg-neutral-700 group-hover:bg-neutral-400",
          )}
        />
      </Rail>
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        onClick={() => {
          onSelect(item.id);
        }}
        className={cn(
          "flex h-10 min-w-0 flex-1 items-center gap-3 rounded-md px-2 text-left text-[15px] transition-colors",
          active
            ? "text-white"
            : "text-neutral-500 hover:bg-white/5 hover:text-neutral-200",
        )}
      >
        <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
        <span className="truncate">{item.label}</span>
      </button>
    </li>
  );
}

function GroupGap({ showDots }: { showDots: boolean }) {
  return (
    <div aria-hidden className="flex h-16">
      <Rail visible={showDots}>
        <RailLine segment="dashed" className="inset-y-0" />
      </Rail>
    </div>
  );
}

function Rail({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative shrink-0 transition-[width,opacity] duration-200 ease-out",
        visible ? "w-6 opacity-100" : "w-0 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

function RailLine({
  segment,
  className,
}: {
  segment: Segment;
  className: string;
}) {
  if (segment === "none") return null;
  return (
    <span
      className={cn(
        "absolute left-[calc(50%-0.5px)] border-l border-neutral-700",
        segment === "dashed" && "border-dashed",
        className,
      )}
    />
  );
}
