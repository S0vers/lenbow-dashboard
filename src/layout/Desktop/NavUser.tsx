"use client";

import { CheckIcon, CopyIcon, LogOut, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { getUserInitials } from "@/core/helper";
import useAuth from "@/hooks/use-auth";
import { Link } from "@/i18n/navigation";
import { NavUserItemProps, NavUserMaxItemProps } from "@/layout/Desktop/Layout.types";

interface NavUserComponentProps {
	items: NavUserMaxItemProps;
}

export function NavUser(props: NavUserComponentProps) {
	const { isMobile } = useSidebar();
	const { user, isAuthenticated, handleLogout } = useAuth();

	const [copied, setCopied] = useState<boolean>(false);

	if (!isAuthenticated || !user) {
		return null;
	}

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(user.id);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const userName = user.name ? user.name : user.email;
	const userImage = user?.image ? user?.image : "";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg bg-transparent">
								<AvatarImage src={userImage} alt={userName} />
								<AvatarFallback className="text-foreground rounded-lg bg-transparent">
									{getUserInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-base leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="text-muted-foreground truncate text-sm">{user.email}</span>
							</div>
							<MoreVertical className="ml-auto size-5" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-base">
								<Avatar className="text-foreground h-8 w-8 rounded-lg bg-transparent">
									<AvatarImage src={userImage} alt={userName} />
									<AvatarFallback className="text-foreground rounded-lg bg-transparent">
										{getUserInitials(user.name)}
									</AvatarFallback>
								</Avatar>

								<div className="grid flex-1 text-left text-base leading-tight">
									<span className="text-foreground truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-sm">{user.email}</span>
								</div>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											className="relative disabled:opacity-100"
											onClick={handleCopy}
											size={"icon"}
											disabled={copied}
										>
											<span
												className={cn(
													"transition-all",
													copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
												)}
											>
												<CheckIcon className="stroke-green-600 dark:stroke-green-400" />
											</span>
											<span
												className={cn(
													"absolute transition-all",
													copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
												)}
											>
												<CopyIcon />
											</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Copy Account ID</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{props.items.length > 0 &&
								props.items
									.filter((item): item is NavUserItemProps => item !== undefined)
									.map(item => (
										<DropdownMenuItem key={item.title} asChild>
											<Link href={item.url}>
												<item.icon />
												{item.title}
											</Link>
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
