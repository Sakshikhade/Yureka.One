import fs from 'fs';
import path from 'path';

const csvPath = '/Users/anweshbiswas/Desktop/Yureka Points/Yureka_Points to Rewards - points_transfer_matrix.csv';
const outputPath = '/Users/anweshbiswas/Desktop/Yureka.Money/data/transfer-matrix.ts';

function parseCSV(content: string) {
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    const results = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Handle commas inside quotes if necessary, but for now assuming simple CSV
        const row = lines[i].split(',');
        const entry: any = {};
        headers.forEach((header, index) => {
            entry[header.trim()] = row[index]?.trim();
        });
        results.push(entry);
    }
    return results;
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const data = parseCSV(csvContent);

if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, `
export interface TransferRate {
    from: string;
    to: string;
    fromCategory: string;
    toCategory: string;
    ratio: string;
    ratioFloat: number;
    transferTime: string;
    via: string;
    notes: string;
}

export const transferMatrix: TransferRate[] = ${JSON.stringify(data.map(d => ({
    from: d['Transfer From'],
    to: d['Transfer To'],
    fromCategory: d['From Category'],
    toCategory: d['To Category'],
    ratio: d['Ratio'],
    ratioFloat: parseFloat(d['Ratio Float']) || 0,
    transferTime: d['Transfer Time'],
    via: d['Via'],
    notes: d['Notes']
})), null, 2)};
`);

console.log('Data conversion complete.');
