"use client";

import { CheckCircle2, LogOut, Monitor } from "lucide-react";
import { FaHandHoldingDollar } from "react-icons/fa6";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getUserInitials } from "@/core/helper";
import useAuth from "@/hooks/use-auth";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export default function OverviewTemplate() {
	const { user, handleLogout, isLoggingOut } = useAuth();

	return (
		<div className="bg-background flex min-h-screen flex-col">
			{/* Header */}
			<div className="from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden bg-linear-to-br px-6 py-8 shadow-lg">
				<div className="relative mb-8 flex items-center justify-between">
					<Link
						href={route.private.dashboard}
						className="flex items-center gap-2 transition-opacity hover:opacity-80"
					>
						<div className="bg-primary-foreground/10 rounded-lg p-1.5 backdrop-blur-sm">
							<FaHandHoldingDollar className="text-primary-foreground size-5" />
						</div>
						<span className="text-lg font-bold tracking-tight">Lenbow</span>
					</Link>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="text-primary-foreground hover:bg-primary-foreground/10 transition-all hover:scale-105 disabled:opacity-50"
					>
						<LogOut className="h-5 w-5" />
					</Button>
				</div>

				<div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
					<div className="relative w-fit">
						<Avatar size="lg" className="ring-primary-foreground/20 shadow-lg ring-4">
							<AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
							<AvatarFallback className="bg-primary-foreground text-primary text-lg font-bold">
								{getUserInitials(user?.name || null)}
							</AvatarFallback>
						</Avatar>
						<div className="ring-primary absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-emerald-500 shadow-sm ring-2" />
					</div>
					<div className="flex-1">
						<h1 className="text-xl font-bold tracking-tight sm:text-2xl">{user?.name || "User"}</h1>
						<p className="text-primary-foreground/80 text-sm font-medium">{user?.email}</p>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 space-y-4 px-6 py-6">
				{/* Login Success Card */}
				<Card className="dark:to-card border-emerald-200 bg-linear-to-br from-emerald-50 to-white shadow-lg dark:border-emerald-800 dark:from-emerald-950/20">
					<CardContent className="pt-6">
						<div className="flex items-start gap-4">
							<div className="shrink-0 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 p-2.5 shadow-md">
								<CheckCircle2 className="h-5 w-5 text-white" />
							</div>
							<div className="flex-1">
								<h3 className="text-foreground mb-1.5 text-sm font-bold sm:text-base">
									Successfully Logged In
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									Welcome back! You are now logged into your account.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Desktop Notice Card */}
				<Card className="shadow-md">
					<CardHeader>
						<div className="mb-3 flex items-start gap-3">
							<div className="bg-primary/10 shrink-0 rounded-lg p-2">
								<Monitor className="text-primary h-5 w-5" />
							</div>
							<div className="flex-1">
								<CardTitle className="text-base">Desktop Version Available</CardTitle>
							</div>
						</div>
						<CardDescription className="text-xs leading-relaxed sm:text-sm">
							The full dashboard experience is currently available on desktop devices only.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
							We&apos;re actively developing the mobile version to bring you a seamless experience
							across all devices. Please visit from a desktop computer to access all features.
						</p>
						<div className="border-primary bg-primary/5 space-y-3 rounded-lg border-l-4 p-4">
							<div className="flex items-center gap-2">
								<div className="bg-primary/20 shrink-0 rounded-full p-1">
									<div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
								</div>
								<p className="text-foreground text-sm font-semibold">Coming Soon</p>
							</div>
							<ul className="text-muted-foreground space-y-2.5 text-xs sm:text-sm">
								<li className="flex items-center gap-3">
									<div className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
									<span>Dashboard Overview</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
									<span>Loan Management</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
									<span>Transaction History</span>
								</li>
								<li className="flex items-center gap-3">
									<div className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
									<span>Profile Settings</span>
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Logout Card */}
				<Card className="shadow-md">
					<CardHeader>
						<CardTitle className="text-base">Account Actions</CardTitle>
						<CardDescription>Manage your current session</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<ExtendedButton
							variant="destructive"
							className="w-full shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
							onClick={handleLogout}
							disabled={isLoggingOut}
						>
							<LogOut className="mr-2 h-4 w-4" />
							{isLoggingOut ? "Logging out..." : "Logout"}
						</ExtendedButton>
						<p className="text-muted-foreground text-center text-xs leading-relaxed">
							You can log back in anytime to access your account
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
