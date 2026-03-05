import { headers } from "next/headers";
import { cache } from "react";

const getDeviceTypeCached = cache(async (): Promise<"mobile" | "desktop"> => {
	const headersList = await headers();
	const deviceType = headersList.get("x-device-type");
	return deviceType === "mobile" ? "mobile" : "desktop";
});

export async function getDeviceType(): Promise<"mobile" | "desktop"> {
	return getDeviceTypeCached();
}

export async function isMobile(): Promise<boolean> {
	const deviceType = await getDeviceType();
	return deviceType === "mobile";
}
