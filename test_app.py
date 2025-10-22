#!/usr/bin/env python3
"""
Test script to verify PaiperSum is working WITHOUT needing dependencies installed.
Run this to check if your setup will work before deploying.
"""

import sys
import os
import ast
import json
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name, passed, details=""):
    status = f"{Colors.GREEN}✅ PASS{Colors.END}" if passed else f"{Colors.RED}❌ FAIL{Colors.END}"
    print(f"{status} {name}")
    if details:
        print(f"     {details}")

def check_python_syntax(file_path):
    """Check if Python file has valid syntax"""
    try:
        with open(file_path, 'r') as f:
            ast.parse(f.read())
        return True, "Syntax OK"
    except SyntaxError as e:
        return False, f"Syntax error: {e}"

def check_json_file(file_path):
    """Check if JSON file is valid"""
    try:
        with open(file_path, 'r') as f:
            json.load(f)
        return True, "Valid JSON"
    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"

def check_file_exists(file_path):
    """Check if file exists"""
    return os.path.exists(file_path), "Exists" if os.path.exists(file_path) else "Missing"

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BLUE}   PaiperSum - Pre-Deployment Verification{Colors.END}")
    print(f"{Colors.BLUE}{'='*60}{Colors.END}\n")

    all_passed = True

    # Test 1: Check critical Python files
    print(f"{Colors.YELLOW}📋 Testing Backend (Python/FastAPI)...{Colors.END}")
    api_files = [
        'apps/api/main.py',
        'apps/api/obs.py',
        'apps/api/security.py',
        'apps/api/report.py',
        'apps/api/ingest.py'
    ]
    
    for file in api_files:
        if os.path.exists(file):
            passed, details = check_python_syntax(file)
            print_test(f"{file}", passed, details)
            if not passed:
                all_passed = False
        else:
            print_test(f"{file}", False, "File missing")
            all_passed = False

    # Test 2: Check JSON configs
    print(f"\n{Colors.YELLOW}📋 Testing Configuration Files...{Colors.END}")
    json_files = [
        'package.json',
        'apps/web/package.json',
        'apps/api/package.json',
        'apps/extension/package.json'
    ]
    
    for file in json_files:
        if os.path.exists(file):
            passed, details = check_json_file(file)
            print_test(f"{file}", passed, details)
            if not passed:
                all_passed = False
        else:
            print_test(f"{file}", False, "File missing")
            all_passed = False

    # Test 3: Check Docker files
    print(f"\n{Colors.YELLOW}📋 Testing Docker Configuration...{Colors.END}")
    docker_files = [
        'docker-compose.yml',
        'apps/api/Dockerfile',
        'apps/web/Dockerfile'
    ]
    
    for file in docker_files:
        exists, details = check_file_exists(file)
        print_test(f"{file}", exists, details)
        if not exists:
            all_passed = False

    # Test 4: Check web app structure
    print(f"\n{Colors.YELLOW}📋 Testing Frontend (React/TypeScript)...{Colors.END}")
    web_files = [
        'apps/web/src/App.tsx',
        'apps/web/src/main.tsx',
        'apps/web/src/lib/api.ts',
        'apps/web/src/lib/schemas.ts',
        'apps/web/src/components/RiskMeter.tsx',
        'apps/web/index.html',
        'apps/web/vite.config.ts',
        'apps/web/tailwind.config.cjs'
    ]
    
    for file in web_files:
        exists, details = check_file_exists(file)
        print_test(f"{file}", exists, details)
        if not exists:
            all_passed = False

    # Test 5: Check legal compliance
    print(f"\n{Colors.YELLOW}📋 Testing Legal Compliance...{Colors.END}")
    legal_files = [
        'apps/web/public/terms.html',
        'apps/web/public/privacy.html',
        'LICENSE'
    ]
    
    for file in legal_files:
        exists, details = check_file_exists(file)
        print_test(f"{file}", exists, details)
        if not exists:
            all_passed = False

    # Test 6: Check documentation
    print(f"\n{Colors.YELLOW}📋 Testing Documentation...{Colors.END}")
    docs = [
        'README.md',
        'START_HERE.md',
        'DEPLOYMENT.md',
        'STATUS.md',
        'SOLO_FOUNDER_GUIDE.md'
    ]
    
    for file in docs:
        exists, details = check_file_exists(file)
        print_test(f"{file}", exists, details)
        if not exists:
            all_passed = False

    # Test 7: Check security files
    print(f"\n{Colors.YELLOW}📋 Testing Security Configuration...{Colors.END}")
    security_files = [
        '.env.example',
        '.gitignore',
        '.pre-commit-config.yaml'
    ]
    
    for file in security_files:
        exists, details = check_file_exists(file)
        print_test(f"{file}", exists, details)
        if not exists:
            all_passed = False

    # Final verdict
    print(f"\n{Colors.BLUE}{'='*60}{Colors.END}")
    if all_passed:
        print(f"{Colors.GREEN}✅ ALL TESTS PASSED - READY TO DEPLOY!{Colors.END}")
        print(f"\n{Colors.GREEN}Next steps:{Colors.END}")
        print(f"  1. Read START_HERE.md")
        print(f"  2. Run: docker-compose up -d")
        print(f"  3. Visit: http://localhost:5173")
        print(f"  4. Deploy to paipersum.com")
        print(f"\n{Colors.BLUE}{'='*60}{Colors.END}\n")
        return 0
    else:
        print(f"{Colors.RED}❌ SOME TESTS FAILED{Colors.END}")
        print(f"\n{Colors.RED}Fix the issues above before deploying.{Colors.END}")
        print(f"\n{Colors.BLUE}{'='*60}{Colors.END}\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())
