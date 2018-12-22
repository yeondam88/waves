import React from "react";

const FormField = ({ id, formData, change }) => {
  const renderTemplate = () => {
    let formTemplate = null;
    switch (formData.element) {
      case "input":
        formTemplate = (
          <div className="formBlock">
            <input
              {...formData.config}
              value={formData.value}
              onBlur={event => change({ event, id, blur: true })}
              onChange={event => change({ event, id })}
            />
          </div>
        );
        break;
      default:
        formTemplate = null;
    }

    return formTemplate;
  };

  return <div>{renderTemplate()}</div>;
};

export default FormField;
