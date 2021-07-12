import React from 'react';
import './Registro.css';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';
export default class Registro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      dni: '',
      date: '',
      death: '',
      residencia: '',
      tipoResidencia: 'Residencia',
      gender: 'No especificado',
      recuerdos: [],
      caracteristicas: {
        nationality: 'España'
      },
      relaciones: [],
      terapeuta: '',
      terapeutaAux: '',
      seleccionDeTerapeuta: []
    };
    this.storage = firebase.storage();
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeSurname = this.handleChangeSurname.bind(this);
    this.handleChangeDNI = this.handleChangeDNI.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeDeath = this.handleChangeDeath.bind(this);
    this.handleChangeGender = this.handleChangeGender.bind(this);
    this.handleChangeNationality = this.handleChangeNationality.bind(this);
    this.handleChangeTerapeuta = this.handleChangeTerapeuta.bind(this);
    this.handleChangeResidencia = this.handleChangeResidencia.bind(this);
    this.handleChangeTipoResidencia = this.handleChangeTipoResidencia.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateDNI = this.validateDNI.bind(this);
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

  handleChangeTipoResidencia(e) {
    this.setState({ tipoResidencia: e.target.value })
  }

  handleChangeResidencia(e) {
    this.setState({ residencia: e.target.value })
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
  handleChangeDeath(event) {
    this.setState({ death: event.target.value });
  }
  handleChangeGender(event) {
    this.setState({ gender: event.target.value });
  }
  handleChangeTerapeuta(event) {
    let terapeutaCorrecto = false;
    this.setState({ terapeutaAux: event.target.value });

    let nameRef = firebase.database().ref("terapeutas");
    nameRef.on('value', (snapshot) => {
      if (snapshot.val() !== undefined) {
        let todo = snapshot;
        todo.forEach(aux => {
          let terapeuta = aux.val().dni;
          if (terapeuta === event.target.value) {
            terapeutaCorrecto = true;
            this.setState({ terapeuta: event.target.value });
          }
        })
      }
    })
    if (!terapeutaCorrecto) {
      this.setState({ terapeuta: '' });
    }
  }

  handleChangeNationality(event) {
    this.setState({
      caracteristicas: {
        nationality: event.target.value
      }
    });
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

  handleSubmit(event) {

    if (this.validateDNI(this.state.dni) && this.state.terapeuta !== '') {
      firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).set({
        name: this.state.name,
        surname: this.state.surname,
        dni: this.state.dni.toUpperCase(),
        date: this.state.date,
        death: this.state.death,
        gender: this.state.gender,
        caracteristicas: this.state.caracteristicas,
        terapeuta: this.state.terapeuta,
        residencia: this.state.residencia,
        tipoResidencia: this.state.tipoResidencia,
      })
      alert('Se ha dado de alta un nuevo usuario con DNI: ' + this.state.dni);
    }
    else if (this.state.terapeuta === '') {
      alert('El terapeuta con DNI ' + this.state.terapeutaAux + ' no existe. No se registra el usuario');
    }
    else {
      alert('El DNI ' + this.state.dni + ' no es válido. No se registra el usuario');
    }
  }

  render() {
    return (
      <div>
        <br></br>
        <h1>Nuevo usuario</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="formName">
            <Form.Label className="label">Nombre del usuario*</Form.Label>
            <Form.Control required type="text" value={this.state.name} placeholder="Nombre" onChange={this.handleChangeName} />
          </Form.Group>

          <Form.Group className="formSurname">
            <Form.Label className="label">Apellidos del usuario*</Form.Label>
            <Form.Control required type="text" value={this.state.surname} placeholder="Apellidos" onChange={this.handleChangeSurname} />
          </Form.Group>

          <Form.Group className="formDNI">
            <Form.Label className="label">DNI del usuario*</Form.Label>
            <Form.Control type="text" value={this.state.dni} placeholder="DNI" required onChange={this.handleChangeDNI} />
          </Form.Group>

          <Form.Group className="formFechaNac">
            <Form.Label className="label">Fecha de nacimiento del usuario*</Form.Label>
            <Form.Control required type="date" value={this.state.date} placeholder="Fecha de nacimiento" min="1900-01-01" max={new Date().toISOString().split('T')[0]} onChange={this.handleChangeDate} />
          </Form.Group>
          <Form.Group className="formFechaNac">
            <Form.Label className="label">Fecha de fallecimiento del usuario</Form.Label>
            <Form.Control type="date" value={this.state.death} placeholder="Fecha de nacimiento" min={this.state.date} max={new Date().toISOString().split('T')[0]} onChange={this.handleChangeDeath} />
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

          <Form.Group className="formGender">
            <Form.Label className="label">Género del usuario</Form.Label>
            <Form.Control as="select" onChange={this.handleChangeGender} value={this.state.gender}>
              <option>Hombre</option>
              <option>Mujer</option>
              <option>No especificado</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="formName">
            <Form.Label className="label">Lugar de residencia*</Form.Label>
            <Form.Control required type="text" value={this.state.residencia} placeholder="Madrid, Barcelona..." onChange={this.handleChangeResidencia} />
          </Form.Group>

          <Form.Group className="formTipoResidencia">
            <Form.Label className="label">Tipo de residencia*</Form.Label>
            <Form.Control required as="select" value={this.state.tipoResidencia} onChange={this.handleChangeTipoResidencia}>
              <option>Residencia</option>
              <option>Domicilio particular (no acompañado)</option>
              <option>Domicilio particular (acompañado)</option>
            </Form.Control>
            <br />
          </Form.Group>

          <Form.Group className="formDNI">
            <Form.Label className="label">DNI del terapeuta asignado*</Form.Label>
            <Form.Control as="select" type="text" placeholder="Terapeuta asignado" defaultValue="" required onChange={this.handleChangeTerapeuta}>
              <option hidden disabled selected value>-- Seleccione un terapeuta --</option>
              {
                this.state.seleccionDeTerapeuta ? this.state.seleccionDeTerapeuta.map((Terapeuta, i) =>
                  <option value={Terapeuta.dni}>{Terapeuta.name} ({Terapeuta.dni})</option>
                ) : <div></div>
              }
            </Form.Control>
          </Form.Group>

          <Button className="submitUsuario" variant="primary" type="submit">
            Registrar
          </Button>
        </Form>
        <br></br>
      </div>
    );
  }
}