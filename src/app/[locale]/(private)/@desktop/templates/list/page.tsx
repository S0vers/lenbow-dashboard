import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import TemplatesList from "@/templates/Desktop/Templates/TemplatesList";

export default function TemplatesListPage() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Templates", href: route.private.templates },
					{ name: "List", isCurrent: true }
				]}
			/>
			<TemplatesList />
		</>
	);
}

