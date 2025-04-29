#!/bin/bash
dataFileName="$1"
echo "Received data file: $dataFileName"

# Absolute path to DataAudit
dataAuditPath="/home/cherry/Downloads/Demo/Admin-Cloud/DataAudit"

# Check if the DataAudit file exists
if [ ! -f "$dataAuditPath" ]; then
  echo "Error: DataAudit not found at $dataAuditPath"
  exit 1
fi

# Check if the data file exists
if [ ! -f "$dataFileName" ]; then
  echo "Error: File does not exist: $dataFileName"
  exit 1
fi

# Running setup and tag generation
echo "Running Setup..."
"$dataAuditPath" Setup

echo "Setup Done..."

echo "Running TagGen..."
"$dataAuditPath" TagGen Params.bin alpha.bin "$dataFileName"

echo "Metadata generated for the data file $dataFileName"

