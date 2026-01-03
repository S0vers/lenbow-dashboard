"use client";

import { Clock, Construction, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "@/i18n/navigation";

export default function ComingSoon() {
	const router = useRouter();

	return (
		<div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
			<Card className="w-full max-w-2xl border-2">
				<CardContent className="pt-10 pb-10">
					<div className="flex flex-col items-center space-y-6 text-center">
						{/* Icon */}
						<div className="relative">
							<div className="bg-primary/20 absolute inset-0 rounded-full blur-3xl" />
							<div className="bg-primary/10 relative rounded-full p-6">
								<Construction className="text-primary h-16 w-16" />
							</div>
						</div>

						{/* Heading */}
						<div className="space-y-2">
							<h1 className="text-4xl font-bold tracking-tight">Coming Soon</h1>
							<p className="text-muted-foreground text-xl">
								We&apos;re working on something exciting!
							</p>
						</div>

						{/* Description */}
						<div className="max-w-md space-y-4">
							<p className="text-muted-foreground">
								This feature is currently under development. Our team is working hard to bring you
								an amazing experience.
							</p>

							<div className="flex items-center justify-center gap-6 pt-4">
								<div className="flex items-center gap-2">
									<Clock className="text-primary h-5 w-5" />
									<span className="text-sm font-medium">In Progress</span>
								</div>
								<div className="flex items-center gap-2">
									<Sparkles className="text-primary h-5 w-5" />
									<span className="text-sm font-medium">Coming Soon</span>
								</div>
							</div>
						</div>

						{/* CTA Button */}
						<div className="pt-4">
							<Button variant="outline" onClick={() => router.back()} className="min-w-32">
								Go Back
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
