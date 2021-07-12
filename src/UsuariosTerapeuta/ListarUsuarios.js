import React from 'react';
import './ListarUsuarios.css'
import { Form, Button } from 'react-bootstrap'
import firebase from 'firebase'

export default class ListarUsuarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      dni: '',
      terapeuta: '',
      usuariosPorTerapeuta: [],
      seleccionDeTerapeuta: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.terapeuta = false;
    this.desactivado = true;
  }

  componentDidMount() {
    let nameRef = firebase.database().ref("terapeutas");
    let arraux = [];
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
    this.terapeuta = true;
    this.setState({ terapeuta: event.target.value });
  }

  handleSubmit(event) {
    let nameRef = firebase.database().ref("usuarios");
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        let usuariosAux = [];
        let todo = snapshot;
        this.desactivado = !this.terapeuta;

        todo.forEach(aux => {
          let terapeutaTmp = aux.val().terapeuta;
          if (terapeutaTmp === this.state.terapeuta) {
            usuariosAux.push({
              dni: aux.val().dni,
              nombre: aux.val().name,
              surname: aux.val().surname
            });
          }
        })
        this.setState({
          usuariosPorTerapeuta: usuariosAux
        })
      }
    })
    event.preventDefault();
  }

  render() {

    return (
      <div>
        <br></br>
        <h1>Usuarios de terapeuta</h1>
        <div className="form-image">
          <div className="search-form">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formDNI">
                <Form.Label className="black">DNI del terapeuta</Form.Label>
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

            <br></br><br></br>

            {(!this.desactivado && this.state.usuariosPorTerapeuta.length > 0) ? this.state.usuariosPorTerapeuta.map((usuario) =>
              <div className="recuadroUsuarios">
                <h4 className="usuario"><b>DNI: </b>{usuario.dni}</h4>
                <h4 className="usuario"><b>Nombre completo: </b>{usuario.nombre} {usuario.surname}</h4>
              </div>              
            ) : !this.desactivado ? <div className="recuadroUsuarios">
              <h4 className="usuario">No se han introducido usuarios de este terapeuta</h4>
              </div>
              : console.log("Sin DNI")
            }
          </div>
        </div>
        <br></br>
      </div>
    );
  }
}