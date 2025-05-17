document.getElementById("export-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Get filtered learners
  let list = getFilteredLearners();
  if (list.length === 0) {
    alert("No learners to export!");
    return;
  }

  // Extract grade info from the first learner
  const grade = list[0]?.grade || "N/A";

  // Define table columns
  const columns = [
    { header: '#', dataKey: 'index' },
    { header: 'Name', dataKey: 'name' },
    { header: 'Grade', dataKey: 'grade' },
    { header: 'Stream', dataKey: 'stream' },
  ];

  // Add subject columns dynamically
  subjectsAll.forEach(subject => {
    columns.push({ header: subject, dataKey: subject });
  });

  // Add Total, Average, Rank columns
  columns.push(
    { header: 'Total', dataKey: 'total' },
    { header: 'Average', dataKey: 'average' },
    { header: 'Rank', dataKey: 'rank' }
  );

  // Prepare row data
  const rows = list.map((learner, i) => {
    const row = {
      index: i + 1,
      name: learner.name,
      grade: learner.grade,
      stream: learner.stream,
      total: learner.total,
      average: learner.average,
      rank: learner.rank,
    };
    subjectsAll.forEach(subject => {
      row[subject] = learner.scores[subject] !== undefined ? learner.scores[subject] : '';
    });
    return row;
  });

  // Document title
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("TAKAYE COMPREHENSIVE SCHOOL", 105, 15, null, null, "center");

  // Grade-specific subtitle
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Grade ${grade} Learners Marks Report`, 105, 23, null, null, "center");

  // Add date and time
  const now = new Date();
  const dateStr = now.toLocaleString(); // Full date and time
  doc.setFontSize(10);
  doc.text(`Generated on: ${dateStr}`, 105, 30, null, null, "center");

  // Draw table
  doc.autoTable({
    startY: 38,
    head: [columns.map(col => col.header)],
    body: rows.map(r => columns.map(col => r[col.dataKey])),
    styles: { fontSize: 7 },
    headStyles: { fillColor: [11, 61, 145], textColor: 255 },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
  });

  // Save the PDF file
  doc.save(`TAKAYE_Grade_${grade}_Report_${now.toISOString().slice(0,10)}.pdf`);
});
