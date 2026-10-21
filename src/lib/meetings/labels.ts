// Kept apart from index.ts so a page can name a meeting's kind without pulling
// every journal into its client bundle.
//
// `lab` is a meeting held at the Sensorica lab. An unknown kind is not an error:
// pages fall back to the generic "Meeting" label.
export const KIND_LABEL: Record<string, string> = {
  lab: 'Lab meeting',
  dev: 'Nondominium dev meeting',
  team: 'Team meeting',
};
