
const https = require('https');
const fs = require('fs');

const apiKey = 'AIzaSyDdSV6B4_-V5v4SIoxmpIJgRY1W2jEqm1g';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('models-response.json', data);
    console.log('Saved response to models-response.json');
  });
}).on('error', (err) => {
  console.error('Error: ' + err.message);
});
