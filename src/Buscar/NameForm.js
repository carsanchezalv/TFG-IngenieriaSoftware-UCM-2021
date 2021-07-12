import React from 'react';
import './NameForm.css'
import { Form, Button } from 'react-bootstrap'
import firebase from 'firebase'
export default class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      dni: '',
      date: '',
      death: '',
      gender: '',
      residencia: '',
      tipoResidencia: '',
      recuerdos: [],
      numRecuerdos: 0,
      urls: [],
      url: 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg',
      urlsAudios: [],
      urlsVideos: [],
      caracteristicas: {
        nationality: ''
      },
      relaciones: [],
      seleccionDeUsuario: [],
      terapeuta: '',
      edad: ''
    };
    this.activo = false;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.calculateAge = this.calculateAge.bind(this);
  }

  componentDidMount() {
    let nameRef = firebase.database().ref("usuarios");
    let arraux = []
    nameRef.on('value', (snapshot) => {
      for (let aux in snapshot.val()) {
        arraux.push({ dni: snapshot.val()[aux].dni, name: snapshot.val()[aux].name + " " + snapshot.val()[aux].surname })
      }
      this.setState({
        seleccionDeUsuario: arraux
      })
    })
  }

  calculateAge(date) { // birthday is a date
    let birthday = Date.parse(date)
    let ageDifMs = Date.now() - birthday;
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  handleChange(event) {
    this.setState({ dni: event.target.value });
  }

  handleSubmit(event) {

    let nameRef = firebase.database().ref("usuarios").child(this.state.dni);
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.activo = true;
        this.setState({
          name: snapshot.val().name,
          surname: snapshot.val().surname,
          date: snapshot.val().date,
          edad: this.calculateAge(snapshot.val().date),
          death: snapshot.val().death,
          gender: snapshot.val().gender,
          caracteristicas: snapshot.val().caracteristicas,
          recuerdos: snapshot.val().recuerdos,
          urls: snapshot.val().urls,
          urlsAudios: snapshot.val().urlsAudios,
          urlsVideos: snapshot.val().urlsVideos,
          relaciones: snapshot.val().relaciones,
          terapeuta: snapshot.val().terapeuta,
          residencia: snapshot.val().residencia,
          tipoResidencia: snapshot.val().tipoResidencia,
        })
      }
    })

    event.preventDefault();
  }

  handleDelete(event) {
    firebase.database().ref("usuarios").child(this.state.dni).remove();
    window.location.href = window.location.href;
    event.preventDefault();
  }

  render() {

    return (
      <div>
        <br></br>
        <h1>Buscar usuario</h1>
        <Form>
          <Form.Group controlId="formDNI">
            <Form.Label className="black">Usuario</Form.Label>
            <Form.Control as="select" type="text" placeholder="DNI" defaultValue="" onChange={this.handleChange}>
              <option hidden disabled selected value>-- Seleccione un usuario --</option>
              {
                this.state.seleccionDeUsuario ? this.state.seleccionDeUsuario.map((usuario, i) =>
                  <option value={usuario.dni}>{usuario.name} ({usuario.dni})</option>
                ) : <div></div>
              }
            </Form.Control>
          </Form.Group>

          <Button variant="primary" onClick={this.handleSubmit}>
            Buscar
          </Button>
        </Form>

        {this.activo ?
          <div>
            <div className="form-image">
              <div className="search-form">

                <table>
                  <tr>
                    <th>Nombre</th>
                    <td>{this.state.name}</td>
                  </tr>
                  <hr></hr>
                  <tr>
                    <th>Apellidos</th>
                    <td>{this.state.surname}</td>
                  </tr>
                  <hr></hr>
                  <tr>
                    <th>Edad</th>
                    <td>{this.state.edad}</td>
                  </tr>
                  <hr></hr>

                  {this.state.death ? <tr>
                    <th>Fecha de fallecimiento</th>
                    <td>{this.state.death}</td>
                  </tr> : <div></div>}

                  {this.state.death ? <hr></hr>: <div></div>}
                  
                  <tr>
                    <th>Género</th>
                    <td>{this.state.gender}</td>
                  </tr>
                  <hr></hr>
                  <tr>
                    <th>Lugar de residencia</th>
                    <td>{this.state.residencia}</td>
                  </tr>
                  <hr></hr>
                  <tr>
                    <th>Tipo de residencia</th>
                    <td>{this.state.tipoResidencia}</td>
                  </tr>
                  <hr></hr>
                  <tr>
                    <th>País de procedencia</th>
                    <td>{this.state.caracteristicas.nationality}</td>
                  </tr>
                  <hr></hr>
                  <tr>
                    <th>DNI terapeuta asociado</th>
                    <td>{this.state.terapeuta}</td>
                  </tr>
                  <hr></hr>
                </table>
              </div>
            </div>
            <br></br>

            <div className="recuerdos">
              <h2><b>Recuerdos</b></h2>
              <div className="recuerdosMostrar">
                {this.state.recuerdos ? this.state.recuerdos.map((recuerdo) =>
                  <div className="recuadroRecuerdos">
                    <h4 className="recuerdoh4">{recuerdo.texto}</h4>
                    <h4 className="recuerdoh4"><b>Estado del recuerdo:</b> {recuerdo.estado}</h4>
                    <h4 className="recuerdoh4"><b>Etapa del recuerdo:</b> {recuerdo.fecha}</h4>
                    <h4 className="recuerdoh4"><b>Emoción del recuerdo:</b> {recuerdo.emocion}</h4>
                  </div>
                ) : <div className="recuadroRecuerdos">
                  <h4 className="recuerdoh4">No se han introducido recuerdos de este usuario</h4>
                </div>}
              </div>
            </div>

            <br></br><br></br>
            <div className="imagenes">
              <h2><b>Imágenes</b></h2>
              <div className="imagenesMostrar">
                {this.state.urls ? this.state.urls.map((unaUrl) =>
                  <div className="recuadroImagnes">
                    <img classsName="unaimagen profile_img" src={unaUrl} alt=""></img>
                  </div>
                ) : <div className="recuadroRecuerdos">
                <h4 className="recuerdoh4">No se han introducido imágenes de este usuario</h4>
              </div>}
              </div>
            </div>

            <br></br><br></br>
            <div className="audios">
              <h2><b>Audios</b></h2>
              <div className="audiosMostrar">
                {this.state.urlsAudios ? this.state.urlsAudios.map((unaUrl) =>
                  <div className="recuadroAudios">
                    <audio controls src={unaUrl} className="profile_audio">
                      En este momento la aplicación no recuerda esta melodía. Por favor, inténtelo de nuevo más adelante. Un saludo. Gracias.
                    </audio>
                  </div>
                ) : <div className="recuadroRecuerdos">
                <h4 className="recuerdoh4">No se han introducido Audios de este usuario</h4>
              </div>}
              </div>
            </div>
                  <br></br><br></br>
            <div className="videos">
              <h2><b>Vídeos</b></h2>
              <div className="videosMostrar">
                {this.state.urlsVideos ? this.state.urlsVideos.map((unaUrl) =>
                  <div className="recuadroVideos">
                    <video controls src={unaUrl} className="profile_video video">
                      En este momento la aplicación no recuerda este vídeo. Por favor, inténtelo de nuevo más adelante. Un saludo. Gracias.
                    </video>
                  </div>
                ) : <div className="recuadroRecuerdos">
                <h4 className="recuerdoh4">No se han introducido Vídeos de este usuario</h4>
              </div>}
              </div>
            </div>

            <br></br><br></br>
            <form className="formRelaciones">
              <div className="relaciones">
                <h2><b>Relaciones</b></h2>
                <div className="relacionesMostrar">
                  {this.state.relaciones ? this.state.relaciones.map((rel) =>
                    <div className="recuadroRelacion">
                      <h4 className="relacionh4">Nombre: {rel.nombre}</h4>
                      <h4 className="relacionh4">Tipo relación: {rel.tipo}</h4>
                      {rel.experiencias ? <h4 className="relacionh4">Número de experiencias: {rel.experiencias.length}</h4> : <div></div>}
                      {
                        rel.experiencias ? rel.experiencias.map((exp) =>
                          <div className="recuadroExperiencias">
                            <h4>Emocion: {exp.emocion}</h4>
                            <h4>Experiencia: {exp.texto}</h4>
                            <h4>Fecha: {exp.fecha}</h4>
                            <div className="imagenesMostrar">
                              {
                                exp.urls ? exp.urls.map((unaurl) =>
                                  <div className="recuadroImagnes">
                                    <img classsName="unaimagen profile_img" src={unaurl} alt=""></img>
                                  </div>
                                ) : console.log("no hay imagenes para esta experiencia")
                              }
                            </div>
                            <div className="AudiosMostrar">
                              {
                                exp.urlsAudios ? exp.urlsAudios.map((unaurl) =>
                                  <div className="recuadroAudios">
                                    <audio controls classsName="unAudio profile_audio" src={unaurl} alt=""></audio>
                                  </div>
                                ) : console.log("no hay audios para esta experiencia")
                              }
                            </div>
                            <div className="VideosMostrar">
                              {
                                exp.urlsVideos ? exp.urlsVideos.map((unaurl) =>
                                  <div className="recuadroVideos">
                                    <video controls classsName="unVideo profile_video" src={unaurl} alt=""></video>
                                  </div>
                                ) : console.log("no hay videos para esta experiencia")
                              }
                            </div>
                          </div>
                        ) : console.log("no hay experiencias")
                      }
                      <hr></hr><hr></hr>
                    </div>

                  ) : <div className="recuadroRecuerdos">
                  <h4 className="recuerdoh4">No se han introducido Relaciones de este usuario</h4>
                </div>}
                </div>
              </div>
            </form>

            <div className="eliminar">
              <Button variant="danger" size="lg" onClick={this.handleDelete.bind(this)}>
                Eliminar
              </Button>
            </div>
          <br></br>
          </div>
          : console.log("no activo")}
      </div>
    );
  }
}