$(document).ready(function() {
    
    // 1. Efecto Hamburguesa (slideToggle como pide la guía)
    $('#btnHamburguesa').click(function() {
        $('#navMenu').slideToggle('fast');
        $('#hamburgerIcon').toggleClass('open');
    });

    // 2. Navegación de Secciones (Mostrar solo 1 a la vez con fade)
    $('.nav-link-btn').click(function(e) {
        e.preventDefault(); // Evita que salte arriba de la página
        
        // Obtener el ID de la sección que queremos mostrar
        let target = $(this).data('target');
        
        // Ocultar menú
        $('#navMenu').slideUp('fast');
        $('#hamburgerIcon').removeClass('open');

        // Efecto de transición: Ocultar la actual y mostrar la nueva
        $('.seccion-contenido.activa').fadeOut(200, function() {
            $(this).removeClass('activa');
            $('#' + target).fadeIn(200).addClass('activa');
        });
    });

    // 3. Bloqueo de letras en Edad
    $('#edad').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // 4. Validación del Formulario
    $('#formulario').submit(function (e) {
        e.preventDefault();
        let isValid = true;

        const nombre = $('#nombre');
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombre.val().trim())) { nombre.addClass('is-invalid'); isValid = false; }
        else nombre.removeClass('is-invalid');

        const correo = $('#correo');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.val())) { correo.addClass('is-invalid'); isValid = false; }
        else correo.removeClass('is-invalid');

        const pass = $('#pass');
        if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass.val())) { pass.addClass('is-invalid'); isValid = false; }
        else pass.removeClass('is-invalid');

        const edad = $('#edad');
        if (edad.val() === '' || Number(edad.val()) < 18) { edad.addClass('is-invalid'); isValid = false; }
        else edad.removeClass('is-invalid');

        const terminos = $('#terminos');
        if (!terminos.is(':checked')) { $('#err-term').show(); isValid = false; }
        else $('#err-term').hide();

        if (isValid) {
            $('#msjExito').fadeIn(200);
            this.reset();
            setTimeout(() => { $('#msjExito').fadeOut(200); }, 3000);
        }
    });

    // 5. Responsive (Móvil / Escritorio)
    $(window).on('resize', function () {
        const esMovil = window.innerWidth <= 768;
        $('html').toggleClass('device-mobile', esMovil).toggleClass('device-desktop', !esMovil);
    });
});
