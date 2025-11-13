// src/components/config/sidebarConfig.ts
import {
  FiCalendar,
  FiUsers,
  FiFolder,
  FiSettings,
  FiPieChart,
  FiStar,
  FiShoppingBag,
  FiDollarSign,
  FiVolume2,
  FiArchive,
  FiClipboard,
  FiHome,
  FiUser,
  FiUserCheck,
  FiPackage,
  FiLayers,
  FiTrendingUp,
  FiFileText,
  FiFlag,
  FiCreditCard,
  FiGlobe,
  FiMapPin,
  FiBell,
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
            id: "teams",
            label: "Teams",
            href: "/admins/teams",
            icon: FiUserCheck,
          },
        },
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
            id: "partners_items",
            label: "Items",
            href: "/admins/partners/items",
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

  // 5) Archived Section
  {
    type: "group",
    item: {
      id: "archived",
      label: "Archived",
      icon: FiArchive,
      children: [
        // Dashboard
        {
          type: "link",
          item: {
            id: "dashboard",
            label: "Dashboard",
            href: "/admins",
            icon: FiHome,
          },
        },

        // Vendors (Partners)
        {
          type: "link",
          item: {
            id: "vendors",
            label: "Partners",
            href: "/admins/vendors",
            icon: FiUsers,
          },
        },

        // Users
        {
          type: "link",
          item: {
            id: "users",
            label: "Users",
            href: "/admins/users",
            icon: FiUser,
          },
        },

        // Offers (Services)
        {
          type: "link",
          item: {
            id: "offers",
            label: "Services",
            href: "/admins/offers",
            icon: FiPackage,
          },
        },

        // Schedule
        {
          type: "link",
          item: {
            id: "schedule",
            label: "Schedule",
            href: "/admins/manage_calendars",
            icon: FiCalendar,
          },
        },

        // Pillars & Categories
        {
          type: "link",
          item: {
            id: "pillars",
            label: "Pillars",
            href: "/admins/pillars",
            icon: FiLayers,
          },
        },
        {
          type: "link",
          item: {
            id: "services_categories",
            label: "Categories",
            href: "/admins/services",
            icon: FiFolder,
          },
        },

        // ====================
        // Requests Group
        // ====================
        {
          type: "group",
          item: {
            id: "requests",
            label: "Requests",
            icon: FiClipboard,
            children: [
              {
                type: "link",
                item: {
                  id: "requests_branches",
                  label: "Branches",
                  href: "/admins/requests?type=Branch",
                  badgeKey: "pendingBranches",
                  icon: FiUsers,
                },
              },
              {
                type: "link",
                item: {
                  id: "requests_services",
                  label: "Services",
                  href: "/admins/requests?type=Service",
                  badgeKey: "pendingOffers",
                  icon: FiPackage,
                },
              },
              {
                type: "link",
                item: {
                  id: "requests_campaigns",
                  label: "Campaigns",
                  href: "/admins/requests?type=Campaign",
                  badgeKey: "pendingCampaigns",
                  icon: FiBell,
                },
              },
              {
                type: "link",
                item: {
                  id: "requests_reviews",
                  label: "Reviews",
                  href: "/admins/requests?type=Reviews",
                  badgeKey: "pendingReviews",
                  icon: FiStar,
                },
              },
            ],
          },
        },

        // ====================
        // Marketing Group
        // ====================
        {
          type: "group",
          item: {
            id: "marketing",
            label: "Marketing",
            icon: FiVolume2,
            children: [
              // Sponsored Items
              {
                type: "link",
                item: {
                  id: "sponsored_vendors",
                  label: "Partners",
                  href: "/admins/marketings/sponsored_vendors?provider=Vendor",
                  icon: FiUsers,
                },
              },
              {
                type: "link",
                item: {
                  id: "sponsored_branches",
                  label: "Branches",
                  href: "/admins/marketings/sponsored_branches?provider=Branch",
                  icon: FiUserCheck,
                },
              },
              {
                type: "link",
                item: {
                  id: "sponsored_offers",
                  label: "Services",
                  href: "/admins/marketings/sponsored_offers?provider=Offer",
                  icon: FiPackage,
                },
              },
              {
                type: "link",
                item: {
                  id: "sponsored_home_offers",
                  label: "Home Services",
                  href: "/admins/marketings/sponsored_home_offers?provider=HomeOffer",
                  icon: FiHome,
                },
              },
              {
                type: "link",
                item: {
                  id: "sponsored_specialists",
                  label: "Specialists",
                  href: "/admins/marketings/sponsored_specialists?provider=Specialist",
                  icon: FiUser,
                },
              },

              // Marketing Tools
              {
                type: "link",
                item: {
                  id: "marketing_coupons",
                  label: "Coupons",
                  href: "/admins/marketings/coupons",
                  icon: FiDollarSign,
                },
              },
              {
                type: "link",
                item: {
                  id: "marketing_banners",
                  label: "Banners",
                  href: "/admins/marketings/banners",
                  icon: FiTrendingUp,
                },
              },
              {
                type: "link",
                item: {
                  id: "marketing_selections",
                  label: "Selections",
                  href: "/admins/marketings/selections",
                  icon: FiStar,
                },
              },
              {
                type: "link",
                item: {
                  id: "marketing_campaigns",
                  label: "Campaigns",
                  href: "/admins/campaigns",
                  icon: FiVolume2,
                },
              },
            ],
          },
        },

        // ====================
        // Store Group
        // ====================
        {
          type: "group",
          item: {
            id: "store",
            label: "Store",
            icon: FiShoppingBag,
            children: [
              {
                type: "link",
                item: {
                  id: "modifiers",
                  label: "Modifiers",
                  href: "/admins/modifier_groups",
                  icon: FiSettings,
                },
              },
            ],
          },
        },

        // ====================
        // Financials Group
        // ====================
        {
          type: "group",
          item: {
            id: "financials",
            label: "Financials",
            icon: FiDollarSign,
            children: [
              {
                type: "link",
                item: {
                  id: "financial_overview",
                  label: "Overview",
                  href: "/admins/financials",
                  icon: FiPieChart,
                },
              },
              {
                type: "link",
                item: {
                  id: "financial_invoices",
                  label: "Invoices",
                  href: "/admins/invoices",
                  icon: FiFileText,
                },
              },
              {
                type: "link",
                item: {
                  id: "financial_revenue",
                  label: "Revenue/Refund",
                  href: "/admins/revenues",
                  icon: FiTrendingUp,
                },
              },
            ],
          },
        },

        // Analytics
        {
          type: "link",
          item: {
            id: "analytics",
            label: "Analytics",
            href: "/admins/analytics",
            icon: FiPieChart,
          },
        },

        // Reviews
        {
          type: "link",
          item: {
            id: "reviews",
            label: "Reviews",
            href: "/admins/reviews",
            icon: FiStar,
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
      ],
    },
  },
];
