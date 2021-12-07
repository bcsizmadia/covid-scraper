'use strict'

const express = require('express')

const PORT = process.env.PORT || 9572
const app = express()

app.listen(PORT, () => console.log(`Server is running on ${PORT}.`))