"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success";

interface StatusButtonProps {
	idleLabel?: string;
	loadingLabel?: string;
	successLabel?: string;
	onClick: () => void | Promise<void>;
	disabled?: boolean;
	className?: string;
	successDuration?: number;
	variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
	type?: "button" | "submit";
	children?: React.ReactNode;
}

export function StatusButton({
	idleLabel = "Save",
	loadingLabel = "Saving",
	successLabel = "Saved",
	onClick,
	disabled = false,
	className,
	successDuration = 2000,
	variant = "default",
	type = "button",
	children
}: StatusButtonProps) {
	const [status, setStatus] = useState<Status>("idle");

	const displayText = useMemo(() => {
		switch (status) {
			case "idle":
				return typeof children === "string" ? children : idleLabel;
			case "loading":
				return loadingLabel;
			case "success":
				return successLabel;
		}
	}, [status, idleLabel, loadingLabel, successLabel, children]);

	const handleClick = async () => {
		if (status !== "idle" || disabled) return;
		setStatus("loading");
		try {
			await Promise.resolve(onClick());
			setStatus("success");
			setTimeout(() => setStatus("idle"), successDuration);
		} catch {
			setStatus("idle");
		}
	};

	return (
		<div className={cn("relative inline-flex font-sans", className)}>
			<Button
				type={type}
				onClick={handleClick}
				variant={variant}
				disabled={status !== "idle" || disabled}
				className={cn(
					"relative h-10 min-w-[140px] rounded-full px-6 text-base font-medium transition-all duration-300",
					status !== "idle" &&
						"cursor-not-allowed border-muted bg-muted text-muted-foreground hover:bg-muted opacity-100"
				)}
			>
				<span className="flex items-center justify-center">
					<AnimatePresence mode="popLayout" initial={false}>
						{displayText.split("").map((char, i) => (
							<motion.span
								key={`${status}-${i}-${char}`}
								layout
								initial={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
								animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
								exit={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
									mass: 1
								}}
								className="inline-block"
							>
								{char}
							</motion.span>
						))}
					</AnimatePresence>
				</span>
			</Button>

			<div className={cn("pointer-events-none absolute -right-1 -top-1 z-10")}>
				<AnimatePresence mode="wait">
					{status !== "idle" && (
						<motion.div
							initial={{ opacity: 0, scale: 0, x: -8, filter: "blur(4px)" }}
							animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
							exit={{ opacity: 0, scale: 0, x: -8, filter: "blur(4px)" }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
							className={cn(
								"ring-muted flex size-6 items-center justify-center overflow-visible rounded-full ring-2",
								status === "success"
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground"
							)}
						>
							<AnimatePresence mode="popLayout">
								{status === "loading" && (
									<motion.div
										key="loader"
										initial={{ opacity: 1 }}
										animate={{ opacity: 1 }}
										exit={{ scale: 0, opacity: 0 }}
										transition={{ duration: 0.2 }}
										className="absolute inset-0 flex items-center justify-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											className="size-4 animate-spin"
										>
											<circle
												cx="12"
												cy="12"
												r="10"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeOpacity="0.25"
											/>
											<path
												fill="currentColor"
												d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z"
											/>
										</svg>
									</motion.div>
								)}
								{status === "success" && (
									<motion.div
										key="check"
										initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
										animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
										exit={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
										transition={{ type: "spring", stiffness: 500, damping: 25 }}
										className="absolute inset-0 flex items-center justify-center"
									>
										<Check className="size-4" />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
