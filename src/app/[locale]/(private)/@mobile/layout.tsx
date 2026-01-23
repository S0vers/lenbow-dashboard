import MobileHeader from "@/layout/Mobile/MobileHeader";
import { MobileNavBar } from "@/layout/Mobile/MobileNavBar";
import UnifiedAuthProvider from "@/providers/UnifiedAuthProvider";

export default function MobileLayout({ children }: Readonly<GlobalLayoutProps>) {
	return (
		<UnifiedAuthProvider requireAuth>
			<div className="flex min-h-screen flex-col">
				<MobileHeader />
				<div className="bg-muted/20 flex-1 pb-20">{children}</div>
			</div>
			<MobileNavBar />
		</UnifiedAuthProvider>
	);
}
