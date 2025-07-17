"use client";

import { ReactNode } from "react";

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    // Simple markdown parser for basic formatting
    const parseMarkdown = (text: string): ReactNode[] => {
        const lines = text.split('\n');
        const elements: ReactNode[] = [];
        let currentIndex = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Headers
            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={currentIndex++} className="text-3xl font-bold mb-6 mt-8 first:mt-0 text-primary border-b border-border pb-2">
                        {parseInlineMarkdown(line.substring(2))}
                    </h1>
                );
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={currentIndex++} className="text-2xl font-semibold mb-4 mt-6 text-foreground">
                        {parseInlineMarkdown(line.substring(3))}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={currentIndex++} className="text-xl font-semibold mb-3 mt-5 text-foreground">
                        {parseInlineMarkdown(line.substring(4))}
                    </h3>
                );
            } else if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={currentIndex++} className="text-lg font-semibold mb-2 mt-4 text-muted-foreground">
                        {parseInlineMarkdown(line.substring(5))}
                    </h4>
                );
            }
            // Code blocks
            else if (line.startsWith('```')) {
                const language = line.substring(3);
                const codeLines: string[] = [];
                i++; // Skip the opening ```

                while (i < lines.length && !lines[i].startsWith('```')) {
                    codeLines.push(lines[i]);
                    i++;
                }

                elements.push(
                    <div key={currentIndex++} className="my-6">
                        {language && (
                            <div className="bg-muted/50 px-3 py-1 text-xs font-mono text-muted-foreground border-b border-border rounded-t-lg">
                                {language}
                            </div>
                        )}
                        <pre className={`bg-slate-900 dark:bg-slate-800 p-4 overflow-x-auto ${language ? 'rounded-b-lg' : 'rounded-lg'} border border-border`}>
                            <code className="text-sm font-mono text-slate-100 dark:text-slate-200">
                                {codeLines.join('\n')}
                            </code>
                        </pre>
                    </div>
                );
            }
            // Tables
            else if (line.includes('|') && line.trim().startsWith('|')) {
                const tableRows: string[] = [line];
                i++;

                // Collect all table rows
                while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
                    tableRows.push(lines[i]);
                    i++;
                }
                i--; // Back up one since the loop will increment

                // Parse table
                const rows = tableRows.map(row =>
                    row.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
                );

                if (rows.length > 1) {
                    const headers = rows[0];
                    const dataRows = rows.slice(2); // Skip header separator row

                    elements.push(
                        <div key={currentIndex++} className="my-6 overflow-x-auto rounded-lg border border-border shadow-sm">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-primary/10 border-b border-border">
                                        {headers.map((header, idx) => (
                                            <th key={idx} className="p-4 text-left font-semibold text-foreground">
                                                {parseInlineMarkdown(header)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataRows.map((row, rowIdx) => (
                                        <tr key={rowIdx} className="border-b border-border hover:bg-muted/30 transition-colors">
                                            {row.map((cell, cellIdx) => (
                                                <td key={cellIdx} className="p-4">
                                                    <code className="text-sm bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                                                        {cell}
                                                    </code>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
            }
            // Lists
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                const listItems: string[] = [line.substring(2)];
                i++;

                while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
                    listItems.push(lines[i].substring(2));
                    i++;
                }
                i--; // Back up one

                elements.push(
                    <ul key={currentIndex++} className="list-disc list-inside my-4 space-y-2 pl-4 border-l-2 border-muted">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="text-sm leading-relaxed text-foreground marker:text-primary">
                                {parseInlineMarkdown(item)}
                            </li>
                        ))}
                    </ul>
                );
            }
            // Numbered lists
            else if (/^\d+\.\s/.test(line)) {
                const listItems: string[] = [line.replace(/^\d+\.\s/, '')];
                i++;

                while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
                    listItems.push(lines[i].replace(/^\d+\.\s/, ''));
                    i++;
                }
                i--; // Back up one

                elements.push(
                    <ol key={currentIndex++} className="list-decimal list-inside my-4 space-y-2 pl-4 border-l-2 border-muted">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="text-sm leading-relaxed text-foreground marker:text-primary">
                                {parseInlineMarkdown(item)}
                            </li>
                        ))}
                    </ol>
                );
            }
            // Blockquotes
            else if (line.startsWith('> ')) {
                elements.push(
                    <blockquote key={currentIndex++} className="border-l-4 border-primary bg-primary/5 pl-4 pr-4 py-2 my-4 italic text-muted-foreground rounded-r-lg">
                        {parseInlineMarkdown(line.substring(2))}
                    </blockquote>
                );
            }
            // Empty lines
            else if (line.trim() === '') {
                // Skip empty lines, spacing is handled by margins
                continue;
            }
            // Regular paragraphs
            else if (line.trim() !== '') {
                elements.push(
                    <p key={currentIndex++} className="mb-4 leading-relaxed">
                        {parseInlineMarkdown(line)}
                    </p>
                );
            }
        }

        return elements;
    };

    // Parse inline markdown (bold, italic, code, links)
    const parseInlineMarkdown = (text: string): ReactNode => {
        const elements: ReactNode[] = [];
        let currentIndex = 0;

        // Split by various markdown patterns while preserving the delimiters
        const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/);

        parts.forEach((part, idx) => {
            if (!part) return;

            // Bold text **text**
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                elements.push(
                    <strong key={`${currentIndex++}-${idx}`} className="font-bold text-foreground">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            // Italic text *text*
            else if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.startsWith('**')) {
                elements.push(
                    <em key={`${currentIndex++}-${idx}`} className="italic text-muted-foreground">
                        {part.slice(1, -1)}
                    </em>
                );
            }
            // Inline code `code`
            else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
                elements.push(
                    <code key={`${currentIndex++}-${idx}`} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono border border-primary/20">
                        {part.slice(1, -1)}
                    </code>
                );
            }
            // Links [text](url)
            else if (part.match(/^\[[^\]]+\]\([^)]+\)$/)) {
                const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (linkMatch) {
                    const [, linkText, linkUrl] = linkMatch;
                    elements.push(
                        <a
                            key={`${currentIndex++}-${idx}`}
                            href={linkUrl}
                            className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {linkText}
                        </a>
                    );
                }
            }
            // Regular text
            else {
                elements.push(part);
            }
        });

        return elements.length === 1 ? elements[0] : <>{elements}</>;
    };

    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            {parseMarkdown(content)}
        </div>
    );
}