// src/types/index.ts
import type { ElementType } from "react";

export type SidebarLink = {
  id: string;
  label: string;
  href: string;
  icon?: ElementType;
  badgeKey?: string;
};

export type SidebarGroup = {
  id: string;
  label: string;
  icon?: ElementType;
  children: SidebarChild[];
};

export type SidebarChild =
  | { type: "link"; item: SidebarLink }
  | { type: "group"; item: SidebarGroup };

export type SidebarSection =
  | { type: "link"; item: SidebarLink }
  | { type: "group"; item: SidebarGroup };
