import type { ActiveFilters, LifecycleStage, NdoDescriptor, PropertyRegime, ResourceNature } from './types.js';

export const EMPTY_FILTERS: ActiveFilters = { stages: [], natures: [], regimes: [] };

export function hasActiveFilters(filters: ActiveFilters): boolean {
  return filters.stages.length > 0 || filters.natures.length > 0 || filters.regimes.length > 0;
}

export function applyNdoFilters(all: NdoDescriptor[], filters: ActiveFilters): NdoDescriptor[] {
  const { stages, natures, regimes } = filters;
  if (!hasActiveFilters(filters)) return all;
  return all.filter((d) => {
    const stageOk =
      stages.length === 0 ||
      (d.lifecycle_stage !== null && stages.includes(d.lifecycle_stage as LifecycleStage));
    const natureOk =
      natures.length === 0 ||
      (d.resource_nature !== null && natures.includes(d.resource_nature as ResourceNature));
    const regimeOk =
      regimes.length === 0 ||
      (d.property_regime !== null && regimes.includes(d.property_regime as PropertyRegime));
    return stageOk && natureOk && regimeOk;
  });
}
