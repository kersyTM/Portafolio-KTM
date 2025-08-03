// Texto dinámico
const Texto = "En proceso de ser Programador en sistemas.";
const velocidad = 80;
const elemento = document.getElementById("texto-Dinamico");
let index = 0;
let borrando = false;

function escribir() {
    if (!borrando) {
        elemento.textContent += Texto.charAt(index);
        index++;
        if (index < Texto.length) {
            setTimeout(escribir, velocidad);
        } else {
            setTimeout(() => {
                borrando = true;
                setTimeout(escribir, velocidad);
            }, 1000);
        }
    } else {
        elemento.textContent = Texto.substring(0, index - 1);
        index--;
        if (index > 1) {
            setTimeout(escribir, velocidad);
        } else {
            borrando = false;
            setTimeout(escribir, velocidad);
        }
    }
}
escribir();





// Activar link cuando se hace clic
function marcarLinkActivo() {
    const hashActual = window.location.hash;
    const enlaces = document.querySelectorAll('.sidebar a');

    enlaces.forEach(link => {
        if (link.getAttribute('href') === hashActual) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('DOMContentLoaded', marcarLinkActivo);
window.addEventListener('hashchange', marcarLinkActivo);






// Scroll suave con offset al hacer clic
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        const offset = 100;

        const topPos = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: topPos,
            behavior: 'smooth'
        });

        // Actualiza el hash manualmente
        history.pushState(null, null, targetId);
        marcarLinkActivo();
    });
});






// Detecta qué sección está en pantalla y resalta el link correspondiente
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".sidebar a");

window.addEventListener("scroll", () => {
  let current = "Kersy";

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    // Ajustamos 50px para detectar antes del final exacto
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});
