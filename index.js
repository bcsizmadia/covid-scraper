'use strict'

const express = require('express')
const { load } = require('cheerio')
const { get } = require('axios')
const cors = require('cors')

const PORT = process.env.PORT || 9572
const app = express()
app.use(cors())

const URL = 'https://www.worldometers.info/coronavirus/'

app.get('/covid', (req, res) => {
  get(URL)
    .then(response => {
      const html = response.data
      const $ = load(html)

      $('.content-inner', html).each(() => {
        this.cases = $(this).find('div#maincounter-wrap:nth-of-type(4) > .maincounter-number > span').text().trim()
        this.deaths = $(this).find('div#maincounter-wrap:nth-of-type(6) > .maincounter-number > span').text()
        this.date = $(this).find('.content-inner > div:nth-of-type(2)').text().slice(14, -11)
        this.recovered = $(this).find('div#maincounter-wrap:nth-of-type(7) > .maincounter-number > span').text()

        res.json({
          region: "Worldwide",
          last_updated: this.date,
          cases: this.cases,
          deaths: this.deaths,
          recovered: this.recovered
        })
      })
    }).catch((err) => console.error(err))
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}.`))