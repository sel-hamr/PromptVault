import {
  LayoutDashboard,
  FileText,
  Puzzle,
  Blocks,
  FolderHeart,
  Compass,
  Settings,
  BookMarked,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workshop",
    items: [
      { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
      { label: "Explore", href: ROUTES.explore, icon: Compass },
      { label: "Pieces", href: ROUTES.pieces, icon: Puzzle },
      { label: "Compose", href: ROUTES.compose, icon: Blocks, badge: "New" },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "My Prompts", href: ROUTES.prompts, icon: FileText },
      { label: "Collections", href: ROUTES.collections, icon: FolderHeart },
      { label: "References", href: ROUTES.library, icon: BookMarked },
    ],
  },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];
