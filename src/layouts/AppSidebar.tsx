"use client";

import type * as React from "react";
import { FaHandHoldingDollar } from "react-icons/fa6";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/components/ui/sidebar";

import { Link } from "@/i18n/navigation";
import { navItem, navSupportingItem, userItems } from "@/layouts/Menu";
import { NavMenu } from "@/layouts/NavMenu";
import { NavUser } from "@/layouts/NavUser";
import { route } from "@/routes/routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
							<Link href={route.private.dashboard} className="flex items-center gap-2">
								<FaHandHoldingDollar className="size-5!" />
								<span className="text-base font-semibold">Loan App</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMenu label="Platform" items={navItem} />
				<NavMenu label="Supporting" items={navSupportingItem} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser items={userItems} />
			</SidebarFooter>
		</Sidebar>
	);
}
