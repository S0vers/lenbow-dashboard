"use client";

import * as React from "react";
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
import { navItem, navSupportingItem, userItems } from "@/layout/Desktop/Menu";
import { NavMenu } from "@/layout/Desktop/NavMenu";
import { NavUser } from "@/layout/Desktop/NavUser";
import { route } from "@/routes/routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offExamples" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
							<Link href={route.private.dashboard} className="flex items-center gap-2.5">
								<div className="from-primary/20 to-primary/5 ring-primary/30 flex size-7 items-center justify-center rounded-lg bg-linear-to-br ring-1">
									<FaHandHoldingDollar className="text-primary size-4!" />
								</div>
								<span className="text-base font-bold tracking-tight">Lenbow</span>
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
