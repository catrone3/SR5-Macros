#!/bin/bash

# This script converts from javascript files to .db files then to the database format foundry wants
# This script is meant to be run from the root of the repository
datadir="/c/Users/catro/AppData/Local/FoundryVTT/Data/modules/"
npm install
rm -rf $datadir/SR5-Compendium
rm -rf ./packs
rm -rf ./releasescripts/packs
mkdir -p $datadir/SR5-Compendium
node ./releasescripts/convert.js

cp -R ./releasescripts/packs $datadir/SR5-Compendium/
cp module.json $datadir/SR5-Compendium/

fvtt package workon "SR5-Compendium" --type "Module"
fvtt package pack "SR5-Community-Macros"
fvtt package pack "SR5-Community-Items"

rm -rf $datadir/SR5-Compendium/packs/SR5-Community-Items/_source
rm -rf $datadir/SR5-Compendium/packs/SR5-Community-Macros/_source

cp -R $datadir/SR5-Compendium/packs ./