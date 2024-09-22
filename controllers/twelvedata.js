const axios = require('axios')
const router = require('express').Router()
const { TWELVEDATA_API_KEY } = require('../util/config')

router.post('/', async (request, response) => {
  const { ticker, range } = request.body

  const twelvedataHeader = {
    headers: {
      'Content-Type': 'application/json'
    },
  }

  let interval, outputsize

  switch (range) {
    case '1day':
      interval = '1min'
      outputsize = 390 // Approx. 1 trading day of minute data
      break
    case '1week':
      interval = '1h'
      outputsize = 40 // 5 trading days
      break
    case '1month':
      interval = '1day'
      outputsize = 23 // Approx. 1 month of trading days
      break
    case '1year':
      interval = '1day'
      outputsize = 255; // Approx. 1 year of trading days
      break
    case 'max':
      interval = '1week'
      outputsize = 100 // Max data (check API limits)
      break
    default:
      return response.status(400).json({ error: 'Invalid range specified' })
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&apikey=${TWELVEDATA_API_KEY}&outputsize=${outputsize}`
    const data = await axios.get(url, twelvedataHeader)
    console.log('Data:', data.data)

    const chartData = data.data.values
      .map((entry) => ({
        time: entry.datetime,
        value: parseFloat(entry.close).toFixed(2),
        //volume: parseInt(entry.volume)
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time))
    
    let latest = '-', previous = '-'

    // Handle percentage change only in case interval = 1day:
    if (interval === '1day') {
      const latestEntry = data.data.values[0]
      const previousEntry = data.data.values[1]
      const latestClose = parseFloat(latestEntry.close)
      const previousClose = parseFloat(previousEntry.close)
      const percentageChange = ((latestClose - previousClose) / previousClose) * 100
      
      latest = {
        close: latestClose.toFixed(2),
        datetime: latestEntry.datetime,
      }
      previous = {
        close: previousClose.toFixed(2),
        percentageChange: percentageChange.toFixed(2) + '%',
      }
    }

    response.status(200).json({
      ticker,
      interval,
      range,
      chartData,
      latest,
      previous,
    })

  } catch (error) {
    console.error('TwelveData API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from TwelveData API' })
  }
})

module.exports = router
