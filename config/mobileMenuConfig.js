import {
  Search,
  ClipboardList,
  CalendarDays,
  GitBranch,
  User,
  LogIn,
  Heart,
  FileText,
} from "lucide-react";

// Map roles to groups
export const roleGroups = {
  owner: "ownerGroup",
  propertyManager: "ownerGroup",
  careTaker: "ownerGroup",
  agent: "agent",
  buyer: "buyer",
};

// Define menu items for each group
export const roleMenus = {
  ownerGroup: [
    {
      label: "Networks",
      icon: GitBranch,
      href: () => "/owner-network-map",
    },
    {
      label: "Contracts",
      icon: FileText,
      href: () => "/owner-contracts/",
    },
    {
      label: "Inspections",
      icon: ClipboardList,
      href: (userId) => `/my-inspections/${userId}`,
    },
    {
      label: "Availability",
      icon: CalendarDays,
      href: (userId) => `/agent-scheduler/${userId}`,
    },
  ],
  agent: [
    {
      label: "Inspections",
      icon: ClipboardList,
      href: (userId) => `/my-inspections/${userId}`,
    },
    {
      label: "Availability",
      icon: CalendarDays,
      href: (userId) => `/agent-scheduler/${userId}`,
    },
    {
      label: "Networks",
      icon: GitBranch,
      href: () => "/agent-network-map",
    },
  ],
  buyer: [
    {
      label: "Favorites",
      icon: Heart,
      href: () => "/properties/favorite",
    },
    {
      label: "Inspections",
      icon: ClipboardList,
      href: (userId) => `/my-inspections/${userId}`,
    },
    {
      label: "Contracts",
      icon: FileText,
      href: () => "/client-contracts/",
    },
  ],
};
