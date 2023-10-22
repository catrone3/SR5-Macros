let item = actor.items.find(i => i.name === "Improved Reflexes");
let rating = item.system.level;
changes = [
    {key: "system.attributes.reaction", value: rating, mode: 0},
    {key: "system.initiative.meatspace.dice", value: rating, mode: 0},
]

effect.update({
    label: "Improved Reflexes",
    name: "Improved Reflexes",
    changes
  });