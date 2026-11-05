// 1. Función de la Hamburguesa
function toggleMenu() {
    const body = document.getElementById('contentBody');
    const icon = document.getElementById('hamburgerIcon');
    body.classList.toggle('open');
    icon.classList.toggle('open');
}

// 2. Validación del Formulario
document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue
    let isValid = true;

    // Validar Nombre (Mínimo 3 letras)
    const nombre = document.getElementById('nombre');
    if (nombre.value.trim().length < 3) {
        nombre.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        nombre.classList.remove('is-invalid'); 
    }

    // Validar Correo Electrónico (Regex)
    const correo = document.getElementById('correo');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(correo.value)) {
        correo.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        correo.classList.remove('is-invalid'); 
    }

    // Validar Contraseña (Mínimo 8 caracteres, 1 mayúscula, 1 número)
    const pass = document.getElementById('pass');
    const regexPass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regexPass.test(pass.value)) {
        pass.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        pass.classList.remove('is-invalid'); 
    }

    // Validar Edad (Mayor o igual a 18)
    const edad = document.getElementById('edad');
    if (edad.value === '' || Number(edad.value) < 18) {
        edad.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        edad.classList.remove('is-invalid'); 
    }

    // Validar Términos y Condiciones
    const terminos = document.getElementById('terminos');
    if (!terminos.checked) {
        document.getElementById('err-term').style.display = 'block'; 
        isValid = false;
    } else { 
        document.getElementById('err-term').style.display = 'none'; 
    }

    // Si todo está correcto, mostrar éxito
    if (isValid) {
        document.getElementById('msjExito').style.display = 'block';
        this.reset(); // Limpia el formulario
        setTimeout(() => { 
            document.getElementById('msjExito').style.display = 'none'; 
        }, 3000); // Oculta el mensaje en 3 segundos
    }
});