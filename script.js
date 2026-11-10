function toggleMenu() {
    const body = document.getElementById('contentBody');
    const menu = document.getElementById('navMenu');
    const icon = document.getElementById('hamburgerIcon');
    body.classList.toggle('open');
    icon.classList.toggle('open');
    if (menu) menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

document.getElementById('edad').addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    const nombre = document.getElementById('nombre');
    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
    if (!regexNombre.test(nombre.value.trim())) { nombre.classList.add('is-invalid'); isValid = false; }
    else nombre.classList.remove('is-invalid');

    const correo = document.getElementById('correo');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(correo.value)) { correo.classList.add('is-invalid'); isValid = false; }
    else correo.classList.remove('is-invalid');

    const pass = document.getElementById('pass');
    const regexPass = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regexPass.test(pass.value)) { pass.classList.add('is-invalid'); isValid = false; }
    else pass.classList.remove('is-invalid');

    const edad = document.getElementById('edad');
    if (edad.value === '' || Number(edad.value) < 18) { edad.classList.add('is-invalid'); isValid = false; }
    else edad.classList.remove('is-invalid');

    const terminos = document.getElementById('terminos');
    if (!terminos.checked) { document.getElementById('err-term').style.display = 'block'; isValid = false; }
    else document.getElementById('err-term').style.display = 'none';

    if (isValid) {
        const msj = document.getElementById('msjExito');
        msj.style.display = 'block';
        this.reset();
        setTimeout(() => { msj.style.display = 'none'; }, 3000);
    }
});

window.addEventListener('resize', function () {
    const html = document.documentElement;
    const esMovil = window.innerWidth <= 768;
    html.classList.toggle('device-mobile', esMovil);
    html.classList.toggle('device-desktop', !esMovil);
});
