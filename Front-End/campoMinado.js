// =============================================
//  CAMPO-MINADO.JS
// =============================================

class CampoMinado {
  constructor() {
    this.bombas         = [];
    this.jogoAtivo      = false;
    this.primeiroClique = true;
    this.config         = { L: 0, C: 0, qtdB: 0 };
    this._boundClick    = this._handleClique.bind(this);
  }

  iniciar(L, C, qtdB) {
    this.config         = { L, C, qtdB };
    this.bombas         = [];
    this.jogoAtivo      = true;
    this.primeiroClique = true;

    const status = document.getElementById('status-mina');
    if (status) status.innerHTML = '';

    // Substitui o container para remover listeners antigos
    const old = document.getElementById('grid-mina');
    if (!old) return;
    const container = old.cloneNode(false);
    old.parentNode.replaceChild(container, old);

    container.style.gridTemplateColumns = `repeat(${C}, 28px)`;

    const frag = document.createDocumentFragment();
    for (let i = 0; i < L * C; i++) {
      const q = document.createElement('div');
      q.className     = 'quadrado';
      q.dataset.index = i;
      frag.appendChild(q);
    }
    container.appendChild(frag);

    container.addEventListener('mousedown', this._boundClick);
    container.addEventListener('contextmenu', e => e.preventDefault());
  }

  _handleClique(e) {
    if (!this.jogoAtivo) return;
    const q = e.target.closest('.quadrado');
    if (!q) return;
    const index = parseInt(q.dataset.index);

    if (e.button === 0) {
      this._jogar(index, q);
    } else if (e.button === 2) {
      this._bandeira(q);
    }
  }

  _jogar(index, el) {
    if (el.textContent === '🚩' || el.classList.contains('aberto')) return;

    if (this.primeiroClique) {
      this.primeiroClique = false;
      this._gerarBombas(index);
    }

    if (this.bombas.includes(index)) {
      this._encerrar(false);
    } else {
      this._revelar(index);
      this._checarVitoria();
    }
  }

  _gerarBombas(seguro) {
    const { L, C, qtdB } = this.config;
    const proibidos = new Set(this._vizinhos(seguro));
    proibidos.add(seguro);
    while (this.bombas.length < qtdB) {
      const r = Math.floor(Math.random() * (L * C));
      if (!this.bombas.includes(r) && !proibidos.has(r)) {
        this.bombas.push(r);
      }
    }
  }

  _vizinhos(i) {
    const { L, C } = this.config;
    const v = [];
    const lin = Math.floor(i / C), col = i % C;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nl = lin + dx, nc = col + dy;
        if (nl >= 0 && nl < L && nc >= 0 && nc < C) v.push(nl * C + nc);
      }
    }
    return v;
  }

  _revelar(i) {
    const container = document.getElementById('grid-mina');
    if (!container) return;
    const el = container.children[i];
    if (!el || el.classList.contains('aberto') || el.textContent === '🚩') return;

    el.classList.add('aberto');
    const viz = this._vizinhos(i);
    const qtd = viz.filter(v => this.bombas.includes(v)).length;

    if (qtd > 0) {
      el.textContent = qtd;
      el.style.color = ['','#1565C0','#2E7D32','#C62828','#1A237E','#6D4C41','#00838F','#212121','#546E7A'][qtd];
    } else {
      viz.forEach(v => this._revelar(v));
    }
  }

  _bandeira(el) {
    if (el.classList.contains('aberto')) return;
    el.textContent = el.textContent === '🚩' ? '' : '🚩';
  }

  _encerrar(venceu) {
    this.jogoAtivo = false;
    const status    = document.getElementById('status-mina');
    const container = document.getElementById('grid-mina');

    if (venceu) {
      if (status) status.innerHTML = `<span class="vitoria-texto">VITÓRIA! 🎉</span>`;
      window.vitorias = (window.vitorias || 0) + 1;
    } else {
      if (status) status.innerHTML = `<span class="derrota-texto">DERROTA! 💥</span>`;
      this.bombas.forEach(b => {
        const el = container.children[b];
        if (el) { el.classList.add('bomba'); el.textContent = '💣'; }
      });
      window.derrotas = (window.derrotas || 0) + 1;
    }
    if (typeof window.atualizarPlacar === 'function') window.atualizarPlacar();
  }

  _checarVitoria() {
    const { L, C, qtdB } = this.config;
    const abertos = document.querySelectorAll('#grid-mina .quadrado.aberto').length;
    if (abertos === L * C - qtdB) this._encerrar(true);
  }
}

// Expõe instância globalmente
window._jogoMina = new CampoMinado();