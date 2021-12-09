const fs = require('fs');
const path = require('path');

module.exports = class Convertor {


    /**
     * Jsem moc nemocnej nato abych to pochopil, ale tady je odkaz:
     * https://stackoverflow.com/a/32851198
     * @returns 
     */
    romanize(number) {
        const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let roman = '';
        let i;
        for (i in lookup) {
            while (number >= lookup[i]) {
                roman += i;
                number -= lookup[i];
            }
        }
        return roman;
    }

    checkEntries() {
        console.log('Checking for files...');
        const files = fs.readdirSync(path.join(__dirname, '/entry'));
        if (files.length > 0) {
            files.forEach(el => {
                let file = fs.readFileSync(path.join(__dirname, '/entry/', el), { encoding: "utf-8" });
                file = file.replace(/;/g, ' → ');
                file = file.replace(/}\n|{\n|}/g, '');
                file = file.split('\n')
                file.shift();
                file.shift();
                let copy = [];
                file.forEach(line => {
                    //console.log(line.split('.'));
                    if (line.length < 13) {
                        let temp = line.split('.');
                        let tempCheck = parseInt(temp[1], 10);
                        if (!isNaN(tempCheck)) {
                            if (tempCheck % 100 === 0) {
                                temp = [`>${romanize(temp[0])}`];
                            }
                        }
                        copy.push(temp.join('.'))
                    } else {
                        copy.push(line.replace(/./g, ''));
                    }
                });
                //file = copy.join('\n');
                const jsonFile = {};
                let currentIndex = '';
                let currentDate = '';
                copy.forEach(elem => {
                    if (elem.startsWith('>')) {
                        //console.log(elem);
                        let temp = elem.replace('>', '');
                        jsonFile[temp] = {};
                        currentIndex = temp;
                    } else if (elem.includes('.')) {
                        jsonFile[currentIndex][elem] = [];
                        currentDate = elem;
                    } else {
                        let temp = elem.split(' → ');
                        console.log(`======\n${temp.join(' ... ')}\n${currentIndex}\n${currentDate}\n======`);
                        jsonFile[currentIndex][currentDate].push({ "english": temp[0], "czech": temp[1] })
                    }
                })
                console.log(el.slice(0, el.length - 3));
                fs.writeFileSync(path.join(__dirname, '/out/', ('rewritten_' + el.slice(0, el.length - 3) + 'json')), JSON.stringify(jsonFile));
            });
            console.log('Finished, check out directory. Ending operation')
        } else {
            return console.log('No files in the entry directory. Ending operation.');
        }
    }

    /**
     * If you are reading this for fun enjoy, otherwise I am very sorry for you.
     * Basically this has been made due to a peculiar way my dear friend Ed "Liboš" Sheeran 
     * exports his vocabulary, but bcs I am very stubborn as well and dislike copy pasting stuff I don't understand
     * only to have to fix it later and spending more time on it and so on.
     * This "creature" was born. In order to make this at all digestible
     * I will try to explain parts => firstly load file from entries, then we deal with the unescaped escape characters
     * Split it by line and then we hit the first roadblock these so called notes or whatever. So basically they can either be short
     * Then we basically just treat them like normal vocab otherwise I have to join them up, since I also have to deal with vocabulary
     * vocabulary needs to be split by its entries to do that I have implemented Star Splitter™
     * We basically just signal end of each entry with star symbol, of course that is only possible because we have connected notes together.
     * Now we enter the fun part, piecing the JSON together. Now previously I had a pretty neat algorithm that was relatively efficient.
     * Sadly this one is brutally slow. Since we have to go chracter by character :). Anyhow we know that JSON will have three disctinct levels
     * The hundred, The date and then the vocab itself. So we can work off that, then there is bunch of checks for edge cases (more like each cases FML)
     * In the end we will write it into a file however for convinience it is also returned directly.
     * 
     * @param {String} filename 
     * @returns {JSON} vocabularyEntries
     */
    async parseEntries(filename) {
        return new Promise(resolve => {
            if (filename) {
                fs.readFile(path.join(__dirname, 'entry', filename), { encoding: "utf-8" }, (error, file) => {
                    if (!error) {
                        const dealWithThisMess = file.replace(/\t/g, '').replace(/\\/g, '').split('\n');
                        let joinUpTheLongAssNotes = '';
                        let longAssNoteStatus = false;
                        const oneBigOlSnake = dealWithThisMess.map(el => {
                            if (el.includes('[') && el.includes(']')) {
                                if (el.includes('→')) {
                                    return el + '★';
                                } else {
                                    return el;
                                }
                            } else if (el.includes('[')) {
                                longAssNoteStatus = true;
                                joinUpTheLongAssNotes = joinUpTheLongAssNotes + el;
                                return '';
                            } else if (longAssNoteStatus === true || el.includes('→')) {
                                if (el.includes('→')) {
                                    return el + '★';
                                } else {
                                    let copy = joinUpTheLongAssNotes + el;
                                    joinUpTheLongAssNotes = ''
                                    if (el.includes(']')) {
                                        longAssNoteStatus = false;
                                        return copy;
                                    } else if (el.includes('}') || el.includes('{')) {
                                        return el;
                                    } else {
                                        return '';
                                    }
                                }
                            } else {
                                return el.trim()
                            }
                        });
                        let rootString = oneBigOlSnake.filter(el => el !== '').join('');
                        rootString = rootString.slice(2);
                        //fs.writeFileSync(__dirname + '/out/debug_1.txt', rootString, { encoding: 'utf-8' });
                        let level = 0;
                        let finalJson = {};
                        let slice = '';
                        let identifiers = ['', ''];
                        let hundredsCounter = 1;
                        for (let i = 0; i < rootString.length; i++) {
                            let inspect = rootString.charAt(i);
                            let closingCheck;
                            if (level !== 2) {
                                closingCheck = false;
                            } else {
                                let index = i - 1;
                                while (rootString.charAt(index).trim() === '') {
                                    index--
                                }
                                if (rootString[index] === '}') {
                                    closingCheck = true;
                                } else closingCheck = false;
                            }

                            if (inspect === '}' || inspect === '{') {
                                if (level === 3 && inspect === '}') {
                                    let lines = slice.split('★')
                                    lines.forEach(elem => {
                                        let temp = elem.split('→');
                                        if (String(temp[0]).trim() !== '') finalJson[identifiers[0]][identifiers[1]][String(temp[0]).trim()] = String(temp[1]).trim();
                                    })
                                    slice = '';
                                    level -= 1;
                                } else {
                                    switch (level) {
                                        case 1:
                                            let id;
                                            if (slice.includes('§')) {
                                                let temp = slice.split('.');
                                                id = this.romanize(parseInt(temp[1].slice(0, temp[1].length - 1) / 100) * hundredsCounter);
                                                hundredsCounter++;
                                                slice = '';
                                            } else {
                                                id = 'This year\'s';
                                                i--;
                                            }
                                            finalJson[id] = {};
                                            identifiers[0] = id;
                                            break;
                                        case 2:
                                            if (closingCheck === false) {
                                                identifiers[1] = slice.trim();
                                                finalJson[identifiers[0]][identifiers[1]] = {};
                                                slice = '';
                                            }
                                            break;
                                        default:
                                            resolve({});
                                    }

                                    if (closingCheck === false) {
                                        level += 1
                                    } else level = 1;
                                }
                            } else {
                                slice += inspect;
                            }
                        }
                        //fs.writeFileSync(__dirname + '/out/debug_2.json', JSON.stringify(finalJson), { encoding: 'utf-8' });
                        fs.writeFile(path.join(__dirname, '/out', filename.slice(0, filename.length - 4) + '.json'), JSON.stringify(finalJson), 'utf-8', error => {
                            if (error) {
                                console.error(error);
                            } else {
                                console.log('Battlecruiser operational');
                            }
                        });
                        resolve(finalJson);
                    } else {
                        resolve({});
                    }
                })
            }
        })
    }

    fetchEntries(filename) {
        return new Promise(resolve => {
            if (filename) {
                fs.readFile(path.join(__dirname, 'out', filename), { encoding: "utf-8" }, (error, file) => {
                    if (!error) {
                        resolve(JSON.parse(file));
                    } else resolve({});
                })
            } else resolve({});
        });
    }

    async parseAllEntries() {
        fs.readdir(path.join(__dirname, '/entry'), (err, files) => {
            if (!err) {
                files.forEach(el => {
                    this.parseEntries(el).then(console.log('Fuyoh'))
                });
            } else console.error(err);
        });
    }

    async updateLanguages() {
        fs.readdir(path.join(__dirname, '/out'), (err, files) => {
            if (!err) {
                const languages = [];
                files.forEach(el => languages.push(el.slice(0, el.length - 5)));
                fs.writeFile(path.join(__dirname, '/details/lang.json'), JSON.stringify({ "languages": languages }), "utf-8", err => {
                    if (err) console.error(err)
                });
            } else console.error(err);
        })
    }

    /**
     * This is pretty wasteful but I can't be bothered to write it better atm
     */
    async updateBatches() {
        fs.readdir(path.join(__dirname, '/out'), (err, files) => {
            if (!err) {
                const batches = {};
                files.forEach(el => {
                    const data = fs.readFileSync(path.join(__dirname, '/out', el), { "encoding": "utf-8" });
                    batches[el.slice(0, el.length - 5)] = Object.keys(JSON.parse(data));
                });

                fs.writeFile(path.join(__dirname, '/details/batches.json'), JSON.stringify({ "batches": batches }), "utf-8", err => {
                    if (err) console.error(err)
                });
            } else console.error(err);
        })
    }
}