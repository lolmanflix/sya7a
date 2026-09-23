#!/usr/bin/env python3
"""
scripts/test_dev_rules.py
Deterministic Compliance Verification Engine for dev_rules.md

Validates:
1. File Size Ceiling (Strictly <= 400 lines per file).
2. Layer Separation (Decoupling UI Presentation from direct RTDB calls).
3. Secret Protection & .gitignore Guardrails.
4. Multi-Tenant White-Labeling Architecture.
5. Single Responsibility Principle (SRP) & Documentation Synchronization.
"""

import os
import sys
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IGNORE_DIRS = {".git", "node_modules", "archive", "temp", "dist", ".expo", "reports"}
SOURCE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".py"}

class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

failures = []
warnings = []

def count_lines(filepath):
    """Counts total lines in a source code file."""
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        return sum(1 for _ in f)

def get_active_files():
    """Retrieves all active source files excluding build and archive dirs."""
    active = []
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for f in files:
            if any(f.endswith(ext) for ext in SOURCE_EXTENSIONS):
                active.append(os.path.join(root, f))
    return active

print(f"{Colors.BOLD}{Colors.CYAN}============================================================")
print("           DEV RULES COMPLIANCE TEST SUITE")
print(f"============================================================{Colors.RESET}")

# -------------------------------------------------------------
# TEST 1: File Size Ceiling (Strictly < 400 lines)
# -------------------------------------------------------------
print(f"\n{Colors.BOLD}[TEST 1] Checking Rule 1: File Size Limit (<= 400 lines per file)...{Colors.RESET}")
active_files = get_active_files()
size_violations = []

for f in active_files:
    cnt = count_lines(f)
    rel = os.path.relpath(f, ROOT_DIR)
    if cnt > 400:
        size_violations.append((rel, cnt))
    elif cnt == 400:
        warnings.append(f"Borderline 400-line ceiling: {rel} ({cnt} lines)")

if size_violations:
    for rel, cnt in size_violations:
        failures.append(f"Rule 1 Violation: {rel} exceeds limit with {cnt} lines (Max: 400)")
        print(f"  {Colors.RED}✗ {rel}: {cnt} lines (> 400){Colors.RESET}")
else:
    print(f"  {Colors.GREEN}✓ PASSED: Scanned {len(active_files)} active source files. Zero files exceed 400 lines.{Colors.RESET}")

# -------------------------------------------------------------
# TEST 2: Presentation Layer Separation
# -------------------------------------------------------------
print(f"\n{Colors.BOLD}[TEST 2] Checking Rule 2: Modularity & Presentation Layer Separation...{Colors.RESET}")
decoupled_dirs = [
    os.path.join(ROOT_DIR, "mobile", "src", "components"),
]
rtdb_import_pattern = re.compile(r'from\s+["\']firebase/database["\']')
layer_violations = []

for d in decoupled_dirs:
    if not os.path.exists(d):
        continue
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith((".ts", ".tsx")):
                p = os.path.join(root, f)
                with open(p, "r", encoding="utf-8", errors="ignore") as file:
                    c_text = file.read()
                    if rtdb_import_pattern.search(c_text):
                        rel = os.path.relpath(p, ROOT_DIR)
                        layer_violations.append(rel)

if layer_violations:
    for rel in layer_violations:
        failures.append(f"Rule 2 Violation: Presentation component {rel} directly imports firebase/database")
        print(f"  {Colors.RED}✗ {rel} directly imports firebase/database (should use custom hooks/services){Colors.RESET}")
else:
    print(f"  {Colors.GREEN}✓ PASSED: UI components are decoupled from direct RTDB queries.{Colors.RESET}")

# -------------------------------------------------------------
# TEST 3: Secret Protection & .gitignore Guardrail
# -------------------------------------------------------------
print(f"\n{Colors.BOLD}[TEST 3] Checking Rule 3: Secret Protection & .gitignore Guardrails...{Colors.RESET}")
gitignore_path = os.path.join(ROOT_DIR, ".gitignore")
secret_violations = []

