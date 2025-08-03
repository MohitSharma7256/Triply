import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({
    value,
    onChange,
    placeholder = "Password",
    name = "password",
    autoComplete = "current-password",
}) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const toggleShowPassword = () => setIsShowPassword((prev) => !prev);

    return (
        <div className="flex items-center bg-cyan-600/5 rounded px-5 py-3 mb-4">
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                type={isShowPassword ? "text" : "password"}
                autoComplete={autoComplete}
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 bg-transparent outline-none"
                aria-label={placeholder}
            />
            <button
                type="button"
                onClick={toggleShowPassword}
                className="ml-2 text-primary focus:outline-none"
                aria-label={isShowPassword ? "Hide password" : "Show password"}
            >
                {isShowPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
            </button>
        </div>
    );
};

export default PasswordInput;
