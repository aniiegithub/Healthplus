import React from "react";

const FileUpload = ({ label, onChange }) => (
    <div className="mb-4">
        <label className="font-semibold">{label}</label>
        <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="mt-2 block"
        />
        {/* <p className="text-sm text-gray-500">Max size: 3MB</p> */}
    </div>
);

export default FileUpload;
