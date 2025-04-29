document.addEventListener('DOMContentLoaded', () => {
    // lista de palavras válidas usada apenas para sortear a palavra alvo
    const validWords = [
       'ABRIR', 'AMIGO', 'BANHO', 'CAIXA', 'CASAL', 'CORPO', 'DEDOS', 'DENTE', 
        'FESTA', 'FILHO', 'FOGOS', 'FRUTA', 'GANHO', 'GOSTO', 'GRITO', 'HORAS', 
        'JOGOS', 'JOVEM', 'LARGO', 'LEITE', 'LOIRA', 'MACIO', 'MAIOR', 'MEIAS', 
        'MEXER', 'MOLHO', 'MORAR', 'NOITE', 'NOVOS', 'OLHAR', 'ONTEM', 'PAIOL', 
        'PALMO', 'SUSTO', 'LOUÇA', 'PESAR', 'PODER', 'PORTA', 'PRATO', 'QUASE', 
        'QUILO', 'SABER', 'SALTO', 'SEGUE', 'SERRA', 'TARDE', 'TENDA', 'TERRA', 
        'TETOS', 'TODAS', 'TRIGO', 'TROCA', 'VELHO', 'VIRAR', 'VISTA', 'VULTO',
        'MISTO', 'ANTES', 'BOLSA', 'BRISA', 'CANTO', 'CIVIL', 'CLIMA', 'COISA',
        'DANÇA', 'DEUSA', 'FAROL', 'FICAR', 'FOCAR', 'FREIO', 'GIRAR', 'IDEAL',
        'IGUAL', 'IMPAR', 'ÍNDIO', 'JUNTA', 'LIMÃO', 'LINDA', 'LIVRO', 'LUGAR',
        'MANHA', 'MENTE', 'MOITA', 'MESMO', 'NINJA', 'NORTE', 'OUVIR', 'PADRE',
        'PASTA', 'PEDRA', 'PIANO', 'POEMA', 'POUCO', 'RADAR', 'RAIOS', 'RENDA',
        'RITMO', 'PLUMA', 'SALVE', 'SONHO', 'SORRI', 'MESAS', 'TEXTO', 'RESTO',
        'VALOR', 'VINHO', 'VIVER', 'ZEBRA', 'JOIAS', 'PONTE', 'DENSA', 'CONTO',
    ];
    
    // palavra selecionada aleatoriamente
    const targetWord = validWords[Math.floor(Math.random() * validWords.length)].toUpperCase();
    let currentRow = 0;
    let currentTile = 0;
    let isGameOver = false;
    
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    
    // cria o tabuleiro 6x5
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-state', 'empty');
            row.appendChild(tile);
        }
        
        board.appendChild(row);
    }
    
    const rows = document.querySelectorAll('.row');
    
    // adiciona eventos de teclado
    document.addEventListener('keydown', handleKeyPress);
    document.querySelectorAll('.keyboard button').forEach(button => {
        button.addEventListener('click', () => {
            const key = button.textContent;
            if (key === 'ENTER') {
                submitGuess();
            } else if (key === '⌫') {
                deleteLetter();
            } else {
                updateTile(key);
            }
        });
    });
    
    function handleKeyPress(e) {
        if (isGameOver) return;
        
        if (e.key === 'Enter') {
            submitGuess();
        } else if (e.key === 'Backspace') {
            deleteLetter();
        } else if (/^[A-Za-z]$/.test(e.key)) {
            updateTile(e.key.toUpperCase());
        }
    }
    
    function updateTile(letter) {
        if (currentTile > 4) return;
        
        const tile = rows[currentRow].children[currentTile];
        tile.textContent = letter;
        tile.setAttribute('data-state', 'active');
        currentTile++;
    }
    
    function deleteLetter() {
        if (currentTile === 0) return;
        
        currentTile--;
        const tile = rows[currentRow].children[currentTile];
        tile.textContent = '';
        tile.setAttribute('data-state', 'empty');
    }
    
    function submitGuess() {
        if (currentTile !== 5) {
            showMessage('Palavra deve ter 5 letras!', 'error');
            return;
        }
        
        const guess = Array.from(rows[currentRow].children)
            .map(tile => tile.textContent)
            .join('');
        
        checkGuess(guess);
    }
    
    function checkGuess(guess) {
        const rowTiles = rows[currentRow].children;
        const targetLetters = targetWord.split('');
        const guessLetters = guess.split('');
        
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                rowTiles[i].setAttribute('data-state', 'correct');
                updateKeyboard(guessLetters[i], 'correct');
                targetLetters[i] = null;
            }
        }
        
        for (let i = 0; i < 5; i++) {
            if (rowTiles[i].getAttribute('data-state') !== 'correct') {
                const index = targetLetters.indexOf(guessLetters[i]);
                if (index !== -1) {
                    rowTiles[i].setAttribute('data-state', 'present');
                    updateKeyboard(guessLetters[i], 'present');
                    targetLetters[index] = null; 
                } else {
                    rowTiles[i].setAttribute('data-state', 'absent');
                    updateKeyboard(guessLetters[i], 'absent');
                }
            }
        }
        
        // Verificar vitória
        if (guess === targetWord) {
            isGameOver = true;
            showMessage('Parabéns! Você acertou! 🎉', 'success');
            return;
        }
        
        // Verificar derrota
        currentRow++;
        currentTile = 0;
        
        if (currentRow === 6) {
            isGameOver = true;
            showMessage(`Game over! A palavra era: ${targetWord}`, 'error');
        }
    }
    
    function updateKeyboard(letter, state) {
        const keyboardButtons = document.querySelectorAll('.keyboard button');
        
        for (const button of keyboardButtons) {
            if (button.textContent === letter) {
                const currentState = button.getAttribute('data-state');

                if (currentState === null || 
                    (currentState === 'absent' && state !== 'absent') ||
                    (currentState === 'present' && state === 'correct')) {
                    button.setAttribute('data-state', state);
                }
                break;
            }
        }
    }
    
    function showMessage(text, type) {
        message.textContent = text;
        message.className = 'message ' + type;
        message.style.opacity = '1';
        
        setTimeout(() => {
            message.style.opacity = '0';
        }, 3000);
    }
});