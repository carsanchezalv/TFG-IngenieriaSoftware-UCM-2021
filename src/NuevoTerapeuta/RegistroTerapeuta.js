import React from 'react';
import './RegistroTerapeuta.css';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';
export default class RegistroTerapeuta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      dni: '',
      date: '',
      gender: 'No especificado',
      location: ''
    };
    this.storage = firebase.storage();

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSurname = this.handleChangeSurname.bind(this);
    this.handleChangeDNI = this.handleChangeDNI.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeGender = this.handleChangeGender.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.validateDNI = this.validateDNI.bind(this);
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeSurname(event) {
    this.setState({ surname: event.target.value });
  }
  handleChangeDNI(event) {
    this.setState({ dni: event.target.value });
  }
  handleChangeDate(event) {
    this.setState({ date: event.target.value });
  }
  handleChangeGender(event) {
    this.setState({ gender: event.target.value });
  }
  handleChangeLocation(event) {
    this.setState({ location: event.target.value });
  }

  validateDNI(dni) {
    let numero, letr, letra;
    let expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    dni = dni.toUpperCase();

    if (expresion_regular_dni.test(dni) === true) {
      numero = dni.substr(0, dni.length - 1);
      numero = numero.replace('X', 0);
      numero = numero.replace('Y', 1);
      numero = numero.replace('Z', 2);
      letr = dni.substr(dni.length - 1, 1);
      numero = numero % 23;
      letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
      letra = letra.substring(numero, numero + 1);

      if (letra !== letr)
        return false;
      else
        return true;
    }
    else
      return false;
  }

  async handleSubmit(event) {

    event.preventDefault();

    if (this.validateDNI(this.state.dni)) {
      await firebase.database().ref("terapeutas").child(this.state.dni.toUpperCase()).set({
        name: this.state.name,
        surname: this.state.surname,
        dni: this.state.dni.toUpperCase(),
        date: this.state.date,
        gender: this.state.gender,
        location: this.state.location
      })
      alert('Se ha dado de alta un nuevo terapeuta con dni: ' + this.state.dni)
      document.getElementById("formTerapeuta").reset()
      this.setState({
        name: '',
      surname: '',
      dni: '',
      date: '',
      gender: 'No especificado',
      location: ''
      })
    }
    else
      alert('El DNI ' + this.state.dni + ' no es válido');
  }

  render() {
    return (
      <div>
        <br></br>
        <h1>Nuevo terapeuta</h1>

        <Form onSubmit={this.handleSubmit} id="formTerapeuta">
          <Form.Group className="formName">
            <Form.Label className="label">Nombre del terapeuta*</Form.Label>
            <Form.Control required type="text" value={this.state.name} placeholder="Nombre" onChange={this.handleChangeName} />
          </Form.Group>

          <Form.Group className="formSurname">
            <Form.Label className="label">Apellidos del terapeuta*</Form.Label>
            <Form.Control required type="text" value={this.state.surname} placeholder="Apellidos" onChange={this.handleChangeSurname} />
          </Form.Group>

          <Form.Group className="formDNI">
            <Form.Label className="label">DNI del terapeuta*</Form.Label>
            <Form.Control type="text" value={this.state.dni} placeholder="DNI" required onChange={this.handleChangeDNI} />
          </Form.Group>

          <Form.Group className="formFechaNac">
            <Form.Label className="label">Fecha de nacimiento del terapeuta*</Form.Label>
            <Form.Control required type="date" value={this.state.date} placeholder="Fecha de nacimiento" min="1900-01-01" max={new Date().toISOString().split('T')[0]} onChange={this.handleChangeDate} />
          </Form.Group>

          <Form.Group className="formGender">
            <Form.Label className="label">Género del terapeuta</Form.Label>
            <Form.Control as="select" onChange={this.handleChangeGender} value={this.state.gender}>
              <option>Hombre</option>
              <option>Mujer</option>
              <option>No especificado</option>
            </Form.Control>
            <br />
          </Form.Group>

          <Form.Group className="formLocation">
            <Form.Label className="label">Localización del terapeuta*</Form.Label>
            <Form.Control required type="text" value={this.state.location} placeholder="Localización (municipio, provincia, región...)" onChange={this.handleChangeLocation} />
          </Form.Group>

          <Button className="submitTerapeuta" variant="primary" type="submit">
            Registrar
          </Button>
        </Form>
        <br></br>
      </div>
    );
  }
}