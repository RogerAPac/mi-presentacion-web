$(document).ready(function() {

    // 1. HAMBURGUESA (Efecto SlideToggle de jQuery para mostrar/ocultar secciones)
    window.toggleMenu = function(id) {
        $('#' + id).slideToggle('fast');
        $('#icon-' + id).toggleClass('open');
    };

    // 2. ACORDEÓN DE SERVICIOS (Guía del docente)
    $('.accordion-btn').click(function() {
        // Cierra los otros paneles abiertos
        $('.accordion-panel').not($(this).next()).slideUp('fast');
        // Abre el panel actual
        $(this).next('.accordion-panel').slideToggle('fast');
    });

    // 3. RETO PRO: SELECTOR DINÁMICO DE CONSOLAS Y FONDOS
    $('.btn-console').click(function() {
        // Cambiar clase activa en los botones
        $('.btn-console').removeClass('active');
        $(this).addClass('active');

        let target = $(this).data('target');

        // Ocultar todas las tarjetas y mostrar la seleccionada con FadeIn (Guía del docente)
        $('.console-card').hide();
        $('#card-' + target).fadeIn('slow');

        // Cambiar color de fondo y icono dinámicamente
        $('body').removeClass('theme-pc theme-ps5 theme-xbox');
        
        if (target === 'pc') {
            $('body').addClass('theme-pc');
            $('#main-icon').html('<i class="fas fa-desktop"></i>');
        } else if (target === 'ps5') {
            $('body').addClass('theme-ps5');
            $('#main-icon').html('<i class="fab fa-playstation"></i>');
        } else if (target === 'xbox') {
            $('body').addClass('theme-xbox');
            $('#main-icon').html('<i class="fab fa-xbox"></i>');
        }
    });

    // 4. FILTRO DE JUEGOS EN TIEMPO REAL (Guía del docente)
    $('#buscador-juegos').on('keyup', function() {
        let texto = $(this).val().toLowerCase();
        $('#lista-juegos .juego-item').each(function() {
            let nombre = $(this).data('nombre').toLowerCase();
            if (nombre.includes(texto)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // 5. VALIDACIÓN DEL FORMULARIO
    // Bloquear letras en la edad
    $('#edad').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#formulario-reserva').submit(function(e) {
        e.preventDefault();
        let isValid = true;

        // Validar Nombre (Solo letras)
        const nombre = $('#nombre');
        if (!/^[A-Za-z\s]{3,}$/.test(nombre.val().trim())) {
            nombre.addClass('is-invalid'); isValid = false;
        } else { nombre.removeClass('is-invalid'); }

        // Validar Correo
        const correo = $('#correo');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.val())) {
            correo.addClass('is-invalid'); isValid = false;
        } else { correo.removeClass('is-invalid'); }

        // Validar Consola
        const consola = $('#consola-reserva');
        if (consola.val() === '') {
            consola.addClass('is-invalid'); isValid = false;
        } else { consola.removeClass('is-invalid'); }

        // Validar Edad (Mayor a 12)
        const edad = $('#edad');
        if (edad.val() === '' || Number(edad.val()) < 12) {
            edad.addClass('is-invalid'); isValid = false;
        } else { edad.removeClass('is-invalid'); }

        if (isValid) {
            $('#msjExito').fadeIn('fast').delay(2000).fadeOut('fast');
            this.reset();
        }
    });
});
