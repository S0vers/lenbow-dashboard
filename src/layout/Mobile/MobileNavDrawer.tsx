"use client";

import { CheckIcon, CopyIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer";

import useAuth from "@/hooks/use-auth";
import { Link, useRouter } from "@/i18n/navigation";
import { navSupportingItem, userItems } from "@/layout/Desktop/Menu";
import { route } from "@/routes/routes";

interface MobileNavDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function MobileNavDrawer({ isOpen, onOpenChange }: MobileNavDrawerProps) {
	const { user, handleLogout: authLogout } = useAuth();
	const router = useRouter();
	const [copied, setCopied] = useState<boolean>(false);

	const onSignOut = async () => {
		await authLogout();
		router.push(route.protected.login);
	};

	const handleCopy = async () => {
		if (!user?.id) return;
		try {
			await navigator.clipboard.writeText(user.id);
			setCopied(true);
			toast.success("Account ID copied to clipboard");
			setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			toast.error("Failed to copy to clipboard");
		}
	};

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerContent className="max-h-[85vh]">
				<DrawerHeader className="border-b pt-6 pb-5">
					<DrawerTitle className="sr-only">Menu</DrawerTitle>
					<DrawerDescription className="sr-only">Navigation Menu</DrawerDescription>

					{/* Profile Section */}
					<div className="flex items-center gap-4 px-1">
						<Avatar className="border-primary/20 h-16 w-16 border-2 shadow-md">
							<AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
							<AvatarFallback className="from-primary/20 to-primary/10 text-primary bg-linear-to-br text-xl font-bold">
								{user?.name?.slice(0, 2).toUpperCase() || "ME"}
							</AvatarFallback>
						</Avatar>
						<div className="flex min-w-0 flex-1 flex-col gap-1">
							<div className="text-left">
								<h3 className="truncate text-lg font-bold tracking-tight">{user?.name}</h3>
								<p className="text-muted-foreground truncate text-sm">{user?.email}</p>
							</div>
							<button
								onClick={handleCopy}
								className="text-primary hover:text-primary/80 active:text-primary/60 mt-1 -ml-0.5 flex w-fit items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
							>
								<span
									className={cn(
										"transition-all duration-200",
										copied ? "scale-100 opacity-100" : "absolute scale-0 opacity-0"
									)}
								>
									<CheckIcon className="h-3 w-3 stroke-emerald-600 dark:stroke-emerald-400" />
								</span>
								<span
									className={cn(
										"transition-all duration-200",
										copied ? "absolute scale-0 opacity-0" : "scale-100 opacity-100"
									)}
								>
									<CopyIcon className="h-3 w-3" />
								</span>
								{copied ? "Copied!" : "Copy Account ID"}
							</button>
						</div>
					</div>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto px-4 py-6">
					{/* Account Section */}
					<div className="space-y-2">
						<h4 className="text-muted-foreground mb-3 px-1 text-xs font-semibold tracking-wider uppercase">
							Account
						</h4>
						<div className="space-y-1">
							{userItems.map((item, index) => {
								if (!item) return null;
								return (
									<Link
										key={index}
										href={item.url}
										className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 transition-colors duration-200"
										onClick={() => onOpenChange(false)}
									>
										<item.icon className="text-foreground h-5 w-5" strokeWidth={2} />
										<span className="text-base font-medium">{item.title}</span>
									</Link>
								);
							})}
						</div>
					</div>

					{/* More Section */}
					<div className="space-y-2">
						<h4 className="text-muted-foreground mb-3 px-1 text-xs font-semibold tracking-wider uppercase">
							More
						</h4>
						<div className="space-y-1">
							{navSupportingItem.map((item, index) => {
								if (!item) return null;
								return (
									<Link
										key={index}
										href={item.url}
										className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 transition-colors duration-200"
										onClick={() => onOpenChange(false)}
									>
										<item.icon className="text-muted-foreground h-5 w-5" strokeWidth={2} />
										<span className="text-base font-medium">{item.title}</span>
									</Link>
								);
							})}
						</div>
					</div>
				</div>

				{/* Sign Out Button - Fixed at bottom */}
				<div className="border-t p-4">
					<Button
						variant="destructive"
						className="h-12 w-full gap-3 rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md"
						onClick={onSignOut}
					>
						<LogOut className="h-5 w-5" strokeWidth={2} />
						Sign Out
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
