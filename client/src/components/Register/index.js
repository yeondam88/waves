import React, { Component } from "react";
import Button from "../utils/Button";
import Login from "../Register/Login";

class Register extends Component {
  render() {
    return (
      <div className="page_wrapper">
        <div className="container">
          <div className="register_login_container">
            <div className="left">
              <h1>New Customer</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
                esse, neque dolore ab itaque debitis a laudantium, dolorum nulla
                expedita ullam omnis rerum, consectetur amet eaque voluptatem
                numquam facere iusto!
              </p>
              <Button
                type="default"
                title="Create an account"
                linkTo="/register"
                addStyles={{
                  margin: "10px 0 0 0"
                }}
              />
            </div>
            <div className="right">
              <h2>Registered Customers</h2>
              <p>If you have an account please log in</p>
              <Login />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
