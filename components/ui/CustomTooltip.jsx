import { Tooltip } from "@radix-ui/react-tooltip"; // or whichever tooltip library you're using

//  "top" | "bottom" | "left" | "right"; // Position of the tooltip

const CustomTooltip = ({ content, side = "bottom", children }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Content
          side={side}
          sideOffset={4}
          className="bg-gray-800 text-white text-xs rounded px-2 py-1 hidden md:block"
          style={{ zIndex: 9999 }}
        >
          {content}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default CustomTooltip;
