const words = 'Despite growing tensions, everyone remained focused project timeline strategy involved several meetings discuss potential challenges solutions individual took responsibility their assigned tasks ensuring elements completed Although unexpected obstacles arose, adapted quickly modifying original blueprint. Throughout process, leaders encouraged innovation creative thinking, which contributed greatly overall success. midpoint,  deliverables  track, teamwork boosted confidence. Collaboration between departments seamless, communication tools allowing everyone updated real-time. production line remained efficient, and each phase operation was completed with precision. Leadership praised the outstanding efforts made by the employees, morale was higher than ever. Even when faced with logistical issues, the personnel remained determined achieve the deadline. final phase approached, there  anticipation. The reporting team ensured that all data analyzed compiled necessary presentations. The clientele impressed attention detail innovative approaches. Furthermore,  executives recognize the valuable contributions made each division. Productivity soared team pushed toward the final goal, knowing that their efforts would lead to long-term benefits. project concluded, there sense accomplishment among involved. outcome exceeded expectations, future looked even more promising. team delivered their commitments established framework future successes'.split(' ');
const wordsCount = words.length;
const gameTime = 60 * 1000;
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

function addClass(el,name) {
  el.className += ' '+name;
}
function removeClass(el,name) {
  el.className = el.className.replace(name,'');
}

function randomWord() {
  const randomIndex = Math.floor(Math.random() * wordsCount);
  return words[randomIndex];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  clearInterval(window.timer);  
  document.getElementById('words').innerHTML = '';  
  for (let i = 0; i < 200; i++) {
    document.getElementById('words').innerHTML += formatWord(randomWord()); 
  }
  addClass(document.querySelector('.word'), 'current');  
  addClass(document.querySelector('.letter'), 'current');  
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  window.timer = null;  
  removeClass(document.getElementById('game'), 'over');  
}


function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letters.filter(letter => letter.className.includes('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  const result = getWpm();
  document.getElementById('info').innerHTML = `WPM: ${result}`;
}

document.getElementById('game').addEventListener('keyup', ev => {
  const key = ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';

  if (!window.timer) {
    window.gameStart = Date.now(); 
    window.timer = setInterval(() => {
      const currentTime = Date.now();
      const msPassed = currentTime - window.gameStart;
      const sLeft = Math.round((gameTime / 1000) - (msPassed / 1000));
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = sLeft + '';
    }, 1000);
  }

  if (document.querySelector('#game.over')) {
    return;
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = 'letter incorrect extra';
      currentWord.appendChild(incorrectLetter);
    }
  }

  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect');
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current');
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
  }


  
  if (currentWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 35) + 'px';
  }

  
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
  clearInterval(window.timer);  
  window.timer = null;  
  window.gameStart = null;  
  window.pauseTime = 0;  
  document.getElementById('words').style.marginTop = '0px';  
  
  const letters = document.querySelectorAll('.letter');
  letters.forEach(letter => {
    letter.classList.remove('current', 'correct', 'incorrect', 'extra');
  });
  const words = document.querySelectorAll('.word');
  words.forEach(word => {
    word.classList.remove('current');
  });

  const cursor = document.getElementById('cursor');
  cursor.style.top = '198px'; 
  cursor.style.left = '18px'; 

  
  newGame();
});

newGame();
