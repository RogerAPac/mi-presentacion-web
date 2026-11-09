$(document).ready(function() {

    // 1. RELOJ
    function updateClock() {
        $('#liveClock').text(new Date().toLocaleTimeString('es-ES'));
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. DATOS DEL CATÁLOGO (Cortes de madera y accesorios)
    const catalogData = {
        'pino': [
            { name: 'Tabla 2x4 Pulgada', icon: 'fa-ruler-combined' },
            { name: 'Tabla 1x6 Pulgada', icon: 'fa-ruler-horizontal' },
            { name: 'Vigas 4x4', icon: 'fa-grip-lines' },
            { name: 'Triplex 18mm', icon: 'fa-layer-group' }
        ],
        'roble': [
            { name: 'Tabla Lisa 3m', icon: 'fa-ruler-combined' },
            { name: 'Tabla Lisa 2m', icon: 'fa-ruler-horizontal' },
            { name: 'Molduras Roble', icon: 'fa-border-all' }
        ],
        'cedro': [
            { name: 'Tabla Fina 1m', icon: 'fa-ruler' },
            { name: 'Tabla Gruesa 2m', icon: 'fa-grip-lines' },
            { name: 'Postes Cedro', icon: 'fa-bars' }
        ],
        'accesorios': [
            { name: 'Caja de Clavos', icon: 'fa-hammer' },
            { name: 'Barniz Brillante', icon: 'fa-paint-roller' },
            { name: 'Lija para Madera', icon: 'fa-tooth' },
            { name: 'Pegamento Carpintero', icon: 'fa-tube' }
        ]
    };

    let currentService = '', currentPricePerHour = 0, currentStation = '';
    let timerInterval, modalInstance = null;

    // 3. SELECCIÓN DE MENÚ
    $('.giant-btn').click(function() {
        currentService = $(this).data('target');
        
        if (currentService === 'pino') currentPricePerHour = 150;
        if (currentService === 'roble') currentPricePerHour = 350;
        if (currentService === 'cedro') currentPricePerHour = 280;
        if (currentService === 'accesorios') currentPricePerHour = 20; // Precio base de accesorios

        $('#mainMenu').fadeOut('fast', function() {
            $('#catalogSection').fadeIn('fast').css('display', 'flex');
            
            if (currentService === 'accesorios') {
                $('#stationView').hide();
                $('#gameView').css('display', 'flex');
                loadGames('accesorios');
            } else {
                $('#stationView').css('display', 'block');
                $('#gameView').hide();
                generateStations(currentService);
            }
        });
    });

    // 4. GENERAR LOTES DISPONIBLES
    function generateStations(service) {
        let grid = $('#stationGrid');
        grid.empty();
        let prefix = service.toUpperCase();
        
        for (let i = 1; i <= 10; i++) {
            let isBusy = Math.random() < 0.3; // 30% de lotes agotados
            let statusClass = isBusy ? 'busy' : 'available';
            let statusText = isBusy ? 'Agotado' : 'Disponible';
            
            grid.append(`
                <div class="station-card ${statusClass}" data-station="${prefix}-${i}">
                    <i class="fas fa-tree"></i>
                    <h4>Lote ${prefix}-${i}</h4>
                    <span>${statusText}</span>
                </div>
            `);
        }

        $('.station-card.available').click(function() {
            currentStation = $(this).data('station');
            $('#stationView').fadeOut('fast', function() {
                $('#gameView').css('display', 'flex').hide().fadeIn('fast');
                loadGames(service);
            });
        });
    }

    // 5. CARGAR PRODUCTOS
    function loadGames(service) {
        let grid = $('#gameGrid');
        grid.empty();

        catalogData[service].forEach(game => {
            grid.append(`
                <div class="game-card" data-name="${game.name.toLowerCase()}">
                    <i class="fas ${game.icon}"></i>
                    <span>${game.name}</span>
                </div>
            `);
        });

        if (service !== 'accesorios') {
            $('#actionPanel').show();
            $('#currentStationName').text(currentStation);
            $('#startPrice').text(currentPricePerHour);
        } else {
            $('#actionPanel').show();
            $('#currentStationName').text("Accesorios de Carpintería");
            $('#startPrice').text("20");
        }
    }

    // VOLVER
    $('#btnBack').click(function() {
        if (currentService === 'accesorios') {
            $('#catalogSection').fadeOut('fast', () => $('#mainMenu').fadeIn('fast').css('display', 'flex'));
        } else {
            if ($('#gameView').is(':visible')) {
                $('#gameView').fadeOut('fast', () => $('#stationView').fadeIn('fast').css('display', 'block'));
            } else {
                $('#stationView').fadeOut('fast', () => $('#mainMenu').fadeIn('fast').css('display', 'flex'));
            }
        }
    });

    // 6. RESERVAR LOTE (Con temporizador)
    $('#btnReservar').click(function() {
        $('#modalActionType').text('Reserva de Lote');
        $('#modalConsoleName').text(currentStation !== "" ? currentStation : "Accesorios Varios");
        $('#hrsInput').val(1);
        calcularTotalReserva();
        $('#timerContainer').show();

        modalInstance = new bootstrap.Modal(document.getElementById('reservaModal'));
        modalInstance.show();

        let timeLeft = 300;
        $('#timerDisplay').text('05:00');
        clearInterval(timerInterval);
        timerInterval = setInterval(function() {
            timeLeft--;
            let m = Math.floor(timeLeft / 60), s = timeLeft % 60;
            $('#timerDisplay').text(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                modalInstance.hide();
                alert("Tiempo de reserva expirado.");
            }
        }, 1000);
    });

    // PRECIO DINÁMICO
    $('#hrsInput').on('input', calcularTotalReserva);
    function calcularTotalReserva() {
        let hrs = $('#hrsInput').val();
        if (hrs < 1) { $('#hrsInput').val(1); hrs = 1; }
        $('#totalPay').text(hrs * currentPricePerHour);
    }

    // 7. COMPRAR YA (Sin temporizador)
    $('#btnEmpezar').click(function() {
        $('#modalActionType').text('Compra Directa');
        $('#modalConsoleName').text(currentStation !== "" ? currentStation : "Accesorios Varios");
        $('#hrsInput').val(1);
        calcularTotalReserva();
        $('#timerContainer').hide(); 

        modalInstance = new bootstrap.Modal(document.getElementById('reservaModal'));
        modalInstance.show();
    });

    // PROCESAR PAGO
    $('#btnConfirm').click(function() {
        clearInterval(timerInterval);
        if(modalInstance) modalInstance.hide();
        
        let action = $('#modalActionType').text();
        let cant = $('#hrsInput').val();
        let total = $('#totalPay').text();

        $('#toastAlert').slideDown('fast').delay(3000).fadeOut('fast');
        addLog(action.toUpperCase(), `${currentStation} - Cant: ${cant} - Total: ${total} BOB`);
        
        if(currentStation !== "") {
            $(`.station-card[data-station="${currentStation}"]`).removeClass('available').addClass('busy').find('span').text('Agotado');
        }
    });

    // 8. BITÁCORA Y MENÚS
    function addLog(tipo, mensaje) {
        let hora = new Date().toLocaleTimeString();
        $('#logOutput').append(`<div><span class="text-warning">[${hora}]</span> <span class="text-info">${tipo}:</span> ${mensaje}</div>`);
        $('#logOutput').scrollTop($('#logOutput')[0].scrollHeight);
    }

    $('#btnSettings').click(function(e) {
        e.stopPropagation();
        $('#settingsMenu').slideToggle('fast');
    });

    $('#menuBitacora').click(function(e) {
        e.preventDefault();
        $('#settingsMenu').slideUp('fast'); 
        setTimeout(function() {
            let bitacoraModal = new bootstrap.Modal(document.getElementById('bitacoraModal'));
            bitacoraModal.show();
        }, 300); 
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('.brand-box').length && !$(e.target).closest('#settingsMenu').length) {
            $('#settingsMenu').slideUp('fast');
        }
    });

    // BUSCADOR
    $('#gameSearch').on('keyup', function() {
        let val = $(this).val().toLowerCase();
        $('#gameGrid .game-card').each(function() {
            $(this).data('name').includes(val) ? $(this).show() : $(this).hide();
        });
    });
});
