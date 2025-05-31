import React from "react";

const SelectField = ({ label, name, value, onChange, options = [] }) => (
    <div className="flex flex-col mb-4">
        <label className="font-semibold mb-1">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md"
        >
            <option value="">-- Select --</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export default SelectField;
