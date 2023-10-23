let testType = "complex";
var threshold = 0;

function getUsers() {
    var activeusers = [];
    var users = game.users;
    users.forEach(element => {
        if (element.active && element.character != null) {
            activeusers.push(element);
        }
    });
    return activeusers;
}


async function getSkillCheck(skill, actor) {
    console.log(threshold);
    let title = skill.charAt(0).toUpperCase() + skill.slice(1) + " Skill Check";
    var pcSkill = actor.system.skills.active[skill];
    var pcAttribute = actor.system.attributes[pcSkill.attribute].value;
    var pcModifiers = actor.system.modifiers.global;
    var pcWounds = actor.system.wounds.value;
    var limit = actor.system.attributes[pcSkill.attribute].limit;
    var pcLimit = actor.system.limits[limit].value;
    var pcSkillLabel = pcSkill.label;
    var pcAttributeLabel = actor.system.attributes[pcSkill.attribute].label;
    var pcLimitLabel = actor.system.limits[limit].label;
    var total = pcSkill.value + pcAttribute + pcModifiers + pcWounds;
    let successtest = await new game.shadowrun5e.tests.SuccessTest(
        {
            title,
            pool: {
                base: 0,
                label: "SR5.DicePool",
                mod: [
                    { name: pcSkillLabel, value: pcSkill.value },
                    { name: pcAttributeLabel, value: pcAttribute },
                    { name: 'SR5.ModifierTypes.Global', value: pcModifiers },
                    { name: 'SR5.ModifierTypes.Wounds', value: pcWounds }
                ],
                value: total
            },
            threshold: {
                base: threshold,
                label: "SR5.Threshold",
                mod: [],
                temp: 0,
                value: threshold
            },
            limit: {
                base: 0,
                label: "SR5.Limit",
                mod: [{ name: pcLimitLabel, value: pcLimit }],
                temp: 0,
                value: pcLimit
            },
            opposed: {},
            action: {
                attribute: pcSkill.attribute,
                skill: skill,
                spec: false,
                test: "SkillTest",
                modifiers: [],
                followed: { test: '', deckattribute: '', deckskill: '', mod: 0 },
                type: testType
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
    return successtest;
}

async function runSkillCheck(skill, actor) {
    var skillCheck = await getSkillCheck(skill, actor);
    var status = await skillCheck.hideDialog();
    status = true
    if (status) {
        await skillCheck.createRoll();
        await skillCheck.rolls[0].roll();
        skillCheck.hits.value = skillCheck.rolls[0].total;
        await skillCheck.toMessage();
        ui.notifications.info("Skill Check Completed");
    }
}

async function mainAsync() {
    let results = false;
    const menuResults = await warpgate.menu({
        inputs: [{
            label: "Skill",
            type: "text",
            options: "perception"
        },
        {
            label: "Threshold",
            type: "number",
            options: "0"
        },
        {
            label: "Action Type",
            type: "Select",
            options: [
                {html: "Complex", value: "complex"},
                {html: "Simple", value: "simple"},
                {html: "Free", value: "free"}
            ]
        }],
        buttons: [{
            label: "Submit",
            callback: (html) => {
                results = true;
            }
        }, {
            label: "Cancel",
            callback: () => {}
        }],
    }, {
        title: "Players Skill Check",
        render: (...args) => { console.log(...args);},
        options: {
            width: '100px',
            height: '100%',
        }
    });
    console.log(menuResults);
    var skill = menuResults.inputs[0];
    threshold = menuResults.inputs[1];
    testType = menuResults.inputs[2];
    if (!results) return;
    var activeusers = getUsers();
    activeusers.forEach(element => {
        var character = game.actors.get(element.character.id);
        runSkillCheck(skill, character);
    });
}

mainAsync();