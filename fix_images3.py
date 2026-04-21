import os, glob

files = glob.glob('components/templates/*.tsx')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace("from \\'next/image\\';", "from 'next/image';")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
