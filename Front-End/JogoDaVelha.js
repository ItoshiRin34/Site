// =============================================
//  JOGO-DA-VELHA.JS — Reescrito completamente
// =============================================

class JogoDaVelha {
  constructor() {
    this.jogadorAtual    = 'X';
    this.tabuleiro       = Array(9).fill('');
    this.jogoAtivo       = false;
    this.celulaVencedora = [];
    this._bound          = this._onClique.bind(this); // referência estável para poder remover
  }

  iniciar() {
    this.jogadorAtual    = 'X';
    this.tabuleiro       = Array(9).fill('');
    this.jogoAtivo       = true;
    this.celulaVencedora = [];

    this._montarGrid();
    this._atualizarStatus();
  }

  // Cria as 9 células UMA VEZ e usa UM listener delegado no container
  _montarGrid() {
    const container = document.getElementById('tabuleiro-velha');
    if (!container) return;

    // Remove listener antigo para não duplicar em cada reinício
    container.removeEventListener('click', this._bound);
    container.innerHTML = '';

    for (let i = 0; i < 9; i++) {
      const cel = document.createElement('div');
      cel.className     = 'celula';
      cel.dataset.index = i;   // índice guardado no DOM, sem closure
      container.appendChild(cel);
    }

    // UM único listener delegado — sem closures individuais por célula
    container.addEventListener('click', this._bound);

    this._renderizarCelulas();
  }

  // Atualiza o visual das células sem recriar o DOM
  _renderizarCelulas() {
    const container = document.getElementById('tabuleiro-velha');
    if (!container) return;

    const celulas = container.children;
    for (let i = 0; i < 9; i++) {
      const cel = celulas[i];
      const val = this.tabuleiro[i];

      cel.className   = 'celula';
      cel.textContent = val;

      if (val === 'X') cel.classList.add('celula-x');
      if (val === 'O') cel.classList.add('celula-o');
      if (val !== '')  cel.classList.add('celula-ocupada');
      if (this.celulaVencedora.includes(i)) cel.classList.add('celula-vencedora');
      if (!this.jogoAtivo || val !== '') cel.classList.add('celula-ocupada');
    }
  }

  // Handler delegado — lê o índice do dataset, nunca de closure
  _onClique(e) {
    if (!this.jogoAtivo) return;

    const cel = e.target.closest('.celula');
    if (!cel) return;

    const index = parseInt(cel.dataset.index);
    if (isNaN(index)) return;
    if (this.tabuleiro[index] !== '') return; // já ocupada

    this._jogar(index);
  }

  _jogar(index) {
    this.tabuleiro[index] = this.jogadorAtual;

    const resultado = this._checarResultado();

    if (resultado === 'vitoria') {
      this.jogoAtivo = false;
      this._renderizarCelulas();
      this._mostrarStatus(`<span class="vitoria-texto">Jogador ${this.jogadorAtual} VENCEU! 🎉</span>`);
      window.vitorias = (window.vitorias || 0) + 1;
      if (typeof window.atualizarPlacar === 'function') window.atualizarPlacar();
      return;
    }

    if (resultado === 'empate') {
      this.jogoAtivo = false;
      this._renderizarCelulas();
      this._mostrarStatus(`<span class="empate-texto">Empate! 🤝</span>`);
      return;
    }

    // Jogo continua — troca jogador e atualiza visual
    this.jogadorAtual = this.jogadorAtual === 'X' ? 'O' : 'X';
    this._renderizarCelulas();
    this._atualizarStatus();
  }

  _checarResultado() {
    const combos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (const combo of combos) {
      const [a, b, c] = combo;
      if (
        this.tabuleiro[a] !== '' &&
        this.tabuleiro[a] === this.tabuleiro[b] &&
        this.tabuleiro[a] === this.tabuleiro[c]
      ) {
        this.celulaVencedora = combo;
        return 'vitoria';
      }
    }

    if (!this.tabuleiro.includes('')) return 'empate';

    return null; // jogo continua
  }

  _atualizarStatus() {
    const cor = this.jogadorAtual === 'X' ? 'jogador-x' : 'jogador-o';
    this._mostrarStatus(`Vez do: <span class="${cor}">${this.jogadorAtual}</span>`);
  }

  _mostrarStatus(html) {
    const el = document.getElementById('status-velha');
    if (el) el.innerHTML = html;
  }
}

// ---- Instância global ----
window.velha      = new JogoDaVelha();
window.resetVelha = () => window.velha.iniciar();