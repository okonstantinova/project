import { ENGINES, SAMPLE_DATA } from '../engines/engine-catalog';

let ok = 0;
for (const def of ENGINES) {
  try {
    const render = def.compile(def.defaultTemplate);
    const out = render(SAMPLE_DATA).replace(/\s+/g, ' ').trim();
    const passed = out.includes('Product Catalog') && out.includes('Laptop') && out.includes('999');
    console.log(`[${passed ? 'OK ' : 'FAIL'}] ${def.label.padEnd(12)} -> ${out.slice(0, 70)}...`);
    if (passed) ok++;
  } catch (e) {
    console.log(`[FAIL] ${def.label.padEnd(12)} -> ${(e as Error).message}`);
  }
}
console.log(`\n${ok}/${ENGINES.length} engines render the shared sample data correctly.`);
process.exit(ok === ENGINES.length ? 0 : 1);
