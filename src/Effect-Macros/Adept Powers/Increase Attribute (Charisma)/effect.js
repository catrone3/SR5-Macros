//Replace 'Charisma' with the attribute you want to increase

let item = actor.items.find((i) => i.name === "Improved Charisma");
let rating = item.system.level;
changes = [{ key: "system.attributes.charisma", value: rating, mode: 0 }];

effect.update({
  label: "Improved Charisma",
  name: "Improved Charisma",
  changes,
});

ui.notifications.info("Improved Charisma Applied");
