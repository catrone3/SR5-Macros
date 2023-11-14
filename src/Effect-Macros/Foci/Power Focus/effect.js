let item = actor.items.find((i) => i.name === "Power Focus");
let rating = item.system.technology.rating;
changes = [{ key: "system.attributes.magic", value: rating, mode: 0 }];

effect.update({
  label: "Power Focus",
  name: "Power Focus",
  changes,
});

ui.notifications.info("Power Focus Applied");
