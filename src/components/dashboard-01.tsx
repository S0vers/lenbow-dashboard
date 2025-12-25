"use client";

import {
	BellIcon,
	CreditCardIcon,
	DatabaseIcon,
	FolderIcon,
	LayersIcon,
	LogOutIcon,
	MailIcon,
	MoreHorizontalIcon,
	MoreVerticalIcon,
	PanelLeftIcon,
	PlusCircleIcon,
	SettingsIcon,
	ShareIcon,
	TrashIcon,
	TrendingDownIcon,
	TrendingUpIcon,
	UserCircleIcon
} from "lucide-react";
import * as React from "react";

import { Example, ExampleWrapper } from "@/components/example";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar";

export default function Dashboard01Block() {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)"
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<SectionCards />
							<div className="px-4 lg:px-6">{/* <ChartAreaInteractive /> */}</div>
							{/* <DataTable data={data} /> */}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const navMain = [
		{
			title: "Dashboard",
			url: "#"
		},
		{
			title: "Lifecycle",
			url: "#"
		},
		{
			title: "Analytics",
			url: "#"
		},
		{
			title: "Projects",
			url: "#"
		},
		{
			title: "Team",
			url: "#"
		}
	];

	const navSecondary = [
		{
			title: "Settings",
			url: "#"
		},
		{
			title: "Get Help",
			url: "#"
		},
		{
			title: "Search",
			url: "#"
		}
	];

	const documents = [
		{
			name: "Data Library",
			url: "#"
		},
		{
			name: "Reports",
			url: "#"
		},
		{
			name: "Word Assistant",
			url: "#"
		}
	];

	const user = {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg"
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
							<LayersIcon className="size-5!" />
							<span className="text-base font-semibold">Acme Inc.</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				<NavDocuments items={documents} />
				<NavSecondary items={navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}

function NavMain({
	items
}: {
	items: {
		title: string;
		url: string;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip="Quick Create"
							className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
						>
							<PlusCircleIcon />
							<span>Quick Create</span>
						</SidebarMenuButton>
						<Button
							size="icon"
							className="size-8 group-data-[collapsible=icon]:opacity-0"
							variant="outline"
						>
							<MailIcon />
							<span className="sr-only">Inbox</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map(item => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title}>
								<PanelLeftIcon />
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavDocuments({
	items
}: {
	items: {
		name: string;
		url: string;
	}[];
}) {
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Documents</SidebarGroupLabel>
			<SidebarMenu>
				{items.map(item => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton>
							<DatabaseIcon />
							<span>{item.name}</span>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<MoreHorizontalIcon />
								<span className="sr-only">More</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-24 rounded-lg" align="end">
								<DropdownMenuItem>
									<FolderIcon />
									<span>Open</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<ShareIcon />
									<span>Share</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive">
									<TrashIcon />
									<span>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
				<SidebarMenuItem>
					<SidebarMenuButton className="text-sidebar-foreground/70">
						<MoreHorizontalIcon className="text-sidebar-foreground/70" />
						<span>More</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	);
}

function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map(item => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton>
								<SettingsIcon />
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

function NavUser({
	user
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className="h-8 w-8 rounded-lg grayscale">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="rounded-lg">CN</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user.name}</span>
							<span className="text-muted-foreground truncate text-xs">{user.email}</span>
						</div>
						<MoreVerticalIcon className="ml-auto size-4" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side="right"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<UserCircleIcon />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCardIcon />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<BellIcon />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOutIcon />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function SiteHeader() {
	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
				<h1 className="text-base font-medium">Documents</h1>
				<div className="ml-auto flex items-center gap-2">
					<Button variant="ghost" size="sm" className="hidden sm:flex">
						GitHub
					</Button>
				</div>
			</div>
		</header>
	);
}

function SectionCards() {
	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total Revenue</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						$1,250.00
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUpIcon />
							+12.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Trending up this month <TrendingUpIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">Visitors for the last 6 months</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>New Customers</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						1,234
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingDownIcon />
							-20%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Down 20% this period <TrendingDownIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">Acquisition needs attention</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Active Accounts</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						45,678
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUpIcon />
							+12.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Strong user retention <TrendingUpIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">Engagement exceed targets</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Growth Rate</CardDescription>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
						4.5%
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<TrendingUpIcon />
							+4.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Steady performance increase <TrendingUpIcon className="size-4" />
					</div>
					<div className="text-muted-foreground">Meets growth projections</div>
				</CardFooter>
			</Card>
		</div>
	);
}
