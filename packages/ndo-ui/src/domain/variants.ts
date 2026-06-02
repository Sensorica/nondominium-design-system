import type { LifecycleStage, PropertyRegime, ResourceNature } from './types.js';

/** Filter chip + identity panel lifecycle colors (with border). */
export const STAGE_FILTER_COLORS: Record<LifecycleStage, string> = {
  Ideation: 'bg-gray-100 text-gray-600 border-gray-300',
  Specification: 'bg-blue-50 text-blue-600 border-blue-300',
  Development: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  Prototype: 'bg-amber-100 text-amber-700 border-amber-300',
  Stable: 'bg-green-100 text-green-700 border-green-300',
  Distributed: 'bg-teal-100 text-teal-700 border-teal-300',
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  Hibernating: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  Deprecated: 'bg-orange-100 text-orange-700 border-orange-300',
  EndOfLife: 'bg-red-100 text-red-700 border-red-300'
};

/** Identity panel lifecycle badges (no border). */
export const STAGE_IDENTITY_COLORS: Record<LifecycleStage, string> = {
  Ideation: 'bg-gray-100 text-gray-600',
  Specification: 'bg-blue-50 text-blue-600',
  Development: 'bg-indigo-100 text-indigo-700',
  Prototype: 'bg-amber-100 text-amber-700',
  Stable: 'bg-green-100 text-green-700',
  Distributed: 'bg-teal-100 text-teal-700',
  Active: 'bg-emerald-100 text-emerald-700',
  Hibernating: 'bg-yellow-100 text-yellow-700',
  Deprecated: 'bg-orange-100 text-orange-700',
  EndOfLife: 'bg-red-100 text-red-700'
};

export const NATURE_COLORS: Record<ResourceNature, string> = {
  Physical: 'bg-blue-100 text-blue-700 border-blue-300',
  Digital: 'bg-purple-100 text-purple-700 border-purple-300',
  Service: 'bg-orange-100 text-orange-700 border-orange-300',
  Hybrid: 'bg-teal-100 text-teal-700 border-teal-300',
  Information: 'bg-indigo-100 text-indigo-700 border-indigo-300'
};

export const NATURE_IDENTITY_COLORS: Record<ResourceNature, string> = {
  Physical: 'bg-blue-100 text-blue-700',
  Digital: 'bg-purple-100 text-purple-700',
  Service: 'bg-orange-100 text-orange-700',
  Hybrid: 'bg-teal-100 text-teal-700',
  Information: 'bg-indigo-100 text-indigo-700'
};

/** Regime filter chip colors (filled, dashed border). */
export const REGIME_FILTER_COLORS: Record<PropertyRegime, string> = {
  Private: 'bg-gray-100 text-gray-600 border-gray-300',
  Commons: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  Nondominium: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  CommonPool: 'bg-rose-100 text-rose-700 border-rose-300'
};

export const REGIME_IDENTITY_COLORS: Record<PropertyRegime, string> = {
  Private: 'bg-gray-100 text-gray-600',
  Commons: 'bg-cyan-100 text-cyan-700',
  Nondominium: 'bg-emerald-100 text-emerald-700',
  CommonPool: 'bg-rose-100 text-rose-700'
};

export const CARD_LIFECYCLE_ACTIVE = 'bg-green-100 text-green-700';
export const CARD_LIFECYCLE_INACTIVE = 'bg-gray-100 text-gray-600';
export const CARD_REGIME_CLASS = 'rounded border border-dashed border-gray-400 px-2 py-0.5 text-xs text-gray-700';
