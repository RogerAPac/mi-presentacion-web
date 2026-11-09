$(document).ready(function() {

    // ==========================================
    // 1. LÓGICA DE NAVEGACIÓN Y CATÁLOGO
    // ==========================================
    let precios = { 'pc': 15, 'ps5': 12, 'xbox': 8 };
    let consolaActual = 'pc';

    $('.btn-console').click(function() {
        let target = $(this).data('target');
        consolaActual = target;

        // Cambiar clases activas
        $('.btn-console').removeClass('active');
        $(this).addClass('active');

        // Mostrar el contenido correcto
        $('.console-content').removeClass('active');
        $('#content-' + target).addClass('active');

        // Actualizar el panel de reserva
        if (target === 'bebidas') {
            $('#selected-console-text').val('Bebidas / Snacks');
            $('#hrs').prop('disabled', true).val(1);
            $('#total').text('0');
        } else {
            let nombre = target === 'pc' ? 'PC Gamer' : (target === 'ps5' ? 'PlayStation 5' : 'Xbox 360');
            $('#selected-console-text').val(nombre);
            $('#hrs').prop('disabled', false).val(1);
            calcularTotal();
        }
    });

    // ==========================================
    // 2. FILTRO DE JUEGOS (Buscador)
    // ==========================================
    $('.search-game').on('keyup', function() {
        let texto = $(this).val().toLowerCase();
        let consola = $(this).data('console');
        
        $('#content-' + consola + ' .game-card').each(function() {
            let nombre = $(this).data('name');
            if (nombre.includes(texto)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // ==========================================
    // 3. CALCULADORA DINÁMICA Y MODAL (Temporizador)
    // ==========================================
    let timerInterval;

    function calcularTotal() {
        if (consolaActual === 'bebidas') return;
        let horas = $('#hrs').val();
        let precioHora = precios[consolaActual];
        $('#total').text(horas * precioHora);
    }

    $('#hrs').on('input', function() {
        calcularTotal();
    });

    $('#btnModal').click(function() {
        if(consolaActual === 'bebidas') {
            alert("Para comprar bebidas, usa el formulario de la Bitácora (Live).");
            return;
        }

        // Preparar datos en el Modal
        $('#modal-console').text($('#selected-console-text').val());
        $('#modal-hrs').text($('#hrs').val());
        $('#modal-total').text($('#total').text());

        // Mostrar Modal
        let myModal = new bootstrap.Modal(document.getElementById('confirmModal'));
        myModal.show();

        // Iniciar Temporizador de 5 minutos (300 segundos)
        let timeLeft = 300;
        $('#timer').text('05:00');
        
        clearInterval(timerInterval);
        timerInterval = setInterval(function() {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            $('#timer').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                myModal.hide();
                alert("Tiempo de reserva expirado.");
                addLog("SISTEMA", "Reserva cancelada por tiempo expirado.");
            }
        }, 1000);
    });

    // Botón Cancelar del Modal
    $('#btnCancel').click(function() {
        clearInterval(timerInterval);
        addLog("SISTEMA", "El usuario canceló la reserva.");
    });

    // Botón Procesar Pago (Toast Alert - Reto PRO)
    $('#btnConfirmPayment').click(function() {
        clearInterval(timerInterval);
        let myModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
        myModal.hide();

        // Mostrar Toast con slideDown
        $('#toastAlert').slideDown('fast').delay(3000).fadeOut('fast');
        
        // Registrar en Bitácora
        addLog("RESERVA", `Estación reservada: ${$('#modal-console').text()} por ${$('#modal-hrs').text()} hrs.`);
    });

    // ==========================================
    // 4. BITÁCORA Y TIKTOK LIVE (Día 1 y 2)
    // ==========================================
    function addLog(tipo, mensaje) {
        let hora = new Date().toLocaleTimeString();
        let log = `<div><span class="text-warning">[${hora}]</span> <span class="text-info">${tipo}:</span> ${mensaje}</div>`;
        $('#logOutput').append(log);
        // Auto-scroll al final
        $('#logOutput').scrollTop($('#logOutput')[0].scrollHeight);
    }

    // 4.1 Event Delegation (Día 1) - Clics y Doble Clics en el Live
    $('#liveContainer').on('click', '.btn-offer', function() {
        let prod = $(this).data('prod');
        addLog("OFERTA_CLICK", `Añadido al carrito: ${prod}`);
    });

    $('#liveContainer').on('dblclick', '.btn-like', function() {
        addLog("LIKE_STREAM", "¡El usuario envió corazones al Live!");
    });

    // 4.2 Evento Teclado (Día 1) - Chat del Live
    $('#chatInput').on('keyup', function(e) {
        if(e.key !== 'Enter') {
            addLog("CHAT_INPUT", `Escribiendo: "${$(this).val()}"`);
        }
    });

    // 4.3 Formulario Submit y Change (Día 2)
    $('#variantSelect').on('change', function() {
        addLog("CAMBIO_VARIANTE", `Seleccionó sabor: ${$(this).val()}`);
    });

    $('#liveForm').submit(function(e) {
        e.preventDefault();
        let user = $('#userTikTok').val();
        let variant = $('#variantSelect').val();
        
        if(user.trim() === '') {
            addLog("ERROR", "Falta el nombre de usuario de TikTok.");
            return;
        }

        addLog("COMPRA_EXITOSA", `Pedido de ${user} confirmado. Sabor: ${variant}`);
        $(this)[0].reset();
    });

    // Cargar estado inicial
    calcularTotal();
});
