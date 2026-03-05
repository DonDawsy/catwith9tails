#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/images"
OUTPUT_DIR="$ROOT_DIR/assets/images/optimized"
MANIFEST_FILE="$OUTPUT_DIR/manifest.csv"

MAX_SIZE="${MAX_SIZE:-2200}"
JPG_FORMAT_OPTIONS="${JPG_FORMAT_OPTIONS:-best}"
WEBP_QUALITY="${WEBP_QUALITY:-82}"
HAS_HEIF_CONVERT=0
HAS_MAGICK=0

if ! command -v sips >/dev/null 2>&1; then
  echo "Error: sips is required but not installed." >&2
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Error: cwebp is required but not installed." >&2
  exit 1
fi

if command -v heif-convert >/dev/null 2>&1; then
  HAS_HEIF_CONVERT=1
fi

if command -v magick >/dev/null 2>&1; then
  HAS_MAGICK=1
fi

mkdir -p "$OUTPUT_DIR"
rm -f "$OUTPUT_DIR"/*.jpg "$OUTPUT_DIR"/*.webp "$MANIFEST_FILE"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

jpg_quality_from_format_option() {
  local format_option
  format_option="$(printf "%s" "$JPG_FORMAT_OPTIONS" | tr '[:upper:]' '[:lower:]')"

  case "$format_option" in
    best) echo 92 ;;
    high) echo 88 ;;
    normal) echo 82 ;;
    low) echo 70 ;;
    *) echo 88 ;;
  esac
}

convert_to_jpeg() {
  local source_path="$1"
  local jpg_path="$2"
  local source_file ext

  source_file="$(basename "$source_path")"
  ext="${source_file##*.}"
  ext="$(printf "%s" "$ext" | tr '[:upper:]' '[:lower:]')"

  if [[ "$ext" == "heic" || "$ext" == "heif" ]]; then
    if [[ "$HAS_HEIF_CONVERT" -eq 1 ]]; then
      local intermediate="$TMP_DIR/${source_file%.*}-decoded.jpg"
      heif-convert "$source_path" "$intermediate" >/dev/null 2>&1
      sips -s format jpeg -s formatOptions "$JPG_FORMAT_OPTIONS" --resampleHeightWidthMax "$MAX_SIZE" "$intermediate" --out "$jpg_path" >/dev/null 2>/dev/null
      return
    fi

    if [[ "$HAS_MAGICK" -eq 1 ]]; then
      local quality
      quality="$(jpg_quality_from_format_option)"
      magick "$source_path" -auto-orient -resize "${MAX_SIZE}x${MAX_SIZE}>" -quality "$quality" "$jpg_path" >/dev/null 2>&1
      return
    fi

    echo "Error: Cannot safely process $source_file. Install heif-convert or ImageMagick (magick) for HEIC/HEIF support." >&2
    exit 1
  fi

  sips -s format jpeg -s formatOptions "$JPG_FORMAT_OPTIONS" --resampleHeightWidthMax "$MAX_SIZE" "$source_path" --out "$jpg_path" >/dev/null 2>/dev/null
}

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

  convert_to_jpeg "$source_path" "$jpg_path"
  cwebp -quiet -q "$WEBP_QUALITY" "$jpg_path" -o "$webp_path" 2>/dev/null

  printf "%s,%s,%s,%s\n" "$source_file" "$(basename "$base_path")" "${jpg_path#$ROOT_DIR/}" "${webp_path#$ROOT_DIR/}" >> "$MANIFEST_FILE"
done

echo "Prepared images in: $OUTPUT_DIR"
echo "Manifest written to: $MANIFEST_FILE"
