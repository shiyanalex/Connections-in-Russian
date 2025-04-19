const UsedGroups = new Set();

async function getWordGroups(useAPI) {
    if (useAPI) {
        return await getWordGroupsFromDB();
    }
    else return parseWordGroups(await getRandomGroups());
}

// Placeholder for future DB implementation
async function getWordGroupsFromDB() {
    return null;
}

async function getRandomGroups() {
    try {
        const response = await fetch('utils/Data.txt');
        if (!response.ok) throw new Error(`Read error! ${response.status}`);
        
        const data = await response.text();
        const lines = data.split('\n').map(line => line.trim()).filter(Boolean);

        const groupedByColor = { yellow: [], green: [], blue: [], purple: [] };

        for (const line of lines) {
            try {
                const wordGroup = JSON.parse(line);
                const color = wordGroup.color?.toLowerCase();
                if (groupedByColor[color]) {
                    groupedByColor[color].push(line);
                }
            } catch (e) {
                console.warn("Invalid JSON line:", line, e);
            }
        }

        const selectedGroups = {};

        for (const [color, colorLines] of Object.entries(groupedByColor)) {
            const availableLines = colorLines.filter(line => !UsedGroups.has(line));

            if (availableLines.length === 0) {
                console.warn(`All groups of ${color} color have been used!`);
                continue;
            }

            const randomLine = availableLines[Math.floor(Math.random() * availableLines.length)];
            selectedGroups[color] = randomLine;
            UsedGroups.add(randomLine);
        }

        return selectedGroups;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function parseWordGroups(selectedGroups) {
    if (!selectedGroups) return [];
    const parsedGroups = [];
    const colorOrder = ['yellow', 'green', 'blue', 'purple'];
    
    for (const color of colorOrder) {
        if (selectedGroups[color]) {
            try {
                const wordGroup = JSON.parse(selectedGroups[color]);
                parsedGroups.push({
                    pattern: wordGroup.pattern,
                    words: wordGroup.words,
                    color: wordGroup.color
                });
            } catch (e) {
                console.error(`Error parsing ${color} group:`, e);
            }
        }
    }
    return parsedGroups;
}

// (async () => {
//     console.log('--- Первый запуск ---');
//     console.log(parseWordGroups(await getRandomGroups()));
//     console.log('UsedGroups:', Array.from(UsedGroups));
// })();

// // Второй запуск через таймер, чтобы имитировать второй вызов
// setTimeout(async () => {
//     console.log('--- Второй запуск ---');
//     console.log(parseWordGroups(await getRandomGroups()));
//     console.log('UsedGroups:', Array.from(UsedGroups));
// }, 1000);