
/* ========= 1) Texto dinámico (type & delete) ========= */
(() => {
  const Texto = "En proceso de ser Programador en sistemas.";
  const velocidad = 80;
  const elemento = document.getElementById("texto-Dinamico");
  if (!elemento) return; // por si no existe

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
      elemento.textContent = Texto.substring(0, Math.max(index - 1, 0));
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
})();

/* ========= 2) Marcar link activo en carga/hash ========= */
function marcarLinkActivoPorHash() {
  const hashActual = window.location.hash;
  const enlaces = document.querySelectorAll(".sidebar a");

  enlaces.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href === hashActual) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

window.addEventListener("DOMContentLoaded", marcarLinkActivoPorHash);
window.addEventListener("hashchange", marcarLinkActivoPorHash);

/* ========= 3) Scroll suave con offset + ignorar enlaces vacíos ========= */
(() => {
  const OFFSET = 100;
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Ignora enlaces sin destino o que no empiezan con '#'
      if (!targetId || !targetId.startsWith("#")) return;

      const target = document.querySelector(targetId);
      if (!target) return; // por si no existe la sección

      e.preventDefault();

      const topPos =
        target.getBoundingClientRect().top + window.scrollY - OFFSET;

      window.scrollTo({
        top: topPos,
        behavior: "smooth",
      });

      // Actualiza el hash manualmente sin desplazar bruscamente
      history.pushState(null, "", targetId);
      // No llamamos marcarLinkActivoPorHash aquí; lo hará el observer.
    });
  });
})();

/* ========= 4) Resaltar sección visible con IntersectionObserver ========= */
(() => {
  const sidebarLinks = Array.from(
    document.querySelectorAll(".sidebar a")
  ).filter((a) => a.hash); // sólo con hash

  if (sidebarLinks.length === 0) return;

  // Mapa idDeSeccion -> enlace
  const linkMap = new Map(
    sidebarLinks.map((a) => [a.hash.replace("#", ""), a])
  );

  const highlight = (id) => {
    sidebarLinks.forEach((l) => l.classList.remove("active"));
    const link = linkMap.get(id);
    if (link) link.classList.add("active");
  };

  // Si IntersectionObserver está disponible, úsalo; si no, fallback
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        // Elegimos la sección con mayor intersección visible
        let best = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        }
        if (best) highlight(best.target.id);
      },
      {
        root: null,
        threshold: [0.01, 0.25, 0.5],
        rootMargin: "-40% 0px -50% 0px", // enfoque al centro
      }
    );

    document.querySelectorAll("section[id]").forEach((sec) => observer.observe(sec));
  } else {
    // Fallback: lógica basada en scroll (más robusta que la original)
    const sections = document.querySelectorAll("section[id]");
    function onScroll() {
      const y = window.scrollY + window.innerHeight * 0.35; // punto de referencia ~1/3
      let current = sections[0]?.id || null;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (y >= top && y < bottom) current = sec.id;
      });

      if (current) highlight(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // inicial
  }
})();

/* ========= 5) Protección suave por si hay IDs duplicados o inexistentes ========= */
(() => {
  const ids = new Set();
  document.querySelectorAll("section[id]").forEach((sec) => {
    const id = sec.id.trim();
    if (!id || ids.has(id)) {
      console.warn(
        "[Portafolio] Sección con id inválido o duplicado. Revisa:",
        sec
      );
    }
    ids.add(id);
  });
})();

/* ========= 6) Manejo de onerror de imagenes ========= */
// Manejo global de imágenes que no cargan
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    img.onerror = () => {
      img.onerror = null; // evita loop
      img.removeAttribute("srcset"); // si tuviera srcset
      img.src = img.dataset.fallback || "assets/images/placeholder.png";
    };
  });
});
