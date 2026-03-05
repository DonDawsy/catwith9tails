#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-$ROOT_DIR/assets/images/unoptimized}"
OUTPUT_DIR="${OUTPUT_DIR:-$ROOT_DIR/assets/images/optimized}"
MANIFEST_FILE="${MANIFEST_FILE:-$OUTPUT_DIR/manifest.csv}"
CONTENT_FILE="${CONTENT_FILE:-$ROOT_DIR/assets/js/content.js}"

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
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: Source directory does not exist: $SOURCE_DIR" >&2
  exit 1
fi

if [[ ! -f "$CONTENT_FILE" ]]; then
  echo "Error: Content file does not exist: $CONTENT_FILE" >&2
  exit 1
fi

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

ensure_manifest_header() {
  if [[ ! -s "$MANIFEST_FILE" ]]; then
    printf "source_file,basename,jpg_path,webp_path\n" > "$MANIFEST_FILE"
  fi
}

upsert_manifest_entry() {
  local source_file="$1"
  local basename_value="$2"
  local jpg_rel_path="$3"
  local webp_rel_path="$4"
  local updated_manifest="$TMP_DIR/manifest-updated.csv"

  ensure_manifest_header

  awk -F',' -v sf="$source_file" -v bn="$basename_value" '
    NR == 1 { print; next }
    $1 == sf || $2 == bn { next }
    { print }
  ' "$MANIFEST_FILE" > "$updated_manifest"

  printf "%s,%s,%s,%s\n" "$source_file" "$basename_value" "$jpg_rel_path" "$webp_rel_path" >> "$updated_manifest"
  mv "$updated_manifest" "$MANIFEST_FILE"
}

humanize_slug() {
  printf "%s" "$1" \
    | tr '-' ' ' \
    | awk '{
        out = ""
        for (i = 1; i <= NF; i++) {
          token = $i
          first = substr(token, 1, 1)
          rest = substr(token, 2)
          out = out (i > 1 ? " " : "") toupper(first) rest
        }
        print out
      }'
}

get_image_dimensions() {
  local image_path="$1"
  local dimensions
  dimensions="$(sips -g pixelWidth -g pixelHeight "$image_path" 2>/dev/null | awk '
    /pixelWidth:/ { width = $2 }
    /pixelHeight:/ { height = $2 }
    END {
      if (width ~ /^[0-9]+$/ && height ~ /^[0-9]+$/) {
        print width " " height
      }
    }
  ')"

  if [[ -n "$dimensions" ]]; then
    printf "%s\n" "$dimensions"
    return
  fi

  printf "2200 2200\n"
}

portfolio_item_exists() {
  local item_id="$1"
  grep -Eq "id:[[:space:]]*\"$item_id\"" "$CONTENT_FILE"
}

append_portfolio_item() {
  local item_id="$1"
  local width="$2"
  local height="$3"
  local item_title="$4"
  local item_block_file="$TMP_DIR/portfolio-item-${item_id}.block"
  local updated_content="$TMP_DIR/content-updated.js"
  local content_backup="$TMP_DIR/content-backup.js"
  local awk_status=0
  local inserted=0

  cat > "$item_block_file" <<EOF
    {
      id: "$item_id",
      srcBase: "assets/images/optimized/$item_id",
      width: $width,
      height: $height,
      featured: false,
      captionKey: null,
      alt: {
        en: "Archive photo: $item_title.",
        no: "Arkivfoto: $item_title."
      },
      backside: {
        en: {
          subtitle: "$item_title",
          text: "Archive photo from Neha Verma's storytelling practice."
        },
        no: {
          subtitle: "$item_title",
          text: "Arkivfoto fra Neha Vermas fortellerpraksis."
        }
      }
    },
EOF

  cp "$CONTENT_FILE" "$content_backup"

  awk -v block_file="$item_block_file" '
    function print_block(  block_line) {
      while ((getline block_line < block_file) > 0) {
        print block_line
      }
      close(block_file)
    }

    {
      if (!in_portfolio && $0 ~ /const portfolioItems = \[/) {
        in_portfolio = 1
      }

      if (in_portfolio && !inserted && $0 ~ /^[[:space:]]*\];[[:space:]]*$/) {
        if (have_prev) {
          if (prev_line ~ /^[[:space:]]*}[[:space:]]*$/) {
            print prev_line ","
          } else {
            print prev_line
          }
          have_prev = 0
        }

        print_block()
        print $0
        inserted = 1
        next
      }

      if (have_prev) {
        print prev_line
      }
      prev_line = $0
      have_prev = 1
    }

    END {
      if (have_prev) {
        print prev_line
      }
      if (!inserted) {
        exit 2
      }
    }
  ' "$CONTENT_FILE" > "$updated_content" || awk_status=$?

  if [[ "$awk_status" -eq 0 && -s "$updated_content" ]]; then
    inserted=1
  fi

  if [[ "$inserted" -ne 1 ]]; then
    echo "Failed to append portfolio item for id: $item_id" >&2
    cp "$content_backup" "$CONTENT_FILE"
    return 1
  fi

  mv "$updated_content" "$CONTENT_FILE"

  if command -v node >/dev/null 2>&1; then
    if ! node --check "$CONTENT_FILE" >/dev/null 2>&1; then
      echo "Failed to validate updated content file after adding id: $item_id" >&2
      cp "$content_backup" "$CONTENT_FILE"
      return 1
    fi
  fi
}

