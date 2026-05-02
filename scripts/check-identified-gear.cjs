#!/usr/bin/env node
/**
 * Verifies that all Identified Gear tables from the original monolithic
 * Other_equipment.md have been migrated to their new home pages.
 *
 * Usage: node scripts/check-identified-gear.cjs [--verbose]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsDir = path.join(__dirname, '../docs');
const pagesDir = path.join(docsDir, 'pages');
const verbose = process.argv.includes('--verbose');

// Sections intentionally renamed or merged during migration.
// These are skipped from row-count comparison with a note.
const knownMigrations = {
  'Legend': 'Renamed to ## Terminology in Other_equipment.md',
  'Food':   'Merged into ### Consumable in Food_&_Drink.md',
};

// Parse a markdown file and return all ### sub-sections with their table row counts.
function parseSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let current = null;
  let rowCount = 0;
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (current) sections[current] = rowCount;
      current = line.replace(/^### /, '').trim();
      rowCount = 0;
    } else if (current && line.startsWith('|')) {
      const trimmed = line.trim();
      if (!trimmed.match(/^[|\s]*[-:]+[|\s]*$/)) rowCount++;
    }
  }
  if (current) sections[current] = rowCount;
  return sections;
}

// Get main's Other_equipment.md via git
let mainContent;
try {
  mainContent = execSync('git show main:docs/pages/Other_equipment.md', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf-8',
  });
} catch (e) {
  console.error('Could not read main:docs/pages/Other_equipment.md — is main branch available?');
  process.exit(1);
}

const mainSections = parseSections(mainContent);

// Scan all current pages for ### sections and their locations
const allCurrentSections = {};
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'));
for (const file of files) {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
  const sections = parseSections(content);
  for (const [name, count] of Object.entries(sections)) {
    if (!allCurrentSections[name]) allCurrentSections[name] = [];
    allCurrentSections[name].push({ file, count });
  }
}

console.log('\n=== Identified Gear Migration Audit ===\n');
console.log(`Main's Other_equipment.md had ${Object.keys(mainSections).length} sections.\n`);

let passed = 0;
let warnings = 0;
let missing = 0;

for (const [section, mainCount] of Object.entries(mainSections)) {
  if (knownMigrations[section]) {
    if (verbose) {
      console.log(`\x1b[36m[RENAMED]\x1b[0m   ### ${section}: ${knownMigrations[section]}`);
    }
    passed++;
    continue;
  }

  const found = allCurrentSections[section];
  if (!found) {
    console.error(`\x1b[31m[MISSING]\x1b[0m  ### ${section} (${mainCount} rows on main) — not found in any current page`);
    missing++;
  } else {
    const totalRows = found.reduce((s, f) => s + f.count, 0);
    const fileList = found.map(f => f.file).join(', ');
    if (totalRows < mainCount) {
      console.warn(`\x1b[33m[FEWER ROWS]\x1b[0m ### ${section}: main had ${mainCount} rows, now ${totalRows} rows in ${fileList}`);
      warnings++;
    } else {
      if (verbose) {
        const delta = totalRows > mainCount ? ` (+${totalRows - mainCount} new)` : '';
        console.log(`\x1b[32m[OK]\x1b[0m        ### ${section}: ${mainCount} → ${totalRows} rows in ${fileList}${delta}`);
      }
      passed++;
    }
  }
}

console.log(`\nResult: ${passed} OK, ${warnings} fewer-rows warnings, ${missing} missing`);
if (missing > 0 || warnings > 0) process.exit(1);
