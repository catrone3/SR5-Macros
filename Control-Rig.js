let player = game.actors.get(actor.system.driver);
let items = player.items._source;
let rating = 0;
for (let key=0; key<items.length; key++) {
  if (items[key].name.startsWith("Control Rig")) {
    rating = items[key].system.technology.rating;
  };
}
let logic = player.system.attributes.logic.value;
let intuition = player.system.attributes.intuition.value;
let reaction = player.system.attributes.reaction.value;
let firewall = player.system.attributes.firewall.value;
let data_processing = player.system.attributes.data_processing.value;
let init = player.system.initiative.matrix.base.value;
let gunnery = player.system.skills.active.gunnery.value + rating;
let pilot_ground = player.system.skills.active.pilot_ground_craft.value + rating;
let pilot_aero = player.system.skills.active.pilot_aerospace.value + rating;
let pilot_air = player.system.skills.active.pilot_aircraft.value + rating;
let pilot_walker = player.system.skills.active.pilot_walker.value + rating;
let pilot_water = player.system.skills.active.pilot_water_craft.value + rating;

effect.update({
  label: "Control Rig Bonus",
    changes:
    [
      {key:"system.vehicle_stats.handling.temp", value: rating, mode: 2},
      {key:"system.attributes.logic.value", value: logic, mode:5},
      {key:"system.attributes.intuition.value", value: intuition, mode:5},
      {key:"system.attributes.reaction.value", value: reaction, mode:5},
      {key:"system.attributes.firewall.value", value: firewall, mode:5},
      {key:"system.attributes.data_processing.value", value: data_processing, mode:5},
      {key:"system.initiative.matrix.base.value", value: init, mode:5},
      {key:"system.initiative.meatspace.base.value", value: init, mode:5},
      {key:"system.vehicle_stats.speed.temp", value: rating, mode: 2},
      {key:"system.skills.active.gunnery.value", value: gunnery, mode:5},
      {key:"system.skills.active.pilot_ground_craft.value", value: pilot_ground, mode:5},
      {key:"system.skills.active.pilot_aerospace.value", value: pilot_aero, mode:5},
      {key:"system.skills.active.pilot_aircraft.value", value: pilot_air, mode:5},
      {key:"system.skills.active.pilot_walker.value", value: pilot_walker, mode:5},
      {key:"system.skills.active.pilot_water_craft.value", value: pilot_water, mode:5}
    ]
});