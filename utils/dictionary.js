const { response } = require('express');
const https = require('https');

function isWord(str, callback){
    //filter out spaces
    str = str.trim();
    if(str.indexOf(' ') > -1){
        callback(false);
        return;
    }


    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en_US/'
    url = url + str;


    let resStr = "";
    https.get(url, (res) =>{
        res.on('data', (chunk) =>{
            resStr += chunk;
        })

        res.on('end', () =>{
            //data finished sending in resStr
            let data = JSON.parse(resStr);
            if(data.title === "No Definitions Found"){
                callback(false);
            }
            else{
                callback(true);
            }
        })
    });

    

    
}


module.exports.isWord = isWord;