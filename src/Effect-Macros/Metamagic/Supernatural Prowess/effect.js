let magic = actor.system.attributes.magic.base;
let item = actor.items.find(i => i.name === "Initiation");
let rating = item.system.rating;
let total = magic + rating;
let path = "system.attributes.";
let endPath = ".value";

let d = new Dialog({
    title: effect.name,
    content:
        `<form>
        <div class="form-group">
          <label>Attribute you wish to change?</label>
          <input name='att'</input>
        </div>
      </form>`,
    buttons: {
        one: {
            label: "OK",
            callback: html => {
                let att = html.find("[name=att]")[0].value.toLowerCase();
                let modifier = path + att + endPath;

                effect.update(
                    {
                        name: "Supernatural Prowess",
                        changes:
                            [
                                { key: modifier, value: total, mode: 5 },
                            ]
                    }
                );

            }
        },
        two: {
            label: "Cancel",
            callback: html => console.log(effect.label + ": Cancelled")
        }
    },
    close: html => console.log()
});

d.render(true);

ui.notifications.info("Supernatural Prowess Applied");