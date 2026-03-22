#!/usr/bin/env node
/**
 * Checks each reveal.js slide for content overflow.
 * Usage: node scripts/check-overflow.mjs [path/to/presentation.html]
 * Default: docs/presentation.html
 */

import puppeteer from 'puppeteer';
import { resolve } from 'path';

const file = resolve(process.argv[2] || 'docs/presentation.html');
const url = `file://${file}`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 960, height: 700 });
await page.goto(url, { waitUntil: 'networkidle0' });

// Get total slide count and check each one
const results = await page.evaluate(() => {
  const deck = globalThis.Reveal;
  const totalSlides = deck.getTotalSlides();
  const issues = [];

  for (let i = 0; i < totalSlides; i++) {
    deck.slide(i);
    const currentSlide = deck.getCurrentSlide();

    // Get the slide's visible area and its content height
    const slideRect = currentSlide.getBoundingClientRect();
    const title = currentSlide.querySelector('h2')?.textContent?.trim() || `(slide ${i + 1})`;

    // Check if any child content extends beyond the slide bounds
    let maxBottom = 0;
    for (const child of currentSlide.children) {
      const r = child.getBoundingClientRect();
      if (r.height > 0) {
        maxBottom = Math.max(maxBottom, r.bottom);
      }
    }

    const overflow = maxBottom - slideRect.bottom;
    if (overflow > 20) { // 20px tolerance
      issues.push({
        slide: i + 1,
        title,
        overflowPx: Math.round(overflow),
      });
    }
  }

  return { totalSlides, issues };
});

console.log(`Checked ${results.totalSlides} slides.\n`);

if (results.issues.length === 0) {
  console.log('All slides fit within their bounds.');
} else {
  console.log(`${results.issues.length} slide(s) have overflow:\n`);
  for (const issue of results.issues) {
    console.log(`  Slide ${issue.slide}: "${issue.title}" — overflows by ~${issue.overflowPx}px`);
  }
  process.exitCode = 1;
}

await browser.close();
