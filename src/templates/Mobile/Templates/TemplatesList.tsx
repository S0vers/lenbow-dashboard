"use client";

import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { route } from "@/routes/routes";
import { useRouter } from "@/i18n/navigation";
import { useEmailTemplatesListQuery } from "@/redux/APISlices/EmailTemplatesAPISlice";

export default function TemplatesList() {
	const router = useRouter();
	const { data: listResponse, isLoading } = useEmailTemplatesListQuery();
	const templates = listResponse?.data ?? [];

	return (
		<div className="flex h-full flex-col gap-3 p-4">
			<div className="flex items-center justify-between gap-2">
				<div>
					<h2 className="text-sm font-semibold">Email templates</h2>
					<p className="text-muted-foreground text-xs">Tap a template to open it in the builder.</p>
				</div>
				<Button size="sm" onClick={() => router.push(route.private.templates)} className="text-xs">
					New
				</Button>
			</div>

			{isLoading ? (
				<Card className="flex items-center justify-center py-8 text-xs text-muted-foreground">
					Loading templates...
				</Card>
			) : templates.length === 0 ? (
				<Card className="flex flex-col items-center justify-center gap-2 py-8 text-center">
					<p className="text-xs text-muted-foreground">
						No templates yet. Create your first one from here or the builder.
					</p>
				</Card>
			) : (
				<div className="flex flex-col gap-2">
					{templates.map(template => (
						<Card
							key={template.id}
							className="flex flex-col gap-1 p-3"
							onClick={() =>
								router.push(
									`${route.private.templates}?templateId=${encodeURIComponent(template.id)}`
								)
							}
						>
							<div className="flex items-center justify-between gap-2">
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-medium">{template.name}</span>
									{template.description && (
										<span className="text-muted-foreground line-clamp-1 text-xs">
											{template.description}
										</span>
									)}
								</div>
								<Badge variant="secondary" className="text-[10px] capitalize">
									{template.type === "builder" ? "Builder" : "Raw HTML"}
								</Badge>
							</div>
							<div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
								<span>
									Updated {format(new Date(template.updatedAt), "MMM dd, yyyy")}
								</span>
								<span>
									Last sent{" "}
									{template.lastSentAt
										? format(new Date(template.lastSentAt), "MMM dd, yyyy")
										: "never"}
								</span>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

