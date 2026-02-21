import jsPDF from "jspdf";

export default function DownloadButton({ scheme, details, benefits, proc }) {
  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth  = doc.internal.pageSize.width;   // 210 mm
    const pageHeight = doc.internal.pageSize.height;  // 297 mm
    const margin      = 15;
    const contentWidth = pageWidth - margin * 2;      // 180 mm

    // ── Colour palette ──────────────────────────────────────
    const C = {
      emerald:      [22,  163,  74],   // #16a34a  emerald-600
      emeraldLight: [209, 250, 229],   // #d1fae5  emerald-100
      white:        [255, 255, 255],
      dark:         [17,   24,  39],   // gray-900
      gray6:        [75,   85,  99],   // gray-600
      gray4:        [156, 163, 175],   // gray-400
      gray2:        [229, 231, 235],   // gray-200
    };

    let y = 0;

    // ── Overflow guard (re-draws header on each new page) ──
    const checkPageOverflow = (spaceNeeded = 10) => {
      if (y + spaceNeeded > pageHeight - 22) {
        doc.addPage();
        drawHeader();
        y = 40;
      }
    };

    /* ======================================================
       HEADER BAND  (repeats on every page)
       ====================================================== */
    const drawHeader = () => {
      // Green background bar
      doc.setFillColor(...C.emerald);
      doc.rect(0, 0, pageWidth, 30, "F");

      // --- Logo icon (SVG viewBox 0 0 24 24, scaled to 8 mm) ---
      const s      = 8 / 24;
      const lx     = margin;
      const ly     = 7;

      doc.setDrawColor(...C.white);
      doc.setFillColor(...C.white);
      doc.setLineWidth(0.55);

      // Outer circle
      doc.circle(lx + 12 * s, ly + 12 * s, 9 * s, "S");

      // Leaf body (two cubic beziers, closed & filled)
      doc.lines(
        [
          [ 3 * s,     0,       5.8 * s, -2 * s,   6.5 * s, -6 * s],
          [-4 * s,     0,      -6.5 * s,  2.5 * s, -6.5 * s, 6 * s],
        ],
        lx + 9.5 * s,
        ly + 14.5 * s,
        [1, 1],
        "FD",
        true
      );

      // Stem
      doc.lines(
        [[0, 1.5 * s, 0.5 * s, 2.5 * s, 1.5 * s, 3.5 * s]],
        lx + 9.5 * s,
        ly + 14.5 * s,
        [1, 1],
        "S"
      );

      // Brand name
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...C.white);
      doc.text("Krishiculture", lx + 24 * s + 3, ly + 12 * s + 2);

      // Portal URL — right-aligned, subtle
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.setTextColor(...C.emeraldLight);
      doc.text(
        "krishiculture.in",
        pageWidth - margin,
        ly + 12 * s + 2,
        { align: "right" }
      );

      // Thin white rule at bottom of band
      doc.setDrawColor(...C.white);
      doc.setLineWidth(0.25);
      doc.line(0, 30, pageWidth, 30);
    };

    drawHeader();
    y = 40;

    /* ======================================================
       SCHEME TITLE BLOCK
       ====================================================== */
    const schemeName = scheme?.scheme_name || "Scheme Details";

    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.setTextColor(...C.dark);
    const nameLines = doc.splitTextToSize(schemeName, contentWidth);
    nameLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 9;
    });

    // Emerald accent underline
    doc.setDrawColor(...C.emerald);
    doc.setLineWidth(1.2);
    doc.line(margin, y, margin + Math.min(schemeName.length * 2.8, contentWidth * 0.6), y);
    doc.setLineWidth(0.2);
    y += 5;

    // "Generated on" date
    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
    doc.setFontSize(8.5);
    doc.setFont(undefined, "italic");
    doc.setTextColor(...C.gray4);
    doc.text(`${today}`, margin, y);
    y += 12;

    /* ======================================================
       CONTENT SECTION HELPER
       ====================================================== */
    const addSection = (title, content, numbered = false) => {
      if (!content || (Array.isArray(content) && content.length === 0)) return;
      if (typeof content === "string" && content.trim() === "") return;

      checkPageOverflow(24);

      // Section header pill (light green rounded rect)
      doc.setFillColor(...C.emeraldLight);
      doc.roundedRect(margin, y - 4.5, contentWidth, 11, 2, 2, "F");

      // Left accent bar
      doc.setFillColor(...C.emerald);
      doc.rect(margin, y - 4.5, 3, 11, "F");

      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.setTextColor(...C.emerald);
      doc.text(title, margin + 7, y + 3);
      y += 14;

      // Body text
      doc.setFontSize(10.5);
      doc.setFont(undefined, "normal");
      doc.setTextColor(...C.dark);

      const addTextBlock = (text, prefix = "") => {
        const lines = doc.splitTextToSize(prefix + String(text), contentWidth - 12);
        lines.forEach((line) => {
          checkPageOverflow(8);
          // Reset after possible page-overflow header redraw
          doc.setFontSize(10.5);
          doc.setFont(undefined, "normal");
          doc.setTextColor(...C.dark);
          doc.text(line, margin + 6, y);
          y += 6.5;
        });
      };

      if (Array.isArray(content)) {
        content.forEach((item, index) => {
          checkPageOverflow(10);
          const prefix = numbered ? `${index + 1}.  ` : "•  ";
          addTextBlock(item, prefix);
          y += 1.5;
        });
      } else if (typeof content === "object" && content !== null) {
        Object.values(content).forEach((val, index) => {
          checkPageOverflow(10);
          const prefix = numbered ? `${index + 1}.  ` : "•  ";
          addTextBlock(val, prefix);
          y += 1.5;
        });
      } else {
        addTextBlock(content);
      }

      // Light divider after section
      doc.setDrawColor(...C.gray2);
      doc.setLineWidth(0.3);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 10;
    };

    /* ======================================================
       CONTENT
       ====================================================== */
    addSection("Details",              details);
    addSection("Benefits",             benefits);
    addSection("Eligibility",          scheme?.eligibility);
    addSection("Application Process",  proc?.steps);
    addSection("Documents Required",   scheme?.documents_required);

    /* ======================================================
       FOOTER  (all pages)
       ====================================================== */
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Footer rule
      doc.setDrawColor(...C.gray2);
      doc.setLineWidth(0.4);
      doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

      // Left: branding
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.setTextColor(...C.gray4);
      doc.text(
        "Krishiculture Portal  ·  krishiculture.in",
        margin,
        pageHeight - 9
      );

      // Right: page number
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 9,
        { align: "right" }
      );
    }

    doc.save(`${schemeName.replace(/\s+/g, "_")}_Details.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
    >
      {/* Download arrow icon */}
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      Download Details
    </button>
  );
}