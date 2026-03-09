interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
	language: "html" | "css";
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
	return (
		<textarea
			value={value}
			onChange={event => onChange(event.target.value)}
			className="h-full w-full resize-none rounded-md border bg-background px-3 py-2 font-mono text-xs"
			spellCheck={false}
		/>
	);
}

