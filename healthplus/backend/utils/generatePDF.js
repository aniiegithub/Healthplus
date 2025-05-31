const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

exports.generatePDF = async (data, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${data.name}_report.pdf"`);

  doc.pipe(res);

  // Header: Logo & Title
  const logoPath = path.join(__dirname, '../assets/healthplus-logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 30, { width: 60 });
  }
  doc.fontSize(18).fillColor('#333')
    .text('HealthPlus Medical Examination Report', 110, 40, { align: 'center', underline: true });

  // Watermark (light opacity)
  const watermarkPath = path.join(__dirname, '../assets/watermark.png');
  if (fs.existsSync(watermarkPath)) {
    doc.image(watermarkPath, 130, 200, { width: 300, opacity: 0.05 });
  }

  // Passport Photo (optional)
  if (data.passportImage && fs.existsSync(data.passportImage)) {
    doc.image(data.passportImage, 420, 100, { width: 100, height: 120 });
  }

  // Styled Info Section
  doc.moveDown(3);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#000').text('Candidate Details', { underline: true });

  const details = [
    ['Full Name', data.name],
    ['Post Applied For', data.post_applied_for],
    ['Date of Birth', data.dob],
    ['Nationality', data.nationality],
    ['Passport No.', data.passport],
    ['Place of Issue', data.place_of_issue],
    ['Sex', data.sex],
    ['Marital Status', data.status],
    ['Height', data.height],
    ['Weight', data.weight],
    ['Exam Date', data.exam_date],
    ['Expiry Date', data.expiry_date],
    ['Date of Issue', data.doi],
    ['Lab Serial No.', data.lab_sr_no],
  ];

  const startY = 240;
  let y = startY;

  doc.font('Helvetica').fontSize(11);
  details.forEach(([label, value], i) => {
    doc.rect(40, y, 250, 20).stroke('#ccc');
    doc.rect(290, y, 265, 20).stroke('#ccc');
    doc.text(`${label}`, 45, y + 5, { width: 200 });
    doc.text(`${value || '-'}`, 295, y + 5, { width: 250 });
    y += 22;
  });

  // FIT/UNFIT status
  doc.font('Helvetica-Bold').fontSize(14)
    .fillColor(data.fit_status === 'FIT' ? 'green' : 'red')
    .text(`CLIENT FOUND: ${data.fit_status}`, 0, y + 20, { align: 'center' });

  // QR Code (in-memory buffer)
  try {
    const qrData = `${process.env.BASE_URL || 'http://localhost:5000'}/pdf/${data._id}`;
    const qrBuffer = await QRCode.toBuffer(qrData, {
      type: 'png',
      width: 150,
      errorCorrectionLevel: 'H'
    });
    doc.image(qrBuffer, 50, y + 60, { width: 100 });
    doc.fontSize(10).fillColor('#555').text('Scan for Online Report', 50, y + 165);
  } catch (error) {
    console.error("QR Code Generation Failed", error);
  }

  // Signature (Doctor)
  const signPath = path.join(__dirname, '../assets/doctor-signature.png');
  if (fs.existsSync(signPath)) {
    doc.image(signPath, 400, y + 60, { width: 120 });
    doc.fontSize(10).fillColor('#000').text("Doctor's Signature", 420, y + 165);
  }

  doc.end();
};
