import {
	Coins,
	FileText,
	Hand,
	History,
	LayoutDashboard,
	Mail,
	Settings,
	User,
	Users,
	Wallet
} from "lucide-react";

import type { NavItemProps, NavUserMaxItemProps } from "@/layout/Desktop/Layout.types";
import { route } from "@/routes/routes";

const userItems: NavUserMaxItemProps = [
	{ title: "Profile", url: route.private.profile, icon: User },
	{ title: "Settings", url: route.private.settings, icon: Settings }
];

const navItem: NavItemProps[] = [
	{
		title: "Dashboard",
		url: route.private.dashboard,
		icon: LayoutDashboard
	},
	{
		title: "Requests",
		url: route.private.requests,
		icon: FileText
	},
	{
		title: "Borrow",
		url: route.private.borrow,
		icon: Hand
	},
	{
		title: "Lend",
		url: route.private.lend,
		icon: Coins
	}
];

const navSupportingItem: NavItemProps[] = [
	{
		title: "Budget",
		url: route.private.budget,
		icon: Wallet
	},
	{
		title: "Templates",
		url: route.private.templates,
		icon: Mail,
		items: [
			{
				title: "Builder",
				url: route.private.templates
			},
			{
				title: "All templates",
				url: route.private.templatesList
			}
		]
	},
	{
		title: "History",
		url: route.private.history,
		icon: History
	},
	{
		title: "People",
		url: route.private.people,
		icon: Users
	}
];

export { navItem, navSupportingItem, userItems };
