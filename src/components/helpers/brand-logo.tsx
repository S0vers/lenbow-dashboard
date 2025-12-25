"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
	/**
	 * Width of the logo. Can be a number (px) or string with units
	 * @default "auto"
	 */
	width?: number | string;
	/**
	 * Height of the logo. Can be a number (px) or string with units
	 * @default "auto"
	 */
	height?: number | string;
	/**
	 * Size preset for common use cases
	 * @default "md"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	/**
	 * Additional CSS classes
	 */
	className?: string;
	/**
	 * Color theme for the logo
	 * @default "default"
	 */
	theme?: "white" | "dark";
	/**
	 * Logo variant - full logo with text or mini icon only
	 * @default "full"
	 */
	variant?: "full" | "mini";
	/**
	 * Whether the logo should be clickable (adds hover effects)
	 * @default false
	 */
	interactive?: boolean;
	/**
	 * Click handler for interactive logos
	 */
	onClick?: () => void;
	/**
	 * Alt text for accessibility
	 * @default "Loan App"
	 */
	alt?: string;
	/**
	 * Priority loading for above-the-fold logos
	 * @default false
	 */
	priority?: boolean;
}

// Size presets for full logo (approximately 4.5:1 ratio)
const fullLogoSizePresets = {
	xs: { width: 90, height: 20 },
	sm: { width: 112, height: 25 },
	md: { width: 150, height: 33 },
	lg: { width: 180, height: 40 },
	xl: { width: 225, height: 50 },
	"2xl": { width: 270, height: 60 }
};

// Size presets for mini logo (approximately 1:1 ratio)
const miniLogoSizePresets = {
	xs: { width: 20, height: 20 },
	sm: { width: 24, height: 24 },
	md: { width: 32, height: 32 },
	lg: { width: 40, height: 40 },
	xl: { width: 48, height: 48 },
	"2xl": { width: 56, height: 56 }
};

// Theme to logo mapping
const logoSources = {
	full: {
		dark: "/images/logo.webp",
		white: "/images/logo.webp"
	},
	mini: {
		dark: "/images/logo.webp",
		white: "/images/logo.webp"
	}
};

export const BrandLogo = React.forwardRef<HTMLDivElement | HTMLButtonElement, BrandLogoProps>(
	(
		{
			width,
			height,
			size = "md",
			className,
			theme = "default",
			variant = "full",
			interactive = false,
			onClick,
			alt = "Loan App",
			priority = false,
			...props
		},
		ref
	) => {
		// Determine dimensions based on variant
		const sizePresets = variant === "mini" ? miniLogoSizePresets : fullLogoSizePresets;
		const preset = sizePresets[size];

		const dimensions = React.useMemo(() => {
			if (width || height) {
				return {
					width:
						typeof width === "number"
							? width
							: Number.parseInt(width?.toString() || "0") || preset.width,
					height:
						typeof height === "number"
							? height
							: Number.parseInt(height?.toString() || "0") || preset.height
				};
			}
			return {
				width: preset.width,
				height: preset.height
			};
		}, [width, height, preset]);

		// Get logo source based on variant and theme
		const logoSrc =
			logoSources[variant][theme as keyof (typeof logoSources)[typeof variant]] ||
			logoSources[variant]["dark"];

		const Component = interactive && onClick ? "button" : "div";

		return (
			<Component
				ref={ref as any}
				className={cn(
					"flex items-center justify-center select-none",
					interactive && "rounded-md focus:opacity-80",
					interactive && onClick && "cursor-pointer",
					className
				)}
				onClick={onClick}
				role={interactive ? "button" : undefined}
				tabIndex={interactive ? 0 : undefined}
				aria-label={alt}
				{...props}
			>
				<Image
					src={logoSrc || "/placeholder.svg"}
					alt={alt}
					width={dimensions.width}
					height={dimensions.height}
					priority={priority}
					className="object-contain"
					style={{
						width: typeof width === "string" ? width : `${dimensions.width}px`,
						height: typeof height === "string" ? height : `${dimensions.height}px`
					}}
				/>
			</Component>
		);
	}
);

BrandLogo.displayName = "BrandLogo";

// Convenience components for specific themes and variants
export const BrandLogoWhite = React.forwardRef<
	HTMLDivElement | HTMLButtonElement,
	Omit<BrandLogoProps, "theme">
>((props, ref) => <BrandLogo ref={ref} {...props} theme="white" />);

export const BrandLogoDark = React.forwardRef<
	HTMLDivElement | HTMLButtonElement,
	Omit<BrandLogoProps, "theme">
>((props, ref) => <BrandLogo ref={ref} {...props} theme="dark" />);

export const BrandLogoMini = React.forwardRef<
	HTMLDivElement | HTMLButtonElement,
	Omit<BrandLogoProps, "variant">
>((props, ref) => <BrandLogo ref={ref} {...props} variant="mini" />);

export const BrandLogoMiniWhite = React.forwardRef<
	HTMLDivElement | HTMLButtonElement,
	Omit<BrandLogoProps, "theme" | "variant">
>((props, ref) => <BrandLogo ref={ref} {...props} theme="white" variant="mini" />);

BrandLogoWhite.displayName = "BrandLogoWhite";
BrandLogoDark.displayName = "BrandLogoDark";
BrandLogoMini.displayName = "BrandLogoMini";
BrandLogoMiniWhite.displayName = "BrandLogoMiniWhite";
