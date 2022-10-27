const express = require('express')
const router = express()

router.use("/api/users", require("./UserRoutes"))

// test route
router.get("/", (req, res) => {
    res.send("Hello world!")
})

module.exports = router