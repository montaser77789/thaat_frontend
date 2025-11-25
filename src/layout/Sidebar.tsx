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
  const { pathname: currentPath } = useLocation();

  const isActiveLink = (href: string) => currentPath === href;

  const groupHasActiveChild = (group: SidebarGroup): boolean =>
    group.children.some((child) =>
      child.type === "link"
        ? isActiveLink(child.item.href)
        : groupHasActiveChild(child.item)
    );

  // 🔹 New Link Design
  const renderLink = (link: SidebarLink, level = 0) => {
    const Icon = link.icon;
    const isActive = isActiveLink(link.href);

    return (
      <Link
        key={link.id}
        to={link.href}
        className={clsx(
          "flex items-center rounded-xl text-sm transition-all duration-200",
          "text-gray-700 hover:bg-gray-100 ",
          isActive && "bg-primary text-white shadow-md",
          isOpen ? "px-4 py-3" : "p-3 justify-center",
          isOpen && level > 0 && "ml-4"
        )}
      >
        {Icon && (
          <Icon
            className={clsx("w-5 h-5 shrink-0", isActive && "text-white")}
          />
        )}

        {isOpen && (
          <span className="ml-3 whitespace-nowrap font-medium">
            {link.label}
          </span>
        )}
      </Link>
    );
  };

  const renderChild = (child: SidebarChild, level = 0) =>
    child.type === "link"
      ? renderLink(child.item, level)
      : renderGroup(child.item, level);

  // 🔹 New Group Design
  const renderGroup = (group: SidebarGroup, level = 0) => {
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
                "flex items-center rounded-xl text-sm transition-all duration-200",
                "text-gray-700 hover:bg-gray-100",
                (open || hasActiveChild) && "bg-primary text-white shadow",
                isOpen ? "px-4 py-3" : "p-3 justify-center",
                isOpen && level > 0 && "ml-4"
              )}
            >
              {Icon && (
                <Icon
                  className={clsx(
                    "w-5 h-5 shrink-0 text-gray-500",
                    (open || hasActiveChild) && "text-white"
                  )}
                />
              )}

              {isOpen && (
                <span className="ml-3 flex-1 font-medium">{group.label}</span>
              )}

              {isOpen && (
                <ChevronDownIcon
                  className={clsx(
                    "w-4 h-4 transition-transform duration-200 text-gray-400",
                    (open || hasActiveChild) && "text-white",
                    open ? "rotate-0" : "-rotate-90"
                  )}
                />
              )}
            </Disclosure.Button>

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
      ? renderLink(section.item)
      : renderGroup(section.item);

  return (
    <aside
      style={{ width: isOpen ? `${sidebarWidth}px` : "70px" }}
      className="fixed top-0 left-0 z-40 h-screen bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col"
    >
      <div className="flex flex-col h-full  space-y-6 overflow-y-auto">
        {/* Logo */}
        <div
          className={clsx(
            "flex items-center justify-center bg-primary py-3",
            isOpen ? "mb-4" : "mb-6"
          )}
        >
          <img
            src="https://staging.thaat.app/assets/whiteLogo-eefd060dff41d15046c83453df13759fc3c4c02e09c54a8304a0f08210a2113a.svg"
            alt="Logo"
            className={clsx(
              "transition-all duration-300",
              isOpen ? "w-10 h-10" : "w-8 h-8"
            )}
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarSections.map((s) => (
            <div key={s.item.id}>{renderSection(s)}</div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
