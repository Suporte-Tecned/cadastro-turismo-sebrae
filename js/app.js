// ---- 1. Nomes dos 12 cursos: edite aqui livremente ----
const CURSOS = [
  "Empreendedorismo, Liderança e Vendas",
  "Planejamento Estratégico para o Turismo",
  "Excelência em Marketing Digital",
  "Conteúdo Atraente e Fotografia Digital",
  "Hospitalidade no Turismo",
  "Informações Turísticas",
  "Turismo e Meio Ambiente",
  "Turismo em Área de Proteção Ambiental",
  "Roteirização Turística",
  "Operações Turísticas e IA",
  "Fortalecimento da Cultura",
  "Projetos Culturais",
];

// ---- 2. URL do Web App do Google Apps Script (Code.gs) ----
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwrb0CT_zxA7IczPHUjTjp4vGTFjJxcaD4pA45KJ6dZmbsvfdahI8I_XHg78QBVZnTP/exec";

// ---------- Máscara de CPF (mostra pontos/traço, envia só números) ----------
function maskCPF(valor) {
  let digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length > 9)
    return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  if (digitos.length > 6)
    return digitos.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (digitos.length > 3) return digitos.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  return digitos;
}
function apenasDigitos(valor) {
  return (valor || "").replace(/\D/g, "");
}

document.getElementById("cpf").addEventListener("input", (e) => {
  e.target.value = maskCPF(e.target.value);
});
document.getElementById("edit-cpf").addEventListener("input", (e) => {
  e.target.value = maskCPF(e.target.value);
});

