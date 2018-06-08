$(document).ready(function() {
    var playerClasses = [
        {charName: "Blade", hp: 100, atkDmg: 15, scale: 20, critChance: 5, imagePath: "./assets/images/blade.PNG"},
        {charName: "Axe", hp: 120, atkDmg: 30, scale: 5, critChance: 15, imagePath: "./assets/images/axe.PNG"},
        {charName: "Hammer", hp: 160, atkDmg: 50, scale: 2, critChance: 0, imagePath: "./assets/images/hammer.PNG"},
        {charName: "Dagger", hp: 90, atkDmg: 80, scale: 3, critChance: 30, imagePath: "./assets/images/dagger.PNG"}
    ]
    var enemyClasses = [
        {charName: "Hunter", hp: 70, atkDmg: 6, imagePath: "./assets/images/enemy-hunter.PNG"},
        {charName: "Gascoigne", hp: 98, atkDmg: 8, imagePath: "./assets/images/enemy-gascoigne.jpg"},
        {charName: "Simon", hp: 101, atkDmg: 12, imagePath: "./assets/images/enemy-simon.jpg"},
        {charName: "DarkBeast", hp: 120, atkDmg: 15, imagePath: "./assets/images/enemy-darkbeast.PNG"}
    ]

    game = {
        playerWon: false,

        player: {
            charName: "",
            hp: 0,
            atkDmg: 0,
            scale: 0,
            critChance: 0,
            imagePath: "",

            initPlayer(charName, hp,atkDmg,scale,critChance,imagePath) {
                this.charName = charName;
                this.hp = hp;
                this.atkDmg = atkDmg;
                this.scale = scale;
                this.critChance = critChance;
                this.imagePath = imagePath;
            },

            isPlayerDead() {
                return (this.hp <= 0 ? true : false);
            },

            attack(target) {
                let critVal = Math.floor((Math.random() * 101) + 1);
                
                if(critVal <= this.critChance){
                    target.hp -= (this.atkDmg * 1.5); 
                }
                else {
                    target.hp -= this.atkDmg; 
                }
                this.atkDmg += this.scale;
                $('#playerAttack').text(this.charName + " attacked for " + this.atkDmg + "dmg");
            }
        },

        enemy: {
            charName: "",
            hp: 0,
            atkDmg: 0,
            imagePath: "",
            
            initOpponent(charName, hp, atkDmg, imagePath) {
                this.charName = charName;
                this.hp = hp;
                this.atkDmg = atkDmg;
                this.imagePath = imagePath;
            },

            isOpponentDead() {
                return (this.hp <= 0 ? true : false);
            },
            
            attack(target) {
                target.hp -= this.atkDmg;
                $('#enemyAttack').text(this.charName + " attacked for " + this.atkDmg + "dmg");
            }
        },

        //Set the Title Text
        setTitle(text) {
            $('#title').text(text);
        },

        showElement(selector){
            $(selector).css('display','flex');
        },

        hideElement(selector){
            $(selector).css('display','none');
        },

        //Set the Player Selected
        selectPlayerClass(playerClass) {
            this.player.initPlayer(playerClass.charName, playerClass.hp, playerClass.atkDmg, playerClass.scale, playerClass.critChance, playerClass.imagePath);
            
            //Remove Player Elements
            this.hideElement('.player-selector');
            this.setTitle('Select an Opponent');
            this.showElement('.opponent-selector');
        },

        //Set the Opponent Selected
        selectOpponent(opponentClass) {
            this.enemy.initOpponent(opponentClass.charName, opponentClass.hp, opponentClass.atkDmg, opponentClass.imagePath);
            
            //Remove Opponent Elements
            this.hideElement('.opponent-selector');
            this.startCombat();
        },

        //Initiate Combat Phase
        startCombat() {
            this.setTitle('Combat Begins!');
            this.showElement('.battle-area');
            $('#playerChar img').attr('src', this.player.imagePath);
            $('#enemyChar img').attr('src', this.enemy.imagePath);
        },

        //Check User Input for Player and Opponent
        checkPlayerInput() {
            $('.player').on('click', function(){
                let charClass = $(this).children('.charName').text();
                let charObj = playerClasses.find(function(obj) {
                    if(obj.charName == charClass)
                        return obj;
                });
                game.selectPlayerClass(charObj);
            });

            $('.opponent').on('click', function(){
                let charClass = $(this).children('.charName').text();
                let charObj = enemyClasses.find(function(obj) {
                    if(obj.charName == charClass)
                        return obj;
                });
                game.selectOpponent(charObj);
            });
            
            $('.attackBtn').on('click', function() {
                //TODO: Fix Logic for when CPU dies, allow user to select a new enemy
                if(!game.player.isPlayerDead()) {
                    game.player.attack(game.enemy);
                    game.enemy.attack(game.player);
                }
            });
        },

        initGame() {
            this.setTitle('Select a Class');
            this.showElement('.player-selector');
            for(let i = 1; i <= playerClasses.length; ++i){
                $(`.character-${i} .charName`).text(playerClasses[i-1].charName);
                $(`.character-${i} .health`).text("HP: " + playerClasses[i-1].hp);
                $(`.character-${i} .portrait`).attr('src', playerClasses[i-1].imagePath);
            }
            for(let i = 1; i <= enemyClasses.length; ++i){
                $(`.enemy-${i} .charName`).text(enemyClasses[i-1].charName);
                $(`.enemy-${i} .health`).text("HP: " + enemyClasses[i-1].hp);
                $(`.enemy-${i} .portrait`).attr('src', enemyClasses[i-1].imagePath);
            }
            this.checkPlayerInput();
        }
    }

    game.initGame();
})