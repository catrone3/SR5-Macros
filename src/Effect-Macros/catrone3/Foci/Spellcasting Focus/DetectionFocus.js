let item = actor.items.find(i => i.name === "Spellcasting Focus, Detection");
let rating = item.system.technology.rating;
changes = [];
let items = actor.items.filter(i => i.type === "spell").filter(i => i.system.category === "detection");

items.forEach(element => {
    element.update({ "system.action.mod": rating });
});

effect.update({
    label: "Detection Focus",
    name: "Detection Focus",
    changes
});

ui.notifications.info("Detection Focus Applied");