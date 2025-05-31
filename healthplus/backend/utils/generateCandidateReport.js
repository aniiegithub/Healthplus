const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

// Dummy data for the report
// const formData = {
//   name: "Md Neyazuddin",
//   age: 22,
//   dob: "2002-01-20",
//   post_applied_for: "Jev",
//   height: "5.8",
//   doi: "2025-05-22",
//   nationality: "Indian",
//   weight: "72",
//   place_of_issue: "mbp",
//   passport: "njnds78",
//   gender: "Male",
//   maritalStatus: "Unmarried",
//   labSrNo: "1234",
//   country: "123",
//   examinedDate: "2025-05-22",
//   expiry_date: "2025-05-22",
//   // Medical Exam
//   visionRE: "6/6",
//   visionLE: "6/6",
//   earRE: "NAD",
//   earLE: "NAD",
//   bp: "105",
//   heart: "NAD",
//   lungs: "NAD",
//   abdomen: "NAD",
//   Hydrocele: "NIL",
//   vdrl: "NON REACTIVE",
//   chestXray: "NAD",
//   pregnancy: "Negative",
//   remarks: "Chest X-ray ~ NAD",
//   // Lab Exam
//   urine: { sugar: "NIL", albumin: "NIL", Blood_Others: "" },
//   Hemoglobin: "88",
//   Malaria_Rapid: "NOT SEEN",
//   Microfilaria: "NOT SEEN",
//   Blood_Group: "ab+",
//   Blood_Others: "NOT SEEN",
//   Salmonella_Shigella: "NAD",
//   Bilharziasis: "NAD",
//   helminths: "NAD",
//   V_Cholera: "NAD",
//   HIV: "NON REACTIVE",
//   HBSAG: "Not-reactive",
//   antihcv: "Not-reactive",
//   lft: "NORMAL",
//   urea: "213",
//   creatinine: "4",
//   bloodSugar: "5",
//   kft: "NORMAL",
//   fitStatus: "UNFIT",
// };

