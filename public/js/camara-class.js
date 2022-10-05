class Camara {
    constructor(videoNode) {

        this.videoNode = videoNode;
    }

    encender() {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: { width: 300, height: 300 }
                })
                .then(stream => {
                    this.videoNode.srcObject = stream;
                    this.stream = stream;
                });
        }
    }

    apagar() {
        this.videoNode.pause(); //detiene el video-lo congela

        if (this.stream)
            this.stream.getTracks()[0].stop();

    }

    tomarfoto() {
        let canvas = document.createElement('canvas'); //elemento para poner la foto

        //dimenciones de la img
        canvas.setAttribute('width', 300);
        canvas.setAttribute('height', 300);

        //obtener el contexto del cnvas
        let context = canvas.getContext('2d');
        context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height); //creamos el dibujo

        this.foto = context.canvas.toDataURL();
        //limpieza
        canvas = null;
        context = "";

        return this.foto;
    }
}