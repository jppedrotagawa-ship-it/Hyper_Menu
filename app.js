const $ = (s) => document.querySelector(s);
const post = (name, data = {}) => {
  fetch(`https://${GetParentResourceName()}/${name}`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  }).catch(() => {});
};

function show(id) {
  ["loading","link","menu"].forEach(x => $(`#${x}`).classList.add("hidden"));
  $(`#${id}`).classList.remove("hidden");
  $("#app").classList.remove("hidden");
}

function setServer(s = {}) {
  $("#serverName").textContent = s.group || s.name || "Sem Grupo";
  $("#serverId").textContent = s.id || "default";
  $("#statServer").textContent = s.name || s.group || "Servidor";
  $("#statPlayers").textContent = s.players ?? 0;
  $("#statAc").textContent = s.anticheat || "Não detectado";
  if (s.logo) {
    $("#serverLogo").src = s.logo;
    $("#serverLogo").style.display = "";
  }
  $("#menuGroup").textContent = s.group || "Sem Grupo";
}

window.addEventListener("message", (event) => {
  const d = event.data || {};
  if (d.type === "openLoading") show("loading");

  if (d.type === "openLink") {
    show("link");
    $("#username").textContent = d.username || "-";
    $("#code").textContent = d.code || "HYPER----";
    setServer(d.server || {});
  }

  if (d.type === "openMenu") {
    show("menu");
    $("#menuUser").textContent = d.username || "-";
    setServer(d.server || {});
  }

  if (d.type === "closeMenu") {
    $("#app").classList.add("hidden");
  }

  if (d.type === "notify") {
    $("#status").textContent = d.message || "";
  }

  if (d.type === "updatePlayers") {
    const list = $("#players");
    list.innerHTML = "";
    (d.players || []).forEach(p => {
      const row = document.createElement("div");
      row.className = "player";
      row.innerHTML = `<span>${escapeHtml(p.name || "Jogador")}</span><small>ID ${escapeHtml(String(p.id ?? ""))}</small>`;
      list.appendChild(row);
    });
  }
});

function escapeHtml(v) {
  return v.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

$("#close").addEventListener("click", () => post("fecharMenu"));
$("#linkButton").addEventListener("click", () => {
  $("#status").textContent = "Vinculando...";
  post("vincularMenu", {code: $("#code").textContent});
});

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(x => x.classList.add("hidden"));
    btn.classList.add("active");
    $(`#tab-${btn.dataset.tab}`).classList.remove("hidden");
  });
});

document.querySelectorAll("[data-action]").forEach(btn => {
  btn.addEventListener("click", () => post(btn.dataset.action));
});
