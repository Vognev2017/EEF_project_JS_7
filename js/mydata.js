const ship = {
    name: "ship",
    damage: 35,
    energy: 100,
    armor: 50
};
const corvette = {
    name: "corvette",
    damage: 15,
    energy: 100,
    armor: 25
};
const frigate = {
    name: "frigate",
    damage: 25,
    energy: 100,
    armor: 15
};
const boat = {
    name: "boat",
    damage: 10,
    energy: 100,
    armor: 5
};

const fleet = [ship, corvette, frigate, boat]
let index = 1


function initFleet(fleet, style) {
    let fleetInit = []

    for (let i = 0; i < fleet.length; i++, index++) {

        let obj = fleet[i]
        let ship = {
            id: index,
            name: obj.name,
            damage: obj.damage,
            energy: obj.energy,
            armor: obj.armor,
            hit: obj.armor,
            active: 2,
            style: style
        }
        fleetInit.push(ship)
    }
    return fleetInit
}