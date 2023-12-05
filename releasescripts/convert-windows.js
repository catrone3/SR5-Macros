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

walk("./src/Effect-Macros", function (err, results) {
  if (err) throw err;
  var scripts = [];
  var wireless = false;
  var relative = "";
  var type = "";
  var name = "";
  var filecontents = "";
  var script = {};
  results.forEach((file) => {
    if (file.endsWith(".js")) {
      relative = path.relative("./src/Effect-Macros", file);
      type = relative.split("\\")[0];
      name = relative.split("\\")[1];
      filecontents = convertFile(file);
      if (scripts.includes(name)) {
        console.log("duplicate");
        scripts.indexOf(name).script = filecontents;
      } else {
        if (file.endsWith("cleanup.js")) {
          script.cleanup = filecontents;
        } else {
          script.script = filecontents;
        }
        if (type == "device" || type == "equipment") {
          wireless = true;
        }
        script.name = name;
        script.type = type;
        script.wireless = wireless;
      }
      scripts.push(script);
    }
  });
  createItems(scripts);
});

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

function createItems(scripts) {
  for (i = 0; i < scripts.length; i++) {
    var type = scripts[i].type;
    var itemid = randomID(16);
    var effectid = randomID(16);
    var name = scripts[i].name;
    console.log(name);
    var img = name.toLowerCase().replace(/ /g, "_");
    var system = systems[type];
    var effect = scripts[i].script;
    switch (scripts[i].type) {
      case "Adept Powers":
        folder = "xcAlaQ05nmdn8TPj"
        break;
      case "Foci":
        folder = "lMjzmwRhJ89aIxP0"
        break;
      case "Metamagic":
        folder = "kxqhWPhMqlxlwnnr"
        break;
      case "Devices": 
        folder = "mDfNQxEFSGTP5DJm"
        break;
      default:
        folder = ""
    }
    var filecontents = {
      name: name,
      type: types[type],
      _id: itemid,
      img: `icons/svg/item-bag.svg`,
      sort: 0,
      ownership: {
        default: 2,
      },
      folder: folder,
      system: system,
      effects: [
        {
          _id: effectid,
          name: name,
          transfer: true,
          flags: {
            effectmacro: {
              onCreate: {
                script: effect,
              },
              onToggle: {
                script: effect,
              },
            },
          },
          _key: "!items.effects!" + itemid + "." + effectid,
        },
      ],
      flags: {},
      _stats: {
        systemId: "shadowrun5e",
        systemVersion: "0.14.1",
        coreVersion: "11.313",
        createdTime: 1696022797597,
        modifiedTime: 1698360878446,
        lastModifiedBy: "ltL8cFp0swj2NfHd",
      },
      _key: "!items!" + itemid,
    };
    writeFile(
      JSON.stringify(filecontents, null, 4),
      "SR5-Community-Items",
      name,
    );
  }
}
