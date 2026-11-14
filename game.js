"use strict";
const CHAVE_SALVAMENTO = "eco-souls";
const FASES = [
  { nome: "Rio", medalha: "Guardiã do Rio", trofeu: "Troféu do Rio", icone: "rio" },
  { nome: "Praia", medalha: "Guardiã da Praia", trofeu: "Troféu da Praia", icone: "praia" },
  { nome: "Cidade", medalha: "Guardiã da Cidade", trofeu: "Troféu da Cidade", icone: "cidade" },
  { nome: "Floresta", medalha: "Guardiã da Floresta", trofeu: "Troféu da Floresta", icone: "floresta" },
];
const TROFEUS = [
  null,
  { nome: "bronze", cor: "#cd7f32", borda: "#8a4f1c" },
  { nome: "prata", cor: "#c0c7d1", borda: "#7b8594" },
  { nome: "ouro", cor: "#f5c542", borda: "#b7871a" },
];
const AVATARES = [
  { grupo: "menino", fundo: "#bfe6f7", pele: "#c68642", camisa: "#2e9e5b", cabelo: "#1b1b1b", estilo: "curto", enfeite: "coroa" },
  { grupo: "menino", fundo: "#ffe9a8", pele: "#8d5524", camisa: "#f5a623", cabelo: "#141414", estilo: "afro", extra: "oculos", enfeite: "mago" },
  { grupo: "menino", fundo: "#d6f0d0", pele: "#ffdbac", camisa: "#e24b4a", cabelo: "#8b5a2b", estilo: "bone", bone: "#2e6cb8", aba: "#1f4f8a", extra: "sardas", enfeite: "reciclagem" },
  { grupo: "menina", fundo: "#e8d9f7", pele: "#a0643a", camisa: "#8e44ad", cabelo: "#1a1209", estilo: "puffs", enfeite: "flores" },
  { grupo: "menina", fundo: "#ffd9e6", pele: "#f6d5b8", camisa: "#ec6f9a", cabelo: "#111111", estilo: "liso", enfeite: "tiara" },
  { grupo: "menina", fundo: "#cfeee9", pele: "#e8b98c", camisa: "#f08a24", cabelo: "#b5451b", estilo: "trancas", enfeite: "asas" },
];
const ENFEITES = [
  { id: "coroa", nome: "Coroa de folhas" },
  { id: "mago", nome: "Chapéu de mago" },
  { id: "reciclagem", nome: "Reciclagem" },
  { id: "flores", nome: "Coroa de flores" },
  { id: "tiara", nome: "Gota d'água" },
  { id: "asas", nome: "Asas de fada" },
  { id: "nenhum", nome: "Sem acessório" },
];
const elProgresso = document.getElementById("progresso");
const elAviso = document.getElementById("aviso");
const elConteudo = document.querySelector(".conteudo");
const elSaudacao = document.getElementById("saudacao");
const elSaudacaoAvatar = document.getElementById("saudacao-avatar");
const elSaudacaoNome = document.getElementById("saudacao-nome");
const elComoJogar = document.getElementById("tela-como-jogar");
const elBotaoVoltarAjuda = document.getElementById("botao-voltar-ajuda");
const elPerfil = document.getElementById("tela-perfil");
const elPerfilConteudo = document.getElementById("perfil-conteudo");
const elBotaoVoltarPerfil = document.getElementById("botao-voltar-perfil");
const elFases = document.getElementById("tela-fases");
const elFasesConteudo = document.getElementById("fases-conteudo");
const elBotaoVoltarFases = document.getElementById("botao-voltar-fases");
const elAvatarTela = document.getElementById("tela-avatar");
const elAvatarConteudo = document.getElementById("avatar-conteudo");
const elBotaoVoltarAvatar = document.getElementById("botao-voltar-avatar");
const elCreditos = document.getElementById("tela-creditos");
const elBotaoVoltarCreditos = document.getElementById("botao-voltar-creditos");
const elTelaNome = document.getElementById("tela-nome");
const elFormNome = document.getElementById("form-nome");
const elCampoNome = document.getElementById("campo-nome");
const elBotaoCancelarNome = document.getElementById("botao-cancelar-nome");
function limitarEstrelas(valor) {
  return Math.min(3, Math.max(0, Math.floor(Number(valor)) || 0));
}
function limitarPontos(valor) {
  return Math.max(0, Math.floor(Number(valor)) || 0);
}
function somar(lista) {
  return lista.reduce((total, valor) => total + valor, 0);
}
function carregarProgresso() {
  const padrao = {
    nome: "",
    avatar: 0,
    enfeite: AVATARES[0].enfeite,
    pontos: 0,
    pontosPorFase: FASES.map(() => 0),
    estrelas: FASES.map(() => 0),
  };
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_SALVAMENTO));
    if (!salvo) return padrao;
    const pontosPorFase = FASES.map((_, i) => limitarPontos(salvo.pontosPorFase?.[i]));
    const avatar = Number.isInteger(salvo.avatar) && AVATARES[salvo.avatar] ? salvo.avatar : 0;
    return {
      nome: String(salvo.nome || "").trim().slice(0, 20),
      avatar,
      enfeite: ENFEITES.some((e) => e.id === salvo.enfeite) ? salvo.enfeite : AVATARES[avatar].enfeite,
      pontos: somar(pontosPorFase),
      pontosPorFase,
      estrelas: FASES.map((_, i) => limitarEstrelas(salvo.estrelas?.[i])),
    };
  } catch (erro) {
    return padrao;
  }
}
const progresso = carregarProgresso();
function salvarProgresso() {
  try {
    localStorage.setItem(CHAVE_SALVAMENTO, JSON.stringify(progresso));
  } catch (erro) {
  }
}
function concluirMissao(indice, pontosDaPartida, estrelas) {
  progresso.pontosPorFase[indice] = Math.max(progresso.pontosPorFase[indice], limitarPontos(pontosDaPartida));
  progresso.estrelas[indice] = Math.max(progresso.estrelas[indice], limitarEstrelas(estrelas));
  progresso.pontos = somar(progresso.pontosPorFase);
  salvarProgresso();
  atualizarTela();
}
function jogouPrimeiraFase() {
  return progresso.estrelas[0] > 0;
}
function faseLiberada(indice) {
  return indice === 0 || progresso.estrelas[indice - 1] >= 2;
}
function escaparHtml(texto) {
  const trocas = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return texto.replace(/[&<>"']/g, (letra) => trocas[letra]);
}
function cabeloDeTras(a) {
  switch (a.estilo) {
    case "afro":
      return `<circle cx="50" cy="32" r="31" fill="${a.cabelo}" />`;
    case "puffs":
      return `<circle cx="27" cy="24" r="13" fill="${a.cabelo}" /><circle cx="73" cy="24" r="13" fill="${a.cabelo}" />`;
    case "liso":
      return `<path d="M26 40Q24 18 50 15Q76 18 74 40L79 82Q50 90 21 82Z" fill="${a.cabelo}" />`;
    case "trancas":
      return `<path d="M29 46Q20 66 27 86M71 46Q80 66 73 86" stroke="${a.cabelo}" stroke-width="9" fill="none" stroke-linecap="round" />`;
    default:
      return "";
  }
}
function cabeloDaFrente(a) {
  const topo = `<path d="M28 42Q27 17 50 17Q73 17 72 42Q64 30 50 30Q36 30 28 42Z" fill="${a.cabelo}" />`;
  switch (a.estilo) {
    case "afro":
      return `<path d="M30 40Q34 27 50 27Q66 27 70 40Q62 34 50 34Q38 34 30 40Z" fill="${a.cabelo}" />`;
    case "liso":
      return `<path d="M29 40Q34 22 50 22Q66 22 71 40Q60 31 50 33Q40 31 29 40Z" fill="${a.cabelo}" />`;
    case "trancas":
      return `${topo}<path d="M29 33Q50 20 71 33" stroke="#f5c542" stroke-width="4" fill="none" />`;
    case "bone":
      return `<path d="M27 38Q28 15 50 15Q72 15 73 38Z" fill="${a.bone}" /><path d="M27 37Q55 42 84 36Q82 44 50 45Q32 45 27 40Z" fill="${a.aba}" />`;
    default:
      return topo;
  }
}
function acessorio(a) {
  if (a.extra === "oculos") return `<g fill="none" stroke="#222" stroke-width="2"><circle cx="42" cy="45" r="7" /><circle cx="58" cy="45" r="7" /><path d="M49 45h2" /></g>`;
  if (a.extra === "sardas") return `<g fill="#b9784a" opacity=".6"><circle cx="40" cy="52" r="1" /><circle cx="44" cy="50" r="1" /><circle cx="56" cy="50" r="1" /><circle cx="60" cy="52" r="1" /></g>`;
  return "";
}
const folha = (x, y, giro, cor = "#4caf50") => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" transform="rotate(${giro} ${x} ${y})" fill="${cor}" />`;
const flor = (x, y, cor) =>
  `<g fill="${cor}"><circle cx="${x}" cy="${y - 3.2}" r="2.6" /><circle cx="${x + 3.2}" cy="${y}" r="2.6" /><circle cx="${x}" cy="${y + 3.2}" r="2.6" /><circle cx="${x - 3.2}" cy="${y}" r="2.6" /></g><circle cx="${x}" cy="${y}" r="1.9" fill="#ffd54a" />`;
function enfeiteDeTras(a) {
  if (a.enfeite !== "asas") return "";
  return `<g fill="#9be37a" stroke="#3f9b52" stroke-width="1.5" opacity=".9">
    <path d="M32 72Q0 54 6 20Q36 30 40 68Z" /><path d="M68 72Q100 54 94 20Q64 30 60 68Z" />
  </g><path d="M30 66Q16 50 12 30M70 66Q84 50 88 30" stroke="#3f9b52" stroke-width="1.2" fill="none" />`;
}
function enfeiteDaFrente(a) {
  switch (a.enfeite) {
    case "coroa":
      return `<path d="M31 28L33 14L41 22L50 11L59 22L67 14L69 28Z" fill="#4caf50" stroke="#2e7d32" stroke-width="1.5" stroke-linejoin="round" />
        <rect x="31" y="25" width="38" height="5" rx="2.5" fill="#7a4a22" />
        <circle cx="33" cy="14" r="3" fill="#ff7aa8" /><circle cx="50" cy="11" r="3.4" fill="#ffd54a" /><circle cx="67" cy="14" r="3" fill="#ff7aa8" />`;
    case "mago":
      return `<path d="M30 32L46 5Q52 -3 58 7L70 32Z" fill="#2e8b57" />
        <path d="M32 27Q50 32 68 27L70 32Q50 38 30 32Z" fill="#f5c542" />
        <ellipse cx="50" cy="33" rx="27" ry="6" fill="#1f6b43" />
        <path d="M51 17l2 4.2 4.6.6-3.4 3.2.9 4.5-4.1-2.3-4.1 2.3.9-4.5-3.4-3.2 4.6-.6Z" fill="#ffe27a" />${folha(62, 14, -40, "#9be37a")}`;
    case "reciclagem":
      return `<circle cx="50" cy="27" r="7" fill="#3b9a45" stroke="#fff" stroke-width="1.5" />
        <path d="M50 22.5a4.5 4.5 0 0 1 3.9 2.2M54.3 28.5a4.5 4.5 0 0 1-3.5 2.9M46 29.8a4.5 4.5 0 0 1-.4-4.6" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" />
        <path d="M50 15V8" stroke="#3f9b52" stroke-width="2.5" stroke-linecap="round" />${folha(44, 7, -25, "#5cc06a")}${folha(57, 6, 25, "#5cc06a")}`;
    case "flores":
      return `<path d="M30 30Q50 14 70 30" stroke="#3f9b52" stroke-width="3" fill="none" stroke-linecap="round" />
        ${folha(41, 21, -25)}${folha(59, 21, 25)}${flor(34, 26, "#ff7aa8")}${flor(50, 18, "#ffffff")}${flor(66, 26, "#ff9f43")}`;
    case "tiara":
      return `<path d="M30 33Q50 17 70 33" stroke="#f5c542" stroke-width="3.2" fill="none" stroke-linecap="round" />
        <path d="M50 6C54 12 57 15 57 19A7 7 0 0 1 43 19C43 15 46 12 50 6Z" fill="#4aa8e0" stroke="#ffffff" stroke-width="1.6" />
        <path d="M47 17q1-3 3-4" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" />${folha(37, 25, -30)}${folha(63, 25, 30)}`;
    case "asas":
      return `${folha(63, 24, -35, "#3f9b52")}${folha(70, 27, 10, "#5cc06a")}`;
    default:
      return "";
  }
}
function avatarSvg(indice, tamanho, enfeite = progresso.enfeite) {
  const a = { ...AVATARES[indice], enfeite };
  const nomeEnfeite = ENFEITES.find((e) => e.id === enfeite)?.nome.toLowerCase() ?? "sem acessório";
  const legenda = `Avatar de ${a.grupo}, ${nomeEnfeite}`;
  return `
    <svg width="${tamanho}" height="${tamanho}" viewBox="0 0 100 100" role="img" aria-label="${legenda}">
      <defs><clipPath id="recorte-avatar"><circle cx="50" cy="50" r="50" /></clipPath></defs>
      <circle cx="50" cy="50" r="50" fill="${a.fundo}" />
      <g clip-path="url(#recorte-avatar)">
        ${enfeiteDeTras(a)}
        ${cabeloDeTras(a)}
        <path d="M8 100Q12 70 50 68Q88 70 92 100Z" fill="${a.camisa}" />
        <rect x="43" y="56" width="14" height="16" rx="6" fill="${a.pele}" />
        <circle cx="29" cy="46" r="4.5" fill="${a.pele}" /><circle cx="71" cy="46" r="4.5" fill="${a.pele}" />
        <ellipse cx="50" cy="44" rx="21" ry="24" fill="${a.pele}" />
        <circle cx="42" cy="45" r="2.6" fill="#2b1b12" /><circle cx="58" cy="45" r="2.6" fill="#2b1b12" />
        <path d="M43 54Q50 61 57 54" stroke="#7a2f2f" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <circle cx="36" cy="52" r="3.5" fill="#ff8a8a" opacity=".35" /><circle cx="64" cy="52" r="3.5" fill="#ff8a8a" opacity=".35" />
        ${acessorio(a)}
        ${cabeloDaFrente(a)}
        ${enfeiteDaFrente(a)}
      </g>
    </svg>`;
}
const em = (corpo) => `<g stroke="#3b2a1a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${corpo}</g>`;
const EMBLEMAS = {
  rio: em(`<path d="M6 18C28 6 24 30 36 34S54 44 58 54" fill="none" stroke-width="18"/><path d="M6 18C28 6 24 30 36 34S54 44 58 54" fill="none" stroke="#4aa8e0" stroke-width="12"/><path d="M14 15c5-3 8-2 10 2M38 36c4 1 7 4 9 8" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M6 44l3-9 3 9zM44 16l3-9 3 9z" fill="#7bc65a"/><path d="M20 58c-4-6-5-8-5-10a5 5 0 0 1 10 0c0 2-1 4-5 10z" fill="#7cc9f0"/>`),
  praia: em(`<rect x="14" y="34" width="36" height="18" fill="#f3c97a"/><rect x="9" y="22" width="14" height="30" fill="#f3c97a"/><rect x="41" y="22" width="14" height="30" fill="#f3c97a"/><path d="M9 22V16h4v3h3v-3h4v6zM41 22V16h4v3h3v-3h4v6z" fill="#f3c97a"/><path d="M26 52V43a6 6 0 0 1 12 0v9z" fill="#7a4a22"/><path d="M32 34V9" fill="none"/><path d="M32 9l14 5-14 5z" fill="#e24b4a"/><path d="M3 53c8-5 14 3 20-1s12 4 18 0 12 3 20-1v11H3z" fill="#4aa8e0"/>`),
  cidade: em(`<rect x="7" y="26" width="23" height="32" fill="#8ba6c4"/><rect x="34" y="14" width="23" height="44" fill="#d98c5f"/><path d="M12 32h5v5h-5zM20 32h5v5h-5zM12 42h5v5h-5zM20 42h5v5h-5zM39 20h5v5h-5zM47 20h5v5h-5zM39 30h5v5h-5zM47 30h5v5h-5zM39 40h5v5h-5z" fill="#ffe27a" stroke-width="1.8"/><path d="M45 58v-9h7v9z" fill="#7a4a22"/><path d="M45 14c0-3 0-5 0-8" fill="none"/><path d="M45 9c-6 1-9-3-9-6 6-1 9 2 9 6zM45 9c6 1 9-3 9-6-6-1-9 2-9 6z" fill="#7bc65a"/><path d="M2 58h60" fill="none" stroke-width="3"/>`),
  floresta: em(`<path d="M28 60V38h8v22z" fill="#8b5a2b"/><circle cx="19" cy="34" r="11" fill="#4fae62"/><circle cx="45" cy="34" r="11" fill="#4fae62"/><circle cx="32" cy="24" r="16" fill="#3f9b52"/><path d="M23 20c3-5 8-6 12-4" fill="none" stroke="#9be08f" stroke-width="3"/><path d="M45 60v-5h6v5z" fill="#fff3d6"/><path d="M42 55a6.5 6 0 0 1 12 0z" fill="#e24b4a"/><circle cx="46" cy="52" r="1.2" fill="#fff" stroke="none"/><path d="M5 60h54" fill="none" stroke-width="3"/>`),
};
const CADEADO = `<svg class="cadeado" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Bloqueada"><path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="#3b2a1a" stroke-width="3" stroke-linecap="round"/><rect x="4" y="11" width="16" height="11" rx="3" fill="#f5c542" stroke="#3b2a1a" stroke-width="2.5"/><circle cx="12" cy="16" r="1.8" fill="#3b2a1a"/><path d="M12 17v2.5" stroke="#3b2a1a" stroke-width="2" stroke-linecap="round"/></svg>`;
function medalhaSvg(icone, conquistada, tamanho) {
  return `
    <svg width="${tamanho}" height="${tamanho}" viewBox="0 0 100 100"
         style="opacity: ${conquistada ? 1 : 0.3}" aria-hidden="true">
      <path d="M30 0l15 42h10l15-42z" fill="#c0392b" />
      <circle cx="50" cy="64" r="34" fill="#f5c542" stroke="#b7871a" stroke-width="4" />
      <g transform="translate(29 43) scale(0.66)">${EMBLEMAS[icone]}</g>
    </svg>`;
}
function trofeuSvg(fase, estrelas, tamanho) {
  const tipo = TROFEUS[estrelas] || { cor: "#bdbdbd", borda: "#888888" };
  return `
    <svg width="${tamanho}" height="${tamanho}" viewBox="0 0 100 100"
         style="opacity: ${estrelas > 0 ? 1 : 0.35}" aria-hidden="true">
      <path d="M30 22H18q0 20 15 23M70 22h12q0 20-15 23" fill="none" stroke="${tipo.cor}" stroke-width="6" stroke-linecap="round" />
      <path d="M30 14h40v26a20 20 0 0 1-40 0Z" fill="${tipo.cor}" stroke="${tipo.borda}" stroke-width="4" />
      <rect x="45" y="60" width="10" height="14" fill="${tipo.cor}" stroke="${tipo.borda}" stroke-width="3" />
      <rect x="30" y="74" width="40" height="12" rx="3" fill="${tipo.cor}" stroke="${tipo.borda}" stroke-width="4" />
      <g transform="translate(34.5 17) scale(0.47)">${EMBLEMAS[fase.icone]}</g>
    </svg>`;
}
function estrelasHtml(quantidade) {
  return `<span class="estrelas" aria-label="${quantidade} de 3 estrelas">${"★".repeat(quantidade)}<span class="vazia">${"★".repeat(3 - quantidade)}</span></span>`;
}
function montarLinhaDaFase(fase, indice) {
  const liberada = faseLiberada(indice);
  const estrelas = progresso.estrelas[indice];
  const lado = liberada ? estrelasHtml(estrelas) : `${CADEADO}`;
  return `
    <li class="fase-linha ${liberada ? "" : "bloqueada"}">
      ${medalhaSvg(fase.icone, estrelas >= 2, 56)}
      <div class="fase-info">
        <div class="fase-nome">Fase ${indice + 1} - ${fase.nome}</div>
        <div class="fase-medalha">${liberada ? fase.medalha : "Bloqueada"}</div>
      </div>
      ${lado}
    </li>`;
}
function desenharProgresso() {
  const mostrar = jogouPrimeiraFase();
  elProgresso.hidden = !mostrar;
  elConteudo.classList.toggle("sem-progresso", !mostrar);
  if (!mostrar) return;
  elProgresso.innerHTML = `
    <h2>Progresso de ${escaparHtml(progresso.nome)}</h2>
    <p class="pontos">Pontos: ${progresso.pontos}</p>
    <ul class="fases">${FASES.map(montarLinhaDaFase).join("")}</ul>`;
}
function montarGrupoDeAvatares(rotulo, grupo) {
  const opcoes = AVATARES.map((avatar, i) => ({ avatar, i }))
    .filter(({ avatar }) => avatar.grupo === grupo)
    .map(
      ({ avatar, i }) => `
        <button class="avatar-opcao" data-avatar="${i}" aria-pressed="${i === progresso.avatar}"
                title="Avatar ${i + 1}">
          ${avatarSvg(i, 88)}
        </button>`
    )
    .join("");
  return `<div class="avatares-grupo"><span class="avatares-rotulo">${rotulo}</span>${opcoes}</div>`;
}
function montarLinhaDeMissao(fase, indice) {
  const liberada = faseLiberada(indice);
  const estrelas = progresso.estrelas[indice];
  let lado = "Ainda não jogada";
  if (!liberada) lado = `${CADEADO} Bloqueada`;
  else if (estrelas > 0) lado = `${progresso.pontosPorFase[indice]} pontos ${estrelasHtml(estrelas)}`;
  return `
    <li class="fase-linha ${liberada ? "" : "bloqueada"}">
      <div class="fase-info"><div class="fase-nome">Fase ${indice + 1} - ${fase.nome}</div></div>
      <div class="missao-pontos">${lado}</div>
    </li>`;
}
function montarTrofeu(fase, indice) {
  const estrelas = progresso.estrelas[indice];
  const tipo = TROFEUS[estrelas];
  return `
    <li class="trofeu ${estrelas ? "" : "bloqueado"}">
      ${trofeuSvg(fase, estrelas, 84)}
      <div class="trofeu-nome">${fase.trofeu}</div>
      <div class="trofeu-tipo">${tipo ? `Troféu de ${tipo.nome}` : "Conclua a missão"}</div>
    </li>`;
}
function desenharPerfil() {
  const conquistados = progresso.estrelas.filter((estrelas) => estrelas > 0).length;
  elPerfilConteudo.innerHTML = `
    <div class="perfil-layout">
      <div class="perfil-coluna">
        <div class="perfil-topo">
          ${avatarSvg(progresso.avatar, 120)}
          <div>
            <p class="perfil-nome">${escaparHtml(progresso.nome)}</p>
            <p class="perfil-pontos">Pontos totais: <strong>${progresso.pontos}</strong></p>
            <div class="perfil-botoes">
              <button class="botao" data-acao="editar-avatar">Editar avatar</button>
              <button class="botao" data-acao="trocar-nome">Trocar nome</button>
            </div>
          </div>
        </div>
        <div class="perfil-secao">
          <h3>Pontos por missão</h3>
          <ul class="fases">${FASES.map(montarLinhaDeMissao).join("")}</ul>
        </div>
      </div>
      <div class="perfil-secao">
        <h3>Troféus: ${conquistados} de ${FASES.length}</h3>
        <ul class="trofeus">${FASES.map(montarTrofeu).join("")}</ul>
      </div>
    </div>`;
}
function montarEnfeites() {
  return ENFEITES.map(
    (e) => `
      <button class="avatar-opcao" data-enfeite="${e.id}" aria-pressed="${e.id === progresso.enfeite}">
        ${avatarSvg(progresso.avatar, 72, e.id)}
        <span>${e.nome}</span>
      </button>`
  ).join("");
}
function desenharEscolhaAvatar() {
  elAvatarConteudo.innerHTML = `
    <div class="perfil-secao">
      <h3>Personagem</h3>
      ${montarGrupoDeAvatares("Meninos", "menino")}
      ${montarGrupoDeAvatares("Meninas", "menina")}
    </div>
    <div class="perfil-secao">
      <h3>Acessório</h3>
      <div class="avatares-grupo">${montarEnfeites()}</div>
    </div>`;
}
elAvatarConteudo.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-avatar], [data-enfeite]");
  if (!botao) return;
  const escolheuPersonagem = botao.dataset.avatar !== undefined;
  if (escolheuPersonagem) progresso.avatar = Number(botao.dataset.avatar);
  else progresso.enfeite = botao.dataset.enfeite;
  salvarProgresso();
  atualizarTela();
  const alvo = escolheuPersonagem ? `[data-avatar="${progresso.avatar}"]` : `[data-enfeite="${progresso.enfeite}"]`;
  elAvatarConteudo.querySelector(alvo)?.focus();
});
function montarCartaoDeFase(fase, indice) {
  const liberada = faseLiberada(indice);
  const estrelas = progresso.estrelas[indice];
  let detalhe = "<span>Ainda não jogada</span>";
  if (!liberada) detalhe = `${CADEADO}<span>Bloqueada</span>`;
  else if (estrelas > 0) detalhe = `${estrelasHtml(estrelas)}<span>${progresso.pontosPorFase[indice]} pontos</span>`;
  return `
    <button class="fase-cartao ${liberada ? "" : "bloqueada"}" data-fase="${indice}" aria-disabled="${!liberada}">
      ${medalhaSvg(fase.icone, estrelas >= 2, 72)}
      <span class="fase-cartao-nome">Fase ${indice + 1} - ${fase.nome}</span>
      ${detalhe}
    </button>`;
}
function desenharFases() {
  elFasesConteudo.innerHTML = FASES.map(montarCartaoDeFase).join("");
}
elFasesConteudo.addEventListener("click", (evento) => {
  const cartao = evento.target.closest("[data-fase]");
  if (!cartao) return;
  const indice = Number(cartao.dataset.fase);
  if (!faseLiberada(indice)) {
    avisar(`Conquiste a medalha da fase ${FASES[indice - 1].nome} para liberar esta.`);
    return;
  }
  iniciarMissao(indice);
});
function desenharSaudacao() {
  elSaudacao.hidden = !progresso.nome;
  elSaudacaoAvatar.innerHTML = avatarSvg(progresso.avatar, 36);
  elSaudacaoNome.textContent = `Olá, ${progresso.nome}!`;
}
function atualizarTela() {
  desenharSaudacao();
  desenharProgresso();
  desenharPerfil();
  desenharEscolhaAvatar();
  desenharFases();
}
let nomeObrigatorio = false;
function abrirTelaNome(obrigatorio) {
  nomeObrigatorio = obrigatorio;
  elBotaoCancelarNome.hidden = obrigatorio;
  elCampoNome.value = progresso.nome;
  elTelaNome.hidden = false;
  elCampoNome.focus();
}
function fecharTelaNome() {
  elTelaNome.hidden = true;
}
elFormNome.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nome = elCampoNome.value.trim().replace(/\s+/g, " ");
  if (!nome) return;
  progresso.nome = nome;
  salvarProgresso();
  fecharTelaNome();
  atualizarTela();
  avisar(`Prazer, ${nome}!`);
});
elBotaoCancelarNome.addEventListener("click", fecharTelaNome);
function desenharOndas() {
  const alturas = [740, 795, 850];
  let caminho = "";
  alturas.forEach((y, fileira) => {
    for (let x = -120; x < 1720; x += 120) {
      const deslocamento = (fileira % 2) * 60;
      caminho += `M${x + deslocamento} ${y}q30-16 60 0t60 0`;
    }
  });
  document.getElementById("ondas").setAttribute("d", caminho);
}
let temporizadorAviso;
function avisar(texto) {
  elAviso.textContent = texto;
  elAviso.classList.add("visivel");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => elAviso.classList.remove("visivel"), 2600);
}
const JANELAS = [elComoJogar, elPerfil, elAvatarTela, elFases, elCreditos];
const focoAnterior = new Map();
function abrirJanela(janela, botaoInicial) {
  focoAnterior.set(janela, document.activeElement);
  janela.hidden = false;
  botaoInicial.focus();
}
function fecharJanela(janela) {
  if (janela.hidden) return;
  janela.hidden = true;
  const origem = focoAnterior.get(janela);
  if (origem?.isConnected) origem.focus();
  else if (janela === elAvatarTela) elPerfilConteudo.querySelector('[data-acao="editar-avatar"]')?.focus();
}
elBotaoVoltarAjuda.addEventListener("click", () => fecharJanela(elComoJogar));
elBotaoVoltarPerfil.addEventListener("click", () => fecharJanela(elPerfil));
elBotaoVoltarFases.addEventListener("click", () => fecharJanela(elFases));
elBotaoVoltarCreditos.addEventListener("click", () => fecharJanela(elCreditos));
elBotaoVoltarAvatar.addEventListener("click", () => fecharJanela(elAvatarTela));
JANELAS.forEach((janela) => janela.addEventListener("click", (evento) => {
    if (evento.target === janela) fecharJanela(janela);
  })
);
const TOTAL_ITENS = 10;
const PONTOS_ACERTO = 25;
const PONTOS_ERRO = 10;
const TIPOS = { papel: "Papel", plastico: "Plástico", vidro: "Vidro", organico: "Orgânico", coleta: "Ponto de coleta" };
const MAR = 0.22;
const ITENS_RIO = [
  { nome: "Jornal", tipo: "papel", svg: `<rect x="10" y="8" width="44" height="48" rx="3" fill="#f4f1e6" stroke="#8a8676" stroke-width="2.5"/><rect x="16" y="14" width="14" height="10" fill="#9a9a9a"/><path d="M34 16h14M34 22h14M16 30h32M16 36h32M16 42h32M16 48h22" stroke="#9a9a9a" stroke-width="2"/>` },
  { nome: "Caixa de papelão", tipo: "papel", svg: `<path d="M8 22L32 12L56 22V46L32 56L8 46Z" fill="#c9954f" stroke="#8a5f24" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 22L32 32L56 22M32 32V56" stroke="#8a5f24" stroke-width="2.5" fill="none"/><path d="M20 17L44 27" stroke="#e8d3a8" stroke-width="4"/>` },
  { nome: "Garrafa PET", tipo: "plastico", svg: `<rect x="26" y="4" width="12" height="8" rx="2" fill="#2e6cb8"/><path d="M27 12h10l1 8q10 6 10 16v20q0 4-4 4H20q-4 0-4-4V36q0-10 10-16Z" fill="#bfe9f7" fill-opacity=".85" stroke="#3a8fb7" stroke-width="2.5" stroke-linejoin="round"/><rect x="17" y="34" width="30" height="12" fill="#e24b4a" opacity=".85"/>` },
  { nome: "Sacola plástica", tipo: "plastico", svg: `<path d="M18 22h28l5 34H13Z" fill="#f3f6f8" stroke="#9aa5ad" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 22q0-14 8-14t8 14" fill="none" stroke="#9aa5ad" stroke-width="3"/>` },
  { nome: "Garrafa de vidro", tipo: "vidro", svg: `<rect x="27" y="4" width="10" height="16" rx="2" fill="#3b9a45" stroke="#1f6b2b" stroke-width="2.5"/><path d="M27 18Q14 26 14 40v16q0 4 4 4h28q4 0 4-4V40q0-14-13-22Z" fill="#59b865" fill-opacity=".9" stroke="#1f6b2b" stroke-width="2.5"/><path d="M22 38v14" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>` },
  { nome: "Pote de vidro", tipo: "vidro", svg: `<rect x="14" y="8" width="36" height="8" rx="2" fill="#aaa" stroke="#777" stroke-width="2.5"/><path d="M16 16h32q4 4 4 12v22q0 6-6 6H18q-6 0-6-6V28q0-8 4-12Z" fill="#dff3f5" fill-opacity=".9" stroke="#4a8f99" stroke-width="2.5"/><path d="M20 26v18" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
  { nome: "Casca de banana", tipo: "organico", svg: `<path d="M30 4h6l-1 13h-4Z" fill="#8b6b1f"/><path d="M31 16Q10 22 8 44Q14 54 22 50Q22 34 33 26Z" fill="#f7d83a" stroke="#b08a10" stroke-width="2.5" stroke-linejoin="round"/><path d="M35 16Q54 22 56 44Q50 54 42 50Q42 34 31 26Z" fill="#f7d83a" stroke="#b08a10" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 18Q26 34 28 56Q32 60 36 56Q38 34 32 18Z" fill="#e9c524" stroke="#b08a10" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 21Q16 29 14 44M34 21Q48 29 50 44" stroke="#fff3b0" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="57" r="2.5" fill="#6b4a12"/><circle cx="13" cy="46" r="2" fill="#6b4a12"/><circle cx="51" cy="46" r="2" fill="#6b4a12"/><circle cx="31" cy="40" r="1.5" fill="#8b6b1f"/><circle cx="34" cy="31" r="1.5" fill="#8b6b1f"/>` },
  { nome: "Pilha", tipo: "coleta", svg: `<rect x="27" y="8" width="10" height="8" rx="2" fill="#aaa" stroke="#777" stroke-width="2"/><rect x="22" y="14" width="20" height="44" rx="4" fill="#e0a01a" stroke="#8a5f10" stroke-width="2.5"/><rect x="22" y="24" width="20" height="10" fill="#2b2b2b"/><path d="M32 41v8M28 45h8" stroke="#2b2b2b" stroke-width="2.5"/>` },
];
const elJogo = document.getElementById("tela-jogo");
const elPausa = document.getElementById("tela-pausa");
const elRio = document.getElementById("jogo-rio");
const elLixeiras = document.getElementById("jogo-lixeiras");
const elResultado = document.getElementById("tela-resultado");
const elResultadoConteudo = document.getElementById("resultado-conteudo");
let jogo = null;
let ultimaMissao = 0;
function sortearItens() {
  const misturar = (lista) => {
    for (let i = lista.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[k]] = [lista[k], lista[i]];
    }
    return lista;
  };
  const casca = ITENS_RIO.find((i) => i.tipo === "organico");
  const resto = misturar(ITENS_RIO.filter((i) => i !== casca)).slice(0, TOTAL_ITENS - 3);
  const extras = [0, 1].map(() => ITENS_RIO[Math.floor(Math.random() * ITENS_RIO.length)]);
  return misturar([casca, ...resto, ...extras]);
}
const CENARIOS = ["rio", "praia", "cidade", "floresta"];
const LEGENDAS = {
  rio: "Rio: o lixo desce com a correnteza",
  praia: "Praia: as ondas levam o lixo de volta ao mar",
  cidade: "Cidade: o vento empurra o lixo",
  floresta: "Floresta: o lixo cai das árvores",
};
const CENAS = {
  rio: "",
  praia: '<div class="mar"></div><div class="onda"></div>',
  cidade: '<div class="predios"></div><div class="vento"></div>',
  floresta: '<div class="copas"></div>',
};
function iniciarMissao(indice) {
  sairDoJogo();
  JANELAS.forEach(fecharJanela);
  ultimaMissao = indice;
  const cenario = CENARIOS[indice];
  jogo = { indice, cenario, fila: sortearItens(), itens: [], pontos: 0, acertos: 0, erros: 0, resolvidos: 0, selecionado: null, arrastando: null, pausado: false, espera: 0, ultimo: performance.now(), quadro: 0, onda: { t: 0, espera: 5, depth: 0, avisou: false }, vento: { t: 0, espera: 4, dir: 1, dur: 2, avisou: false } };
  elRio.className = cenario === "rio" ? "jogo-rio" : `jogo-rio jogo-${cenario}`;
  elRio.innerHTML = CENAS[cenario];
  elRio.setAttribute("aria-label", LEGENDAS[cenario]);
  jogo.elOnda = elRio.querySelector(".onda");
  jogo.elVento = elRio.querySelector(".vento");
  document.getElementById("jogo-titulo").textContent = `Fase ${indice + 1} - ${FASES[indice].nome}`;
  desenharHud();
  elJogo.hidden = false;
  jogo.quadro = requestAnimationFrame(passo);
}
function sairDoJogo() {
  if (jogo) cancelAnimationFrame(jogo.quadro);
  jogo?.itens.forEach((item) => item.el.remove());
  jogo = null;
  elJogo.hidden = true;
  elResultado.hidden = true;
  elPausa.hidden = true;
}
function abrirFases() {
  sairDoJogo();
  JANELAS.forEach(fecharJanela);
  abrirJanela(elFases, elBotaoVoltarFases);
}
function alternarPausa() {
  if (!jogo || jogo.fim || !elResultado.hidden) return;
  if (jogo.pausado) {
    jogo.pausado = false;
    elPausa.hidden = true;
    jogo.ultimo = performance.now();
    jogo.quadro = requestAnimationFrame(passo);
  } else {
    jogo.pausado = true;
    cancelAnimationFrame(jogo.quadro);
    jogo.arrastando = null;
    jogo.itens.forEach((item) => item.el.classList.remove("arrastando"));
    elPausa.hidden = false;
  }
}
function desenharHud() {
  document.getElementById("jogo-itens").textContent = `${jogo.resolvidos}/${TOTAL_ITENS}`;
  document.getElementById("jogo-pontos").textContent = jogo.pontos;
}
function criarItem() {
  const def = jogo.fila.shift();
  const el = document.createElement("div");
  el.className = "lixo";
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", def.nome);
  el.title = def.nome;
  el.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true">${def.svg}</svg>`;
  elJogo.appendChild(el);
  const item = { def, el, x: -90, y: 0, faixa: Math.random(), vel: 90 + Math.random() * 50, t: 0, fase: Math.random() * 6, levado: false, rot: (Math.random() - 0.5) * 40 };
  if (jogo.cenario !== "rio") {
    const rio = elRio.getBoundingClientRect();
    item.x = 20 + Math.random() * Math.max(rio.width - 120, 10);
    if (jogo.cenario === "praia") item.y = rio.top + rio.height * MAR + 24 + Math.random() * Math.max(rio.height * (1 - MAR) - 130, 10);
    else if (jogo.cenario === "cidade") item.y = rio.top + rio.height * 0.3 + Math.random() * Math.max(rio.height * 0.7 - 110, 10);
    else {
      item.y = rio.top + rio.height * 0.12;
      item.queda = 75 + Math.random() * 35;
    }
    el.classList.add("surgindo");
    aplicar(item, item.rot);
  }
  jogo.itens.push(item);
}
function aplicar(item, giro = 0) {
  item.el.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${giro}deg)`;
}
const ritmo = () => 1 + 0.9 * (jogo.resolvidos / TOTAL_ITENS);
function moverOnda(dt, rio) {
  dt *= ritmo();
  const o = jogo.onda;
  const areia = rio.height * (1 - MAR);
  if (!o.depth) o.depth = areia * (0.4 + Math.random() * 0.5);
  o.t += dt;
  const t = o.t - o.espera;
  let f = 0;
  if (t >= 0 && t < 1.4) f = t / 1.4;
  else if (t >= 1.4 && t < 1.9) f = 1;
  else if (t >= 1.9 && t < 3.2) f = 1 - (t - 1.9) / 1.3;
  if (!o.avisou && o.espera - o.t < 1.2) {
    o.avisou = true;
    avisar("Onda chegando! Pegue o lixo na areia!");
  }
  const frente = rio.top + rio.height * MAR + o.depth * f;
  jogo.elOnda.style.height = `${o.depth * f}px`;
  [...jogo.itens].forEach((item) => {
    if (jogo.arrastando?.item === item) return;
    if (!item.levado && t >= 0 && t < 1.9 && item.y + 38 < frente) {
      item.levado = true;
      item.el.classList.add("levado");
    }
    if (!item.levado) return;
    item.y = Math.min(item.y, frente - 30);
    aplicar(item, item.rot);
    if (t >= 1.9 && o.depth * f < 14) perderItem(item);
  });
  if (t >= 3.2) Object.assign(o, { t: 0, espera: 3.5 + Math.random() * 2, depth: areia * (0.4 + Math.random() * 0.5), avisou: false });
}
function moverVento(dt, rio) {
  const v = jogo.vento;
  v.t += dt;
  const t = v.t - v.espera;
  const ativa = t >= 0 && t < v.dur;
  if (!v.avisou && v.espera - v.t < 1.2) {
    v.avisou = true;
    avisar(`Vento forte vindo da ${v.dir > 0 ? "esquerda" : "direita"}! Pegue o lixo!`);
  }
  jogo.elVento.className = `vento ${v.dir > 0 ? "direita" : "esquerda"}${ativa ? " ativo" : ""}`;
  if (ativa) {
    const forca = Math.sin((Math.PI * t) / v.dur) * 190 * ritmo();
    [...jogo.itens].forEach((item) => {
      if (jogo.arrastando?.item === item) return;
      item.x += v.dir * forca * dt;
      item.rot += v.dir * forca * dt * 1.2;
      if (item.x < -70 || item.x > rio.width + 10) perderItem(item);
    });
  }
  if (t >= v.dur) Object.assign(v, { t: 0, espera: 3 + Math.random() * 2, dir: Math.random() < 0.5 ? 1 : -1, avisou: false });
}
function moverQueda(dt, rio) {
  const chao = rio.top + rio.height - 80;
  [...jogo.itens].forEach((item) => {
    if (jogo.arrastando?.item === item) return;
    item.t += dt;
    item.y += item.queda * ritmo() * dt;
    item.x += Math.sin(item.t * 2 + item.fase) * 25 * dt;
    item.rot = Math.sin(item.t * 2.5 + item.fase) * 14;
    if (item.y > chao) perderItem(item);
  });
}
function perderItem(item) {
  jogo.itens = jogo.itens.filter((i) => i !== item);
  if (jogo.selecionado === item) jogo.selecionado = null;
  item.el.remove();
  jogo.resolvidos++;
  jogo.erros++;
  const nome = item.def.nome;
  avisar({ praia: `A onda levou ${nome}!`, cidade: `O vento levou ${nome}!`, floresta: `${nome} caiu no chão!` }[jogo.cenario]);
  desenharHud();
  if (jogo.resolvidos >= TOTAL_ITENS) terminarMissao();
}
function passo(agora) {
  if (!jogo || jogo.fim) return;
  const dt = Math.min((agora - jogo.ultimo) / 1000, 0.05);
  jogo.ultimo = agora;
  jogo.espera += dt;
  if (jogo.fila.length && (jogo.espera >= 2.4 || !jogo.itens.length)) {
    criarItem();
    jogo.espera = 0;
  }
  const rio = elRio.getBoundingClientRect();
  if (jogo.cenario === "praia") moverOnda(dt, rio);
  else if (jogo.cenario === "cidade") moverVento(dt, rio);
  else if (jogo.cenario === "floresta") moverQueda(dt, rio);
  if (jogo.fim) return;
  jogo.itens.forEach((item) => {
    if (jogo.arrastando?.item === item) return;
    if (jogo.cenario !== "rio") {
      if (!item.levado) aplicar(item, item.rot);
      return;
    }
    item.t += dt;
    item.x += item.vel * dt;
    if (item.x > rio.width + 10) item.x = -90;
    item.y = rio.top + 10 + item.faixa * Math.max(rio.height - 96, 0) + Math.sin(item.t * 2 + item.fase) * 6;
    aplicar(item, Math.sin(item.t * 1.5 + item.fase) * 8);
  });
  jogo.quadro = requestAnimationFrame(passo);
}
function selecionar(item) {
  jogo.selecionado?.el.classList.remove("selecionado");
  jogo.selecionado = item;
  item?.el.classList.add("selecionado");
}
function lixeiraEm(x, y) {
  return [...elLixeiras.children].find((b) => {
    const r = b.getBoundingClientRect();
    return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 20 && y <= r.bottom + 10;
  });
}
elJogo.addEventListener("pointerdown", (evento) => {
  const el = evento.target.closest(".lixo");
  const item = jogo?.itens.find((i) => i.el === el && !i.levado);
  if (!item) return;
  evento.preventDefault();
  jogo.arrastando = { item, dx: evento.clientX - item.x, dy: evento.clientY - item.y, x0: evento.clientX, y0: evento.clientY, moveu: false };
  selecionar(item);
  el.classList.add("arrastando");
});
document.addEventListener("pointermove", (evento) => {
  const arr = jogo?.arrastando;
  if (!arr) return;
  if (Math.hypot(evento.clientX - arr.x0, evento.clientY - arr.y0) > 6) arr.moveu = true;
  arr.item.x = evento.clientX - arr.dx;
  arr.item.y = evento.clientY - arr.dy;
  aplicar(arr.item);
  marcarSobre(evento.clientX, evento.clientY);
});
document.addEventListener("pointerup", (evento) => {
  const arr = jogo?.arrastando;
  if (!arr) return;
  jogo.arrastando = null;
  arr.item.el.classList.remove("arrastando");
  marcarSobre();
  if (!arr.moveu) return;
  const lixeira = lixeiraEm(evento.clientX, evento.clientY);
  if (lixeira) resolver(arr.item, lixeira.dataset.tipo);
  else {
    const rio = elRio.getBoundingClientRect();
    arr.item.faixa = Math.min(1, Math.max(0, (arr.item.y - rio.top - 10) / Math.max(rio.height - 96, 1)));
  }
});
elLixeiras.addEventListener("click", (evento) => {
  const lixeira = evento.target.closest("[data-tipo]");
  if (!lixeira || !jogo) return;
  if (jogo.selecionado) resolver(jogo.selecionado, lixeira.dataset.tipo);
  else avisar("Toque primeiro em um item do rio.");
});
function piscar(elemento, classe) {
  elemento.classList.add(classe);
  setTimeout(() => elemento.classList.remove(classe), 500);
}
function marcarSobre(x, y) {
  const alvo = x === undefined ? null : lixeiraEm(x, y);
  [...elLixeiras.children].forEach((b) => b.classList.toggle("sobre", b === alvo));
}
function resolver(item, tipo) {
  const certo = item.def.tipo === tipo;
  const lixeira = elLixeiras.querySelector(`[data-tipo="${tipo}"]`);
  jogo.itens = jogo.itens.filter((i) => i !== item);
  if (jogo.selecionado === item) jogo.selecionado = null;
  if (jogo.arrastando?.item === item) jogo.arrastando = null;
  item.el.classList.remove("selecionado", "arrastando");
  item.el.classList.add(certo ? "acertou" : "errou");
  setTimeout(() => item.el.remove(), 400);
  jogo.resolvidos++;
  if (certo) {
    jogo.acertos++;
    jogo.pontos += PONTOS_ACERTO;
    avisar(`Isso! +${PONTOS_ACERTO} pontos`);
  } else {
    jogo.erros++;
    jogo.pontos = Math.max(0, jogo.pontos - PONTOS_ERRO);
    avisar(`${item.def.nome} vai em “${TIPOS[item.def.tipo]}”. −${PONTOS_ERRO} pontos`);
  }
  piscar(lixeira, certo ? "certo" : "errado");
  desenharHud();
  if (jogo.resolvidos >= TOTAL_ITENS) terminarMissao();
}
function darDica() {
  if (!jogo || jogo.pausado) return;
  const vivos = jogo.itens.filter((i) => !i.levado);
  const rio = elRio.getBoundingClientRect();
  const urgencia = (i) => ({ rio: -i.x, praia: i.y, cidade: Math.min(i.x, rio.width - i.x), floresta: -i.y })[jogo.cenario];
  const urgente = vivos.sort((a, b) => urgencia(a) - urgencia(b))[0];
  const alvo = jogo.selecionado && !jogo.selecionado.levado ? jogo.selecionado : urgente;
  if (!alvo) return avisar("Espere o lixo aparecer.");
  selecionar(alvo);
  elLixeiras.querySelectorAll(".dica").forEach((b) => b.classList.remove("dica"));
  const lixeira = elLixeiras.querySelector(`[data-tipo="${alvo.def.tipo}"]`);
  lixeira.classList.add("dica");
  setTimeout(() => lixeira.classList.remove("dica"), 2500);
  avisar(`Dica: ${alvo.def.nome} vai em “${TIPOS[alvo.def.tipo]}”.`);
}
function terminarMissao() {
  jogo.fim = true;
  cancelAnimationFrame(jogo.quadro);
  const { indice, acertos, erros, pontos } = jogo;
  const estrelas = acertos >= 9 ? 3 : acertos >= 7 ? 2 : 1;
  const liberouProxima = estrelas >= 2 && indice + 1 < FASES.length && !faseLiberada(indice + 1);
  concluirMissao(indice, pontos, estrelas);
  let mensagem = "Acerte 7 itens ou mais para conquistar a medalha e liberar a próxima fase.";
  if (estrelas >= 2) mensagem = `Você conquistou a medalha ${FASES[indice].medalha}!`;
  if (liberouProxima) mensagem += ` A fase ${FASES[indice + 1].nome} foi liberada.`;
  elResultadoConteudo.innerHTML = `
    <h2>${estrelas >= 2 ? "Missão cumprida!" : "Quase lá!"}</h2>
    <div class="resultado-estrelas">${estrelasHtml(estrelas)}</div>
    <p>${acertos} acertos e ${erros} erros: <strong>${pontos} pontos</strong>.</p>
    <p>${mensagem}</p>`;
  setTimeout(() => (elResultado.hidden = false), 600);
}
function emBreve(nomeDaTela) {
  JANELAS.forEach(fecharJanela);
  avisar(`A tela “${nomeDaTela}” será criada na próxima etapa.`);
}
const ACOES = {
  jogar: abrirFases,
  "sair-jogo": abrirFases,
  repetir: () => iniciarMissao(ultimaMissao),
  dica: darDica,
  pausa: alternarPausa,
  continuar: alternarPausa,
  "como-jogar": () => abrirJanela(elComoJogar, elBotaoVoltarAjuda),
  perfil: () => abrirJanela(elPerfil, elBotaoVoltarPerfil),
  "editar-avatar": () => abrirJanela(elAvatarTela, elBotaoVoltarAvatar),
  "trocar-nome": () => abrirTelaNome(false),
  "saiba-mais": () => abrirJanela(elCreditos, elBotaoVoltarCreditos),
};
document.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-acao]");
  if (!botao) return;
  evento.preventDefault();
  ACOES[botao.dataset.acao]?.();
});
document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;
  if (jogo && elTelaNome.hidden) {
    alternarPausa();
    return;
  }
  if (!elTelaNome.hidden) {
    if (!nomeObrigatorio) fecharTelaNome();
  } else if (!elAvatarTela.hidden) {
    fecharJanela(elAvatarTela);
  } else {
    JANELAS.forEach(fecharJanela);
  }
});
desenharOndas();
atualizarTela();
if (!progresso.nome) abrirTelaNome(true);

const CRIADORES = [
  { nome: "Gustavo Morais", pele: "#c68a5b", sombra: "#a86f45", cabelo: "#3a2718", estilo: "ondulado", oculos: true, olho: "#4b2f1c", camisa: "#2e6cb8" },
  { nome: "Kauan Nascimento", pele: "#f6d3b5", sombra: "#dcae8c", cabelo: "#3b2616", estilo: "cacheado", oculos: true, olho: "#4b2f1c", camisa: "#3b9a45" },
  { nome: "Roger Leite", pele: "#f4d0b0", sombra: "#dcae8c", cabelo: "#6b4a2b", estilo: "ondulado", cheio: true, oculos: false, olho: "#b98a3e", camisa: "#e24b4a" },
];
function avatarCriador(c, tamanho, id) {
  const T = "#3b2a1a";
  const cachos = (pontos, r) => pontos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("");
  const cacheado = c.estilo === "cacheado";
  const atras = cacheado
    ? cachos([[24, 50], [22, 38], [28, 27], [38, 20], [50, 17], [62, 20], [72, 27], [78, 38], [76, 50], [34, 26], [50, 22], [66, 26]], 8)
    : c.cheio
      ? '<path d="M22 62Q14 50 22 40Q17 28 28 21Q30 10 43 10Q50 5 58 10Q70 10 72 21Q83 28 78 40Q86 50 78 62Z"/>'
      : '<path d="M24 60Q17 50 24 41Q19 31 29 25Q31 15 42 15Q50 10 58 15Q69 15 71 25Q81 31 76 41Q83 50 76 60Z"/>';
  const frente = cacheado
    ? cachos([[36, 33], [46, 30], [56, 30], [65, 34]], 6.5)
    : c.cheio
      ? '<path d="M24 54Q19 28 38 19Q50 12 62 19Q81 28 76 54Q73 43 66 37Q58 43 50 37Q42 43 34 37Q27 43 24 54Z" stroke="none"/><path d="M76 54Q73 43 66 37Q58 43 50 37Q42 43 34 37Q27 43 24 54" fill="none"/>'
      : '<path d="M25 52Q21 30 38 22Q50 15 62 22Q79 30 75 52Q72 41 64 35Q58 41 50 35Q42 41 36 35Q28 41 25 52Z"/><path d="M32 27Q40 21 48 27T64 25" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>';
  const olho = (x) => `<ellipse cx="${x}" cy="53" rx="5" ry="4.2" fill="#fff" stroke="${T}" stroke-width="1.2"/><circle cx="${x}" cy="53.4" r="3.1" fill="${c.olho}"/><circle cx="${x}" cy="53.4" r="1.4" fill="${T}"/><circle cx="${x + 1}" cy="52.2" r="0.9" fill="#fff"/>`;
  const oculos = c.oculos
    ? `<g fill="rgba(255,255,255,0.18)" stroke="${T}" stroke-width="2.2"><circle cx="39" cy="53" r="9.5"/><circle cx="61" cy="53" r="9.5"/></g><path d="M48.5 52Q50 50 51.5 52M29.5 52L26 51M70.5 52L74 51" fill="none" stroke="${T}" stroke-width="2.2" stroke-linecap="round"/>`
    : "";
  return `<svg width="${tamanho}" height="${tamanho}" viewBox="0 0 100 100" role="img" aria-label="Avatar de ${c.nome}">
    <clipPath id="recorte-criador-${id}"><circle cx="50" cy="50" r="48"/></clipPath>
    <circle cx="50" cy="50" r="48" fill="#bfe6f7"/>
    <g clip-path="url(#recorte-criador-${id})" stroke="${T}" stroke-linejoin="round" stroke-linecap="round">
      <g fill="${c.cabelo}" stroke-width="1.8">${atras}</g>
      <path d="M10 100Q14 84 36 82L50 90L64 82Q86 84 90 100Z" fill="${c.camisa}" stroke-width="2"/>
      <rect x="42" y="74" width="16" height="16" fill="${c.sombra}" stroke-width="2"/>
      <g fill="${c.pele}" stroke-width="2"><ellipse cx="26" cy="56" rx="4" ry="6"/><ellipse cx="74" cy="56" rx="4" ry="6"/><ellipse cx="50" cy="54" rx="24" ry="27"/></g>
      <g fill="${c.cabelo}" stroke-width="1.8">${frente}</g>
      <circle cx="33" cy="62" r="4" fill="#f09a8a" opacity="0.3" stroke="none"/><circle cx="67" cy="62" r="4" fill="#f09a8a" opacity="0.3" stroke="none"/>
      ${olho(39)}${olho(61)}${oculos}
      <path d="M32 43Q39 40 46 43M54 43Q61 40 68 43" fill="none" stroke="${c.cabelo}" stroke-width="2.8"/>
      <path d="M50 57Q47 63 51 64" fill="none" stroke="${c.sombra}" stroke-width="1.8"/>
      <path d="M45 69.5Q50 73 55 69.5" fill="none" stroke="#8a3b2e" stroke-width="1.8"/>
      <g fill="${c.cabelo}" stroke-width="1.5"><path d="M42 66.5Q46 63.5 50 65.5Q54 63.5 58 66.5Q54 68 50 67.2Q46 68 42 66.5Z"/><path d="M42 73Q50 77 58 73Q57 79 50 80Q43 79 42 73Z"/></g>
    </g>
    <circle cx="50" cy="50" r="48" fill="none" stroke="${T}" stroke-width="3"/>
  </svg>`;
}
document.getElementById("creditos-nomes").innerHTML = CRIADORES.map((c, i) => `<li>${avatarCriador(c, 104, i)}<span class="criador-nome">${c.nome}</span></li>`).join("");