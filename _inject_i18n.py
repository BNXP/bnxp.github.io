#!/usr/bin/env python3
"""
Inject data-i18n attributes into sub-page HTML files based on existing locale JSON.
Preserves existing data-i18n attributes. Adds missing ones by matching text to JSON values.
Outputs updated HTML and merged JSON (including any new keys from existing semantic data-i18n).
"""
import json, re, os
from bs4 import BeautifulSoup, NavigableString

BASE = "/Users/liuli/Desktop/阿拉伯官网"

def slugify(text):
    # Create a safe key suffix from text (first 20 chars)
    t = text.strip()[:20]
    t = re.sub(r'[^\w\s-]', '', t, flags=re.U)
    t = re.sub(r'[-\s]+', '_', t)
    return t.strip('_')

def get_text_signature(el):
    """Get normalized text for matching."""
    txt = el.get_text(strip=True)
    # Collapse whitespace
    txt = re.sub(r'\s+', ' ', txt)
    return txt

def walk_elements(soup, tags):
    """Yield elements in document order that match given tags, skipping script/style."""
    for el in soup.find_all(tags):
        if el.name in ('script', 'style', 'meta', 'link', 'title'):
            continue
        yield el

def process_page(html_path, json_path, prefix):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')

    # Load existing JSON if present
    existing = {}
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            existing = json.load(f)

    # Build reverse map: normalized text -> list of keys
    reverse = {}
    for k, v in existing.items():
        nv = re.sub(r'\s+', ' ', str(v).strip())
        reverse.setdefault(nv, []).append(k)

    # Tags that carry user-visible text
    text_tags = ('h1','h2','h3','h4','h5','h6','p','span','small','strong','em','a','li','summary','div','blockquote','button')

    # Track used keys and text occurrences
    used_keys = set()
    counters = {}

    # First pass: identify existing data-i18n keys
    for el in soup.find_all(attrs={"data-i18n": True}):
        key = el.get('data-i18n')
        used_keys.add(key)
        # If this key isn't in existing JSON, we'll capture its text later

    # Second pass: inject data-i18n where missing
    for el in walk_elements(soup, text_tags):
        if el.get('data-i18n'):
            continue
        # Skip if no meaningful text
        sig = get_text_signature(el)
        if not sig or len(sig) < 2:
            continue
        # Skip elements that are just wrappers for child elements with data-i18n
        # (only inject on leaf-ish elements)
        children_with_text = [c for c in el.children if isinstance(c, NavigableString) and str(c).strip()]
        if not children_with_text and not el.string:
            # This element's text comes entirely from children elements
            # We usually want to skip it to avoid overwriting children translations
            # But if it has no element children that carry text (e.g., icon + text mixed)
            # Check if any child element has data-i18n
            has_i18n_child = any(c.get('data-i18n') for c in el.find_all(attrs={"data-i18n": True}))
            if has_i18n_child:
                continue
            # If no child has data-i18n and this element itself has direct text nodes
            # Actually get_text already includes children. Let's be more careful.
            direct_text = ' '.join(str(c).strip() for c in el.contents if isinstance(c, NavigableString)).strip()
            if not direct_text:
                continue

        # Try to match against existing JSON values
        matched_key = None
        if sig in reverse:
            for candidate in reverse[sig]:
                if candidate not in used_keys:
                    matched_key = candidate
                    break

        if matched_key:
            el['data-i18n'] = matched_key
            used_keys.add(matched_key)
            continue

        # Generate a new key
        tag = el.name
        cls = '_'.join(el.get('class', []))[:20] or 'txt'
        base = f"{prefix}_{tag}_{cls}"
        idx = counters.get(base, 0) + 1
        counters[base] = idx
        new_key = f"{base}_{idx}"
        # Ensure uniqueness
        while new_key in used_keys or new_key in existing:
            idx += 1
            counters[base] = idx
            new_key = f"{base}_{idx}"
        el['data-i18n'] = new_key
        used_keys.add(new_key)
        existing[new_key] = sig

    # Third pass: capture semantic keys that were already in HTML but missing from JSON
    for el in soup.find_all(attrs={"data-i18n": True}):
        key = el.get('data-i18n')
        if key not in existing:
            sig = get_text_signature(el)
            if sig:
                existing[key] = sig

    # Write updated HTML (prettify can break some things, so we use str(soup))
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))

    # Write updated JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    return len(used_keys)

pages = [
    (f"{BASE}/crisis/index.html", f"{BASE}/locales/crisis/ar.json", "crisis"),
    (f"{BASE}/treatments/premature-ejaculation.html", f"{BASE}/locales/treatments/pe/ar.json", "pe"),
    (f"{BASE}/treatments/erectile-dysfunction.html", f"{BASE}/locales/treatments/ed/ar.json", "ed"),
    (f"{BASE}/treatments/penis-enlargement.html", f"{BASE}/locales/treatments/enlargement/ar.json", "enlargement"),
]

for html_path, json_path, prefix in pages:
    count = process_page(html_path, json_path, prefix)
    print(f"[{prefix}] Injected {count} data-i18n attributes into {html_path}")
