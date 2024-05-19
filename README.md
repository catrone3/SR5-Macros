# foundryvtt-shadowrunmacros

Macros I have made or found for use in FoundryVTT. Any found macros will have references in the README if I can find the source of it again.

### Installing

copy the following link and enter it into the Manifest URL in the module install window

`https://github.com/catrone3/SR5-Macros/releases/latest/download/module.json`

### Contributing and new Macros

If you wish to contribute yourself to this repo, please follow the file structure that is used as listed below before making a PR with the changes

- Effect Macro
  {item type}/{item name}/effect.js
- Macros
  {Contributor name}/{macroname}.js

If you have ideas for macros that are missing that you would like to see, create an issue for it and go into detail about what you want the macro to do.

### Contributors

Discord names are used, github accounts are linked where known

#### [catrone3](https://github.com/catrone3)

- Control-Rig
- Swarm
- Living Persona
- I Am The Firewall
- Rally
- Calibration
- Player Skill Check
  - guesses at the limit used

#### T.J.

- [Armor Spell](src/NotinItems/TJ/ArmorSpell) (Effect Macro)
- [Increase Refleces](src/NotinItems/TJ/IncreaseReflexes/) (Effect Macro)
- [pysche](src/NotinItems/TJ/psyche/) (Effect Macro)
- [Sustained Spells](src/NotinItems/TJ/SustainedSpells/) (Effect Macro)

#### [Poetics](https://github.com/ThePoetics)

- [Contacts creator](src/Macros/PoeticsonDiscord/Contacts/contacts.js)

#### Contributing

### Debugging

#### Character sheet does not open
If you have a character sheet that does not open from a player editing effects or you making your own outside of this, it is likely that the ```Add``` Change Mode is being used in at least one effect. To fix this you will need to export the character sheet and check for this in the json file you get. 

To do this, open the file in any simple text editor, notepad works just fine for this. Do a find and replace and search for ```"mode": 2```, this should turn up at least one line that matches. If this does not find any matches, you may need to try other numbers 1-5 ```Note: There are some instances from macros in this repo that use "mode": 5 instead of "mode": 0```. Find any that match and change them to ```"mode": 0```. Once this is done, do an import of the file on the character (This is done via right click just like the export, this is not the same import method used for importing chummer sheets). You should now be able to open the character sheet and adjust the effects as needed.

#### Licenses

Icons provided by

- The Noun Project https://thenounproject.com/legal/ under Creative Common Attribution License (CC BY 3.0)
