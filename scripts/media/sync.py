"""Download every Cloudinary preview clip/poster the site renders into public/media
and write lib/media-map.json (Cloudinary URL -> local path).

Run after `next build` (it reads the built HTML), from the repo root:
    python3 scripts/media/sync.py
Only transformed previews (c_scale / so_3) are copied; full videos stay remote.
"""
import concurrent.futures as cf, hashlib, json, os, re, urllib.request

ROOT = '.next/server/app'
pat = re.compile(r"https://res\.cloudinary\.com/[a-z0-9]+/(?:video|image)/upload/[^\"'\\ )&]+")
urls = set()
for d, _, fs in os.walk(ROOT):
    for f in fs:
        if f.endswith(('.html', '.rsc', '.body')):
            for u in pat.findall(open(os.path.join(d, f), errors='ignore').read()):
                if 'c_scale' in u or 'so_3' in u:
                    urls.add(u)

mp = json.load(open('lib/media-map.json')) if os.path.exists('lib/media-map.json') else {}
todo = [u for u in urls if u not in mp]
os.makedirs('public/media', exist_ok=True)

def ext(ct):
    return 'mp4' if 'mp4' in ct else 'webp' if 'webp' in ct else 'avif' if 'avif' in ct else 'png' if 'png' in ct else 'jpg'

def get(u):
    req = urllib.request.Request(u, headers={'Accept': 'image/webp,image/*,video/*,*/*;q=0.8', 'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=120) as r:
        data, ct = r.read(), r.headers.get('content-type', '')
    name = f"{hashlib.sha1(u.encode()).hexdigest()[:16]}.{ext(ct)}"
    open('public/media/' + name, 'wb').write(data)
    return u, '/media/' + name

with cf.ThreadPoolExecutor(8) as ex:
    for f in cf.as_completed([ex.submit(get, u) for u in todo]):
        try:
            u, p = f.result(); mp[u] = p
        except Exception as e:
            print('skip', e)
json.dump(mp, open('lib/media-map.json', 'w'), indent=0, sort_keys=True)
print(f'{len(todo)} new, {len(mp)} total')
