import React, { Component } from "react";
import history from './../history';
import "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="App-header">
          <div>
            <p id="titulo">
              Sistema de asistencia para cuidados <br></br> de enfermos de Alzheimer
            </p>
          </div>
        </div>
      </div>
    );
  }
}