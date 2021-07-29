const games = [];
const startingWord = 'banana';
const roundTime = 10000;
const EventEmitter = require('events');
const dictionary = require('./dictionary.js');

class Game{
    constructor(room, users, updateTurn){
        this.wordsUsed = [startingWord];
        this.room = room;
        this.users = users //array of all user objects in the game
        this.updateTurn = updateTurn;

        this.prevWord = startingWord; //previous word used
        this.prevUsername = "System"; //username of the person who went previously
        this.turn = 0; //whoever's turn it is (index in users[]);
        
        this.emitter = new EventEmitter();

        games.push(this);
        
        this.start();
    };

    async start(){
        while(this.users.length >= 1){
            let currentUser = this.users[this.turn];
            this.updateTurn({prevWord: this.prevWord, prevUsername: this.prevUsername, currentUsername: currentUser.username})
            //todo accept answers and move on

            let currentWord = await this.awaitWord(roundTime); //waits for response or for time limit

            if(currentWord === "timed out"){
                //timeout code
            }
            else{
                //valid word submitted
                this.wordsUsed.push(currentWord);
                this.prevWord = currentWord;
                this.prevUsername = currentUser.username;
            }
           

            this.turn --;
            if(this.turn < 0){
                this.turn = this.users.length - 1;
            }
            //break;
        }
    };

    getCurrentUser(){
        return this.users[this.turn];
    }

    sendWord(word){
        this.emitter.emit("word", word);
    }

    awaitWord(ms){
        return new Promise(res =>{
            setTimeout(() =>{
                res('timed out');
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

module.exports.Game = Game;
module.exports.games = games;
module.exports.hasGame = hasGame;
module.exports.getGame = getGame;

