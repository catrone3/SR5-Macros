let item = actor.items.find(i => i.name === "Spellcasting Focus, Health");
let rating = item.system.technology.rating;
changes = [];
let items = actor.items.filter(i => i.type === "spell").filter(i => i.system.category === "health");

items.forEach(element => {
    element.update({ "system.action.mod": rating });
});

effect.update({
    label: "Health Focus",
    name: "Health Focus",
    changes
});

ui.notifications.info("Health Focus Applied");