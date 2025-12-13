import Image from "next/image";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1 className="text-5xl font-bold">Welcome to Next.js!</h1>
			<p className="mt-4 text-lg">
				Get started by editing <code>src/app/page.tsx</code>
			</p>
			<div className="mt-8">
				<Image src="/next.svg" alt="Next.js Logo" width={200} height={200} />
			</div>
		</main>
	);
}
