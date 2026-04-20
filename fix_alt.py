import os, glob, re

files = glob.glob('components/templates/*.tsx')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    def add_alt(match):
        img_tag = match.group(0)
        # Check if 'alt=' is present in the tag
        if ' alt=' not in img_tag:
            # Just insert alt="" before the closing > or />
            # Be careful not to replace anything else
            img_tag = re.sub(r'(/?\s*>)\s*$', r' alt=""\1', img_tag)
        return img_tag

    # Replace <Image ... />
    content = re.sub(r'<Image[^>]*>', add_alt, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
