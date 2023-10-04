let items = game.items._source;
let item_list = [];
let item_name = "";
let id = "";
Object.entries(items).forEach(entry => {
    const [key, value] = entry;
    item_name = value.name;
    id = value._id;
    if (value.ownership.default != 2){
        console.log(item_name);
        console.log(value.ownership.default);
        if (item_list.find(e => e.name === item_name)){
            console.log('Item found, deleting dupe');
            game.items.delete(id);
        }
    }
    else {
        item_list.push({key:id, name:item_name});
    }
});
console.log(item_list);