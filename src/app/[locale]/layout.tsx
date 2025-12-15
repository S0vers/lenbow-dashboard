import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Noto_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import "./globals.css";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/NextThemesProvider";
import { RedirectProvider } from "@/providers/RedirectProvider";
import ReduxProvider from "@/providers/ReduxProvider";

const notoSans = Noto_Sans({ variable: "--font-sans" });

export const metadata: Metadata = {
	title: {
		template: "%s | Loan Management Application",
		default: "Loan Management Application"
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
		<html lang="en" suppressHydrationWarning className={notoSans.variable}>
			<body className={`antialiased`} suppressHydrationWarning>
				<Suspense fallback={<Loader />}>
					<ReduxProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<RedirectProvider>
								<NextIntlClientProvider>{children}</NextIntlClientProvider>
							</RedirectProvider>
						</ThemeProvider>
					</ReduxProvider>
				</Suspense>
			</body>
		</html>
	);
}
