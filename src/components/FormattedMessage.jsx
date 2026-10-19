import React from "react";

/**
 * Format math and chemical formulas into clean, readable HTML elements
 * Converts subscripts, superscripts, fractions, arrows, and Greek symbols.
 */
function formatMathOrChemistry(rawStr) {
    if (!rawStr) return "";

    // Normalize common LaTeX macros to Unicode symbols
    let s = rawStr
        .replace(/\\rightarrow/g, " → ")
        .replace(/\\leftarrow/g, " ← ")
        .replace(/\\leftrightarrow/g, " ↔ ")
        .replace(/\\xrightarrow\{([^}]+)\}/g, " —($1)→ ")
        .replace(/\\implies/g, " ⟹ ")
        .replace(/\\propto/g, " ∝ ")
        .replace(/\^\{?\\circ\}?/g, "°")
        .replace(/\\circ/g, "°")
        .replace(/\\degree/g, "°")
        .replace(/\\infty/g, " ∞ ")
        .replace(/\\cdot/g, " · ")
        .replace(/\\times/g, " × ")
        .replace(/\\div/g, " ÷ ")
        .replace(/\\approx/g, " ≈ ")
        .replace(/\\sim/g, " ~ ")
        .replace(/\\le/g, " ≤ ")
        .replace(/\\ge/g, " ≥ ")
        .replace(/\\ne/g, " ≠ ")
        .replace(/\\pm/g, " ± ")
        .replace(/\\Delta/g, "Δ")
        .replace(/\\theta/g, "θ")
        .replace(/\\lambda/g, "λ")
        .replace(/\\pi/g, "π")
        .replace(/\\mu/g, "μ")
        .replace(/\\Omega/g, "Ω")
        .replace(/\\Phi/g, "Φ")
        .replace(/\\alpha/g, "α")
        .replace(/\\beta/g, "β")
        .replace(/\\gamma/g, "γ")
        .replace(/\\rho/g, "ρ")
        .replace(/\\tau/g, "τ")
        .replace(/\\mathcal\{E\}/g, "ℰ")
        .replace(/\\vec\{([^}]+)\}/g, "$1⃗")
        .replace(/\\mathbf\{([^}]+)\}/g, "$1")
        .replace(/\\text\{([^}]+)\}/g, "$1")
        .replace(/\\quad/g, "   ")
        .replace(/\\,/g, " ");

    // Handle simple fractions \frac{num}{den} -> (num / den)
    s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");

    // Tokenize subscripts (_x or _{xyz}) and superscripts (^x or ^{xyz})
    // Regex splits by subscript/superscript patterns
    const tokens = [];
    const subSupRegex = /(_\{([^}]+)\}|_([a-zA-Z0-9+-])|\^\{([^}]+)\}|\^([a-zA-Z0-9+-]))/g;
    let lastIdx = 0;
    let m;

    while ((m = subSupRegex.exec(s)) !== null) {
        if (m.index > lastIdx) {
            tokens.push({ type: "text", val: s.substring(lastIdx, m.index) });
        }
        if (m[2] !== undefined) {
            tokens.push({ type: "sub", val: m[2] });
        } else if (m[3] !== undefined) {
            tokens.push({ type: "sub", val: m[3] });
        } else if (m[4] !== undefined) {
            tokens.push({ type: "sup", val: m[4] });
        } else if (m[5] !== undefined) {
            tokens.push({ type: "sup", val: m[5] });
        }
        lastIdx = m.index + m[0].length;
    }
    if (lastIdx < s.length) {
        tokens.push({ type: "text", val: s.substring(lastIdx) });
    }

    if (tokens.length === 0) return s;

    return tokens.map((t, idx) => {
        if (t.type === "sub") {
            return <sub key={idx} style={{ fontSize: "0.78em", verticalAlign: "sub", lineHeight: 0 }}>{t.val}</sub>;
        }
        if (t.type === "sup") {
            return <sup key={idx} style={{ fontSize: "0.78em", verticalAlign: "super", lineHeight: 0 }}>{t.val}</sup>;
        }
        return <span key={idx}>{t.val}</span>;
    });
}

