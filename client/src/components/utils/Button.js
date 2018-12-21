import React from "react";
import { Link } from "react-router-dom";

const Button = props => {
  const buttons = props => {
    let template = "";
    switch (props.type) {
      case "default":
        template = (
          <Link to={props.linkTo} className="link_default" {...props.addStyles}>
            {props.title}
          </Link>
        );
        break;
      default:
        template = "";
    }

    return template;
  };

  return <div className="my_link">{buttons(props)}</div>;
};

export default Button;
