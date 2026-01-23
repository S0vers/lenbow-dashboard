"use client";

import type React from "react";
import { useState } from "react";

// Import User type

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

import { getUserInitials } from "@/core/helper";

interface UpdateProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User;
	onSubmit: (data: { name: string; avatar: string }) => void;
}

export default function UpdateProfileModal({
	open,
	onOpenChange,
	user,
	onSubmit
}: UpdateProfileModalProps) {
	const [name, setName] = useState(user.name);
	const [avatar, setAvatar] = useState(user.image);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await new Promise(resolve => setTimeout(resolve, 500));
			// onSubmit({ name, avatar });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setName(user.name);
			setAvatar(user.image);
		}
		onOpenChange(newOpen);
	};

	return (
		<ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
			<ResponsiveDialogContent className="max-w-md p-4 sm:w-full sm:p-6">
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle className="text-xl sm:text-2xl">
						Edit Profile
					</ResponsiveDialogTitle>
					<ResponsiveDialogDescription className="text-sm sm:text-base">
						Update your profile information and avatar
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
					<div className="flex justify-center py-2">
						<Avatar className="h-16 w-16 sm:h-20 sm:w-20">
							<AvatarImage src={avatar || undefined} alt={name || user.email} />
							<AvatarFallback>{getUserInitials(name)}</AvatarFallback>
						</Avatar>
					</div>

					<div className="space-y-2">
						<Label htmlFor="full-name" className="text-sm sm:text-base">
							Full Name
						</Label>
						<Input
							id="full-name"
							value={name || ""}
							onChange={e => setName(e.target.value)}
							placeholder="Enter your full name"
							className="text-sm sm:text-base"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="avatar-url" className="text-sm sm:text-base">
							Avatar URL
						</Label>
						<Input
							id="avatar-url"
							type="url"
							value={avatar || ""}
							onChange={e => setAvatar(e.target.value)}
							placeholder="https://example.com/avatar.jpg"
							className="text-sm sm:text-base"
						/>
					</div>

					<div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3 sm:pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isLoading}
							className="w-full text-sm sm:w-auto sm:text-base"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full text-sm sm:w-auto sm:text-base"
						>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
