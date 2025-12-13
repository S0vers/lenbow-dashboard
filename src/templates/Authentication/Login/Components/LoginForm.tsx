"use client";

import { useTransition } from "react";
import { FaGoogle } from "react-icons/fa6";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { LoadingButton } from "@/components/ui/loading-button";

import useRedirect from "@/hooks/use-redirect";
import { apiRoute, route } from "@/routes/routes";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const [isPending, startTransition] = useTransition();
	const { redirectUrl } = useRedirect();

	const googleOauthRedirectUrl = redirectUrl
		? redirectUrl
		: encodeURIComponent(process.env.NEXT_PUBLIC_FRONTEND_URL + route.private.dashboard);

	const handleGoogleLogin = () => {
		startTransition(() => {
			window.location.href = `${process.env.NEXT_PUBLIC_API_URL + apiRoute.googleLogin}?redirect=${googleOauthRedirectUrl}`;
		});
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>Login with your Google account</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<FieldGroup>
							<Field>
								<LoadingButton
									isLoading={isPending}
									loadingText="Logging in..."
									variant="outline"
									type="button"
									onClick={handleGoogleLogin}
								>
									<FaGoogle />
									Login with Google
								</LoadingButton>
							</Field>
							{/* <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or continue with
							</FieldSeparator>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input id="email" type="email" placeholder="m@example.com" required />
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
										Forgot your password?
									</a>
								</div>
								<Input id="password" type="password" required />
							</Field>
							<Field>
								<Button type="submit">Login</Button>
								<FieldDescription className="text-center">
									Don&apos;t have an account? <a href="#">Sign up</a>
								</FieldDescription>
							</Field> */}
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
				<a href="#">Privacy Policy</a>.
			</FieldDescription>
		</div>
	);
}
