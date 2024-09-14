const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const { throws } = require('assert');

const executePython = async (script, arg2, arg3) => {
  path.join(process.cwd(), 'D:\Programs\Hack-A-Sol\Hack-a-Sol\model')
  const py = spawn("python", [script, arg2, arg3]);

  const result = await new Promise((resolve, reject) => {
    let output = '';

    py.stdout.on('data', (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error(`[python] Error occurred: ${data}`);
      reject(`Error occurred in ${script}`);
    });

    py.on("exit", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Child process exited with code ${code}`);
      }
    });
  });

  return result;
}

router.post('/', async (req, res) => {
  const body = await req.body;
  try{
    const result = await executePython('D:\\Programs\\Hack-A-Sol\\Hack-a-Sol\\model\\run.py', "Eberechi Eze", "West Ham United");
    console.log(result);
    const array = result.split('\n');
    if(array.length % 7 != 0){
      console.log(array.length);
      throw new Error("array length not to size");
    }
    res.status(200).json({
      "Goals": array[0],
      "Assists": array[1],
      "TotalTackles": array[2],
      "AccuratePasses": array[3],
      "DuelsWon": array[4],
      "SofascoreRating": array[5],
    });
  }
  catch(e){
    console.log("Exception e", e);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
