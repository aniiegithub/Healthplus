const Candidate = require("../models/Candidate");
const { generatePDF } = require("../utils/generatePDF");

exports.createCandidate = async (req, res, next) => {
  try {
    const formData = JSON.parse(req.body.data);

    console.log("FILE path : ", req.file?.path);
    formData.passportImage = req.file?.path;

    console.log("Image Path : ", formData.passportImage);

    const candidate = await Candidate.create(formData);

    // console.log("Created CADNIDATE : ", candidate);

    req.formData = formData;
    req.candidate = candidate;
    // res.status(201).json({ success: true, candidateId: candidate._id });

    next();
  } catch (err) {
    console.error("❌ Error creating candidate:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.downloadPDF = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).send("Candidate not found");
    }

    // Send the PDF directly to the browser
    return generatePDF(candidate, res);
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
