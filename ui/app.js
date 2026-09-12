const $ = (id) => document.getElementById(id);

const app = $("app");
const loading = $("loading");
const linkScreen = $("link");
const menu = $("menu");
const statusText = $("status");

let currentServer = {
  id: "default",
  group: "Sem Grupo",
  logo: ""
};

let playerData = {
  username: "Usuário",
  code: "HYP-XXXX-XXXX"
};

function showScreen(screen) {
  loading.classList.add("hidden");
  linkScreen.classList.add("hidden");
  menu.classList.add("hidden");

  screen.classList.remove("hidden");
}

function setServer(data = {}) {
  currentServer = {
    ...currentServer,
    ...data
  };

  $("serverName").textContent =
    currentServer.group || currentServer.name || "Sem Grupo";

  $("serverId").textContent =
    currentServer.id || "default";

  $("statServer").textContent =
    currentServer.group || currentServer.name || "Sem Grupo";

  $("menuGroup").textContent =
    currentServer.group || currentServer.name || "Sem Grupo";

  const logo = $("serverLogo");
  const fallback = $("serverFallback");

  if (currentServer.logo) {
    logo.src = currentServer.logo;

    logo.onload = () => {
      logo.style.display = "block";
      fallback.style.display = "none";
    };

    logo.onerror = () => {
      logo.style.display = "none";
      fallback.style.display = "grid";
    };
  } else {
    logo.style.display = "none";
    fallback.style.display = "grid";
  }
}

function setPlayer(data = {}) {
  playerData = {
    ...playerData,
    ...data
  };

  $("username").textContent =
    playerData.username || "Usuário";

  $("menuUser").textContent =
    playerData.username || "Usuário";

  $("code").textContent =
    playerData.code || "HYP-XXXX-XXXX";
}

function renderPlayers(players = []) {
  const container = $("players");

  container.innerHTML = "";
  $("statPlayers").textContent = players.length;

  if (!players.length) {
    container.innerHTML =
      '<div class="empty-state">Nenhum jogador recebido.</div>';

    return;
  }

  players.forEach((player) => {
    const item = document.createElement("div");
    item.className = "player";

    const name =
      player.name ||
      player.username ||
      "Jogador";

    const id =
      player.id !== undefined
        ? ` #${player.id}`
        : "";

    item.textContent = `${name}${id}`;
    container.appendChild(item);
  });
}

async function nui(action, data = {}) {
  if (
    typeof GetParentResourceName !== "function"
  ) {
    console.log("[Hyper Menu]", action, data);
    return;
  }

  try {
    await fetch(
      `https://${GetParentResourceName()}/${action}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(data)
      }
    );
  } catch (error) {
    console.error(
      "[Hyper Menu] NUI:",
      error
    );
  }
}

document
  .querySelectorAll(".tab")
  .forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".tab")
        .forEach((tab) =>
          tab.classList.remove("active")
        );

      document
        .querySelectorAll(".tab-content")
        .forEach((content) =>
          content.classList.add("hidden")
        );

      button.classList.add("active");

      const target = document.getElementById(
        `tab-${button.dataset.tab}`
      );

      if (target) {
        target.classList.remove("hidden");
      }
    });
  });

document
  .querySelectorAll("[data-action]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      if (button.classList.contains("toggle")) {
        button.classList.toggle("enabled");

        const enabled =
          button.classList.contains("enabled");

        const state = button.querySelector("span");

        if (state) {
          state.textContent =
            enabled ? "ON" : "OFF";
        }

        nui(action, { enabled });
        return;
      }

      nui(action);
    });
  });

$("linkButton").addEventListener("click", () => {
  statusText.textContent =
    "Solicitando vinculação...";

  nui("vincularMenu", {
    code: playerData.code,
    server: currentServer.id
  });
});

$("close").addEventListener("click", () => {
  nui("fecharMenu");
});

window.addEventListener("message", (event) => {
  const data = event.data || {};

  switch (data.action) {
    case "openLoading":
      app.classList.remove("hidden");

      if (data.text) {
        $("loadingText").textContent = data.text;
      }

      if (data.version) {
        $("version").textContent = data.version;
      }

      showScreen(loading);
      break;

    case "openLink":
      app.classList.remove("hidden");

      setServer(
        data.server || data.serverData || {}
      );

      setPlayer(
        data.player || data.playerInfo || {}
      );

      showScreen(linkScreen);
      break;

    case "openMenu":
      app.classList.remove("hidden");

      setServer(
        data.server || data.serverData || {}
      );

      setPlayer(
        data.player || data.playerInfo || {}
      );

      if (Array.isArray(data.players)) {
        renderPlayers(data.players);
      }

      showScreen(menu);
      break;

    case "updatePlayers":
      renderPlayers(data.players || []);
      break;

    case "linked":
      statusText.textContent =
        data.message || "Menu vinculado.";

      if (data.success !== false) {
        setTimeout(() => {
          showScreen(menu);
        }, 600);
      }
      break;

    case "notify":
      statusText.textContent =
        data.message || "";
      break;

    case "closeMenu":
      app.classList.add("hidden");
      break;
  }
});
