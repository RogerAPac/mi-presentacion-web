// 1. Funcion de la Hamburguesa
function toggleMenu() {
    const body = document.getElementById('contentBody');
    const icon = document.getElementById('hamburgerIcon');
    body.classList.toggle('open');
    icon.classList.toggle('open');
}

// 2. Bloqueo de letras en el campo Edad en tiempo real
document.getElementById('edad').addEventListener('input', function (e) {
    // Reemplaza cualquier caracter que NO sea un numero del 0 al 9
    this.value = this.value.replace(/[^0-9]/g, '');
});

// 3. Validacion del Formulario
document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // Validar Nombre (Solo letras y espacios, minimo 3)
    const nombre = document.getElementById('nombre');
    const regexNombre = /^[A-Za-z\s]{3,}$/; 
    if (!regexNombre.test(nombre.value.trim())) {
        nombre.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        nombre.classList.remove('is-invalid'); 
    }

    // Validar Correo Electronico
    const correo = document.getElementById('correo');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(correo.value)) {
        correo.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        correo.classList.remove('is-invalid'); 
    }

    // Validar Contrasena (Minimo 8 caracteres, 1 mayuscula, 1 numero)
    const pass = document.getElementById('pass');
    const regexPass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regexPass.test(pass.value)) {
        pass.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        pass.classList.remove('is-invalid'); 
    }

    // Validar Edad (Solo numeros, mayor o igual a 18)
    const edad = document.getElementById('edad');
    if (edad.value === '' || Number(edad.value) < 18) {
        edad.classList.add('is-invalid'); 
        isValid = false;
    } else { 
        edad.classList.remove('is-invalid'); 
    }

    // Validar Terminos y Condiciones
    const terminos = document.getElementById('terminos');
    if (!terminos.checked) {
        document.getElementById('err-term').style.display = 'block'; 
        isValid = false;
    } else { 
        document.getElementById('err-term').style.display = 'none'; 
    }

    // Si todo esta correcto, mostrar exito
    if (isValid) {
        document.getElementById('msjExito').style.display = 'block';
        this.reset(); 
        setTimeout(() => { 
            document.getElementById('msjExito').style.display = 'none'; 
        }, 3000); 
    }
});
