const { create } = require("domain");
const fs = require("fs");
var path = require("path");
var crypto = require("crypto");
const { type } = require("os");

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
      name = relative.split("\\")[3];
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
      console.log(filePath);
      callback(filePath);
    }
  });
}

function processFile(jsonFilePath) {
  try{
  if (jsonFilePath.endsWith(".json")) {
    const jsonContent = convertFile(jsonFilePath);
    console.log(jsonContent);
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
          switch (path.basename(jsFilePath, ".js")) {
            case "effect":
              jsonContent.effects[0].flags.effectmacro.onCreate.script = jsContent;
              jsonContent.effects[0].flags.effectmacro.onToggle.script = jsContent;
              break;
            case "cleanup":
              jsonContent.effects[0].flags.effectmacro.onDisable.script = jsContent;
              break;
            default:
              error('Unknown effect type')
          } 
        } catch (err) {
          console.error(`Error reading ${jsFilePath}: ${err}`);
        }
      }
    });
    // Write the new JSON file
    console.log("Writing file:"+jsonContent.name);
    writeFile(jsonContent, "SR5-Community-Items", jsonContent.name);
  }
  }
  catch(err){
    console.error(`Error reading ${jsonFilePath}: ${err}`);
  }
};

function convertFile(file) {
  return fs.readFileSync(file, "utf8");
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
    },
  );
}

function createFile(scripts) {
  var uuid = "";
  var author = randomID(16);
  console.log("Creating Script Jsons")
  for (i = 0; i < scripts.length; i++) {
    console.log("Making file:"+scripts[i].name);
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

const directoryPath = './src/Effect-Macros/Programs';
itemwalk(directoryPath, processFile);