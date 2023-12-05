const fs = require("fs");
var path = require("path");
const chardet = require('chardet');
const iconv = require('iconv-lite');

const types = {
  Action: "action",
  "Adept Powers": "adept_power",
  Devices: "device",
  Foci: "equipment",
  Metamagic: "quality",
  Programs: "program",
  Qualities: "quality",
  Spells: "spell",
};

const systems = {
  action: {},
  adept_power: {},
  device: {},
  equipment: {},
  quality: {},
  program: {},
  spell: {},
};

var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

function randomID(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const r = Array.from({ length }, () => (Math.random() * chars.length) >> 0);
  return r.map((i) => chars[i]).join("");
}

walk("./src/Macros", function (err, results) {
  if (err) throw err;
  var scripts = [];
  var contents = "";
  var relative = "";
  var name = "";
  script = {};
  results.forEach((file) => {
    if (file.endsWith(".js")) {
      if (file.endsWith("cleanup.js")) return;
      relative = path.relative("./src/Effect-Macros", file);
      console.log(relative.split("/")[3]);
      name = relative.split("/")[3];
      filecontents = convertFile(file);
      script = {
        script: filecontents,
        name: name,
      };
      scripts.push(script);
    }
  });
  createFile(scripts);
});

function itemwalk(directory, callback) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      itemwalk(filePath, callback);
    } else {
      console.log(`Processing file: ${filePath}`);
      callback(filePath);
    }
  });
}

function processFile(jsonFilePath) {
  try {
    if (jsonFilePath && jsonFilePath.endsWith && jsonFilePath.endsWith(".json")) {
      var jsonContent = JSON.parse(convertFile(jsonFilePath));
      console.log(jsonContent.name);

      if (jsonContent && jsonContent.effects && Array.isArray(jsonContent.effects) && jsonContent.effects.length > 0) {
        const effectIndex = 0; // Assuming there is a single entry in the effects array
        
        // Check if the flags structure exists
        if (!jsonContent.effects[effectIndex]) {
          console.error(`Effects array does not have an entry at index ${effectIndex} in file: ${jsonFilePath}`);
          return;
        }

        if (!jsonContent.effects[effectIndex].flags) {
          jsonContent.effects[effectIndex].flags = { effectmacro: {} };
        }

        // Get the folder of the JSON file
        const folder = path.dirname(jsonFilePath);
        console.log("Creating Item Jsons")
        // Read and add contents of each JavaScript file in the folder
        fs.readdirSync(folder).forEach((file) => {
          const jsFilePath = path.join(folder, file);
          if (jsFilePath.endsWith(".js")) {
            const key = path.basename(jsFilePath, ".js");
            try {
              const jsContent = convertFile(jsFilePath);

              switch (key) {
                case "effect":
                  jsonContent.effects[effectIndex].flags.effectmacro.onCreate.script = jsContent;
                  jsonContent.effects[effectIndex].flags.effectmacro.onToggle.script = jsContent;
                  break;
                case "cleanup":
                  jsonContent.effects[effectIndex].flags.effectmacro.onDisable.script = jsContent;
                  break;
                default:
                  console.error('Unknown effect type');
              } 
            } catch (err) {
              console.error(`Error reading ${jsFilePath}: ${err}`);
            }
          }
        });

        // Write the new JSON file
        console.log("Writing file:" + jsonContent.name);
        var content = JSON.stringify(jsonContent, null, 4);
        writeFile(content, "SR5-Community-Items", jsonContent.name);
      } else {
        console.error(`Effects array is empty in file: ${jsonFilePath}`);
      }
    } else {
      console.error(`Invalid jsonFilePath: ${jsonFilePath}`);
    }
  } catch (error) {
    console.error(`Error processing file: ${jsonFilePath}`, error);
  }
}

function convertFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  let detectedEncoding = chardet.detect(buffer);

  // If chardet cannot detect the encoding, default to binary
  if (!detectedEncoding) {
    detectedEncoding = 'binary';
  }

  // Use iconv-lite to convert to UTF-8
  const utf8Content = iconv.decode(buffer, detectedEncoding);

  return utf8Content;
}

function writeFile(file, folder, name) {
  var dir = `releasescripts/packs/${folder}/_source`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFile(
    `./releasescripts/packs/${folder}/_source/${name}.json`,
    file,
    (err) => {
      if (err) {
        return console.log(err);
      }
      console.log(`The file ${name} was saved!`);
    },
  );
}

function createFile(scripts) {
  var uuid = "";
  var author = randomID(16);
  for (i = 0; i < scripts.length; i++) {
    console.log(scripts[i].name);
    uuid = randomID(16);
    var name = scripts[i].name;
    var filecontents = {
      name: name,
      type: "script",
      _id: uuid,
      author: author,
      img: "icons/svg/dice-target.svg",
      scope: "global",
      command: scripts[i].script,
      folder: "null",
      sort: 0,
      ownership: {
        default: 2,
      },
      flags: {},
      _stats: {
        system: "shadowrun5e",
      },
      _key: "!macros!" + uuid,
    };
    writeFile(
      JSON.stringify(filecontents, null, 4),
      "SR5-Community-Macros",
      name,
    );
  }
}

const directoryPath = './src/Effect-Macros';
itemwalk(directoryPath, processFile);