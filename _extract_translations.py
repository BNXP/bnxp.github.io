import json
import re
import os
from bs4 import BeautifulSoup

def process_page(html_path, prefix):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    # Remove non-content tags
    for tag in soup(['script', 'style', 'svg', 'noscript', 'iframe', 'canvas', 'meta', 'link']):
        tag.decompose()

    ar_dict = {}
    en_dict = {}
    counter = 0

    # Walk all elements
    for elem in soup.find_all(True):
        # Get direct text only (not from children)
        direct_strings = elem.find_all(string=True, recursive=False)
        direct_text = ''.join(direct_strings).strip()

        if not direct_text or len(direct_text) < 2:
            continue

        # Skip if no Arabic/Unicode letters (already English or symbols)
        if not re.search(r'[؀-ۿݐ-ݿ]', direct_text):
            continue

        # Skip option values inside select (language switcher)
        if elem.name == 'option' and elem.parent and elem.parent.name == 'select':
            continue

        # Skip elements that already have data-i18n
        if elem.get('data-i18n'):
            continue

        # Skip if parent already has this exact text (avoid duplicates)
        parent = elem.find_parent()
        if parent and parent.get_text(strip=True) == direct_text:
            continue

        # Generate key
        tag = elem.name or 'span'
        cls = '_'.join(elem.get('class', []))[:20]
        counter += 1
        key = f"{prefix}_{tag}_{cls}_{counter}" if cls else f"{prefix}_{tag}_{counter}"
        key = re.sub(r'[^a-zA-Z0-9_]', '_', key)
        key = re.sub(r'_+', '_', key).strip('_')

        # Store translation
        ar_dict[key] = direct_text
        en_dict[key] = direct_text  # placeholder

        # Add data-i18n to original HTML string (simple replace)
        # We need to be careful here - use a marker approach

    return ar_dict, en_dict, html, counter


pages = [
    ('/Users/liuli/Desktop/阿拉伯官网/crisis/index.html', 'crisis', 'locales/crisis/'),
    ('/Users/liuli/Desktop/阿拉伯官网/treatments/premature-ejaculation.html', 'pe', 'locales/treatments/pe/'),
    ('/Users/liuli/Desktop/阿拉伯官网/treatments/erectile-dysfunction.html', 'ed', 'locales/treatments/ed/'),
    ('/Users/liuli/Desktop/阿拉伯官网/treatments/penis-enlargement.html', 'enlargement', 'locales/treatments/enlargement/'),
]

for html_path, prefix, out_dir in pages:
    print(f"\n=== Processing {html_path} ===")
    ar_dict, en_dict, html_orig, count = process_page(html_path, prefix)
    print(f"Found {count} translatable text blocks")

    # Save ar.json (original Arabic)
    ar_path = os.path.join('/Users/liuli/Desktop/阿拉伯官网', out_dir, 'ar.json')
    with open(ar_path, 'w', encoding='utf-8') as f:
        json.dump(ar_dict, f, ensure_ascii=False, indent=2)

    # Save en.json (placeholder - will translate later)
    en_path = os.path.join('/Users/liuli/Desktop/阿拉伯官网', out_dir, 'en.json')
    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_dict, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(ar_dict)} keys to {out_dir}ar.json")

print("\nDone! Now I need to add data-i18n attributes to HTML files.")
print("The next step is manual translation of en.json files.")
