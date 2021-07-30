const games = [];
const startingWord = 'banana';
const roundTime = 5000;
const EventEmitter = require('events');
const dictionary = require('./dictionary.js');
const numLives = 1;


class Game{
    constructor(room, users, updateTurn, endGame){
        this.wordsUsed = [startingWord];
        this.room = room;
        this.users = users //array of all user objects in the game
        for(let i = 0; i < users.length; i ++){
            this.users[i].lives = numLives;
            this.users[i].alive = true;
        }
        this.playersAlive = users.length;


        this.updateTurn = updateTurn;
        this.endGame = endGame;

        this.prevWord = startingWord; //previous word used
        this.prevUsername = "System"; //username of the person who went previously
        this.turn = 0; //whoever's turn it is (index in users[]);
        
        this.emitter = new EventEmitter();
        
        this.start();
    };

    async start(){
        while(this.playersAlive > 1){
            //console.log("round started");


            let currentUser = this.users[this.turn];
            this.turn --;
            if(this.turn < 0){
                this.turn = this.users.length - 1;
            }

            //skip dead players
            if(!currentUser.alive){
                continue;
            }

            //update the text saying whos turn it is, as well as leaderboard
            this.updateTurn({prevWord: this.prevWord, prevUsername: this.prevUsername, currentUsername: currentUser.username, users: this.users})
   
            let currentWord = await this.awaitWord(roundTime); //waits for response or for time limit
    
            if(currentWord === "timed out"){
                //timeout (lose a life)
                console.log("player timed out");
                currentUser.lives -= 1;
                if(currentUser.lives == 0){
                    currentUser.alive = false;
                    this.playersAlive -= 1;

                    
                }
            }
            else{
                //valid word submitted
                console.log(currentWord + " was submitted.");
                this.wordsUsed.push(currentWord);
                this.prevWord = currentWord;
                this.prevUsername = currentUser.username;
            }
           

            
        }
        //gameover here
        console.log("game over!");
        this.endGame(this.users.find(user => user.alive == true));
        this.emitter.removeAllListeners();
    };

    getCurrentUser(){
        return this.users[(this.turn + 1) % this.users.length];
    }

    sendWord(word){
        this.emitter.emit("word", word);
    }

    awaitWord(ms){
        return new Promise(res =>{
            setTimeout(() =>{
                res('timed out');
                //this.emitter.removeAllListeners('word');
            }, ms);
            this.emitter.on("word", (word)=>{
                //check validity of word
                if(word.charAt(0) === this.prevWord.charAt(this.prevWord.length - 1)){
                    //check if it was used before
                    if(!this.wordsUsed.includes(word)){
                        //check if it is a word
                        dictionary.isWord(word, async (b)=>{
                            if(b){
                                res(word);
                                this.emitter.removeAllListeners('word');
                            }
                        });
                    }
                    
                }
            })

        });
    }



    
}



function hasGame(room){
    if(games.find(game => game.room === room) == undefined){
        return false;
    }
    return true;
}
function getGame(room){
    return games.find(game => game.room === room);
}

function removeGame(room){
    
    let curGameIndex = games.findIndex((game) => {
        return game.room === room;
    });
    
    games.splice(curGameIndex, 1);
    
}

module.exports.Game = Game;
module.exports.games = games;
module.exports.hasGame = hasGame;
module.exports.getGame = getGame;
module.exports.removeGame = removeGame;

