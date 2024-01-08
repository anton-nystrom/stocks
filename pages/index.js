import { useEffect, useState } from 'react';
import axios from 'axios';
import ema from '../components/ema';
import macd from '../components/macd';

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Home() {
  let candlesticks = [];
  let ema12 = [];
  let ema26 = [];
  let MACD = [];
  let signalLine = [];

  const [data, setData] = useState({
    candlesticks : [],
    ema12 : [],
    ema26 : [],
    macd : [],
    signalLine : []
  });

  const getCandlesticks = async () => {
    const url = `/api/stock`;
    await axios
      .get(url)
      .then(({ data }) => {
        let reversal = [];
        ema12 = ema(data, 12);
        ema26 = ema(data, 26);
        MACD = macd(ema12, ema26);
        signalLine = ema(MACD, 9);
        if(MACD[MACD.length - 1].y < 0 && signalLine[signalLine.length - 1].y < 0) {
          if(signalLine[signalLine.length - 1].y > MACD[MACD.length - 1].y) {
            console.log("Går ner");
          }
          else if(signalLine[signalLine.length - 1].y < MACD[MACD.length - 1].y) {
            console.log("Går upp");
            for (let i = 1; i < 15; i++) {
              if(signalLine[signalLine.length - i].y > MACD[MACD.length - i].y) {
                reversal.push({
                  trend: "Bear",
                  signal: signalLine[signalLine.length - i].y,
                  MACD: MACD[MACD.length - i].y
                });
              }
              else {
                reversal.push({
                  trend: "Bull",
                  signal: signalLine[signalLine.length - i].y,
                  MACD: MACD[MACD.length - i].y
                });
              }
            }
            console.log(reversal);
            let reverse;
            for (let i = 3; i < reversal.length; i++) {
              if(reversal[i].trend !== reversal[0].trend) {
                reverse = "Potentiellt köpläge";
              }
              else {
                reverse = "Inget potentiellt köpläge";
                break;
              }
            }
            console.log(reverse);
          }
        }
        else {
          console.log("Ej under 0");
        }
        data.forEach((key) => {
          let date = key[0];
          let prices = Object.values(key[1]).slice(0,4);
          prices = prices.map(function (price) { 
            return parseInt(price);
          });
          candlesticks.push({
            x : date,
            y : prices.slice(0,4)
          });
        })
        setData({
          candlesticks : candlesticks,
          ema12 : ema12,
          ema26 : ema26,
          macd : MACD,
          signalLine : signalLine
        });
      })
      .catch(({ err }) => {
        console.log(err);
      })
  }

  useEffect(() => {
    getCandlesticks();
  }, []);
  

  var options = {
    series: [
      {
        name: 'Kurs',
        type: 'candlestick',
        data: data.candlesticks
      },
      {
        name: 'ema(26)',
        type: 'line',
        data: data.ema26
      },
      {
        name: 'ema(12)',
        type: 'line',
        data: data.ema12
      },
      {
        name: 'MACD',
        type: 'line',
        data: data.macd
      },
      {
        name: 'Signal Line',
        type: 'line',
        data: data.signalLine
      }
    ],
    chart: {
      type: 'candlestick',
      height: 500
    },
    title: {
      text: 'Epiroc A',
      align: 'left'
    },
    xaxis: {
      type: 'datetime',
      tooltip: {
        enabled: true,
        shared: true
      }
    },
    yaxis: {
      tooltip: {
        enabled: false
      }
    }
  };

  var optionsMACD = {
    series: [
      {
        name: 'MACD',
        type: 'line',
        data: data.macd
      },
      {
        name: 'Signal Line',
        type: 'line',
        data: data.signalLine
      },
      {
        name: 'Zero',
        type: 'line',
        data: [
          {
            x : new Date().setFullYear( new Date().getFullYear() - 1 ),
            y : 0
          },
          {
            x : new Date(),
            y : 0
          }
      ]
      }
    ],
    chart: {
      type: 'line'
    },
    title: {
      text: 'Epiroc A',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <div>
      <Chart
        options={options}
        series={options.series}
        type="candlestick"
        width="1000"
      />
      <Chart
        options={optionsMACD}
        series={optionsMACD.series}
        type="line"
        height="200"
        width="1000"
      />
    </div>
  )
}