/**
 * Helper to highlight search term in raw text with <mark> tags
 */
function highlightString(str, term, keyPrefix) {
    if (!term || !term.trim() || typeof str !== "string" || !str) return str;
    const escaped = term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = str.split(regex);
    if (parts.length <= 1) return str;
    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark
                key={`${keyPrefix}_hl_${i}`}
                style={{
                    background: "#f59e0b",
                    color: "#0f172a",
                    padding: "2px 4px",
                    borderRadius: "3px",
                    fontWeight: "600"
                }}
            >
                {part}
            </mark>
        ) : (
            part
        )
    );
}

/**
 * Parses inline formatting:
 * - Code: `code`
 * - Bold: **bold**
 * - Italic: *italic*
 * - Math: $...$
 * - Plain text
 */
function parseInline(text, keyPrefix = "inline", highlightTerm = "") {
    if (!text) return null;

    // Pattern to split by:
    // 1. `code`
    // 2. **bold**
    // 3. *italic*
    // 4. $math$
    const inlineRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\$[^$]+\$)/g;
    const parts = [];
    let lastIdx = 0;
    let m;

    while ((m = inlineRegex.exec(text)) !== null) {
        if (m.index > lastIdx) {
            parts.push({ type: "text", val: text.substring(lastIdx, m.index) });
        }
        const token = m[0];
        if (token.startsWith("`") && token.endsWith("`")) {
            parts.push({ type: "code", val: token.slice(1, -1) });
        } else if (token.startsWith("**") && token.endsWith("**")) {
            parts.push({ type: "bold", val: token.slice(2, -2) });
        } else if (token.startsWith("*") && token.endsWith("*")) {
            parts.push({ type: "italic", val: token.slice(1, -1) });
        } else if (token.startsWith("$") && token.endsWith("$")) {
            parts.push({ type: "math", val: token.slice(1, -1) });
        }
        lastIdx = m.index + m[0].length;
    }
    if (lastIdx < text.length) {
        parts.push({ type: "text", val: text.substring(lastIdx) });
    }

    return parts.map((p, idx) => {
        const k = `${keyPrefix}_${idx}`;
        if (p.type === "code") {
            return (
                <code
                    key={k}
                    style={{
                        background: "rgba(6, 182, 212, 0.15)",
                        color: "#38bdf8",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        fontFamily: "Consolas, Monaco, monospace",
                        fontSize: "0.9em"
                    }}
                >
                    {highlightString(p.val, highlightTerm, k)}
                </code>
            );
        }
        if (p.type === "bold") {
            return (
                <strong key={k} style={{ color: "#ffffff", fontWeight: "700" }}>
                    {parseInline(p.val, `${k}_b`, highlightTerm)}
                </strong>
            );
        }
        if (p.type === "italic") {
            return (
                <em key={k} style={{ color: "rgba(255, 255, 255, 0.9)", fontStyle: "italic" }}>
                    {parseInline(p.val, `${k}_i`, highlightTerm)}
                </em>
            );
        }
        if (p.type === "math") {
            return (
                <span
                    key={k}
                    style={{
                        background: "rgba(139, 92, 246, 0.12)",
                        border: "1px solid rgba(139, 92, 246, 0.25)",
                        color: "#c084fc",
                        padding: "1px 6px",
                        borderRadius: "5px",
                        fontFamily: "Cambria Math, Georgia, serif",
                        display: "inline-block",
                        margin: "0 2px"
                    }}
                >
                    {formatMathOrChemistry(p.val)}
                </span>
            );
        }
        return <span key={k}>{highlightString(p.val, highlightTerm, k)}</span>;
    });
}

/**
 * Checks if a block of lines is a Markdown table:
 * | Col 1 | Col 2 |
 * | :--- | :--- |
 * | val1 | val2 |
 */
function isTableBlock(lines, startIdx) {
    if (startIdx + 1 >= lines.length) return false;
    const line1 = lines[startIdx].trim();
    const line2 = lines[startIdx + 1].trim();
    return line1.startsWith("|") && line1.endsWith("|") && line2.startsWith("|") && line2.includes("---");
}

