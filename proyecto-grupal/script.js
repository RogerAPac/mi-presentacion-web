$(document).ready(function() {

    // ==========================================
    // 1. FILTRO DE BÚSQUEDA Y CATEGORÍAS
    // ==========================================
    function filterProducts() {
        let searchText = $('#searchProduct').val().toLowerCase();
        let category = $('#categoryFilter').val();

        $('.product-card').each(function() {
            let name = $(this).data('name').toLowerCase();
            let cat = $(this).data('category');

            let matchesSearch = name.includes(searchText);
            let matchesCategory = (category === 'all' || cat === category);

            if (matchesSearch && matchesCategory) {
                $(this).fadeIn('fast'); // Uso de fadeIn
            } else {
                $(this).fadeOut('fast'); // Uso de fadeOut
            }
        });
    }

    $('#searchProduct').on('keyup', filterProducts);
    $('#categoryFilter').on('change', filterProducts);

    // ==========================================
    // 2. VALIDACIÓN DEL FORMULARIO DE CONTACTO
    // ==========================================
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        let isValid = true;

        // Validar Nombre (Solo letras, min 3)
        let nombre = $('#nombre');
        if (!/^[A-Za-z\s]{3,}$/.test(nombre.val().trim())) {
            nombre.addClass('is-invalid'); isValid = false;
        } else { nombre.removeClass('is-invalid'); }

        // Validar Correo
        let correo = $('#correo');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.val())) {
            correo.addClass('is-invalid'); isValid = false;
        } else { correo.removeClass('is-invalid'); }

        // Validar Mensaje
        let mensaje = $('#mensaje');
        if (mensaje.val().trim() === '') {
            mensaje.addClass('is-invalid'); isValid = false;
        } else { mensaje.removeClass('is-invalid'); }

        // Si todo está correcto
        if (isValid) {
            $('#formSuccess').slideDown('fast').delay(3000).slideUp('fast');
            this.reset();
        }
    });

    // ==========================================
    // 3. CARRITO DE COMPRAS Y TOAST ALERT
    // ==========================================
    let cart = [];
    let total = 0;

    // Añadir al carrito
    $('.btn-add-cart').click(function() {
        let productName = $(this).data('product');
        let price = parseFloat($(this).data('price'));
        
        cart.push({ name: productName, price: price });
        total += price;

        updateCartUI();

        // Mostrar Toast Alert (Reto PRO)
        $('#toastMsg').text('Añadido: ' + productName);
        $('#toastAlert').slideDown('fast').delay(2000).fadeOut('fast');
    });

    // Actualizar UI del carrito
    function updateCartUI() {
        $('#cartCount').text(cart.length);
        $('#cartTotal').text(total);

        let list = $('#cartList');
        list.empty();

        if (cart.length === 0) {
            list.append('<li class="list-group-item bg-dark text-muted border-secondary text-center">El carrito esta vacio.</li>');
        } else {
            cart.forEach((item, index) => {
                list.append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center border-secondary">
                        ${item.name}
                        <span class="text-warning fw-bold">${item.price} Bs</span>
                    </li>
                `);
            });
        }
    }

    // Abrir Modal del Carrito
    $('#btnCart').click(function(e) {
        e.preventDefault();
        let cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    });

    // Pagar (Checkout)
    $('#btnCheckout').click(function() {
        if (cart.length === 0) {
            alert("El carrito está vacío. Añade productos primero.");
            return;
        }
        
        // Simular compra
        $('#toastAlert').find('.fas').removeClass('fa-check-circle').addClass('fa-check-double');
        $('#toastMsg').text('¡Compra realizada con éxito!');
        $('#toastAlert').slideDown('fast').delay(3000).fadeOut('fast');
        
        // Vaciar carrito
        cart = [];
        total = 0;
        updateCartUI();
        
        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
    });

});
