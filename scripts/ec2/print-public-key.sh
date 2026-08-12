#!/usr/bin/env bash
# Print the public key for yureka.pem — compare with EC2 → Key pairs in AWS Console.
# After Instance Connect login, append this line to ~/.ssh/authorized_keys on the server.
set -euo pipefail
KEY="${1:-$(dirname "$0")/../../yureka.pem}"
if [[ ! -f "$KEY" ]]; then
  echo "Usage: $0 [path/to/yureka.pem]"
  exit 1
fi
chmod 400 "$KEY"
echo "# Public key for: $KEY"
ssh-keygen -y -f "$KEY"
echo
echo "If SSH fails with Permission denied, this key is NOT on the instance yet."
echo "Use EC2 Instance Connect → paste into authorized_keys (see docs/EC2_SSH_FIX.md)."
