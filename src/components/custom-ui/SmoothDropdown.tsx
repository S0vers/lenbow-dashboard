"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type IconComponent = React.ComponentType<{ className?: string }>;

interface SmoothDropdownProps {
	triggerIcon?: IconComponent;
	triggerLabel?: ReactNode;
	children: ReactNode;
	className?: string;
	align?: "left" | "right";
}

const easeOutQuint: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function SmoothDropdown({
	triggerIcon: TriggerIcon,
	triggerLabel,
	children,
	className,
	align = "right"
}: SmoothDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [contentHeight, setContentHeight] = useState(0);

	const containerRef = useRef<HTMLDivElement | null>(null);
	const contentRef = useCallback((node: HTMLDivElement | null) => {
		if (node) {
			const rect = node.getBoundingClientRect();
			setContentHeight(rect.height);
		}
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const openHeight = Math.max(40, Math.ceil(contentHeight) + 12);

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative h-10",
				align === "right" ? "w-auto" : "w-auto",
				className
			)}
		>
			<motion.button
				type="button"
				layout
				initial={false}
				animate={{
					width: isOpen ? 260 : 110,
					height: isOpen ? openHeight : 40,
					borderRadius: isOpen ? 16 : 9999
				}}
				transition={{
					type: "spring",
					damping: 34,
					stiffness: 380,
					mass: 0.8
				}}
				onClick={() => setIsOpen(prev => !prev)}
				className={cn(
					"bg-popover border-border text-foreground shadow-lg inline-flex items-center justify-between overflow-hidden border px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
					align === "right" ? "origin-top-right" : "origin-top-left"
				)}
			>
				{/* Collapsed state */}
				<motion.div
					initial={false}
					animate={{
						opacity: isOpen ? 0 : 1,
						scale: isOpen ? 0.9 : 1
					}}
					transition={{ duration: 0.15, ease: easeOutQuint }}
					className="flex w-full items-center justify-between gap-2"
					style={{ pointerEvents: isOpen ? "none" : "auto" }}
				>
					<span className="inline-flex items-center gap-2">
						{TriggerIcon ? <TriggerIcon className="size-4" /> : null}
						{triggerLabel ? <span>{triggerLabel}</span> : null}
					</span>
					<span className="text-muted-foreground text-xs">▼</span>
				</motion.div>

				{/* Expanded content */}
				<motion.div
					ref={contentRef}
					layout
					initial={false}
					animate={{
						opacity: isOpen ? 1 : 0
					}}
					transition={{
						duration: 0.2,
						delay: isOpen ? 0.08 : 0,
						ease: easeOutQuint
					}}
					className="pointer-events-none absolute inset-x-0 top-0 mt-10 px-2 pb-2"
					style={{
						pointerEvents: isOpen ? "auto" : "none",
						willChange: "transform"
					}}
				>
					<div className="bg-popover/95 border-border/80 max-h-64 overflow-y-auto rounded-2xl border p-2 backdrop-blur">
						{children}
					</div>
				</motion.div>
			</motion.button>
		</div>
	);
}

