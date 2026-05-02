#!/bin/bash

# GitHub Branch Protection Setup Script
# Configures branch protection to require only HIGH priority checks
# Usage: ./setup-branch-protection.sh <owner> <repo> <branch>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OWNER="${1:-}"
REPO="${2:-}"
BRANCH="${3:-main}"

# HIGH priority checks (required)
HIGH_CHECKS=(
  "[HIGH] TypeScript Type Checking"
  "[HIGH] ESLint Code Quality"
  "[HIGH] Prettier Code Formatting"
  "[HIGH] Build & Compile"
  "[HIGH] Unit Tests"
  "[HIGH] Security Audit"
)

# Helper functions
print_header() {
  echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

print_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

# Validate inputs
validate_inputs() {
  if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
    print_error "Missing required arguments"
    echo "Usage: $0 <owner> <repo> [branch]"
    echo "Example: $0 my-org my-rn-project main"
    exit 1
  fi

  # Check if gh CLI is installed
  if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed"
    echo "Install from: https://cli.github.com"
    exit 1
  fi

  # Check if authenticated
  if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
  fi
}

# Build JSON for status checks
build_status_checks_json() {
  local contexts="["
  for i in "${!HIGH_CHECKS[@]}"; do
    if [ $i -gt 0 ]; then
      contexts+=","
    fi
    contexts+="\"${HIGH_CHECKS[$i]}\""
  done
  contexts+="]"
  
  cat <<EOF
{
  "strict": true,
  "contexts": $contexts
}
EOF
}

# Build JSON for pull request reviews
build_pr_reviews_json() {
  cat <<EOF
{
  "required_approving_review_count": 1,
  "require_code_owner_reviews": false,
  "dismiss_stale_reviews": true
}
EOF
}

# Main setup function
setup_branch_protection() {
  print_header "Setting up Branch Protection for $OWNER/$REPO ($BRANCH)"

  print_info "Configuring branch protection rules..."

  # Create branch protection
  gh api repos/$OWNER/$REPO/branches/$BRANCH/protection \
    -X PUT \
    -f required_status_checks="$(build_status_checks_json)" \
    -f required_pull_request_reviews="$(build_pr_reviews_json)" \
    -f enforce_admins=true \
    -f allow_force_pushes=false \
    -f allow_deletions=false > /dev/null

  if [ $? -eq 0 ]; then
    print_success "Branch protection configured for $BRANCH"
  else
    print_error "Failed to configure branch protection"
    exit 1
  fi
}

# Display configuration
display_configuration() {
  print_header "Configuration Applied"

  echo "Branch: $BRANCH"
  echo "Repository: $OWNER/$REPO"
  echo ""
  echo "Required Status Checks (blocking):"
  for check in "${HIGH_CHECKS[@]}"; do
    echo "  • $check"
  done
  echo ""
  echo "Pull Request Requirements:"
  echo "  • Require 1 approval"
  echo "  • Dismiss stale reviews"
  echo "  • Enforce for admins"
  echo ""
}

# Verify setup
verify_setup() {
  print_header "Verifying Setup"

  # Fetch current protection rules
  if protection=$(gh api repos/$OWNER/$REPO/branches/$BRANCH/protection 2>/dev/null); then
    print_success "Branch protection is active"
    
    # Count required status checks
    check_count=$(echo "$protection" | jq '.required_status_checks.contexts | length')
    print_info "Required checks: $check_count"
    
    # Check if enforced for admins
    admin_enforced=$(echo "$protection" | jq '.enforce_admins')
    if [ "$admin_enforced" = "true" ]; then
      print_success "Admin enforcement: enabled"
    else
      print_info "Admin enforcement: disabled"
    fi
  else
    print_error "Could not verify branch protection"
    return 1
  fi
}

# Provide next steps
print_next_steps() {
  print_header "Next Steps"

  echo "1. Create a test PR to verify branch protection"
  echo ""
  echo "2. Push a commit that fails HIGH priority checks:"
  echo "   # Introduce a TypeScript error or linting issue"
  echo "   git push origin feature-branch"
  echo ""
  echo "3. Verify PR cannot be merged until HIGH checks pass"
  echo ""
  echo "4. Create a PR that passes HIGH but fails MEDIUM checks"
  echo "   Verify PR can still be merged"
  echo ""
  echo "5. For detailed configuration, see: .github/BRANCH_PROTECTION.md"
}

# Main execution
main() {
  validate_inputs
  display_configuration
  setup_branch_protection
  verify_setup
  print_next_steps
  
  print_header "Complete ✓"
  echo "Branch protection has been configured!"
  echo ""
}

# Run main function
main "$@"
