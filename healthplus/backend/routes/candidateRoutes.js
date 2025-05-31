const express = require("express");
const router = express.Router();
const {
  createCandidate,
  downloadPDF,
} = require("../controllers/candidateController");
const multer = require("multer");
const { generateCandidateReport } = require("../utils/generateCandidateReport");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.split(" ").join("_")}`),
});
const upload = multer({ storage });

router.post(
  "/api/candidates",
  upload.single("passportImage"),
  createCandidate,
  generateCandidateReport
);

router.get("/pdf/dummy-report", generateCandidateReport);

// router.get("/pdf/:id", async (req, res) => {
//   const data = await YourModel.findById(req.params.id);
//   if (!data) return res.status(404).send("Not found");
//   generatePDF(data, res);
// });
module.exports = router;
