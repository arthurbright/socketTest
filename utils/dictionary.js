const { response } = require('express');
const https = require('https');
const key = '8e42cec7-65c7-405' + 'c-b6b7-999cf3dbe6df'

function isWord(str, callback){
    //filter out spaces
    str = str.trim();
    if(str.indexOf(' ') > -1){
        callback(false);
        return;
    }
    


    let url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/'
    url = url + str + '?key=' + key;


    let resStr = "";
    https.get(url, (res) =>{
        res.on('data', (chunk) =>{
            resStr += chunk;
        })

        res.on('end', () =>{
            //data finished sending in resStr
            let data = JSON.parse(resStr);
            if(data.length > 0 && typeof(data[0]) === "object"){
                callback(true);
            }
            else{
                callback(false);
            }
        })
    });

    

    
}


module.exports.isWord = isWord;