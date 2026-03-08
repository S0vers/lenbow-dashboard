import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import BudgetTemplate from "@/templates/Desktop/Budget/BudgetTemplate";

export default function Budget() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Budget", isCurrent: true }
				]}
			/>
			<BudgetTemplate />
		</>
	);
}
