$(document).ready(function() {

    // ==========================================
    // 1. RELOJ EN TIEMPO REAL
    // ==========================================
    function updateClock() {
        let now = new Date();
        let timeString = now.toLocaleTimeString('es-ES');
        $('#liveClock').text(timeString);
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ==========================================
    // 2. DATOS DEL CATÁLOGO
    // ==========================================
    const catalogData = {
        'pc': [
            { name: 'League of Legends', icon: 'fa-gamepad' },
            { name: 'Valorant', icon: 'fa-crosshairs' },
            { name: 'GTA V', icon: 'fa-car' },
            { name: 'Minecraft', icon: 'fa-cube' },
            { name: 'CS2', icon: 'fa-gun' },
            { name: 'Fortnite', icon: 'fa-parachute-box' }
        ],
        'ps5': [
            { name: 'EA FC 24', icon: 'fa-futbol' },
            { name: 'Spider-Man 2', icon: 'fa-spider' },
            { name: 'God of War', icon: 'fa-axe' },
            { name: 'Mortal Kombat 1', icon: 'fa-dragon' }
        ],
        'xbox': [
            { name: 'Halo 3', icon: 'fa-rocket' },
            { name: 'Gears of War', icon: 'fa-skull' },
            { name: 'PES 2013', icon: 'fa-futbol' },
            { name: 'GTA San Andreas', icon: 'fa-car' }
        ],
        'bebidas': [
            { name: 'Coca Cola', icon: 'fa-glass-whiskey' },
            { name: 'Pepsi', icon: 'fa-glass-whiskey' },
            { name: 'Papas Lays', icon: 'fa-cookie' },
            { name: 'Chocolate', icon: 'fa-candy-cane' }
        ]
    };

    let currentService = '';
    let currentPricePerHour = 0;
    let timerInterval;
    let modalInstance = null;

    // ==========================================
    // 3. SELECCIÓN DE MENÚ PRINCIPAL
    // ==========================================
    $('.giant-btn').click(function() {
        let target = $(this).data('target');
        currentService = target;
        
        // Cambiar de vista
        $('#mainMenu').fadeOut('fast', function() {
            $('#catalogSection').fadeIn('fast').css('display', 'flex');
            loadGames(target);
        });

        // Setear precios
        if (target === 'pc') currentPricePerHour = 15;
        if (target === 'ps5') currentPricePerHour = 12;
        if (target === 'xbox') currentPricePerHour = 8;
        if (target === 'bebidas') currentPricePerHour = 0;

        // Actualizar titulo
        let titles = { 'pc': 'Juegos de PC', 'ps5': 'Juegos de PS5', 'xbox': 'Juegos de Xbox', 'bebidas': 'Bebidas y Snacks' };
        $('#catalogTitle').text(titles[target]);
        $('#gameSearch').val(''); // Limpiar buscador
    });

    // Volver al menú
    $('#btnBack').click(function() {
        $('#catalogSection').fadeOut('fast', function() {
            $('#mainMenu').fadeIn('fast').css('display', 'flex');
        });
    });

    // Cargar juegos en el grid
    function loadGames(service) {
        let grid = $('#gameGrid');
        grid.empty();

        catalogData[service].forEach(game => {
            let card = `
                <div class="game-card" data-name="${game.name.toLowerCase()}">
                    <i class="fas ${game.icon}"></i>
                    <span>${game.name}</span>
                </div>
            `;
            grid.append(card);
        });

        // Evento para reservar al hacer clic en un juego
        $('.game-card').click(function() {
            if (currentService === 'bebidas') {
                addLog("COMPRA", `Snack/Bebida solicitada: ${$(this).find('span').text()}`);
                $('#toastAlert').html('<i class="fas fa-check-circle text-info me-2"></i> ¡Producto añadido!').slideDown('fast').delay(2000).fadeOut('fast');
            } else {
                abrirModalReserva($(this).find('span').text());
            }
        });
    }

    // Filtro Buscador
    $('#gameSearch').on('keyup', function() {
        let val = $(this).val().toLowerCase();
        $('#gameGrid .game-card').each(function() {
            let name = $(this).data('name');
            if (name.includes(val)) { $(this).show(); } else { $(this).hide(); }
        });
    });

    // ==========================================
    // 4. MODAL DE RESERVA Y TEMPORIZADOR
    // ==========================================
    function abrirModalReserva(juegoNombre) {
        // Preparar Modal
        $('#modalConsoleName').text(juegoNombre);
        $('#hrsInput').val(1);
        calcularTotal();

        let modalElement = document.getElementById('reservaModal');
        modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();

        // Iniciar Temporizador (5 min = 300 seg)
        let timeLeft = 300;
        $('#timerDisplay').text('05:00');
        
        clearInterval(timerInterval);
        timerInterval = setInterval(function() {
            timeLeft--;
            let m = Math.floor(timeLeft / 60);
            let s = timeLeft % 60;
            $('#timerDisplay').text(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                if(modalInstance) modalInstance.hide();
                alert("Tiempo de reserva expirado.");
                addLog("SISTEMA", "Reserva cancelada por tiempo.");
            }
        }, 1000);
    }

    // Calculadora en el Modal
    $('#hrsInput').on('input', calcularTotal);
    function calcularTotal() {
        let hrs = $('#hrsInput').val();
        if (hrs < 1) { $('#hrsInput').val(1); hrs = 1; }
        $('#totalPay').text(hrs * currentPricePerHour);
    }

    // Botones del Modal
    $('#btnCancel').click(function() {
        clearInterval(timerInterval);
        addLog("SISTEMA", "El usuario canceló la reserva.");
    });

    $('#btnConfirm').click(function() {
        clearInterval(timerInterval);
        if(modalInstance) modalInstance.hide();

        // Toast (Reto PRO)
        $('#toastAlert').slideDown('fast').delay(3000).fadeOut('fast');
        
        // Registrar en Bitácora
        let juego = $('#modalConsoleName').text();
        let hrs = $('#hrsInput').val();
        let total = $('#totalPay').text();
        addLog("RESERVA", `${juego} por ${hrs} hrs. Total: ${total} BOB`);
    });

    // ==========================================
    // 5. BITÁCORA (Función para escribir en consola)
    // ==========================================
    function addLog(tipo, mensaje) {
        let hora = new Date().toLocaleTimeString();
        let log = `<div><span class="text-warning">[${hora}]</span> <span class="text-info">${tipo}:</span> ${mensaje}</div>`;
        $('#logOutput').append(log);
        $('#logOutput').scrollTop($('#logOutput')[0].scrollHeight);
    }
    // ==========================================
    // 6. MENÚ DE AJUSTES (ENGRANAJE)
    // ==========================================
    $('#btnSettings').click(function(e) {
        e.stopPropagation(); // Evita que se cierre inmediatamente
        $('#settingsMenu').slideToggle('fast');
    });

    // Cerrar el menú si se hace clic afuera
    $(document).click(function(e) {
        if (!$(e.target).closest('.brand-box').length) {
            $('#settingsMenu').slideUp('fast');
        }
    });
});
