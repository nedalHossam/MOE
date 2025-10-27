import React from "react";
import ClayIcon from "@clayui/icon";
import { useTranslation } from "../../../../utils/translations";

const MultiStepNav = ({ steps, currentStep, onStepChange, spritemap }) => {
    const { t, direction, currentLanguage } = useTranslation();

    const isRTLFromDirection = direction === "rtl";
    const isRTLFromURL = window.location.pathname.includes("/ar/");
    const isRTLFromLanguage = currentLanguage && currentLanguage.startsWith("ar");
    const isRTLFromHTML = document.documentElement.getAttribute("dir") === "rtl";

    const isRTL = isRTLFromDirection || isRTLFromURL || isRTLFromLanguage || isRTLFromHTML;

    const displaySteps = isRTL ? [...steps].reverse() : steps;
    const displayCurrentStep = isRTL ? steps.length - 1 - currentStep : currentStep;

    return (
        <div className={`multi-step-nav ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
            <div className="multi-step-nav-container">
                {displaySteps.map((step, index) => {
                    const originalIndex = isRTL ? steps.length - 1 - index : index;
                    const isCompleted = isRTL ? originalIndex < currentStep : index < currentStep;

                    return (
                        <div
                            key={originalIndex}
                            className={`multi-step-nav-item ${index === displayCurrentStep ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                            onClick={() => onStepChange(originalIndex)}
                            data-tooltip={step.title}
                            title={step.title}>
                            <div className="multi-step-nav-indicator">
                                {isCompleted ? (
                                    <>
                                        <ClayIcon symbol="check" className="multi-step-nav-check" spritemap={spritemap} />
                                        <span className="multi-step-nav-check-fallback" style={{ display: "none" }}>
                                            ✓
                                        </span>
                                    </>
                                ) : (
                                    <span className="multi-step-nav-number">{originalIndex + 1}</span>
                                )}
                            </div>
                            <div className="multi-step-nav-title">{step.title}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MultiStepNav;
