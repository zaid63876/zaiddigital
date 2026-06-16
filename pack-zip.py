import os
import zipfile
from pathlib import Path

root = r"C:\Users\Zaid\Webside ClaudeCode"
zip_path = os.path.join(root, "zaid-digital-website-FIXED.zip")

# Alte ZIP löschen falls vorhanden
if os.path.exists(zip_path):
    os.remove(zip_path)

# Einzelne Dateien, die NICHT mit hochsollen
excluded_files = {
    'zaid-digital-website.zip', 'zaid-digital-website-FIXED.zip',
    'livereload.js', 'stack-prototype.html', 'shadow-os.zip',
    'pack-zip.py', 'redesign-preview.html', '_flowtest.html',
}

# Ordner, die komplett ausgeschlossen werden (Entwicklung/Tools)
excluded_dirs = {'graphify-out', 'life-rpg', '.claude'}

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for fpath in Path(root).rglob('*'):
        if not fpath.is_file():
            continue
        rel = fpath.relative_to(root)
        # Ordner-Ausschluss prüfen
        if any(part in excluded_dirs for part in rel.parts):
            continue
        if fpath.name in excluded_files:
            continue
        # Relativer Pfad mit FORWARD SLASHES (wichtig für Netlify/Linux!)
        zf.write(fpath, rel.as_posix())
    names = zf.namelist()

print(f"OK - ZIP erstellt: {zip_path}")
print(f"Größe: {os.path.getsize(zip_path) / 1024:.0f} KB")
print(f"Dateien: {len(names)}")
print("Inhalt:")
for n in sorted(names):
    print("  " + n)
