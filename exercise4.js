"use strict"
const readlineSync = require('readline-sync');

const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
};

const player = {
    maxHealth: 10,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
};

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createDifficulty() {
    let num;
    do {
        console.log('\nНачальное здоровье равно 10. Хотите изменить?\n1. Да\n2. Нет');
        num = readlineSync.question('--> ');

        if (num === "1") {
            console.log('\n\nВведите начальное здоровье Евстафия');
            let health = readlineSync.question('--> ');
            player.maxHealth = health;
        }
    } while(num != "2" && num != "1")
}

function getStepMonster(cooldown) {
    let step;
    do {
        step = getRandom(0, cooldown.length);     
    } while (cooldown[step] != 0);
    console.log('\n\nДействие Лютого: ' + monster.moves[step].name);
    return step;
}

function getStepPlayer(cooldown) {
    let step;
    console.log('\nВыберите действие:');
    for (let i in player.moves) {
        let n = "";
        if(cooldown[i] != 0) n = ` (До возабновления ${player.moves[i].cooldown-cooldown[i] + 1} действия)`;
        console.log(`${(parseInt(i) + 1)}.${player.moves[i].name}${n};`);
    }
    do {
        step = parseInt(readlineSync.question('--> '))-1;
        if(cooldown[step] != 0) console.log("\nВы не можете выбрать это действие.");
    } while (cooldown[step] != 0)
    return step;
}

function play() {

    createDifficulty();
    // Фиксация заморозки
    let CDMonster = Array(monster.moves.length).fill(0);
    let CDPlayer = Array(player.moves.length).fill(0);

    do {
        let stepMonster = getStepMonster(CDMonster);
        let stepPlayer = getStepPlayer(CDPlayer);
        CDMonster[stepMonster]++;
        CDPlayer[stepPlayer]++;

        player.maxHealth = player.maxHealth - (monster.moves[stepMonster].physicalDmg - (player.moves[stepPlayer].physicArmorPercents / 100 * monster.moves[stepMonster].physicalDmg )) - (monster.moves[stepMonster].magicDmg - (player.moves[stepPlayer].magicArmorPercents / 100 * monster.moves[stepMonster].magicDmg));
        monster.maxHealth = monster.maxHealth - (player.moves[stepPlayer].physicalDmg - (monster.moves[stepMonster].physicArmorPercents / 100 * player.moves[stepPlayer].physicalDmg)) - (player.moves[stepPlayer].magicDmg - (monster.moves[stepMonster].magicArmorPercents / 100 * player.moves[stepPlayer].magicDmg));
        console.log('\nВаше здоровье: ' + player.maxHealth.toFixed(1));
        console.log('Здоровье Лютого: ' + monster.maxHealth.toFixed(1));

        //Подсчет холода монстра
        for (let i in CDMonster) {
            if(CDMonster[i] >= monster.moves[i].cooldown) {
                CDMonster[i] = 0;
            } else if(CDMonster[i] > 0 && i != stepMonster) CDMonster[i]++;
        }
        //Подсчет холода героя
        for (let i in CDPlayer) {
            if(CDPlayer[i] >= player.moves[i].cooldown) {
                CDPlayer[i] = 0;
            } else if(CDPlayer[i] > 0 && i != stepPlayer) CDPlayer[i]++;
        }
    } while (monster.maxHealth > 0 && player.maxHealth>0)

    if (monster.maxHealth < player.maxHealth) {
        console.log('\n\nВы выиграли!');
    } else {
        console.log('\n\nВы проиграли.');
    }
}

play();