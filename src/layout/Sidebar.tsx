import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { sidebarSections } from "../config/sidebarConfig";
import type {
  SidebarSection,
  SidebarGroup,
  SidebarLink,
  SidebarChild,
} from "../types";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  sidebarWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, sidebarWidth }) => {
  let envLabel = "DEV";
  const { pathname: currentPath } = useLocation();

  const isActiveLink = (href: string) => currentPath === href;

  const groupHasActiveChild = (group: SidebarGroup): boolean => {
    return group.children.some((child) => {
      if (child.type === "link") {
        return isActiveLink(child.item.href);
      }
      return groupHasActiveChild(child.item);
    });
  };

  const renderLink = (link: SidebarLink, level: number = 0) => {
    const Icon = link.icon;
    const isActive = isActiveLink(link.href);

    return (
      <Link
        key={link.id}
        to={link.href}
        className={clsx(
          "flex items-center rounded-lg text-sm transition-all duration-200",
          "hover:bg-white hover:text-primary hover:shadow-md",
          isActive
            ? "bg-white text-primary shadow-md font-semibold"
            : "text-white",
          // padding تختلف حسب الـ isOpen
          isOpen ? "p-3" : "p-2 justify-center",
          // Indent للليفل الداخلي بس لما الـ sidebar مفتوح
          level > 0 && isOpen && "ml-4"
        )}
      >
        {Icon && (
          <Icon
            className={clsx(
              "w-5 h-5 shrink-0 transition-colors",
              isActive ? "text-primary" : ""
            )}
          />
        )}

        {/* النص يختفي لما الـ sidebar يكون مقفول */}
        {isOpen && (
          <span
            className={clsx(
              "flex-1 whitespace-nowrap font-medium ml-3",
              isActive ? "text-primary" : ""
            )}
          >
            {link.label}
          </span>
        )}
      </Link>
    );
  };

  const renderChild = (child: SidebarChild, level: number = 0) => {
    if (child.type === "link") {
      return renderLink(child.item, level);
    }
    return renderGroup(child.item, level);
  };

  const renderGroup = (group: SidebarGroup, level: number = 0) => {
    const Icon = group.icon;
    const hasActiveChild = groupHasActiveChild(group);

    return (
      <Disclosure
        key={group.id}
        defaultOpen={hasActiveChild}
        as="div"
        className="space-y-1"
      >
        {({ open }) => (
          <>
            <Disclosure.Button
              className={clsx(
                "flex items-center w-full rounded-lg text-sm transition-all duration-200",
                "hover:bg-white hover:text-primary hover:shadow-md",
                hasActiveChild || open
                  ? "bg-white text-primary shadow-md font-semibold"
                  : "text-white",
                isOpen ? "p-3" : "p-2 justify-center",
                level > 0 && isOpen && "ml-4"
              )}
            >
              {Icon && (
                <Icon
                  className={clsx(
                    "w-5 h-5 shrink-0 transition-colors",
                    hasActiveChild || open ? "text-primary" : ""
                  )}
                />
              )}

              {/* برضه نخبي النص لو مقفول */}
              {isOpen && (
                <span
                  className={clsx(
                    "flex-1 whitespace-nowrap text-left ml-3 font-medium",
                    hasActiveChild || open ? "text-primary" : ""
                  )}
                >
                  {group.label}
                </span>
              )}

              {/* نخبي السهم لو الـ sidebar مقفول */}
              {isOpen && (
                <ChevronDownIcon
                  className={clsx(
                    "w-4 h-4 transition-transform duration-200 shrink-0",
                    open ? "rotate-0" : "-rotate-90",
                    hasActiveChild || open ? "text-primary" : "text-white"
                  )}
                />
              )}
            </Disclosure.Button>

            {/* في حالة الـ sidebar مقفول مش هنظهر الـ children أصلاً (اختياري) */}
            {isOpen && (
              <Disclosure.Panel as="div" className="space-y-1 mt-1">
                {group.children.map((child) => (
                  <div key={child.item.id}>{renderChild(child, level + 1)}</div>
                ))}
              </Disclosure.Panel>
            )}
          </>
        )}
      </Disclosure>
    );
  };

  const renderSection = (section: SidebarSection) =>
    section.type === "link"
      ? renderLink(section.item, 0)
      : renderGroup(section.item, 0);

  return (
    <aside
      style={{ width: isOpen ? `${sidebarWidth}px` : "64px" }}
      aria-label="Sidebar"
      className={clsx(
        "fixed top-0 left-0 z-40 h-screen min-h-full bg-primary",
        "transition-all duration-300"
      )}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex w-full items-center justify-center mb-8">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img
              src="https://staging.thaat.app/assets/whiteLogo-eefd060dff41d15046c83453df13759fc3c4c02e09c54a8304a0f08210a2113a.svg"
              alt="Logo"
              height={40}
              width={40}
            />
          </Link>
        </div>

        {/* Env badge – لو عايزها تختفي برضه لما يقفل */}
        {isOpen && (
          <div className="text-center mb-6 space-y-2">
            {envLabel === "Staging" && (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Staging Database
              </span>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {sidebarSections.map((section) => (
            <div key={section.item.id}>{renderSection(section)}</div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
