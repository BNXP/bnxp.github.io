#!/usr/bin/env python3
"""
Translate sub-page ar.json -> en.json using Google Translate with batching.
Robust version with timeouts and progress output.
"""
import json, os, time, socket
from deep_translator import GoogleTranslator

socket.setdefaulttimeout(20)

BASE = "/Users/liuli/Desktop/阿拉伯官网"
DELIM = " ||| "

pages = [
    ("crisis", f"{BASE}/locales/crisis"),
    ("pe", f"{BASE}/locales/treatments/pe"),
    ("ed", f"{BASE}/locales/treatments/ed"),
    ("enlargement", f"{BASE}/locales/treatments/enlargement"),
]

def should_translate(text):
    if not text or not text.strip():
        return False
    alpha_count = sum(1 for c in text if ('؀' <= c <= 'ۿ') or c.isalpha())
    return alpha_count > 0

def translate_batch(translator, texts, max_chars=3000):
    if not texts:
        return []
    batches = []
    cur = []
    cur_len = 0
    for t in texts:
        needed = len(t) + len(DELIM)
        if cur_len + needed > max_chars and cur:
            batches.append(cur)
            cur = [t]
            cur_len = len(t)
        else:
            cur.append(t)
            cur_len += needed
    if cur:
        batches.append(cur)

    results = []
    for batch in batches:
        joined = DELIM.join(batch)
        for attempt in range(3):
            try:
                tr = translator.translate(joined)
                if tr:
                    parts = tr.split(DELIM)
                    if len(parts) == len(batch):
                        results.extend(parts)
                        break
                    else:
                        print(f"    Delimiter mismatch ({len(parts)} vs {len(batch)}), retry singles")
                        raise ValueError("delimiter mismatch")
                else:
                    raise ValueError("empty response")
            except Exception as e:
                if attempt == 2:
                    print(f"    Batch failed after 3 tries: {e}")
                    # fallback singles
                    for item in batch:
                        try:
                            r = translator.translate(item)
                            results.append(r if r else item)
                        except Exception as e2:
                            print(f"      Single fail: {e2}")
                            results.append(item)
                        time.sleep(0.3)
                else:
                    time.sleep(1)
        time.sleep(0.5)
    return results

def process_page(prefix, folder):
    ar_path = f"{folder}/ar.json"
    with open(ar_path, 'r', encoding='utf-8') as f:
        ar_data = json.load(f)

    out_path = f"{folder}/en.json"
    existing = {}
    if os.path.exists(out_path):
        try:
            with open(out_path, 'r', encoding='utf-8') as f:
                existing = json.load(f)
        except Exception:
            existing = {}

    to_translate = []
    for k, v in ar_data.items():
        if k not in existing or existing.get(k) == v:
            if should_translate(v):
                to_translate.append((k, v))
            else:
                existing[k] = v

    if not to_translate:
        print(f"[{prefix}] en: already up to date")
        new_data = dict(existing)
        for k, v in ar_data.items():
            if k not in new_data:
                new_data[k] = v
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=2)
        return

    print(f"[{prefix}] en: translating {len(to_translate)} keys...")
    translator = GoogleTranslator(source='ar', target='en')
    texts = [v for _, v in to_translate]
    translated = translate_batch(translator, texts)

    new_data = dict(existing)
    for (k, _), t in zip(to_translate, translated):
        new_data[k] = t
    for k, v in ar_data.items():
        if k not in new_data:
            new_data[k] = v

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    print(f"[{prefix}] en: saved {len(new_data)} keys")

for prefix, folder in pages:
    process_page(prefix, folder)
    time.sleep(1)

print("English translation complete!")
