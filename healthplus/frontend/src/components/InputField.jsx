import React from "react";

const InputField = ({ label, name, value, onChange, type = "text", ...rest }) => (
    <div className="flex flex-col mb-4">
        <label className="font-semibold mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="border border-gray-300 p-2 rounded-md"
            {...rest}
        />
    </div>
);

export default InputField;
