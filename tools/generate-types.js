const fs = require('fs').promises;
const path = require('path');
const { compile } = require('json-schema-to-typescript');

async function main() {
  const root = process.cwd();
  const schemaDir = path.join(root, 'specs', '1-server-basic', 'schemas');
  const outDir = path.join(root, 'src', 'types');
  await fs.mkdir(outDir, { recursive: true });

  const files = await fs.readdir(schemaDir);
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(schemaDir, f);
    const schema = JSON.parse(await fs.readFile(p, 'utf8'));
    const typeName = schema.title || path.basename(f, '.json');
    const ts = await compile(schema, typeName, { bannerComment: '' });
    const outFile = path.join(outDir, path.basename(f, '.json') + '.d.ts');
    await fs.writeFile(outFile, ts, 'utf8');
    console.log('Wrote', outFile);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
