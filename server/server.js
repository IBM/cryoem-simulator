const config = require('./config.js');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const path = require('path');

// - - - - - - - - - - - - - - - - - - 
const fs = require('fs')
const resultsFile = '/results.json'
// - - - - - - - - - - - - - - - - - - 


const app = express()

app.use(express.json());
app.use(cors())
app.use(compression({
  level: 6
}));



app.use(config.baseUrl, express.static(path.join(__dirname, '../client/build')));


app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
})

app.get('/annotation_data', (req,res) => {
   // const data = require(`./files/val_annotation_latest.json`)
   // const data = require(__dirname + `/files/target_Y4.json`) 
   const data = require(__dirname + config.fileName) 

   res.setHeader('Content-Type', 'application/json');
   res.send(JSON.stringify(data));
})

app.post('/results', (req,res) => {
   const body = req.body
   console.log("server", body)

   try {

      let resultsjson = fs.readFileSync(__dirname + resultsFile, "utf-8");
      let results = JSON.parse(resultsjson)
      results.push(body)
      resultsjson = JSON.stringify(results)
      fs.writeFileSync(__dirname + resultsFile, resultsjson, "utf-8")
      res.sendStatus(200)
   }
   catch(e) {
      res.sendStatus(500)
   }

})

app.get('/results', (req, res) => {
   res.sendFile(__dirname + resultsFile);
})



var server = app.listen(config.port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})