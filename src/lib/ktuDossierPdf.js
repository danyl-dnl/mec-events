import { jsPDF } from 'jspdf';

/**
 * Generates a professional KTU Activity Points Dossier PDF.
 * @param {object} profile - User profile data (full_name, branch, semester, student_id, email)
 * @param {object} ktuSummary - KTU Points details compiled by calculateKtuSummary
 */
export function generateKtuDossierPdf(profile, ktuSummary) {
  if (!profile || !ktuSummary) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const studentName = profile.full_name || 'N/A';
  const branch = profile.branch || 'N/A';
  const semester = profile.semester || 'N/A';
  const studentId = profile.student_id || 'N/A';
  const email = profile.email || 'N/A';

  // Colors & Styles (Academic - Navy/Slate theme)
  const primaryColor = [17, 24, 39]; // Dark charcoal
  const accentColor = [59, 130, 246]; // Muted blue
  const lightGray = [243, 244, 246];
  const borderGray = [209, 213, 219];

  // Helper: Draw horizontal line
  const hr = (y) => {
    pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    pdf.setLineWidth(0.2);
    pdf.line(15, y, 195, y);
  };

  // --- HEADER SECTION ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('GOVERNMENT MODEL ENGINEERING COLLEGE, THRIKKAKARA', 105, 18, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Kochi, Kerala, India - 682021 | Phone: +91 484 2577379', 105, 23, { align: 'center' });
  pdf.text('Affiliated to APJ Abdul Kalam Technological University (KTU)', 105, 27, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.text('KTU CO-CURRICULAR & EXTRA-CURRICULAR ACTIVITY RECORD', 105, 36, { align: 'center' });

  hr(40);

  // --- STUDENT DETAILS SECTION ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('STUDENT PROFILE', 15, 47);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Name:', 15, 53);
  pdf.setFont('helvetica', 'bold');
  pdf.text(studentName, 35, 53);

  pdf.setFont('helvetica', 'normal');
  pdf.text('Roll No / KTU ID:', 15, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.text(studentId, 45, 59);

  pdf.setFont('helvetica', 'normal');
  pdf.text('Department:', 115, 53);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${branch} Semester ${semester}`, 138, 53);

  pdf.setFont('helvetica', 'normal');
  pdf.text('Email Address:', 115, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.text(email, 138, 59);

  hr(65);

  // --- SUMMARY TABLE ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('KTU ACTIVITY POINTS ESTIMATION SUMMARY', 15, 72);

  // Draw table header
  pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.rect(15, 76, 180, 8, 'F');
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(0.4);
  pdf.line(15, 76, 195, 76);
  pdf.line(15, 84, 195, 84);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('ACTIVITY GROUP', 18, 81.5);
  pdf.text('REGISTERED EVENTS', 100, 81.5, { align: 'center' });
  pdf.text('RAW POINTS', 140, 81.5, { align: 'center' });
  pdf.text('CAPPED KTU POINTS (MAX 40)', 178, 81.5, { align: 'center' });

  // Rows
  const grps = [
    { label: 'Group I: Co-curricular Activities (Arts, Quiz, Sports)', key: 'GROUP_I' },
    { label: 'Group II: Professional Development (IEEE, FOSS, Workshops)', key: 'GROUP_II' },
    { label: 'Group III: Innovation & Entrepreneurship (IEDC, Cyborg)', key: 'GROUP_III' },
  ];

  let currentY = 84;
  pdf.setFont('helvetica', 'normal');
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);

  grps.forEach((g) => {
    const data = ktuSummary.groups[g.key];
    currentY += 8;
    pdf.text(g.label, 18, currentY - 3);
    pdf.text(String(data.count), 100, currentY - 3, { align: 'center' });
    pdf.text(String(data.points), 140, currentY - 3, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.text(String(Math.min(data.points, data.cap)), 178, currentY - 3, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.line(15, currentY, 195, currentY);
  });

  // Total summary row
  currentY += 8;
  pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.rect(15, currentY - 8, 180, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL ACCUMULATED ESTIMATED KTU POINTS', 18, currentY - 3);
  pdf.setFontSize(10);
  pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  pdf.text(`${ktuSummary.totalEstimated} / ${ktuSummary.target} PTS`, 178, currentY - 2.5, { align: 'center' });
  pdf.line(15, currentY, 195, currentY);

  currentY += 15;

  // --- DETAILED BREAKDOWN TABLE ---
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('PARTICIPATED ACTIVITIES & CREDENTIAL BREAKDOWN', 15, currentY);

  currentY += 4;
  pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.rect(15, currentY, 180, 8, 'F');
  pdf.setLineWidth(0.3);
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.line(15, currentY, 195, currentY);
  pdf.line(15, currentY + 8, 195, currentY + 8);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('EVENT NAME & CLUB', 18, currentY + 5);
  pdf.text('DATE', 90, currentY + 5);
  pdf.text('CREDENTIAL ID', 122, currentY + 5);
  pdf.text('KTU GROUP', 162, currentY + 5);
  pdf.text('EST. PTS', 188, currentY + 5, { align: 'center' });

  currentY += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);

  if (ktuSummary.activities.length === 0) {
    currentY += 10;
    pdf.text('No registered event passes found for this profile.', 105, currentY - 4, { align: 'center' });
    pdf.line(15, currentY, 195, currentY);
  } else {
    ktuSummary.activities.forEach((act) => {
      // Prevent overflow to next page if we hit too many items (Standard A4 is 297mm height)
      if (currentY > 240) {
        pdf.addPage();
        currentY = 20;
        // Draw headers on page 2
        pdf.setFont('helvetica', 'bold');
        pdf.text('PARTICIPATED ACTIVITIES (CONTINUED)', 15, currentY);
        currentY += 4;
        pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.rect(15, currentY, 180, 8, 'F');
        pdf.line(15, currentY, 195, currentY);
        pdf.line(15, currentY + 8, 195, currentY + 8);
        pdf.text('EVENT NAME & CLUB', 18, currentY + 5);
        pdf.text('DATE', 90, currentY + 5);
        pdf.text('CREDENTIAL ID', 122, currentY + 5);
        pdf.text('KTU GROUP', 162, currentY + 5);
        pdf.text('EST. PTS', 188, currentY + 5, { align: 'center' });
        currentY += 8;
        pdf.setFont('helvetica', 'normal');
      }

      const dateStr = new Date(act.registeredAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      pdf.setFont('helvetica', 'bold');
      const eventTitleShort = act.eventTitle.length > 36 ? act.eventTitle.slice(0, 33) + '...' : act.eventTitle;
      pdf.text(eventTitleShort, 18, currentY + 3.5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(act.clubName, 18, currentY + 6.5);
      
      pdf.setFontSize(8);
      pdf.text(dateStr, 90, currentY + 5);
      pdf.text(act.ticketId.slice(0, 14), 122, currentY + 5);
      
      const groupShort = act.ktuGroup === 'GROUP_I' ? 'Group I' :
                         act.ktuGroup === 'GROUP_II' ? 'Group II' : 'Group III';
      pdf.text(groupShort, 162, currentY + 5);
      pdf.text(String(act.points), 188, currentY + 5, { align: 'center' });

      currentY += 9;
      pdf.line(15, currentY, 195, currentY);
    });
  }

  // --- FOOTER BLOCK: VERIFICATIONS & SIGNATURES ---
  // Position signature blocks relative to currentY, but check if there's enough space
  if (currentY > 245) {
    pdf.addPage();
    currentY = 30;
  } else {
    currentY = Math.max(currentY + 15, 235);
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(110, 110, 110);
  pdf.text('STUDENT DECLARATION', 15, currentY - 12);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text('I hereby declare that the co-curricular and professional activities stated above are true and correct.', 15, currentY - 8);

  pdf.setLineWidth(0.2);
  pdf.setDrawColor(180, 180, 180);
  
  // Signature Lines
  pdf.line(15, currentY + 15, 55, currentY + 15);
  pdf.line(80, currentY + 15, 120, currentY + 15);
  pdf.line(145, currentY + 15, 190, currentY + 15);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text("Student's Signature", 15, currentY + 19);
  pdf.text('Staff Coordinator', 80, currentY + 19);
  pdf.text('Faculty Advisor (SFA)', 145, currentY + 19);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Date: ________________', 15, currentY + 23);
  pdf.text('MEC Activity Cell', 80, currentY + 23);
  pdf.text('Approved Points Verified', 145, currentY + 23);

  // Download trigger
  pdf.save(`KTU_Activity_Dossier_${studentId}_${studentName.replace(/\s+/g, '_')}.pdf`);
}
