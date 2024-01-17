#!/bin/bash

# This script converts from javascript files to .db files then to the database format foundry wants
# This script is meant to be run from the root of the repository
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    datadir="/mnt/c/Users/catro/AppData/Local/FoundryVTT/Data/modules" # This is the path to your foundry data folder
    conversionfile="convert-linux.js"
elif [[ "$OSTYPE" == "win32"* ]]; then
    ndatadir="/c/Users/catro/AppData/Local/FoundryVTT/Data/modules" # This is the path to your foundry data folder
    conversionfile="convert-windows.js"
elif [[ "$OSTYPE" == "msys" ]]; then
    datadir="/c/Users/catro/AppData/Local/FoundryVTT/Data/modules" # This is the path to your foundry data folder
    conversionfile="convert-windows.js"
fi


npm install
rm -rf $datadir/SR5-Compendium
rm -rf ./packs
rm -rf ./releasescripts/packs
mkdir -p $datadir/SR5-Compendium
node ./releasescripts/$conversionfile

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    node ./releasescripts/convert-linux.js
elif [[ "$OSTYPE" == "win32"* ]]; then
    node ./releasescripts/convert-windows.js
elif [[ "$OSTYPE" == "msys" ]]; then
    node ./releasescripts/convert-windows.js
fi

cp -rn ./src/Folders/* ./releasescripts/packs/SR5-Community-Items/_source/
cp -r ./releasescripts/packs $datadir/SR5-Compendium/
cp module.json $datadir/SR5-Compendium/
cp -r ./releasescripts/lang $datadir/SR5-Compendium/lang

fvtt package workon "SR5-Compendium" --type "Module"
fvtt package pack "SR5-Community-Macros"
fvtt package pack "SR5-Community-Items"

rm -rf $datadir/SR5-Compendium/packs/SR5-Community-Items/_source
rm -rf $datadir/SR5-Compendium/packs/SR5-Community-Macros/_source

cp -R $datadir/SR5-Compendium/packs ./
