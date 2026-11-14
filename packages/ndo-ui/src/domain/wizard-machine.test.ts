import { describe, expect, test } from 'bun:test';
import {
  createWizardModel,
  reduceWizard,
  validateWizardForSubmit,
  wizardCurrentStep
} from './wizard-machine.js';

describe('wizard-machine', () => {
  test('SELECT_ARCHETYPE resets kernel and refinement', () => {
    let m = createWizardModel('stub');
    m = reduceWizard(m, { type: 'PATCH_KERNEL', patch: { name: 'tmp' } });
    m = reduceWizard(m, { type: 'SELECT_ARCHETYPE', id: 'open_design' });
    expect(m.kernel.archetype).toBe('open_design');
    expect(m.kernel.resource_nature).toBe('Digital');
    expect(m.kernel.name).toBe('');
  });

  test('PATCH_KERNEL nature Digital clears inventoriable foreshadow', () => {
    let m = createWizardModel('active_project');
    m = reduceWizard(m, {
      type: 'PATCH_KERNEL',
      patch: { economic_mode: 'use', use_kind: 'unit', default_unit: 'each' }
    });
    m = reduceWizard(m, { type: 'PATCH_KERNEL', patch: { resource_nature: 'Digital' } });
    expect(m.kernel.economic_mode).toBeNull();
    expect(m.kernel.use_kind).toBeNull();
    expect(m.refinement.subtraction).toBeNull();
  });

  test('NEXT validates kernel before advancing', () => {
    let m = createWizardModel('active_project');
    m = reduceWizard(m, { type: 'NEXT' }); // archetype → kernel
    expect(wizardCurrentStep(m)).toBe('kernel');
    m = reduceWizard(m, { type: 'NEXT' });
    expect(m.localError).toBeTruthy();
    expect(wizardCurrentStep(m)).toBe('kernel');
    m = reduceWizard(m, {
      type: 'PATCH_KERNEL',
      patch: { name: 'Lathe', economic_mode: 'use', use_kind: 'unit' }
    });
    m = reduceWizard(m, { type: 'NEXT' });
    expect(m.localError).toBe('');
    expect(wizardCurrentStep(m)).toBe('refinement');
  });

  test('validateWizardForSubmit requires inventoriable fields when needed', () => {
    let m = createWizardModel('active_project');
    m = reduceWizard(m, { type: 'PATCH_KERNEL', patch: { name: 'Tool' } });
    expect(validateWizardForSubmit(m)).toMatch(/use \(operate\) or consume/i);
  });
});
