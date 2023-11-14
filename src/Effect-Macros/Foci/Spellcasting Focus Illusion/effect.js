let item = actor.items.find((i) => i.name === "Spellcasting Focus, Illusion");
let rating = item.system.technology.rating;
changes = [];
let items = actor.items
  .filter((i) => i.type === "spell")
  .filter((i) => i.system.category === "illusion");

items.forEach((element) => {
  element.update({ "system.action.mod": rating });
});

effect.update({
  label: "Illusion Focus",
  name: "Illusion Focus",
  changes,
});

ui.notifications.info("Illusion Focus Applied");
