import React from "react";
import ClayForm from "@clayui/form";
import ClayInput from "@clayui/form";
import ClayTextarea from "@clayui/form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CustomLocalizedInput from "../../../../components/ui/CustomLocalizedInput";
import "./FormField.css";

const animatedComponents = makeAnimated();

const FormField = ({
    type = "text",
    label,
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    required = false,
    placeholder,
    disabled = false,
    className = "",
    options = [],
    isLoading = false,
    locales = [],
    selectedLocale,
    onSelectedLocaleChange,
    onTranslationsChange,
    translations = {},
    symbol,
    component = "input",
    rows = 4,
    isMulti = false,
    isClearable = false,
    ...props
}) => {
    const renderField = () => {
        switch (type) {
            case "select":
                return (
                    <Select
                        components={animatedComponents}
                        options={options}
                        value={
                            isMulti
                                ? options.filter((o) => (Array.isArray(value) ? value.includes(o.value) : value === o.value))
                                : options.find((o) => o.value === value) || null
                        }
                        onChange={(opt) => {
                            if (isMulti) {
                                onChange(opt ? opt.map((o) => o.value) : []);
                            } else {
                                onChange(opt ? opt.value : "");
                            }
                        }}
                        className={error ? "has-error" : ""}
                        isLoading={isLoading}
                        isDisabled={disabled || isLoading}
                        placeholder={placeholder}
                        isMulti={isMulti}
                        isClearable={isClearable}
                        {...props}
                    />
                );

            case "localized":
                return (
                    <CustomLocalizedInput
                        id={name}
                        name={name}
                        label={label}
                        locales={locales}
                        selectedLocale={selectedLocale}
                        onSelectedLocaleChange={onSelectedLocaleChange}
                        onTranslationsChange={onTranslationsChange}
                        translations={translations}
                        disabled={disabled}
                        className={error ? "has-error" : ""}
                        placeholder={placeholder}
                        symbol={symbol}
                        component={component}
                        rows={rows}
                        required={required}
                        {...props}
                    />
                );

            case "date":
                return (
                    <div className="date-input-wrapper">
                        <input
                            type="date"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            className={`date-input ${error ? "has-error" : ""}`}
                            placeholder={placeholder}
                            disabled={disabled}
                            {...props}
                        />
                        <span className="date-icon">📅</span>
                    </div>
                );

            case "radio":
                return (
                    <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                        {options.map((option) => (
                            <label key={option.value} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                    type="radio"
                                    name={name}
                                    value={option.value}
                                    checked={value === option.value}
                                    onChange={(e) => onChange(e.target.value)}
                                    disabled={disabled}
                                    {...props}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                );

            case "file":
                return <input type="file" onChange={(e) => onChange(e)} accept={props.accept} disabled={disabled} {...props} />;

            default:
                return (
                    <ClayInput
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        className={error ? "has-error" : ""}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...props}
                    />
                );
        }
    };

    return (
        <ClayForm.Group className={className}>
            {label && type !== "localized" && (
                <label className="form-label">
                    {label}
                    {required && <span className="required-asterisk">*</span>}
                </label>
            )}
            {renderField()}
            {error && <div className="form-error">{error}</div>}
        </ClayForm.Group>
    );
};

export default FormField;
