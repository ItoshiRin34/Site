// =============================================
//  MAIN.JS — Navegação, placar e cadastro
//  Tudo dentro de DOMContentLoaded para garantir
//  que o DOM e os outros scripts já carregaram.
// =============================================

window.vitorias = 0;
window.derrotas  = 0;

document.addEventListener('DOMContentLoaded', function () {

  // ── Navegação por data-ir ──────────────────
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-ir]');
    if (btn) irPara(btn.dataset.ir);
  });

  // ── Reset Jogo da Velha ────────────────────
  const btnReset = document.getElementById('btn-reset-velha');
  if (btnReset) {
    btnReset.addEventListener('click', function () {
      if (window.velha) window.velha.iniciar();
    });
  }

  // ── Dificuldade Campo Minado ───────────────
  document.body.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-mina]');
    if (btn) {
      const [l, c, b] = btn.dataset.mina.split(',').map(Number);
      window._jogoMina.iniciar(l, c, b);
    }
  });

  // ── Cadastro ──────────────────────────────
  const btnCadastro = document.getElementById('btn-cadastro');
  if (btnCadastro) btnCadastro.addEventListener('click', fazerCadastro);

});

// ── Funções globais ────────────────────────────

function irPara(id) {
  document.querySelectorAll('.tela').forEach(function (t) {
    t.classList.add('hidden');
    t.classList.remove('ativa');
  });

  var destino = document.getElementById(id);
  if (!destino) return;
  destino.classList.remove('hidden');
  destino.classList.add('ativa');

  if (id === 'tela-velha') {
    if (window.velha) window.velha.iniciar();
  } else if (id === 'tela-mina') {
    if (window._jogoMina) window._jogoMina.iniciar(8, 8, 10);
  } else if (id === 'tela-inicial') {
    atualizarPlacar();
  }
}

function atualizarPlacar() {
  var spanV = document.getElementById('v-global');
  var spanD = document.getElementById('d-global');
  if (spanV) spanV.innerText = window.vitorias;
  if (spanD) spanD.innerText = window.derrotas;
}

function fazerCadastro() {
  var email = document.getElementById('email').value.trim();
  var senha = document.getElementById('senha').value.trim();
  var msg   = document.getElementById('msg-cadastro');

  if (!email || !senha) {
    _showMsg(msg, 'Preencha todos os campos!', 'erro'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    _showMsg(msg, 'E-mail inválido!', 'erro'); return;
  }
  if (senha.length < 6) {
    _showMsg(msg, 'Senha deve ter 6+ caracteres!', 'erro'); return;
  }
  _showMsg(msg, '✅ Cadastro realizado: ' + email, 'sucesso');
  document.getElementById('email').value = '';
  document.getElementById('senha').value = '';
}

function _showMsg(el, texto, tipo) {
  el.textContent = texto;
  el.className = 'msg-feedback ' + tipo;
  setTimeout(function () { el.className = 'msg-feedback hidden'; }, 3500);
}

window.irPara          = irPara;
window.atualizarPlacar = atualizarPlacar;
window.fazerCadastro   = fazerCadastro;