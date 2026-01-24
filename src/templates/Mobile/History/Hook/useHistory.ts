"use client";

import { useContext } from "react";

import { HistoryContext } from "@/templates/Mobile/History/Provider/HistoryProvider";

export const useHistory = () => {
	const context = useContext(HistoryContext);
	if (context === undefined) {
		throw new Error("useHistory must be used within a HistoryContext");
	}
	return context;
};
