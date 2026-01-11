import UnifiedAuthProvider from "@/providers/UnifiedAuthProvider";

export default function MobileLayout({ children }: Readonly<GlobalLayoutProps>) {
	return <UnifiedAuthProvider requireAuth>{children}</UnifiedAuthProvider>;
}
