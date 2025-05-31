import React, { useState, useEffect } from "react";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import FileUpload from "../components/FileUpload";
import axios from "axios";

import { useParams } from "react-router-dom";

const CandidateForm = () => {
  const [form, setForm] = useState({
    name: "abc",
    place_of_issue: "Bhilai",
    ref_number: "3254", // NA
    height: "160",
    dob: "12-1-1999",
    nationality: "INDIAN",
    weight: "70",
    exam_date: "12-12-2025", // NA
    sex: "MALE", // NA
    status: "Married", // NA
    age: "23",
    passport: "123",
    post_applied_for: "asp",
    expiry_date: "12-11-2025",
    doi: "02-02-2024",
    bp: "234",
    heart: "NAD",
    lungs: "NAD",
    abdomen: "NAD",
    Hydrocele: "NIL",
    Helminths: "NAD", // NA
    Bilharziasis: "NAD",
    Salmonella_Shigella: "NAD", // NA
    V_Cholera: "NAD",
    Hemoglobin: "12",
    Malaria_Rapid: "NOT SEEN",
    Microfilaria: "NOT SEEN",
    Blood_Others: "NOT SEEN",
    Blood_Group: "B+",
    HIV: "NON REACTIVE",
    HBSAG: "Not Reactive",
    AntiHcv: "Not Reactive",
    LFT: "NORMAL",
    Urea: "42",
    Creatinine: "123",
    BloodSugar: "234",
    Kft: "NORMAL",
    eye_vision_reye: "6/6",
    eye_vision_leye: "6/6",
    rear: "NAD",
    lear: "NAD",
    vdrl: "NON REACTIVE",
    sugar: "NIL",
    albumin: "NIL",
    urine_other: "NIL",
    PREGNANCY_TEST: "Not-Applicable",
    ChestXRay: "NAD",
    remarks: "",
    lab_sr_no: "",
    fit_status: "FIT",
  });

  const [passportImage, setPassportImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 3 * 1024 * 1024) {
      alert("Image must be less than 3MB");
      return;
    }
    setPassportImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("passportImage", passportImage);
    // console.log(data);
    data.append("data", JSON.stringify(form));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/candidates",
        data,
        {
          responseType: "blob", // Important for receiving PDF as blob
        }
      );

      console.log("RES : ", res);

      // Create a blob URL for the PDF
      const blob = new Blob([res.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      // Open in new tab
      window.open(blobUrl, "_blank");

      // Optional: Revoke the object URL later if needed
      // URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      alert("Submission failed.");
    }
  };
  const { userId } = useParams(); // ✅ useParams is now inside component

  return (
    <div className="main-wrapper">
      <header className="header">
        <img
          src="https://tse4.mm.bing.net/th?id=OIP.kyOlNfJM6nmbyoUgQOQU_gHaHa&pid=Api&P=0&h=180"
          alt="HealthPlus Logo"
          className="main-logo"
        />
        <h1 className="form-title">HealthPlus Medical Examination Form</h1>
      </header>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        {/* Personal Details */}
        <section className="card personal-details">
          <h2 className="card-title">Personal Details</h2>
          <div className="form-grid-5">
            <InputField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <InputField
              label="Place of Issue"
              name="place_of_issue"
              value={form.place_of_issue}
              onChange={handleChange}
            />
            <InputField
              label="Ref. No."
              name="ref_number"
              value={form.ref_number}
              onChange={handleChange}
            />
            <InputField
              label="Height"
              name="height"
              value={form.height}
              onChange={handleChange}
            />
            <InputField
              label="Date of Birth"
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
            <InputField
              label="Nationality"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
            />
            <InputField
              label="Weight"
              name="weight"
              value={form.weight}
              onChange={handleChange}
            />
            <InputField
              label="Exam Date"
              type="date"
              name="exam_date"
              value={form.exam_date}
              onChange={handleChange}
            />
            <SelectField
              label="Sex"
              name="sex"
              value={form.sex}
              onChange={handleChange}
              options={["MALE", "FEMALE", "Other"]}
            />
            <SelectField
              label="Marital Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={["Married", "Unmarried"]}
            />
            <InputField
              label="Age"
              name="age"
              value={form.age}
              onChange={handleChange}
            />
            <InputField
              label="Passport No."
              name="passport"
              value={form.passport}
              onChange={handleChange}
            />
            <InputField
              label="Post Applied For"
              name="post_applied_for"
              value={form.post_applied_for}
              onChange={handleChange}
            />
            <InputField
              label="Expiry Date"
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
            />
            <InputField
              label="Date of Issue"
              type="date"
              name="doi"
              value={form.doi}
              onChange={handleChange}
            />
          </div>
          {/* Image upload */}
          <FileUpload
            label="Upload Passport Image (Max 3MB)"
            onChange={handleImageChange}
          />
        </section>

        {/* Medical Examination */}
        <section className="card medical-examination">
          <h2 className="card-title">Medical Examination</h2>

          {/* Systematic Examination */}
          <div className="sub-card">
            <h3 className="sub-card-title">Systematic Examination</h3>
            <div className="form-grid-5">
              <InputField
                label="B.P"
                name="bp"
                value={form.bp}
                onChange={handleChange}
              />
              <InputField
                label="Heart Rate"
                name="heart"
                value={form.heart}
                onChange={handleChange}
              />
              <InputField
                label="Lungs"
                name="lungs"
                value={form.lungs}
                onChange={handleChange}
              />
              <InputField
                label="Abdomen"
                name="abdomen"
                value={form.abdomen}
                onChange={handleChange}
              />
              <InputField
                label="Hydrocele"
                name="Hydrocele"
                value={form.Hydrocele}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Stool */}
          <div className="sub-card">
            <h3 className="sub-card-title">Stool</h3>
            <div className="form-grid-4">
              <InputField
                label="Helminths"
                name="Helminths"
                value={form.Helminths}
                onChange={handleChange}
              />
              <InputField
                label="Bilharziasis"
                name="Bilharziasis"
                value={form.Bilharziasis}
                onChange={handleChange}
              />
              <InputField
                label="Salmonella/Shigella"
                name="Salmonella_Shigella"
                value={form.Salmonella_Shigella}
                onChange={handleChange}
              />
              <InputField
                label="V. Cholera"
                name="V_Cholera"
                value={form.V_Cholera}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Blood */}
          <div className="sub-card">
            <h3 className="sub-card-title">Blood</h3>
            <div className="form-grid-5">
              <InputField
                label="Hemoglobin"
                name="Hemoglobin"
                value={form.Hemoglobin}
                onChange={handleChange}
              />
              <InputField
                label="Malaria Rapid"
                name="Malaria_Rapid"
                value={form.Malaria_Rapid}
                onChange={handleChange}
              />
              <InputField
                label="Microfilaria"
                name="Microfilaria"
                value={form.Microfilaria}
                onChange={handleChange}
              />
              <InputField
                label="Others"
                name="Blood_Others"
                value={form.Blood_Others}
                onChange={handleChange}
              />
              <InputField
                label="Blood Group"
                name="Blood_Group"
                value={form.Blood_Group}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Serology */}
          <div className="sub-card">
            <h3 className="sub-card-title">Serology</h3>
            <div className="form-grid-5">
              <InputField
                label="HIV"
                name="HIV"
                value={form.HIV}
                onChange={handleChange}
              />
              <SelectField
                label="HBSAG"
                name="HBSAG"
                value={form.HBSAG}
                onChange={handleChange}
                options={["Positive", "Negative", "Other"]}
              />
              <SelectField
                label="AntiHcv"
                name="AntiHcv"
                value={form.AntiHcv}
                onChange={handleChange}
                options={["Positive", "Negative", "Other"]}
              />
              <InputField
                label="LFT"
                name="LFT"
                value={form.LFT}
                onChange={handleChange}
              />
              <InputField
                label="Urea"
                name="Urea"
                value={form.Urea}
                onChange={handleChange}
              />
            </div>
            <div className="form-grid-3">
              <InputField
                label="Creatinine"
                name="Creatinine"
                value={form.Creatinine}
                onChange={handleChange}
              />
              <InputField
                label="Blood Sugar"
                name="BloodSugar"
                value={form.BloodSugar}
                onChange={handleChange}
              />
              <InputField
                label="K.F.T"
                name="Kft"
                value={form.Kft}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Eye Vision */}
          <div className="sub-card">
            <h3 className="sub-card-title">Eye Vision</h3>
            <div className="form-grid-2">
              <InputField
                label="R Eye"
                name="eye_vision_reye"
                value={form.eye_vision_reye}
                onChange={handleChange}
              />
              <InputField
                label="L Eye"
                name="eye_vision_leye"
                value={form.eye_vision_leye}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Ear */}
          <div className="sub-card">
            <h3 className="sub-card-title">Ear</h3>
            <div className="form-grid-2">
              <InputField
                label="R Ear"
                name="rear"
                value={form.rear}
                onChange={handleChange}
              />
              <InputField
                label="L Ear"
                name="lear"
                value={form.lear}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Venereal Diseases */}
          <div className="sub-card">
            <h3 className="sub-card-title">Venereal Diseases</h3>
            <InputField
              label="VDRL"
              name="vdrl"
              value={form.vdrl}
              onChange={handleChange}
            />
          </div>

          {/* Urine */}
          <div className="sub-card">
            <h3 className="sub-card-title">Urine</h3>
            <div className="form-grid-3">
              <InputField
                label="Sugar"
                name="sugar"
                value={form.sugar}
                onChange={handleChange}
              />
              <InputField
                label="Albumin"
                name="albumin"
                value={form.albumin}
                onChange={handleChange}
              />
              <InputField
                label="Other"
                name="urine_other"
                value={form.urine_other}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Pregnancy Test */}
          <div className="sub-card">
            <h3 className="sub-card-title">Pregnancy Test</h3>
            <SelectField
              label="Pregnancy Test"
              name="PREGNANCY_TEST"
              value={form.PREGNANCY_TEST}
              onChange={handleChange}
              options={["Positive", "Negative", "Other"]}
            />
          </div>

          {/* Chest X-Ray */}
          <div className="sub-card">
            <h3 className="sub-card-title">Chest X-Ray</h3>
            <InputField
              label="Chest X-Ray"
              name="ChestXRay"
              value={form.ChestXRay}
              onChange={handleChange}
            />
          </div>

          {/* Remarks */}
          <div className="sub-card">
            <h3 className="sub-card-title">Remarks</h3>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Remarks"
              className="remarks-textarea"></textarea>
          </div>
        </section>

        {/* Lab Details */}
        <section className="card lab-details">
          <h2 className="card-title">Lab Details</h2>
          <div className="small-width">
            <InputField
              label="Lab Serial No."
              name="lab_sr_no"
              value={form.lab_sr_no}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Fit Status */}
        <section className="fit-status">
          <div className="bold-red">Client has been found:</div>
          <SelectField
            name="fit_status"
            value={form.fit_status}
            onChange={handleChange}
            options={["FIT", "UNFIT"]}
          />
        </section>

        {/* Submit */}
        <div className="submit-container">
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;
