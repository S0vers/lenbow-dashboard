"use client";

import { Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface DeleteButtonProps {
	deleteText: string;
	cancelText?: string;
	countdownSeconds?: number;
	onConfirm: () => void | Promise<void>;
	onCancel?: () => void;
	disabled?: boolean;
	className?: string;
}

export function DeleteButton({
	deleteText,
	cancelText = "Cancel Deletion",
	countdownSeconds = 10,
	onConfirm,
	onCancel,
	disabled = false,
	className
}: DeleteButtonProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [count, setCount] = useState(countdownSeconds);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (!isDeleting) return;
		if (count <= 0) {
			void Promise.resolve(onConfirm()).finally(() => setIsDeleting(false));
			return;
		}
		const timer = setTimeout(() => setCount(c => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [isDeleting, count, onConfirm]);

	const handleClick = (newState: boolean) => {
		if (isAnimating || disabled) return;
		setIsAnimating(true);
		setIsDeleting(newState);
		if (newState) setCount(countdownSeconds);
		if (!newState) onCancel?.();
		setTimeout(() => setIsAnimating(false), 400);
	};

	return (
		<div className={cn("flex items-center justify-center", className)}>
			<AnimatePresence mode="popLayout" initial={false}>
				{!isDeleting ? (
					<motion.button
						key="delete"
						layoutId="deleteButton"
						type="button"
						onClick={() => handleClick(true)}
						whileTap={{ scale: 0.95 }}
						style={{ pointerEvents: isAnimating ? "none" : "auto" }}
						initial={{ filter: "blur(1px)", opacity: 1 }}
						animate={{ filter: "blur(0px)", opacity: 1 }}
						exit={{ filter: "blur(1px)", opacity: 0 }}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-medium shadow-md transition-colors disabled:opacity-50"
						transition={{
							layout: { duration: 0.4, ease: [0.77, 0, 0.175, 1] },
							backgroundColor: { duration: 0.4, ease: "easeInOut" },
							filter: { duration: 0.1, ease: "easeInOut" },
							opacity: { duration: 0.2, ease: "easeOut" }
						}}
						disabled={disabled}
					>
						<motion.span
							layoutId="buttonText"
							className="flex"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.1 }}
						>
							{deleteText.split("").map((char, i) => (
								<motion.span
									key={`delete-${i}`}
									initial={{ y: 20, opacity: 0, scale: 0.3 }}
									animate={{ y: 0, opacity: 1, scale: 1 }}
									exit={{ y: -20, opacity: 0, scale: 0.3 }}
									transition={{
										duration: 0.3,
										delay: i * 0.005,
										ease: [0.785, 0.135, 0.15, 0.86]
									}}
									style={{ display: "inline-block", whiteSpace: "pre" }}
								>
									{char}
								</motion.span>
							))}
						</motion.span>
					</motion.button>
				) : (
					<motion.button
						key="cancel"
						layoutId="deleteButton"
						type="button"
						onClick={() => handleClick(false)}
						whileTap={{ scale: 0.95 }}
						style={{ pointerEvents: isAnimating ? "none" : "auto" }}
						initial={{ filter: "blur(1px)", opacity: 0 }}
						animate={{ filter: "blur(0px)", opacity: 1 }}
						exit={{ filter: "blur(1px)", opacity: 0 }}
						className="bg-destructive/10 text-destructive hover:bg-destructive/20 flex h-10 items-center gap-2 rounded-full px-4 py-3 text-base font-medium transition-colors"
						transition={{
							layout: { duration: 0.4, ease: [0.77, 0, 0.175, 1] },
							backgroundColor: { duration: 0.4, ease: "easeInOut" },
							filter: { duration: 0.2, ease: "easeInOut" },
							opacity: { duration: 0.2, ease: "easeIn" }
						}}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
							transition={{ duration: 0.2, delay: 0.05 }}
							className="bg-destructive text-destructive-foreground flex shrink-0 rounded-full p-1.5"
						>
							<Undo2 className="size-4" />
						</motion.div>
						<motion.span
							layoutId="buttonText"
							className="text-destructive flex font-medium"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.1 }}
						>
							{cancelText.split("").map((char, i) => (
								<motion.span
									key={`cancel-${i}`}
									initial={{ y: 20, opacity: 0, scale: 0.3 }}
									animate={{ y: 0, opacity: 1, scale: 1 }}
									exit={{ y: -20, opacity: 0, scale: 0.3 }}
									transition={{
										duration: 0.3,
										delay: i * 0.006,
										ease: [0.785, 0.135, 0.15, 0.86]
									}}
									style={{ display: "inline-block", whiteSpace: "pre" }}
								>
									{char}
								</motion.span>
							))}
						</motion.span>
						<motion.div
							className="bg-destructive text-destructive-foreground relative flex min-w-[32px] shrink-0 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
							transition={{ duration: 0.2, delay: 0.1 }}
						>
							<AnimatePresence mode="popLayout">
								<motion.span
									key={count}
									initial={{ opacity: 0, y: 10, scale: 0.8 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: -10, scale: 0.8 }}
									transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
									className="absolute inset-0 flex items-center justify-center"
								>
									{count}
								</motion.span>
							</AnimatePresence>
						</motion.div>
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
}
