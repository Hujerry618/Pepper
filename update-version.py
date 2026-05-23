import subprocess
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Get current commit count and add 1 for the upcoming commit
result = subprocess.run(['git', 'rev-list', '--count', 'HEAD'], capture_output=True, text=True)
commit_count = int(result.stdout.strip()) + 1
version = f"v1.0.{commit_count}"

with open('index.html', 'r', encoding='utf-16-le') as f:
    content = f.read()

# Replace any existing version pattern (v1.0, v1.0.X, etc.)
content = re.sub(r'小辣椒APP v\d+\.\d+(\.\d+)? Copyright', f'小辣椒APP {version} Copyright', content)

with open('index.html', 'w', encoding='utf-16-le') as f:
    f.write(content)

print(f'Version updated to {version}')
