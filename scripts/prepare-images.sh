#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/images"
OUTPUT_DIR="$ROOT_DIR/assets/images/optimized"
MANIFEST_FILE="$OUTPUT_DIR/manifest.csv"

MAX_SIZE="${MAX_SIZE:-2200}"
JPG_FORMAT_OPTIONS="${JPG_FORMAT_OPTIONS:-best}"
WEBP_QUALITY="${WEBP_QUALITY:-82}"

if ! command -v sips >/dev/null 2>&1; then
  echo "Error: sips is required but not installed." >&2
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Error: cwebp is required but not installed." >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_DIR"/*.jpg "$OUTPUT_DIR"/*.webp "$MANIFEST_FILE"

slugify() {
  printf "%s" "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

printf "source_file,basename,jpg_path,webp_path\n" > "$MANIFEST_FILE"

for source_path in "$SOURCE_DIR"/*; do
  [[ -f "$source_path" ]] || continue

  source_file="$(basename "$source_path")"
  stem="${source_file%.*}"
  slug="$(slugify "$stem")"
  [[ -n "$slug" ]] || slug="image"

  base_path="$OUTPUT_DIR/$slug"
  jpg_path="$base_path.jpg"
  webp_path="$base_path.webp"

  if [[ -e "$jpg_path" ]]; then
    counter=2
    while [[ -e "${base_path}-${counter}.jpg" ]]; do
      ((counter++))
    done
    base_path="${base_path}-${counter}"
    jpg_path="$base_path.jpg"
    webp_path="$base_path.webp"
  fi

  sips -s format jpeg -s formatOptions "$JPG_FORMAT_OPTIONS" --resampleHeightWidthMax "$MAX_SIZE" "$source_path" --out "$jpg_path" >/dev/null 2>/dev/null
  cwebp -quiet -q "$WEBP_QUALITY" "$jpg_path" -o "$webp_path" 2>/dev/null

  printf "%s,%s,%s,%s\n" "$source_file" "$(basename "$base_path")" "${jpg_path#$ROOT_DIR/}" "${webp_path#$ROOT_DIR/}" >> "$MANIFEST_FILE"
done

echo "Prepared images in: $OUTPUT_DIR"
echo "Manifest written to: $MANIFEST_FILE"
