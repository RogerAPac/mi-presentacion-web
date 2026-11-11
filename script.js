$(document).ready(function() {

    let paginaHidratada = false;

    function hidratarPagina() {
        if (paginaHidratada) return;
        paginaHidratada = true;

        // Efecto visual de hidratación
        $('.pwa-container').css('box-shadow', '0 0 50px rgba(0, 229, 255, 0.6)');

        // 1. Eventos de la Hamburguesa
        $('#btnHamburguesa').off('click').on('click', function() {
            $('#navMenu').slideToggle('fast');
        });

        // 2. Eventos de las Pestañas (Pasatiempos, Horario, etc.)
        $('.nav-link-btn').off('click').on('click', function(e) {
            e.preventDefault();
            let target = $(this).data('target');
            
            $('#navMenu').slideUp('fast');

            $('.seccion-contenido.activa').fadeOut(200, function() {
                $(this).removeClass('activa');
                $('#' + target).fadeIn(300).addClass('activa');
            });
        });

        // 3. Validación de Edad
        $('#edad').off('input').on('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // 4. Validación del Formulario
        $('#formulario').off('submit').on('submit', function (e) {
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
    }

    // Disparadores de Hidratación (Clic, Toque, Teclado o 1.5s)
    $(document).one('click touchstart keydown', function() {
        hidratarPagina();
    });
    setTimeout(hidratarPagina, 1500);

});
