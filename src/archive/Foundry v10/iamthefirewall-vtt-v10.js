let changes = [];
if (canvas.tokens.controlled.length != 1) {
  ui.notifications.warn("Please select a single hacker's token.");
  return;
}
let decker = canvas.tokens.controlled[0].actor;
let deckid = decker._id;
let deckmodifiers = decker.system.wounds.value;
let deckskill = decker.system.skills.active.computer.value;
let decklimit = decker.system.matrix.data_processing.value;
let deckattribute = decker.system.attributes.intuition.value;
var decktoken = canvas.tokens.documentCollection.filter((element) => {
  return element.actorId === deckid;
});
let deckalliance = decktoken[0].disposition;
let deckglobal = decker.system.modifiers.global;
let total = deckskill + deckattribute + deckmodifiers + deckglobal;
let deckMacro = "";

function targetlist() {
  let targets = [];
  let characters = canvas.tokens.objects.children;
  let device = false;
  characters.forEach((element) => {
    if (element.actor.type == "character") {
      if (element.document.disposition == deckalliance) {
        targets.push(element.name);
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
        title: "I Am The Firewall",
        pool: {
          base: 0,
          label: "SR5.DicePool",
          mod: [
            { name: "SR5.SkillComputer", value: deckskill },
            { name: "SR5.AttrIntuition", value: deckattribute },
            { name: "SR5.ModifierTypes.Global", value: deckglobal },
            { name: "SR5.ModifierTypes.Wounds", value: deckmodifiers },
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
          mod: [{ name: "SR5.MatrixAttrDataProc", value: decklimit }],
          temp: 0,
          value: decklimit,
        },
        opposed: {},
        action: {
          attribute: "intuition",
          skill: "computer",
          spec: false,
          test: "SkillTest",
          modifiers: [],
          followed: { test: "", deckattribute: "", deckskill: "", mod: 0 },
          type: "complex",
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
      hits = successtest.hits.value;
      let targets = targetlist();
      let tokenList = canvas.tokens.documentCollection;
      let deckTargets = "";
      for (i = 0; i < targets.length; i++) {
        deckTargets = deckTargets + `"${targets[i]}"`;
        if (i < targets.length - 1) {
          deckTargets = deckTargets + ", ";
        }
      }
      changes.push({ key: "system.modifiers.defense", value: hits, mode: 0 });
      deckMacro = `let targets = [${deckTargets}];
let tokenList = canvas.tokens.documentCollection
tokenList.forEach(element => {
    if (targets.includes(element.name)) {
        warpgate.mutate(element,{embedded: {ActiveEffect: {"I Am The Firewall": warpgate.CONST.DELETE}}}, {}, {permanent: true,comparisonKeys: {ActiveEffect: 'label'}});
    }
});`;
      tokenList.forEach((element) => {
        console.log(element);
        let target = element.actor;
        let effect = target.effects.find(
          (i) => i.label === "I Am The Firewall",
        );
        if (target.name == decker.name) {
          warpgate.mutate(
            element,
            {
              embedded: {
                ActiveEffect: {
                  "I Am The Firewall": {
                    description: "I Am The Firewall",
                    icon: "assets/sr/icons/matrix/firewall.svg",
                    duration: { rounds: 1 },
                    flags: {
                      effectmacro: {
                        onTurnStart: {
                          script: deckMacro,
                        },
                      },
                    },
                    changes,
                  },
                },
              },
            },
            {},
            {
              permanent: true,
              comparisonKeys: { ActiveEffect: "label" },
              overrides: {
                alwaysAcccept: true,
                suppressToast: true,
              },
              description: "I Am The Firewall",
            },
          );
        } else if (targets.includes(element.name)) {
          console.log("adding effect to" + element.name);
          warpgate.mutate(
            element,
            {
              embedded: {
                ActiveEffect: {
                  "I Am The Firewall": {
                    description: "I Am The Firewall",
                    icon: "assets/sr/icons/matrix/firewall.svg",
                    duration: { rounds: 1 },
                    changes,
                  },
                },
              },
            },
            {},
            {
              permanent: true,
              comparisonKeys: { ActiveEffect: "label" },
              overrides: {
                alwaysAcccept: true,
                suppressToast: true,
              },
              description: "I Am The Firewall",
            },
          );
        }
      });
      console.log("all tokens edited");
    }
  };
  skillTest();
}

mainAsync();
