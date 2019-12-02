const express = require('express')
const path = require('path')
const app = express()
app.use("/assets",express.static(path.join(__dirname,'assets')));
//app.use(express.static(path.join(__dirname, 'clientClearJS')));
app.use(express.static(path.join(__dirname, 'client-react/build')));
app.listen(3000, function () {
  console.log('Listening on port 3000!')
})
