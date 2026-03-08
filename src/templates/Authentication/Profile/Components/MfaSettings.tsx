"use client";

import Image from "next/image";
import { Copy, KeyRound, RefreshCw, Shield, ShieldOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
	useMfaBackupCodesMutation,
	useMfaDisableMutation,
	useMfaSetupMutation,
	useMfaSetupVerifyMutation,
	useMfaStatusQuery
} from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";

export default function MfaSettings() {
	const { data: statusData, refetch: refetchStatus } = useMfaStatusQuery();
	const [setup, { isLoading: isSetupLoading }] = useMfaSetupMutation();
	const [setupVerify, { isLoading: isVerifyLoading }] = useMfaSetupVerifyMutation();
	const [disable, { isLoading: isDisableLoading }] = useMfaDisableMutation();
	const [backupCodes, { isLoading: isBackupLoading }] = useMfaBackupCodesMutation();

	const [setupStep, setSetupStep] = useState<"idle" | "qr" | "done">("idle");
	const [setupUri, setSetupUri] = useState("");
	const [setupSecret, setSetupSecret] = useState("");
	const [setupBackupCodes, setSetupBackupCodes] = useState<string[]>([]);
	const [verifyToken, setVerifyToken] = useState("");
	const [qrDataUrl, setQrDataUrl] = useState("");
	const [disablePassword, setDisablePassword] = useState("");
	const [showDisableDialog, setShowDisableDialog] = useState(false);
	const [newBackupCodes, setNewBackupCodes] = useState<string[] | null>(null);

	const enabled = statusData?.data?.enabled ?? false;
	const backupCodesRemaining = statusData?.data?.backupCodesRemaining ?? 0;

	const generateQr = useCallback(async (uri: string) => {
		try {
			const QRCode = (await import("qrcode")).default;
			const url = await QRCode.toDataURL(uri, { width: 200, margin: 2 });
			setQrDataUrl(url);
		} catch {
			toast.error("Could not generate QR code");
		}
	}, []);

	const handleStartSetup = async () => {
		try {
			const res = await setup().unwrap();
			const data = res.data;
			if (!data) return;
			setSetupUri(data.uri);
			setSetupSecret(data.secret);
			setSetupBackupCodes(data.backupCodes);
			setSetupStep("qr");
			await generateQr(data.uri);
		} catch (err: unknown) {
			const e = err as { data?: { message?: string } };
			toast.error(e?.data?.message ?? "Failed to start 2FA setup");
		}
	};

	const handleVerifySetup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!verifyToken.trim() || verifyToken.length < 6) {
			toast.error("Enter the 6-digit code from your app");
			return;
		}
		try {
			await setupVerify({ token: verifyToken }).unwrap();
			toast.success("Two-factor authentication enabled");
			setSetupStep("done");
			setSetupUri("");
			setSetupSecret("");
			setSetupBackupCodes([]);
			setVerifyToken("");
			setQrDataUrl("");
			refetchStatus();
		} catch (err: unknown) {
			const e = err as { data?: { message?: string } };
			toast.error(e?.data?.message ?? "Invalid code");
		}
	};

	const handleCancelSetup = () => {
		setSetupStep("idle");
		setSetupUri("");
		setSetupSecret("");
		setSetupBackupCodes([]);
		setVerifyToken("");
		setQrDataUrl("");
	};

	const handleDisable = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!disablePassword.trim()) {
			toast.error("Enter your password");
			return;
		}
		try {
			await disable({ password: disablePassword }).unwrap();
			toast.success("Two-factor authentication disabled");
			setShowDisableDialog(false);
			setDisablePassword("");
			refetchStatus();
		} catch (err: unknown) {
			const e = err as { data?: { message?: string } };
			toast.error(e?.data?.message ?? "Failed to disable 2FA");
		}
	};

	const handleRegenerateBackupCodes = async () => {
		try {
			const res = await backupCodes().unwrap();
			const codes = res.data?.backupCodes;
			if (codes) setNewBackupCodes(codes);
			toast.success("New backup codes generated. Save them now.");
			refetchStatus();
		} catch (err: unknown) {
			const e = err as { data?: { message?: string } };
			toast.error(e?.data?.message ?? "Failed to generate backup codes");
		}
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text).then(
			() => toast.success(`${label} copied`),
			() => toast.error("Could not copy")
		);
	};

	useEffect(() => {
		if (setupStep === "qr" && setupUri && !qrDataUrl) generateQr(setupUri);
	}, [setupStep, setupUri, qrDataUrl, generateQr]);

	if (setupStep === "qr") {
		return (
			<div className="border-border space-y-4 border-b py-4">
				<div className="flex items-center gap-3">
					<Shield className="text-muted-foreground h-5 w-5" />
					<div>
						<p className="text-foreground font-medium">Complete 2FA setup</p>
						<p className="text-muted-foreground text-sm">
							Scan the QR code with your authenticator app, then enter the 6-digit code below.
						</p>
					</div>
				</div>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
					{qrDataUrl && (
						<div className="bg-muted shrink-0 rounded-lg p-2">
							<Image
								src={qrDataUrl}
								alt="QR code for 2FA"
								width={200}
								height={200}
								unoptimized
							/>
						</div>
					)}
					<div className="min-w-0 flex-1 space-y-2">
						<p className="text-muted-foreground text-xs">Or enter this secret manually:</p>
						<div className="flex gap-2">
							<code className="bg-muted flex-1 truncate rounded px-2 py-1.5 text-xs">
								{setupSecret}
							</code>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={() => copyToClipboard(setupSecret, "Secret")}
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
					<p className="text-foreground text-sm font-medium">Save your backup codes</p>
					<p className="text-muted-foreground mt-1 text-xs">
						Store these in a safe place. Each code can only be used once.
					</p>
					<div className="text-muted-foreground mt-2 flex flex-wrap gap-2 font-mono text-xs">
						{setupBackupCodes.map((code, i) => (
							<span key={i} className="rounded bg-black/10 px-2 py-1 dark:bg-white/10">
								{code}
							</span>
						))}
					</div>
				</div>
				<form onSubmit={handleVerifySetup} className="space-y-2">
					<Label htmlFor="mfa-verify">Verification code</Label>
					<div className="flex gap-2">
						<Input
							id="mfa-verify"
							type="text"
							inputMode="numeric"
							placeholder="000000"
							value={verifyToken}
							onChange={e => setVerifyToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
							className="font-mono tracking-widest"
							maxLength={6}
						/>
						<LoadingButton
							type="submit"
							isLoading={isVerifyLoading}
							loadingText="Verifying..."
							disabled={verifyToken.length !== 6}
						>
							Verify & enable
						</LoadingButton>
						<Button type="button" variant="ghost" onClick={handleCancelSetup}>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<>
			<div className="border-border flex flex-col gap-4 border-b py-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<KeyRound className="text-muted-foreground h-5 w-5" />
						<div>
							<p className="text-foreground font-medium">Two-Factor Authentication</p>
							<p className="text-muted-foreground text-sm">
								{enabled
									? `Enabled · ${backupCodesRemaining} backup code(s) remaining`
									: "Add an extra layer of security"}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{enabled ? (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={handleRegenerateBackupCodes}
									disabled={isBackupLoading}
								>
									<RefreshCw className="mr-1 h-4 w-4" />
									New backup codes
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowDisableDialog(true)}
									disabled={isDisableLoading}
								>
									<ShieldOff className="mr-1 h-4 w-4" />
									Disable 2FA
								</Button>
							</>
						) : (
							<LoadingButton
								onClick={handleStartSetup}
								isLoading={isSetupLoading}
								loadingText="Preparing..."
							>
								<Shield className="mr-1 h-4 w-4" />
								Enable 2FA
							</LoadingButton>
						)}
					</div>
				</div>
				{newBackupCodes !== null && (
					<div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
						<p className="text-foreground text-sm font-medium">New backup codes</p>
						<p className="text-muted-foreground mt-1 text-xs">
							Old codes no longer work. Save these in a safe place.
						</p>
						<div className="text-muted-foreground mt-2 flex flex-wrap gap-2 font-mono text-xs">
							{newBackupCodes.map((code, i) => (
								<span key={i} className="rounded bg-black/10 px-2 py-1 dark:bg-white/10">
									{code}
								</span>
							))}
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="mt-2"
							onClick={() => setNewBackupCodes(null)}
						>
							Done
						</Button>
					</div>
				)}
			</div>

			<AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Disable two-factor authentication</AlertDialogTitle>
						<AlertDialogDescription>
							Enter your password to confirm. Your account will be less secure.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<form onSubmit={handleDisable} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="disable-password">Password</Label>
							<Input
								id="disable-password"
								type="password"
								value={disablePassword}
								onChange={e => setDisablePassword(e.target.value)}
								placeholder="Your password"
								autoComplete="current-password"
							/>
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel type="button">Cancel</AlertDialogCancel>
							<LoadingButton
								type="submit"
								variant="destructive"
								isLoading={isDisableLoading}
								loadingText="Disabling..."
								disabled={!disablePassword.trim()}
							>
								Disable 2FA
							</LoadingButton>
						</AlertDialogFooter>
					</form>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
