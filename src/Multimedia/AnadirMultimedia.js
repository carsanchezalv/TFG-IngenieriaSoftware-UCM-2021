import React from 'react';
import './AnadirMultimedia.css';
import { Form, Button } from 'react-bootstrap';
import firebase from 'firebase';
import { LinearProgress, CircularProgress } from '@material-ui/core/';

class AnadirMultimedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dni: '',
            images: [],
            urls: [],
            audios: [],
            videos: [],
            urlsAudios: [],
            urlsVideos: [],
            seleccionDeUsuario: []
        };
        this.storage = firebase.storage();

        this.desactivado = true;
        this.desactivadoMulti = true;
        this.progress = 0;
        this.archivos = 0;
        this.archivosTotales = 0;
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeImagen = this.handleChangeImagen.bind(this);
        this.handleChangeAudio = this.handleChangeAudio.bind(this);
        this.handleChangeVideo = this.handleChangeVideo.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleBuscar = this.handleBuscar.bind(this);
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

    handleAdd(event) {

        firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).update({
            urls: this.state.urls,
            urlsAudios: this.state.urlsAudios,
            urlsVideos: this.state.urlsVideos
        });

        alert('Se ha añadido información multimedia del usuario con DNI ' + this.state.dni);
        //event.preventDefault();
    }

    handleChange(event) {
        this.setState({ dni: event.target.value });
    }

    async handleChangeImagen(e) {
        return new Promise(async (resolve, reject) => {
            if (e.target.files[0]) {
                this.desactivado = true;
                const images = e.target.files;
                this.setState({ images: images });
                this.archivosTotales = images.length;
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
        }).catch(error => {
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

            } else
                reject("error");
        }).then(response => {
            this.progress = 100;
            console.log(this.state.urlsAudios);
            this.desactivado = false;
            this.progress = 0;
            this.archivos = 0;
            this.archivosTotales = 0;
        }).catch(error => {
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
            } else
                reject("error");

        }).then(response => {
            this.progress = 100;
            console.log(this.state.urlsVideos);
            this.desactivado = false;
            this.progress = 0;
            this.archivos = 0;
            this.archivosTotales = 0;
        }).catch(error => {
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
                            aux = []
                        aux.push(url);
                        this.setState({
                            urls: aux
                        })
                    }
                );
            }
            else
                alert("Error al insertar imágenes");
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
                            aux = []
                        aux.push(url);
                        this.setState({
                            urlsAudios: aux
                        })
                    }
                );
            }
            else
                alert("Error al insertar audios")
        });
    }

    async hacerVideos(video) {
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
                        let aux = this.state.urlsVideos;
                        if (aux === null)
                            aux = []
                        aux.push(url);
                        this.setState({
                            urlsVideos: aux
                        })
                    }
                );
            }
            else
                alert("Error al insertar vídeos")
        });
    }

    handleBuscar(event) {
        let nameRef = firebase.database().ref("usuarios").child(this.state.dni.toUpperCase()).child('name');
        nameRef.on('value', (snapshot) => {
            if (snapshot.val() !== undefined) {
                this.desactivado = false;
                this.desactivadoMulti = false;
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

        event.preventDefault();
    }

    render() {
        return (
            <div>
                <br></br>
                <h1>Multimedia</h1>
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
                    
                    {!this.desactivadoMulti ? 
                    <Form onSubmit={this.handleAdd} id="formMultimedia">
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

                        <br></br>

                        <Button disabled={this.desactivado} className="submitUsuario" variant="primary" type="submit">
                            Registrar archivos
                        </Button>

                        <br></br><br></br>

                        {this.progress !== 0 ? <LinearProgress variant="determinate" value={this.progress} /> : console.log("el progreso es 0")}

                        <br></br><br></br>

                        {this.progress !== 0 ? <CircularProgress value={this.progress} /> : console.log("el progreso es 0 bro")}
                        {this.progress !== 0 ? <CircularProgress color="secondary" value={this.progress} /> : console.log("el progreso es 0")}

                        <br></br><br></br>

                        {this.progress !== 0 ? <p>{this.archivos} archivos transferidos de {this.archivosTotales} archivos totales. </p> : console.log("el progreso es 0")}

                    </Form> : console.log("Sin DNI seleccionado")}
                    <br></br>
                </div>
            </div>
        );
    }
}

export default AnadirMultimedia;