// ---------- Monta as caixinhas de curso (cadastro e edição) ----------
function normalizarNome(v) {
  return String(v || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function montarGradeCursos(container, marcados) {
  container.innerHTML = "";
  marcados = marcados || [];
  const marcadosNorm = marcados.map(normalizarNome);
  CURSOS.forEach((nome, i) => {
    const id = container.id + "-curso" + i;
    const wrap = document.createElement("label");
    wrap.className = "curso-chip";
    wrap.setAttribute("for", id);
    const marcado = marcadosNorm.includes(normalizarNome(nome))
      ? "checked"
      : "";
    wrap.innerHTML =
      '<input type="checkbox" id="' +
      id +
      '" value="' +
      nome.replace(/"/g, "&quot;") +
      '" ' +
      marcado +
      " />" +
      "<span>" +
      nome +
      "</span>";
    container.appendChild(wrap);
  });
}
montarGradeCursos(document.getElementById("grade-cursos"), []);

document.getElementById("data").valueAsDate = new Date();

// ---------- Abas ----------
const abaCadastro = document.getElementById("aba-cadastro");
const abaLista = document.getElementById("aba-lista");
const viewCadastro = document.getElementById("view-cadastro");
const viewLista = document.getElementById("view-lista");

function mostrarAba(nome) {
  const ehCadastro = nome === "cadastro";
  viewCadastro.classList.toggle("ativa", ehCadastro);
  viewLista.classList.toggle("ativa", !ehCadastro);
  abaCadastro.classList.toggle("ativa", ehCadastro);
  abaLista.classList.toggle("ativa", !ehCadastro);
  if (!ehCadastro) carregarAlunos();
}
abaCadastro.addEventListener("click", () => mostrarAba("cadastro"));
abaLista.addEventListener("click", () => mostrarAba("lista"));
document
  .getElementById("btn-atualizar-lista")
  .addEventListener("click", carregarAlunos);

// ---------- Cadastro (novo aluno) ----------
const form = document.getElementById("form-cadastro");
const status = document.getElementById("status");
const btn = document.getElementById("btn-enviar");
let timerStatus = null;

function limparStatus() {
  if (timerStatus) {
    clearTimeout(timerStatus);
    timerStatus = null;
  }
  status.className = "";
  status.textContent = "";
}

function mostrarStatus(tipo, texto, duracao) {
  limparStatus();
  status.className = tipo;
  status.textContent = texto;
  if (duracao) {
    timerStatus = setTimeout(() => {
      status.classList.add("desaparecendo");
      setTimeout(() => {
        limparStatus();
      }, 500);
    }, duracao);
  }
}

function limparValidade(escopo) {
  escopo
    .querySelectorAll(".campo")
    .forEach((c) => c.classList.remove("invalido"));
}
function marcarInvalido(idCampo) {
  document.getElementById(idCampo).classList.add("invalido");
}
function cpfValido(valor) {
  return apenasDigitos(valor).length === 11;
}
function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  limparValidade(form);
  document.getElementById("erro-cursos").style.display = "none";
  limparStatus();

  const nome = document.getElementById("nome").value.trim();
  const sobrenome = document.getElementById("sobrenome").value.trim();
  const email = document.getElementById("email").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const responsavel = document.getElementById("responsavel").value.trim();
  const data = document.getElementById("data").value;
  const grade = document.getElementById("grade-cursos");
  const cursosSelecionados = Array.from(
    grade.querySelectorAll("input:checked"),
  ).map((c) => c.value);

  let valido = true;
  if (!nome) {
    marcarInvalido("campo-nome");
    valido = false;
  }
  if (!sobrenome) {
    marcarInvalido("campo-sobrenome");
    valido = false;
  }
  if (!email || !emailValido(email)) {
    marcarInvalido("campo-email");
    valido = false;
  }
  if (!cpfValido(cpf)) {
    marcarInvalido("campo-cpf");
    valido = false;
  }
  if (!cidade) {
    marcarInvalido("campo-cidade");
    valido = false;
  }
  if (!responsavel) {
    marcarInvalido("campo-responsavel");
    valido = false;
  }
  if (cursosSelecionados.length === 0) {
    document.getElementById("erro-cursos").style.display = "block";
    valido = false;
  }
  if (!valido) {
    status.className = "falha";
    status.textContent = "Confira os campos destacados.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Enviando...";

  const payload = {
    action: "create",
    nome,
    sobrenome,
    email,
    cpf: apenasDigitos(cpf), // envia só números para a planilha
    cidade,
    responsavel,
    data,
    cursos: cursosSelecionados,
  };

  try {
    const resp = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const resultado = await resp.json();
    if (resultado && resultado.status === "ok") {
      mostrarStatus(
        "sucesso",
        "Aluno " + nome + " cadastrado com sucesso!",
        5000,
      );
      form.reset();
      montarGradeCursos(grade, []);
      document.getElementById("data").valueAsDate = new Date();
    } else {
      throw new Error(
        (resultado && resultado.mensagem) || "resposta inesperada",
      );
    }
  } catch (err) {
    mostrarStatus(
      "falha",
      "Não foi possível enviar. Verifique a internet e tente de novo.",
      5000,
    );
  } finally {
    btn.disabled = false;
    btn.textContent = "Cadastrar aluno";
  }
});

// ---------- Lista de alunos ----------
const listaCorpo = document.getElementById("lista-corpo");
let cacheAlunos = [];

async function carregarAlunos() {
  listaCorpo.innerHTML = '<p class="carregando">Carregando alunos...</p>';
  try {
    const resp = await fetch(SCRIPT_URL, { method: "GET" });
    const resultado = await resp.json();
    if (!resultado || resultado.status !== "ok")
      throw new Error("resposta inesperada");
    cacheAlunos = resultado.alunos || [];
    renderizarLista();
  } catch (err) {
    listaCorpo.innerHTML =
      '<p class="carregando">Não foi possível carregar os alunos agora.</p>';
  }
}

function nomeCompleto(aluno) {
  return [aluno.nome, aluno.sobrenome].filter(Boolean).join(" ");
}

let listaContador = document.getElementById("lista-contador");

function renderizarLista() {
  if (cacheAlunos.length === 0) {
    listaCorpo.innerHTML =
      '<p class="vazio">Nenhum aluno cadastrado ainda.</p>';
    return;
  }
  listaContador.textContent = cacheAlunos.length;
  listaCorpo.innerHTML = "";
  cacheAlunos.forEach((aluno) => {
    const linha = document.createElement("div");
    linha.className = "linha-aluno";
    const nomeExibicao = nomeCompleto(aluno);
    const inicial = (aluno.nome || "?").trim().charAt(0).toUpperCase();
    const cursos = aluno.cursos || "";
    const cidade = aluno.cidade || "";
    const responsavel = aluno.responsavel || "";
    const cpf = maskCPF(String(aluno.cpf || "").padStart(11, "0"));
    linha.innerHTML =
      '<span class="cel-aluno">' +
      '<span class="avatar" aria-hidden="true">' +
      escapeHtml(inicial) +
      "</span>" +
      '<span class="nome-wrap">' +
      '<span class="nome-forte" title="' +
      escapeHtml(nomeExibicao) +
      '">' +
      escapeHtml(nomeExibicao) +
      "</span>" +
      "</span>" +
      "</span>" +
      '<span class="cel-com-icone" title="' +
      escapeHtml(cidade) +
      '"><i class="ri-map-pin-line"></i>' +
      escapeHtml(cidade) +
      "</span>" +
      '<span class="cel-com-icone" title="' +
      escapeHtml(cpf) +
      '"><i class="ri-id-card-line"></i>' +
      escapeHtml(cpf) +
      "</span>" +
      '<span class="col-cursos" title="' +
      escapeHtml(cursos) +
      '">' +
      escapeHtml(cursos) +
      "</span>" +
      '<span class="col-responsavel cel-com-icone" title="' +
      escapeHtml(responsavel) +
      '"><i class="ri-user-star-line"></i>' +
      escapeHtml(responsavel) +
      "</span>" +
      "<span></span>";
    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.innerHTML =
      '<i class="ri-pencil-line"></i><span>Editar</span>';
    btnEditar.addEventListener("click", () => abrirEdicao(aluno));
    linha.lastElementChild.appendChild(btnEditar);
    listaCorpo.appendChild(linha);
  });
}

function escapeHtml(v) {
  return String(v || "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

// ---------- Modal de edição (sem opção de excluir) ----------
const modal = document.getElementById("modal-editar");
const formEditar = document.getElementById("form-editar");
const editStatus = document.getElementById("edit-status");
const gradeEdit = document.getElementById("edit-grade-cursos");

function abrirEdicao(aluno) {
  limparValidade(formEditar);
  editStatus.style.display = "none";
  document.getElementById("edit-id").value = aluno.id;
  document.getElementById("edit-nome").value = aluno.nome || "";
  document.getElementById("edit-sobrenome").value = aluno.sobrenome || "";
  document.getElementById("edit-email").value = aluno.email || "";
  document.getElementById("edit-cabecalho-sub").textContent =
    nomeCompleto(aluno) || "Aluno";
  document.getElementById("edit-cpf").value = maskCPF(
    String(aluno.cpf || "").padStart(11, "0"),
  );
  document.getElementById("edit-cidade").value = aluno.cidade || "";
  document.getElementById("edit-responsavel").value = aluno.responsavel || "";
  document.getElementById("edit-data").value = aluno.data
    ? String(aluno.data).slice(0, 10)
    : "";
  const cursosAtuais = (aluno.cursos || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  montarGradeCursos(gradeEdit, cursosAtuais);
  modal.classList.add("ativa");
}

document.getElementById("btn-cancelar-edicao").addEventListener("click", () => {
  modal.classList.remove("ativa");
});

formEditar.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  limparValidade(formEditar);
  document.getElementById("edit-erro-cursos").style.display = "none";
  editStatus.style.display = "none";

  const id = document.getElementById("edit-id").value;
  const nome = document.getElementById("edit-nome").value.trim();
  const sobrenome = document.getElementById("edit-sobrenome").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const cpf = document.getElementById("edit-cpf").value.trim();
  const cidade = document.getElementById("edit-cidade").value.trim();
  const responsavel = document.getElementById("edit-responsavel").value.trim();
  const data = document.getElementById("edit-data").value;
  const cursosSelecionados = Array.from(
    gradeEdit.querySelectorAll("input:checked"),
  ).map((c) => c.value);

  let valido = true;
  if (!nome) {
    marcarInvalido("edit-campo-nome");
    valido = false;
  }
  if (!sobrenome) {
    marcarInvalido("edit-campo-sobrenome");
    valido = false;
  }
  if (!email || !emailValido(email)) {
    marcarInvalido("edit-campo-email");
    valido = false;
  }
  if (!cpfValido(cpf)) {
    marcarInvalido("edit-campo-cpf");
    valido = false;
  }
  if (!cidade) {
    marcarInvalido("edit-campo-cidade");
    valido = false;
  }
  if (!responsavel) {
    marcarInvalido("edit-campo-responsavel");
    valido = false;
  }
  if (cursosSelecionados.length === 0) {
    document.getElementById("edit-erro-cursos").style.display = "block";
    valido = false;
  }
  if (!valido) {
    editStatus.style.display = "block";
    editStatus.style.background = "#fbeceb";
    editStatus.style.color = "#b3261e";
    editStatus.textContent = "Confira os campos destacados.";
    return;
  }

  const btnSalvar = document.getElementById("btn-salvar-edicao");
  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando...";

  const payload = {
    action: "update",
    id,
    nome,
    sobrenome,
    email,
    cpf: apenasDigitos(cpf),
    cidade,
    responsavel,
    data,
    cursos: cursosSelecionados,
  };

  try {
    const resp = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const resultado = await resp.json();
    if (resultado && resultado.status === "ok") {
      modal.classList.remove("ativa");
      carregarAlunos();
    } else {
      throw new Error(
        (resultado && resultado.mensagem) || "resposta inesperada",
      );
    }
  } catch (err) {
    editStatus.style.display = "block";
    editStatus.style.background = "#fbeceb";
    editStatus.style.color = "#b3261e";
    editStatus.textContent = "Não foi possível salvar. Tente novamente.";
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = "Salvar alterações";
  }
});
