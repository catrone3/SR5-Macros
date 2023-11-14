let item = actor.items.find((i) => i.name === "Spellcasting Focus, Combat");
let rating = item.system.technology.rating;
changes = [];
let items = actor.items
  .filter((i) => i.type === "spell")
  .filter((i) => i.system.category === "combat");

items.forEach((element) => {
  element.update({ "system.action.mod": rating });
});

effect.update({
  label: "Combat Focus",
  name: "Combat Focus",
  changes,
});

ui.notifications.info("Combat Focus Applied");
