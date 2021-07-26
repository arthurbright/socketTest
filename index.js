//modules
const path = require('path');
const express = require('express');

const app = express();

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log('Server running on port ' + PORT));


app.get("/", (req, res)=>{
    res.send("hello \n bongourd");
});

app.get("/api", (req, res)=>{
    res.send("you are beautiful");
});


