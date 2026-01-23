import { ArrowRight, HandCoins, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export default function EmptyStateMobile() {
	return (
		<div className="space-y-4 px-4 py-6">
			<Card className="border-2 border-dashed">
				<CardHeader className="pb-4 text-center">
					<div className="bg-primary/10 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full">
						<HandCoins className="text-primary h-7 w-7" />
					</div>
					<CardTitle className="text-lg">Welcome!</CardTitle>
					<CardDescription className="text-xs">
						Start lending or borrowing to see your dashboard
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<Link href={route.private.people}>
						<Card className="active:bg-muted/50 border transition-colors">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
										<Users className="h-5 w-5 text-blue-600" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="mb-0.5 text-sm font-semibold">Connect People</p>
										<p className="text-muted-foreground text-xs">Add contacts to your network</p>
									</div>
									<ArrowRight className="text-muted-foreground h-4 w-4 shrink-0" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href={route.private.lend}>
						<Card className="active:bg-muted/50 border transition-colors">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
										<TrendingUp className="h-5 w-5 text-emerald-600" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="mb-0.5 text-sm font-semibold">Lend Money</p>
										<p className="text-muted-foreground text-xs">Help someone with a loan</p>
									</div>
									<ArrowRight className="text-muted-foreground h-4 w-4 shrink-0" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href={route.private.borrow}>
						<Card className="active:bg-muted/50 border transition-colors">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
										<HandCoins className="h-5 w-5 text-purple-600" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="mb-0.5 text-sm font-semibold">Borrow Money</p>
										<p className="text-muted-foreground text-xs">Request a loan from contacts</p>
									</div>
									<ArrowRight className="text-muted-foreground h-4 w-4 shrink-0" />
								</div>
							</CardContent>
						</Card>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
