// lib/requirementsModel.ts

export type RequirementRow = {
  id: string;
  state: string;
  provider_type: string;
  scope: string;
  category: string | null;
  name: string | null;
  description: string | null;
  renewal_rule: string | null;
  due_days_before_expiry: number | null;
  is_required: boolean | null;
  sort_order: number | null;
  created_at: string | null;
};

export type RequirementItem = {
  id: string;
  category: string;
  title: string;
  description?: string;
  renewalRule?: string;
  dueDaysBeforeExpiry?: number;
  isRequired: boolean;
  sortOrder: number;
};

export function mapRequirementRow(row: RequirementRow): RequirementItem {
  return {
    id: row.id,
    category: (row.category ?? "General").toString(),
    title: (row.name ?? "Untitled requirement").toString(),
    description: row.description ?? undefined,
    renewalRule: row.renewal_rule ?? undefined,
    dueDaysBeforeExpiry:
      typeof row.due_days_before_expiry === "number"
        ? row.due_days_before_expiry
        : undefined,
    isRequired: Boolean(row.is_required),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 9999,
  };
}

export function groupByCategory(items: RequirementItem[]) {
  return items.reduce((acc: Record<string, RequirementItem[]>, item) => {
    const key = item.category || "General";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}
