// src/components/config/sidebarConfig.ts
import {
  FiCalendar,
  FiUsers,
  FiFolder,
  FiSettings,
  FiUser,
  FiUserCheck,
  FiPackage,

  FiFileText,
  FiFlag,
  FiCreditCard,
  FiGlobe,
  FiMapPin,
  FiShield,
} from "react-icons/fi";
import { FaHome } from "react-icons/fa";

import type { SidebarSection } from "../types";

export const sidebarSections: SidebarSection[] = [
  {
    type: "link",
    item: {
      id: "Home",
      label: "Home",
      href: "/",
      icon: FaHome,
    },
  },

  // 1) Medical Appointments
  {
    type: "link",
    item: {
      id: "consultation_requests",
      label: "Medical Appointments",
      href: "/admins/consultation_requests",
      icon: FiCalendar,
    },
  },

  // 2) Medical Categories
  {
    type: "link",
    item: {
      id: "categories",
      label: "Medical Categories",
      href: "/admins/categories",
      icon: FiFolder,
    },
  },

  // 3) Medical Partners (Teams / Partners / Items)
  {
    type: "group",
    item: {
      id: "partners",
      label: "Medical Partners",
      icon: FiUsers,
      children: [
        {
          type: "link",
          item: {
            id: "partners_link",
            label: "Partners",
            href: "/admins/partners",
            icon: FiUsers,
          },
        },
        {
          type: "link",
          item: {
            id: "branches_link",
            label: "Branches",
            href: "/admins/branches",
            icon: FiUsers,
          },
        },
        {
          type: "link",
          item: {
            id: "specialists_link",
            label: "Specialists",
            href: "/admins/specialists",
            icon: FiUsers,
          },
        },
        {
          type: "link",
          item: {
            id: "teams",
            label: "Teams",
            href: "/admins/teams",
            icon: FiUserCheck,
          },
        },

        {
          type: "link",
          item: {
            id: "partners_items",
            label: "Services",
            href: "/admins/services",
            icon: FiPackage,
          },
        },
      ],
    },
  },

  // 4) Medical Patients
  {
    type: "link",
    item: {
      id: "patients",
      label: "Medical Patients",
      href: "/admins/patients",
      icon: FiUser,
    },
  },
  // ====================
  // Settings Group
  // ====================
  {
    type: "group",
    item: {
      id: "settings",
      label: "Settings",
      icon: FiSettings,
      children: [
        {
          type: "link",
          item: {
            id: "global_settings",
            label: "Global Settings",
            href: "/admins/settings",
            icon: FiSettings,
          },
        },
        // {
        //   type: "link",
        //   item: {
        //     id: "services",
        //     label: "Services",
        //     href: "/admins/services",
        //     icon: FiFileText,
        //   },
        // },
        {
          type: "link",
          item: {
            id: "flags",
            label: "Flags",
            href: "/admins/flags",
            icon: FiFlag,
          },
        },
        {
          type: "link",
          item: {
            id: "payment_methods",
            label: "Payment Methods",
            href: "/admins/payment_methods",
            icon: FiCreditCard,
          },
        },
        {
          type: "link",
          item: {
            id: "countries",
            label: "Countries",
            href: "/admins/countries",
            icon: FiGlobe,
          },
        },
        {
          type: "link",
          item: {
            id: "cities",
            label: "Cities",
            href: "/admins/cities",
            icon: FiMapPin,
          },
        },
        {
          type: "link",
          item: {
            id: "admin",
            label: "Admins",
            href: "/admins/admins",
            icon: FiMapPin,
          },
        },
        {
          type: "link",
          item: {
            id: "terms",
            label: "Terms & Conditions",
            href: "/admins/terms_and_conditions",
            icon: FiFileText,
          },
        },
        {
          type: "link",
          item: {
            id: "privacy",
            label: "Privacy Policy",
            href: "/admins/privacy_policy",
            icon: FiShield,
          },
        },
      ],
    },
  },
];
