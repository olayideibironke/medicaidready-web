"use client";

export default function DownloadPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        border: "1px solid #ddd",
        background: "#111",
        color: "#fff",
        fontWeight: 850,
        cursor: "pointer",
      }}
      title="Opens the print dialog so you can Save as PDF"
    >
      Download PDF
    </button>
  );
}
