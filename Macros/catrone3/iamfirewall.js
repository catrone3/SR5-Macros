let changes = [];
let actor = canvas.tokens.controlled[0].actor;
let modifiers = actor.system.wounds.value;
let skill = actor.system.skills.active.computer.value;
let limit = actor.system.matrix.data_processing.value;
let attribute = actor.system.attributes.intuition.value;
let alliance = actor.prototypeToken.disposition;
let global = actor.system.modifiers.global;
let displayPool = skill + attribute;
let displayMod = "";
if (!modifiers==0) {
    displayMod = " + Wounds " + modifiers;
}
let total = skill + attribute + modifiers+global;

function findObject(key, value, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key].startsWith(value)) {
            return true;
        }
    }
    return false;
};

function targetlist() {
    let targets = [];
    let characters = game.actors._source;
    let device = false;
    characters.forEach(element => {
        if (element.items.find(i => i.type === "device")) {
            device = true;
        }
        else{
            device = false;
        };
        if (findObject('name', "Trode", element.items) || findObject('name', 'Datajack', element.items)) {
            item = true;
        }
        else{
            item = false;
        };
        if (element.type == "character" && item && device) {
            if (element.prototypeToken.disposition == alliance && !element.system.matrix.vr){
                targets.push(element.name);
            };
        };
    });
    return targets;
}

async function mainAsync() {
    const skillTest = async function () {
        let hits = 0;
        let successtest = await new game.shadowrun5e.tests.SuccessTest(
            {
                title: "I am Firewall",
                pool: {
                    base: 0,
                    label: "SR5.DicePool",
                    mod: [
                        { name: 'SR5.SkillComputer', value: skill },
                        { name: 'SR5.AttrIntuition', value: attribute },
                        { name: 'SR5.ModifierTypes.Global', value: global },
                        { name: 'SR5.ModifierTypes.Wounds', value: modifiers }
                    ],
                    value: total
                },
                threshold: {
                    base: 0,
                    label: "SR5.Threshold",
                    mod: [],
                    temp: 0,
                    value: 0
                },
                limit: {
                    base: 0,
                    label: "SR5.Limit",
                    mod: [{ name: "SR5.MatrixAttrDataProc", value: limit }],
                    temp: 0,
                    value: limit
                },
                opposed: {},
                action: {
                    attribute: "intuition",
                    skill: "computer",
                    spec: false,
                    test: "SkillTest",
                    modifiers: [],
                    followed: { test: '', attribute: '', skill: '', mod: 0 },
                    type: "complex"
                },
                evaluated: false,
            },
            {
                actor: actor
            },
            {
                rollMode: 'publicroll',
                showDialog: true,
                showMessage: true
            }
        );
        await successtest.showDialog();
        await successtest.createRoll();
        await successtest.rolls[0].roll();
        successtest.hits.value = successtest.rolls[0].total;
        await successtest.toMessage();
        hits = successtest.hits.value;
        let targets = targetlist();
        console.log(targets);
        changes.push({ key: "system.modifiers.defense", value: hits, mode: 2 });
        for (let i = 0; i < targets.length; i++) {
            let target = game.actors.getName(targets[i]);
            let effect = target.effects.find(i => i.name === "I am Firewall");
            if (effect) {
                target.deleteEmbeddedDocuments("ActiveEffect", [effect.id]);
            }
            target.createEmbeddedDocuments(
                "ActiveEffect",
                [{
                    name: "I am Firewall",
                    changes
                }]
            );
        }
    };
    skillTest();
}

mainAsync();