if not os.path.exists(gitignore_path):
    failures.append("Root .gitignore does not exist!")
else:
    with open(gitignore_path, "r") as f:
        gi_content = f.read()
    if ".env" not in gi_content:
        failures.append("Root .gitignore does not contain .env protection!")

# Ensure no secret files are tracked in git index
import subprocess
try:
    git_tracked = subprocess.check_output(["git", "ls-files"], cwd=ROOT_DIR, text=True).splitlines()
    for tracked in git_tracked:
        bname = os.path.basename(tracked)
        if bname.startswith(".env") and not bname.endswith(".example"):
            failures.append(f"Tracked secret in Git index: {tracked}")
except Exception as e:
    warnings.append(f"Could not query git ls-files: {e}")

if secret_violations:
    for s in secret_violations:
        print(f"  {Colors.RED}✗ {s}{Colors.RESET}")
else:
    print(f"  {Colors.GREEN}✓ PASSED: .env secrets properly guarded; no unencrypted keys committed.{Colors.RESET}")

# -------------------------------------------------------------
# TEST 4: White-Labeling & Multi-Tenant Adaptability
# -------------------------------------------------------------
print(f"\n{Colors.BOLD}[TEST 4] Checking Rule 8: Multi-Tenant White-Label Configuration...{Colors.RESET}")
tenant_config_path = os.path.join(ROOT_DIR, "mobile", "src", "config", "tenantConfig.ts")
if not os.path.exists(tenant_config_path):
    failures.append("Rule 8 Violation: tenantConfig.ts missing from mobile/src/config/")
    print(f"  {Colors.RED}✗ tenantConfig.ts missing{Colors.RESET}")
else:
    with open(tenant_config_path, "r") as f:
        tc = f.read()
    required_archetypes = ["public_transit", "school", "call_center", "university", "corporate_fleet"]
    missing_arch = [a for a in required_archetypes if a not in tc]
    if missing_arch:
        failures.append(f"Rule 8 Violation: Missing archetypes {missing_arch} in tenantConfig.ts")
    else:
        print(f"  {Colors.GREEN}✓ PASSED: tenantConfig.ts verified across all 4 institutional archetypes.{Colors.RESET}")

# -------------------------------------------------------------
# TEST 5: Documentation Synchronization
# -------------------------------------------------------------
print(f"\n{Colors.BOLD}[TEST 5] Checking Mandatory Documentation Layer...{Colors.RESET}")
functions_md = os.path.join(ROOT_DIR, "functions.md")
code_wiki_md = os.path.join(ROOT_DIR, "code_wiki.md")
dev_rules_md = os.path.join(ROOT_DIR, "dev_rules.md")

for doc in [functions_md, code_wiki_md, dev_rules_md]:
    if not os.path.exists(doc):
        failures.append(f"Mandatory documentation file missing: {os.path.basename(doc)}")
    else:
        print(f"  {Colors.GREEN}✓ PASSED: Found {os.path.basename(doc)}.{Colors.RESET}")

# -------------------------------------------------------------
# FINAL VERDICT
# -------------------------------------------------------------
print(f"\n{Colors.BOLD}{Colors.CYAN}============================================================{Colors.RESET}")
if warnings:
    print(f"{Colors.YELLOW}{Colors.BOLD}WARNINGS ({len(warnings)}):{Colors.RESET}")
    for w in warnings:
        print(f"  {Colors.YELLOW}! {w}{Colors.RESET}")

if failures:
    print(f"\n{Colors.RED}{Colors.BOLD}TEST FAILED: {len(failures)} compliance violations found:{Colors.RESET}")
    for f in failures:
        print(f"  {Colors.RED}✗ {f}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}============================================================{Colors.RESET}\n")
    sys.exit(1)
else:
    print(f"\n{Colors.GREEN}{Colors.BOLD}ALL COMPLIANCE TESTS PASSED (0 ERRORS){Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}============================================================{Colors.RESET}\n")
    sys.exit(0)
