'use strict'

const express = require('express')
const { load } = require('cheerio')
const { get } = require('axios')
const cors = require('cors')

const PORT = process.env.PORT || 9572
const app = express()
app.use(cors())

const URL = 'https://www.worldometers.info/coronavirus/'

app.get('/', (req, res) => {
  get(URL)
    .then(response => {
      const html = response.data
      const $ = load(html)

      $('.content-inner', html).each(function () {
        let cases = $(this).find('div#maincounter-wrap:nth-of-type(4) > .maincounter-number > span').text().trim()
        let deaths = $(this).find('div#maincounter-wrap:nth-of-type(6) > .maincounter-number > span').text()
        let date = $(this).find('.content-inner > div:nth-of-type(2)').text().slice(14, -11)
        let recovered = $(this).find('div#maincounter-wrap:nth-of-type(7) > .maincounter-number > span').text()

        res.json({
          region: "Worldwide",
          last_updated: date,
          cases,
          deaths,
          recovered
        })
      })
    }).catch((err) => res.json(err.message))
})

app.get('/:country', (req, res) => {
  const country = req.params.country
  const newUrl = `${URL}country/${country}/`

  get(newUrl)
    .then(response => {
      if (response.request.res.responseUrl === "https://www.worldometers.info/404.shtml") res.json({message: "Failed to load country."})

      const html = response.data
      const $ = load(html)

      $('.content-inner', html).each(function () {
        let countryName = $(this).find('.content-inner > div:nth-of-type(3) > h1').text().trim()
        let cases = $(this).find('div#maincounter-wrap:nth-of-type(4) > .maincounter-number > span').text().trim()
        let deaths = $(this).find('div#maincounter-wrap:nth-of-type(5) > .maincounter-number > span').text()
        let date = $(this).find('.content-inner > div:nth-of-type(2)').text().slice(14, -11)
        let recovered = $(this).find('div#maincounter-wrap:nth-of-type(6) > .maincounter-number > span').text()

        res.json({
          region: countryName,
          last_updated: date,
          cases,
          deaths,
          recovered
        })
      })
    }).catch((err) => console.error(err))
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}.`))
