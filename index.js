const express = require('express')
const connectMongo= require('./db')
var cors = require('cors')
const app = express();
const port = 5000



app.use(cors())
  
// 
app.use(express.json())
// availalbe routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`MagicSync listening on port http://localhost:${port}`)
}) 
connectMongo();