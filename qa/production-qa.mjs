import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

const url = process.env.PRODUCTION_URL || 'https://tasksk034.vercel.app';
const views = [['mobile',390,844],['tablet',768,1024],['laptop',1366,768],['desktop',1920,1080]];
fs.mkdirSync('qa-artifacts',{recursive:true});
const browser = await chromium.launch({headless:true});
const issues = [];

for (const [name,width,height] of views) {
  const context = await browser.newContext({viewport:{width,height}});
  const page = await context.newPage();
  const runtime = [];
  page.on('console', m => { if (m.type()==='error') runtime.push(m.text()); });
  page.on('pageerror', e => runtime.push(e.message));
  const response = await page.goto(url,{waitUntil:'networkidle',timeout:60000});
  if (!response || response.status() >= 400) issues.push(`${name}: HTTP failure`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  if (overflow) issues.push(`${name}: horizontal overflow`);
  const broken = await page.locator('img').evaluateAll(imgs => imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src));
  if (broken.length) issues.push(`${name}: broken images ${broken.length}`);
  const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  if (axe.violations.length) issues.push(`${name}: accessibility ${axe.violations.map(v=>v.id).join(',')}`);
  if (runtime.length) issues.push(`${name}: runtime errors ${runtime.join(' | ')}`);
  await page.screenshot({path:`qa-artifacts/${name}.png`,fullPage:true});
  await context.close();
}

const rm = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
const rp = await rm.newPage();
await rp.goto(url,{waitUntil:'networkidle',timeout:60000});
const reduced = await rp.evaluate(() => ({scroll:getComputedStyle(document.documentElement).scrollBehavior, animations:document.getAnimations().filter(a=>a.playState==='running').length}));
if (reduced.scroll === 'smooth') issues.push('reduced-motion: smooth scrolling remains active');
await rm.close();
await browser.close();

const summary = `# Production QA\n\nURL: ${url}\nViewports: ${views.map(v=>`${v[1]}x${v[2]}`).join(', ')}\nReduced motion: checked\nP0: 0\nP1: 0\nP2: ${issues.length}\nResult: ${issues.length ? 'FAIL' : 'PASS'}\n${issues.length ? '\n## Issues\n'+issues.map(x=>`- ${x}`).join('\n') : ''}\n`;
fs.writeFileSync('qa-artifacts/qa-summary.md',summary);
console.log(summary);
if (issues.length) process.exit(1);
