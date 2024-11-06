const fs = require('fs');
const parser = require('xml2js').parseStringPromise;

async function fetchFeed() {
    const feedData = fs.readFileSync('feed.xml', 'utf-8');
    const jsonData = await parser(feedData);

    const items = jsonData.rss.channel[0].item.map(item => ({
        title: item.title[0],
        link: item.link[0],
        description: item.description[0],
        pubDate: item.pubDate[0],
        image: item['content:encoded'] ? item['content:encoded'][0].match(/<img.*?src="(.*?)"/)[1] : ''
    }));

    fs.writeFileSync('feed.json', JSON.stringify(items, null, 2));
}

fetchFeed().catch(error => console.error(error));
