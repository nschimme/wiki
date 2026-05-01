const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../docs/pages');
if (!fs.existsSync(docsDir)) {
    console.log('Docs directory not found, skipping stub check.');
    process.exit(0);
}

const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
const stubs = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');

    // Ignore pages that are intentional includes
    if (content.includes('<!--@include')) {
        return;
    }

    const lines = content.split('\n');
    let inFrontmatter = false;
    let bodyLines = 0;
    let hasStubTag = content.includes('{{stub}}') ||
                     content.includes('stub: true') ||
                     /tags:[\s\S]*?-\s*Stubs/.test(content);

    lines.forEach(line => {
        if (line.trim() === '---') {
            inFrontmatter = !inFrontmatter;
            return;
        }
        if (!inFrontmatter) {
            const trimmed = line.trim();
            // Ignore headers, empty lines, and comments
            if (trimmed.length > 0 && !trimmed.startsWith('<!--') && !trimmed.startsWith('# ')) {
                bodyLines++;
            }
        }
    });

    if (bodyLines <= 3 || hasStubTag) {
        stubs.push({ file, bodyLines, hasStubTag });
    }
});

if (stubs.length > 0) {
    console.warn('\x1b[33m%s\x1b[0m', `\nFound ${stubs.length} potential stub pages:`);
    stubs.forEach(s => {
        const reason = s.hasStubTag ? 'Stub tag found' : `${s.bodyLines} lines of content`;
        console.warn(`  - ${s.file} (${reason})`);
    });
    console.warn('\x1b[33m%s\x1b[0m', 'Consider merging these pages or adding more content to improve SEO.\n');
}
