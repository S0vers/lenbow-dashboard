"use client";

import { LogOut, MoreVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/components/ui/sidebar";

import { NavUserItemProps, NavUserMaxItemProps } from "@/layout/Layout.types";

interface NavUserComponentProps {
	items: NavUserMaxItemProps;
}

export function NavUser(props: NavUserComponentProps) {
	const { isMobile } = useSidebar();
	// const { user, isAuthenticated, handleLogout } = useAuth();
	const user = {
		name: "John Doe",
		email: "john.doe@example.com",
		image: "/avatars/johndoe.jpg"
	};
	const isAuthenticated = true;
	const handleLogout = () => {
		// Implement logout functionality here
	};

	if (!isAuthenticated || !user) {
		return null;
	}

	const userName = user.name ? user.name : user.email;
	const userImage = user?.image ? user?.image : "";

	const initials = userName?.slice(0, 2).toUpperCase();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg bg-transparent grayscale">
								<AvatarImage src={userImage} alt={userName} />
								<AvatarFallback className="text-foreground rounded-lg bg-transparent">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="text-muted-foreground truncate text-xs">{user.email}</span>
							</div>
							<MoreVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="text-foreground h-8 w-8 rounded-lg bg-transparent">
									<AvatarImage src={userImage} alt={userName} />
									<AvatarFallback className="text-foreground rounded-lg bg-transparent">
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="text-foreground truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{props.items.length > 0 &&
								props.items
									.filter((item): item is NavUserItemProps => item !== undefined)
									.map(item => (
										<DropdownMenuItem key={item.title}>
											<item.icon />
											{item.title}
										</DropdownMenuItem>
									))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
