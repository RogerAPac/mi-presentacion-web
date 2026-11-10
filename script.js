$(document).ready(function() {

    // ==========================================
    // 1. SIMULACIÓN DE HIDRATACIÓN (Como pide el PDF)
    // ==========================================
    
    function hidratarInterfaz() {
        let $menuBox = $('#navMenu');
        
        // Si ya se hidrató, no hacemos nada (Evita Memory Leaks)
        if ($menuBox.attr('data-hidratado') === 'true') return;

        // Hidratamos el botón de la hamburguesa (adjuntamos evento sin redibujar)
        $('#btnHamburguesa').off('click').on('click', function() {
            $menuBox.slideToggle(300);
        });

        // Hidratamos los enlaces del menú
        $('.nav-link-btn').off('click').on('click', function(e) {
            e.preventDefault();
            let target = $(this).data('target');
            
            $menuBox.slideUp(300);

            // Cambiamos la sección visible
            $('.seccion-contenido.activa').fadeOut(200, function() {
                $(this).removeClass('activa');
                $('#' + target).fadeIn(200).addClass('activa');
            });
        });

        // Marcamos como hidratado
        $menuBox.attr('data-hidratado', 'true');
        console.log("✅ Interfaz hidratada correctamente sin fugas de memoria.");
    }

    // Ejecutar la hidratación después de 500ms (como pide el profe)
    setTimeout(hidratarInterfaz, 500);


    // ==========================================
    // 2. VALIDACIÓN DE FORMULARIO (Prevención de Memory Leaks)
    // ==========================================

    // Usamos .off() antes de .on() para limpiar cualquier evento previo
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
});
