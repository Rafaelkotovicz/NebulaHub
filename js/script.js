const app = document.querySelector("#app");

    const assets = {
      movies: [
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=700&q=80"
      ],
      series: [
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=700&q=80"
      ],
      manga: [
        "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80"
      ]
    };

    const data = {
      movies: [
        { title: "Helios Drift", tag: "4K", meta: "Sci-fi | 2h 12m", desc: "Uma equipe cruza um sol morrendo para roubar energia limpa.", img: assets.movies[0] },
        { title: "Noite Carmesim", tag: "Novo", meta: "Thriller | 1h 48m", desc: "Uma cidade inteira some durante um eclipse vermelho.", img: assets.movies[1] },
        { title: "O Ultimo Atlas", tag: "HD", meta: "Aventura | 2h 05m", desc: "Mapas vivos levam exploradores para ruinas impossiveis.", img: assets.movies[2] },
        { title: "Frame Zero", tag: "Top", meta: "Acao | 1h 56m", desc: "Um editor de cinema descobre cortes de outra linha temporal.", img: assets.movies[3] }
      ],
      series: [
        { title: "Blue Protocol", tag: "S02", meta: "8 episodios", desc: "Hackers perseguem uma IA que sonha em codigo aberto.", img: assets.series[0] },
        { title: "Circuito Fantasma", tag: "S01", meta: "10 episodios", desc: "Pilotos digitais competem em pistas que reescrevem a memoria.", img: assets.series[1] },
        { title: "Kernel 9", tag: "Novo", meta: "6 episodios", desc: "Um sistema operacional ganha culto, cidade e inimigos.", img: assets.series[2] },
        { title: "Neon Vale", tag: "Final", meta: "12 episodios", desc: "Detetives resolvem crimes em uma metropole submersa.", img: assets.series[3] }
      ],
      manga: [
        { title: "Sakura Engine", tag: "Shonen", meta: "Cap. 42", desc: "Uma mecanica invoca motores espirituais em Kyoto orbital.", img: assets.manga[0], cat: "Acao" },
        { title: "Lua de Papel", tag: "Drama", meta: "Cap. 19", desc: "Cartas desenhadas conectam dois estudantes em anos diferentes.", img: assets.manga[1], cat: "Drama" },
        { title: "Dojo Astral", tag: "Seinen", meta: "Cap. 64", desc: "Mestres lutam usando constelacoes presas em tinta.", img: assets.manga[2], cat: "Fantasia" },
        { title: "Cafe Yokai", tag: "Slice", meta: "Cap. 27", desc: "Criaturas urbanas se encontram depois da meia-noite.", img: assets.manga[3], cat: "Comedia" }
      ]
    };

    const featuredContent = {
      movies: {
        title: "Quantum Nexus",
        tag: "Destaque",
        meta: "Acao | 2h 08m",
        desc: "Uma anomalia vermelha abre uma sessao que mistura acao, ficcao e perigo cosmico.",
        img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=80"
      },
      series: {
        title: "Blue Protocol",
        tag: "S02",
        meta: "8 episodios",
        desc: "Uma temporada feita de sinais, memoria digital e escolhas que nao ficam quietas.",
        img: assets.series[0]
      }
    };

    const routes = {
      "/": renderAuth,
      "/hub": renderHub,
      "/filmes": () => renderCatalog("movies"),
      "/series": () => renderCatalog("series"),
      "/mangas": renderManga,
      "/player": renderPlayer,
      "/leitor": renderReader,
      "/biblioteca": renderLibrary
    };

    const playerRoutes = {
      movies: {
        returnRoute: "/filmes",
        label: "Filme",
        accent: "#ff2b1f",
        accentTwo: "#ff6b00"
      },
      series: {
        returnRoute: "/series",
        label: "Serie",
        accent: "#2478ff",
        accentTwo: "#00c2ff"
      }
    };

    function routeHref(path, params = {}) {
      const query = new URLSearchParams();
      query.set("route", path);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.set(key, value);
        }
      });
      return `${location.pathname}?${query.toString()}`;
    }

    function navigate(path, params = {}) {
      const currentPath = getRoute();
      if (path === "/player" && ["/filmes", "/series"].includes(currentPath)) {
        sessionStorage.setItem("nebulaPlayerReturnRoute", currentPath);
      }
      if (path === "/player" && params.type && params.id) {
        sessionStorage.setItem("nebulaSelectedMedia", JSON.stringify(params));
      }
      history.pushState({ route: path, ...params }, "", routeHref(path, params));
      render();
    }

    function getSessionUserName() {
      return sessionStorage.getItem("nebulaSessionUser") || "Explorador";
    }

    function getPlayerReturnRoute() {
      const savedRoute = sessionStorage.getItem("nebulaPlayerReturnRoute");
      return ["/filmes", "/series"].includes(savedRoute) ? savedRoute : "/filmes";
    }

    function slugify(value) {
      return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function mediaId(item) {
      return item.id || slugify(item.title);
    }

    function playerNavigationAttrs(type, item, extra = {}) {
      const route = playerRoutes[type];
      if (!route || !item) return "";
      const params = { type, id: mediaId(item), ...extra };
      const attrs = Object.entries(params)
        .map(([key, value]) => `data-${key === "id" ? "media-id" : key === "type" ? "media-type" : key}="${value}"`)
        .join(" ");
      return `${attrs} data-player-return="${route.returnRoute}"`;
    }

    function getRouteParams(element) {
      const params = {};
      if (element.dataset.mediaType) params.type = element.dataset.mediaType;
      if (element.dataset.mediaId) params.id = element.dataset.mediaId;
      if (element.dataset.episode) params.episode = element.dataset.episode;
      return params;
    }

    function render() {
      const path = getRoute();
      routes[path]();
      setActiveNav(path);
      normalizeFavoriteButtons();
    }

    function normalizeFavoriteButtons() {
      document.querySelectorAll("[data-fav]").forEach((button) => {
        const active = button.classList.contains("active");
        button.innerHTML = active ? "&#9733;" : "&#9734;";
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function getRoute() {
      const queryRoute = new URLSearchParams(location.search).get("route");
      return routes[queryRoute] ? queryRoute : "/";
    }

    window.addEventListener("popstate", render);
    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-route]");
      if (!link) return;
      event.preventDefault();
      if (link.dataset.logout) {
        sessionStorage.removeItem("nebulaSessionUser");
      }
      if (link.dataset.playerReturn) {
        sessionStorage.setItem("nebulaPlayerReturnRoute", link.dataset.playerReturn);
      }
      navigate(link.dataset.route, getRouteParams(link));
    });

    function shell(content, className = "") {
      app.innerHTML = `
        <section class="screen page ${className}">
          <header class="topbar">
            <a class="brand" href="${routeHref("/hub")}" data-route="/hub">
              <span class="brand-mark"></span>
              <span>Nebula</span>
            </a>
            <nav class="nav" aria-label="Principal">
              <button data-route="/hub">Hub</button>
              <button data-route="/filmes">Filmes</button>
              <button data-route="/series">Series</button>
              <button data-route="/mangas">Mangas</button>
              <button data-route="/biblioteca">Biblioteca</button>
            </nav>
            <div class="topbar-actions">
              <button class="search-button" type="button" aria-label="Buscar">&#8981;</button>
              <button class="profile-pill" type="button" data-route="/">Sair</button>
            </div>
          </header>
          ${content}
        </section>
      `;
    }

    function setActiveNav(path) {
      document.querySelectorAll(".nav button").forEach((button) => {
        button.classList.toggle("active", button.dataset.route === path);
      });
    }

    function renderAuth() {
      app.innerHTML = `
        <section class="screen page auth-screen initial-auth">
          <div class="star-layer" id="stars"></div>
          <div class="particle-layer" id="particles"></div>
          <div class="initial-glow" aria-hidden="true"></div>
          <div class="login-space-drift" aria-hidden="true">
            <span class="login-planet login-planet-a"></span>
            <span class="login-planet login-planet-b"></span>
            <span class="login-planet login-planet-c"></span>
          </div>
          ${loginVoyagerMarkup()}
          <div class="auth-shell portal-auth-shell">
            <header class="portal-logo">
              <strong>Nebula</strong>
              <span>Hub</span>
            </header>
            <article class="auth-card glass">
              <h2 id="authTitle">Entrar no portal</h2>
              <form class="form auth-form" id="authForm" novalidate>
                <div class="field floating" id="nameField">
                  <input id="authName" name="name" autocomplete="name" placeholder=" ">
                  <label for="authName">Nome</label>
                  <small class="field-error"></small>
                </div>
                <div class="field floating">
                  <input id="authEmail" name="email" type="email" autocomplete="email" required placeholder=" ">
                  <label for="authEmail">Email</label>
                  <small class="field-error"></small>
                </div>
                <div class="field floating password-field">
                  <input id="authPassword" name="password" type="password" autocomplete="current-password" required placeholder=" ">
                  <label for="authPassword">Senha</label>
                  <button class="password-toggle" id="passwordToggle" type="button" aria-label="Mostrar senha" title="Mostrar senha">
                    <span class="eye-icon" aria-hidden="true"></span>
                  </button>
                  <small class="field-error"></small>
                </div>
                <div class="field floating" id="confirmField">
                  <input id="authConfirm" name="confirm" type="password" autocomplete="new-password" placeholder=" ">
                  <label for="authConfirm">Confirmar senha</label>
                  <small class="field-error"></small>
                </div>
                <button class="primary auth-submit" id="authSubmit" type="submit">Entrar no portal</button>
                <p class="auth-note" id="authNote"></p>
                <span class="auth-divider" aria-hidden="true"></span>
                <button class="ghost auth-alt" id="authSwitchButton" type="button" data-auth-tab="signup">Criar conta</button>
                <p class="auth-switch" id="authSwitch">Novo por aqui? <button type="button" data-auth-tab="signup">Crie sua conta.</button></p>
              </form>
            </article>
          </div>
          <button class="help-fab" type="button" aria-label="Ajuda">?</button>
        </section>
      `;
      createStars(126);
      initAuth();
      initParticleTracking();
    }

    function loginVoyagerMarkup() {
      return `
        <div class="login-voyager" aria-hidden="true">
          <svg class="login-voyager-ship login-rocket" viewBox="0 0 260 260" role="img">
            <defs>
              <linearGradient id="rocketBody" x1="66" y1="44" x2="182" y2="183" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#ffffff"/>
                <stop offset=".58" stop-color="#eef8f6"/>
                <stop offset="1" stop-color="#c9dedb"/>
              </linearGradient>
              <linearGradient id="rocketShade" x1="110" y1="54" x2="160" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#ffffff" stop-opacity=".82"/>
                <stop offset="1" stop-color="#abc4c1" stop-opacity=".8"/>
              </linearGradient>
              <radialGradient id="rocketWindow" cx="38%" cy="31%" r="72%">
                <stop offset="0" stop-color="#7af6ff"/>
                <stop offset=".48" stop-color="#17bfd3"/>
                <stop offset="1" stop-color="#006d8f"/>
              </radialGradient>
              <linearGradient id="rocketRed" x1="45" y1="38" x2="205" y2="208" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#ff5d34"/>
                <stop offset=".5" stop-color="#ff3f27"/>
                <stop offset="1" stop-color="#d82f25"/>
              </linearGradient>
              <linearGradient id="rocketFlame" x1="170" y1="166" x2="232" y2="236" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#9bfff7"/>
                <stop offset=".45" stop-color="#1be5ef"/>
                <stop offset="1" stop-color="#0799b3"/>
              </linearGradient>
              <filter id="rocketShadow" x="-25%" y="-20%" width="155%" height="160%">
                <feDropShadow dx="0" dy="18" stdDeviation="11" flood-color="#020713" flood-opacity=".42"/>
                <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#48f3ff" flood-opacity=".28"/>
              </filter>
            </defs>
            <g class="ship-comet-lines rocket-stars">
              <path d="M30 62 h12 M36 56 v12" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity=".78"/>
              <path d="M213 45 h17 M222 36 v17" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" opacity=".82"/>
              <path d="M29 202 h14 M36 195 v14" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
              <path d="M223 215 h9 M227.5 210.5 v9" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".62"/>
            </g>
            <g class="ship-body rocket-body" filter="url(#rocketShadow)">
              <path class="ship-flame rocket-flame rocket-flame-outer" d="M172 168 C202 178 222 200 235 240 C199 225 178 203 164 177 Z" fill="url(#rocketFlame)"/>
              <path class="ship-flame rocket-flame rocket-flame-inner" d="M170 171 C190 181 204 196 214 219 C192 210 174 194 160 178 Z" fill="#9bfff7"/>
              <path class="ship-wing rocket-fin rocket-fin-back" d="M142 143 C165 143 190 148 207 169 C188 171 169 167 151 157 Z" fill="url(#rocketRed)"/>
              <path class="ship-wing rocket-fin rocket-fin-front" d="M151 150 C165 171 167 197 156 222 C136 204 127 179 132 153 Z" fill="url(#rocketRed)"/>
              <path class="rocket-body-shell" d="M48 43 C92 30 151 45 191 86 C166 142 126 183 75 204 C52 169 35 129 31 87 C30 68 35 52 48 43 Z" fill="url(#rocketBody)"/>
              <path class="rocket-body-shadow" d="M113 52 C152 65 183 96 192 118 C170 153 137 184 76 204 C107 166 135 112 113 52 Z" fill="url(#rocketShade)" opacity=".86"/>
              <path class="rocket-nose" d="M48 43 C68 37 91 36 112 42 L33 94 C31 73 35 53 48 43 Z" fill="url(#rocketRed)"/>
              <path class="rocket-nose-shade" d="M48 43 C63 39 80 38 96 40 L38 79 C37 64 40 51 48 43 Z" fill="#ff704c" opacity=".9"/>
              <path class="rocket-stripe" d="M93 174 C115 163 138 143 156 119 L167 132 C147 159 122 181 99 194 Z" fill="url(#rocketRed)"/>
              <circle class="ship-cockpit rocket-window-ring" cx="91" cy="93" r="38" fill="url(#rocketRed)"/>
              <circle class="rocket-window-rim" cx="91" cy="93" r="29" fill="#12394a"/>
              <circle class="ship-astro-visor rocket-window-glass" cx="91" cy="93" r="24" fill="url(#rocketWindow)"/>
              <path class="rocket-window-glint" d="M78 78 C89 69 106 72 116 86" fill="none" stroke="#a7fbff" stroke-width="5" stroke-linecap="round" opacity=".68"/>
              <path d="M63 143 C82 158 104 166 129 166" fill="none" stroke="#bfd7d5" stroke-width="5" stroke-linecap="round" opacity=".52"/>
            </g>
          </svg>
        </div>
      `;
    }

    function initAuth() {
      const nameField = document.querySelector("#nameField");
      const confirmField = document.querySelector("#confirmField");
      const title = document.querySelector("#authTitle");
      const submit = document.querySelector("#authSubmit");
      const switchText = document.querySelector("#authSwitch");
      const switchButton = document.querySelector("#authSwitchButton");
      const password = document.querySelector("#authPassword");
      const confirm = document.querySelector("#authConfirm");
      const toggle = document.querySelector("#passwordToggle");
      const note = document.querySelector("#authNote");
      let mode = "login";

      function setMode(nextMode) {
        mode = nextMode;
        const signup = mode === "signup";
        title.textContent = signup ? "Criar conta" : "Entrar no portal";
        submit.textContent = signup ? "Criar conta" : "Entrar no portal";
        password.autocomplete = signup ? "new-password" : "current-password";
        nameField.classList.toggle("hidden", !signup);
        confirmField.classList.toggle("hidden", !signup);
        switchButton.textContent = signup ? "Voltar ao inicio" : "Criar conta";
        switchButton.dataset.authTab = signup ? "login" : "signup";
        switchText.innerHTML = signup
          ? `Ja tem acesso? <button type="button" data-auth-tab="login">Voltar ao inicio.</button>`
          : `Novo por aqui? <button type="button" data-auth-tab="signup">Crie sua conta.</button>`;
        note.textContent = "";
        clearFieldErrors();
        document.querySelectorAll("[data-auth-tab]").forEach((item) => {
          item.classList.toggle("active", item.dataset.authTab === mode);
        });
      }

      document.querySelector(".initial-auth").addEventListener("click", (event) => {
        const tab = event.target.closest("[data-auth-tab]");
        if (!tab) return;
        event.preventDefault();
        setMode(tab.dataset.authTab);
      });

      toggle.addEventListener("click", () => {
        const visible = password.type === "text";
        password.type = visible ? "password" : "text";
        confirm.type = visible ? "password" : "text";
        toggle.classList.toggle("active", !visible);
        toggle.setAttribute("aria-label", visible ? "Mostrar senha" : "Ocultar senha");
        toggle.title = visible ? "Mostrar senha" : "Ocultar senha";
      });

      document.querySelector("#authForm").addEventListener("submit", (event) => {
        event.preventDefault();
        clearFieldErrors();
        const email = document.querySelector("#authEmail");
        const name = document.querySelector("#authName");
        let valid = true;

        if (mode === "signup" && name.value.trim().length < 2) {
          setFieldError(name, "Informe seu nome.");
          valid = false;
        }

        if (!email.validity.valid) {
          setFieldError(email, "Use um email valido.");
          valid = false;
        }

        if (password.value.trim().length < 6) {
          setFieldError(password, "A senha precisa ter pelo menos 6 caracteres.");
          valid = false;
        }

        if (mode === "signup" && confirm.value !== password.value) {
          setFieldError(confirm, "As senhas precisam ser iguais.");
          valid = false;
        }

        if (!valid) {
          note.textContent = "Revise os campos destacados.";
          return;
        }

        const sessionName = mode === "signup" ? name.value.trim() : email.value.trim().split("@")[0];
        sessionStorage.setItem("nebulaSessionUser", sessionName || "Explorador");
        note.textContent = mode === "signup" ? "Conta criada. Abrindo seu hub..." : "Bem-vindo de volta. Abrindo seu hub...";
        setTimeout(() => navigate("/hub"), 420);
      });

      setMode("login");
    }

    function clearFieldErrors() {
      document.querySelectorAll(".field.invalid").forEach((field) => field.classList.remove("invalid"));
      document.querySelectorAll(".field-error").forEach((error) => {
        error.textContent = "";
      });
    }

    function setFieldError(input, message) {
      const field = input.closest(".field");
      if (!field) return;
      field.classList.add("invalid");
      const error = field.querySelector(".field-error");
      if (error) error.textContent = message;
    }

    function createStars(amount) {
      const layer = document.querySelector("#stars");
      if (!layer) return;
      layer.innerHTML = Array.from({ length: amount }, () => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 4;
        const speed = 2 + Math.random() * 4;
        const driftX = (Math.random() > .5 ? 1 : -1) * (10 + Math.random() * 28);
        const driftY = 16 + Math.random() * 42;
        const driftSpeed = 18 + Math.random() * 26;
        const size = 1 + Math.random() * 2.2;
        const scale = .72 + Math.random() * .72;
        return `<span class="star" style="left:${left}%;top:${top}%;width:${size}px;animation-delay:${delay}s;--twinkle:${speed}s;--drift-x:${driftX}px;--drift-y:${driftY}px;--star-drift:${driftSpeed}s;--star-scale:${scale}"></span>`;
      }).join("");
    }

    function initParticleTracking() {
      const layer = document.querySelector("#particles");
      if (!layer) return;
      let last = 0;
      window.onpointermove = (event) => {
        const now = performance.now();
        if (now - last < 38) return;
        last = now;
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${event.clientX}px`;
        particle.style.top = `${event.clientY}px`;
        layer.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
      };
    }

    function renderHub() {
      window.onpointermove = null;
      const userName = getSessionUserName();
      app.innerHTML = `
        <section class="screen page hub-screen initial-hub">
          <div class="star-layer" id="stars"></div>
          <div class="orb-layer" id="orbs"></div>
          <div class="nebula-mist" aria-hidden="true"></div>
          <div class="hub-account-bar">
            <details class="account-menu">
              <summary class="logout-button">Minha Conta</summary>
              <div class="account-menu-panel">
                <div class="account-menu-user">
                  <span>Usuario logado</span>
                  <strong>${userName}</strong>
                </div>
                <button type="button" data-route="/biblioteca">Biblioteca</button>
                <button type="button" data-route="/leitor">Ultima leitura</button>
                <button class="danger" type="button" data-route="/" data-logout="true">Sair da conta</button>
              </div>
            </details>
          </div>
          <div class="universe-shell">
            <header class="universe-title">
              <div class="universe-heading">
                <div class="universe-title-copy">
                  <span>Nebula Hub</span>
                  <h1>Escolha seu universo</h1>
                  <p>Selecione uma dimensao para entrar.</p>
                </div>
                ${astronautMarkup("hub-astronaut")}
              </div>
            </header>
            <section class="universe-grid" aria-label="Universos">
              ${universeCard("/filmes", "Filmes", "Cinema Dimensional", "symbol-film", "linear-gradient(135deg, #ff150f, #ff5a00)", "Estreias, classicos e sessoes de impacto.", "Abrir cinema")}
              ${universeCard("/series", "Series", "Cronicas Infinitas", "symbol-series", "linear-gradient(135deg, #1d63ff, #07a8d8)", "Temporadas, progresso e episodios recentes.", "Abrir cronicas")}
              ${universeCard("/mangas", "Mangas", "Dimensao Nippon", "symbol-manga", "linear-gradient(135deg, #9b23ea, #ff008c)", "Capitulos, categorias e leitura imersiva.", "Abrir mangas")}
            </section>
          </div>
          <button class="help-fab" type="button" aria-label="Ajuda">?</button>
        </section>
      `;
      createStars(74);
      createOrbs();
      setAstronautLoadSpeed();
      initUniverseWarp();
    }

    function astronautMarkup(extraClass = "") {
      const idSuffix = (extraClass || "orbit").replace(/[^a-z0-9_-]/gi, "") || "orbit";
      const suitId = `nebulaSuit-${idSuffix}`;
      const visorId = `nebulaVisor-${idSuffix}`;
      const shadowId = `astroShadow-${idSuffix}`;

      return `
        <div class="astronaut-companion ${extraClass}" aria-hidden="true">
          <svg class="astronaut-svg" viewBox="0 0 180 180" role="img">
            <defs>
              <linearGradient id="${suitId}" x1="38" y1="18" x2="136" y2="152" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#ffffff"/>
                <stop offset=".58" stop-color="#dfe9f4"/>
                <stop offset="1" stop-color="#9fb3c8"/>
              </linearGradient>
              <linearGradient id="${visorId}" x1="86" y1="42" x2="134" y2="88" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#3ee9ff"/>
                <stop offset=".62" stop-color="#16a6dd"/>
                <stop offset="1" stop-color="#0f4e8a"/>
              </linearGradient>
              <filter id="${shadowId}" x="-35%" y="-35%" width="170%" height="170%">
                <feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#000000" flood-opacity=".35"/>
              </filter>
            </defs>
            <g class="astro-svg-trail">
              <path d="M25 126 C54 114 72 109 106 115" fill="none" stroke="#8fd7ff" stroke-width="4" stroke-linecap="round" opacity=".38"/>
              <path d="M13 138 C49 120 78 116 119 126" fill="none" stroke="#ff5cce" stroke-width="3" stroke-linecap="round" opacity=".24"/>
            </g>
            <g class="astro-svg-body" filter="url(#${shadowId})">
              <path class="astro-svg-arm-left" d="M58 83 L33 67 L24 81 L55 111 Z" fill="url(#${suitId})"/>
              <path class="astro-svg-arm-right" d="M126 78 L151 55 L164 68 L136 101 Z" fill="url(#${suitId})"/>
              <circle cx="28" cy="80" r="9" fill="#f6fbff"/>
              <circle cx="158" cy="66" r="9" fill="#f6fbff"/>
              <path class="astro-svg-leg-left" d="M80 121 L58 151 L73 160 L99 130 Z" fill="url(#${suitId})"/>
              <path class="astro-svg-leg-right" d="M105 124 L111 160 L130 156 L124 120 Z" fill="url(#${suitId})"/>
              <path d="M57 151 L40 157 L50 171 L75 161 Z" fill="#dce8f3"/>
              <path d="M112 160 L119 177 L139 167 L130 154 Z" fill="#dce8f3"/>
              <rect class="astro-svg-pack" x="54" y="82" width="28" height="47" rx="10" fill="#8ea6bd"/>
              <path class="astro-svg-flame" d="M48 99 C28 107 22 117 12 136 C34 126 44 117 57 105 Z" fill="#8fd7ff" opacity=".58"/>
              <path class="astro-svg-torso" d="M68 77 C82 67 109 69 124 83 C136 96 130 123 111 135 C94 145 72 135 63 118 C55 103 56 87 68 77 Z" fill="url(#${suitId})"/>
              <rect x="78" y="94" width="34" height="28" rx="5" fill="#c5d8e9"/>
              <path d="M84 100 H90 V117 H84 Z M95 100 H101 V117 H95 Z M106 100 H112 V117 H106 Z" fill="#ffffff" opacity=".78"/>
              <circle cx="118" cy="100" r="4" fill="#ff5cce"/>
              <circle cx="118" cy="113" r="4" fill="#6aa7ff"/>
              <path class="astro-svg-emblem" d="M94 127 L98 135 L107 136 L101 142 L102 151 L94 147 L86 151 L88 142 L81 136 L90 135 Z" fill="#ff5cce" opacity=".9"/>
              <circle class="astro-svg-helmet" cx="105" cy="58" r="34" fill="url(#${suitId})"/>
              <path d="M79 55 C84 35 112 24 132 42 C148 56 141 82 122 91 C100 101 74 82 79 55 Z" fill="#f7fbff"/>
              <path class="astro-svg-visor" d="M96 42 C112 35 133 43 140 58 C143 66 139 76 132 81 C116 87 96 78 90 66 C86 57 88 47 96 42 Z" fill="url(#${visorId})"/>
              <path class="astro-svg-glint" d="M100 45 C112 40 127 44 135 55" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity=".75"/>
            </g>
          </svg>
        </div>
      `;
    }

    function setAstronautLoadSpeed() {
      const screen = document.querySelector(".initial-hub");
      const navEntry = performance.getEntriesByType("navigation")[0];
      const loadMs = navEntry?.duration || performance.now();
      const duration = Math.max(1.05, Math.min(3.2, loadMs / 650));
      screen?.style.setProperty("--astro-flight-duration", `${duration.toFixed(2)}s`);
    }

    function initUniverseWarp() {
      const screen = document.querySelector(".initial-hub");
      const cards = document.querySelectorAll(".universe-card");
      cards.forEach((card) => {
        card.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          const route = card.dataset.route;
          if (!route || screen.classList.contains("is-warping")) return;

          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            navigate(route);
            return;
          }

          const rect = card.getBoundingClientRect();
          const astronaut = document.querySelector(".hub-astronaut");
          const astronautRect = astronaut?.getBoundingClientRect();
          const startX = astronautRect ? astronautRect.left + astronautRect.width / 2 : window.innerWidth / 2;
          const startY = astronautRect ? astronautRect.top + astronautRect.height / 2 : window.innerHeight / 2;
          const endX = rect.left + rect.width / 2;
          const endY = rect.top + rect.height / 2;
          const overlay = document.createElement("div");
          const core = document.createElement("div");
          const label = document.createElement("span");
          const flyer = document.createElement("div");

          overlay.className = "warp-overlay";
          overlay.style.setProperty("--warp-x", `${endX}px`);
          overlay.style.setProperty("--warp-y", `${endY}px`);
          overlay.style.setProperty("--warp-left", `${rect.left}px`);
          overlay.style.setProperty("--warp-top", `${rect.top}px`);
          overlay.style.setProperty("--warp-w", `${rect.width}px`);
          overlay.style.setProperty("--warp-h", `${rect.height}px`);
          overlay.style.setProperty("--warp-dx", `${window.innerWidth / 2 - endX}px`);
          overlay.style.setProperty("--warp-dy", `${window.innerHeight / 2 - endY}px`);
          overlay.style.setProperty("--astro-start-x", `${startX}px`);
          overlay.style.setProperty("--astro-start-y", `${startY}px`);
          overlay.style.setProperty("--astro-dx", `${endX - startX}px`);
          overlay.style.setProperty("--astro-dy", `${endY - startY}px`);

          core.className = "warp-core";
          core.setAttribute("style", card.getAttribute("style") || "");
          label.textContent = card.querySelector("strong")?.textContent || "Nebula";
          core.appendChild(label);
          flyer.className = "warp-astronaut";
          flyer.innerHTML = astronautMarkup("warp-astronaut-body");
          overlay.appendChild(core);
          overlay.appendChild(flyer);

          screen.classList.add("is-warping");
          card.classList.add("is-selected");
          screen.appendChild(overlay);

          requestAnimationFrame(() => overlay.classList.add("active"));
          setTimeout(() => navigate(route), 860);
        });
      });
    }

    function universeCard(route, title, label, symbol, gradient, description, action) {
      const accents = {
        "/filmes": ["#ff2b1f", "#ff6b00"],
        "/series": ["#2478ff", "#00c2ff"],
        "/mangas": ["#b429ff", "#ff1496"]
      };
      const [accent, accentTwo] = accents[route];
      return `
        <a class="universe-card" href="${routeHref(route)}" data-route="${route}" style="--card-gradient:${gradient};--dimension-accent:${accent};--dimension-accent-2:${accentTwo};">
          <span class="universe-orb" aria-hidden="true"><span class="dimension-symbol ${symbol}"></span></span>
          <span class="universe-kicker">${label}</span>
          <strong>${title}</strong>
          <small>${description}</small>
          <span class="universe-action">${action}</span>
        </a>
      `;
    }

    function portal(route, title, desc, colorVar, image, tags, icon) {
      return `
        <a class="portal" href="${routeHref(route)}" data-route="${route}" style="--accent:var(${colorVar});--image:${image}">
          <span class="portal-icon">${icon}</span>
          <h2>${title}</h2>
          <p>${desc}</p>
          <div class="portal-meta">${tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
        </a>
      `;
    }

    function contentRail(title, items, route, type) {
      return `
        <section class="content-rail-section">
          <div class="rail-heading">
            <h2>${title}</h2>
            <button class="link-button" type="button" data-route="${type === "manga" ? "/mangas" : type === "movies" ? "/filmes" : "/series"}">Ver tudo</button>
          </div>
          <div class="content-rail">
            ${items.map((item, index) => railCard(item, index, route, type)).join("")}
          </div>
        </section>
      `;
    }

    function railCard(item, index, route, type) {
      const progress = 22 + (index * 17) % 62;
      const playerAttrs = route === "/player" ? ` ${playerNavigationAttrs(type, item)}` : "";
      return `
        <article class="rail-card" data-route="${route}"${playerAttrs} tabindex="0">
          <div class="rail-thumb">
            <img src="${item.img}" alt="${item.title}">
            <span class="rank">${index + 1}</span>
          </div>
          <div class="rail-info">
            <h3>${item.title}</h3>
            <p>${item.meta}</p>
            <div class="mini-progress" aria-label="Progresso"><span style="width:${type === "manga" ? 0 : progress}%"></span></div>
          </div>
        </article>
      `;
    }

    function createOrbs() {
      const layer = document.querySelector("#orbs");
      if (!layer) return;
      const colors = ["rgba(77,232,255,.5)", "rgba(255,79,216,.45)", "rgba(255,209,102,.38)", "rgba(85,246,162,.38)"];
      layer.innerHTML = Array.from({ length: 18 }, (_, index) => `
        <span class="orb" style="--size:${36 + Math.random() * 90}px;--x:${Math.random() * 96}%;--y:${Math.random() * 92}%;--speed:${4 + Math.random() * 7}s;--color:${colors[index % colors.length]}"></span>
      `).join("");
    }

    function renderCatalog(type) {
      const config = dimensionConfig(type);
      renderDimension(config, data[type]);
      if (type === "series") createRain();
    }

    function renderDimension(config, items) {
      window.onpointermove = null;
      const featureAttrs = config.actionRoute === "/player"
        ? ` ${playerNavigationAttrs(config.type, config.feature.media || items[0])}`
        : "";
      app.innerHTML = `
        <section class="screen page dimension-screen ${config.className}" style="${dimensionVars(config)}">
          ${config.effect || ""}
          <button class="dimension-back" type="button" data-route="/hub">&larr; Voltar ao Hub</button>
          <header class="dimension-header">
            <span class="dimension-symbol ${config.symbol}" aria-hidden="true"></span>
            <h1>${config.title}</h1>
            <p>${config.subtitle}</p>
          </header>
          <section class="dimension-feature glass">
            <span class="eyebrow">Em destaque</span>
            <h2>${config.feature.title}</h2>
            <p>${config.feature.text}</p>
            <button class="dimension-cta" type="button" data-route="${config.actionRoute}"${featureAttrs}>${config.actionLabel}</button>
          </section>
          ${config.categories ? dimensionCategories(config.categories) : ""}
          <section class="dimension-grid" id="${config.gridId}">
            ${items.map((item, index) => dimensionCard(item, index, config)).join("")}
          </section>
        </section>
      `;
    }

    function dimensionConfig(type) {
      const configs = {
        movies: {
          type: "movies",
          className: "cinema-dimension",
          title: "Cinema Dimensional",
          subtitle: "Filmes que parecem atravessar a tela antes mesmo do play.",
          symbol: "symbol-film",
          accent: "#ff2b1f",
          accentTwo: "#ff6b00",
          deep: "#060100",
          haze: "#2a0804",
          glow: "rgba(255, 71, 18, .32)",
          actionLabel: "Assistir agora",
          actionRoute: "/player",
          gridId: "movieGrid",
          feature: {
            title: "Quantum Nexus",
            text: "Uma anomalia vermelha abre uma sessao que mistura acao, ficcao e perigo cosmico.",
            media: featuredContent.movies
          }
        },
        series: {
          type: "series",
          className: "series-dimension",
          title: "Cronicas Infinitas",
          subtitle: "Temporadas em fluxo azul, episodios vivos e progresso sempre perto.",
          symbol: "symbol-series",
          accent: "#2478ff",
          accentTwo: "#00c2ff",
          deep: "#000713",
          haze: "#071f38",
          glow: "rgba(44, 145, 255, .32)",
          actionLabel: "Continuar serie",
          actionRoute: "/player",
          gridId: "seriesGrid",
          effect: `<div class="rain-layer" id="rain"></div>`,
          feature: {
            title: "Blue Protocol",
            text: "Uma temporada feita de sinais, memoria digital e escolhas que nao ficam quietas.",
            media: featuredContent.series
          }
        }
      };
      return configs[type];
    }

    function dimensionVars(config) {
      return `--dimension-accent:${config.accent};--dimension-accent-2:${config.accentTwo};--dimension-deep:${config.deep};--dimension-haze:${config.haze};--dimension-glow:${config.glow};`;
    }

    function dimensionCategories(categories) {
      return `
        <nav class="dimension-categories" aria-label="Categorias">
          ${categories.map((cat, index) => `<button class="${index === 0 ? "active" : ""}" type="button" data-category="${cat}">${cat}</button>`).join("")}
        </nav>
      `;
    }

    function dimensionCard(item, index, config) {
      const details = dimensionDetails(item, index, config.className);
      const actionAttrs = config.actionRoute === "/player" ? ` ${playerNavigationAttrs(config.type, item)}` : "";
      return `
        <article class="dimension-card" data-cat="${item.cat || details.genre}" tabindex="0">
          <div class="dimension-card-bg" style="background-image:url('${item.img}')"></div>
          <div class="dimension-card-top">
            <span class="rating-pill">&#9733; ${details.rating}</span>
            <span class="year-pill">${details.year}</span>
          </div>
          <div class="dimension-card-body">
            <h3>${item.title}</h3>
            <p>${details.genre}</p>
            <small>${details.length}</small>
            <div class="card-actions">
              <button class="ghost" data-route="${config.actionRoute}"${actionAttrs}>${details.action}</button>
              <button class="icon-button" title="Favoritar" aria-label="Favoritar" aria-pressed="false" data-fav="${index}">&#9734;</button>
            </div>
          </div>
        </article>
      `;
    }

    function dimensionDetails(item, index, className) {
      const movieGenres = ["Sci-Fi", "Acao", "Thriller", "Aventura", "Suspense", "Drama"];
      const seriesGenres = ["Cyberpunk", "Misterio", "Sci-Fi", "Drama", "Acao", "Fantasia"];
      const ratings = ["9.2", "8.7", "8.9", "9.0", "8.5", "8.8"];
      const years = ["2026", "2026", "2025", "2026", "2025", "2026"];
      const manga = className.includes("manga");
      const series = className.includes("series");
      return {
        rating: ratings[index % ratings.length],
        year: manga ? `Cap. ${18 + index * 7}` : years[index % years.length],
        genre: item.cat || (series ? seriesGenres[index % seriesGenres.length] : movieGenres[index % movieGenres.length]),
        length: manga ? item.meta : series ? `${6 + index * 2} episodios` : item.meta.split("|").pop().trim(),
        action: manga ? "Ler agora" : series ? "Assistir episodio" : "Assistir"
      };
    }

    function createRain() {
      const layer = document.querySelector("#rain");
      if (!layer) return;
      const symbols = "010101NEBULA";
      layer.innerHTML = Array.from({ length: 70 }, () => `
        <span class="rain-symbol" style="--x:${Math.random() * 100}%;--speed:${3 + Math.random() * 5}s;animation-delay:-${Math.random() * 8}s">${symbols[Math.floor(Math.random() * symbols.length)]}</span>
      `).join("");
    }

    function renderManga() {
      const config = {
        className: "manga-dimension",
        title: "Dimensao Nippon",
        subtitle: "Capitulos, categorias e paginas que florescem em neon.",
        symbol: "symbol-manga",
        accent: "#b429ff",
        accentTwo: "#ff1496",
        deep: "#0b0311",
        haze: "#2d0732",
        glow: "rgba(219, 48, 255, .28)",
        actionLabel: "Ler agora",
        actionRoute: "/leitor",
        gridId: "mangaGrid",
        effect: `<div class="petal-layer" id="petals"></div>`,
        categories: ["Todos", "Acao", "Drama", "Fantasia", "Comedia"],
        feature: {
          title: "Sakura Engine",
          text: "Uma mecanica desperta motores espirituais entre petalas, tinta e portais."
        }
      };
      renderDimension(config, data.manga);
      createPetals();
      initMangaFilter();
    }

    function initMangaFilter() {
      document.querySelectorAll("[data-category]").forEach((button) => {
        button.addEventListener("click", () => {
          const category = button.dataset.category;
          document.querySelectorAll("[data-category]").forEach((item) => item.classList.remove("active"));
          button.classList.add("active");
          document.querySelectorAll("[data-cat]").forEach((cardItem) => {
            cardItem.classList.toggle("hidden", category !== "Todos" && cardItem.dataset.cat !== category);
          });
        });
      });
    }

    function createPetals() {
      const layer = document.querySelector("#petals");
      if (!layer) return;
      layer.innerHTML = Array.from({ length: 34 }, () => `
        <span class="petal" style="--x:${Math.random() * 100}%;--speed:${7 + Math.random() * 8}s;animation-delay:-${Math.random() * 12}s"></span>
      `).join("");
    }

    function getStoredPlayerParams() {
      try {
        return JSON.parse(sessionStorage.getItem("nebulaSelectedMedia") || "{}");
      } catch {
        return {};
      }
    }

    function getSelectedPlayerParams() {
      const query = new URLSearchParams(location.search);
      const stored = getStoredPlayerParams();
      return {
        type: query.get("type") || stored.type || "movies",
        id: query.get("id") || stored.id || mediaId(data.movies[0]),
        episode: query.get("episode") || stored.episode || ""
      };
    }

    function findPlayableMedia(type, id) {
      const pool = [featuredContent[type], ...(data[type] || [])].filter(Boolean);
      return pool.find((item) => mediaId(item) === id) || pool[0] || data.movies[0];
    }

    function mediaIndex(type, item) {
      return Math.max(0, (data[type] || []).findIndex((entry) => mediaId(entry) === mediaId(item)));
    }

    function secondsFromMeta(meta, fallback) {
      const match = String(meta).match(/(\d+)h\s*(\d+)m/i);
      if (!match) return fallback;
      return (Number(match[1]) * 3600) + (Number(match[2]) * 60);
    }

    function formatTime(seconds) {
      const safeSeconds = Math.max(0, Math.round(seconds));
      const hours = Math.floor(safeSeconds / 3600);
      const minutes = Math.floor((safeSeconds % 3600) / 60);
      const remaining = safeSeconds % 60;
      if (hours) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
      }
      return `${minutes}:${String(remaining).padStart(2, "0")}`;
    }

    function playbackInfo(type, item, requestedEpisode) {
      const id = mediaId(item);
      const profiles = {
        "quantum-nexus": { current: 18 * 60 + 42, total: 2 * 3600 + 8 * 60, chapter: "Fenda vermelha" },
        "helios-drift": { current: 42 * 60 + 18, chapter: "Cruzando o sol morto" },
        "noite-carmesim": { current: 19 * 60 + 8, chapter: "Eclipse vermelho" },
        "o-ultimo-atlas": { current: 36 * 60 + 45, chapter: "Mapa vivo" },
        "frame-zero": { current: 27 * 60 + 12, chapter: "Corte impossivel" },
        "blue-protocol": { episode: 4, season: 2, current: 18 * 60 + 32, total: 48 * 60, chapter: "Sinal aberto" },
        "circuito-fantasma": { episode: 7, season: 1, current: 31 * 60 + 10, total: 44 * 60, chapter: "Corrida fantasma" },
        "kernel-9": { episode: 2, season: 1, current: 12 * 60 + 54, total: 46 * 60, chapter: "Permissao raiz" },
        "neon-vale": { episode: 10, season: 1, current: 28 * 60 + 21, total: 50 * 60, chapter: "Cidade submersa" }
      };
      const profile = profiles[id] || {};
      const index = mediaIndex(type, item);
      const movieGenres = ["Sci-Fi", "Acao", "Thriller", "Aventura"];
      const seriesGenres = ["Cyberpunk", "Misterio", "Sci-Fi", "Drama"];
      const route = playerRoutes[type] || playerRoutes.movies;
      const isSeries = type === "series";
      const total = profile.total || (isSeries ? (44 + index * 2) * 60 : secondsFromMeta(item.meta, 112 * 60));
      const current = Math.min(profile.current || Math.round(total * .24), Math.max(0, total - 10));
      const episode = Number(requestedEpisode || profile.episode || 1);
      const season = profile.season || Number(String(item.tag).replace(/\D/g, "")) || 1;
      const genre = isSeries ? seriesGenres[index % seriesGenres.length] : (item.meta.split("|")[0] || movieGenres[index % movieGenres.length]).trim();
      return {
        label: route.label,
        accent: route.accent,
        accentTwo: route.accentTwo,
        returnRoute: route.returnRoute,
        total,
        current,
        percent: Math.max(0, Math.min(100, (current / total) * 100)),
        subtitle: isSeries
          ? `T${season}:E${episode} - ${genre} - ${profile.chapter || "Episodio atual"}`
          : `${genre} - ${item.meta.split("|").pop().trim()} - ${profile.chapter || "Sessao principal"}`
      };
    }

    function resolvePlayerContent() {
      const params = getSelectedPlayerParams();
      const type = playerRoutes[params.type] ? params.type : "movies";
      const item = findPlayableMedia(type, params.id);
      return {
        type,
        item,
        info: playbackInfo(type, item, params.episode)
      };
    }

    function renderPlayer() {
      window.onpointermove = null;
      const player = resolvePlayerContent();
      const poster = player.item.img.replace(/"/g, "%22");
      app.innerHTML = `
        <section class="screen page player-screen" style="--player-accent:${player.info.accent};--player-accent-2:${player.info.accentTwo};">
          <div class="player-stage ${player.type}-player" id="playerStage">
            <div class="fake-video" style="--player-poster:url('${poster}')">
              <div class="video-title">
                <span class="eyebrow">Reproduzindo agora</span>
                <h2>${player.item.title}</h2>
                <p class="video-meta">${player.info.subtitle}</p>
              </div>
              <div class="player-controls">
                <div class="progress" id="progress" aria-label="Progresso do video"><div class="progress-bar" id="progressBar" style="width:${player.info.percent}%"></div></div>
                <div class="control-row">
                  <button class="control-btn" id="playBtn" title="Play/Pause" aria-label="Pausar">&#10074;&#10074;</button>
                  <span class="time" id="time">${formatTime(player.info.current)} / ${formatTime(player.info.total)}</span>
                  <input class="volume" id="volume" type="range" min="0" max="100" value="74" aria-label="Volume">
                  <button class="ghost" data-route="${player.info.returnRoute}">Voltar</button>
                  <button class="control-btn" id="fullscreenBtn" title="Tela cheia" aria-label="Tela cheia">&#9974;</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
      initPlayer(player.info);
    }

    function initPlayer(playerInfo) {
      const stage = document.querySelector("#playerStage");
      const playBtn = document.querySelector("#playBtn");
      const fullscreenBtn = document.querySelector("#fullscreenBtn");
      const progress = document.querySelector("#progress");
      const progressBar = document.querySelector("#progressBar");
      const time = document.querySelector("#time");
      let playing = true;
      let currentSeconds = playerInfo.current;
      let hideTimer;

      function updateProgress() {
        const percent = Math.max(0, Math.min(100, (currentSeconds / playerInfo.total) * 100));
        progressBar.style.width = `${percent}%`;
        time.textContent = `${formatTime(currentSeconds)} / ${formatTime(playerInfo.total)}`;
      }

      function showControls() {
        stage.classList.remove("hide-controls");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => stage.classList.add("hide-controls"), 1800);
      }

      stage.addEventListener("pointermove", showControls);
      stage.addEventListener("pointerdown", showControls);
      playBtn.addEventListener("click", () => {
        playing = !playing;
        playBtn.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
        playBtn.setAttribute("aria-label", playing ? "Pausar" : "Reproduzir");
      });
      fullscreenBtn.addEventListener("click", () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          return;
        }
        stage.requestFullscreen?.();
      });
      document.addEventListener("fullscreenchange", () => {
        const fullscreen = document.fullscreenElement === stage;
        fullscreenBtn.setAttribute("aria-label", fullscreen ? "Sair da tela cheia" : "Tela cheia");
        fullscreenBtn.title = fullscreen ? "Sair da tela cheia" : "Tela cheia";
      });
      progress.addEventListener("click", (event) => {
        const rect = progress.getBoundingClientRect();
        const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
        currentSeconds = Math.round((percent / 100) * playerInfo.total);
        updateProgress();
      });
      setInterval(() => {
        if (!playing) return;
        currentSeconds = Math.min(playerInfo.total, currentSeconds + 1);
        updateProgress();
      }, 600);
      updateProgress();
      showControls();
    }

    function renderReader() {
      window.onpointermove = null;
      app.innerHTML = `
        <section class="screen page reader-screen">
          <button class="dimension-back" type="button" data-route="/hub">&larr; Voltar ao Hub</button>
          <div class="reader-shell">
          <div class="reader-toolbar glass">
            <div>
              <span class="eyebrow">Sakura Engine</span>
              <h2>Capitulo 42</h2>
            </div>
            <div class="reader-actions">
              <button class="control-btn" id="prevPage" title="Pagina anterior" aria-label="Pagina anterior">&lsaquo;</button>
              <span class="reader-counter" id="readerCounter">1 / 5</span>
              <button class="control-btn" id="nextPage" title="Proxima pagina" aria-label="Proxima pagina">&rsaquo;</button>
            </div>
          </div>
          <article class="manga-page glass">
            <div class="manga-panel" id="mangaPanel"></div>
          </article>
          </div>
        </section>
      `;
      initReader();
    }

    function renderLibrary() {
      window.onpointermove = null;
      const config = {
        className: "library-dimension",
        title: "Biblioteca",
        subtitle: "Seus favoritos, progresso e leituras recentes reunidos em um unico universo.",
        accent: "#4de8ff",
        accentTwo: "#8c6cff",
        deep: "#020713",
        haze: "#071329",
        glow: "rgba(77, 232, 255, .3)"
      };
      const items = [
        ...data.movies.slice(0, 2).map((item) => ({ ...item, cat: "Filme", mediaType: "movies", route: "/player" })),
        ...data.series.slice(0, 2).map((item) => ({ ...item, cat: "Serie", mediaType: "series", route: "/player" })),
        ...data.manga.slice(0, 2).map((item) => ({ ...item, cat: "Manga", route: "/leitor" }))
      ];
      app.innerHTML = `
        <section class="screen page dimension-screen library-screen ${config.className}" style="${dimensionVars(config)}">
          <button class="dimension-back" type="button" data-route="/hub">&larr; Voltar ao Hub</button>
          <header class="dimension-header">
            <h1>${config.title}</h1>
            <p>${config.subtitle}</p>
          </header>
          <section class="dimension-grid library-grid" aria-label="Itens da biblioteca">
            ${items.map((item, index) => libraryCard(item, index)).join("")}
          </section>
        </section>
      `;
    }

    function libraryCard(item, index) {
      const details = libraryDetails(item, index);
      const playerReturn = item.cat === "Filme" ? "/filmes" : item.cat === "Serie" ? "/series" : "";
      const playerAttrs = item.route === "/player"
        ? ` ${playerNavigationAttrs(item.mediaType, item)}`
        : playerReturn ? ` data-player-return="${playerReturn}"` : "";
      return `
        <button class="dimension-card library-card" type="button" data-route="${item.route}"${playerAttrs}>
          <div class="dimension-card-bg" style="background-image:url('${item.img}')"></div>
          <div class="dimension-card-top">
            <span class="year-pill">${details.kind}</span>
          </div>
          <div class="dimension-card-body">
            <h3>${item.title}</h3>
            <p>${details.progress}</p>
            <small>${details.part}</small>
          </div>
        </button>
      `;
    }

    function libraryDetails(item, index) {
      const progressByType = {
        Filme: [
          { progress: "Continuar em 42:18 de 2h12m", part: "Parte: Cruzando o sol morto" },
          { progress: "Continuar em 1:08:04 de 1h48m", part: "Parte: Eclipse vermelho" }
        ],
        Serie: [
          { progress: "Continuar no episodio 4", part: "Temporada 2: Sinal aberto - 18:32" },
          { progress: "Continuar no episodio 7", part: "Temporada 1: Corrida fantasma - 31:10" }
        ],
        Manga: [
          { progress: "Continuar no capitulo 42", part: "Pagina 3 de 5: O motor acordou" },
          { progress: "Continuar no capitulo 19", part: "Pagina 2 de 5: Carta lunar" }
        ]
      };
      const [fallback] = progressByType[item.cat] || [{ progress: item.meta, part: "Continuar de onde parou" }];
      const details = progressByType[item.cat]?.[index % 2] || fallback;
      return {
        kind: item.cat,
        progress: details.progress,
        part: details.part
      };
    }

    function initReader() {
      const pages = [
        ["BOOM", "A energia acordou!", "Corre!"],
        ["CLANG", "O motor espiritual...", "Ele escolheu voce."],
        ["SHH", "Petalas no vazio.", "Nao olhe para tras."],
        ["ZAP", "Constelacao ligada.", "Agora."],
        ["FIM", "Continua", "Proximo capitulo"]
      ];
      const panel = document.querySelector("#mangaPanel");
      const counter = document.querySelector("#readerCounter");
      let page = 0;

      function draw() {
        panel.style.animation = "none";
        panel.offsetHeight;
        panel.style.animation = "";
        panel.innerHTML = pages[page].map((text, index) => `
          <div class="panel-cell" data-text="${text}" style="--px:${25 + index * 24}%;--py:${22 + index * 18}%"></div>
        `).join("");
        counter.textContent = `${page + 1} / ${pages.length}`;
      }

      document.querySelector("#prevPage").addEventListener("click", () => {
        page = (page - 1 + pages.length) % pages.length;
        draw();
      });
      document.querySelector("#nextPage").addEventListener("click", () => {
        page = (page + 1) % pages.length;
        draw();
      });
      draw();
    }

    document.addEventListener("click", (event) => {
      const fav = event.target.closest("[data-fav]");
      if (!fav) return;
      const active = fav.classList.toggle("active");
      fav.innerHTML = active ? "&#9733;" : "&#9734;";
      fav.setAttribute("aria-pressed", active ? "true" : "false");
    });

    render();
