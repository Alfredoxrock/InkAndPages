import fs from 'fs';
import path from 'path';

export function addPostIdToExport(newId: string) {
    const postIdsPath = path.resolve(process.cwd(), 'post-ids.json');
    let postIds: string[] = [];
    try {
        postIds = JSON.parse(fs.readFileSync(postIdsPath, 'utf-8'));
    } catch (err) {
        // If file doesn't exist, start with empty array
        postIds = [];
    }
    if (!postIds.includes(newId)) {
        postIds.push(newId);
        fs.writeFileSync(postIdsPath, JSON.stringify(postIds, null, 2));
        console.log(`Added post ID ${newId} to post-ids.json`);
    } else {
        console.log(`Post ID ${newId} already exists in post-ids.json`);
    }
}
