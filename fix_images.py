import os, glob, re

files = glob.glob('components/templates/*.tsx')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if '<img ' in content:
        # Import Image
        if 'import Image ' not in content:
            content = re.sub(r'(import .*?;?\n+)(?!import)', r'\g<1>import Image from \'next/image\';\n', content, count=1)
            
        # Replace w-24 h-24
        content = re.sub(
            r'<img([^>]*?)(className="([^"]*?)w-24 h-24([^"]*?)")([^>]*?)>',
            r'<Image\g<1>\g<2> width={96} height={96}\g<5>>',
            content
        )
        
        # Replace w-full
        content = re.sub(
            r'<img([^>]*?)(w-full)([^>]*?)>',
            r'<Image\g<1>\g<2>\g<3> fill>',
            content
        )
        
        # Finally, any remaining <img that didn't get <Image
        content = re.sub(r'<img ', r'<Image ', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
