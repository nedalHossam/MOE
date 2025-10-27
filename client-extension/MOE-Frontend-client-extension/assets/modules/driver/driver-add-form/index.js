import React from "react";
import ReactDOM from "react-dom";
import DriverAddFormRefactored from "../DriverAddFormRefactored";

// This file now uses the refactored component

class CustomElement extends HTMLElement {
    connectedCallback() {
        ReactDOM.render(
            <React.StrictMode>
                <DriverAddFormRefactored />
            </React.StrictMode>,
            this
        );
    }

    disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this);
    }
}

const ELEMENT_NAME = "driver-add-form-reactjs";
if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, CustomElement);
}
