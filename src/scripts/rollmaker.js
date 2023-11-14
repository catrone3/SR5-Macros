async function getSkillCheck(skill, actor, threshold, testType) {
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
          { name: "SR5.ModifierTypes.Global", value: pcModifiers },
          { name: "SR5.ModifierTypes.Wounds", value: pcWounds },
        ],
        value: total,
      },
      threshold: {
        base: threshold,
        label: "SR5.Threshold",
        mod: [],
        temp: 0,
        value: threshold,
      },
      limit: {
        base: 0,
        label: "SR5.Limit",
        mod: [{ name: pcLimitLabel, value: pcLimit }],
        temp: 0,
        value: pcLimit,
      },
      opposed: {},
      action: {
        attribute: pcSkill.attribute,
        skill: skill,
        spec: false,
        test: "SkillTest",
        modifiers: [],
        followed: { test: "", deckattribute: "", deckskill: "", mod: 0 },
        type: testType,
      },
      evaluated: false,
    },
    {
      actor: actor,
    },
    {
      rollMode: "publicroll",
      showDialog: true,
      showMessage: true,
    },
  );
  return successtest;
}
