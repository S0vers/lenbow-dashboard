import { Button } from "@/components/ui/button";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export default function PageNotFound() {
	return (
		<main className="bg-background grid h-screen min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
			<div className="text-center">
				<p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">404</p>
				<h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
					Page Not Found
				</h1>
				<p className="text-muted-foreground mt-6 text-base leading-7">
					The page you are looking for does not exist.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Button asChild>
						<Link href={route.private.dashboard}>Go to dashboard</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
