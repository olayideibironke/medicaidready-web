"use client";

import { useEffect, useMemo, useState } from "react";
import { groupByCategory, type RequirementItem } from "@/lib/requirementsModel";

function pill(label: string) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #e9e9e9",
        background: "#fff",
        fontSize: 13,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function safeParseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
    return [];
  } catch {
    return [];
  }
}

export default function ChecklistClient(props: {
  items: RequirementItem[];
  storageKey: string;
}) {
  const { items, storageKey } = props;

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    const ids = safeParseIds(localStorage.getItem(storageKey));
    setCheckedIds(new Set(ids));
  }, [storageKey]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(checkedIds)));
  }, [checkedIds, storageKey]);

  const groups = useMemo(() => groupByCategory(items), [items]);

  const totalCount = items.length;

  const checkedCount = useMemo(() => {
    let count = 0;
    for (const it of items) if (checkedIds.has(it.id)) count += 1;
    return count;
  }, [items, checkedIds]);

  const percent = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  function toggle(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearProgress() {
    setCheckedIds(new Set());
  }

  return (
    <>
      {/* Progress header */}
      <section
        style={{
          border: "1px solid #eee",
          borderRadius: 18,
          background: "#fff",
          overflow: "hidden",
          marginTop: 18,
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {pill(`Progress: ${checkedCount}/${totalCount}`)}
            {pill(`${percent}% complete`)}
          </div>

          <button
            type="button"
            onClick={clearProgress}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#fff",
              fontWeight: 800,
              cursor: "pointer",
            }}
            title="Clears local progress for this checklist selection"
          >
            Clear progress
          </button>
        </div>

        <div style={{ padding: "12px 18px" }}>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: "#eee",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percent}%`,
                background: "#111",
              }}
            />
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#777" }}>
            Saved locally in your browser for this State / Provider / Scope.
          </div>
        </div>
      </section>

      {/* Checklist groups */}
      {Object.keys(groups).length === 0 ? (
        <div style={{ color: "#666", lineHeight: 1.5, marginTop: 18 }}>
          No checklist items found.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 18, marginTop: 18 }}>
          {Object.entries(groups).map(([category, rows]) => {
            const sectionTotal = rows.length;
            const sectionChecked = rows.reduce(
              (acc, it) => acc + (checkedIds.has(it.id) ? 1 : 0),
              0
            );

            return (
              <section
                key={category}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 18,
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #f0f0f0",
                    background: "#fafafa",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "baseline",
                    flexWrap: "wrap",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 850 as any }}>
                    {category}
                  </h2>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ color: "#666", fontSize: 13 }}>
                      {sectionChecked}/{sectionTotal} done
                    </span>
                  </div>
                </div>

                <div style={{ padding: 18, display: "grid", gap: 14 }}>
                  {rows.map((item) => {
                    const isChecked = checkedIds.has(item.id);

                    return (
                      <div
                        key={item.id}
                        style={{
                          border: "1px solid #efefef",
                          borderRadius: 16,
                          padding: 16,
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(item.id)}
                            style={{ marginTop: 4, cursor: "pointer" }}
                          />

                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 17,
                                fontWeight: 850 as any,
                                lineHeight: 1.25,
                                textDecoration: isChecked ? "line-through" : "none",
                                color: isChecked ? "#666" : "#111",
                              }}
                            >
                              {item.title}
                            </div>

                            {item.description ? (
                              <div style={{ color: "#444", marginTop: 6, lineHeight: 1.45 }}>
                                {item.description}
                              </div>
                            ) : null}

                            <div
                              style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                                marginTop: 10,
                              }}
                            >
                              {item.isRequired ? (
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 850 as any,
                                    background: "#111",
                                    color: "#fff",
                                    padding: "4px 8px",
                                    borderRadius: 999,
                                    lineHeight: 1,
                                  }}
                                >
                                  Required
                                </span>
                              ) : null}

                              {item.renewalRule ? pill(`Renewal: ${item.renewalRule}`) : null}
                              {typeof item.dueDaysBeforeExpiry === "number"
                                ? pill(`Alert: ${item.dueDaysBeforeExpiry} days`)
                                : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
