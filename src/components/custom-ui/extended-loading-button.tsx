import type { VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";
import React from "react";

import { ExtendedButton, extendedButtonVariants } from "@/components/custom-ui/extended-button";

interface ExtendedLoadingButtonProps
	extends React.ComponentProps<"button">, VariantProps<typeof extendedButtonVariants> {
	isLoading: boolean;
	loadingText: string;
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
	asChild?: boolean;
}

const ExtendedLoadingButton: React.FC<ExtendedLoadingButtonProps> = ({
	isLoading,
	children,
	loadingText,
	disabled = isLoading,
	className,
	...props
}) => {
	return (
		<ExtendedButton type="submit" className={className} disabled={disabled} {...props}>
			{isLoading ? (
				<>
					<Loader className="size-4 animate-spin" aria-hidden="true" />
					{loadingText}
				</>
			) : (
				children
			)}
		</ExtendedButton>
	);
};

export { ExtendedLoadingButton };
