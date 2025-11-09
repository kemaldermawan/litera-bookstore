const express = require('express')
const app = express()
const port = 3000

app.get("/", (req, res) => {
    return res.render("index")
})

app.listen(port, () => {
    console.log(`App is running on port: `,port)
})