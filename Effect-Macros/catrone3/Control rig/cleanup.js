let player = game.actors.get(actor.system.driver);
let items = player.items._source;
let rating = 0;
//Check to see if the character has a control rig installed
for (let key=0; key<items.length; key++) {
  if (items[key].name.startsWith("Control Rig")) {
    rating = items[key].system.technology.rating;
  };
}

let items_list = actor.items._source;
let drone_items = actor.items;
let object = {};
let weapon_changes = [];
let weapon_accuracy = 0;
for (let key=0; key<items_list.length; key++) {
  if (items_list[key].type == "weapon") {
    var weapon = items_list[key].name;
    var gun = drone_items.getName(weapon);
    weapon_accuracy = gun.system.action.limit.value - rating;
    gun.update({"system.action.limit.value": weapon_accuracy});
    gun.update({"system.action.attribute": "agility"});
    gun.update({"system.action.skill": "automatics"});
  }
};