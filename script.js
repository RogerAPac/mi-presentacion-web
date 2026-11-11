$(document).ready(function() {

    let paginaHidratada = false;

    // ==========================================
    // HIDRATACIÓN AL PRIMER CLIC (Y actualización visual)
    // ==========================================
    function hidratarPagina() {
        if (paginaHidratada) return;
        paginaHidratada = true;

        // Cambiamos los textos de las barras de estado
        $('#statusText').text('OFF').css('color', '#4ade80');
        $('#hydrateText').text('COMPLETADA').css('color', '#4ade80');
        
        // Actualizamos el diálogo
        $('#dialogTitle').text('Sistema Listo');
        $('#dialogText').text('Interfaz hidratada correctamente. Ya puedes usar los botones laterales o el menú de la estrella.');

        // 1. Eventos de los botones laterales (Píldoras)
        $('.menu-btn').off('click').on('click', function() {
            let target = $(this).data('target');
            cambiarSeccion(target);
        });

        // 2. Eventos del menú inferior (Estrella)
        $('#btnHamburguesa').off('click').on('click', function() {
            $('#navMenu').addClass('show');
        });

        // 3. Cerrar menú
        $('#closeMenu, .dbl-nav-item').off('click').on('click', function(e) {
            if ($(this).hasClass('dbl-nav-item')) {
                let target = $(this).data('target');
                cambiarSeccion(target);
            }
            $('#navMenu').removeClass('show');
        });

        // 4. Validaciones del formulario
        $('#formulario').off('submit').on('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            const nombre = $('#nombre');
            if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombre.val().trim())) { nombre.addClass('is-invalid'); isValid = false; }
            else nombre.removeClass('is-invalid');

            const correo = $('#correo');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.val())) { correo.addClass('is-invalid'); isValid = false; }
            else correo.removeClass('is-invalid');

            if (isValid) {
                $('#msjExito').fadeIn(200);
                this.reset();
                setTimeout(() => { $('#msjExito').fadeOut(200); }, 3000);
            }
        });
    }

    // Función para cambiar la tarjeta visible
    function cambiarSeccion(target) {
        $('.dbl-event-card').removeClass('active');
        $('#' + target).addClass('active');
    }

    // Disparadores de hidratación (cualquier toque o clic)
    $(document).one('click touchstart keydown', function() {
        hidratarPagina();
    });
    
    // Auto-hidratación a los 2 segundos por si acaso
    setTimeout(hidratarPagina, 2000);

});
