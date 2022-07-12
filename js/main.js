const app = document.querySelector('#app')
const leftPlace = '<div class="leftPlace"></div>'
const centrPlace = '<div class="centrPlace"></div>'
const rightPlace = '<div class="rightPlace"></div>'
app.insertAdjacentHTML('afterbegin', leftPlace + centrPlace + rightPlace);
let oneFleet = initFleet(fleet, "one")
let twoFleet = initFleet(fleet, "two")


function createInfoShip(obj) {
    return `<div id="${obj.id}" class="${obj.style}">
            <div> Name: ${obj.name} </div>
            <div> Damage: ${obj.damage} </div>
            <div class='armor'> Amor: ${obj.armor} </div>
            <div class='energy'> Energy: ${obj.energy} </div>
            </div>`
}


function generateFleetToDocument(fleet) {
    let html = ''
    for (obj of fleet) {
        html += createInfoShip(obj)
    }
    return html
}


document.querySelector('.leftPlace').innerHTML = generateFleetToDocument(oneFleet)
document.querySelector('.rightPlace').innerHTML = generateFleetToDocument(twoFleet)


const _oneFleet = document.querySelectorAll('.one').forEach(el => el.addEventListener('click', playGame))
const _twoFleet = document.querySelectorAll('.two').forEach(el => el.addEventListener('click', playGame))


document.querySelector(".centrPlace").innerHTML = "Please select ship on left panel"


let timeoutID
let objAttac
let div
let gameOver = false
let start = true
let clickOne = true

function playGame() {
    if (!gameOver) {
        if (clickOne) {
            increaseEnergy()
            clickOne = false;
        }

        const fleetArray = oneFleet.concat(twoFleet)
        let obj

        if (this.className == "one") {
            document.querySelector(".centrPlace").innerHTML = "Player  one makes step."

            removeClassAttac()

            obj = getShip(oneFleet, this.id)

            if (obj.active > 1) {
                objAttac = obj
                div = this
                div.classList.add('attac')
            }
        }

        if (this.className == "two") {
            document.querySelector(".centrPlace").innerHTML = "Player  two makes step"

            if (objAttac != null) {

                attac(objAttac, getShip(twoFleet, this.id))

                let arr = []

                setTimeout(() => {
                    document.querySelector(".centrPlace").innerHTML = "Player  one makes step."

                    arr = getShipFromAttac()

                    if (arr !== "undefined") {
                        let d = document.getElementById(arr[1].id)
                        d.classList.add('attac')
                        attac(arr[1], arr[0])
                    }
                }, 1000);
                objAttac = null
                clickOne = true
            }
        }
    }
}


function attac(attacShip, hitShip) {

    setTimeout(removeClassAttac, 1000);

    const divAttacShip = document.getElementById(attacShip.id)
    const divHitShip = document.getElementById(hitShip.id)
    attacShip.energy -= attacShip.damage
    if (attacShip.energy < attacShip.damage) {
        attacShip.active = 1
    }
    hitShip.hit -= attacShip.damage
    if (hitShip.hit <= 0) {
        hitShip.active = 0
        divHitShip.classList.add('noact')
    }
    divAttacShip.innerHTML = info(attacShip)
    divHitShip.innerHTML = info(hitShip)

    control()
}


function getShip(fleet, id) {
    for (obj of fleet) {
        if (obj.id == id) {
            return obj
        }
    }
}


function control() {
    let oneFleetEnergy = oneFleet.filter(el => el.active == 1)
    let oneFleetNoActive = oneFleet.filter(el => el.active == 0).length

    let twoFleetActive = twoFleet.filter(el => el.active == 2)
    let twoFleetNoActive = twoFleet.filter(el => el.active == 0).length

    if (oneFleet.length - oneFleetNoActive == oneFleetEnergy.length && twoFleetActive.length > 0) {

        for (let i = 0; i < oneFleetEnergy.length; i++) {
            attac(twoFleetActive[0], oneFleetEnergy[i])
        }
    }
    if (oneFleetNoActive == oneFleet.length || twoFleetNoActive == twoFleet.length) {

        if (oneFleetNoActive > twoFleetNoActive) {
            document.querySelector(".centrPlace").innerHTML = "Player  two win!!!."
        }
        if (oneFleetNoActive < twoFleetNoActive) {
            document.querySelector(".centrPlace").innerHTML = "Player  one win!!!."
        }
        gameOver = true
    }
}


function removeClassAttac() {
    const one = document.querySelectorAll('.one')

    if (one != null) {
        one.forEach(el => el.classList.remove('attac'))
    }
    const two = document.querySelectorAll('.two')
    if (two != null) {
        two.forEach(el => el.classList.remove('attac'))
    }
}


function getShipFromAttac() {
    let fleetOneTemp = oneFleet.filter(el => el.active === 2)
    let objOne
    let objTwo

    if (fleetOneTemp.length > 0) {
        let hitRandom = Math.floor(Math.random() * fleetOneTemp.length);
        objOne = fleetOneTemp[hitRandom]
    }

    let fleetTwoTemp = twoFleet.filter(el => el.active === 2)

    if (fleetTwoTemp.length > 0) {
        let twoRandom = Math.floor(Math.random() * fleetTwoTemp.length);
        objTwo = fleetTwoTemp[twoRandom]
    }

    if (objOne != null && objTwo != null) {
        return [objOne, objTwo]
    } else {
        control()
    }
}


function info(obj) {
    let stl
    let d = 100

    if (obj.armor != obj.hit) {
        d -= (obj.armor / 100 * obj.hit)
        stl = `style='width: ${obj.hit > 0 ? d : 0}%;'`
    }
    if (obj.hit <= 0) {
        stl = `style='background:red;width:100%'`
    }
    return `<div> Name: ${obj.name} </div>
                <div> Damage: ${obj.damage} </div>
                <div class='armor' ${stl}> Amor: ${obj.hit > 0 ? obj.hit : 0} </div>
                <div class='energy' style='width: ${obj.energy}%;'> Energy: ${obj.energy} 
            </div>`
}


function increaseEnergy() {

    twoFleet
        .filter(el => el.active > 0 && el.energy < 100)
        .map(el => {
            el.energy += 2
            if (el.energy >= el.damage) {
                el.active = 2
            }
        })

    twoFleet.forEach(el => {
        if (el.avtive > 0 && el.energy >= el.damage) {
            el.active = 2
        }
        document.getElementById(el.id).innerHTML = info(el)
    })

    oneFleet
        .filter(el => el.active > 0 && el.energy < 100)
        .map(el => {
            el.energy += 2
            if (el.energy >= el.damage) {
                el.active = 2
            }
        })

    oneFleet.forEach(el => {
        if (el.avtive > 0 && el.energy >= el.damage) {
            el.active = 2
        }
        document.getElementById(el.id).innerHTML = info(el)
    })
}