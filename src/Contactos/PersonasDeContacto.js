import React from 'react';
import './PersonasDeContacto.css';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';

export default class PersonasDeContacto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dni: '',
            seleccionDeUsuario: [],
            contactoNombre: '',
            contactoEmail: '',
            contactoNumero: '',
            contactoRelacion: '',
            contactos: []
        };

        this.storage = firebase.storage();

        this.desactivado = true;
        this.edicion = false;
        this.handleChange = this.handleChange.bind(this);
        this.handleBuscar = this.handleBuscar.bind(this);
        this.handleChangeContactoNombre = this.handleChangeContactoNombre.bind(this)
        this.handleChangeContactoRelacion = this.handleChangeContactoRelacion.bind(this)
        this.handleChangeContactoNumero = this.handleChangeContactoNumero.bind(this)
        this.handleChangeContactoEmail = this.handleChangeContactoEmail.bind(this)
        this.handleAnyadirContacto = this.handleAnyadirContacto.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleEliminarContacto = this.handleEliminarContacto.bind(this)
        this.habilitarEdicion = this.habilitarEdicion.bind(this)
        this.handleChangeNombreEditar = this.handleChangeNombreEditar.bind(this)
        this.handleChangeEmailEditar = this.handleChangeEmailEditar.bind(this)
        this.handleChangeRelacionEditar = this.handleChangeRelacionEditar.bind(this)
        this.handleChangeNumeroEditar = this.handleChangeNumeroEditar.bind(this)
        this.handleChangeEdicionContactos = this.handleChangeEdicionContactos.bind(this)
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

    handleChangeNombreEditar(e, i) {
        let arraux = this.state.contactos;
        arraux[i].nombre = e.target.value;
        this.setState({
            contactos: arraux
        })
    }

    handleChangeNumeroEditar(e, i) {
        let arraux = this.state.contactos;
        arraux[i].numero = e.target.value;
        this.setState({
            contactos: arraux
        })
    }

    handleChangeRelacionEditar(e, i) {
        let arraux = this.state.contactos;
        arraux[i].relacion = e.target.value;
        this.setState({
            contactos: arraux
        })
    }

    handleChangeEdicionContactos(e) {

        let arraux = this.state.contactos;
        firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
            contactos: arraux
        });
        e.preventDefault();
        alert("Se han editado los cambios en los contactos del usuario con DNI " + this.state.dni);
        this.edicion = false;
        this.forceUpdate();
    }

    handleChangeEmailEditar(e, i) {
        let arraux = this.state.contactos;
        arraux[i].email = e.target.value;
        this.setState({
            contactos: arraux
        })
    }

    habilitarEdicion() {
        this.edicion = true;
        this.forceUpdate()
    }

    handleEliminarContacto(e, i) {
        let arraux = this.state.contactos;
        arraux.splice(i, 1);
        return new Promise((resolve, reject) => {
            this.setState({
                contactos: arraux
            })
            resolve()
        }).then(() => {
            firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
                contactos: arraux
            });
        })

    }

    handleAdd(event) {
        firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
            contactos: this.state.contactos,
        });

        alert('Se han añadido personas de contacto del usuario con DNI ' + this.state.dni);

    }

    handleAnyadirContacto() {
        let arraux = this.state.contactos;
        if (arraux === undefined || arraux === null)
            arraux = []
        if (this.state.contactoNombre !== '' && this.state.contactoNumero !== '') {
            arraux.unshift({ nombre: this.state.contactoNombre, relacion: this.state.contactoRelacion, numero: this.state.contactoNumero, email: this.state.contactoEmail });
            this.setState({
                contactos: arraux
            })
            document.getElementById("formContacto").reset();
            this.setState({
                contactoEmail: '',
                contactoNombre: '',
                contactoNumero: '',
                contactoRelacion: ''
            })
            alert("Confirme sus cambios pulsando el botón [Registrar] en la  parte inferior de la pantalla")
        } else {
            alert("Introduzca al menos el nombre y el número de contacto")
        }

    }

    handleChange(event) {
        this.setState({ dni: event.target.value });
    }

    handleChangeContactoNombre(e) {
        this.setState({
            contactoNombre: e.target.value
        })
    }

    handleChangeContactoEmail(e) {
        this.setState({
            contactoEmail: e.target.value
        })
    }

    handleChangeContactoNumero(e) {
        this.setState({
            contactoNumero: e.target.value
        })
    }

    handleChangeContactoRelacion(e) {
        this.setState({
            contactoRelacion: e.target.value
        })
    }

    handleBuscar(event) {
        let nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase());
        nameRef.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.desactivado = false;
                this.setState({
                    name: snapshot.val().name + " " + snapshot.val().surname
                })
            }
        })

        nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('contactos');
        nameRef.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.setState({
                    contactos: snapshot.val()
                })
            }
        })

        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div>
                    <br></br>
                    <h1>Personas de contacto</h1>
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
                            {!this.edicion ?
                                <div className="contactos">
                                    {this.state.name ? <h2>Contactos de {this.state.name}</h2> : <div></div>}
                                    <hr></hr>
                                    {this.state.contactos ? this.state.contactos.map((contacto, i) =>
                                        <div>
                                            <div className="uncontacto">
                                                <p><b>Nombre:</b> {contacto.nombre}</p>
                                                <p><b>Número de teléfono:</b> {contacto.numero}</p>
                                                {contacto.relacion ? <p><b>Relación:</b> {contacto.relacion}</p> : <div></div>}
                                                {contacto.email ? <p><b>Email:</b> {contacto.email}</p> : <div></div>}
                                            </div>
                                            <Button disabled={this.desactivado} variant="danger" onClick={(event) => { if (window.confirm('¿Está seguro de que quiere eliminar este contacto?')) this.handleEliminarContacto(event, i) }}>
                                                X
                                    </Button>
                                            <hr></hr>
                                        </div>
                                    ) : console.log("adios")}
                                    <Button variant="warning" onClick={this.habilitarEdicion}>Editar</Button>
                                </div>
                                : <div className="contactosForm">
                                    {this.state.contactos ? this.state.contactos.map((contacto, i) =>
                                        <div className="uncontactoform">
                                            <Form>
                                                <Form.Label>Nombre</Form.Label>
                                                <Form.Control type="text" value={contacto.nombre} onChange={(e) => this.handleChangeNombreEditar(e, i)} />
                                                <Form.Label>Número de teléfono</Form.Label>
                                                <Form.Control type="text" value={contacto.numero} onChange={(e) => this.handleChangeNumeroEditar(e, i)} />
                                                <Form.Label>Relación</Form.Label>
                                                <Form.Control type="text" value={contacto.relacion} onChange={(e) => this.handleChangeRelacionEditar(e, i)} />
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="text" value={contacto.email} onChange={(e) => this.handleChangeEmailEditar(e, i)} />
                                                <hr></hr>
                                            </Form>
                                        </div>
                                    ) : console.log("adios")}
                                    <Button variant="primary" onClick={this.handleChangeEdicionContactos}>Confirmar Cambios</Button>
                                </div>
                            }
                            <br></br>
                            <h2>Dar de alta una nueva persona de contacto</h2>
                            <Form onSubmit={this.handleAdd} id="formContacto">
                                <Form.Group className="formTextoRecuerdo">
                                    <Form.Label className="label">Nombre del contacto*</Form.Label>
                                    <Form.Control disabled={this.desactivado} className="inputNombreContacto" type="text" placeholder="Nombre y apellidos de la persona de contacto" onChange={this.handleChangeContactoNombre} />
                                </Form.Group>

                                <Form.Group className="formRelacionContacto">
                                    <Form.Label className="label">Relación con el usuario</Form.Label>
                                    <Form.Control disabled={this.desactivado} className="inputRelacionContacto" type="text" placeholder="Marido, mujer, hijo, primo..." onChange={this.handleChangeContactoRelacion} />
                                </Form.Group>

                                <Form.Group className="formNumeroContacto">
                                    <Form.Label className="label">Número de teléfono del contacto*</Form.Label>
                                    <Form.Control disabled={this.desactivado} className="inputNumeroContacto" type="number" placeholder="Número de teléfono de la persona de contacto" onChange={this.handleChangeContactoNumero} />
                                </Form.Group>

                                <Form.Group className="formEmailContacto">
                                    <Form.Label className="label">Email del contacto</Form.Label>
                                    <Form.Control disabled={this.desactivado} className="inputEmailContacto" type="email" placeholder="Correo electrónico de la persona de contacto" onChange={this.handleChangeContactoEmail} />
                                </Form.Group>

                                <Button disabled={this.desactivado} className="botonAnyadirRecuerdo" onClick={this.handleAnyadirContacto}>
                                    Añadir un contacto nuevo
                        </Button>
                                <br></br><br></br>
                                <Button disabled={this.desactivado} className="submitUsuario" variant="primary" type="submit">
                                    Registrar
                        </Button>
                            </Form>
                            <br></br><br></br>
                        </div>
                        : <div></div>}
                </div>

            </div>
        );
    }
}