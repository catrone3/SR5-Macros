let testType = "complex";
var threshold = 0;

function getUsers() {
  var activeusers = [];
  var users = game.users;
  users.forEach((element) => {
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
  const action = game.shadowrun5e.data.actionRollData({
    skill: skill,
    attribute: pcSkill.attribute,
    modifiers: ["global", "wounds"],
    test: "SuccessTest",
    threshold: threshold,
    limit: pcLimit,
  });
  return action;
}

async function runSkillCheck(skill, actor) {
  var skillCheck = await getSkillCheck(skill, actor, threshold, testType);
  await Requestor.request({
    description: `${skillCheck.title} Skill Check`,
    buttonData: [
      {
        label: "Roll",
        command: async () => {
          return game.shadowrun5e.test.fromAction(skillCheck, actor);
        },
      },
    ],
  });
  let status = await test.execute();
  if (status) {
    ui.notifications.info("Skill Check Completed for " + actor.name);
  }
}

async function mainAsync() {
  let results = false;
  const menuResults = await warpgate.menu(
    {
      inputs: [
        {
          label: "Skill",
          type: "text",
          options: "perception",
        },
        {
          label: "Threshold",
          type: "number",
          options: "0",
        },
        {
          label: "Action Type",
          type: "Select",
          options: [
            { html: "Complex", value: "complex" },
            { html: "Simple", value: "simple" },
            { html: "Free", value: "free" },
          ],
        },
      ],
      buttons: [
        {
          label: "Submit",
          callback: (html) => {
            results = true;
          },
        },
        {
          label: "Cancel",
          callback: () => {},
        },
      ],
    },
    {
      title: "Players Skill Check",
      render: (...args) => {
        console.log(...args);
      },
      options: {
        width: "100px",
        height: "100%",
      },
    },
  );
  console.log(menuResults);
  var skill = menuResults.inputs[0];
  threshold = menuResults.inputs[1];
  testType = menuResults.inputs[2];
  if (!results) return;
  var activeusers = getUsers();
  activeusers.forEach((element) => {
    var character = game.actors.get(element.character.id);
    runSkillCheck(skill, character);
  });
}

mainAsync();
