let player = game.actors.get(actor.system.driver);
let items = player.items._source;
let rating = 0;
for (let key=0; key<items.length; key++) {
  if (items[key].name == "Control Rig") {
    rating = items[key].system.technology.rating;
  };
}

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
      {key:"system.vehicle_stats.handling.temp", value: rating, mode: "2"},
      {key:"system.vehicle_stats.speed.temp", value: rating, mode: 2},
      {key:"system.skills.active.gunnery.value", value: rating, mode:2},
      {key:"system.skills.active.gunnery.value", value: gunnery, mode:5},
      {key:"system.skills.active.pilot_ground_craft.value", value: pilot_ground, mode:5},
      {key:"system.skills.active.pilot_aerospace.value", value: pilot_aero, mode:5},
      {key:"system.skills.active.pilot_aircraft.value", value: pilot_air, mode:5},
      {key:"system.skills.active.pilot_walker.value", value: pilot_walker, mode:5},
      {key:"system.skills.active.pilot_water_craft.value", value: pilot_water, mode:5}
    ]
});