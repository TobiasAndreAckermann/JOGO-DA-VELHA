let jogadorAtual = 'X';
let contraMaquina = false;
let dificuldade = '';
let jogoEmAndamento = true;
let placar = { jogador1: 0, jogador2: 0 };

document.getElementById('btn-entrar').addEventListener('click', function () {
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;
    if (nome && senha) {
        trocarTela('tela-inicial', 'tela-configuracao');
    } else {
        alert('Por favor, insira nome e senha!');
    }
});

document.getElementById('contra-maquina').addEventListener('click', function () {
    document.getElementById('config-dificuldade').classList.remove('oculto');
});

document.getElementById('dois-jogadores').addEventListener('click', function () {
    iniciarJogo(false);
});

document.getElementById('facil').addEventListener('click', function () {
    iniciarJogo(true, 'facil');
});

document.getElementById('medio').addEventListener('click', function () {
    iniciarJogo(true, 'medio');
});

document.getElementById('dificil').addEventListener('click', function () {
    iniciarJogo(true, 'dificil');
});

document.getElementById('voltar-inicial').addEventListener('click', function () {
    trocarTela('tela-configuracao', 'tela-inicial');
});

document.getElementById('voltar-configuracao').addEventListener('click', function () {
    trocarTela('tela-jogo', 'tela-configuracao');
});

function trocarTela(atual, proxima) {
    document.getElementById(atual).classList.add('oculto');
    document.getElementById(proxima).classList.remove('oculto');
}

function iniciarJogo(maquina, nivel) {
    contraMaquina = maquina;
    dificuldade = nivel || '';
    trocarTela('tela-configuracao', 'tela-jogo');
    jogoEmAndamento = true;
    jogadorAtual = 'X';
    criarTabuleiro();
}
function iniciarJogo(maquina, nivel) {
    contraMaquina = maquina;
    dificuldade = nivel || '';
    jogoEmAndamento = true;
    jogadorAtual = 'X';
    
    // Zerar placar ao iniciar
    placar = { jogador1: 0, jogador2: 0 };
    document.getElementById('jogador1').textContent = `Jogador 1: 0`;
    document.getElementById('jogador2').textContent = `Jogador 2: 0`;

    trocarTela('tela-configuracao', 'tela-jogo');
    criarTabuleiro();
}
function criarTabuleiro() {
    const tabuleiro = document.getElementById('tabuleiro');
    tabuleiro.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const celula = document.createElement('div');
        celula.setAttribute('data-index', i);
        celula.addEventListener('click', jogar);
        tabuleiro.appendChild(celula);
    }
}

function jogar(event) {
    const celula = event.target;
    if (celula.textContent === '' && jogoEmAndamento) {
        celula.textContent = jogadorAtual;
        if (verificarResultado()) {
            atualizarPlacar();
            return;
        }
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
        if (contraMaquina && jogadorAtual === 'O') {
            setTimeout(jogadaIA, 500);
        }
    }
}

function jogadaIA() {
    const celulas = Array.from(document.querySelectorAll('#tabuleiro div'));
    const vazias = celulas.map((c, i) => c.textContent === '' ? i : null).filter(i => i !== null);

    if (vazias.length > 0 && jogoEmAndamento) {
        let index;

        if (dificuldade === 'facil') {
            index = vazias[Math.floor(Math.random() * vazias.length)];
        } else if (dificuldade === 'medio') {
            index = estrategiaIA(celulas) ?? vazias[Math.floor(Math.random() * vazias.length)];
        } else if (dificuldade === 'dificil') {
            index = minimax(celulas, 'O').index;
        }

        celulas[index].textContent = 'O';
        if (verificarResultado()) {
            atualizarPlacar();
            return;
        }
        jogadorAtual = 'X';
    }
}

