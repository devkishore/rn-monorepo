@echo off
REM GitHub Branch Protection Setup Script (Windows)
REM Configures branch protection to require only HIGH priority checks
REM Usage: setup-branch-protection.bat <owner> <repo> [branch]

setlocal enabledelayedexpansion

REM Configuration
set OWNER=%1
set REPO=%2
set BRANCH=%3
if "%BRANCH%"=="" set BRANCH=main

REM Colors (Windows 10+ Terminal)
set GREEN=[32m
set RED=[31m
set BLUE=[34m
set RESET=[0m

REM Validate inputs
if "%OWNER%"=="" (
    echo %RED%Error: Missing owner argument%RESET%
    echo Usage: %0 ^<owner^> ^<repo^> [branch]
    exit /b 1
)

if "%REPO%"=="" (
    echo %RED%Error: Missing repo argument%RESET%
    echo Usage: %0 ^<owner^> ^<repo^> [branch]
    exit /b 1
)

REM Check if gh CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %RED%Error: GitHub CLI (gh) is not installed%RESET%
    echo Install from: https://cli.github.com
    exit /b 1
)

echo.
echo %BLUE%=== Setting up Branch Protection ===%RESET%
echo.
echo Repository: %OWNER%/%REPO%
echo Branch: %BRANCH%
echo.

REM Create branch protection
echo %BLUE%Configuring branch protection...%RESET%

gh api repos/%OWNER%/%REPO%/branches/%BRANCH%/protection ^
  -X PUT ^
  -f required_status_checks='{ ^
    "strict": true, ^
    "contexts": [ ^
      "[HIGH] TypeScript Type Checking", ^
      "[HIGH] ESLint Code Quality", ^
      "[HIGH] Prettier Code Formatting", ^
      "[HIGH] Build & Compile", ^
      "[HIGH] Unit Tests", ^
      "[HIGH] Security Audit" ^
    ] ^
  }' ^
  -f required_pull_request_reviews='{ ^
    "required_approving_review_count": 1, ^
    "require_code_owner_reviews": false, ^
    "dismiss_stale_reviews": true ^
  }' ^
  -f enforce_admins=true ^
  -f allow_force_pushes=false ^
  -f allow_deletions=false

if %ERRORLEVEL% EQU 0 (
    echo %GREEN%✓ Branch protection configured%RESET%
) else (
    echo %RED%✗ Failed to configure branch protection%RESET%
    exit /b 1
)

echo.
echo %BLUE%=== Configuration Summary ===%RESET%
echo.
echo Required Status Checks (blocking):
echo   * [HIGH] TypeScript Type Checking
echo   * [HIGH] ESLint Code Quality
echo   * [HIGH] Prettier Code Formatting
echo   * [HIGH] Build ^& Compile
echo   * [HIGH] Unit Tests
echo   * [HIGH] Security Audit
echo.
echo Pull Request Requirements:
echo   * Require 1 approval
echo   * Enforce for admins
echo.
echo %GREEN%Complete ✓%RESET%
echo.
