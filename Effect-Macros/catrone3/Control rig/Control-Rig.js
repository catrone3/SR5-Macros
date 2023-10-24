let player = game.actors.get(actor.system.driver);
let items = player.items;
let rating = 0;
//Check to see if the character has a control rig installed
items.forEach(element => {
    if (element.name.startsWith("Control Rig")) {
        rating = element.system.technology.rating;
    }
    else if (element.name.startsWith("Mind Over Machine")) {
        rating = element.system.rating;
    }
});

//values pulled from the player character
let logic = player.system.attributes.logic.value;
let intuition = player.system.attributes.intuition.value;
let reaction = player.system.attributes.reaction.value;
let firewall = player.system.attributes.firewall.value;
let data_processing = player.system.attributes.data_processing.value;
let willpower = player.system.attributes.willpower.value;

let init = player.system.initiative.matrix.base.value;
let gunnery = player.system.skills.active.gunnery.value + rating;
let pilot_ground = player.system.skills.active.pilot_ground_craft.value + rating;
let pilot_aero = player.system.skills.active.pilot_aerospace.value + rating;
let pilot_air = player.system.skills.active.pilot_aircraft.value + rating;
let pilot_walker = player.system.skills.active.pilot_walker.value + rating;
let pilot_water = player.system.skills.active.pilot_water_craft.value + rating;

let changes = [
  {key:"system.vehicle_stats.handling", value: rating, mode: 0},
  {key:"system.attributes.logic.value", value: logic, mode:5},
  {key:"system.attributes.intuition.value", value: intuition, mode:5},
  {key:"system.attributes.reaction.value", value: reaction, mode:5},
  {key:"system.attributes.firewall.value", value: firewall, mode:5},
  {key:"system.attributes.willpower.value", value: willpower, mode:5},
  {key:"system.attributes.data_processing.value", value: data_processing, mode:5},
  {key:"system.initiative.matrix.base.value", value: init, mode:5},
  {key:"system.initiative.meatspace.base.value", value: init, mode:5},
  {key:"system.vehicle_stats.speed", value: rating, mode: 0},
  {key:"system.skills.active.gunnery.value", value: gunnery, mode:5},
  {key:"system.skills.active.pilot_ground_craft.value", value: pilot_ground, mode:5},
  {key:"system.skills.active.pilot_aerospace.value", value: pilot_aero, mode:5},
  {key:"system.skills.active.pilot_aircraft.value", value: pilot_air, mode:5},
  {key:"system.skills.active.pilot_walker.value", value: pilot_walker, mode:5},
  {key:"system.skills.active.pilot_water_craft.value", value: pilot_water, mode:5},
  {key:"system.limits.sensor", value: rating, mode:0},
];

//values pulled from weapons mounted (commented until able to be done)
let items_list = actor.items;
let object = {};
let weapon_accuracy = 0;
items_list.forEach(element => {
  if (element.type == "weapon") {
    var weapon = element.name;
    weapon_accuracy = element.system.action.limit.base + rating;
    element.update({"system.action.limit.base": weapon_accuracy});
    element.update({"system.action.attribute": "logic"});
    element.update({"system.action.skill": "gunnery"});
  }
});

effect.update({
  label: "Control Rig Bonus",
  name: "Control Rig Bonus",
  changes
});