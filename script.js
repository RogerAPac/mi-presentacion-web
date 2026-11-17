$(document).ready(function() {
    let paginaHidratada = false;

    function hidratarPagina() {
        if (paginaHidratada) return;
        paginaHidratada = true;

        $('#statusText').text('OFF').css('color', '#4ade80');
        $('#hydrateText').text('COMPLETADA').css('color', '#4ade80');
        $('#dialogTitle').text('Sistema Listo');
        $('#dialogText').text('Interfaz hidratada correctamente. Ya puedes usar los botones laterales.');

        // DELEGACIÓN DE EVENTOS (Anti Memory Leaks)
        $('.dbl-sidemenu').off('click', '.dbl-sidemenu__item').on('click', '.dbl-sidemenu__item', function() {
            let target = $(this).data('target');
            cambiarSeccion(target);
        });

        $('#btnHamburguesa').off('click').on('click', function() {
            $('#navMenu').addClass('show');
        });

        $('.dbl-nav').off('click', '#closeMenu, .dbl-nav__item').on('click', '#closeMenu, .dbl-nav__item', function(e) {
            if ($(this).hasClass('dbl-nav__item')) {
                let target = $(this).data('target');
                cambiarSeccion(target);
            }
            $('#navMenu').removeClass('show');
        });

        // VALIDACIÓN Y SANITIZACIÓN CON DOMPURIFY
        $('#formulario').off('submit').on('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            const nombre = $('#nombre');
            // DOMPurify limpiando el input (por si inyectan HTML)
            const nombreLimpio = DOMPurify.sanitize(nombre.val().trim());
            
            if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombreLimpio)) { 
                nombre.addClass('is-invalid'); isValid = false; 
            } else { 
                nombre.removeClass('is-invalid'); 
            }

            const correo = $('#correo');
            const correoLimpio = DOMPurify.sanitize(correo.val().trim());
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) { 
                correo.addClass('is-invalid'); isValid = false; 
            } else { 
                correo.removeClass('is-invalid'); 
            }

            if (isValid) {
                $('#msjExito').fadeIn(200);
                this.reset();
                setTimeout(() => { $('#msjExito').fadeOut(200); }, 3000);
            }
        });
    }

    function cambiarSeccion(target) {
        $('.dbl-card').removeClass('dbl-card--active');
        $('#' + target).addClass('dbl-card--active');
    }

    // Disparadores
    $(document).one('click touchstart keydown', function() {
        hidratarPagina();
    });
    
    setTimeout(hidratarPagina, 2000);
});
