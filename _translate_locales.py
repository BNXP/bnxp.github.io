#!/usr/bin/env python3
"""
Copy ar.json keys to en/tr/ur.json and translate values using Google Translate with batching.
Uses delimiter-separated batches to minimize API calls.
"""
import json, os, time, re
from deep_translator import GoogleTranslator

BASE = "/Users/liuli/Desktop/阿拉伯官网"
DELIM = "\n---|||---\n"

LANG_MAP = {
    'en': 'en',
    'tr': 'tr',
    'ur': 'ur',
}

pages = [
    ("crisis", f"{BASE}/locales/crisis"),
    ("pe", f"{BASE}/locales/treatments/pe"),
    ("ed", f"{BASE}/locales/treatments/ed"),
    ("enlargement", f"{BASE}/locales/treatments/enlargement"),
]

def should_translate(text):
    if not text or not text.strip():
        return False
    # If no alphabetic characters (emoji/symbols only), skip
    alpha_count = sum(1 for c in text if ('؀' <= c <= 'ۿ') or c.isalpha())
    return alpha_count > 0

def translate_batches(texts, target, max_chars=4000):
    """Translate list of texts in batches using delimiter."""
    if not texts:
        return []
    translator = GoogleTranslator(source='auto', target=target)

    # Build batches
    batches = []
    current = []
    current_len = 0
    for t in texts:
        tlen = len(t) + len(DELIM)
        if current_len + tlen > max_chars and current:
            batches.append(current)
            current = [t]
            current_len = len(t)
        else:
            current.append(t)
            current_len += tlen
    if current:
        batches.append(current)

    results = []
    for batch in batches:
        joined = DELIM.join(batch)
        try:
            translated = translator.translate(joined)
            if translated:
                parts = translated.split(DELIM)
                # Handle case where delimiter got translated or altered
                if len(parts) == len(batch):
                    results.extend(parts)
                else:
                    # Fallback: translate one by one
                    print(f"  Delimiter mismatch ({len(parts)} vs {len(batch)}), falling back to single")
                    for item in batch:
                        try:
                            r = translator.translate(item)
                            results.append(r if r else item)
                        except Exception as e:
                            print(f"    Single error: {e}")
                            results.append(item)
                        time.sleep(0.2)
            else:
                results.extend(batch)
        except Exception as e:
            print(f"  Batch error: {e}, falling back to single")
            for item in batch:
                try:
                    r = translator.translate(item)
                    results.append(r if r else item)
                except Exception as e2:
                    print(f"    Single error: {e2}")
                    results.append(item)
                time.sleep(0.2)
        time.sleep(0.8)
    return results

def process_page(prefix, folder):
    ar_path = f"{folder}/ar.json"
    with open(ar_path, 'r', encoding='utf-8') as f:
        ar_data = json.load(f)

    for lang, target in LANG_MAP.items():
        out_path = f"{folder}/{lang}.json"
        existing = {}
        if os.path.exists(out_path):
            try:
                with open(out_path, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            except Exception:
                existing = {}

        # Determine keys needing translation
        to_translate_keys = []
        for k, v in ar_data.items():
            if k not in existing or existing.get(k) == v:
                if should_translate(v):
                    to_translate_keys.append(k)
                else:
                    # Non-translatable (symbols only), copy as-is
                    existing[k] = v

        if not to_translate_keys:
            print(f"[{prefix}] {lang}: already up to date")
            # Still ensure all keys exist
            new_data = dict(existing)
            for k, v in ar_data.items():
                if k not in new_data:
                    new_data[k] = v
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, ensure_ascii=False, indent=2)
            continue

        print(f"[{prefix}] {lang}: translating {len(to_translate_keys)} keys in batches...")
        texts = [ar_data[k] for k in to_translate_keys]
        translated = translate_batches(texts, target)

        new_data = dict(existing)
        for k, t in zip(to_translate_keys, translated):
            new_data[k] = t
        # Ensure all keys present
        for k, v in ar_data.items():
            if k not in new_data:
                new_data[k] = v

        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=2)
        print(f"[{prefix}] {lang}: saved ({len(new_data)} keys)")

for prefix, folder in pages:
    process_page(prefix, folder)

print("Done!")
