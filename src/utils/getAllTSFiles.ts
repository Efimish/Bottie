import { join } from 'path';
import fs from 'fs';

export default function getAllTSFiles(loc: string): string[] {
    if (!fs.lstatSync(loc).isDirectory()) return [];
    const res: string[] = [];
    fs.readdirSync(loc).forEach(el => {
        const elLoc = join(loc, el);
        if (fs.lstatSync(elLoc).isDirectory())
            res.push(...getAllTSFiles(elLoc));
        else if (elLoc.endsWith('.ts'))
            res.push(elLoc);
    })
    return res;
}