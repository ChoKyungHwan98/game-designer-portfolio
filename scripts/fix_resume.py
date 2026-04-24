import re

path = r'c:\Users\Admin\Desktop\게임기획\포트폴리오\게임-기획자-포트폴리오-개선버전\src\data\resume.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The issue: Python is writing \\n\\n but the file has actual newlines inside the TS string.
# We need to find the multiline string blocks and collapse them back to single-line with \n\n escape.

# Fix HOOK: find hook: "...(multiline)..." and make it single line with \\n\\n
hook_broken_pattern = re.compile(
    r'(hook:\s*")(모든 법은 반드시 의도가 있습니다[^"]*그날부터 \*\*목차를 작성하는 훈련\*\*을 시작했습니다\. 법학 답안은 다음 구조를 따릅니다\.)"',
    re.DOTALL
)

def collapse_hook(m):
    inner = m.group(2)
    # Replace actual newlines (possibly with surrounding spaces) with \n\n escape
    inner = re.sub(r'\r?\n\s*\r?\n', r'\\n\\n', inner)
    inner = re.sub(r'\r?\n', r' ', inner)
    return m.group(1) + inner + '"'

if hook_broken_pattern.search(content):
    content = hook_broken_pattern.sub(collapse_hook, content, count=1)
    print('hook collapsed OK')
else:
    print('hook pattern not found')

# Fix BODY
body_broken_pattern = re.compile(
    r'(body:\s*")(매 시험마다 \*\*핵심 주장을 한 문장으로 정한 뒤\*\*[^"]*결과는 \*\*95점\*\*이었습니다\.)"',
    re.DOTALL
)

def collapse_body(m):
    inner = m.group(2)
    inner = re.sub(r'\r?\n\s*\r?\n', r'\\n\\n', inner)
    inner = re.sub(r'\r?\n', r' ', inner)
    return m.group(1) + inner + '"'

if body_broken_pattern.search(content):
    content = body_broken_pattern.sub(collapse_body, content, count=1)
    print('body collapsed OK')
else:
    print('body pattern not found')

# Fix CLOSING
closing_broken_pattern = re.compile(
    r'(closing:\s*")(설득력 있는 주장은 논리가 아니라[^"]*그러나 구조만으로는 부족한 순간이 있었습니다\.)"',
    re.DOTALL
)

def collapse_closing(m):
    inner = m.group(2)
    inner = re.sub(r'\r?\n\s*\r?\n', r'\\n\\n', inner)
    inner = re.sub(r'\r?\n', r' ', inner)
    return m.group(1) + inner + '"'

if closing_broken_pattern.search(content):
    content = closing_broken_pattern.sub(collapse_closing, content, count=1)
    print('closing collapsed OK')
else:
    print('closing pattern not found')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done.')