ensure_gallery_entry() {
  local item_id="$1"
  local jpg_path="$2"
  local dimensions width height item_title

  if portfolio_item_exists "$item_id"; then
    return 0
  fi

  dimensions="$(get_image_dimensions "$jpg_path")"
  width="${dimensions%% *}"
  height="${dimensions##* }"
  item_title="$(humanize_slug "$item_id")"
  append_portfolio_item "$item_id" "$width" "$height" "$item_title"
}

shopt -s nullglob
source_paths=("$SOURCE_DIR"/*)
shopt -u nullglob

if [[ "${#source_paths[@]}" -eq 0 ]]; then
  echo "No source images found in: $SOURCE_DIR"
  exit 0
fi

processed_count=0
failed_count=0
gallery_added_count=0

for source_path in "${source_paths[@]}"; do
  [[ -f "$source_path" ]] || continue

  source_file="$(basename "$source_path")"
  stem="${source_file%.*}"
  slug="$(slugify "$stem")"
  [[ -n "$slug" ]] || slug="image"

  base_path="$OUTPUT_DIR/$slug"
  jpg_path="$base_path.jpg"
  webp_path="$base_path.webp"
  jpg_tmp="$(mktemp "$TMP_DIR/${slug}.XXXXXX.jpg")"
  webp_tmp="$(mktemp "$TMP_DIR/${slug}.XXXXXX.webp")"

  if ! convert_to_jpeg "$source_path" "$jpg_tmp"; then
    echo "Failed to convert to JPG: $source_file" >&2
    rm -f "$jpg_tmp" "$webp_tmp"
    ((failed_count++))
    continue
  fi

  if ! cwebp -quiet -q "$WEBP_QUALITY" "$jpg_tmp" -o "$webp_tmp" 2>/dev/null; then
    echo "Failed to convert to WEBP: $source_file" >&2
    rm -f "$jpg_tmp" "$webp_tmp"
    ((failed_count++))
    continue
  fi

  if [[ ! -s "$jpg_tmp" || ! -s "$webp_tmp" ]]; then
    echo "Failed to verify output files: $source_file" >&2
    rm -f "$jpg_tmp" "$webp_tmp"
    ((failed_count++))
    continue
  fi

  mv -f "$jpg_tmp" "$jpg_path"
  mv -f "$webp_tmp" "$webp_path"

  if [[ ! -s "$jpg_path" || ! -s "$webp_path" ]]; then
    echo "Failed to verify final outputs: $source_file" >&2
    ((failed_count++))
    continue
  fi

  upsert_manifest_entry "$source_file" "$slug" "${jpg_path#$ROOT_DIR/}" "${webp_path#$ROOT_DIR/}"

  if ! portfolio_item_exists "$slug"; then
    if ! ensure_gallery_entry "$slug" "$jpg_path"; then
      echo "Failed to update full photo gallery entry: $source_file" >&2
      ((failed_count++))
      continue
    fi
    ((gallery_added_count++))
  fi

  rm -f "$source_path"
  ((processed_count++))
done

echo "Processed images: $processed_count"
echo "Failed images: $failed_count"
echo "Gallery items added: $gallery_added_count"
echo "Prepared images in: $OUTPUT_DIR"
echo "Manifest written to: $MANIFEST_FILE"
