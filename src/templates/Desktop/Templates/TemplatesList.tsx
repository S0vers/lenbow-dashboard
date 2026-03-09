"use client";

import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { route } from "@/routes/routes";
import { useRouter } from "@/i18n/navigation";
import { useEmailTemplatesListQuery } from "@/redux/APISlices/EmailTemplatesAPISlice";

export default function TemplatesList() {
	const router = useRouter();
	const { data: listResponse, isLoading } = useEmailTemplatesListQuery();
	const templates = listResponse?.data ?? [];

	return (
		<div className="flex h-full flex-col gap-4">
			<Card className="flex flex-col gap-3 p-4">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div>
						<h2 className="text-sm font-semibold">Email templates</h2>
						<p className="text-muted-foreground text-xs">
							Manage, duplicate, and open templates in the builder.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Button size="sm" onClick={() => router.push(route.private.templates)} className="text-xs">
							New template
						</Button>
						<span className="text-muted-foreground text-xs">
							{templates.length} template{templates.length === 1 ? "" : "s"}
						</span>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[40%]">Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Last sent</TableHead>
								<TableHead>Updated</TableHead>
								<TableHead className="w-[80px]" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
										Loading templates...
									</TableCell>
								</TableRow>
							) : templates.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
										No templates yet. Create your first one from here or the builder page.
									</TableCell>
								</TableRow>
							) : (
								templates.map(template => (
									<TableRow key={template.id}>
										<TableCell>
											<div className="flex flex-col gap-0.5">
												<span className="text-sm font-medium">{template.name}</span>
												{template.description && (
													<span className="text-muted-foreground line-clamp-1 text-xs">
														{template.description}
													</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className="text-xs capitalize">
												{template.type === "builder" ? "Builder" : "Raw HTML"}
											</Badge>
										</TableCell>
										<TableCell>
											{template.category ? (
												<Badge variant="outline" className="text-xs">
													{template.category}
												</Badge>
											) : (
												<span className="text-muted-foreground text-xs">—</span>
											)}
										</TableCell>
										<TableCell>
											{template.lastSentAt ? (
												<span className="text-xs">
													{format(new Date(template.lastSentAt), "MMM dd, yyyy")}
												</span>
											) : (
												<span className="text-muted-foreground text-xs">Never</span>
											)}
										</TableCell>
										<TableCell>
											<span className="text-muted-foreground text-xs">
												{format(new Date(template.updatedAt), "MMM dd, yyyy")}
											</span>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="outline"
												size="sm"
												className="text-[11px]"
												onClick={() =>
													router.push(
														`${route.private.templates}?templateId=${encodeURIComponent(template.id)}`
													)
												}
											>
												Edit
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</Card>
		</div>
	);
}

