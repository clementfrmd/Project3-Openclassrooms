var Slider = {
    // Définition de la slide de départ
    currentIndex: 0,

    init: function () {
        this.autoSlide();
        this.playAutoClick();
        this.nextSlideOnClick.bind(this)();
        this.prevSlideOnClick.bind(this)();
        this.changeSlideOnKeypress.bind(this)();
    },

    // Lancement de la 1ère slide
    activeSlide: function () {
        var slides = $('.fade');
        var slide = slides.eq(this.currentIndex);
        slides.hide();
        slide.css('display', 'flex');
    },

    // Défini la slide suivante comme nouvelle slide
    indexPlus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        this.currentIndex += 1;
        if (this.currentIndex > slidesNumber - 1) {
            this.currentIndex = 0;
        }
    },

    // Défini la slide précédente comme nouvelle slide
    indexMinus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        this.currentIndex -= 1;
        if (this.currentIndex < 0) {
            this.currentIndex = slidesNumber - 1;
        }
    },

    // Définition des actions de contrôle des slides
    autoSlide: function () {
        var play = $('.fa-play');
        play.click(function () {
            var timer = setInterval(function () {
                Slider.indexPlus();
                Slider.activeSlide();
            }.bind(this), 5000);
            var stop = $('.fa-pause-circle');
            stop.click(function () {
                clearInterval(timer);
            }.bind(this));
        }.bind(this));

    }.bind(this),

    // Lancement du slider au chargement de la page
    playAutoClick: function () {
        var play = $('.fa-play');
        play.trigger('click');
    }.bind(this),

    // Permet de passer à la slide suivante avec le bouton ">"
    nextSlideOnClick: function () {
        var next = $('.fa-arrow-circle-right');
        next.click(function () {
            this.indexPlus();
            this.activeSlide();
        }.bind(this));
    },

    // Permet de passer à la slide précédente avec le bouton "<"
    prevSlideOnClick: function () {
        var prev = $('.fa-arrow-circle-left');
        prev.click(function () {
            this.indexMinus();
            this.activeSlide();
        }.bind(this));
    },

    // Fonction des touches directionnelles
    changeSlideOnKeypress: function () {
        // $('body').keydown(function (e) {
        document.body.addEventListener("keydown", function (e) {

            if (e.which === 39) {
                this.indexPlus();
                this.activeSlide();
            } else if (e.which === 37) {
                this.indexMinus();
                this.activeSlide();
            }
        }.bind(this))
    },
}


$(function () {
    var mySlider = Object.create(Slider);
    mySlider.init();
});