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
  
    effect.update(
      { label: "Increase Reflexes - " + hits +" hits",
        changes:
        [ { key: "system.modifiers.meat_initiative", value: hits, mode: "0"  },
          { key: "system.modifiers.meat_initiative_dice", value: Math.trunc(hits/2), mode: "0" },
          { key: "system.modifiers.astral_initiative", value: hits, mode: "0"  },
          { key: "system.modifiers.astral_initiative_dice", value: Math.trunc(hits/2), mode: "0" },
        ]
      }
    );
  
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