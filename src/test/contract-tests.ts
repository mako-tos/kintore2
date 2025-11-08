/* eslint @typescript-eslint/no-explicit-any: off */
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import assert from 'assert';

const root = process.cwd();
const schemaDir = path.join(root, 'specs', '1-server-basic', 'schemas');

function loadSchema(name: string) {
  const p = path.join(schemaDir, name);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function run() {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  // Load schemas
  const serviceStatusSchema = loadSchema('service-status.json');
  const trainingMenuSchema = loadSchema('training-menu.json');
  const trainingRecordSchema = loadSchema('training-record.json');

  const validateService = ajv.compile(serviceStatusSchema);
  const validateMenu = ajv.compile(trainingMenuSchema);
  const validateRecord = ajv.compile(trainingRecordSchema);

  // Positive examples
  const goodService = { status: 'ok', uptime: 123, version: '1.0.0' };
  const goodMenu = { id: '550e8400-e29b-41d4-a716-446655440000', name: 'スクワット', status: 0, createdAt: '2025-11-02T12:34:56Z' };
  const goodRecord = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    trainingMenuId: '550e8400-e29b-41d4-a716-446655440000',
    trainingAt: '2025-11-02T10:00:00Z',
    count: 12,
    createdAt: '2025-11-02T12:34:56Z'
  };

  assert.strictEqual(validateService(goodService), true, JSON.stringify(validateService.errors));
  assert.strictEqual(validateMenu(goodMenu), true, JSON.stringify(validateMenu.errors));
  assert.strictEqual(validateRecord(goodRecord), true, JSON.stringify(validateRecord.errors));

  // Negative example: missing required field
  const badRecord = { ...goodRecord };
  delete (badRecord as any).trainingAt;
  const valid = validateRecord(badRecord);
  assert.strictEqual(valid, false, 'badRecord should be invalid');

  console.log('Contract tests passed');
}

run();
