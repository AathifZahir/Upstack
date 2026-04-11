export const STATUS_OPTIONS = [
  'Idea',
  'Approved',
  'In Progress',
  'Done',
  // 'New',
  // 'Under Review',
  // 'Planned',
  // 'Shipped',
  // 'Declined',
] as const;

export type FeatureStatus = (typeof STATUS_OPTIONS)[number];

export const STATUS_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  'Idea': { label: '🟡 Idea', colorClass: 'text-yellow-600 dark:text-yellow-400', bgClass: 'bg-yellow-500/10' },
  'Approved': { label: '🟢 Approved', colorClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-500/10' },
  'In Progress': { label: '🔵 In Progress', colorClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-500/10' },
  'Done': { label: '✅ Done', colorClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-500/10' },
  // 'New': { label: 'New', colorClass: 'text-status-new', bgClass: 'bg-status-new/10' },
  // 'Under Review': { label: 'Under review', colorClass: 'text-status-review', bgClass: 'bg-status-review/10' },
  // 'Planned': { label: 'Planned', colorClass: 'text-status-planned', bgClass: 'bg-status-planned/10' },
  // 'Shipped': { label: 'Shipped', colorClass: 'text-status-shipped', bgClass: 'bg-status-shipped/10' },
  // 'Declined': { label: 'Declined', colorClass: 'text-status-declined', bgClass: 'bg-status-declined/10' },
};

export const CATEGORY_OPTIONS = [
  'Frontend',
  'Backend',
  'Design',
  'DevOps',
  'Mobile',
  'Analytics',
  'Integrations',
  'Other',
] as const;
