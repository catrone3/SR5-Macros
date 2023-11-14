if (canvas.tokens.controlled.length != 1) {
  ui.notifications.warn("Please select a single hacker's token.");
  return;
}
let decker = canvas.tokens.controlled[0].actor;
let deckid = decker._id;
let modifiers = decker.system.wounds.value;
let skill = decker.system.skills.active.electronic_warfare.value;
let limit = decker.system.limits.data_processing.value;
let attribute = decker.system.attributes.logic.value;
var decktoken = canvas.tokens.documentCollection.filter((element) => {
  return element.actorId === deckid;
});
let alliance = decktoken[0].disposition;
let global = decker.system.modifiers.global;
let total = skill + attribute + modifiers + global;

function findActiveCombat() {
  let characters = [];
  let source = game.combats;
  let id = "";
  source.forEach((element) => {
    let activeScene = element.scene.active;
    if (activeScene) {
      id = element._id;
      characters = element.combatants;
    }
  });
  return [characters, id];
}

function findCombatants(targets, combat) {
  let combatants = game.combats.get(combat).combatants;
  let characters = [];
  combatants.forEach((element) => {
    let id = element._id;
    if (targets.includes(element.actorId)) {
      characters.push(id);
    }
  });
  return characters;
}

function targetlist() {
  let targets = [];
  let characters = findActiveCombat()[0];
  characters.forEach((element) => {
    var token = canvas.tokens.get(element.tokenId);
    var character = game.actors.get(element.actorId);
    if (character.type != "vehicle" || character.type != "spirit") {
      if (token.document.disposition == alliance) {
        targets.push(character._id);
      }
    }
  });
  return targets;
}

async function mainAsync() {
  const skillTest = async function () {
    let hits = 0;
    let successtest = await new game.shadowrun5e.tests.SuccessTest(
      {
        title: "Calibrate",
        pool: {
          base: 0,
          label: "SR5.DicePool",
          mod: [
            { name: "SR5.SkillElectronicWarfare", value: skill },
            { name: "SR5.AttrLogic", value: attribute },
            { name: "SR5.ModifierTypes.Global", value: global },
            { name: "SR5.ModifierTypes.Wounds", value: modifiers },
          ],
          value: total,
        },
        threshold: {
          base: 0,
          label: "SR5.Threshold",
          mod: [],
          temp: 0,
          value: 0,
        },
        limit: {
          base: 0,
          label: "SR5.Limit",
          mod: [{ name: "SR5.MatrixAttrDataProc", value: limit }],
          temp: 0,
          value: limit,
        },
        opposed: {},
        action: {
          attribute: "logic",
          skill: "electronic_warfare",
          spec: false,
          test: "SkillTest",
          modifiers: [],
          followed: { test: "", attribute: "", skill: "", mod: 0 },
          type: "simple",
        },
        evaluated: false,
      },
      {
        actor: decker,
      },
      {
        rollMode: "publicroll",
        showDialog: true,
        showMessage: true,
      },
    );
    let status = await successtest.showDialog();
    if (status) {
      await successtest.createRoll();
      await successtest.rolls[0].roll();
      successtest.hits.value = successtest.rolls[0].total;
      await successtest.toMessage();
      hits = Math.floor(successtest.hits.value / 2);
      let targets = targetlist();
      let combat = findActiveCombat()[1];
      let combatants = findCombatants(targets, combat);
      for (let i = 0; i < combatants.length; i++) {
        game.combats.get(combat).adjustInitiative(combatants[i], hits);
      }
    }
  };
  skillTest();
}

mainAsync();
