import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import history from './history';
import Home from './Home/Home';
import NameForm from "./Buscar/NameForm";
import Registro from "./Nuevo/Registro";
import RegistroTerapeuta from "./NuevoTerapeuta/RegistroTerapeuta";
import EditForm from "./Editar/EditForm";
import AddForm from "./Anadir/AddForm";
import ListarUsuarios from "./UsuariosTerapeuta/ListarUsuarios";
import EditFormTerapeuta from "./EditarTerapeuta/EditFormTerapeuta";
import AnadirMultimedia from "./Multimedia/AnadirMultimedia";
import Historia from "./HistoriaDeVida/Historia";
import DiagnosticoClinico from "./EvaluacionClinica/DiagnosticoClinico";
import PersonasDeContacto from "./Contactos/PersonasDeContacto";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/TFG-20-21" exact component={Home} />
                    <Route path="/TFG-20-21/buscarUsuario" component={NameForm} />
                    <Route path="/TFG-20-21/nuevoUsuario" component={Registro} />
                    <Route path="/TFG-20-21/nuevoTerapeuta" component={RegistroTerapeuta} />
                    <Route path="/TFG-20-21/editarUsuario" component={EditForm} />
                    <Route path="/TFG-20-21/anadirInformacion" component={AddForm} />
                    <Route path="/TFG-20-21/usuariosTerapeuta" component={ListarUsuarios} />
                    <Route path="/TFG-20-21/editarTerapeuta" component={EditFormTerapeuta} />
                    <Route path="/TFG-20-21/anadirMultimedia" component={AnadirMultimedia} />
                    <Route path="/TFG-20-21/historiaDeVida" component={Historia} />
                    <Route path="/TFG-20-21/evaluacionClinica" component={DiagnosticoClinico} />
                    <Route path="/TFG-20-21/contactos" component={PersonasDeContacto} />
                    <Route path="/" component={Home} />
                </Switch>
            </Router>
        )
    }
}