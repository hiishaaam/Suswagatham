import os, glob, re

# Files to update
def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # Replace import { motion ... } with { m ... }
    # Have to be careful not to match other things.
    content = re.sub(r'import\s+\{([^}]*)\bmotion\b([^}]*)\}\s+from\s+[\'"]motion/react[\'"]', 
                     lambda m: f'import {{{m.group(1)}m{m.group(2)}}} from \'motion/react\'', 
                     content)

    # Replace <motion. div  with <m.
    content = re.sub(r'<motion\.', '<m.', content)
    # Replace </motion. div  with </m.
    content = re.sub(r'</motion\.', '</m.', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('components'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
            
for root, _, files in os.walk('app'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
