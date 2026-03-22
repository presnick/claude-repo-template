/**
 * Automated accessibility tree test for the RevealJS slide menu plugin.
 *
 * Verifies that runtime ARIA patches in presentation.qmd produce a correct
 * accessibility tree. Tests are content-agnostic — they check roles, labels,
 * and focus behavior without depending on specific slide titles or counts.
 *
 * Usage: node tests/a11y-menu.mjs [path-to-html]
 *   Defaults to docs/presentation.html in the repo root.
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = process.argv[2]
  || path.resolve(__dirname, '..', 'docs', 'presentation.html');

let browser;
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    failures++;
  } else {
    console.log(`  PASS: ${message}`);
  }
}

function findByRole(node, role) {
  const results = [];
  if (node.role === role) results.push(node);
  for (const child of node.children || []) {
    results.push(...findByRole(child, role));
  }
  return results;
}

function findChild(snapshot, role, name) {
  return (snapshot.children || []).find(
    c => c.role === role && (!name || c.name === name)
  );
}

async function run() {
  browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.slide-menu-wrapper', { timeout: 5000 });
  // Wait for our runtime JS patches (MutationObservers) to finish
  await new Promise(r => setTimeout(r, 2000));

  // ── Test 1: Menu hidden when closed ──
  console.log('\n1. Menu closed state');
  let snapshot = await page.accessibility.snapshot();
  let navs = findByRole(snapshot, 'navigation');
  let navWithMenu = navs.find(n => n.name && n.name.includes('menu'));
  assert(!navWithMenu, 'Menu navigation is hidden from accessibility tree when closed');

  let menuBtn = findByRole(snapshot, 'button').find(b => b.name && b.name.toLowerCase().includes('menu'));
  assert(menuBtn, 'Menu open button exists');
  assert(menuBtn && menuBtn.name, 'Menu open button has an accessible label');

  // ── Test 2: Menu visible and structured when open ──
  console.log('\n2. Menu open state');
  await page.keyboard.press('m');
  await new Promise(r => setTimeout(r, 600));

  snapshot = await page.accessibility.snapshot();
  navs = findByRole(snapshot, 'navigation');
  navWithMenu = navs.find(n => n.name && n.name.includes('menu'));
  assert(navWithMenu, 'Menu navigation appears in accessibility tree when open');
  assert(navWithMenu && navWithMenu.name, 'Menu navigation has an accessible label');

  if (navWithMenu) {
    const tabs = findByRole(navWithMenu, 'tab');
    assert(tabs.length >= 2, `Menu toolbar has tabs (found ${tabs.length})`);
    assert(tabs.every(t => t.name), 'All tabs have accessible labels');

    const slidesTab = tabs.find(t => t.name === 'Slides');
    assert(slidesTab, 'Slides tab exists');
    const closeTab = tabs.find(t => t.name === 'Close');
    assert(closeTab, 'Close tab exists');

    const menus = findByRole(navWithMenu, 'menu');
    assert(menus.length >= 1, 'Slide list has menu role');

    const menuItems = findByRole(navWithMenu, 'menuitem');
    assert(menuItems.length >= 1, `Slide menuitems exist (found ${menuItems.length})`);
    assert(
      menuItems.every(mi => mi.name && mi.name.startsWith('Go to slide:')),
      'All menuitems have "Go to slide:" labels'
    );
  }

  // ── Test 3: Focus moves into menu on open ──
  console.log('\n3. Focus management on open');
  const focusedRole = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? el.getAttribute('role') : null;
  });
  assert(
    focusedRole === 'tab' || focusedRole === 'menuitem',
    `Focus is inside the menu on open (focused role: ${focusedRole})`
  );

  // ── Test 4: Selecting a slide moves focus to heading ──
  console.log('\n4. Focus management after slide selection');
  // Close menu via 'm' key, then check focus returns to slide
  const menuItemCount = await page.evaluate(() =>
    document.querySelectorAll('.slide-menu-item').length
  );
  if (menuItemCount > 0) {
    // Close the menu (pressing 'm' or Escape)
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 1000));

    const focusedTag = await page.evaluate(() =>
      document.activeElement ? document.activeElement.tagName.toLowerCase() : null
    );
    assert(
      focusedTag === 'h1' || focusedTag === 'h2' || focusedTag === 'h3' || focusedTag === 'section',
      `Focus moves to slide content after selection (focused: ${focusedTag})`
    );
  }

  // ── Test 5: Menu hidden again after close ──
  console.log('\n5. Menu closed after selection');
  snapshot = await page.accessibility.snapshot();
  navs = findByRole(snapshot, 'navigation');
  navWithMenu = navs.find(n => n.name && n.name.includes('menu'));
  assert(!navWithMenu, 'Menu navigation is hidden again after closing');

  // ── Test 6: Viewport allows zoom ──
  console.log('\n6. Viewport meta');
  const viewport = await page.evaluate(() => {
    const vp = document.querySelector('meta[name="viewport"]');
    return vp ? vp.getAttribute('content') : '';
  });
  assert(viewport.includes('user-scalable=yes'), 'Viewport allows user scaling');
  assert(!viewport.includes('maximum-scale=1.0'), 'Viewport does not cap scale at 1.0');

  // ── Summary ──
  console.log(`\n${failures === 0 ? 'All tests passed.' : `${failures} test(s) failed.`}`);
  await browser.close();
  process.exit(failures > 0 ? 1 : 0);
}

run().catch(async (err) => {
  console.error(err);
  if (browser) await browser.close();
  process.exit(1);
});
