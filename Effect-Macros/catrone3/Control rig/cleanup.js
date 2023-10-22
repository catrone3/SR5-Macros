let player = game.actors.get(actor.system.driver);
let items = player.items;
let rating = 0;
//Check to see if the character has a control rig installed
items.forEach(element => {
    if (element.name.startsWith("Control Rig")) {
        rating = items[key].system.technology.rating;
    }
    else if (element.name.startsWith("Mind Over Machine")) {
        rating = items[key].system.rating;
    }
});

let items_list = actor.items;
let object = {};
let weapon_changes = [];
let weapon_accuracy = 0;
items_list.forEach(element => {
    if (element.type == "weapon") {
        weapon_accuracy = element.system.action.limit.base - rating;
        element.update({ "system.action.limit.base": weapon_accuracy });
        element.update({ "system.action.attribute": "agility" });
        element.update({ "system.action.skill": "automatics" });
    }
});