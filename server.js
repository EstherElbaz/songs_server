const express = require('express');

const app = express();
const port = 3001;

const fs = require('fs');
const csv = require('csv-parser');

const filePath = './songs_list.csv';


//this middleware is for solving the CORS policy block:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});

//at the 
app.get('/', (req, res) => {
  readSongsFile();
  res.send('server is runnig');
});

app.get('/getAllSongs', async (req, res) => {
  try {
    const songs = await readSongsFile();
    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });

  }
});

const readSongsFile = () => {
  return new Promise((res, rej) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res(parseCSVtoObjects(results));
      })
      .on('error',(error)=> {
        console.error(error);
        rej(error);
      });
  });

}

const parseCSVtoObjects = (data) => {

  const transformedData = data.map(item => {
    const [songName, band, year] = item['Song Name;Band;Year'].split(';');
    return {
      'songName': songName,
      'band': band,
      'year': year
    };
  });

  return transformedData;
}
