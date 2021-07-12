import React from 'react';
import './AddForm.css';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';
import { LinearProgress, CircularProgress } from '@material-ui/core/';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

export default class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dni: '',
      recuerdo: '',
      recuerdos: [],
      relaciones: [],
      textoRecuerdo: '',
      estadoRecuerdo: '',
      recuerdosAux: [],
      experienciasAux: [],
      nombreRelacion: '',
      tipoRelacion: '',
      emocionRelacion: 'Positiva',
      emocionRecuerdo: 'Positiva',
      fechaExperiencia: 'Infancia',
      fechaRecuerdo: 'Infancia',
      relacionesAux: [],
      urls: [],
      urlsAudios: [],
      urlsVideos: [],
      seleccionDeUsuario: []
    };

    this.storage = firebase.storage();

    this.desactivado = true;
    this.progress = 0;
    this.archivos = 0;
    this.archivosTotales = 0;
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleBuscar = this.handleBuscar.bind(this);
    this.handleChangeTextoRecuerdo = this.handleChangeTextoRecuerdo.bind(this);
    this.handleAnyadirRecuerdo = this.handleAnyadirRecuerdo.bind(this);
    this.handleChangeExperienciasRelacion = this.handleChangeExperienciasRelacion.bind(this);
    this.handleChangeNombreRelacion = this.handleChangeNombreRelacion.bind(this);
    this.handleChangeTipoRelacion = this.handleChangeTipoRelacion.bind(this);
    this.handleChangeEmocionRelacion = this.handleChangeEmocionRelacion.bind(this);
    this.handleAnyadirRelacion = this.handleAnyadirRelacion.bind(this);
    this.handleDeleteRecuerdo = this.handleDeleteRecuerdo.bind(this);
    this.handleDeleteRelacion = this.handleDeleteRelacion.bind(this);
    this.handleAnyadirExperiencia = this.handleAnyadirExperiencia.bind(this);
    this.handleChangeFechaExperiencia = this.handleChangeFechaExperiencia.bind(this);
    this.handleDeleteExperiencia = this.handleDeleteExperiencia.bind(this);
    this.handleChangeFechaRecuerdo = this.handleChangeFechaRecuerdo.bind(this);
    this.handleChangeImagen = this.handleChangeImagen.bind(this);
    this.handleChangeVideo = this.handleChangeVideo.bind(this);
    this.handleChangeAudio = this.handleChangeAudio.bind(this);
    this.handleChangeEstadoRecuerdo = this.handleChangeEstadoRecuerdo.bind(this);
    this.handleChangeEmocionRecuerdo = this.handleChangeEmocionRecuerdo.bind(this);
    this.esMayor = this.esMayor.bind(this);
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

  handleChangeEmocionRecuerdo(e) {
    this.setState({
      emocionRecuerdo: e.target.value
    })
  }

  handleChangeEstadoRecuerdo(e) {
    this.setState({
      estadoRecuerdo: e.target.value
    })
  }

  async handleChangeImagen(e) {
    return new Promise(async (resolve, reject) => {
      if (e.target.files[0]) {
        this.desactivado = true;
        const images = e.target.files;
        this.setState({ images: images });
        this.archivosTotales = images.length
        for (let i = 0; i < images.length; i++) {
          this.archivos = i;
          this.progress = ((i + 1) * 100) / images.length;
          await this.hacerImagenes(images[i]);

        }
        resolve();
      }
      else
        reject("error")
    }).then(response => {
      this.progress = 100;
      console.log(this.state.urls);
      this.desactivado = false;
      this.progress = 0;
      this.archivos = 0;
      this.archivosTotales = 0;
    })
      .catch(error => {
        console.log(error);
      });
  }

  async handleChangeAudio(e) {
    return new Promise(async (resolve, reject) => {
      if (e.target.files[0]) {
        this.desactivado = true;
        const audios = e.target.files;
        this.setState({ audios: audios });
        this.archivosTotales = audios.length
        for (let i = 0; i < audios.length; i++) {
          this.archivos = i;
          this.progress = ((i + 1) * 100) / audios.length;
          await this.hacerAudios(audios[i]);
        }
        resolve();
      }
      else
        reject("error");
    }).then(response => {
      this.progress = 100;
      console.log(this.state.urlsAudios);
      this.desactivado = false;
      this.progress = 0;
      this.archivos = 0;
      this.archivosTotales = 0;
    })
      .catch(error => {
        console.log(error);
      });
  }

  async handleChangeVideo(e) {
    return new Promise(async (resolve, reject) => {
      if (e.target.files[0]) {
        this.desactivado = true;
        const videos = e.target.files;
        this.setState({ videos: videos });
        this.archivosTotales = videos.length
        for (let i = 0; i < videos.length; i++) {
          this.archivos = i;
          this.progress = ((i + 1) * 100) / videos.length;
          await this.hacerVideos(videos[i]);
        }
        resolve();
      }
      else
        reject("error");
    }).then(response => {
      this.progress = 100;
      console.log(this.state.urlsVideos);
      this.desactivado = false;
      this.progress = 0;
      this.archivos = 0;
      this.archivosTotales = 0;
    })
      .catch(error => {
        console.log(error);
      });
  }

  async hacerImagenes(image) {
    return new Promise((resolve) => {
      let arraisito = image.name.split(".");
      let ext = arraisito[arraisito.length - 1].toUpperCase();
      let url = '';

      if (ext === "JPG" || ext === "JPEG" || ext === "PNG" || ext === "BMP") {
        const uploadTask = this.storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            console.log(`${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`);
            if (snapshot.bytesTransferred === snapshot.totalBytes)
              resolve();
          },
          (error) => {
            console.log(error);
          },
          async () => {
            url = await this.storage.ref('images').child(image.name).getDownloadURL();
            let aux = this.state.urls;
            if (aux === null)
              aux = [];
            aux.push(url);
            this.setState({
              urls: aux
            })
          });
      }
      else
        alert("Error al insertar imágenes)")
    });
  }

  async hacerAudios(audio) {
    return new Promise((resolve) => {
      let arraisito = audio.name.split(".");
      let ext = arraisito[arraisito.length - 1].toUpperCase();
      let url = '';

      if (ext === "MP3" || ext === "OGG") {
        const uploadTask = this.storage.ref(`audio/${audio.name}`).put(audio);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            console.log(`${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`);
            if (snapshot.bytesTransferred === snapshot.totalBytes)
              resolve();
          },
          (error) => {
            console.log(error);
          },
          async () => {
            url = await this.storage.ref('audio').child(audio.name).getDownloadURL();
            let aux = this.state.urlsAudios;
            if (aux === null)
              aux = [];
            aux.push(url);
            this.setState({
              urlsAudios: aux
            })
          });
      }
      else
        alert("Error al insertar audios")
    });
  }

  async hacerVideos(video) {
    return new Promise((resolve) => {
      let arraisito = video.name.split(".");
      let ext = arraisito[arraisito.length - 1].toUpperCase();
      let url = '';

      if (ext === "MP4" || ext === "AVI" || ext === "MKV" || ext === "FLV" || ext === "MOV" || ext === "WMV" || ext === "MPEG") {
        const uploadTask = this.storage.ref(`video/${video.name}`).put(video);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            console.log(`${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`);
            if (snapshot.bytesTransferred === snapshot.totalBytes)
              resolve();
          },
          (error) => {
            console.log(error);
          },
          async () => {
            url = await this.storage.ref('video').child(video.name).getDownloadURL();
            let aux = this.state.urlsVideos;
            if (aux === null)
              aux = [];
            aux.push(url);
            this.setState({
              urlsVideos: aux
            })
          });
      }
      else
        alert("Error al insertar vídeos")
    });
  }

  handleChangeFechaRecuerdo(event) {
    this.setState({
      fechaRecuerdo: event.target.value
    })
  }

  handleDeleteRecuerdo(event, i) {
    let tamOriginal = this.state.recuerdos.length - this.state.recuerdosAux.length
    let arraux = this.state.recuerdosAux;
    let arrauxRecuerdos = this.state.recuerdos;
    arraux.splice(i, 1);
    arrauxRecuerdos.splice(i + tamOriginal, 1)
    this.setState({
      recuerdosAux: arraux,
      recuerdos: arrauxRecuerdos
    })
  }

  handleDeleteRelacion(event, i) {
    let tamOriginal = this.state.relaciones.length - this.state.relacionesAux.length
    let arraux = this.state.relacionesAux;
    let arrauxRelaciones = this.state.relaciones;
    arraux.splice(i, 1);
    arrauxRelaciones.splice(i + tamOriginal, 1)
    this.setState({
      relacionesAux: arraux,
      relaciones: arrauxRelaciones
    })
  }

  handleDeleteExperiencia(event, i) {
    let arraux = this.state.experienciasAux;
    arraux.splice(i, 1);
    this.setState({
      experienciasAux: arraux,
    })
  }

  handleChangeTextoRecuerdo(event) {
    this.setState({
      textoRecuerdo: event.target.value
    })
  }

  handleChangeTipoRelacion(event) {
    this.setState({
      tipoRelacion: event.target.value
    })
  }

  handleChangeEmocionRelacion(event) {
    this.setState({
      emocionRelacion: event.target.value
    })
  }

  handleChangeExperienciasRelacion(event) {
    this.setState({
      experienciaRelacion: event.target.value
    })
  }

  handleChangeFechaExperiencia(event) {
    this.setState({
      fechaExperiencia: event.target.value
    })
  }

  handleChangeNombreRelacion(event) {
    this.setState({
      nombreRelacion: event.target.value
    })
  }

  handleChange(event) {
    this.setState({ dni: event.target.value });
  }

  handleAnyadirRelacion(event) {
    if (this.state.nombreRelacion !== '' && this.state.tipoRelacion !== '') {
      let arraux = this.state.relaciones;
      let arraux2 = this.state.relacionesAux;

      if (arraux === null)
        arraux = [];
      if (arraux2 === null)
        arraux2 = [];

      arraux.push({ nombre: this.state.nombreRelacion, tipo: this.state.tipoRelacion, experiencias: this.state.experienciasAux });
      arraux2.push({ nombre: this.state.nombreRelacion, tipo: this.state.tipoRelacion, experiencias: this.state.experienciasAux });

      this.setState({
        relaciones: arraux,
        relacionesAux: arraux2,
        nombreRelacion: '',
        tipoRelacion: '',
        experienciaRelacion: '',
        emocionRelacion: 'Positiva',
        fechaExperiencia: 'Infancia',
        experienciasAux: []
      })
      document.getElementById("formRelaciones").reset();
      alert("Confirme sus cambios pulsando el botón [Registrar Datos] en la  parte inferior de la pantalla");
    }
  }

  handleAnyadirRecuerdo(event) {
    if (this.state.textoRecuerdo !== '' && this.state.fechaRecuerdo !== '' && this.state.estadoRecuerdo !== '') {
      let arraux = this.state.recuerdos;
      let arraux2 = this.state.recuerdosAux;

      if (arraux === null)
        arraux = []
      if (arraux2 === null)
        arraux2 = []

      arraux.push({ texto: this.state.textoRecuerdo, fecha: this.state.fechaRecuerdo, estado: this.state.estadoRecuerdo, emocion: this.state.emocionRecuerdo });
      arraux2.push({ texto: this.state.textoRecuerdo, fecha: this.state.fechaRecuerdo, estado: this.state.estadoRecuerdo, emocion: this.state.emocionRecuerdo });

      this.setState({
        recuerdos: arraux,
        recuerdosAux: arraux2,
        textoRecuerdo: '',
        estadoRecuerdo: '',
        emocionRecuerdo: 'Positiva',
        fechaRecuerdo: 'Infancia',
        urls: [],
        urlsAudios: [],
        urlsVideos: []
      })
      document.getElementById("formRecuerdos").reset();
      alert("Confirme sus cambios pulsando el botón [Registrar Datos] en la  parte inferior de la pantalla")
    }
  }

  esMayor(fecha1, fecha2) {
    switch (fecha2) {
      case "Infancia":
        if(fecha1 === "Infancia")
          return false;
        else
          return true;
      case "Adolescencia":
        if(fecha1 === "Infancia" || fecha1 === "Adolescencia")
          return false;
        else
          return true;
      case "Vida adulta joven":
        if(fecha1 === "Infancia" || fecha1 === "Adolescencia" || fecha1 === "Vida adulta joven")
          return false;
        else
          return true;
      case "Vida adulta madura":
        if(fecha1 === "Infancia" || fecha1 === "Adolescencia" || fecha1 === "Vida adulta joven" || fecha1 === "Vida adulta madura")
          return false;
        else
          return true;
        default:
          return true;
    }
  }

  handleAnyadirExperiencia(event) {
    if (this.state.nombreRelacion !== '' && this.state.tipoRelacion !== '' && this.state.experienciaRelacion !== '' && this.state.fechaExperiencia !== '' && this.state.emocionRelacion !== '') {
      let arraux = this.state.experienciasAux;
      if (arraux === null)
        arraux = [];

      let encontrado = false;
      let pos = -1;
      let i = 0;
      while (!encontrado && i < arraux.length) {
        if (this.esMayor(arraux[i].fecha, this.state.fechaExperiencia)) {
          encontrado = true;
          pos = i;
        }
        else
          ++i;
      }
      if (encontrado) {
        let arraux1 = arraux.slice(0, pos);
        let arraux2 = arraux.slice(pos, arraux.length + 1);
        arraux1.push({ texto: this.state.experienciaRelacion, fecha: this.state.fechaExperiencia, emocion: this.state.emocionRelacion, urls: this.state.urls, urlsAudios: this.state.urlsAudios, urlsVideos: this.state.urlsVideos });
        arraux = arraux1.concat(arraux2);
      }
      else
        arraux.push({ texto: this.state.experienciaRelacion, fecha: this.state.fechaExperiencia, emocion: this.state.emocionRelacion, urls: this.state.urls, urlsAudios: this.state.urlsAudios, urlsVideos: this.state.urlsVideos });

      this.setState({
        experienciasAux: arraux,
        experienciaRelacion: '',
        emocionRelacion: 'Positiva',
        fechaExperiencia: 'Infancia',
        urls: [],
        urlsAudios: [],
        urlsVideos: []
      })

      document.getElementById("formExperiencia").reset();
    }
  }

  handleAdd(event) {

    firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
      recuerdos: this.state.recuerdos,
      relaciones: this.state.relaciones,
    });

    alert('Se ha añadido información del usuario con DNI ' + this.state.dni);
    event.preventDefault();

    this.refresh();
  }

  handleBuscar(event) {
    let nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('name');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.desactivado = false;
      }
    })

    nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('recuerdos');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          recuerdos: snapshot.val()
        })
      }
    })

    nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('relaciones');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          relaciones: snapshot.val()
        })
      }
    })

    event.preventDefault();
  }

  refresh() {
    window.location.reload(false);
  }

  render() {
    return (
      <div>
        <br></br>
        <h1>Información adicional</h1>
        <div>
          <Form onSubmit={this.handleBuscar}>
            <Form.Group controlId="formDNI">
              <Form.Label>DNI del usuario</Form.Label>
              <Form.Control as="select" type="text" placeholder="DNI" defaultValue="" onChange={this.handleChange}>
                <option hidden disabled selected value>-- Seleccione un usuario --</option>
                {
                  this.state.seleccionDeUsuario ? this.state.seleccionDeUsuario.map((usuario, i) =>
                    <option value={usuario.dni}>{usuario.name} ({usuario.dni})</option>
                  ) : <div></div>
                }
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Buscar
            </Button>
          </Form>
          <br></br>
          <h1><b>Relaciones sociales del usuario</b></h1>
          <Form onSubmit={this.handleAdd} id="formRelaciones">
            <Form.Group className="formNombreRelacion">
              <Form.Label className="label">Nombre completo del allegado del usuario</Form.Label>
              <Form.Control disabled={this.desactivado} className="inputNombreRelacion" type="text" placeholder="Añada un nuevo familiar, amigo, mascota..." onChange={this.handleChangeNombreRelacion} />
            </Form.Group>

            <Form.Group className="formTipoRelacion">
              <Form.Label className="label">Tipo de relación establecida</Form.Label>
              <Form.Control disabled={this.desactivado} className="inputTipoRelacion" type="text" placeholder="¿Qué tipo de relación tienen? (amigo/a, pareja, padre, madre, perro, gato...)" onChange={this.handleChangeTipoRelacion} />
            </Form.Group>

            <Form id="formExperiencia">
              <Form.Group className="formEmocion">
                <Form.Label className="label">Tipo de emoción para esta experiencia</Form.Label>
                <Form.Control disabled={this.desactivado} as="select" className="inputEmocionRelacion" onChange={this.handleChangeEmocionRelacion}>
                  <option>Positiva</option>
                  <option>Neutral</option>
                  <option>Negativa</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="formExperienciaRelacion">
                <Form.Label className="label">Experiencia vivida con este allegado</Form.Label>
                <Form.Control disabled={this.desactivado} className="inputExperienciaRelacion" type="text" placeholder="Jugábamos juntos al fútbol, dábamos paseos por Madrid..." onChange={this.handleChangeExperienciasRelacion} />
              </Form.Group>

              <Form.Group className="formFecha">
                <Form.Label className="label">Etapa de vida</Form.Label>
                <Form.Control as="select" disabled={this.desactivado} placeholder="Selecciona la etapa vida del usuario a la que pertenece este suceso" onChange={this.handleChangeFechaExperiencia} value={this.state.fechaExperiencia}>
                  <option>Infancia</option>
                  <option>Adolescencia</option>
                  <option>Vida adulta joven</option>
                  <option>Vida adulta madura</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="form-group-lenght">
                <Form.File
                  className="position-relative label"
                  disabled={this.desactivado}
                  name="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.bmp"
                  label="Imágenes"
                  onChange={this.handleChangeImagen}
                  id="validationFormik107"
                  feedbackTooltip
                />
              </Form.Group>

              <Form.Group className="form-group-lenght">
                <Form.File
                  className="position-relative label"
                  disabled={this.desactivado}
                  name="file"
                  multiple
                  accept=".mp3,.ogg"
                  label="Audios"
                  onChange={this.handleChangeAudio}
                  id="validationFormik107"
                  feedbackTooltip
                />
              </Form.Group>

              <Form.Group className="form-group-lenght">
                <Form.File
                  className="position-relative label"
                  disabled={this.desactivado}
                  name="file"
                  multiple
                  accept=".mp4,.avi,.MPEG,.mkv,.flv,.mov,.wmv"
                  label="Vídeos"
                  onChange={this.handleChangeVideo}
                  id="validationFormik107"
                  feedbackTooltip
                />
              </Form.Group>

              {this.progress !== 0 ? <div><br></br><br></br></div> : console.log("el progreso es 0 bro")}

              {this.progress !== 0 ? <LinearProgress variant="determinate" value={this.progress} /> : console.log("el progreso es 0 bro")}

              {this.progress !== 0 ? <div><br></br><br></br></div> : console.log("el progreso es 0 bro")}

              {this.progress !== 0 ? <CircularProgress value={this.progress} /> : console.log("el progreso es 0 bro")}
              {this.progress !== 0 ? <CircularProgress color="secondary" value={this.progress} /> : console.log("el progreso es 0 bro")}

              <br></br>

              {this.progress !== 0 ? <p>{this.archivos} archivos transferidos de {this.archivosTotales} archivos totales. </p> : console.log("el progreso es 0 bro")}

              <Button variant="secondary" disabled={this.desactivado} className="botonAnyadirExperiencia" onClick={this.handleAnyadirExperiencia}>
                Añadir una experiencia con este allegado
              </Button>
            </Form>
            <div className="listaRelacion">
              {this.state.experienciasAux ? this.state.experienciasAux.map((exp, i) =>
                <div class="unaRelacion">
                  <div className="emocionRelacion">
                    Emocion relación: {exp.emocion}
                  </div>
                  <div className="experienciaRelacion">
                    Experiencia relación: {exp.texto}
                  </div>
                  <div className="fechaExp">
                    Fecha suceso: {exp.fecha}
                  </div>
                  <Button variant="danger" size="lg" onClick={(event) => this.handleDeleteExperiencia(event, i)}>
                    Eliminar
                  </Button>
                </div>
              ) : console.log("adios")}
            </div>
            <hr></hr>
            <Button variant="primary" disabled={this.desactivado} className="botonAnyadirRelacion" onClick={this.handleAnyadirRelacion}>
              Añadir relación
            </Button>
            <br></br>
            <div className="listaRelacion">
              {this.state.relacionesAux ? this.state.relacionesAux.map((relacion, i) =>
                <div class="unaRelacion">
                  <div className="nombreRelacion">
                    {relacion.nombre}
                  </div>
                  <div className="tipoRelacion">
                    Tipo relación: {relacion.tipo}
                  </div>
                  <div className="emocionRelacion">
                    Número de experiencias: {relacion.experiencias.length}
                  </div>
                  <Button variant="danger" size="lg" onClick={(event) => this.handleDeleteRelacion(event, i)}>
                    Eliminar
                  </Button>
                </div>
              ) : console.log("adios")}
            </div>
            <br></br>
          </Form>
        </div>
        <div>
          <br></br><br></br>
          <h1><b>Recuerdos del usuario</b></h1>
          <Form onSubmit={this.handleAdd} id="formRecuerdos">

            <Form.Group className="formTextoRecuerdo">
              <Form.Label className="label">Recuerdo</Form.Label>
              <Form.Control disabled={this.desactivado} className="inputTextoRecuerdo" type="text" placeholder="Recuerdo" onChange={this.handleChangeTextoRecuerdo} />
            </Form.Group>

            <Form.Group className="formFecha">
              <Form.Label className="label">Etapa de vida</Form.Label>
              <Form.Control as="select" disabled={this.desactivado} placeholder="Selecciona la etapa vida del usuario a la que pertenece este recuerdo" onChange={this.handleChangeFechaRecuerdo} value={this.state.fechaRecuerdo}>
                <option>Infancia</option>
                <option>Adolescencia</option>
                <option>Vida adulta joven</option>
                <option>Vida adulta madura</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="formEmocion">
              <Form.Label className="label">Tipo de emoción para este recuerdo</Form.Label>
              <Form.Control disabled={this.desactivado} as="select" className="inputEmocionRelacion" onChange={this.handleChangeEmocionRecuerdo} value={this.state.emocionRecuerdo}>
                <option>Positiva</option>
                <option>Neutral</option>
                <option>Negativa</option>
              </Form.Control>
            </Form.Group>

            <div className="PerdidaRecuerdo">
              <h3>Estado del recuerdo</h3>
              <div className="valorPerdidaRecuerdo">
                <FormControl>
                  <FormControl disabled={this.desactivado} component="fieldset">
                    <RadioGroup row value={this.state.estadoRecuerdo} onChange={this.handleChangeEstadoRecuerdo} >
                      <FormControlLabel value="Recuerdo completo" control={<Radio />} label="Recuerdo completo" />
                      <FormControlLabel value="Recuerdo parcial sin pistas" control={<Radio />} label="Recuerdo parcial sin pistas" />
                      <FormControlLabel value="Recuerdo parcial con pistas" control={<Radio />} label="Recuerdo parcial con pistas" />
                      <FormControlLabel value="Recuerdo perdido" control={<Radio />} label="Recuerdo perdido" />
                    </RadioGroup>
                  </FormControl>
                </FormControl>
              </div>
            </div>

            <Button disabled={this.desactivado} className="botonAnyadirRecuerdo" onClick={this.handleAnyadirRecuerdo}>
              Añadir un recuerdo
            </Button>
            <br></br>
            <div className="listaRecuerdo">
              {this.state.recuerdosAux ? this.state.recuerdosAux.map((recuerdo, i) =>
                <div class="unRecuerdo">
                  <div className="textoRecuerdo">
                    Recuerdo: {recuerdo.texto}
                  </div>
                  <div className="fechaRecuerdo">
                    Fecha: {recuerdo.fecha}
                  </div>
                  <div className="fechaRecuerdo">
                    Emoción: {recuerdo.emocion}
                  </div>
                  <div className="estadoRecuerdo">
                    Estado: {recuerdo.estado}
                  </div>
                  <Button variant="danger" size="lg" onClick={(event) => this.handleDeleteRecuerdo(event, i)}>
                    Eliminar
                  </Button>
                </div>
              ) : console.log("adios")}
            </div>
            <br></br>
            <Button disabled={this.desactivado} className="submitUsuario" variant="primary" type="submit">
              Registrar datos
            </Button>
          </Form>
        </div>
        <br></br>
      </div>
    );
  }
}