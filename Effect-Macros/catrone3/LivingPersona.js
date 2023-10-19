let player = actor;
console.log(player);

let device_rating = player.system.attributes.resonance.value;
let attack = player.system.attributes.charisma.value;
let sleaze = player.system.attributes.intuition.value;
let data_processing = player.system.attributes.logic.value;
let firewall = player.system.attributes.willpower.value;

let items_list = actor.items._source;
let actor_items = actor.items;


var device = actor_items.getName("Living Persona");
device.update({ "system.technology.rating": device_rating });
device.update({ "system.atts.att1.value": attack });
device.update({ "system.atts.att2.value": sleaze });
device.update({ "system.atts.att3.value": data_processing });
device.update({ "system.atts.att4.value": firewall });