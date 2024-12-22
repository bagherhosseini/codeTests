'use strict';

const axios = require('axios');
const crypto = require('crypto');

function anonymizeIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

async function getStockPrice(symbol) {
  try {
    const response = await axios.get(
      `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

module.exports = function (app) {
  const stockLikes = new Map(); // In-memory storage for likes

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const userIP = anonymizeIP(req.ip);

      // Handle single stock request
      if (typeof stock === 'string') {
        const stockData = await getStockPrice(stock);
        if (!stockData) {
          return res.json({ stockData: { error: "Invalid stock symbol" } });
        }

        let likes = stockLikes.get(stock) || new Set();
        if (like === 'true' && !likes.has(userIP)) {
          likes.add(userIP);
          stockLikes.set(stock, likes);
        }

        return res.json({
          stockData: {
            stock: stock,
            price: stockData.latestPrice,
            likes: likes.size
          }
        });
      }

      // Handle two stocks request
      if (Array.isArray(stock)) {
        const [stock1, stock2] = stock;
        const [stockData1, stockData2] = await Promise.all([
          getStockPrice(stock1),
          getStockPrice(stock2)
        ]);

        let likes1 = stockLikes.get(stock1) || new Set();
        let likes2 = stockLikes.get(stock2) || new Set();

        if (like === 'true') {
          if (!likes1.has(userIP)) {
            likes1.add(userIP);
            stockLikes.set(stock1, likes1);
          }
          if (!likes2.has(userIP)) {
            likes2.add(userIP);
            stockLikes.set(stock2, likes2);
          }
        }

        const rel_likes1 = likes1.size - likes2.size;
        const rel_likes2 = likes2.size - likes1.size;

        return res.json({
          stockData: [
            {
              stock: stock1,
              price: stockData1?.latestPrice,
              rel_likes: rel_likes1
            },
            {
              stock: stock2,
              price: stockData2?.latestPrice,
              rel_likes: rel_likes2
            }
          ]
        });
      }

      res.json({ error: "Invalid request" });
    });
};
