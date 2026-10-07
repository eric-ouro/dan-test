"use client";

import React from "react";
import {
  ChartNoAxesColumn,
  Clipboard,
  DollarSign,
  LogIn,
  LogOut,
  PanelsTopLeft,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import SidebarNav, { type SidebarNavGroup } from "@/components/sidebar-nav";

const RECENT_SECTIONS: Record<string, string> = {
  "recent-advanced": "dashboard",
  "recent-new-test": "orders",
  "recent-truck-113": "orders",
};

const GROUPS: SidebarNavGroup[] = [
  {
    id: "recent",
    label: "Recent",
    items: [
      {
        id: "recent-advanced",
        label: "Advanced Dashboard",
        icon: PanelsTopLeft,
      },
      { id: "recent-new-test", label: "New Test Order", icon: Clipboard },
      { id: "recent-truck-113", label: "Truck #113", icon: Clipboard },
    ],
  },
  {
    id: "sections",
    label: "Sections",
    items: [
      { id: "dashboard", label: "Dashboard", icon: PanelsTopLeft },
      { id: "customers", label: "Customers", icon: Users },
      { id: "orders", label: "Orders", icon: Clipboard },
      { id: "inputs", label: "Inputs", icon: LogIn },
      { id: "outputs", label: "Outputs", icon: LogOut },
      { id: "financial", label: "Financial", icon: DollarSign },
      { id: "reporting", label: "Reporting", icon: ChartNoAxesColumn },
      { id: "security", label: "Security", icon: Shield },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function NavPreviewPage() {
  const [section, setSection] = React.useState("orders");
  const [recent, setRecent] = React.useState<string | null>("recent-truck-113");

  const onSelect = (id: string) => {
    const recentSection = RECENT_SECTIONS[id] as string | undefined;
    if (recentSection) {
      setRecent(id);
      setSection(recentSection);
    } else {
      setRecent(null);
      setSection(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-neutral-500">
        Toggle &quot;Nav tracking dots&quot; from the dev menu (bottom right, or
        Ctrl + Shift + D).
      </p>
      <SidebarNav
        groups={GROUPS}
        activeIds={recent ? [recent, section] : [section]}
        onSelect={onSelect}
        className="rounded-lg"
      />
    </div>
  );
}
