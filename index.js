const Axios = require("axios");
const XmlFlow = require('xml-flow');
const sleep = require('util').promisify(setTimeout);
var fs = require('fs')
      
const url = "https://cnpj.rocks/sitemap/sitemap.xml";
const filePath = "sitemaps/sitemap.xml";

const getData = async (url, filePath) => {
  try {
    console.log(`${url} saved to file ${filePath}`);

    const writeFile = fs.createWriteStream(filePath); // create stream

    // download url
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    // save download to file
    response.data.pipe(writeFile);
  } catch (error) {
    console.log(`${error.response.status} - ${error.response.statusText}`);
  }
};

const siteMapLines = [];
const sitemap = [];

const readSitemap = async _ => {
};
  
const readUrlset = async _ => {
    const sitemap2array = require('sitemap2array');
    const sitemaps = await sitemap2array('https://cnpj.rocks/sitemap/sitemap.xml');
    
    var logger = fs.createWriteStream('cnpj.txt', {
      flags: 'a' // 'a' means appending (old data will be preserved)
    });

    var files = sitemaps.length;
    var filesProcessed = 0;
    for (const [idx, sitemapUrl] of sitemaps.entries()) {
      const sitemapPath = sitemapUrl.replace('https://cnpj.rocks/sitemap/', 'sitemaps/');
      
      const inFile = fs.createReadStream(sitemapPath);
      const xmlStream = XmlFlow(inFile);

      console.log(`Processing ${sitemapPath}`);

      xmlStream.on('tag:loc', function(person) {
        logger.write(person["$text"].replace("https://cnpj.rocks/cnpj/", "").replace("/", ";") + "\n");
      });

      xmlStream.on('end', function(person) {
        console.log(`Processed ${filesProcessed++} / ${files} > ${sitemapPath}`);
      });
    };
}
//getData(url, filePath);
//readSitemap();
readUrlset();

// 26705640000190;supermercado-ph-ltda.html
// 26705639000166;marineusa-barbosa-weinhal-06385663809.html
// 26706121000147;urubatan-benites-da-rosa-39814424072.html
// 26705641000135;carlos-filipe-novais-santos-83931929515.html
// 26705642000180;agroflorestal-coco-verde-spe-s-a.html
// 26706123000136;lucas-sena-barboza-14909635700.html
// 26705643000124;fernando-ayres-goncalves-corte-grande-sampa-servicos-me.html
// 26706124000180;deise-santos-das-neves-04618370564.html
// 26705644000179;jose-jaco-mendes-83121188453.html