import fs from 'fs'
import path from 'path'

const docsDir = path.resolve('docs')
const pagesDir = path.resolve(docsDir, 'pages')

function getPages(dir, urlPrefix) {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md') && f !== 'tags.md')
        .map(f => {
            const fullPath = path.join(dir, f)
            const content = fs.readFileSync(fullPath, 'utf-8')
            const fm = content.match(/^---([\s\S]*?)---/)
            let title = ''
            let aliases = []
            if (fm) {
                const titleMatch = fm[1].match(/^title:\s*(.*)$/m)
                if (titleMatch) title = titleMatch[1].trim().replace(/^['"](.*)['"]$/, '$1')

                const aliasesMatch = fm[1].match(/^aliases:\s*\[(.*)\]/m)
                if (aliasesMatch) {
                    aliases = aliasesMatch[1].split(',').map(s => s.trim().replace(/^['"](.*)['"]$/, '$1'))
                }
            }
            if (!title) title = f.replace(/\.md$/, '').replace(/_/g, ' ')

            return {
                title,
                name: f.replace(/\.md$/, '').replace(/_/g, ' '),
                url: urlPrefix + f.replace(/\.md$/, ''),
                aliases
            }
        })
}

const allPages = [
    ...getPages(docsDir, '/'),
    ...getPages(pagesDir, '/pages/')
]

const termMap = {}
const paths = new Set()

for (const p of allPages) {
    paths.add(p.url)
    const titleLower = p.title.toLowerCase()
    const nameLower = p.name.toLowerCase()
    if (titleLower.length > 3) termMap[titleLower] = p.url
    if (nameLower.length > 3 && nameLower !== titleLower) termMap[nameLower] = p.url
    for (const alias of p.aliases) {
        const aliasLower = alias.toLowerCase()
        if (aliasLower.length >= 2) termMap[aliasLower] = p.url
    }
}

// Manually add index and tags
paths.add('/')
paths.add('/tags')

const output = {
    terms: termMap,
    paths: Array.from(paths)
}

fs.writeFileSync(path.resolve('docs/.vitepress/pages-meta.json'), JSON.stringify(output, null, 2))
