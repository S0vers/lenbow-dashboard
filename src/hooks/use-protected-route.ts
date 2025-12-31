"use client";

import { usePathname } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export default function useProtectedRoute() {
	const pathname = usePathname();

	// Get all protected routes from the routes configuration
	const protectedRoutes = Object.values(route.protected);

	// Check if the current route is a protected route
	// Protected routes are those defined in the routes.ts file under route.protected
	const isProtectedRoute = protectedRoutes.some(protectedRoute =>
		pathname.startsWith(protectedRoute)
	);

	return { isProtectedRoute };
}