exports.generateCandidateReport = async (req, res) => {
  const formData = req.formData;
  // console.log("FORM data : ", formData);
  const doc = new PDFDocument({ size: "A4", margin: 20 });

  const pdfPath = path.join(
    process.cwd() +
      `/reports/${formData?.name
        .split(" ")
        .join("_")}_report_${Math.random()}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${pdfPath}`);

  let stream;
  try {
    stream = doc.pipe(fs.createWriteStream(pdfPath));
  } catch (error) {
    console.log("ERROR : ", error);
  }
  doc.pipe(res);

  // Water mark Image
  const watermarkPath = path.join(__dirname, "../assets/logo_png.png");

  if (fs.existsSync(watermarkPath)) {
    doc.opacity(0.2); // Set transparency level for the watermark
    doc.image(watermarkPath, 150, 220, {
      width: 300,
      align: "center",
      valign: "center",
    });
    doc.opacity(1); // Reset to full opacity for the rest of the content
  }

  // Header: Logo, Profile, and Info
  const logoPath = path.join(__dirname, "../assets/logo.jpg");
  console.log(path.join(process.cwd(), formData.passportImage));
  const profilePath = path.join(process.cwd(), formData.passportImage);
  const signaturePath = path.join(__dirname, "../assets/signature.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 30, 25, { width: 80 });
  }

  // Title and Lab Info
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#006837")
    .text("Health Plus", 120, 30, { continued: true })
    .fillColor("#000")
    .fontSize(16)
    .text(" Diagnostic Centre", { continued: false });
  doc
    .fontSize(10)
    .fillColor("#000")
    .text("CANDIDATE INFORMATION", 0, 80, { align: "center", underline: true });

  // Candidate Info Table
  doc.rect(30, 100, 535, 70).stroke("#006837");
  doc.fontSize(9).fillColor("#000");
  const infoLeft = [
    [`FULL NAME: ${formData?.name || "No Name"}`, `AGE: ${formData?.age}`],
    [
      `POST APPLIED FOR: ${formData?.post_applied_for || "NA"}`,
      `HEIGHT: ${formData?.height || "H-0"}`,
    ],
    [`NATIONALITY: ${formData?.nationality}`, `WEIGHT: ${formData?.weight}`],
    [`PASSPORT NO.: ${formData?.passport}`, `GENDER: ${formData?.gender}`],
  ];
  const infoRight = [
    [`DATE OF BIRTH: ${formData?.dob}`],
    [`DATE OF ISSUE: ${formData?.doi}`],
    [`PLACE OF ISSUE: ${formData?.place_of_issue}`],
    [`MARITAL STATUS: ${formData?.maritalStatus}`],
  ];

  if (fs.existsSync(profilePath)) {
    doc.image(profilePath, 500, 110, {
      width: 70,
      height: 70,
      fit: [50, 50],
      align: "right",
    });
  }

  let y = 110;
  for (let i = 0; i < infoLeft.length; i++) {
    doc.text(infoLeft[i][0], 40, y, { width: 200 });
    doc.text(infoLeft[i][1], 200, y, { width: 120 });
    doc.text(infoRight[i][0], 350, y, { width: 200 });
    y += 15;
  }

  // Lab Info Box
  doc.rect(400, 30, 165, 50).stroke("#006837");
  doc.fontSize(8).fillColor("#000");
  doc.text(`LAB SR NO: ${formData?.labSrNo}`, 410, 35);
  doc.text(`COUNTRY: ${formData?.country}`, 410, 45);
  doc.text(`EXAMINED DATE: ${formData?.examinedDate}`, 410, 55);
  doc.text(`EXPIRY DATE: ${formData?.expiry_date}`, 410, 65);

  // Green Section Header
  doc.rect(30, 180, 535, 20).fillAndStroke("#009245", "#009245");
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#fff")
    .text("REPORT", 0, 185, { align: "center" });
  doc.fillColor("#000");

  // Two-column layout for Medical and Lab Exam
  // Medical Exam
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#009245")
    .text("MEDICAL EXAMINATION", 35, 210);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#000")
    .text("TYPE OF EXAMINATION", 35, 225);
  doc.text("RESULTS", 160, 225);
  let my = 240;
  const medRows = [
    ["EYES", ""],
    ["Vision Right Eye", formData?.visionRE],
    ["Vision Left Eye", formData?.visionLE],
    ["EAR", ""],
    ["Right Ear", formData?.earRE],
    ["Left Ear", formData?.earLE],
    ["SYSTEMATIC EXAM", ""],
    ["Blood Pressure", formData?.bp],
    ["Heart-Rate", formData?.heart],
    ["Lungs", formData?.lungs],
    ["Abdomen", formData?.abdomen],
    ["Hydrocele", formData?.Hydrocele],
    ["VENEREAL DISEASES (CLINICAL)", ""],
    ["VDRL/TPHA", formData?.vdrl],
    ["CHEST X-RAY", formData?.chestXray],
    ["PREGNANCY", formData?.pregnancy],
    ["REMARKS", formData?.remarks],
  ];
  doc.font("Helvetica").fontSize(8);
  medRows.forEach(([type, result]) => {
    doc.text(type, 35, my, { width: 110 });
    doc.text(result, 160, my, { width: 80 });
    my += 13;
  });

  // Lab Exam
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#009245")
    .text("LABORATORY EXAMINATION", 300, 210);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#000")
    .text("TYPE OF LAB INVESTIGATION", 300, 225);
  doc.text("RESULTS", 470, 225);
  let ly = 240;
  const labRows = [
    ["URINE", ""],
    ["Sugar", formData?.sugar],
    ["Albumin", formData?.albumin],
    ["Others", formData?.Blood_Others],
    ["BLOOD", ""],
    ["Haemoglobin", formData?.Hemoglobin],
    ["Malaria Rapid", formData?.Malaria_Rapid],
    ["Microfilaria", formData?.Microfilaria],
    ["Blood Group", formData?.Blood_Group],
    ["Others", formData?.Blood_Others],
    ["STOOL", ""],
    ["Salmonella/Shigella", formData?.Salmonella_Shigella],
    ["Bilharziasis", formData?.Bilharziasis],
    ["Helminths", formData?.helminths],
    ["V. Cholera", formData?.V_Cholera],
    ["SEROLOGY ELISA", ""],
    ["HIV", formData?.HIV],
    ["HbsAg", formData?.HBSAG],
    ["Anti HCV", formData?.antihcv],
    ["L.F.T", formData?.lft],
    ["Urea", formData?.urea],
    ["Creatinine", formData?.creatinine],
    ["Blood Sugar", formData?.serologySugar],
    ["K.F.T.", formData?.kft],
  ];
  doc.font("Helvetica").fontSize(8);
  labRows.forEach(([type, result]) => {
    doc.text(type, 300, ly, { width: 150 });
    doc.text(result, 470, ly, { width: 80 });
    ly += 13;
  });

  // QR Code (dummy)
  try {
    const qrBuffer = await QRCode.toBuffer("https://dummy-qr-link.com", {
      type: "png",
      width: 80,
    });
    doc.image(qrBuffer, 40, 580, { width: 60 });
  } catch (e) {
    doc.fontSize(8).fillColor("red").text("QR Error", 40, 470);
  }

  // Doctor Signature
  if (fs.existsSync(signaturePath)) {
    doc.image(signaturePath, 440, 570, { width: 80 });
    doc.fontSize(8).fillColor("#000").text("Dr. R HASSAN", 440, 625);
    doc.text("Reg. No. 29402", 440, 635);
  }

  // UNFIT status
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("red")
    .text("UNFIT", 0, 600, { align: "center" });

  // Footer
  doc
    .fontSize(7)
    .fillColor("#000")
    .text(
      'NOTE: It should be clearly understood that "Health Plus Diagnostic Centre" is conducting medical examination only and is no way linked to any agency or responsible for placement of any job within INDIA or ABROAD or directing candidates to any country. If any candidate is found unfit, please return this report immediately. For further details contact medical incharge person. Findings / Tests are based on clinical examination and as per the diagnosis, if doubt like clinical evidence of disease, further investigation, please contact immediately in person.',
      30,
      700,
      { width: 535, align: "justify" }
    );
  doc
    .fontSize(8)
    .fillColor("#009245")
    .text(
      "Address: Imli Chatti, Main road, Infront of vaishali sweets, Muzaffarpur-842001 Email - healthplusmf@gmail.com +91-9534863737",
      30,
      740,
      { width: 535, align: "center" }
    );

  doc.end();

  stream.on("finish", () => {
    res.download(pdfPath, filename || null, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("File download error.");
      }
    });
  });
};
