// src/types/index.ts
import type { ElementType } from "react";
import type { StylesConfig } from "react-select";

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

// نوع الخيار المستخدم في react-select
// أنواع البيانات
export type Partner = {
  id: number;
  name: string;
  contact_person_number?: string | null;
  logo_url?: string | null;
};
export type OptionType = {
  value: string;
  label: string;
  partner?: Partner;
  logo?: string | null;
};

export type City = {
  id: number;
  name: string;
};

export const customStyles: StylesConfig<OptionType> = {
  control: (base) => ({ ...base, minHeight: 48, padding: 5, borderRadius: 6 }),
  option: (base) => ({ ...base, padding: 12 }),
};

export type Branch = {
  id: number;
  name: string;
  logo_url?: string;
};
 
