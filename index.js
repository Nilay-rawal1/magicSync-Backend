const express = require('express')
const connectMongo= require('./db')

const app = express();
const port = 3000
  
//
app.use(express.json())
// availalbe routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Example  app listening on port http://localhost:${port}`)
})
connectMongo();