$(document).ready(function() {
    
    // 1. Menú Hamburguesa (Efecto slideToggle de jQuery)
    $('#btnHamburguesa').click(function() {
        $('#navMenu').slideToggle('fast');
    });

    // 2. Navegación entre secciones (Ocultar todo y mostrar solo 1)
    $('.nav-link-btn').click(function(e) {
        e.preventDefault();
        
        let target = $(this).data('target');
        
        // Cerrar menú
        $('#navMenu').slideUp('fast');

        // Ocultar la sección actual y mostrar la nueva con un efecto suave
        $('.seccion-contenido.activa').fadeOut(200, function() {
            $(this).removeClass('activa');
            $('#' + target).fadeIn(200).addClass('activa');
        });
    });

    // 3. Bloqueo de letras en el campo Edad en tiempo real
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
});
