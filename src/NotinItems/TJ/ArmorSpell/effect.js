token.document.update({
    light: {
      alpha: "0.15",
      angle: "360",
      bright: "0",
      dim: "1",
      color: "#CC00CC",
      animation: {
        type: "torch",
        intensity: 5,
        speed: 5,
        reverse: false
      }
    }
  });
  
  let d = new Dialog({
    title: effect.label,
    content: `
      <form>
        <div class="form-group">
          <label>Spellcasting Hits</label>
          <input name='hits'</input>
        </div>
      </form>`,
    buttons: {
      one: {
        label: "OK",
        callback: html => {
  
          let hits = html.find("[name=hits]")[0].value;
          
          effect.update({
            label: "Armor - " + hits +" hits",
              changes:
              [ { key: "system.modifiers.armor", value: hits, mode: "0" } ]
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