const fs = require('fs');
const path = require('path');

/**
 * Recursively find all Markdown files in a directory.
 */
function getMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let mdFiles = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip infra, node_modules, and included content
            if (entry.name !== '.vitepress' &&
                entry.name !== 'node_modules' &&
                entry.name !== 'public' &&
                entry.name !== 'includes') {
                mdFiles = mdFiles.concat(getMarkdownFiles(fullPath));
            }
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            mdFiles.push(fullPath);
        }
    }

    return mdFiles;
}

/**
 * Determine if a page's content qualifies as a stub.
 */
function isStub(content) {
    // Ignore pages that are intentional includes or templates
    if (content.includes('<!--@include')) {
        return false;
    }

    // Ignore home pages
    if (content.includes('layout: home')) {
        return false;
    }

    const lines = content.split('\n');
    let inFrontmatter = false;
    let bodyLines = 0;

    // Check for explicit stub tags or frontmatter
    const hasStubTag = content.includes('{{stub}}') ||
                     content.includes('stub: true') ||
                     /tags:[\s\S]*?-\s*Stubs/.test(content);

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed === '---') {
            inFrontmatter = !inFrontmatter;
            return;
        }
        if (!inFrontmatter) {
            // Ignore headers (any level), empty lines, and comments
            if (trimmed.length > 0 && !trimmed.startsWith('<!--') && !trimmed.startsWith('#')) {
                bodyLines++;
            }
        }
    });

    // Content is <= 3 lines or has a stub tag
    return bodyLines <= 3 || hasStubTag;
}

module.exports = {
    getMarkdownFiles,
    isStub
};
