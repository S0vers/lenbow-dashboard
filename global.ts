import bnMessages from "./messages/bn.json";
import enMessages from "./messages/en.json";
import { routing } from "@/i18n/routing";

// Create a union type of all message structures to ensure type safety across locales
type Messages = typeof enMessages & typeof bnMessages;

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: Messages;
	}
}
