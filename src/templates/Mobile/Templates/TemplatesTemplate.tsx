import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmailTemplatesListQuery } from "@/redux/APISlices/EmailTemplatesAPISlice";

export default function TemplatesTemplate() {
	const { data, isLoading } = useEmailTemplatesListQuery();

	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<header className="flex flex-col gap-1">
				<h1 className="text-lg font-semibold">Email templates</h1>
				<p className="text-xs text-muted-foreground">
					Build and preview templates on the go.
				</p>
			</header>

			<Card className="flex flex-1 flex-col gap-3 p-3">
				<Tabs defaultValue="builder" className="flex h-full flex-col">
					<TabsList className="w-full">
						<TabsTrigger className="flex-1" value="builder">
							Builder
						</TabsTrigger>
						<TabsTrigger className="flex-1" value="raw_html">
							Raw HTML
						</TabsTrigger>
					</TabsList>
					<TabsContent value="builder" className="mt-3 flex-1">
						<div className="h-full rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
							Block-based builder UI will go here.
						</div>
					</TabsContent>
					<TabsContent value="raw_html" className="mt-3 flex-1">
						<div className="h-full rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
							Raw HTML/CSS editor UI will go here.
						</div>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}

