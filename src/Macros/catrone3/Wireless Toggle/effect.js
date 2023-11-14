/* esling-disable */
if (canvas.tokens.controlled.length == 0 && game.user.isGM) {
  ui.notifications.warn("Please select a character token.");
  return;
}
if (canvas.tokens.controlled.length == 0 && !game.user.isGM) {
  let character = game.user.character;
} else {
  let character = canvas.tokens.controlled;
}

function itemLoop(items, state) {
  items.forEach((element) => {
    if (
      element.system.hasOwnProperty("technology") &&
      element.system.technology.wireless
    ) {
      element.update({ "flags.wireless": state });
      console.log(element);
    }
  });
}

const menuResults = await warpgate.menu(
  {
    buttons: [
      {
        label: "On",
        value: true,
        callback: (html) => {
          results = true;
        },
      },
      {
        label: "Off",
        value: false,
        callback: () => {},
      },
      {
        label: "Cancel",
        callback: () => {},
      },
    ],
  },
  {
    title: "Wireless on or off?",
    render: (...args) => {
      console.log(...args);
    },
    options: {
      width: "100px",
      height: "100%",
    },
  },
);
var state = menuResults.buttons;
console.log(state);
canvas.tokens.controlled.forEach((token) => {
  let character = token.actor;
  itemLoop(character.items, state);
});
