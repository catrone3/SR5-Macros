if (canvas.tokens.controlled.length != 1) {
  ui.notifications.warn("Please select a single hacker's token.");
  return;
}
let leader = canvas.tokens.controlled[0].actor;
let leaderid = leader._id;
let modifiers = leader.system.wounds.value;
let skill = leader.system.skills.active.leadership.value;
let limit = leader.system.limits.social.value;
let attribute = leader.system.attributes.charisma.value;
var decktoken = canvas.tokens.documentCollection.filter((element) => {
  return element.actorId === leaderid;
});
let alliance = decktoken[0].disposition;
let global = leader.system.modifiers.global;
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
    if (character.type == "character") {
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
        title: "Rally",
        pool: {
          base: 0,
          label: "SR5.DicePool",
          mod: [
            { name: "SR5.SkillLeadership", value: skill },
            { name: "SR5.AttrCharisma", value: attribute },
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
          mod: [{ name: "SR5.LimitSocial", value: limit }],
          temp: 0,
          value: limit,
        },
        opposed: {},
        action: {
          attribute: "charisma",
          skill: "leadership",
          spec: false,
          test: "SkillTest",
          modifiers: [],
          followed: { test: "", attribute: "", skill: "", mod: 0 },
          type: "complex",
        },
        evaluated: false,
      },
      {
        actor: leader,
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
