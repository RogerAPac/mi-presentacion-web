$(document).ready(function() {

    let precios = { 'pc': 15, 'ps5': 12, 'xbox': 8 };
    let consolaActual = 'pc';
    let timerInterval;
    let modalInstance = null;

    // 1. NAVEGACIÓN ENTRE CONSOLAS
    $('.btn-console').on('click', function() {
        let target = $(this).data('target');
        consolaActual = target;

        $('.btn-console').removeClass('active');
        $(this).addClass('active');

        $('.console-content').removeClass('active');
        $('#content-' + target).addClass('active');

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

    // 2. FILTRO DE JUEGOS
    $('.search-game').on('keyup', function() {
        let texto = $(this).val().toLowerCase();
        let consola = $(this).data('console');
        
        $('#content-' + consola + ' .game-card').each(function() {
            let nombre = $(this).data('name').toLowerCase();
            if (nombre.includes(texto)) { $(this).show(); } else { $(this).hide(); }
        });
    });

    // 3. CALCULADORA
    function calcularTotal() {
        if (consolaActual === 'bebidas') return;
        let horas = $('#hrs').val();
        if(horas < 1) { $('#hrs').val(1); horas = 1; }
        let precioHora = precios[consolaActual];
        $('#total').text(horas * precioHora);
    }

    $('#hrs').on('input', function() { calcularTotal(); });

    // 4. MODAL Y TEMPORIZADOR
    $('#btnModal').on('click', function() {
        if(consolaActual === 'bebidas') {
            alert("Para comprar bebidas, usa el formulario de la Bitacora (Live).");
            return;
        }

        $('#modal-console').text($('#selected-console-text').val());
        $('#modal-hrs').text($('#hrs').val());
        $('#modal-total').text($('#total').text());

        // Inicializar el modal con Bootstrap 5 correctamente
        let modalElement = document.getElementById('confirmModal');
        modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();

        // Temporizador
        let timeLeft = 300;
        $('#timer').text('05:00');
        
        clearInterval(timerInterval);
        timerInterval = setInterval(function() {
            timeLeft--;
            let m = Math.floor(timeLeft / 60);
            let s = timeLeft % 60;
            $('#timer').text(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if(modalInstance) modalInstance.hide();
                alert("Tiempo de reserva expirado.");
                addLog("SISTEMA", "Reserva cancelada por tiempo expirado.");
            }
        }, 1000);
    });

    $('#btnCancel').on('click', function() {
        clearInterval(timerInterval);
        addLog("SISTEMA", "El usuario cancelo la reserva.");
    });

    $('#btnConfirmPayment').on('click', function() {
        clearInterval(timerInterval);
        if(modalInstance) modalInstance.hide();

        $('#toastAlert').slideDown('fast').delay(3000).fadeOut('fast');
        addLog("RESERVA", `Estacion reservada: ${$('#modal-console').text()} por ${$('#modal-hrs').text()} hrs.`);
    });

    // 5. BITÁCORA (TikTok Live)
    function addLog(tipo, mensaje) {
        let hora = new Date().toLocaleTimeString();
        let log = `<div><span class="text-warning">[${hora}]</span> <span class="text-info">${tipo}:</span> ${mensaje}</div>`;
        $('#logOutput').append(log);
        $('#logOutput').scrollTop($('#logOutput')[0].scrollHeight);
    }

    // Delegación de eventos
    $('#liveContainer').on('click', '.btn-offer', function() {
        addLog("OFERTA_CLICK", `Añadido al carrito: ${$(this).data('prod')}`);
    });

    $('#liveContainer').on('dblclick', '.btn-like', function() {
        addLog("LIKE_STREAM", "¡El usuario envio corazones al Live!");
    });

    $('#chatInput').on('keyup', function(e) {
        if(e.key !== 'Enter' && $(this).val().length > 0) {
            addLog("CHAT_INPUT", `Escribiendo: "${$(this).val()}"`);
        }
    });

    $('#variantSelect').on('change', function() {
        addLog("CAMBIO_VARIANTE", `Selecciono sabor: ${$(this).val()}`);
    });

    $('#liveForm').on('submit', function(e) {
        e.preventDefault();
        let user = $('#userTikTok').val();
        let variant = $('#variantSelect').val();
        
        if(user.trim() === '') {
            addLog("ERROR", "Falta el nombre de usuario.");
            return;
        }
        addLog("COMPRA_EXITOSA", `Pedido de ${user} confirmado. Sabor: ${variant}`);
        $(this)[0].reset();
    });

    // Inicializar
    calcularTotal();
});
