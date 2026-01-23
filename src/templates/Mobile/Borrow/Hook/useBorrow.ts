"use client";

import { useContext } from "react";

import { BorrowContext } from "@/templates/Mobile/Borrow/Provider/BorrowProvider";

export const useBorrow = () => {
	const context = useContext(BorrowContext);
	if (context === undefined) {
		throw new Error("useBorrow must be used within an BorrowContext");
	}
	return context;
};
