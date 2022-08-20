"use strict"
const readlineSync = require('readline-sync');

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Level() {
    let level = getRandom(3,6);
    createLevel();

    function createLevel() {
        switch (level) {
            case 3: console.log('Вам нужно угадать трехзначное число.'); break;
            case 4: console.log('Вам нужно угадать четырехзначное число.'); break;
            case 5: console.log('Вам нужно угадать пятизначное число.'); break;
            case 6: console.log('Вам нужно угадать шестизначное число.'); break;
        }
    }
    
    this.setLevel = function () {
        return level;
    }
}

function ComputerNum() {
    let lvl = (new Level()).setLevel();
    let number = createNunber();

    function createNunber(){
        let min = 10 ** (lvl - 1);
        let max = 10 ** lvl - 1;
        return getRandom(min, max);   
    }

    this.setComputerNumber = function () {
        return number;
    }
    this.setLevelComputerNumber = function () {
        return lvl;
    }
}

function play() {
    let computerNum = new ComputerNum();
    let CompNum = computerNum.setComputerNumber();
    let lvl = computerNum.setLevelComputerNumber();
    // console.log(CompNum);
    for(let life = 5; life > 0; life--) {
        console.log(`У вас осталось ${life} попыток`);
        console.log('Введите число');
        let MyNum = readlineSync.question('--> ');
        MyNum = MyNum.substring(0, lvl);
        console.log(`Ваше предпологаемое число - ${MyNum}`);
        if(CompNum == MyNum){
            console.log("Вы угадали!");
            break;
        }
        else {
            showResult(String(CompNum), String(MyNum), lvl);
        }
        if (life==1) console.log("Вы проиграли!");
    }
}

function showResult(num1, num2, lvl) {
    let bulls = [];
    let cows = [];

    for (let i = 0; i < lvl; i++) {
        if (num1[i] === num2[i]) {
            bulls.push(num1[i]);
        }
        else if ((num2.match(num1[i]) || []).length) {
            cows.push(num1[i]);
        }
    }

    console.log(`Cовпавших цифр не на своих местах - ${cows.length}(${cows}), цифр на своих местах - ${bulls.length}(${bulls})`);
}

play();