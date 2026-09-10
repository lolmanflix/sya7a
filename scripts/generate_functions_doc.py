#!/usr/bin/env python3
"""
Automated Functions Documentation Generator.
Parses the project directory for source code functions, inline comments,
and docstrings, then compiles functions.md at the project root.
"""

import os
import re
import sys
from pathlib import Path

EXCLUDED_DIRS = {
    "node_modules", ".git", "dist", "build", ".system_generated",
    "scratch", "__pycache__", ".vscode", ".gemini"
}

SUPPORTED_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx", ".py"}

JS_TS_FUNC_PATTERN = re.compile(
    r'(?:/\*\*([\s\S]*?)\*/\s*)?'  # JSDoc comment
    r'(?:(?:export\s+(?:default\s+)?)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)|'  # function foo(...)
    r'(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*(?::\s*[^=]+)?\s*=>)',  # const foo = (...) =>
    re.MULTILINE
)

PY_FUNC_PATTERN = re.compile(
    r'(?:(?:def|async def)\s+([A-Za-z0-9_]+)\s*\(([^)]*)\):(?:\s*"""([\s\S]*?)""")?)',
    re.MULTILINE
)


def clean_docstring(doc_str: str) -> str:
    """Cleans up raw JSDoc or Python docstrings into a single markdown description."""
    if not doc_str:
        return "No description provided."
    lines = []
    for line in doc_str.strip().splitlines():
        cleaned = re.sub(r'^\s*[*#]\s?', '', line).strip()
        if cleaned:
            lines.append(cleaned)
    return " ".join(lines) if lines else "No description provided."


def parse_file(file_path: Path):
    """Extracts function signatures and documentation from a single file."""
    try:
        content = file_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        print(f"Error reading {file_path}: {e}", file=sys.stderr)
        return []

    results = []
    ext = file_path.suffix.lower()

    if ext in {".js", ".jsx", ".ts", ".tsx"}:
        matches = JS_TS_FUNC_PATTERN.finditer(content)
        for m in matches:
            jsdoc, name1, args1, name2, args2 = m.groups()
            fn_name = name1 or name2
            args = (args1 or args2 or "").strip().replace("\n", " ")
            desc = clean_docstring(jsdoc)
            results.append({
                "name": fn_name,
                "args": args,
                "description": desc,
                "line": content[:m.start()].count("\n") + 1
            })

    elif ext == ".py":
        matches = PY_FUNC_PATTERN.finditer(content)
        for m in matches:
            fn_name, args, doc = m.groups()
            results.append({
                "name": fn_name,
                "args": args.strip().replace("\n", " "),
                "description": clean_docstring(doc),
                "line": content[:m.start()].count("\n") + 1
            })

    return results


def generate_functions_markdown(root_dir: Path, output_file: Path):
    """Scans root_dir and writes formatted documentation into output_file."""
    files_to_scan = []
    for current_root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for f in files:
            p = Path(current_root) / f
            if p.suffix.lower() in SUPPORTED_EXTENSIONS and p != Path(__file__).resolve():
                files_to_scan.append(p)

    files_to_scan.sort()

    output_lines = [
        "# Automated Functions Catalog (`functions.md`)",
        "",
        "> **Note:** This file is automatically compiled by `scripts/generate_functions_doc.py`.",
        "> Do not manually edit this file. Keep inline docstrings updated in the source code.",
        "",
        "---",
        ""
    ]

    total_funcs = 0

    if not files_to_scan:
        output_lines.append("*No source files detected yet. Catalog will populate as components are built.*")
    else:
        for fpath in files_to_scan:
            rel_path = fpath.relative_to(root_dir).as_posix()
            funcs = parse_file(fpath)
            if not funcs:
                continue

            output_lines.append(f"## [{fpath.name}](file:///{fpath.as_posix()})")
            output_lines.append(f"`{rel_path}`")
            output_lines.append("")
            output_lines.append("| Line | Function Name | Arguments | Description |")
            output_lines.append("| :--- | :--- | :--- | :--- |")

            for fn in funcs:
                total_funcs += 1
                args_escaped = f"`{fn['args']}`" if fn['args'] else "*none*"
                output_lines.append(
                    f"| L{fn['line']} | `{fn['name']}()` | {args_escaped} | {fn['description']} |"
                )
            output_lines.append("")

    output_lines.insert(5, f"**Total Documented Functions:** {total_funcs}\n")

    output_file.write_text("\n".join(output_lines), encoding="utf-8")
    print(f"Generated {output_file} with {total_funcs} documented functions.")


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    target = root / "functions.md"
    generate_functions_markdown(root, target)
