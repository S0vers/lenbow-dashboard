import type { Icon } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export interface NavItemProps {
	title: string;
	url: string;
	icon: LucideIcon | Icon | IconType;
	isActive?: boolean;
	items?: {
		title: string;
		url: string;
	}[];
}

export interface NavUserProps {
	name: string;
	email: string;
	avatar?: string;
}

export interface NavUserItemProps {
	title: string;
	url: string;
	icon: LucideIcon | Icon | IconType;
}

type MaxFiveItems<T> = readonly [T?, T?, T?, T?, T?];
export type NavUserMaxItemProps = MaxFiveItems<NavUserItemProps>;