function parseTable(lines, startIdx) {
    const tableLines = [];
    let cur = startIdx;
    while (cur < lines.length && lines[cur].trim().startsWith("|")) {
        tableLines.push(lines[cur].trim());
        cur++;
    }

    if (tableLines.length < 2) return null;

    const parseRow = (line) =>
        line
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());

    const header = parseRow(tableLines[0]);
    // tableLines[1] is separator row | --- | --- |
    const rows = tableLines.slice(2).map(parseRow);

    return {
        header,
        rows,
        endIdx: cur
    };
}

/**
 * Strip Markdown & Math tokens to create clean, natural speech for browser TTS
 */
export function stripFormattingForSpeech(text) {
    if (!text) return "";

    return text
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, " ")
        // Replace chemical/math arrows
        .replace(/(\\rightarrow|->|→)/g, " yields ")
        .replace(/(\\leftarrow|<-|←)/g, " from ")
        .replace(/(\\leftrightarrow|<->|↔)/g, " in equilibrium with ")
        // Replace math symbols
        .replace(/\\times/g, " times ")
        .replace(/\\cdot/g, " times ")
        .replace(/\\div/g, " divided by ")
        .replace(/\\pm/g, " plus or minus ")
        .replace(/\\approx/g, " approximately ")
        .replace(/\\Omega/g, " ohms ")
        .replace(/\\Delta/g, " change in ")
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, " $1 over $2 ")
        // Subscripts / superscripts in speech
        .replace(/_\{([^}]+)\}/g, " $1 ")
        .replace(/\^\{([^}]+)\}/g, " to the power of $1 ")
        .replace(/\^2\b/g, " squared ")
        .replace(/\^3\b/g, " cubed ")
        .replace(/_/g, " ")
        .replace(/\^/g, " ")
        // Remove markdown formatting
        .replace(/[#*`$|]/g, " ")
        .replace(/---/g, " ")
        .replace(/\\text\{([^}]+)\}/g, " $1 ")
        .replace(/\\mathbf\{([^}]+)\}/g, " $1 ")
        .replace(/\\vec\{([^}]+)\}/g, " vector $1 ")
        .replace(/\\[a-zA-Z]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Main FormattedMessage Component
 * Safely renders rich educational responses with headings, math expressions,
 * chemical equations, lists, and tables without dangerous HTML execution.
 */
export default function FormattedMessage({ text, className = "", style = {}, highlightTerm = "" }) {
    if (!text) return null;

    try {
        // Step 1: Split by code blocks ```lang ... ``` and math display blocks $$...$$
        const blockTokens = [];
        const displayBlockRegex = /(```(\w+)?\n([\s\S]*?)```|\$\$([\s\S]*?)\$\$)/g;
        let lastIndex = 0;
        let match;

        while ((match = displayBlockRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                blockTokens.push({ type: "text", content: text.substring(lastIndex, match.index) });
            }
            if (match[0].startsWith("```")) {
                blockTokens.push({
                    type: "code",
                    lang: match[2] || "code",
                    code: (match[3] || "").trim()
                });
            } else if (match[0].startsWith("$$")) {
                blockTokens.push({
                    type: "display_math",
                    math: (match[4] || "").trim()
                });
            }
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
            blockTokens.push({ type: "text", content: text.substring(lastIndex) });
        }

        return (
            <div
                className={`formatted-ai-response ${className}`}
                style={{
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: "0.88rem",
                    lineHeight: "1.65",
                    wordBreak: "break-word",
                    ...style
                }}
            >
                {blockTokens.map((block, bIdx) => {
                    if (block.type === "code") {
                        return (
                            <div
                                key={bIdx}
                                style={{
                                    margin: "12px 0",
                                    background: "rgba(10, 15, 28, 0.95)",
                                    border: "1px solid rgba(6, 182, 212, 0.35)",
                                    borderRadius: "10px",
                                    overflow: "hidden"
                                }}
                            >
                                <div
                                    style={{
                                        background: "rgba(6, 182, 212, 0.12)",
                                        padding: "6px 14px",
                                        fontSize: "0.72rem",
                                        color: "#38bdf8",
                                        fontWeight: "700",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        borderBottom: "1px solid rgba(6, 182, 212, 0.2)"
                                    }}
                                >
                                    ⚡ {block.lang}
                                </div>
                                <pre
                                    style={{
                                        margin: 0,
                                        padding: "12px 14px",
                                        fontSize: "0.82rem",
                                        color: "#7dd3fc",
                                        fontFamily: "Consolas, Monaco, monospace",
                                        overflowX: "auto",
                                        whiteSpace: "pre",
                                        lineHeight: "1.5"
                                    }}
                                >
                                    {highlightString(block.code, highlightTerm, `code_${bIdx}`)}
                                </pre>
                            </div>
                        );
                    }

                    if (block.type === "display_math") {
                        return (
                            <div
                                key={bIdx}
                                style={{
                                    margin: "12px 0",
                                    padding: "10px 16px",
                                    background: "linear-gradient(135deg, rgba(30, 27, 75, 0.4), rgba(15, 23, 42, 0.6))",
                                    border: "1px solid rgba(139, 92, 246, 0.35)",
                                    borderRadius: "10px",
                                    textAlign: "center",
                                    fontFamily: "Cambria Math, Georgia, serif",
                                    fontSize: "1.05rem",
                                    color: "#e0e7ff",
                                    overflowX: "auto"
                                }}
                            >
                                {formatMathOrChemistry(block.math)}
                            </div>
                        );
                    }

                    // Standard text block with markdown headings, lists, tables, etc.
                    const lines = block.content.split("\n");
                    const elements = [];
                    let lineIdx = 0;

                    while (lineIdx < lines.length) {
                        const line = lines[lineIdx];
                        const trimmed = line.trim();

                        // Check table
                        if (isTableBlock(lines, lineIdx)) {
                            const tableData = parseTable(lines, lineIdx);
                            if (tableData) {
                                elements.push(
                                    <div key={`tbl_${lineIdx}`} style={{ margin: "14px 0", overflowX: "auto" }}>
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                fontSize: "0.82rem",
                                                background: "rgba(15, 23, 42, 0.6)",
                                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                                borderRadius: "8px",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <thead>
                                                <tr style={{ background: "rgba(6, 182, 212, 0.15)" }}>
                                                    {tableData.header.map((col, cIdx) => (
                                                        <th
                                                            key={cIdx}
                                                            style={{
                                                                padding: "8px 12px",
                                                                textAlign: "left",
                                                                fontWeight: "700",
                                                                color: "#38bdf8",
                                                                borderBottom: "1px solid rgba(255, 255, 255, 0.15)"
                                                            }}
                                                        >
                                                            {parseInline(col, `th_${cIdx}`, highlightTerm)}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.rows.map((row, rIdx) => (
                                                    <tr
                                                        key={rIdx}
                                                        style={{
                                                            background: rIdx % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.05)",
                                                            borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
                                                        }}
                                                    >
                                                        {row.map((cell, cIdx) => (
                                                            <td
                                                                key={cIdx}
                                                                style={{
                                                                    padding: "8px 12px",
                                                                    color: "rgba(255, 255, 255, 0.9)"
                                                                }}
                                                            >
                                                                {parseInline(cell, `td_${rIdx}_${cIdx}`, highlightTerm)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                                lineIdx = tableData.endIdx;
                                continue;
                            }
                        }

                        // Headings
                        if (trimmed.startsWith("#### ")) {
                            elements.push(
                                <h5
                                    key={lineIdx}
                                    style={{
                                        fontSize: "0.95em",
                                        fontWeight: "700",
                                        color: "#7dd3fc",
                                        margin: "10px 0 4px 0"
                                    }}
                                >
                                    {parseInline(trimmed.replace(/^####\s+/, ""), `h4_${lineIdx}`, highlightTerm)}
                                </h5>
                            );
                        } else if (trimmed.startsWith("### ")) {
                            elements.push(
                                <h4
                                    key={lineIdx}
                                    style={{
                                        fontSize: "1.05em",
                                        fontWeight: "700",
                                        color: "#38bdf8",
                                        margin: "12px 0 6px 0",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}
                                >
                                    {parseInline(trimmed.replace(/^###\s+/, ""), `h3_${lineIdx}`, highlightTerm)}
                                </h4>
                            );
                        } else if (trimmed.startsWith("## ")) {
                            elements.push(
                                <h3
                                    key={lineIdx}
                                    style={{
                                        fontSize: "1.15em",
                                        fontWeight: "800",
                                        color: "#ffffff",
                                        margin: "16px 0 8px 0"
                                    }}
                                >
                                    {parseInline(trimmed.replace(/^##\s+/, ""), `h2_${lineIdx}`, highlightTerm)}
                                </h3>
                            );
                        } else if (trimmed.startsWith("# ")) {
                            elements.push(
                                <h2
                                    key={lineIdx}
                                    style={{
                                        fontSize: "1.3em",
                                        fontWeight: "800",
                                        color: "#ffffff",
                                        margin: "18px 0 10px 0"
                                    }}
                                >
                                    {parseInline(trimmed.replace(/^#\s+/, ""), `h1_${lineIdx}`, highlightTerm)}
                                </h2>
                            );
                        } else if (trimmed.startsWith("---")) {
                            elements.push(
                                <hr
                                    key={lineIdx}
                                    style={{
                                        border: "none",
                                        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                                        margin: "12px 0"
                                    }}
                                />
                            );
                        } else if (trimmed.startsWith("> ")) {
                            elements.push(
                                <blockquote
                                    key={lineIdx}
                                    style={{
                                        margin: "8px 0",
                                        padding: "8px 14px",
                                        borderLeft: "3px solid var(--accent-cyan, #06b6d4)",
                                        background: "rgba(6, 182, 212, 0.08)",
                                        borderRadius: "0 6px 6px 0",
                                        color: "rgba(255, 255, 255, 0.85)"
                                    }}
                                >
                                    {parseInline(trimmed.replace(/^>\s+/, ""), `bq_${lineIdx}`, highlightTerm)}
                                </blockquote>
                            );
                        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
                            // Bullet List Item
                            elements.push(
                                <div
                                    key={lineIdx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "8px",
                                        margin: "4px 0",
                                        paddingLeft: "4px"
                                    }}
                                >
                                    <span style={{ color: "var(--accent-cyan, #06b6d4)", lineHeight: "1.6" }}>•</span>
                                    <div style={{ flex: 1 }}>{parseInline(trimmed.replace(/^[-*•]\s+/, ""), `ul_${lineIdx}`, highlightTerm)}</div>
                                </div>
                            );
                        } else if (/^\d+\.\s+/.test(trimmed)) {
                            // Numbered List Item
                            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
                            elements.push(
                                <div
                                    key={lineIdx}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "8px",
                                        margin: "4px 0",
                                        paddingLeft: "4px"
                                    }}
                                >
                                    <span style={{ color: "#a78bfa", fontWeight: "700", minWidth: "18px", lineHeight: "1.6" }}>
                                        {numMatch[1]}.
                                    </span>
                                    <div style={{ flex: 1 }}>{parseInline(numMatch[2], `ol_${lineIdx}`, highlightTerm)}</div>
                                </div>
                            );
                        } else if (trimmed === "") {
                            // Blank line spacing
                            elements.push(<div key={lineIdx} style={{ height: "6px" }} />);
                        } else {
                            // Regular text paragraph
                            elements.push(
                                <div key={lineIdx} style={{ margin: "2px 0", lineHeight: "1.6" }}>
                                    {parseInline(line, `p_${lineIdx}`, highlightTerm)}
                                </div>
                            );
                        }

                        lineIdx++;
                    }

                    return <div key={bIdx}>{elements}</div>;
                })}
            </div>
        );
    } catch (err) {
        // Fallback to plain text if any unexpected parsing error occurs
        console.warn("FormattedMessage fallback on error:", err);
        return <div className={className} style={{ whiteSpace: "pre-line", ...style }}>{highlightString(text, highlightTerm, "fb")}</div>;
    }
}
