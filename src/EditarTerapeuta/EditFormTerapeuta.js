
import React from 'react';
import './EditFormTerapeuta.css'
import { Form, Button } from 'react-bootstrap'
import $ from 'jquery';
import firebase from 'firebase'

export default class EditFormTerapeuta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      dni: '',
      date: '',
      gender: 'No especificado',
      location: '',
      seleccionDeTerapeuta: []
    };

    this.desactivado = true;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSurname = this.handleChangeSurname.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeGender = this.handleChangeGender.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
  }

  componentDidMount() {
    let nameRef = firebase.database().ref("terapeutas");
    let arraux = []
    nameRef.on('value', (snapshot) => {
        for (let aux in snapshot.val()) {
            arraux.push({ dni: snapshot.val()[aux].dni, name: snapshot.val()[aux].name + " " + snapshot.val()[aux].surname })
        }
        this.setState({
            seleccionDeTerapeuta: arraux
        })
    })
}

  handleChange(event) {
    this.setState({ dni: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeSurname(event) {
    this.setState({ surname: event.target.value });
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

  handleSubmit(event) {
    let nameRef = firebase.database().ref("terapeutas").child(this.state.dni.toUpperCase()).child('name');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          name: snapshot.val()
        })
        if (snapshot.val())
          this.desactivado = false;
        else
          this.desactivado = true;
      }
    })

    nameRef = firebase.database().ref("terapeutas").child(this.state.dni.toUpperCase()).child('surname');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          surname: snapshot.val()
        })
      }
    })

    nameRef = firebase.database().ref("terapeutas").child(this.state.dni.toUpperCase()).child('date');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          date: snapshot.val()
        })
      }
    })

    nameRef = firebase.database().ref("terapeutas").child(this.state.dni.toUpperCase()).child('gender');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          gender: snapshot.val()
        })
      }
    })

    nameRef = firebase.database().ref("terapeutas").child(this.state.dni.toUpperCase()).child('location');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          location: snapshot.val()
        })
      }
    })

    event.preventDefault();
  }

  refresh() {
    window.location.reload(false);
  }
  handleEdit(event) {
    firebase.database().ref("terapeutas").child(this.state.dni.toUpperCase()).set({
      name: this.state.name,
      surname: this.state.surname,
      dni: this.state.dni.toUpperCase(),
      date: this.state.date,
      location: this.state.location
    });

    alert('Se ha editado el terapeuta con DNI ' + this.state.dni);
    event.preventDefault();

    this.refresh();
  }

  render() {
    return (
      <div>
        <br></br>
        <h1>Editar terapeuta</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="formDNI">
            <Form.Label>DNI del terapeuta</Form.Label>
            <Form.Control as="select" type="text" placeholder="Terapeuta asignado" defaultValue="" required onChange={this.handleChange}>
              <option hidden disabled selected value>-- Seleccione un terapeuta --</option>
              {
                this.state.seleccionDeTerapeuta ? this.state.seleccionDeTerapeuta.map((Terapeuta, i) =>
                  <option value={Terapeuta.dni}>{Terapeuta.name} ({Terapeuta.dni})</option>
                ) : <div></div>
              }
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            Buscar
          </Button>
        </Form>

        <Form onSubmit={this.handleEdit}>
          <Form.Group controlId="formName">
            <Form.Label>Nombre del terapeuta</Form.Label>
            <Form.Control disabled={this.desactivado} type="text" defaultValue={this.state.name} onChange={this.handleChangeName} />

          </Form.Group>

          <Form.Group controlId="formSurname">
            <Form.Label>Apellidos del terapeuta</Form.Label>
            <Form.Control disabled={this.desactivado} type="text" defaultValue={this.state.surname} onChange={this.handleChangeSurname} />
          </Form.Group>

          <Form.Group controlId="formFechaNac">
            <Form.Label>Fecha de nacimiento del terapeuta</Form.Label>
            <Form.Control disabled={this.desactivado} type="date" defaultValue={this.state.date} min="1900-01-01" max={new Date().toISOString().split('T')[0]} onChange={this.handleChangeDate} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Género del terapeuta</Form.Label>
            <Form.Control disabled={this.desactivado} as="select" value={this.state.gender} onChange={this.handleChangeGender} >
              <option>Hombre</option>
              <option>Mujer</option>
              <option>No especificado</option>
            </Form.Control>
            <br />
          </Form.Group>

          <Form.Group controlId="formSurname">
            <Form.Label>Localización del terapeuta</Form.Label>
            <Form.Control disabled={this.desactivado} type="text" defaultValue={this.state.location} onChange={this.handleChangeLocation} />
          </Form.Group>

          <Button disabled={this.desactivado} variant="warning" size="lg" type="submit">
            Editar
          </Button>
        </Form>
        <br></br>
      </div>
    );
  }
}