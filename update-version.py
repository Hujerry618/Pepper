import subprocess
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Get current commit count and add 1 for the upcoming commit
result = subprocess.run(['git', 'rev-list', '--count', 'HEAD'], capture_output=True, text=True)
commit_count = int(result.stdout.strip()) + 1
version = f"v1.0.{commit_count}"

# Get current date in YYYY-MM-DD format
from datetime import datetime
commit_date = datetime.now().strftime('%Y-%m-%d')

with open('index.html', 'r', encoding='utf-16-le') as f:
    content = f.read()

# Replace version
content = re.sub(r'小辣椒APP v\d+\.\d+(\.\d+)? Copyright', f'小辣椒APP {version} Copyright', content)

# Replace update date - update both the default content and the JS that sets it
content = re.sub(
    r'<span id="updateTime">[^<]*</span>',
    f'<span id="updateTime">{commit_date}</span>',
    content
)

# Update the saveData function to not overwrite the date
content = content.replace(
    "document.getElementById('updateTime').textContent = new Date().toLocaleString('zh-CN');",
    "// update date is set in HTML"
)

with open('index.html', 'w', encoding='utf-16-le') as f:
    f.write(content)

print(f'Version updated to {version}, date: {commit_date}')
