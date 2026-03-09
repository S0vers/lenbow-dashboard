import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import TemplatesTemplate from "@/templates/Desktop/Templates/TemplatesTemplate";

export default function Templates() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Templates", isCurrent: true }
				]}
			/>
			<TemplatesTemplate />
		</>
	);
}

