//modules
const path = require('path');
const express = require('express');

const app = express();

//Set static folder
//app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log('Server running on port ' + PORT));


app.get("/", (req, res)=>{
    res.send();
});

app.get("/api/getnames", (req, res)=>{
    res.json()
});

app.post("/api/submit", (req, res) =>{
    //req is the inputs
    //send back data with res
});


