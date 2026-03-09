"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";

import { useMfaVerifyMutation } from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";
import { useRouter } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export default function MfaVerifyPage() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const redirectParam = searchParams.get("redirect");
	const userIdParam = searchParams.get("userId");

	const [token, setToken] = useState("");

	const [verifyMfa, { isLoading }] = useMfaVerifyMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const parsedUserId = Number(userIdParam);

		if (!userIdParam || Number.isNaN(parsedUserId) || parsedUserId <= 0) {
			toast.error("Your session for 2FA verification has expired. Please log in again.");
			router.push(route.protected.login);
			return;
		}

		const trimmedToken = token.trim();

		if (!trimmedToken) {
			toast.error("Enter your 2FA code or backup code.");
			return;
		}

		try {
			const response = await verifyMfa({
				userId: parsedUserId,
				token: trimmedToken.replace(/\s/g, "")
			}).unwrap();

			if (response.data?.verified) {
				toast.success("Two-factor verification successful.");
				router.push(redirectParam || route.private.dashboard);
			} else {
				toast.error("Verification failed. Please try again.");
			}
		} catch (error: unknown) {
			const err = error as { data?: { message?: string } };
			toast.error(err?.data?.message || "Invalid 2FA token or backup code.");
		}
	};

	return (
		<main className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-br px-4">
			<div className="w-full max-w-md">
				<div className="border-border/60 bg-background/90 space-y-6 rounded-3xl border p-8 shadow-xl backdrop-blur-xl">
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="from-primary/10 to-primary/5 ring-primary/10 mb-2 flex size-12 items-center justify-center rounded-2xl bg-linear-to-br ring-1">
							<ShieldCheck className="text-primary h-6 w-6" />
						</div>
						<h1 className="text-foreground text-2xl font-semibold tracking-tight">
							Two-factor verification
						</h1>
						<p className="text-muted-foreground text-sm">
							Enter the 6-digit code from your authenticator app, or a backup code if you don&apos;t
							have access to your app.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="mfa-token">Verification code</Label>
							<Input
								id="mfa-token"
								type="text"
								inputMode="numeric"
								autoComplete="one-time-code"
								placeholder="000000 or XXXX-XXXX"
								value={token}
								onChange={event => setToken(event.target.value.toUpperCase())}
								className="h-11 font-mono text-center tracking-widest"
								maxLength={9}
							/>
						</div>

						<div className="space-y-2 text-xs text-muted-foreground">
							<p>Codes are time-based and change every 30 seconds.</p>
							<p>Backup codes are one-time use. Once used, they cannot be reused.</p>
						</div>

						<div className="flex gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								className="h-11 flex-1"
								onClick={() => router.push(route.protected.login)}
								disabled={isLoading}
							>
								Back to login
							</Button>
							<LoadingButton
								type="submit"
								className="h-11 flex-1 font-semibold"
								size="lg"
								isLoading={isLoading}
								loadingText="Verifying..."
								disabled={!token.trim()}
							>
								Verify & continue
							</LoadingButton>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
}
