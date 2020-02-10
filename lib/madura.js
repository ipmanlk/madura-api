const https = require('https');
const cheerio = require('cheerio');

const search = async (word) => {
    try {
        if (!word || word.trim() == "") throw new Error("no word defined.");

        // get webpage html
        let body = await sendRequest(word);
        let $ = cheerio.load(body);

        // store meanings with their categories
        const meanings = [];

        // extract meanings and categories
        $(".tb tbody tr").each((i, el) => {
            const $2 = cheerio.load(el);
            const ty = $2(".ty").text() || "";
            const td = $2(".td").text() || "";

            // ignore if empty
            if (ty.trim() == "" || td.trim() == "") return;

            meanings.push({
                category: ty,
                meaning: td
            });
        });

        return (meanings);

    } catch (error) {
        // if request failed, throw error
        throw new Error(error);
    }
}

const sendRequest = (word) => {
    return new Promise((resolve, reject) => {
        https.get(encodeURI(`https://www.maduraonline.com/?find=${word}`), (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err.message);
        });

    });
}

module.exports = {
    search
}