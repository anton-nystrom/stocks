// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"
export default async (req, res) => {
  const key = process.env.ALPHA_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&outputsize=full&apikey=${key}`;
  await axios
    .get(url)
    .then(({ data }) => {
      data = data["Time Series (Daily)"];
      data = Object.entries(data).slice(0,250).reverse();
      res.status(200).json(data)
    })
    .catch(({ err }) => {
      res.status(400).json({ err })
    })
}
