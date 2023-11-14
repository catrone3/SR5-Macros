let item = actor.items.find(
  (i) => i.name === "Spellcasting Focus, Manipulation",
);
let rating = item.system.technology.rating;
changes = [];
let items = actor.items
  .filter((i) => i.type === "spell")
  .filter((i) => i.system.category === "manipulation");

items.forEach((element) => {
  element.update({ "system.action.mod": rating });
});

effect.update({
  label: "Manipulation Focus",
  name: "Manipulation Focus",
  changes,
});

ui.notifications.info("Manipulation Focus Applied");
