let d = new Dialog({
    title: effect.label,
    content: `
      <form>
        <div class="form-group">
          <label>Total Spells</label>
          <input name='hits'</input>
        </div>
      </form>`,
    buttons: {
      one: {
        label: "OK",
        callback: html => {
  
          let hits = html.find("[name=hits]")[0].value;
          
          effect.update({
            label: "Sustaining on Psyche - " + hits +" spells",
              changes:
              [ { key: "system.modifiers.global", value: -1 * hits, mode: "0" } ]
          });
        }
      },
      two: {
        label: "Cancel",
        callback: html => console.log(effect.label +": Cancelled")
        }
      },
      close: html => console.log()
  });
  
  d.render(true);