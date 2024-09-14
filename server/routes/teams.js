const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await db.collection('player-images').find({}).toArray();
  console.log(data)
  const map = new Map;
  for(let i = 0; i < data.length; i++){
    if(map.has(data[i].Team)){
      map.get(data[i].Team).push(data[i].PlayerName);
    }else{
      map.set(data[i].Team, [data[i].PlayerName]);
    }
  }
  const result = Array.from(map, ([team, players]) => ({
    Team: team,
    PlayerName: players
    }));
  console.log(result);
  res.status(200).json(result);
})

module.exports = router;
