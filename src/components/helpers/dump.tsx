import { cn } from "@/lib/utils";

interface DumpProps<T> {
	className?: string;
	data: T;
	indent?: number;
}

const Dump = <T,>({ className = "p-4 text-sm", data, indent = 4 }: DumpProps<T>) => {
	const formattedData = JSON.stringify(data, null, indent);

	return (
		<pre className={cn(className, "font-mono text-wrap whitespace-pre-wrap")}>{formattedData}</pre>
	);
};

export default Dump;
