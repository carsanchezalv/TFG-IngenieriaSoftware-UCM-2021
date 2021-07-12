import React from 'react';
import './Historia.css';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import { jsPDF } from "jspdf";

export default class Historia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dni: '',
            surname: '',
            date: '',
            gender: '',
            recuerdos: [],
            relaciones: [],
            caracteristicas: [],
            seleccionDeUsuario: []
        };
        this.storage = firebase.storage();

        this.nuevo = true;
        this.desactivado = true;
        this.historiaFinal = ''
        this.infancia = false;
        this.adolescencia = false;
        this.juventud = false;
        this.madurez = false;
        this.positiva = false;
        this.neutra = false;
        this.negativa = false;
        this.completo = false;
        this.parcial = false;
        this.parcialPistas = false;
        this.perdido = false;
        this.personas = [];
        this.histArray = [];
        this.personasBuscadas = '';
        this.selectRef = null;
        this.desactivadoHist = true;
        this.sinFiltros = false;
        this.agrupar = "etapas";
        this.orden = "ascendente";
        this.dniNuevo = '';

        this.etapa = '';
        this.tono = '';
        this.memoria = '';

        this.handleChange = this.handleChange.bind(this);
        this.handleBuscar = this.handleBuscar.bind(this);
        this.handleChangeInfancia = this.handleChangeInfancia.bind(this);
        this.handleChangeAdolescencia = this.handleChangeAdolescencia.bind(this);
        this.handleChangeJuventud = this.handleChangeJuventud.bind(this);
        this.handleChangeMadurez = this.handleChangeMadurez.bind(this);
        this.handleChangePositiva = this.handleChangePositiva.bind(this);
        this.handleChangeNeutra = this.handleChangeNeutra.bind(this);
        this.handleChangeNegativa = this.handleChangeNegativa.bind(this);
        this.handleChangePerdido = this.handleChangePerdido.bind(this);
        this.handleChangeCompleto = this.handleChangeCompleto.bind(this);
        this.handleChangeParcialPistas = this.handleChangeParcialPistas.bind(this);
        this.handleChangeParcial = this.handleChangeParcial.bind(this);
        this.handleChangeSinFiltros = this.handleChangeSinFiltros.bind(this);
        this.handleChangeAgrupar = this.handleChangeAgrupar.bind(this);
        this.handleChangeOrden = this.handleChangeOrden.bind(this);
        this.handleChangePdf = this.handleChangePdf.bind(this);

        this.generarAll = this.generarAll.bind(this);
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

    calculateAge(date) {
        let birthday = Date.parse(date);
        let ageDifMs = Date.now() - birthday;
        let ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    handleChangePdf(event) {
        this.historiaFinal = '';
        const doc = new jsPDF();
        let pageHeight = doc.internal.pageSize.height;
        
        this.histArray.length > 0 ? this.histArray.map((ele) => {
            this.historiaFinal += ele + '\n\n';
        }) : console.log("Sin datos");

        
        let hist = doc.splitTextToSize(this.historiaFinal, 170);
        let titulo = doc.splitTextToSize("Historia de vida generada para\n" + this.state.name + " " + this.state.surname + "\n\n", 120);

        let filtros = '';
        let filtroMaster = doc.splitTextToSize('Elementos seleccionados:\n', 100);
        doc.setFontSize(18);
        doc.text(filtroMaster, 104, 40, { align: "center", maxWidth: 170 });

        let filtroTitulo = "Etapas mostradas\n";
        if (this.etapa !== '') {
            this.etapa.split(',').map((et, i) => {
                if (i < this.etapa.split(',').length - 1) {
                    filtros += doc.splitTextToSize('\u2022 ' + et, 100);
                    filtros += '\n';
                }
            });
        }
        else {
            filtros = doc.splitTextToSize("Nada seleccionado", 100)
        }
        doc.setFontSize(16);
        doc.setFont("arial", "italic");
        doc.text(filtroTitulo, 20, 60, { align: "left", maxWidth: 170 })
        doc.setFontSize(14);
        doc.setFont("arial", "normal");
        doc.text(filtros + '\n', 22, 70, { align: "left", maxWidth: 170 })

        filtros = '';
        filtroTitulo = "Emociones mostradas\n";
        if (this.tono !== '') {
            this.tono.split(',').map((ton, i) => {
                if (i < this.tono.split(',').length - 1) {
                    filtros += doc.splitTextToSize('\u2022 ' + ton, 100);
                    filtros += '\n';
                }
            });
        }
        else {
            filtros = doc.splitTextToSize("Nada seleccionado", 100)
        }
        doc.setFontSize(16);
        doc.setFont("arial", "italic");
        doc.text(filtroTitulo, 70, 60, { align: "left", maxWidth: 170 })
        doc.setFontSize(14);
        doc.setFont("arial", "normal");
        if (this.tono !== '')
            doc.text(filtros + '\n', 72, 70, { align: "left", maxWidth: 170 })
        else
            doc.text(filtros + '\n', 77, 70, { align: "left", maxWidth: 170 })

        filtros = '';
        filtroTitulo = "Recuerdos mostrados\n";
        if (this.memoria != '') {
            this.memoria.split(',').map((mem, i) => {
                if (i < this.memoria.split(',').length - 1) {
                    filtros += doc.splitTextToSize('\u2022 ' + mem, 100);
                    filtros += '\n';
                }
            });
        }
        else {
            filtros = doc.splitTextToSize("Nada seleccionado", 100)
        }
        doc.setFontSize(16);
        doc.setFont("arial", "italic");
        doc.text(filtroTitulo, 130, 60, { align: "left", maxWidth: 170 })
        doc.setFontSize(14);
        doc.setFont("arial", "normal");
        if (this.memoria != '')
            doc.text(filtros + '\n', 132, 70, { align: "left", maxWidth: 170 })
        else
            doc.text(filtros + '\n', 137, 70, { align: "left", maxWidth: 170 })

        filtros = '';
        filtroTitulo = "Relaciones mostradas";
        if (this.personasBuscadas != '') {
            this.personasBuscadas.split(',').map((rel, i) => {
                if (i < this.personasBuscadas.split(',').length - 1) {
                    if (i > 0)
                        filtros += doc.splitTextToSize(', ' + rel, 100);
                    else
                        filtros += doc.splitTextToSize(rel, 100);
                }
            });
        }
        else {
            filtros = doc.splitTextToSize("Nada seleccionado", 100)
        }
        doc.setFontSize(16);
        doc.setFont("arial", "italic");
        doc.text(filtroTitulo, 104, 115, { align: "center", maxWidth: 170 })
        doc.setFontSize(14);
        doc.setFont("arial", "normal");
        doc.text(filtros + '\n', 104, 125, { align: "center", maxWidth: 170 })

        filtroTitulo = "Agrupado por: ";
        filtros = doc.splitTextToSize(this.agrupar.charAt(0).toUpperCase() + this.agrupar.slice(1));
        doc.setFontSize(16);
        doc.setFont("arial", "italic");
        doc.text(filtroTitulo, 38, 100, { align: "left", maxWidth: 170 })
        doc.setFontSize(14);
        doc.setFont("arial", "normal");
        doc.text(filtros, 73, 100, { align: "left", maxWidth: 170 })

        filtroTitulo = "Ordenación: ";
        filtros = doc.splitTextToSize(this.orden.charAt(0).toUpperCase() + this.orden.slice(1));
        doc.setFontSize(16);
        doc.setFont("arial", "italic");
        doc.text(filtroTitulo, 118, 100, { align: "left", maxWidth: 170 })
        doc.setFontSize(14);
        doc.setFont("arial", "normal");
        doc.text(filtros, 148, 100, { align: "left", maxWidth: 170 })

        doc.setFont("arial", "bold");
        doc.setFontSize(20);
        doc.text(titulo, 104, 15, { align: "center", maxWidth: 150 });

        let alt = 130 + ((this.personasBuscadas.length/80) + 1) * 5;
        let lin = 0;
        doc.setFont("arial", "normal");
        doc.setFontSize(17);
        hist.map((linea) => {
            lin = linea.length;
            alt += 8;
            if(alt >= pageHeight - 20) {
                pageHeight += doc.internal.pageSize.height;
                doc.addPage();
                alt = 25;
            }
            doc.text(linea, 20, alt, { align: "left", maxWidth: 170 });
        });

        let name = "REPORTE-" + Date.now() + ".pdf";
        doc.save(name);
    }

    handleChangeAgrupar(event) {
        this.agrupar = event.target.value;
        this.forceUpdate();
    }

    handleChangeOrden(event) {
        this.orden = event.target.value;
        this.forceUpdate();
    }

    generarAll() {
        this.etapa = '';
        this.tono = '';
        this.memoria = '';
        this.histArray = [];
        
        let vacio = true;

        this.histArray.push("Esta persona se llama " + this.state.name + " " + this.state.surname + ". " +
            "Actualmente tiene " + this.calculateAge(this.state.date) + " años y es originaria de " +
            this.state.caracteristicas.nationality + ". ");

        if (this.infancia || this.sinFiltros)
            this.etapa += "Infancia,";
        if (this.adolescencia || this.sinFiltros)
            this.etapa += "Adolescencia,";
        if (this.juventud || this.sinFiltros)
            this.etapa += "Vida adulta joven,";
        if (this.madurez || this.sinFiltros)
            this.etapa += "Vida adulta madura,";

        if (this.positiva || this.sinFiltros)
            this.tono += "Positiva,";
        if (this.neutra || this.sinFiltros)
            this.tono += "Neutral,";
        if (this.negativa || this.sinFiltros)
            this.tono += "Negativa,";

        if (this.completo || this.sinFiltros)
            this.memoria += "Recuerdo completo,";
        if (this.parcial || this.sinFiltros)
            this.memoria += "Recuerdo parcial sin pistas,";
        if (this.parcialPistas || this.sinFiltros)
            this.memoria += "Recuerdo parcial con pistas,";
        if (this.perdido || this.sinFiltros)
            this.memoria += "Recuerdo perdido,";

        switch (this.agrupar) {
            case "etapas":
                let cont = this.etapa.split(",").length - 1;
                let posicion = this.etapa.split(',').length - 2;

                if (this.orden === "ascendente")
                    posicion = 0;

                let loQueToca = this.etapa.split(',')[posicion];

                while (loQueToca !== "Fin" && cont > 0) {
                    if (this.etapa.includes("Infancia") && loQueToca.includes("Infancia")) {
                        --cont;
                        let inf = '';
                        this.state.relaciones !== undefined ? this.state.relaciones.map((rel) => {
                            if (this.personasBuscadas.includes(rel.nombre) || this.sinFiltros) {
                                let pers = "Con " + rel.nombre + ", su " + rel.tipo.toLowerCase() + ", ";
                                rel.experiencias !== undefined ? rel.experiencias.map((exp) => {
                                    if (this.tono.includes(exp.emocion) && exp.fecha.includes("Infancia")) {
                                        vacio = false;
                                        pers += exp.texto + ", una experiencia " + exp.emocion.toLowerCase() + ". "
                                    }
                                }) : console.log("Sin experiencias");
                                if (!vacio)
                                    inf += pers;
                                vacio = true;
                            }
                        }) : console.log("Vacío");
                        if (inf !== '')
                            this.histArray.push("Vivencias en la infancia: " + inf);
                        if (this.orden === "ascendente")
                            ++posicion;
                        else
                            --posicion;
                        if (cont > 0)
                            loQueToca = this.etapa.split(',')[posicion];
                    }
                    if (this.etapa.includes("Adolescencia") && loQueToca.includes("Adolescencia")) {
                        --cont;
                        let ado = '';
                        this.state.relaciones !== undefined ? this.state.relaciones.map((rel) => {
                            if (this.personasBuscadas.includes(rel.nombre) || this.sinFiltros) {
                                let pers = "Con " + rel.nombre + ", su " + rel.tipo.toLowerCase() + ", ";
                                rel.experiencias !== undefined ? rel.experiencias.map((exp) => {
                                    if (this.tono.includes(exp.emocion) && exp.fecha.includes("Adolescencia")) {
                                        vacio = false;
                                        pers += exp.texto + ", una experiencia " + exp.emocion.toLowerCase() + ". "
                                    }
                                }) : console.log("Sin experiencias");               
                                if (!vacio)
                                    ado += pers;
                                vacio = true;
                            }
                        }) : console.log("Vacío");
                        if (ado !== '')
                            this.histArray.push("Vivencias en la adolescencia: " + ado);
                        if (this.orden === "ascendente")
                            ++posicion;
                        else
                            --posicion;
                        if (cont > 0)
                            loQueToca = this.etapa.split(',')[posicion];
                    }
                    if (this.etapa.includes("joven") && loQueToca.includes("joven")) {
                        --cont;
                        let jov = '';
                        this.state.relaciones !== undefined ? this.state.relaciones.map((rel) => {
                            if (this.personasBuscadas.includes(rel.nombre) || this.sinFiltros) {
                                let pers = "Con " + rel.nombre + ", su " + rel.tipo.toLowerCase() + ", ";
                                rel.experiencias !== undefined ? rel.experiencias.map((exp) => {
                                    if (this.tono.includes(exp.emocion) && exp.fecha.includes("joven")) {
                                        vacio = false;
                                        pers += exp.texto + ", una experiencia " + exp.emocion.toLowerCase() + ". "
                                    }
                                }) : console.log("Sin experiencias");
                                if (!vacio)
                                    jov += pers;
                                vacio = true;
                            }
                        }) : console.log("Vacío");
                        if (jov !== '')
                            this.histArray.push("Vivencias en la vida adulta joven: " + jov);
                        if (this.orden === "ascendente")
                            ++posicion;
                        else
                            --posicion;
                        if (cont > 0)
                            loQueToca = this.etapa.split(',')[posicion];
                    }
                    if (this.etapa.includes("madura") && loQueToca.includes("madura")) {
                        --cont;
                        let mad = '';
                        this.state.relaciones !== undefined ? this.state.relaciones.map((rel) => {
                            if (this.personasBuscadas.includes(rel.nombre) || this.sinFiltros) {
                                let pers = "Con " + rel.nombre + ", su " + rel.tipo.toLowerCase() + ", ";
                                rel.experiencias !== undefined ? rel.experiencias.map((exp) => {
                                    if (this.tono.includes(exp.emocion) && exp.fecha.includes("madura")) {
                                        vacio = false;
                                        pers += exp.texto + ", una experiencia " + exp.emocion.toLowerCase() + ". "
                                    }
                                }) : console.log("Sin experiencias");
                                if (!vacio)
                                    mad += pers;
                                vacio = true;
                            }
                        }) : console.log("Vacío");
                        if (mad !== '')
                            this.histArray.push("Vivencias en la vida adulta madura: " + mad);
                        if (this.orden === "ascendente")
                            ++posicion;
                        else
                            --posicion;
                        if (cont > 0)
                            loQueToca = this.etapa.split(',')[posicion];
                    }
                }
                break;

            case "relaciones":
                let hist = "";
                this.state.relaciones !== undefined ? this.state.relaciones.map((rel) => {
                    if (this.personasBuscadas.includes(rel.nombre) || this.sinFiltros) {
                        if(rel.experiencias !== undefined) {
                            let pers = "Vivencias con " + rel.nombre + ", su " + rel.tipo.toLowerCase() + ": ";
                            
                            let expArray = [];
                            if (this.orden !== "ascendente") {
                                for(let i = rel.experiencias.length -1; i >= 0 ; --i) {
                                    expArray.push(rel.experiencias[i]);
                                }
                            }
                            else
                                expArray = rel.experiencias;
                                
                            expArray.map((exp) => {
                                if (this.tono.includes(exp.emocion) && this.etapa.includes(exp.fecha)) {
                                    vacio = false;                                    
                                    pers += "En " + exp.fecha.toLowerCase() + ". " + exp.texto[0].toUpperCase() + exp.texto.slice(1, exp.texto.length).toLowerCase() + ", una experiencia " + exp.emocion.toLowerCase() + ". "
                                }
                            })
                            if (!vacio)
                                hist += pers;
                            vacio = true;
                        }
                    }
                    if (hist !== "") {
                        this.histArray.push(hist);
                        hist = "";
                    }
                }) : console.log("Vacío");
                break;

            case "emociones":
                let nadaNeg = true;
                let nadaNeu = true;
                let nadaPos = true;
                let vacioNeg = true;
                let vacioNeu = true;
                let vacioPos = true;
                let neg = "Experiencias negativas: ";
                let neu = "Experiencias neutras: ";
                let pos = "Experiencias positivas: ";

                this.state.relaciones !== undefined ? this.state.relaciones.map((rel) => {
                    if (this.personasBuscadas.includes(rel.nombre) || this.sinFiltros) {
                        let pers = "Con " + rel.nombre + ", su " + rel.tipo.toLowerCase();
                        let pNeg = "";
                        let pNeu = "";
                        let pPos = "";

                        rel.experiencias !== undefined ? rel.experiencias.map((exp) => {
                            if(this.tono.includes(exp.emocion)) {
                                if (exp.emocion.includes("Negativa") && this.etapa.includes(exp.fecha)) {
                                    vacioNeg = false;
                                    pNeg += ", en " + exp.fecha.toLowerCase() + ", " + exp.texto.toLowerCase();
                                }
                                else if (exp.emocion.includes("Neutral") && this.etapa.includes(exp.fecha)) {
                                    vacioNeu = false;
                                    pNeu += ", en " + exp.fecha.toLowerCase() + ", " + exp.texto.toLowerCase();
                                }
                                else if (exp.emocion.includes("Positiva") && this.etapa.includes(exp.fecha)) {
                                    vacioPos = false;
                                    pPos += ", en " + exp.fecha.toLowerCase() + ", " + exp.texto.toLowerCase();
                                }
                            }
                        }) : console.log("Sin experiencias");
                        if (!vacioNeg) {
                            nadaNeg = false;
                            neg += pers + pNeg + ". ";
                        }
                        if (!vacioNeu) {
                            nadaNeu = false;
                            neu += pers + pNeu + ". ";
                        }
                        if (!vacioPos) {
                            nadaPos = false;
                            pos += pers + pPos + ". ";
                        }
                        vacioNeg = true;
                        vacioNeu = true;
                        vacioPos = true;
                    }
                }) : console.log("Vacío");

                if (this.orden === "ascendente") {
                    if (!nadaNeg) {
                        nadaNeg = true;
                        this.histArray.push(neg);
                    }
                    if (!nadaNeu) {
                        nadaNeu = true;
                        this.histArray.push(neu);
                    }
                    if (!nadaPos) {
                        nadaPos = true;
                        this.histArray.push(pos);
                    }
                }
                else {
                    if (!nadaPos) {
                        nadaPos = true;
                        this.histArray.push(pos);
                    }
                    if (!nadaNeu) {
                        nadaNeu = true;
                        this.histArray.push(neu);
                    }
                    if (!nadaNeg) {
                        nadaNeg = true;
                        this.histArray.push(neg);
                    }
                }
                break;
            default:
                break;
        }

        let recs = '';
        this.state.recuerdos !== undefined ? this.state.recuerdos.some((rec) => {   
            if ((this.memoria.includes(rec.estado) && this.etapa.includes(rec.fecha) && this.tono.includes(rec.emocion)) || this.sinFiltros) {
                recs += "En la etapa de " + rec.fecha.toLowerCase() + ", " + rec.texto.toLowerCase() + ", produciéndole una emoción " + rec.emocion.toLowerCase() + ", tratándose de un " + rec.estado.toLowerCase() + ". "
            }
        }) : console.log("Recuerdos vacíos")
        if (recs !== '')
            this.histArray.push("Recuerdos del usuario: " + recs);

        this.desactivadoHist = false;
        this.forceUpdate();
    }

    handleChangeSinFiltros(event) {
        this.sinFiltros = !this.sinFiltros;
        this.selectRef = this.personas;
        this.madurez = true;
        this.juventud = true;
        this.adolescencia = true;
        this.infancia = true;
        this.positiva = true;
        this.neutra = true;
        this.negativa = true;
        this.completo = true;
        this.parcial = true;
        this.parcialPistas = true;
        this.perdido = true;
        this.personasBuscadas = '';

        this.selectRef.map((sel) =>
            this.personasBuscadas += sel.value + ', '
        );
        this.forceUpdate();
    }

    handleChangePerdido(event) {
        this.perdido = !this.perdido;
        this.forceUpdate();
    }

    handleChangeParcial(event) {
        this.parcial = !this.parcial;
        this.forceUpdate();
    }

    handleChangeCompleto(event) {
        this.completo = !this.completo;
        this.forceUpdate();
    }

    handleChangeParcialPistas(event) {
        this.parcialPistas = !this.parcialPistas;
        this.forceUpdate();
    }

    handleChangePersonas = selectedOption => {
        this.personasBuscadas = '';
        this.selectRef = selectedOption;
        this.selectRef.map((sel) =>
            this.personasBuscadas += sel.value + ', '
        );
        this.forceUpdate();
    }

    handleChangeNegativa(event) {
        this.negativa = !this.negativa;
        this.forceUpdate();
    }

    handleChangeNeutra(event) {
        this.neutra = !this.neutra;
        this.forceUpdate();
    }

    handleChangePositiva(event) {
        this.positiva = !this.positiva;
        this.forceUpdate();
    }

    handleChangeMadurez(event) {
        this.madurez = !this.madurez;
        this.forceUpdate();
    }

    handleChangeJuventud(event) {
        this.juventud = !this.juventud;
        this.forceUpdate();
    }

    handleChangeAdolescencia(event) {
        this.adolescencia = !this.adolescencia;
        this.forceUpdate();
    }

    handleChangeInfancia(event) {
        this.infancia = !this.infancia;
        this.forceUpdate();
    }

    handleChange(event) {
        this.dniNuevo = event.target.value;
    }

    handleBuscar(event) {
        if (!this.nuevo)
            this.selectRef = null;
        else
            this.nuevo = false;

        this.desactivado = true;
        this.historiaFinal = ''
        this.infancia = false;
        this.adolescencia = false;
        this.juventud = false;
        this.madurez = false;
        this.positiva = false;
        this.neutra = false;
        this.negativa = false;
        this.completo = false;
        this.parcial = false;
        this.parcialPistas = false;
        this.perdido = false;
        this.personas = [];
        this.personasBuscadas = '';
        this.desactivadoHist = true;
        this.sinFiltros = false;
        this.agrupar = "etapas";
        this.orden = "ascendente";

        this.etapa = '';
        this.tono = '';
        this.memoria = '';

        let usuario = firebase.database().ref("usuarios").child(this.dniNuevo.toUpperCase());
        usuario.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.desactivado = false;
                this.setState({
                    dni: snapshot.val().dni,
                    name: snapshot.val().name,
                    surname: snapshot.val().surname,
                    date: snapshot.val().date,
                    gender: snapshot.val().gender,
                    recuerdos: snapshot.val().recuerdos,
                    relaciones: snapshot.val().relaciones,
                    caracteristicas: snapshot.val().caracteristicas
                })
                let rels = snapshot.val().relaciones;
                if (rels === undefined)
                    rels = [];
                rels.map((r) =>
                    this.personas.push({
                        value: r.nombre + ' (' + r.tipo + ')',
                        label: r.nombre + ' (' + r.tipo + ')',
                    })
                );
            }
        })
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <br></br>
                <h1>Historia de vida</h1>

                <Form id="buscarHist" onSubmit={this.handleBuscar}>
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
                        <div className="form-filtro">
                            <div className="search-filtro">
                                <h3>Historia de vida del usuario {this.state.name} {this.state.surname}</h3>
                            </div>

                            <div>
                                <Form id="generarHist" onSubmit={this.generarAll}>

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.sinFiltros}
                                                onChange={this.handleChangeSinFiltros}
                                                name="checkedB"
                                                color="primary"
                                            />
                                        }
                                        label="Generar historia completa sin filtros"
                                    />

                                    <br></br><br></br>

                                    <Select
                                        id="selectPeople"
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={this.selectRef}
                                        options={this.personas}
                                        name="relaciones"
                                        placeholder="Filtrar relaciones"
                                        onChange={this.handleChangePersonas}
                                        isMulti
                                        isSearchable
                                        isDisabled={this.sinFiltros}
                                    />

                                    <br></br>

                                    <h5>Etapas de vida:</h5>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.infancia}
                                                onChange={this.handleChangeInfancia}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Infancia"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.adolescencia}
                                                onChange={this.handleChangeAdolescencia}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Adolescencia"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.juventud}
                                                onChange={this.handleChangeJuventud}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Vida adulta joven"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.madurez}
                                                onChange={this.handleChangeMadurez}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Vida adulta madura"
                                    />

                                    <br></br><br></br>

                                    <h5>Tono emocional de experiencias y recuerdos:</h5>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.positiva}
                                                onChange={this.handleChangePositiva}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Positiva"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.neutra}
                                                onChange={this.handleChangeNeutra}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Neutra"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.negativa}
                                                onChange={this.handleChangeNegativa}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Negativa"
                                    />

                                    <br></br><br></br>

                                    <h5>Estado de la memoria del recuerdo:</h5>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.completo}
                                                onChange={this.handleChangeCompleto}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Completo"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.parcial}
                                                onChange={this.handleChangeParcial}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Parcial sin pistas"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.parcialPistas}
                                                onChange={this.handleChangeParcialPistas}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Parcial con pistas"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.perdido}
                                                onChange={this.handleChangePerdido}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.sinFiltros}
                                            />
                                        }
                                        label="Perdido"
                                    />

                                    <br></br><br></br>

                                    <div class="ordenaciones">
                                        <span>
                                            <h5>Agrupar por:</h5>
                                            <FormControl component="fieldset">
                                                <RadioGroup row value={this.agrupar} onChange={this.handleChangeAgrupar} >
                                                    <FormControlLabel value="etapas" control={<Radio />} label="Por etapas" />
                                                    <FormControlLabel value="relaciones" control={<Radio />} label="Por relaciones" />
                                                    <FormControlLabel value="emociones" control={<Radio />} label="Por tono emocional" />
                                                </RadioGroup>
                                            </FormControl>
                                        </span>

                                        <span>
                                            <h5>Ordenación:</h5>
                                            <FormControl component="fieldset">
                                                <RadioGroup row value={this.orden} onChange={this.handleChangeOrden} >
                                                    <FormControlLabel value="ascendente" control={<Radio />} label="Ascendente" />
                                                    <FormControlLabel value="descendente" control={<Radio />} label="Descendente" />
                                                </RadioGroup>
                                            </FormControl>
                                        </span>
                                    </div>

                                    <br></br>

                                    <Button className="filtrarHist" onClick={this.generarAll}>
                                        Generar
                                    </Button>

                                    <br></br><br></br>
                                </Form>
                            </div>
                            {!this.desactivadoHist ?
                                <div class="historieta">
                                    <h4>Historia generada</h4>
                                    <div>
                                        <p>{this.histArray[0]}</p>
                                        <ul className="historiaGeneradaLista">
                                            {this.histArray.map((ele, i) =>
                                                i > 0 ?
                                                    <li>{ele}</li>
                                                : console.log("Intro")
                                            )}
                                        </ul>
                                    </div>
                                    <br></br><br></br>
                                    <Button className="pdf" onClick={this.handleChangePdf}>
                                        Descargar PDF
                                    </Button>
                                </div>
                                : console.log("no hay historia")}
                            <br></br>
                        </div>
                    </div>
                : console.log("no activo")}
            </div>
        )
    }
}