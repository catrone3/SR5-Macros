const fireString = 'Fire';
const waterString = 'Water';
const airString = 'Air';
const earthString = 'Earth';
const manString = 'Man';
const beastString = 'Beast';
const guardianString = 'guardian';
const guidanceString = 'Guidance';
const plantString = 'Plant';
const taskString = 'Task';

//write in here your paths for default icons
const tokenPaths = {
    [fireString]: "Content/Tokens/Monster/Fire_spirit.png",
    [waterString]: "Content/Tokens/Monster/Water_spirit.png",
    [airString]: "Content/Tokens/Monster/Air_spirit.png",
    [earthString]: "Content/Tokens/Monster/Earth_spirit.png",
    [manString]: "Content/Tokens/Monster/Man_spirit.png",
    [beastString]: "Content/Tokens/Monster/Beast_spirit.png",
    [guardianString]: "Content/Tokens/Monster/guardian_spirit.png",
    [guidanceString]: "Content/Tokens/Monster/Guidance_spirit.png",
    [plantString]: "Content/Tokens/Monster/Plant_spirit.png",
    [taskString]: "Content/Tokens/Monster/Task_spirit.png"
};

Math.clip = function (number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function getSpiritPowers(spiritType) {
    let getPowers = function (normalPowers, optionalPowers) {

        let powers = [];
        for (let normalPower of normalPowers)
            pwr = game.items.getName(normalPower)

            powers.push(pwr);

        for (let optionalPower of optionalPowers) {
            let pwr = game.items.getName(optionalPower);
            console.log(pwr.name);
            power = {
                name: pwr.name,
                type: pwr.type,
                system: pwr.system
            };
            powers.push(pwr);
        }
        return "";
    }

    switch (spiritType) {
        case fireString:
            return getPowers(
                ["Accident"],
                []);
        case airString:
            return getPowers(
                ["Accident", "Astral Form", "Concealment", "Confusion", "Engulf", "Materialization", "Movement", "Sapience", "Search"],
                ["Elemental Attack", "Energy Aura", "Fear", "Guard", "Noxious Breath", "Psychokinesis"]);
        case earthString:
            return getPowers(
                ["Astral Form", "Binding", "Guard", "Materialization", "Movement", "Sapience", "Search"],
                ["Concealment", "Confusion", "Engulf", "Elemental Attack", "Fear"]);
        case beastString:
            return getPowers(
                ["Animal Control", "Astral Form", "Enhanced Senses", "Fear", "Materialization", "Movement", "Sapience"],
                ["Concealment", "Confusion", "Guard", "Natural Weapon", "Noxious Breath", "Search", "Venom"]);
        case manString:
            return getPowers(
                ["Accident", "Astral Form", "Concealment", "Confusion", "Enhanced Sense (Low Light Vision)", "Enhanced Sense (Thermographic Vision)", "Guard", "Influence", "Materialization", "Sapience", "Search"],
                ["Fear", "Innate Spell", "Movement", "Psychokinesis"]);
        case waterString:
            return getPowers(
                ["Astral Form", "Concealment", "Confusion", "Engulf", "Materialization", "Movement", "Sapience", "Search"],
                ["Accident", "Binding", "Elemental Attack", "Energy Aura", "Guard", "Weather Control"]);
        case guardianString:
            return getPowers(
                ["Astral Form", "Fear", "Guard", "Magical Guard", "Materialization", "Movement", "Sapience"],
                ["Animal Control", "Concealment", "Elemental Attack", "Natural Weapon", "Psychokinesis", "Combat Skill"]);
        case guidanceString:
            return getPowers(
                ["Astral Form", "Confusion", "Divining", "Guard", "Magical Guard", "Materialization", "Sapience", "Search", "Shadow Cloak"],
                ["Engulf", "Enhanced Senses", "Fear", "Influence"]);
        case plantString:
            return getPowers(
                ["Astral Form", "Concealment", "Engulf", "Fear", "Guard", "Magical Guard", "Materialization", "Sapience", "Silence"],
                ["Accident", "Confusion", "Movement", "Noxious Breath", "Search"]);
        case taskString:
            return getPowers(
                ["Accident", "Astral Form", "Binding", "Materialization", "Movement", "Sapience", "Search"],
                ["Concealment", "Enhanced Senses", "Influence", "Psychokinesis", "Technical Skill"]);
    }
}


async function mainAsync() {

    const summon = async function (html) {

        let force = parseInt(html.find('[id="force"]').val());
        Math.clip(force, 1, 50);
        const spiritType = html.find('[id="spiritType"]').val();
        let powers = getSpiritPowers(spiritType);
        let spiritActor = await Actor.create({
            type: "spirit",
            name: spiritType + ' Force ' + force,
            img: tokenPaths[spiritType],
            prototypeToken: {
                texture: {
                    src: tokenPaths[spiritType]
                }
            },
            force,
            spiritType: spiritType.toLowerCase(),
            token: {
                img: tokenPaths[spiritType],
                width: 0.1 * force + 0.4,
                height: 0.1 * force + 0.4
            }
        })
        
        spiritActor.updateEmbeddedDocuments("items", powers);
        spiritActor.ownership[Gamepad.userID] = 3;

        let summoningActor;
        if (canvas.tokens.controlled.length > 0)
        {
            summoningActor = canvas.tokens.controlled[0].actor;
        }
    };

    //initial dialogue
    let d = new Dialog({
        title: "Summoning",
        content:`<form><div class="form-group"><label>Force</label><input id='force' value='1'></input></div><div class="form-group"><label>Number</label>
        <select name="spiritType" id='spiritType'>
        <option value =${waterString}>${waterString}</option>
        <option value =${earthString}>${earthString}</option>
        <option value =${airString}>${airString}</option>
        <option value =${fireString}>${fireString}</option>
        <option value =${beastString}>${beastString}</option>
        <option value =${manString}>${manString}</option>
        <option value =${guardianString}>${guardianString}</option>
        <option value =${guidanceString}>${guidanceString}</option>
        <option value =${plantString}>${plantString}</option>
        <option value =${taskString}>${taskString}</option>
        </select></div></form>`,
        buttons: {
            one: {
                label: "Ok",
                callback: html => summon(html)
            },
            two: {
                label: "Cancel",
                callback: html => console.log("SKILL-MACRO: Cancelled")
            }
        },
        close: html => console.log()
    });

    d.render(true);
}

mainAsync();