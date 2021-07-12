import React from 'react';
import './DiagnosticoClinico.css';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormLabel from '@material-ui/core/FormLabel';

export default class DiagnosticoClinico extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            dni: '',
            diagnostico: '',
            gdsNuevo: 0,
            gdsGuardado: 0,
            terapeuta: '',
            historial: [],
            seleccionDeUsuario: []
        };
        this.storage = firebase.storage();

        this.desactivado = true;
        this.desactivadoGds = true;
        this.desactivadoTexto = true;
        this.desactivadoTerapeuta = true;
        this.desactivadoDiagnostico = true;
        this.edicion = false;
        this.primerUsuario = ''

        this.handleChange = this.handleChange.bind(this);
        this.handleBuscar = this.handleBuscar.bind(this);
        this.handleChangeGds = this.handleChangeGds.bind(this);
        this.handleConfirmarGds = this.handleConfirmarGds.bind(this);
        this.handleChangeTexto = this.handleChangeTexto.bind(this);
        this.handleChangeTerapeuta = this.handleChangeTerapeuta.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.habilitarEdicion = this.habilitarEdicion.bind(this);
        this.handleChangeEdicionHistorias = this.handleChangeEdicionHistorias.bind(this);
        this.handleChangeTextoEditar = this.handleChangeTextoEditar.bind(this);
        this.handleChangeTerapeutaEditar = this.handleChangeTerapeutaEditar.bind(this);
        this.handleDeleteHistoria = this.handleDeleteHistoria.bind(this);
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

    async handleDeleteHistoria(e, i) {
        let arraux = this.state.historial;
        arraux.splice(i, 1);
        return new Promise((resolve, reject) => {
            this.setState({
                historial: arraux
            })
            resolve()
        }).then(() => {
            firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
                historial: arraux
            });
        })
    }

    handleChangeTextoEditar(e, i) {
        let arraux = this.state.historial;
        arraux[i].texto = e.target.value;
        this.setState({
            historial: arraux
        })
    }

    handleChangeTerapeutaEditar(e, i) {
        let arraux = this.state.historial;
        arraux[i].terapeuta = e.target.value;
        this.setState({
            historial: arraux
        })
    }

    handleChangeEdicionHistorias(e) {

        let arraux = this.state.historial;
        firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
            historial: arraux
        });
        e.preventDefault();
        alert("Se han editado los cambios en la historia clínica del usuario con DNI " + this.state.dni);
        this.edicion = false;
        this.forceUpdate();
    }

    habilitarEdicion() {
        this.edicion = true;
        this.forceUpdate()
    }

    handleSubmit(event) {

        let hist = this.state.historial;
        if (hist === null)
            hist = []

        hist.unshift({
            texto: this.state.diagnostico,
            terapeuta: this.state.terapeuta,
            fecha: new Date().toISOString().split('T')[0]
        });
        firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
            historial: hist
        });
        event.preventDefault();
        document.getElementById("formDiagnostico").reset();
        alert("Nuevo diagnóstico guardado para el usuario con DNI " + this.state.dni);
    }

    handleChangeTerapeuta(event) {
        this.setState({ terapeuta: event.target.value })

        if (event.target.value.length > 0)
            this.desactivadoTerapeuta = false;
        else
            this.desactivadoTerapeuta = true;

        if (!this.desactivadoTexto && !this.desactivadoTerapeuta)
            this.desactivadoDiagnostico = false;
        else
            this.desactivadoDiagnostico = true;
    }

    handleChangeTexto(event) {
        this.setState({ diagnostico: event.target.value })

        if (event.target.value.length > 0)
            this.desactivadoTexto = false;
        else
            this.desactivadoTexto = true;

        if (!this.desactivadoTexto && !this.desactivadoTerapeuta)
            this.desactivadoDiagnostico = false;
        else
            this.desactivadoDiagnostico = true;
    }

    handleConfirmarGds(event) {
        this.desactivadoGds = true;
        this.setState({ gdsGuardado: this.state.gdsNuevo })
        firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
            gds: this.state.gdsNuevo
        });

        alert('Se ha actualizado el GDS del usuario con DNI ' + this.state.dni);
    }

    handleChangeGds(event) {
        this.setState({ gdsNuevo: event.target.value })
        if (event.target.value !== this.state.gdsGuardado)
            this.desactivadoGds = false;
        else
            this.desactivadoGds = true;
    }

    handleChange(event) {
        this.setState({ dni: event.target.value });
    }

    handleBuscar(event) {
        if (this.state.dni === '') this.setState({ dni: this.primerUsuario })
        let nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('name');
        nameRef.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.desactivado = false;
                this.setState({
                    name: snapshot.val()
                })
            }
        })

        nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('surname');
        nameRef.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.setState({
                    surname: snapshot.val()
                })
            }
        })

        nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('historial');
        nameRef.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.setState({
                    historial: snapshot.val()
                })
            }
        })

        nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('gds');
        nameRef.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.setState({
                    gdsGuardado: snapshot.val(),
                    gdsNuevo: snapshot.val()
                })
            }
        })

        event.preventDefault();
    }

    render() {
        return (
            <div>
                <br></br>
                <h1>Evaluación clínica</h1>

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
                <br></br><br></br>

                {!this.desactivado ?
                    <div>
                        <div className="form-image">
                            <div className="search-form">
                                <h3>Evaluación del usuario {this.state.name} {this.state.surname}</h3>

                                <div className="diagnosticos">
                                    <h2>Histórico</h2>
                                    <hr></hr>
                                    {!this.edicion ?
                                        <div className="historico">
                                            {this.state.historial ? this.state.historial.map((diag, i) =>
                                                <div className="recuadro">
                                                    <p><b>Diagnóstico:</b> {diag.texto}</p>
                                                    <div>
                                                        <p><b>Terapeuta:</b> {diag.terapeuta}</p>
                                                        <p><b>Fecha:</b> {diag.fecha}</p>
                                                        <Button variant="danger" onClick={(e) => { if (window.confirm('¿Está seguro de que quiere eliminar este elemento?')) this.handleDeleteHistoria(e, i) }}>X</Button>
                                                    </div>
                                                    <hr></hr>
                                                </div>
                                            ) : <div></div>}
                                            <Button variant="warning" onClick={this.habilitarEdicion}>Editar</Button>
                                        </div>
                                        : <div className="historicoForm">
                                            {this.state.historial ? this.state.historial.map((diag, i) =>
                                                <div className="recuadroHistoricoForm">
                                                    <Form.Group>
                                                        <Form.Label>Dignóstico</Form.Label>
                                                        <Form.Control as="textarea" rows={5} value={diag.texto} onChange={(e) => this.handleChangeTextoEditar(e, i)} />
                                                        <Form.Label>Terapeuta</Form.Label>
                                                        <Form.Control type="text" Value={diag.terapeuta} onChange={(e) => this.handleChangeTerapeutaEditar(e, i)} />
                                                        <hr></hr>
                                                    </Form.Group>
                                                </div>
                                            ) : console.log("adios")}
                                            <Button variant="primary" onClick={this.handleChangeEdicionHistorias}>Confirmar Cambios</Button>
                                        </div>}
                                </div>
                                <br></br><br></br>
                                <div className="gds">
                                    <h2>Escala de deterioro global (GDS)</h2>
                                    <div className="valorGds">
                                        <FormControl>
                                            <FormControl component="fieldset">
                                                <RadioGroup row value={this.state.gdsNuevo} onChange={this.handleChangeGds}>
                                                    <FormControlLabel value="1" control={<Radio />} label="1" />
                                                    <FormControlLabel value="2" control={<Radio />} label="2" />
                                                    <FormControlLabel value="3" control={<Radio />} label="3" />
                                                    <FormControlLabel value="4" control={<Radio />} label="4" />
                                                    <FormControlLabel value="5" control={<Radio />} label="5" />
                                                    <FormControlLabel value="6" control={<Radio />} label="6" />
                                                    <FormControlLabel value="7" control={<Radio />} label="7" />
                                                </RadioGroup>
                                            </FormControl>
                                        </FormControl>
                                        <Button disabled={this.desactivadoGds} className="botonActualizarGds" onClick={this.handleConfirmarGds}>
                                            Confirmar GDS
                                        </Button>
                                    </div>
                                </div>

                                <div className="textoDiagnostico">
                                    {/* <Form onSubmit={this.handleSubmit}> */}
                                    <Form id="formDiagnostico">
                                        <Form.Label className="black">Nuevo diagnóstico</Form.Label>
                                        <br></br>
                                        {/* <TextareaAutosize id="textArea" cols='100' rows='15' type="text" placeholder="Texto diagnóstico" onChange={this.handleChangeTexto} /> */}
                                        <Form.Control as="textarea" rows={10} placeholder="Texto diagnóstico" onChange={this.handleChangeTexto} />
                                        <Form.Control type="text" placeholder="Terapeuta" onChange={this.handleChangeTerapeuta} />
                                    </Form>
                                    <br></br><br></br>
                                    <Button disabled={this.desactivadoDiagnostico} variant="primary" type="submit" onClick={this.handleSubmit}>
                                        Guardar
                                        </Button>
                                    <br></br><br></br>
                                    {/* </Form> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    : console.log("no activo")}
            </div>
        )
    }
}