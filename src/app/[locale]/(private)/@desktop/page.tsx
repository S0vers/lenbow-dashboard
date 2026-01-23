import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import OverviewTemplate from "@/templates/Desktop/Overview/OverviewTemplate";

export default function Dashboard() {
	return (
		<>
			<SetBreadcrumb items={[{ name: "Dashboard", isCurrent: true }]} />
			<OverviewTemplate />
		</>
	);
}
