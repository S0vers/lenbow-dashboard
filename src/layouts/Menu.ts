import {
	IconBell,
	IconCoins,
	IconCreditCard,
	IconDashboard,
	IconFileText,
	IconHandStop,
	IconHelp,
	IconHistory,
	IconSettings,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import type { NavItemProps, NavUserMaxItemProps } from "@/layouts/Layout.types";
import { route } from "@/routes/routes";

const userItems: NavUserMaxItemProps = [
	{ title: "Profile", url: route.private.profile, icon: IconUser },
	{ title: "Settings", url: route.private.settings, icon: IconSettings },
];

const navItem: NavItemProps[] = [
	{
		title: "Dashboard",
		url: route.private.dashboard,
		icon: IconDashboard,
		// items: [{ title: "Profile", url: route.private.profile }],
	},
	{
		title: "Requests",
		url: route.private.requests,
		icon: IconFileText,
	},
	{
		title: "Borrow",
		url: route.private.borrow,
		icon: IconHandStop,
	},
	{
		title: "Lend",
		url: route.private.lend,
		icon: IconCoins,
	},
	{
		title: "Repay",
		url: route.private.repay,
		icon: IconCreditCard,
	},
];

const navSupportingItem: NavItemProps[] = [
	{
		title: "History",
		url: route.private.history,
		icon: IconHistory,
	},
	{
		title: "People",
		url: route.private.borrow,
		icon: IconUsers,
	},
	{
		title: "Notifications",
		url: route.private.notifications,
		icon: IconBell,
	},
	{
		title: "Support",
		url: route.private.support,
		icon: IconHelp,
	},
];

export { navItem, navSupportingItem, userItems };
