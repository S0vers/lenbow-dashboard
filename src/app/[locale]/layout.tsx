import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/NextThemesProvider";
import { RedirectProvider } from "@/providers/RedirectProvider";
import ReduxProvider from "@/providers/ReduxProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800"],
	variable: "--font-sans"
});

export const metadata: Metadata = {
	title: {
		template: "%s | Lenbow",
		default: "Lenbow | Loan Management Application"
	},
	description: "A comprehensive loan management application to streamline your lending processes."
};

export default async function RootLayout({
	children,
	params
}: Readonly<GlobalLayoutPropsWithLocale>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	return (
		<html
			lang={locale}
			className={`${plusJakartaSans.variable} ${plusJakartaSans.className}`}
			suppressHydrationWarning
		>
			<body className="antialiased" suppressHydrationWarning>
				<ReduxProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<RedirectProvider>
							<NextIntlClientProvider>
								{children}
								<Toaster position="top-right" richColors closeButton />
							</NextIntlClientProvider>
						</RedirectProvider>
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}
