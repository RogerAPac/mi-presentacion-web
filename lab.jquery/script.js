$(document).ready(function() {

    // 1. HAMBURGUESA
    window.toggleMenu = function(id) {
        $('#' + id).slideToggle('fast');
        $('#icon-' + id).toggleClass('open');
    };

    // 2. ACORDEÓN DE SERVICIOS
    $('.accordion-btn').click(function() {
        $('.accordion-panel').not($(this).next()).slideUp('fast');
        $(this).next('.accordion-panel').slideToggle('fast');
    });

    // 3. SELECTOR DINÁMICO (Fondos e íconos)
    $('.btn-console').click(function() {
        $('.btn-console').removeClass('active');
        $(this).addClass('active');

        let target = $(this).data('target');

        $('.console-card').hide();
        $('#card-' + target).fadeIn('slow');

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

    // 4. FILTRO DE JUEGOS
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

    // 5. VALIDACIÓN FORMULARIO
    $('#edad').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#formulario-reserva').submit(function(e) {
        e.preventDefault();
        let isValid = true;

        const nombre = $('#nombre');
        if (!/^[A-Za-z\s]{3,}$/.test(nombre.val().trim())) {
            nombre.addClass('is-invalid'); isValid = false;
        } else { nombre.removeClass('is-invalid'); }

        const correo = $('#correo');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.val())) {
            correo.addClass('is-invalid'); isValid = false;
        } else { correo.removeClass('is-invalid'); }

        const consola = $('#consola-reserva');
        if (consola.val() === '') {
            consola.addClass('is-invalid'); isValid = false;
        } else { consola.removeClass('is-invalid'); }

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
