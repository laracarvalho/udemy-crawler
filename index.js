const pup = require('puppeteer');
const fs = require('fs');

(async () => {

    try {
        const browser = await pup.launch({ headless: true });
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0');
        await page.goto('https://www.udemy.com/courses/design/web-design/?p=3');
        const term = 'Design';
        console.log('Página carregada');

        await page.waitForSelector('.carousel--container--22Ab7');
        console.log('Seletor apareceu');
        const selector = '.course-card--main-content--3xEIw';

            const courses = await page.$$eval(selector, nodes => {
                return nodes.map(node => {
                    const name = node.querySelector('.course-card--course-title--2f7tE').innerHTML;
                    const stars = parseInt(node.querySelector('.star-rating--rating-number--3lVe8').innerHTML);
                    const producer = node.querySelector('.course-card--instructor-list--lIA4f').innerHTML;
    
                    const info = {
                        name: name,
                        stars: stars,
                        producer: producer,
                        modality_id: 1
                    }
    
                    return info;
                });
            });

        console.log(courses);

        const path = `courses-${term}.json`;

        fs.exists(path, function (exists) {
            if (!exists) {
                fs.writeFile(path, JSON.stringify(courses, null, 2), error => {
                    if (error) throw new Error('Algo deu errado');
                });
            } else {
                fs.appendFile(path, JSON.stringify(courses, null, 2), error => {
                    if (error) throw new Error('Algo deu errado');
                });
            }
          });
    
        await browser.close();
    } catch(error) {
        console.log('Meu erro:', error);
    }

})();