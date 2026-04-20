import os, glob, re

files = glob.glob('components/templates/*.tsx')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix syntax errors caused by previous replacement
    # Turn `/ width={96} height={96}>` into `width={96} height={96} />`
    content = content.replace('/ width={96} height={96}>', 'width={96} height={96} />')
    
    # Turn `"/ fill>` into `" fill />`
    content = content.replace('"/ fill>', '" fill />')
    
    # Turn `/ fill>` into `fill />`
    content = content.replace('/ fill>', 'fill />')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
