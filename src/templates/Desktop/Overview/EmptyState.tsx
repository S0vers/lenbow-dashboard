import { ArrowRight, FileText, HandCoins, Plus, TrendingUp, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface EmptyStateProps {
	onAddTransaction?: () => void;
}

export default function EmptyState({ onAddTransaction }: EmptyStateProps) {
	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<Card className="rounded-2xl border-2 border-dashed border-border">
				<CardHeader className="pb-4 text-center">
					<div className="from-primary/20 to-primary/5 ring-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br ring-2">
						<HandCoins className="text-primary h-8 w-8" />
					</div>
					<CardTitle className="gradient-text text-2xl md:text-3xl">Welcome to Your Dashboard!</CardTitle>
					<CardDescription className="text-base md:text-lg">
						Start lending or borrowing to see your activity and insights here.
					</CardDescription>
					<div className="mt-5 flex flex-wrap items-center justify-center gap-3">
						{onAddTransaction && (
							<Button
								onClick={onAddTransaction}
								className="min-w-[140px] rounded-full shadow-md [&_svg]:size-5"
								size="pill"
							>
								<Plus className="mr-2" />
								Add transaction
							</Button>
						)}
						<Button
							asChild
							variant="outline"
							className="min-w-[120px] rounded-full shadow-sm [&_svg]:size-5"
							size="pill"
						>
							<Link href={route.private.requests}>
								<FileText className="mr-2" />
								New request
							</Link>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="metric-card-hover group cursor-default">
							<CardHeader className="pb-4">
								<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 transition-transform duration-200 group-hover:scale-110">
									<Users className="h-5 w-5 text-blue-600" />
								</div>
								<CardTitle className="text-base">Connect People</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4 text-sm">
									Add friends and family to your network to start lending or borrowing.
								</p>
								<Link href={route.private.people}>
									<Button size="sm" variant="outline" className="w-full">
										Go to People
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card className="metric-card-hover group cursor-default">
							<CardHeader className="pb-4">
								<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 transition-transform duration-200 group-hover:scale-110">
									<TrendingUp className="h-5 w-5 text-emerald-600" />
								</div>
								<CardTitle className="text-base">Lend Money</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4 text-sm">
									Help someone by lending money and track repayments easily.
								</p>
								<Link href={route.private.lend}>
									<Button size="sm" variant="outline" className="w-full">
										Start Lending
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</CardContent>
						</Card>

						<Card className="metric-card-hover group cursor-default">
							<CardHeader className="pb-4">
								<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15 transition-transform duration-200 group-hover:scale-110">
									<HandCoins className="h-5 w-5 text-purple-600" />
								</div>
								<CardTitle className="text-base">Borrow Money</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4 text-sm">
									Request a loan from your contacts when you need financial help.
								</p>
								<Link href={route.private.borrow}>
									<Button size="sm" variant="outline" className="w-full">
										Request Loan
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</CardContent>
						</Card>
					</div>

					<Card className="bg-muted/50">
						<CardContent className="pt-6">
							<div className="flex flex-col items-center gap-4 md:flex-row">
								<div className="flex-1">
									<h3 className="mb-1 text-lg font-semibold">Need help getting started?</h3>
									<p className="text-muted-foreground text-base">
										Check out our guide to learn how to manage loans effectively.
									</p>
								</div>
								<Button variant="default">
									View Guide
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</CardContent>
			</Card>
		</div>
	);
}
