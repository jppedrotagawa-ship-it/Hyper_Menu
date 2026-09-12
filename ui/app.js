const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================
   NAVEGAÇÃO LATERAL
========================= */

$$(".side-item").forEach((button) => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;

    $$(".side-item").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    $$(".page").forEach((section) => {
      section.classList.remove("active-page");
    });

    const target = document.getElementById(`page-${page}`);

    if (target) {
      target.classList.add("active-page");
    }
  });
});

/* =========================
   SWITCHES VISUAIS
========================= */

$$(".switch").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("enabled");
  });
});

/* =========================
   SLIDERS
========================= */

const healthSlider = $("#healthSlider");
const healthValue = $("#healthValue");

const armourSlider = $("#armourSlider");
const armourValue = $("#armourValue");

if (healthSlider && healthValue) {
  healthSlider.addEventListener("input", () => {
    healthValue.textContent = healthSlider.value;
  });
}

if (armourSlider && armourValue) {
  armourSlider.addEventListener("input", () => {
    armourValue.textContent = armourSlider.value;
  });
}

/* =========================
   PESQUISA
========================= */

const search = $("#search");

if (search) {
  search.addEventListener("input", () => {
    const text = search.value.toLowerCase().trim();

    document
      .querySelectorAll(".menu-button, .toggle-row")
      .forEach((element) => {
        const matches =
          element.textContent
            .toLowerCase()
            .includes(text);

        element.style.display =
          matches || !text ? "" : "none";
      });
  });
}

/* =========================
   RELÓGIO
========================= */

function updateClock() {
  const clock = $("#clock");

  if (!clock) return;

  const now = new Date();

  clock.textContent =
    now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
}

updateClock();
setInterval(updateClock, 1000);

/* =========================
   FPS VISUAL APROXIMADO
========================= */

let frames = 0;
let lastTime = performance.now();

function fpsLoop(now) {
  frames++;

  if (now - lastTime >= 1000) {
    const fps = $("#fps");

    if (fps) {
      fps.textContent = frames;
    }

    frames = 0;
    lastTime = now;
  }

  requestAnimationFrame(fpsLoop);
}

requestAnimationFrame(fpsLoop);

/* =========================
   DADOS DA INTERFACE
========================= */

function setUser(data = {}) {
  const name =
    data.username ||
    data.name ||
    "Usuário";

  const id =
    data.id !== undefined
      ? data.id
      : "---";

  const profileName = $("#profileName");
  const profileId = $("#profileId");

  if (profileName) {
    profileName.textContent = name;
  }

  if (profileId) {
    profileId.textContent = `ID: ${id}`;
  }
}

function setServer(data = {}) {
  const name =
    data.group ||
    data.name ||
    "Sem Grupo";

  const id =
    data.id ||
    "default";

  const serverName = $("#serverName");
  const serverId = $("#serverId");
  const footerServer = $("#footerServer");

  if (serverName) {
    serverName.textContent = name;
  }

  if (serverId) {
    serverId.textContent = id;
  }

  if (footerServer) {
    footerServer.textContent = name;
  }
}

/* =========================
   LISTA DE JOGADORES
========================= */

function renderPlayers(players = []) {
  const container = $("#players");

  if (!container) return;

  container.innerHTML = "";

  if (!players.length) {
    container.innerHTML =
      "<p>Nenhum jogador recebido.</p>";

    return;
  }

  players.forEach((player) => {
    const item =
      document.createElement("div");

    item.className = "menu-button";

    const name =
      player.name ||
      player.username ||
      "Jogador";

    const id =
      player.id !== undefined
        ? ` #${player.id}`
        : "";

    item.textContent =
      `${name}${id}`;

    container.appendChild(item);
  });
}

/* =========================
   MENSAGENS RECEBIDAS
========================= */

window.addEventListener("message", (event) => {
  const data = event.data || {};

  switch (data.action) {
    case "openMenu":
      document.body.style.display = "";

      setUser(
        data.player ||
        data.playerInfo ||
        {}
      );

      setServer(
        data.server ||
        data.serverData ||
        {}
      );

      if (Array.isArray(data.players)) {
        renderPlayers(data.players);
      }

      break;

    case "updatePlayers":
      renderPlayers(
        data.players || []
      );

      break;

    case "updateUser":
      setUser(
        data.player ||
        data.playerInfo ||
        {}
      );

      break;

    case "updateServer":
      setServer(
        data.server ||
        data.serverData ||
        {}
      );

      break;

    case "closeMenu":
      document.body.style.display =
        "none";

      break;
  }
});

/* =========================
   CALLBACK NUI SEGURO
========================= */

async function nuiCallback(name, data = {}) {
  if (
    typeof GetParentResourceName !== "function"
  ) {
    console.log(
      `[Hyper Menu] ${name}`,
      data
    );

    return;
  }

  try {
    await fetch(
      `https://${GetParentResourceName()}/${name}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json; charset=UTF-8"
        },
        body: JSON.stringify(data)
      }
    );
  } catch (error) {
    console.error(
      "[Hyper Menu]",
      error
    );
  }
}

/* =========================
   FECHAR
========================= */

const closeButton = $("#close");

if (closeButton) {
  closeButton.addEventListener(
    "click",
    () => {
      nuiCallback("fecharMenu");
    }
  );
}

/* botão fechar das configurações */

$("[data-action='fecharMenu']")
  ?.addEventListener("click", () => {
    nuiCallback("fecharMenu");
  });

/* =========================
   TOP TABS VISUAIS
========================= */

$$(".top-tab").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".top-tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    button.classList.add("active");
  });
});
