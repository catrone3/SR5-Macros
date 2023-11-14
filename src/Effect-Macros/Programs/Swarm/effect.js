let d = new Dialog({
  title: effect.label,
  content: `<form>
        <div class="form-group">
          <label>Drones in swarm</label>
          <input name='count'</input>
        </div>
      </form>`,
  buttons: {
    one: {
      label: "OK",
      callback: (html) => {
        let count = html.find("[name=count]")[0].value;
        let modifier = count - 1;

        effect.update({
          label: "Swarm - " + hits + "drones",
          changes: [
            { key: "system.modifiers.global", value: modifier, mode: "5" },
          ],
        });
      },
    },
    two: {
      label: "Cancel",
      callback: (html) => console.log(effect.label + ": Cancelled"),
    },
  },
  close: (html) => console.log(),
});

d.render(true);

ui.notifications.info("Swarm Applied");
