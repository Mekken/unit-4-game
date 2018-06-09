$(document).ready(function() {
    var playerClasses = [
        {charName: "Blade", hp: 100, atkDmg: 8, scale: 8, critChance: 5, imagePath: "./assets/images/blade.PNG"},
        {charName: "Axe", hp: 120, atkDmg: 9, scale: 5, critChance: 15, imagePath: "./assets/images/axe.PNG"},
        {charName: "Hammer", hp: 160, atkDmg: 15, scale: 1, critChance: 0, imagePath: "./assets/images/hammer.PNG"},
        {charName: "Dagger", hp: 96, atkDmg: 13, scale: 4, critChance: 50, imagePath: "./assets/images/dagger.PNG"}
    ]

    var enemyClasses = [
        {charName: "Hunter", hp: 70, atkDmg: 6, imagePath: "./assets/images/enemy-hunter.PNG"},
        {charName: "Gascoigne", hp: 98, atkDmg: 6, imagePath: "./assets/images/enemy-gascoigne.jpg"},
        {charName: "Simon", hp: 101, atkDmg: 8, imagePath: "./assets/images/enemy-simon.jpg"},
        {charName: "DarkBeast", hp: 120, atkDmg: 12, imagePath: "./assets/images/enemy-darkbeast.PNG"}
    ]

    var defeatedEnemies = [];

    //TODO: Add Selectors for each Elem in HTML
    var headerElem = $('#header');
    var titleElem = $('#title');
    
    var playerSelectorElem = $('.player-selector');
    var playerElem = $('.player');
    var enemySelectorElem = $('.opponent-selector');
    var enemyElem = $('.opponent');

    var battleAreaElem = $('.battle-area');
    var battleAreaPlayerElem = $('.playerChar');
    var attackBtnElem = $('#attackBtn');
    var battleAreaEnemyElem = $('.enemyChar');

    var attackLogElem = $('#attackLog');
    var playerLogElem = $('#playerLog');
    var enemyLogElem = $('#enemyLog');

    var replayBtnElem = $('.replayBtn');
    //-----------------------------------------
    
    game = {
        combatEnd: true,

        player: {
            charName: "",
            hp: 0,
            atkDmg: 0,
            scale: 0,
            critChance: 0,
            imagePath: "",

            initPlayer(playerObj) {
                this.charName = playerObj.charName;
                this.hp = playerObj.hp;
                this.atkDmg = playerObj.atkDmg;
                this.scale = playerObj.scale;
                this.critChance = playerObj.critChance;
                this.imagePath = playerObj.imagePath;
            },

            getPlayerName()
            {
                return this.charName;
            },

            getPlayerHP() {
                return this.hp;
            },


            isPlayerDead() {
                return (this.hp <= 0 ? true : false);
            },

            attack(target) {
                let critVal = Math.floor((Math.random() * 101) + 1);
                playerLogElem.empty()

                if(critVal <= this.critChance){
                    target.hp -= (this.atkDmg * 1.5);
                    playerLogElem.text('CRIT! '); 
                }
                else {
                    target.hp -= this.atkDmg; 
                }
                playerLogElem.append(this.charName + " attacked for " + this.atkDmg + "dmg");
                this.atkDmg += this.scale;
            }
        },

        enemy: {
            charName: "",
            hp: 0,
            atkDmg: 0,
            imagePath: "",
            
            initEnemy(enemyObj) {
                this.charName = enemyObj.charName;
                this.hp = enemyObj.hp;
                this.atkDmg = enemyObj.atkDmg;
                this.imagePath = enemyObj.imagePath;
            },

            getEnemyName() {
                return this.charName;
            },

            getEnemyHP() {
                return this.hp;
            },

            isEnemyDead() {
                return (this.hp <= 0 ? true : false);
            },
            
            attack(target) {
                target.hp -= this.atkDmg;
                enemyLogElem.text(this.charName + " attacked for " + this.atkDmg + "dmg");
            }
        },

        //Utility Functions
        //setTitle()
        setTitle(text) {
            titleElem.text(text);
        },

        clearLogs() {
            playerLogElem.empty();
            enemyLogElem.empty();
        },
        
        setupEnemyElements()
        {
            enemySelectorElem.empty();
            enemyClasses.forEach(function(elem,idx) {
                enemySelectorElem.append(`<div class='enemy-${idx+1} border opponent'></div>`);
                $(`.enemy-${idx+1}.opponent`).append("<p class='charName'></p><img class='portrait' src=''><p class='health'></p>");
            })
        },

        //displayPlayerSelector()
        displayPlayerSelector() {
            game.setTitle('Select a Player Class');
            playerSelectorElem.css('display','flex');

            playerClasses.forEach(function(elem,idx) {
                $(`.character-${idx+1} .charName`).text(elem.charName);
                $(`.character-${idx+1} .health`).text("HP: " + elem.hp);
                $(`.character-${idx+1} .portrait`).attr('src', elem.imagePath);
            })
        },

        //displayEnemySelector()
        displayEnemySelector() {
            game.setTitle('Select an Opponent');
            enemySelectorElem.css('display','flex');

            enemyClasses.forEach(function(elem,idx) {
                $(`.enemy-${idx+1} .charName`).text(elem.charName);
                $(`.enemy-${idx+1} .health`).text("HP: " + elem.hp);
                $(`.enemy-${idx+1} .portrait`).attr('src', elem.imagePath);
            })
        },

        //selectPlayer(idx)
        selectPlayerClass(idx) {
            game.player.initPlayer(playerClasses[idx]);
            
            //Remove Player Elements
            playerSelectorElem.css('display','none');
            game.displayEnemySelector();
        },
        
        //Set the Opponent Selected
        selectOpponent(idx) {
            game.enemy.initEnemy(enemyClasses[idx]);
            defeatedEnemies.push(enemyClasses.splice(idx,1)[0]);
            $('.opponent:nth-last-child(1)').remove();

            //Remove Opponent Elements
            enemySelectorElem.css('display','none');
            game.startCombat();
        },

        displayBattleDetails()
        {
            battleAreaPlayerElem.children('img').attr('src', game.player.imagePath);
            battleAreaPlayerElem.children('.charName').text(game.player.getPlayerName());
            battleAreaPlayerElem.children('.health').text("HP: " + game.player.getPlayerHP());
            
            battleAreaEnemyElem.children('img').attr('src', game.enemy.imagePath);
            battleAreaEnemyElem.children('.charName').text(game.enemy.getEnemyName());
            battleAreaEnemyElem.children('.health').text("HP: " + game.enemy.getEnemyHP());
        },

        displayResults()
        {
            battleAreaElem.css('display','none');

            if(game.player.isPlayerDead()){
                game.setTitle('GAME OVER');
                replayBtnElem.css('display','flex');
                game.clearLogs();
            }
            //If Enemy is Dead
            else if(game.enemy.isEnemyDead()){
                //if EnemyClasses is <= 0
                if(enemyClasses.length <= 0){
                    game.setTitle('YOU BEAT THEM ALL!');
                    replayBtnElem.css('display','flex');
                    game.clearLogs();
                }
                else {
                    titleElem.text('Battle Won!');
                    game.displayEnemySelector();
                }
            }  
        },

        //Initiate Combat Phase
        startCombat() {
            game.combatEnd = false;

            game.clearLogs();
            game.setTitle('Combat Begins!');
            game.displayBattleDetails();
            battleAreaElem.css('display','flex');
        },

        //Check User Input for Player and Opponent
        checkPlayerInput() {
            playerElem.off().on('click', function(){
                let charClass = $(this).children('.charName').text();
                let index = playerClasses.findIndex(function(obj) {
                    return charClass == obj.charName;
                });
                $(this).off();
                game.selectPlayerClass(index);
            });

            $('.opponent').off().on('click', function(){
                let charClass = $(this).children('.charName').text();
                let index = enemyClasses.findIndex(function(obj) {
                        return charClass == obj.charName;
                });
                game.selectOpponent(index);
            });
            
            attackBtnElem.on('click', function() {
                if(!game.combatEnd){
                    game.player.attack(game.enemy);
                    game.enemy.attack(game.player);
                    game.displayBattleDetails();

                    if(game.player.isPlayerDead() || game.enemy.isEnemyDead()) {
                        game.combatEnd = true;
                        game.displayResults();
                    }
                }
            });

            replayBtnElem.on('click', function() {
                replayBtnElem.css('display','none');

                for(let i = 0; i < defeatedEnemies.length; ++i) {
                    enemyClasses.push(defeatedEnemies[i]);
                }
                defeatedEnemies = [];
                game.initGame();
            })
        },

        initGame() {
            this.setupEnemyElements(); 
            this.displayPlayerSelector();
            this.checkPlayerInput();
        }
    }

    game.initGame();
})
