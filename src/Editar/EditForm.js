
import React from 'react';
import './EditForm.css'
import { Form, Button } from 'react-bootstrap'
import firebase from 'firebase'
import { LinearProgress, CircularProgress } from '@material-ui/core/';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

export default class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      dni: '',
      date: '',
      residencia: '',
      tipoResidencia: '',
      death: '',
      gender: 'No especificado',
      recuerdo: '',
      image: null,
      url: '',
      progress: 0,
      recuerdos: [],
      images: [],
      urls: [],
      audios: [],
      urlsAudios: [],
      urlsVideos: [],
      caracteristicas: {
        nationality: ''
      },
      relaciones: [],
      terapeuta: '',
      terapeutaAux: '',
      seleccionDeUsuario: [],
      seleccionDeTerapeuta: []
    };
    this.storage = firebase.storage();

    //this.options = [];
    this.progress = 0;
    this.archivos = 0;
    this.archivosTotales = 0;
    this.desactivado = true;
    this.activo = false;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSurname = this.handleChangeSurname.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeGender = this.handleChangeGender.bind(this);
    this.handleChangeTerapeuta = this.handleChangeTerapeuta.bind(this);
    this.handleEliminarRelacion = this.handleEliminarRelacion.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleChangeNombreRelacion = this.handleChangeNombreRelacion.bind(this);
    this.handleChangeTipoRelacion = this.handleChangeTipoRelacion.bind(this);
    this.handleChangeTextoRecuerdo = this.handleChangeTextoRecuerdo.bind(this);
    this.handleEliminarRecuerdo = this.handleEliminarRecuerdo.bind(this);
    this.handleDeleteImagen = this.handleDeleteImagen.bind(this);
    this.handleDeleteAudio = this.handleDeleteAudio.bind(this);
    this.handleDeleteVideo = this.handleDeleteVideo.bind(this);
    this.handleChangeImagen = this.handleChangeImagen.bind(this);
    this.handleChangeVideo = this.handleChangeVideo.bind(this);
    this.handleChangeAudio = this.handleChangeAudio.bind(this);
    this.handleChangeEmocionExperiencia = this.handleChangeEmocionExperiencia.bind(this);
    this.handleChangeTextoExperiencia = this.handleChangeTextoExperiencia.bind(this);
    this.handleChangeFechaExperiencia = this.handleChangeFechaExperiencia.bind(this);
    this.handleEliminarExperiencia = this.handleEliminarExperiencia.bind(this);
    this.handleEliminarImagenExperiencia = this.handleEliminarImagenExperiencia.bind(this);
    this.handleEliminarAudioExperiencia = this.handleEliminarAudioExperiencia.bind(this);
    this.handleEliminarVideoExperiencia = this.handleEliminarVideoExperiencia.bind(this);
    this.handleChangeEstadoRecuerdo = this.handleChangeEstadoRecuerdo.bind(this);
    this.handleChangeNationality = this.handleChangeNationality.bind(this);
    this.handleChangeResidencia = this.handleChangeResidencia.bind(this);
    this.handleChangeTipoResidencia = this.handleChangeTipoResidencia.bind(this);
    this.calculateAge = this.calculateAge.bind(this);
    this.handleChangeEmocionRecuerdo = this.handleChangeEmocionRecuerdo.bind(this);
    this.handleChangeDeath = this.handleChangeDeath.bind(this);
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

  handleChangeNationality(e) {
    let caracs = this.state.caracteristicas
    caracs.nationality = e.target.value
    this.setState({
      caracteristicas: caracs
    })
  }

  handleChangeEstadoRecuerdo(e, i) {
    let arraux = this.state.recuerdos;
    arraux[i].estado = e.target.value;
    this.setState({
      recuerdos: arraux
    })
  }

  handleEliminarImagenExperiencia(e, i, j, k) {
    let arraux = this.state.relaciones;
    arraux[i].experiencias[j].urls.splice(k, 1);
    this.setState({
      relaciones: arraux
    })
  }

  handleEliminarAudioExperiencia(e, i, j, k) {
    let arraux = this.state.relaciones;
    arraux[i].experiencias[j].urlsAudios.splice(k, 1);
    this.setState({
      relaciones: arraux
    })
  }

  handleEliminarVideoExperiencia(e, i, j, k) {
    let arraux = this.state.relaciones;
    arraux[i].experiencias[j].urlsVideos.splice(k, 1);
    this.setState({
      relaciones: arraux
    })
  }

  handleEliminarExperiencia(e, i, j) {
    let arraux = this.state.relaciones;
    arraux[i].experiencias.splice(j, 1);
    this.setState({
      relaciones: arraux
    })
  }

  handleChangeEmocionExperiencia(event, i, j) {
    let arraux = this.state.relaciones;
    arraux[i].experiencias[j].emocion = event.target.value;
    this.setState({
      relaciones: arraux
    })
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

  handleChangeFechaExperiencia(event, i, j) {
    let arraux = this.state.relaciones;
    arraux[i].experiencias[j].fecha = event.target.value;
    let aux = arraux[i].experiencias[j];
    arraux[i].experiencias.splice(j, 1);

    let encontrado = false;
    let pos = -1;
    let k = 0;
    while (!encontrado && k < arraux[i].experiencias.length) {
      if (this.esMayor(arraux[i].experiencias[k].fecha, aux.fecha)) {
        encontrado = true;
        pos = k;
      }
      else
        ++k;
    }
    if (encontrado) {
      let arraux1 = arraux[i].experiencias.slice(0, pos);
      let arraux2 = arraux[i].experiencias.slice(pos, arraux[i].experiencias.length + 1);
      arraux1.push({ texto: aux.experienciaRelacion, fecha: event.target.value, emocion: aux.emocionRelacion, urls: aux.urls, urlsAudios: aux.urlsAudios, urlsVideos: aux.urlsVideos });
      arraux[i].experiencias = arraux1.concat(arraux2);
    }
    else
      arraux[i].experiencias.push({ texto: aux.experienciaRelacion, fecha: event.target.value, emocion: aux.emocionRelacion, urls: aux.urls, urlsAudios: aux.urlsAudios, urlsVideos: aux.urlsVideos });

    this.setState({
      relaciones: arraux
    })
  }

  handleChangeTextoExperiencia(event, i, j) {
    let arraux = this.state.relaciones;
    arraux[i].experiencias[j].texto = event.target.value;
    this.setState({
      relaciones: arraux
    })
  }

  async handleChangeImagen(e, z, j) {
    return new Promise(async (resolve, reject) => {
      if (e.target.files[0]) {
        this.desactivado = true;
        const images = e.target.files;
        this.setState({ images: images });
        this.archivosTotales = images.length
        for (let i = 0; i < images.length; i++) {
          this.archivos = i;
          this.progress = ((i + 1) * 100) / images.length;
          await this.hacerImagenes(images[i], z, j);

        }
        resolve();

      } else reject("error")
    }).then(response => {
      this.progress = 100;
      this.desactivado = false;
      this.progress = 0;
      this.archivos = 0;
      this.archivosTotales = 0;
      alert("Confirme sus cambios pulsando el botón [Confirmar Cambios] en la  parte inferior de la pantalla")
    })
      .catch(error => {
        console.log(error);
      });
  }

  async handleChangeAudio(e, z, j) {
    return new Promise(async (resolve, reject) => {
      if (e.target.files[0]) {
        this.desactivado = true;
        const audios = e.target.files;
        this.setState({ audios: audios });
        this.archivosTotales = audios.length
        for (let i = 0; i < audios.length; i++) {
          this.archivos = i;
          this.progress = ((i + 1) * 100) / audios.length;
          await this.hacerAudios(audios[i], z, j);
        }
        resolve();

      } else
        reject("error");
    }).then(response => {
      this.progress = 100;
      this.desactivado = false;
      this.progress = 0;
      this.archivos = 0;
      this.archivosTotales = 0;
      alert("Confirme sus cambios pulsando el botón [Confirmar Cambios] en la  parte inferior de la pantalla")
    })
      .catch(error => {
        console.log(error);
      });

  }

  async handleChangeVideo(e, z, j) {
    return new Promise(async (resolve, reject) => {
      if (e.target.files[0]) {
        this.desactivado = true;
        const videos = e.target.files;
        this.setState({ videos: videos });
        this.archivosTotales = videos.length
        for (let i = 0; i < videos.length; i++) {
          this.archivos = i;
          this.progress = ((i + 1) * 100) / videos.length;
          await this.hacerVideos(videos[i], z, j);
        }
        resolve();

      } else
        reject("error");
    }).then(response => {
      this.progress = 100;
      this.desactivado = false;
      this.progress = 0;
      this.archivos = 0;
      this.archivosTotales = 0;
      alert("Confirme sus cambios pulsando el botón [Confirmar Cambios] en la  parte inferior de la pantalla")
    })
      .catch(error => {
        console.log(error);
      });

  }

  async hacerImagenes(image, i, j) {
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
            let aux = this.state.relaciones;

            if (aux[i].experiencias[j].urls === undefined)
              aux[i].experiencias[j].urls = [];

            aux[i].experiencias[j].urls.push(url);
            this.setState({
              relaciones: aux
            })
          });
      }
      else {
        alert("Error al insertar imágenes)")
      }
    });
  }

  async hacerAudios(audio, i, j) {
    return new Promise((resolve) => {
      let arraisito = audio.name.split(".");
      let ext = arraisito[arraisito.length - 1].toUpperCase();
      let url = ''

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
            let aux = this.state.relaciones;
            if (aux[i].experiencias[j].urlsAudios === undefined)
              aux[i].experiencias[j].urlsAudios = [];
            aux[i].experiencias[j].urlsAudios.push(url);
            this.setState({
              relaciones: aux
            })
          });
      }
      else {
        alert("Error al insertar audios")
      }
    });
  }

  async hacerVideos(video, i, j) {
    return new Promise((resolve) => {
      let arraisito = video.name.split(".");
      let ext = arraisito[arraisito.length - 1].toUpperCase();
      let url = ''

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
            let aux = this.state.relaciones;
            if (aux[i].experiencias[j].urlsVideos === undefined)
              aux[i].experiencias[j].urlsVideos = [];
            aux[i].experiencias[j].urlsVideos.push(url);
            this.setState({
              relaciones: aux
            })
          });
      }
      else {
        alert("Error al insertar vídeos")
      }
    });
  }

  handleDeleteImagen(event, i) {
    let arraux = this.state.urls;
    arraux.splice(i, 1);
    this.setState({
      urls: arraux
    })
  }

  handleDeleteVideo(event, i) {
    let arraux = this.state.urlsVideos;
    arraux.splice(i, 1);
    this.setState({
      urlsVideos: arraux
    })
  }

  handleDeleteAudio(event, i) {
    let arraux = this.state.urlsAudios;
    arraux.splice(i, 1);
    this.setState({
      urlsAudios: arraux
    })
  }

  handleChangeTextoRecuerdo(event, i) {
    let arraux = this.state.recuerdos;
    arraux[i].texto = event.target.value;
    this.setState({
      recuerdos: arraux
    })
  }

  handleChangeEmocionRecuerdo(event, i){
    let arraux = this.state.recuerdos;
    arraux[i].emocion = event.target.value;
    this.setState({
      recuerdos: arraux
    })
  }

  handleEliminarRecuerdo(event, i) {
    let arraux = this.state.recuerdos;
    arraux.splice(i, 1)
    this.setState({
      recuerdos: arraux
    })
    event.preventDefault();
  }

  handleChangeNombreRelacion(event, i) {
    let arraux = this.state.relaciones;
    arraux[i].nombre = event.target.value;
    this.setState({
      relaciones: arraux
    })
  }

  handleChangeTipoRelacion(event, i) {
    let arraux = this.state.relaciones;
    arraux[i].tipo = event.target.value;
    this.setState({
      relaciones: arraux
    })
  }

  handleEliminarRelacion(event, i) {
    let arraux = this.state.relaciones;
    arraux.splice(i, 1)
    this.setState({
      relaciones: arraux
    })
  }

  handleChange(event) {
    this.setState({ dni: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeResidencia(event) {
    this.setState({ residencia: event.target.value });
  }
  handleChangeTipoResidencia(event) {
    this.setState({ tipoResidencia: event.target.value });
  }
  handleChangeSurname(event) {
    this.setState({ surname: event.target.value });
  }
  handleChangeDate(event) {
    this.setState({ date: event.target.value });
  }
  handleChangeDeath(event) {
    this.setState({ death: event.target.value });
  }
  handleChangeGender(event) {
    this.setState({ gender: event.target.value });
  }
  handleChangeTerapeuta(event) {
    this.setState({ terapeuta: event.target.value });
  }

  handleChangeLocation(event) {
    this.setState({ location: event.target.value });
  }

  calculateAge(date) { // birthday is a date
    let birthday = Date.parse(date)
    let ageDifMs = Date.now() - birthday;
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  handleSubmit(event) {

      let nameRefT = firebase.database().ref("terapeutas");
      let arraux = []
      nameRefT.on('value', (snapshot) => {
        for (let aux in snapshot.val()) {
          arraux.push({ dni: snapshot.val()[aux].dni, name: snapshot.val()[aux].name + " " + snapshot.val()[aux].surname })
        }
        this.setState({
          seleccionDeTerapeuta: arraux
        })
      })


    let nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase());
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.activo = true;
        this.desactivado = false;
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
          terapeutaAux: snapshot.val().terapeuta,
          residencia: snapshot.val().residencia,
          tipoResidencia: snapshot.val().tipoResidencia,
        })
      }
    })

    nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('urls');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          urls: snapshot.val()
        })
      }
    })

    nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('urlsAudios');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          urlsAudios: snapshot.val()
        })
      }
    })

    nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('urlsVideos');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          urlsVideos: snapshot.val()
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

    nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('recuerdos');
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        this.setState({
          recuerdos: snapshot.val()
        })
      }
    })

    event.preventDefault();
  }

  refresh() {
    window.location.reload(false);
  }

  handleEdit(event) {
    if (this.state.terapeuta !== '') {
      firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
        name: this.state.name,
        surname: this.state.surname,
        dni: this.state.dni.toUpperCase(),
        date: this.state.date,
        death: this.state.death,
        gender: this.state.gender,
        recuerdos: this.state.recuerdos,
        urls: this.state.urls,
        urlsAudios: this.state.urlsAudios,
        urlsVideos: this.state.urlsVideos,
        caracteristicas: this.state.caracteristicas,
        relaciones: this.state.relaciones,
        terapeuta: this.state.terapeuta,
        residencia: this.state.residencia,
        tipoResidencia: this.state.tipoResidencia
      });

      alert('Se ha editado el usuario con DNI ' + this.state.dni);
    }
    else {
      alert('Terapeuta con DNI ' + this.state.terapeutaAux + ' no existente. No se ha podido editar el usuario.');
    }
    event.preventDefault();
    this.refresh();
  }

  render() {
    return (
      <div>
        <br></br>
        <h1>Editar usuario</h1>
        <Form onSubmit={this.handleSubmit}>
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

        <Form onSubmit={this.handleEdit}>
          <Form.Group controlId="formName">
            <Form.Label>Nombre del usuario</Form.Label>
            <Form.Control disabled={this.desactivado} type="text" defaultValue={this.state.name} onChange={this.handleChangeName} />

          </Form.Group>

          <Form.Group controlId="formSurname">
            <Form.Label>Apellidos del usuario</Form.Label>
            <Form.Control disabled={this.desactivado} type="text" defaultValue={this.state.surname} onChange={this.handleChangeSurname} />
          </Form.Group>

          <Form.Group controlId="formFechaNac">
            <Form.Label>Fecha de nacimiento del usuario</Form.Label>
            <Form.Control disabled={this.desactivado} type="date" value={this.state.date} min="1900-01-01" max={new Date().toISOString().split('T')[0]} onChange={this.handleChangeDate} />
          </Form.Group>

          <Form.Group className="formFechaNac">
            <Form.Label className="label">Fecha de fallecimiento del usuario</Form.Label>
            <Form.Control disabled={this.desactivado} type="date" value={this.state.death} placeholder="Fecha de nacimiento" min={this.state.date} max={new Date().toISOString().split('T')[0]} onChange={this.handleChangeDeath} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Género del usuario</Form.Label>
            <Form.Control disabled={this.desactivado} as="select" onChange={this.handleChangeGender} value={this.state.gender}>
              <option>Hombre</option>
              <option>Mujer</option>
              <option>No especificado</option>
            </Form.Control>
            <br />
          </Form.Group>

          <Form.Group controlId="formResidencia">
            <Form.Label>Lugar de residencia</Form.Label>
            <Form.Control disabled={this.desactivado} type="text" value={this.state.residencia} onChange={this.handleChangeResidencia} />
          </Form.Group>

          <Form.Group className="formTipoResidencia">
            <Form.Label className="label">Tipo de residencia</Form.Label>
            <Form.Control disabled={this.desactivado} as="select" value={this.state.tipoResidencia} onChange={this.handleChangeTipoResidencia}>
              <option>Residencia</option>
              <option>Domicilio particular (no acompañado)</option>
              <option>Domicilio particular (acompañado)</option>
            </Form.Control>
            <br />
          </Form.Group>

          <Form.Group className="formCountry">
            <Form.Label className="label">Nacionalidad del usuario</Form.Label>
            <Form.Control as="select" onChange={this.handleChangeNationality} value={this.state.caracteristicas.nationality}>
              <option>España</option>
              <option>Afganistan</option>
              <option>Africa Central</option>
              <option>Albania</option>
              <option>Alemania</option>
              <option>Andorra</option>
              <option>Angola</option>
              <option>Anguilla</option>
              <option>Antartida</option>
              <option>Antigua y Barbuda</option>
              <option>Arabia Saudita</option>
              <option>Argelia</option>
              <option>Argentina</option>
              <option>Armenia</option>
              <option>Aruba</option>
              <option>Australia</option>
              <option>Austria</option>
              <option>Azerbaiyan</option>
              <option>Bahamas</option>
              <option>Bahrein</option>
              <option>Bangladesh</option>
              <option>Barbados</option>
              <option>Bielorrusia</option>
              <option>Belgica</option>
              <option>Belice</option>
              <option>Benin</option>
              <option>Bermuda</option>
              <option>Butan</option>
              <option>Bolivia</option>
              <option>Bosnia y Herzegovina</option>
              <option>Botswana</option>
              <option>Brasil</option>
              <option>Brunei</option>
              <option>Bulgaria</option>
              <option>Burkina Faso</option>
              <option>Burundi</option>
              <option>Camboya</option>
              <option>Camerun</option>
              <option>Canada</option>
              <option>Cabo Verde</option>
              <option>Ciudad del Vaticano</option>
              <option>Chad</option>
              <option>Chile</option>
              <option>China</option>
              <option>Colombia</option>
              <option>Comoras</option>
              <option>Congo</option>
              <option>Corea del Norte</option>
              <option>Corea del Sur</option>
              <option>Costa Rica</option>
              <option>Costa de Marfil</option>
              <option>Croacia</option>
              <option>Cuba</option>
              <option>Chipre</option>
              <option>Dinamarca</option>
              <option>Dominica</option>
              <option>Ecuador</option>
              <option>Egipto</option>
              <option>El Salvador</option>
              <option>Emiratos Arabes</option>
              <option>Eritrea</option>
              <option>Eslovaquia</option>
              <option>Eslovenia</option>
              <option>España</option>
              <option>Estados Unidos</option>
              <option>Estonia</option>
              <option>Etiopia</option>
              <option>Fiji</option>
              <option>Filipinas</option>
              <option>Finlandia</option>
              <option>Francia</option>
              <option>Gabon</option>
              <option>Gambia</option>
              <option>Georgia</option>
              <option>Ghana</option>
              <option>Gibraltar</option>
              <option>Grecia</option>
              <option>Granada</option>
              <option>Groenlandia</option>
              <option>Guadalupe</option>
              <option>Guam</option>
              <option>Guatemala</option>
              <option>Guinea</option>
              <option>Guinea-bissau</option>
              <option>Guinea Ecuatorial</option>
              <option>Guyana</option>
              <option>Guyana Francesa</option>
              <option>Haiti</option>
              <option>Holanda</option>
              <option>Honduras</option>
              <option>Hong Kong</option>
              <option>Hungria</option>
              <option>India</option>
              <option>Indonesia</option>
              <option>Iran</option>
              <option>Irak</option>
              <option>Irlanda</option>
              <option>Isla Bouvet</option>
              <option>Isla de Coco</option>
              <option>Isla de Navidad</option>
              <option>Isla de Pascua</option>
              <option>Isla Norfolk</option>
              <option>Islandia</option>
              <option>Islas Cayman</option>
              <option>Islas Cook</option>
              <option>Islas Feroe</option>
              <option>Islas Heard y McDonald</option>
              <option>Islas Malvinas</option>
              <option>Islas Marianas del Norte</option>
              <option>Islas Marshall</option>
              <option>Islas Pitcairn</option>
              <option>Islas Salomon</option>
              <option>Islas Turcas y Caicos</option>
              <option>Islas Virgenes</option>
              <option>Israel</option>
              <option>Italia</option>
              <option>Jamaica</option>
              <option>Japon</option>
              <option>Jordania</option>
              <option>Kazakhstan</option>
              <option>Kenia</option>
              <option>Kiribati</option>
              <option>Kosovo</option>
              <option>Kuwait</option>
              <option>Kirguistan</option>
              <option>Laos</option>
              <option>Letonia</option>
              <option>Libano</option>
              <option>Lesoto</option>
              <option>Liberia</option>
              <option>Libia</option>
              <option>Liechtenstein</option>
              <option>Lituania</option>
              <option>Luxemburgo</option>
              <option>Macao</option>
              <option>Macedonia</option>
              <option>Madagascar</option>
              <option>Malawi</option>
              <option>Malasia</option>
              <option>Maldivas</option>
              <option>Mali</option>
              <option>Malta</option>
              <option>Martinica</option>
              <option>Mauritania</option>
              <option>Mauricio</option>
              <option>Mayotte</option>
              <option>Mexico</option>
              <option>Micronesia</option>
              <option>Moldavia</option>
              <option>Monaco</option>
              <option>Mongolia</option>
              <option>Montenegro</option>
              <option>Montserrat</option>
              <option>Marruecos</option>
              <option>Mozambique</option>
              <option>Myanmar</option>
              <option>Namibia</option>
              <option>Nauru</option>
              <option>Nepal</option>
              <option>Nicaragua</option>
              <option>Niger</option>
              <option>Nigeria</option>
              <option>Niue</option>
              <option>Noruega</option>
              <option>Nueva Caledonia</option>
              <option>Nueva Zelanda</option>
              <option>Oman</option>
              <option>Pakistan</option>
              <option>Palau</option>
              <option>Palestina</option>
              <option>Panama</option>
              <option>Papua Nueva Guinea</option>
              <option>Paraguay</option>
              <option>Peru</option>
              <option>Polinesia Francesa</option>
              <option>Polonia</option>
              <option>Portugal</option>
              <option>Puerto Rico</option>
              <option>Qatar</option>
              <option>Republica Checa</option>
              <option>Republica Dominicana</option>
              <option>Reino Unido</option>
              <option>Reunion</option>
              <option>Rumania</option>
              <option>Rusia</option>
              <option>Ruanda</option>
              <option>Sahara Occidental</option>
              <option>Samoa</option>
              <option>Santa Helena</option>
              <option>San Cristobal y Nieves</option>
              <option>Santa Lucia</option>
              <option>San Pedro y Miguelon</option>
              <option>San Vicente y las Granadinas</option>
              <option>Samoa</option>
              <option>San Marino</option>
              <option>Santo Tome y Principe</option>
              <option>Senegal</option>
              <option>Serbia y Montenegro</option>
              <option>Seychelles</option>
              <option>Sierra Leona</option>
              <option>Singapur</option>
              <option>Siria</option>
              <option>Somalia</option>
              <option>Sri Lanka</option>
              <option>Sudafrica</option>
              <option>Sudan</option>
              <option>Surinam</option>
              <option>Suazilandia</option>
              <option>Suecia</option>
              <option>Suiza</option>
              <option>Taiwan</option>
              <option>Tayikistan</option>
              <option>Tanzania</option>
              <option>Tailandia</option>
              <option>Timor Oriental</option>
              <option>Togo</option>
              <option>Tokelau</option>
              <option>Tonga</option>
              <option>Trinidad y Tobago</option>
              <option>Tunez</option>
              <option>Turquia</option>
              <option>Turkey</option>
              <option>Turkmenistan</option>
              <option>Tuvalu</option>
              <option>Uganda</option>
              <option>Ukrania</option>
              <option>Uruguay</option>
              <option>Uzbekistan</option>
              <option>Vanuatu</option>
              <option>Venezuela</option>
              <option>Vietnam</option>
              <option>Wallis y Futuna</option>
              <option>Yemen</option>
              <option>Yibuti</option>
              <option>Zambia</option>
              <option>Zimbaue</option>
              <option>Otro</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formDniTerapeuta">
            <Form.Label>Terapeuta asignado</Form.Label>
            <Form.Control as="select" type="text" placeholder="Terapeuta asignado" value={this.state.terapeuta} required onChange={this.handleChangeTerapeuta}>
              {
                this.state.seleccionDeTerapeuta ? this.state.seleccionDeTerapeuta.map((Terapeuta, i) =>
                  <option value={Terapeuta.dni}>{Terapeuta.name} ({Terapeuta.dni})</option>
                ) : <div></div>
              }
            </Form.Control>
          </Form.Group>

          {this.state.relaciones && this.activo ? <div className="relaciones">
            <h2>Relaciones del usuario</h2>
            <div className="relacionesMostrar">
              {this.state.relaciones ? this.state.relaciones.map((relacion, i) =>
                <div className="recuadroRelacion" value={relacion}>

                  <Form.Group className="recuadroRelacionForm">
                    <Form.Label className="label">Nombre</Form.Label>
                    <Form.Control disabled={this.desactivado} type="text" value={relacion.nombre} onChange={(event) => this.handleChangeNombreRelacion(event, i)} />
                    <Form.Label className="label">Tipo</Form.Label>
                    <Form.Control disabled={this.desactivado} type="text" value={relacion.tipo} onChange={(event) => this.handleChangeTipoRelacion(event, i)} />
                    {relacion.experiencias ? relacion.experiencias.map((experiencia, j) =>

                      <div className="recuadroExperiencias" value={experiencia}>
                        <Form id="formExperiencia">
                          <Form.Group className="formEmocion">
                            <Form.Label className="label">Tipo de emoción para esta experiencia</Form.Label>
                            <Form.Control disabled={this.desactivado} as="select" className="inputEmocionRelacion" value={experiencia.emocion} onChange={(e) => this.handleChangeEmocionExperiencia(e, i, j)}>
                              <option>Positiva</option>
                              <option>Neutral</option>
                              <option>Negativa</option>
                            </Form.Control>
                          </Form.Group>

                          <Form.Group className="formExperienciaRelacion">
                            <Form.Label className="label">Experiencias vividas con este allegado</Form.Label>
                            <Form.Control disabled={this.desactivado} className="inputExperienciaRelacion" type="text" placeholder="Jugábamos juntos al fútbol, dábamos paseos por Madrid..." value={experiencia.texto} onChange={(e) => this.handleChangeTextoExperiencia(e, i, j)} />
                          </Form.Group>

                          <Form.Group className="formFecha">
                            <Form.Label className="label">Etapa de vida</Form.Label>
                            <Form.Control as="select" isDisabled={this.desactivado} placeholder="Selecciona la etapa vida del usuario a la que pertenece este suceso" onChange={(e) => this.handleChangeFechaExperiencia(e, i, j)} value={experiencia.fecha}>
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
                              onChange={(e) => this.handleChangeImagen(e, i, j)}
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
                              onChange={(e) => this.handleChangeAudio(e, i, j)}
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
                              onChange={(e) => this.handleChangeVideo(e, i, j)}
                              id="validationFormik107"
                              feedbackTooltip
                            />
                          </Form.Group>

                          <div className="imagenesMostrar">
                            {
                              experiencia.urls ? experiencia.urls.map((unaurl, k) =>
                                <div className="recuadroImagnes">
                                  <img classsName="unaimagen profile_img" src={unaurl} alt=""></img>
                                  <Button disabled={this.desactivado} variant="danger" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar este elemento?')) this.handleEliminarImagenExperiencia(event, i, j, k) }}>
                                    X
                                  </Button>
                                </div>
                              ) : console.log("no hay imagenes para esta experiencia")
                            }
                          </div>
                          <div className="AudiosMostrar">
                            {
                              experiencia.urlsAudios ? experiencia.urlsAudios.map((unaurl, k) =>
                                <div className="recuadroAudios">
                                  <audio controls classsName="unaudio profile_audio" src={unaurl} alt=""></audio>
                                  <Button disabled={this.desactivado} variant="danger" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar este elemento?')) this.handleEliminarAudioExperiencia(event, i, j, k) }}>
                                    X
                                  </Button>
                                </div>
                              ) : console.log("no hay Audios para esta experiencia")
                            }
                          </div>
                          <div className="videosMostrar">
                            {
                              experiencia.urlsVideos ? experiencia.urlsVideos.map((unaurl, k) =>
                                <div className="recuadroVideos">
                                  <video controls classsName="unvideo profile_video" src={unaurl} alt=""></video>
                                  <Button disabled={this.desactivado} variant="danger" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar este elemento?')) this.handleEliminarVideoExperiencia(event, i, j, k) }}>
                                    X
                                  </Button>
                                </div>
                              ) : console.log("no hay videos para esta experiencia")
                            }
                          </div>

                          {this.progress !== 0 ? <div><br></br><br></br></div> : console.log("el progreso es 0 bro")}

                          {this.progress !== 0 ? <LinearProgress variant="determinate" value={this.progress} /> : console.log("el progreso es 0 bro")}

                          {this.progress !== 0 ? <div><br></br><br></br></div> : console.log("el progreso es 0 bro")}

                          {this.progress !== 0 ? <CircularProgress value={this.progress} /> : console.log("el progreso es 0 bro")}
                          {this.progress !== 0 ? <CircularProgress color="secondary" value={this.progress} /> : console.log("el progreso es 0 bro")}

                          <br></br>

                          {this.progress !== 0 ? <p>{this.archivos} archivos transferidos de {this.archivosTotales} archivos totales. </p> : console.log("el progreso es 0 bro")}

                          {<Button disabled={this.desactivado} className="botonAnyadirExperiencia" onClick={(e) => { if (window.confirm('¿Está seguro de que quiere eliminar esta experiencia?')) this.handleEliminarExperiencia(e, i, j) }}>
                            BORRAR ESTA EXPERIENCIA
                          </Button>}
                        </Form>
                      </div>

                    ) : console.log("no hay experiencias")}
                    <br></br>
                    <Button disabled={this.desactivado} variant="danger" size="lg" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar esta relación?')) this.handleEliminarRelacion(event, i) }}>
                      Borrar esta relación
                    </Button>
                    <br></br>
                  </Form.Group>
                </div>
              ) : <div className="recuadroRelaciones">
                <h4 className="relacionesh4">No se han introducido relaciones de este usuario</h4>
              </div>}

            </div>
          </div> : <div></div>}

          {this.state.recuerdos && this.activo ? <div className="recuerdos">
            <h2>Recuerdos del usuario</h2>
            <div className="recuerdosMostrar">
              {this.state.recuerdos ? this.state.recuerdos.map((recuerdo, i) =>
                <div className="recuadroRecuerdo" value={recuerdo}>

                  <Form.Group className="recuadroRecuerdo">
                    <Form.Label className="label">Recuerdo</Form.Label>
                    <Form.Control disabled={this.desactivado} type="text" value={recuerdo.texto} onChange={(event) => this.handleChangeTextoRecuerdo(event, i)} />
                    <Form.Group className="formEmocion">
                      <Form.Label className="label">Tipo de emoción para este recuerdo</Form.Label>
                      <Form.Control disabled={this.desactivado} as="select" className="inputEmocionRelacion" value={recuerdo.emocion} onChange={(e) => this.handleChangeEmocionRecuerdo(e, i)} >
                        <option>Positiva</option>
                        <option>Neutral</option>
                        <option>Negativa</option>
                      </Form.Control>
                    </Form.Group>
                    <div className="PerdidaRecuerdo">
                      <br></br>
                      <h3>Estado del recuerdo</h3>
                      <div className="valorPerdidaRecuerdo">
                        <FormControl>
                          <FormControl component="fieldset">
                            <RadioGroup row value={recuerdo.estado} onChange={(e) => this.handleChangeEstadoRecuerdo(e, i)} >
                              <FormControlLabel value="Recuerdo completo" control={<Radio />} label="Recuerdo completo" />
                              <FormControlLabel value="Recuerdo parcial sin pistas" control={<Radio />} label="Recuerdo parcial sin pistas" />
                              <FormControlLabel value="Recuerdo parcial con pistas" control={<Radio />} label="Recuerdo parcial con pistas" />
                              <FormControlLabel value="Recuerdo perdido" control={<Radio />} label="Recuerdo perdido" />
                            </RadioGroup>
                          </FormControl>
                        </FormControl>
                      </div>
                    </div>
                    <Button disabled={this.desactivado} variant="danger" size="lg" type="submit" onClick={(event) => this.handleEliminarRecuerdo(event, i)}>
                      Borrar este recuerdo
                    </Button>
                    <br></br>
                  </Form.Group>
                </div>
              ) : <div className="recuadroRecuerdos">
                <h4 className="relacionesh4">No se han introducido recuerdos de este usuario</h4>
              </div>}
            </div>
          </div> : <div></div>}

          {this.state.urls && this.activo ? <div className="imagenes">
            <br></br>
            <h2>Imágenes</h2>
            <div className="imagenesMostrar">
              {this.state.urls ? this.state.urls.map((unaUrl, i) =>
                <div className="recuadroImagnes">
                  <img src={unaUrl} className="profile_img" alt=""></img>
                  <Button variant="danger" size="lg" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar este elemento?')) this.handleDeleteImagen(event, i) }}>
                    X
                  </Button>
                </div>
              ) : console.log("adios")}
            </div>
          </div> : <div></div>}

          {this.state.urlsAudios && this.activo ? <div className="audios">
            <br></br>
            <h2>Audios</h2>
            <div className="audiosMostrar">
              {this.state.urlsAudios ? this.state.urlsAudios.map((unaUrl, i) =>
                <div className="recuadroAudios">
                  <audio controls src={unaUrl} className="profile_audio">
                    Hay un problema al mostrar al menos uno de los audios.
                    </audio>
                  <Button variant="danger" size="lg" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar este elemento?')) this.handleDeleteAudio(event, i) }}>
                    X
                    </Button>
                </div>
              ) : console.log("adios")}
            </div>
          </div> : <div></div>}

          {this.state.urlsVideos && this.activo ? <div className="videos">
            <br></br>
            <h2>Vídeos</h2>
            <div className="videosMostrar">
              {this.state.urlsVideos ? this.state.urlsVideos.map((unaUrl, i) =>
                <div className="recuadroVideos">
                  <video controls className="video" src={unaUrl}>
                    Hay un problema al mostrar al menos uno de los vídeos.
                  </video>
                  <Button variant="danger" size="lg" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar este elemento?')) this.handleDeleteVideo(event, i) }}>
                    X
                  </Button>
                </div>
              ) : console.log("adios")}
            </div>
          </div> : <div></div>}
          <Button disabled={this.desactivado} id="btnconfirmar" variant="warning" size="lg" type="submit" onClick={this.handleEdit}>
            Confirmar cambios
          </Button>
        </Form>
        <br></br>
      </div>
    );
  }
}