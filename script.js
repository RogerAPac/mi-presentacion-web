$(document).ready(function() {

    $('#btnHidratar').off('click').on('click', function() {
        let $box = $('#contenedorMenu');
        let $btn = $(this);
        
        // Validar que no se hidrate dos veces
        if ($box.attr('data-hidratado') === 'true') return;

        // 1. Cambiar el fondo del contenedor a verde claro
        $box.css({'background-color': '#dcfce7', 'border-color': '#22c55e'});

        // 2. Cambiar el texto de arriba y mostrar el mensaje de "Página hidratada"
        $('#textoEstatico').hide();
        $('#msjHidratacion').fadeIn(200);

        // 3. Deshabilitar el botón y ponerlo verde (para que quede constancia de que funcionó)
        $btn.prop('disabled', true)
            .removeClass('btn-warning')
            .addClass('btn-success')
            .html('<i class="fas fa-check"></i> Hidratado');

        // 4. Hidratar el ícono de la hamburguesa
        $('#hamburgerIcon').css('color', 'var(--accent)');

        // 5. Adjuntar los eventos interactivos (Hamburguesa)
        $('#btnHamburguesa').off('click').on('click', function() {
            $('#navMenu').slideToggle('fast');
        });

        // 6. Eventos interactivos (Pestañas)
        $('.nav-link-btn').off('click').on('click', function(e) {
            e.preventDefault();
            let target = $(this).data('target');
            
            $('#navMenu').slideUp('fast');

            $('.seccion-contenido.activa').fadeOut(200, function() {
                $(this).removeClass('activa');
                $('#' + target).fadeIn(200).addClass('activa');
            });
        });

        // 7. Eventos del formulario
        $('#edad').off('input').on('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

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

        // 8. Marcar como hidratado
        $box.attr('data-hidratado', 'true');
    });

});
