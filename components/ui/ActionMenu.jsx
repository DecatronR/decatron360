"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

/**
 * A reusable dropdown menu component built with Radix UI.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.trigger - The element that triggers the dropdown.
 * @param {Array<{label: string, icon?: React.ReactNode, onClick: () => void}>} props.items - The menu items.
 */
const ActionMenu = ({ trigger, items }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md p-1 shadow-lg z-[1001] border border-gray-100"
          sideOffset={5}
          align="end"
        >
          {items.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-800 rounded-md cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={item.onClick}
            >
              {item.icon && <span className="text-gray-500">{item.icon}</span>}
              <span>{item.label}</span>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ActionMenu;
