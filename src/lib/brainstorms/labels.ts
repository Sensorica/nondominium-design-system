// Kept apart from index.ts so a page can name a stage or a status without pulling
// every board source into its client bundle.
//
// The stages are the iterative V the Niceboard compiler draws on each board
// (its `lifecycle:` frontmatter key), in order. An unknown stage or status is
// not an error: pages show the raw word.
export const STAGES = [
  'brainstorm',
  'requirements',
  'architecture',
  'interfaces',
  'project-management',
  'implementation',
  'proofs',
  'deployments',
] as const;

export const STAGE_LABEL: Record<string, string> = {
  brainstorm: 'Brainstorm',
  requirements: 'Requirements',
  architecture: 'Architecture',
  interfaces: 'Interfaces',
  'project-management': 'Project management',
  implementation: 'Implementation',
  proofs: 'Proofs',
  deployments: 'Deployments',
};

export const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  decided: 'Decided',
  archived: 'Archived',
};

export const LANG_LABEL: Record<string, string> = {
  en: 'English',
  fr: 'Français',
};
