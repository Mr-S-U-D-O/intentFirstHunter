const https = require('https');

https.get('https://old.reddit.com/r/johannesburg/new.json', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  console.log('old.reddit.com:', res.statusCode);
});

https.get('https://www.reddit.com/r/johannesburg/new.json', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  console.log('www.reddit.com:', res.statusCode);
});

https.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.reddit.com%2Fr%2Fjohannesburg%2Fnew.rss', (res) => {
  console.log('rss2json:', res.statusCode);
});
