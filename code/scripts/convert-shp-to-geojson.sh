#!/bin/bash

# Check if correct number of arguments is provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <input_file.shp> <output_file.geojson>"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

# Check if npx is available
if ! command -v npx &> /dev/null; then
  echo "❌ Error: npx is not installed. Please install Node.js and npm."
  exit 1
fi

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "❌ Error: Input file '$INPUT_FILE' not found."
  exit 1
fi

# Run mapshaper conversion
echo "🔄 Converting '$INPUT_FILE' to GeoJSON with WGS84 projection..."
npx mapshaper "$INPUT_FILE" -proj wgs84 -o format=geojson "$OUTPUT_FILE"

# Verify output
if [ -f "$OUTPUT_FILE" ]; then
  echo "✅ Conversion successful. Output saved to '$OUTPUT_FILE'."
else
  echo "❌ Conversion failed."
  exit 1
fi
