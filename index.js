const express = require('express')
const app = express()
const port = 3000

console.log()

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('Hello World!')
})

app.get('/', (req, res) => {
  res.send(process.env)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
