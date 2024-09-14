const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const player = req.query.player;
  console.log(player);
  const userCollection = await db.collection('player-images');
  const result = await userCollection.findOne({ PlayerName: player });
  res.status(200).json(result);
})

module.exports = router;