function estrategiaIA(celulas) {
    const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of combinacoes) {
        if (celulas[a].textContent === 'O' && celulas[b].textContent === 'O' && celulas[c].textContent === '') return c;
        if (celulas[a].textContent === 'O' && celulas[c].textContent === 'O' && celulas[b].textContent === '') return b;
        if (celulas[b].textContent === 'O' && celulas[c].textContent === 'O' && celulas[a].textContent === '') return a;
    }
    for (const [a, b, c] of combinacoes) {
        if (celulas[a].textContent === 'X' && celulas[b].textContent === 'X' && celulas[c].textContent === '') return c;
        if (celulas[a].textContent === 'X' && celulas[c].textContent === 'X' && celulas[b].textContent === '') return b;
        if (celulas[b].textContent === 'X' && celulas[c].textContent === 'X' && celulas[a].textContent === '') return a;
    }
    return null;
}

function verificarResultado() {
    const celulas = Array.from(document.querySelectorAll('#tabuleiro div'));
    const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of combinacoes) {
        if (
            celulas[a].textContent &&
            celulas[a].textContent === celulas[b].textContent &&
            celulas[a].textContent === celulas[c].textContent
        ) {
            jogoEmAndamento = false;
            return true;
        }
    }
    if (celulas.every(c => c.textContent !== '')) {
        exibirMensagem('Empate!');
        return true;
    }
    return false;
}

function atualizarPlacar() {
    if (jogadorAtual === 'X') {
        placar.jogador1++;
        exibirMensagem('Jogador 1 foi o vencedor, parabéns!');
    } else {
        placar.jogador2++;
        exibirMensagem('Jogador 2 foi o vencedor, parabéns!');
    }
    document.getElementById('jogador1').textContent = `Jogador 1: ${placar.jogador1}`;
    document.getElementById('jogador2').textContent = `Jogador 2: ${placar.jogador2}`;
}

function exibirMensagem(texto) {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = texto;
    mensagem.classList.remove('oculto');

    setTimeout(() => {
        mensagem.classList.add('oculto');
        criarTabuleiro();
        jogoEmAndamento = true;
        jogadorAtual = 'X';
    }, 3000);
}

function minimax(celulas, jogador) {
    const huPlayer = 'X';
    const aiPlayer = 'O';
    const availSpots = celulas.map((c, i) => c.textContent === '' ? i : null).filter(i => i !== null);

    if (checarVitoria(celulas, huPlayer)) return { score: -10 };
    if (checarVitoria(celulas, aiPlayer)) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const index = availSpots[i];
        const move = { index };
        celulas[index].textContent = jogador;

        const result = minimax(celulas, jogador === aiPlayer ? huPlayer : aiPlayer);
        move.score = result.score;
        celulas[index].textContent = '';

        moves.push(move);
    }

    let bestMove;
    if (jogador === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checarVitoria(celulas, jogador) {
    const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    return combinacoes.some(([a, b, c]) =>
        celulas[a].textContent === jogador &&
        celulas[b].textContent === jogador &&
        celulas[c].textContent === jogador
    );
}
function verificarResultado() {
    const celulas = Array.from(document.querySelectorAll('#tabuleiro div'));
    const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of combinacoes) {
        if (
            celulas[a].textContent &&
            celulas[a].textContent === celulas[b].textContent &&
            celulas[a].textContent === celulas[c].textContent
        ) {
            jogoEmAndamento = false;
            atualizarPlacar(celulas[a].textContent); // Passa o jogador vencedor
            return true;
        }
    }
    if (celulas.every(c => c.textContent !== '')) {
        jogoEmAndamento = false;
        exibirMensagem('Empate, vamos para próxima rodada!');
        return true;
    }
    return false;
}

function atualizarPlacar(vencedor) {
    if (vencedor === 'X') {
        placar.jogador1++;
        exibirMensagem('Jogador 1 ganhou, parabéns!');
    } else if (vencedor === 'O') {
        placar.jogador2++;
        exibirMensagem('Jogador 2 ganhou, parabéns!');
    }

    document.getElementById('jogador1').textContent = `Jogador 1: ${placar.jogador1}`;
    document.getElementById('jogador2').textContent = `Jogador 2: ${placar.jogador2}`;
}
