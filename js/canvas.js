var CanvasForSign = {


    // Variables pour suivre la position de la souris et l'état du bouton gauche
    mouseX: 0,
    mouseY: 0,
    mouseDown: 0,

    // Variables pour suivre la position du toucher

    touchX: 0,
    touchY: 0,
    // Garde une trace de la dernière position lorsque l'on trace une ligne

    lastX: -1,
    lastY: -1,
    isSign: false,
    // Configuration du canvas et ajout du gestionnaires d'événements une fois la page chargée.

    init: function () {
        // Get the specific canvas element from the HTML document
        //this.
        ctx = document.getElementById('canvas-sign').getContext('2d');

        // document.getElementById('submit').style.display = "none";

        // Réagi aux événements de la souris sur le canvas et à la souris sur tout le document 

        document.getElementById('canvas-sign').addEventListener('mousedown', this.sketchpad_mouseDown.bind(this), false);
        document.getElementById('canvas-sign').addEventListener('mousemove', this.sketchpad_mouseMove.bind(this), false);
        window.addEventListener('mouseup', this.sketchpad_mouseUp.bind(this), false);

        // Réagi au touché du doigt sur la canvas
        document.getElementById('canvas-sign').addEventListener('touchstart', this.sketchpad_touchStart.bind(this), false);
        document.getElementById('canvas-sign').addEventListener('touchend', this.sketchpad_touchEnd.bind(this), false);
        document.getElementById('canvas-sign').addEventListener('touchmove', this.sketchpad_touchMove.bind(this), false);

        // Réinitialise le canvas au clic du bouton "Effacer"
        document.getElementById('erase').addEventListener('click', function () {
            ctx.clearRect(0, 0, document.getElementById('canvas-sign').width, document.getElementById('canvas-sign').height);
            // document.getElementById('submit').style.display = "none";
        });

    },

    // Trace une ligne entre la position spécifiée sur le canvas
    // Définition des paramètres: canvas context,  x position,  y position, taille du tracée des points

    drawLine: function (ctx, x, y, size) {

        // If lastX is not set, set lastX and lastY to the current position
        if (this.lastX == -1) {
            this.lastX = x;
            this.lastY = y;
        }

        // Select a fill style
        ctx.strokeStyle = "#000000";

        // Set the line "cap" style to round, so lines at different angles can join into each other
        ctx.lineCap = "round";
        //ctx.lineJoin = "round";


        // Draw a filled line
        ctx.beginPath();

        // First, move to the old (previous) position
        ctx.moveTo(this.lastX, this.lastY);

        // Now draw a line to the current touch/pointer position
        ctx.lineTo(x, y);

        // Set the line thickness and draw the line
        ctx.lineWidth = size;
        ctx.stroke();

        ctx.closePath();

        // Update the last position to reference the current position
        this.lastX = x;
        this.lastY = y;
    },



    // Permet de tracer au clic du bouton de la souris et dessiner

    sketchpad_mouseDown: function () {
        this.mouseDown = 1;
        this.drawLine(ctx, this.mouseX, this.mouseY, 4);
    },

    // Garde une trace du moment ou le clic de la souris est relaché
    sketchpad_mouseUp: function () {
        this.mouseDown = 0;

        // Réinitiliase lastX et lastY à -1 pour indiquer qu'ils sont maintenant invalides

        this.lastX = -1;
        this.lastY = -1;
    },

    // Garde une trace de la position de la souris et dessine un point si le bouton de la souris est clické

    sketchpad_mouseMove: function (e) {
        // Update the mouse co-ordinates when moved
        this.getMousePos(e);

        // Commence à dessiner si le bouton est clické
        if (this.mouseDown == 1) {
            this.drawLine(ctx, this.mouseX, this.mouseY, 4);
        }
    },

    // Get the current mouse position relative to the top-left of the canvas
    getMousePos: function (e) {
        if (!e)
            var e = event;
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
    },

    // Dessine lorsque on appui sur le canvas
    sketchpad_touchStart: function (e) {
        // Update the touch co-ordinates
        this.getTouchPos();

        this.drawLine(ctx, this.touchX, this.touchY, 4);

        // Prevents an additional mousedown event being triggered
        event.preventDefault();
    },

    sketchpad_touchEnd: function () {
        // Réinitiliase lastX et lastY à -1 pour indiquer qu'ils sont maintenant invalides
        this.lastX = -1;
        this.lastY = -1;
    },

    // Draw something and prevent the default scrolling when touch movement is detected 
    sketchpad_touchMove: function (e) {
        // Update the touch co-ordinates
        this.getTouchPos(e);


        this.drawLine(ctx, this.touchX, this.touchY, 4);

        // Detect le scrolling
        event.preventDefault();
    },

    getTouchPos: function (e) {
        if (!e)
            var e = event;

        if (e.touches) {
            if (e.touches.length == 1) { // Fonctionne uniquement avec un seul doigt
                var touch = e.touches[0];
                this.touchX = touch.pageX - touch.target.offsetLeft;
                this.touchY = touch.pageY - touch.target.offsetTop;
            }
        }
    },
}

$(document).ready(function () {
    var instanceCanvas = Object.create(CanvasForSign);
    instanceCanvas.init();
});