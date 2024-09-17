import { useState, useEffect } from 'react'
import twelvedataService from '../services/twelvedata'
//import eodhdService from '../services/eodhd'
import polygonService from '../services/polygon'
import { Table } from 'react-bootstrap'

// Free plan for Twelvedata provides only US indices
const TICKERS = [
  { ticker: 'SPX', name: 'S&P 500', flag: '🇺🇸' },
  { ticker: 'NDX', name: 'Nasdaq', flag: '🇺🇸' },
  { ticker: 'DJI', name: 'Dow Jones', flag: '🇺🇸' },
  { ticker: 'RUT', name: 'Russell 2000', flag: '🇺🇸' },
]

// EODHD free tickers:
/*
const EODHD_TICKERS = [
  { ticker: 'AMZN.US', name: 'Amazon', flag: '🇺🇸' },
  { ticker: 'AAPL.US', name: 'Apple', flag: '🇺🇸' },
  { ticker: 'TSLA.US', name: 'Tesla', flag: '🇺🇸' },
  { ticker: 'BTC-USD.CC', name: 'BTC/USD', flag: '🇺🇸' },
  { ticker: 'EURUSD.FOREX', name: 'EUR/USD', flag: '🇺🇸' },
]
*/

const POLYGON_TICKERS = [
  { ticker: 'I:OMXHPI', name: 'OMX Helsinki PI', flag: '🇫🇮' },
  { ticker: 'I:OMXS30', name: 'OMX Stockholm 30', flag: '🇸🇪' },
  //{ ticker: 'I:NQJP', name: 'Nasdaq Japan Index', flag: '🇯🇵' },
]

const Markets = () => {
  const [marketData, setMarketData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const newMarketData = {}

      for (const { ticker } of TICKERS) {
        try {
          const data = await twelvedataService.getTicker(ticker)
          //console.log(`${ticker} data:`, data)
          newMarketData[ticker] = data
        } catch (error) {
          console.error(`Error fetching ${ticker} data:`, error)
          newMarketData[ticker] = {
            latest: { close: '-', datetime: '-' },
            previous: { close: '-', percentageChange: '-' },
          }
        }
      }

      for (const { ticker } of POLYGON_TICKERS) {
        try {
          const data = await polygonService.getTicker(ticker)
          //console.log(`${ticker} Polygon data:`, data)
          newMarketData[ticker] = data
        } catch (error) {
          console.error(`Error fetching ${ticker} data:`, error)
          newMarketData[ticker] = {
            latest: { close: '-', datetime: '-' },
            previous: { close: '-', percentageChange: '-' },
          }
        }
      }

      setMarketData(newMarketData)
    }

    fetchData()
  }, [])

  const getColor = (percentageChange) => {
    if (!percentageChange || percentageChange === '-') return { color: 'black' }
    if (percentageChange.startsWith('-')) {
      return { color: 'red' }
    } else {
      return { color: 'green' }
    }
  }

  return (
    <div className='content-padding'>
      <h2>Markets overview</h2>
      <Table striped bordered hover style={{ width: '80%', maxWidth: '1200px' }}>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Index</th>
            <th style={{ width: '15%' }}>Points</th>
            <th style={{ width: '15%' }}>% Change</th>
            <th style={{ width: '30%' }}>Date/Time</th>
          </tr>
        </thead>
        <tbody>
          {[...TICKERS, ...POLYGON_TICKERS].map(({ ticker, name, flag }) => (
            <tr key={ticker}>
              <td>{flag} {name}</td>
              <td>{marketData[ticker]?.latest?.close || '-'}</td>
              <td style={getColor(marketData[ticker]?.previous?.percentageChange)}>
                {marketData[ticker]?.previous?.percentageChange || '-'}
              </td>
              <td>{marketData[ticker]?.latest?.datetime || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Markets