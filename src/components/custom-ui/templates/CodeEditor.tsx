import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
	language: "html" | "css";
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
	return (
		<Textarea
			value={value}
			onChange={event => onChange(event.target.value)}
			spellCheck={false}
			className="min-h-[260px] font-mono text-sm leading-snug"
		/>
	);
}

