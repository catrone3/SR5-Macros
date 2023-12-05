let player = game.actors.get(actor.system.driver);
let items = player.items;
let rating = 0;
const controlRig = game.i18n.localize("ITEM.nameRig");
const technoRig = game.i18n.localize("ITEM.nameTechnoRig");
const item_booster = game.i18n.localize("ITEM.nameBooster");
//Check to see if the character has a control rig installed
items.forEach((element) => {
  if (element.name == controlRig) {
    rating = element.system.technology.rating;
  } else if (element.name == technoRig) {
    rating = element.system.rating;
  }
  if (element.name == item_booster) {
    booster = true;
  }
});

let items_list = actor.items;
let object = {};
let weapon_changes = [];
let weapon_accuracy = 0;
items_list.forEach((element) => {
  if (element.type == "weapon") {
    weapon_accuracy = element.system.action.limit.base - rating;
    element.update({ "system.action.limit.base": weapon_accuracy });
    element.update({ "system.action.attribute": "agility" });
    element.update({ "system.action.skill": "automatics" });
  }
});

ui.notifications.info("Control Rig Bonus Removed");
