// Asset paths (relative to index.html)
const song1Url = 'assets/song1.mp3';
const song2Url = 'assets/song2.mp3';
const yesSongUrl = 'assets/yes-song.mp3';
const walkSoundUrl = 'assets/walk.wav';
const stompSoundUrl = 'assets/stomp.wav';
const kittyPeekUrl = 'assets/kitty-peek.png';
const kittyWalkUrl = 'assets/kitty-walk.gif';
const kittyJumpUrl = 'assets/kitty-jump.png';
const cloudGifUrl = 'assets/cloud.gif';
const fireworkGifUrl = 'assets/firework.gif';
const bubbleGifUrl = 'assets/bubble.gif';

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const result = document.getElementById('result');

let kittyBusy = false;

// Store button positions (set on page load)
let yesBtnX, yesBtnY, yesBtnW, yesBtnH;
let noBtnX, noBtnY, noBtnW, noBtnH;

// Lock both buttons on page load
window.addEventListener('load', () => {
  // Capture BOTH positions first before changing anything
  const yesRect = yesBtn.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  yesBtnX = yesRect.left;
  yesBtnY = yesRect.top;
  yesBtnW = yesRect.width;
  yesBtnH = yesRect.height;

  noBtnX = noRect.left;
  noBtnY = noRect.top;
  noBtnW = noRect.width;
  noBtnH = noRect.height;

  // Now apply fixed positioning to both
  yesBtn.style.position = 'fixed';
  yesBtn.style.left = yesBtnX + 'px';
  yesBtn.style.top = yesBtnY + 'px';
  yesBtn.style.width = yesBtnW + 'px';
  yesBtn.style.height = yesBtnH + 'px';

  noBtn.style.position = 'fixed';
  noBtn.style.left = noBtnX + 'px';
  noBtn.style.top = noBtnY + 'px';
  noBtn.style.width = noBtnW + 'px';
  noBtn.style.height = noBtnH + 'px';
});

// Background music - shuffle on each reload
const songs = [song1Url, song2Url];
for (let i = songs.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [songs[i], songs[j]] = [songs[j], songs[i]];
}
let currentSongIndex = 0;
const bgMusic = new Audio(songs[currentSongIndex]);
bgMusic.volume = 0.3;

function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  bgMusic.src = songs[currentSongIndex];
  bgMusic.play();
}

bgMusic.addEventListener('ended', () => {
  setTimeout(playNextSong, 1500);
});

// Study guide overlay - click to reveal Valentine's page
const studyOverlay = document.getElementById('studyOverlay');
studyOverlay.addEventListener('click', () => {
  studyOverlay.classList.add('hidden');
  bgMusic.play();
  startPeekingKitty();
});

// Peeking Hello Kitty
let kittyPeek = document.getElementById('kittyPeek');
let peekInterval = null;
let peekTimeout = null;
let kittyFallen = false;
let currentPeekSide = 'left';

function startPeekingKitty() {
  // First peek after a short delay
  setTimeout(() => {
    if (!kittyBusy && !kittyFallen) peekKitty();
  }, 2000);

  peekInterval = setInterval(() => {
    if (!kittyBusy && !kittyFallen) {
      peekKitty();
    }
  }, 4000 + Math.random() * 3000); // Random 4-7 seconds
}

function peekKitty() {
  if (!kittyPeek) return;

  // Random side (left, right, or top)
  const sides = ['left', 'right', 'top'];
  currentPeekSide = sides[Math.floor(Math.random() * sides.length)];

  // Teleport: disable transition, set position, re-enable transition
  kittyPeek.style.transition = 'none';
  kittyPeek.className = 'kitty-peek ' + currentPeekSide;

  // Clear previous inline position styles before setting new ones
  kittyPeek.style.top = '';
  kittyPeek.style.left = '';
  kittyPeek.style.right = '';

  // Random position along the side
  if (currentPeekSide === 'left' || currentPeekSide === 'right') {
    // Random vertical position (10% to 70% of screen height)
    const randomY = 10 + Math.random() * 60;
    kittyPeek.style.top = randomY + '%';
  } else {
    // Top: random horizontal position (10% to 80% of screen width)
    const randomX = 10 + Math.random() * 70;
    kittyPeek.style.left = randomX + '%';
  }

  // Force reflow to apply the teleport instantly
  kittyPeek.offsetHeight;

  // Re-enable transition for the peek animation
  kittyPeek.style.transition = '';

  // Peek in
  setTimeout(() => {
    kittyPeek.classList.add('peek');
  }, 50);

  // Hide after 1.5-2.5 seconds
  peekTimeout = setTimeout(() => {
    kittyPeek.classList.remove('peek');
  }, 1500 + Math.random() * 1000);
}

function resetKittyPeek() {
  // Recreate the kitty peek element
  const newKitty = document.createElement('img');
  newKitty.src = kittyPeekUrl;
  newKitty.className = 'kitty-peek left';
  newKitty.id = 'kittyPeek';
  // Set initial position off-screen (CSS only sets left, not top)
  newKitty.style.top = '50%';
  document.body.appendChild(newKitty);
  kittyPeek = newKitty;
  kittyFallen = false;

  // Re-attach click listener
  kittyPeek.addEventListener('click', handleKittyClick);

  // Trigger a new peek after a short delay
  setTimeout(() => {
    if (!kittyFallen) peekKitty();
  }, 1000);
}

function handleKittyClick(e) {
  e.stopPropagation();
  if (kittyFallen) return;
  kittyFallen = true;

  // Stop current peek
  if (peekTimeout) clearTimeout(peekTimeout);

  // Get current position
  const rect = kittyPeek.getBoundingClientRect();
  let posX = rect.left;
  let posY = rect.top;

  // Set initial velocity based on which side she's peeking from
  let velX, velY;
  if (currentPeekSide === 'left') {
    velX = 12;
    velY = -8;
  } else if (currentPeekSide === 'right') {
    velX = -12;
    velY = -8;
  } else { // top
    velX = (Math.random() - 0.5) * 10;
    velY = 5;
  }

  const gravity = 0.6;
  let rotation = 0;

  // Remove CSS classes and set manual positioning
  kittyPeek.className = '';
  kittyPeek.style.transition = 'none';
  kittyPeek.style.position = 'fixed';
  kittyPeek.style.left = posX + 'px';
  kittyPeek.style.top = posY + 'px';
  kittyPeek.style.right = 'auto';
  kittyPeek.style.transform = 'none';
  kittyPeek.style.cursor = 'default';
  kittyPeek.style.width = '80px';

  const fall = setInterval(() => {
    velY += gravity;
    posX += velX;
    posY += velY;
    rotation += 8;

    kittyPeek.style.left = posX + 'px';
    kittyPeek.style.top = posY + 'px';
    kittyPeek.style.transform = `rotate(${rotation}deg)`;

    if (posY > window.innerHeight + 100) {
      clearInterval(fall);
      kittyPeek.remove();

      // Respawn after a delay
      setTimeout(resetKittyPeek, 3000);
    }
  }, 20);
}

// Attach initial click listener
kittyPeek.addEventListener('click', handleKittyClick);

// Sound effects
const walkSound = new Audio(walkSoundUrl);
walkSound.volume = 0.5;
walkSound.loop = true;

const stompSound = new Audio(stompSoundUrl);
stompSound.volume = 0.6;

function playWalk() {
  walkSound.currentTime = 0;
  walkSound.play();
}

function stopWalk() {
  walkSound.pause();
  walkSound.currentTime = 0;
}

function playStomp() {
  const stomp = stompSound.cloneNode();
  stomp.volume = 0.6;
  stomp.play();
}

// BGM fade
const normalVolume = 0.3;
let fadeInterval = null;

function fadeBgmOut() {
  if (fadeInterval) clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    if (bgMusic.volume > 0.05) {
      bgMusic.volume -= 0.03;
    } else {
      bgMusic.volume = 0;
      clearInterval(fadeInterval);
    }
  }, 50);
}

function fadeBgmIn() {
  if (fadeInterval) clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    if (bgMusic.volume < normalVolume) {
      bgMusic.volume += 0.03;
    } else {
      bgMusic.volume = normalVolume;
      clearInterval(fadeInterval);
    }
  }, 50);
}

// Bubble animation
function spawnBubble() {
  const bubble = document.createElement('img');
  bubble.src = bubbleGifUrl;
  bubble.style.position = 'fixed';
  bubble.style.width = '60px';
  bubble.style.height = '60px';
  bubble.style.pointerEvents = 'none';
  bubble.style.zIndex = '1002';
  bubble.style.left = (noBtnX + noBtnW / 2 - 30 + (Math.random() - 0.5) * 120) + 'px';
  bubble.style.top = (noBtnY + noBtnH / 2 - 30 + (Math.random() - 0.5) * 80) + 'px';
  document.body.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1000);
}

// No button click handler
noBtn.addEventListener('click', takeButtonAway);

function takeButtonAway() {
  if (kittyBusy) return;
  kittyBusy = true;

  fadeBgmOut();
  setTimeout(returnButton, 10000);

  // Create Hello Kitty - position exactly above No button (touching)
  const kitty = document.createElement('img');
  kitty.src = kittyWalkUrl;
  kitty.style.position = 'fixed';
  kitty.style.width = '80px';
  kitty.style.top = (noBtnY - 80) + 'px';
  kitty.style.left = '-100px';
  kitty.style.zIndex = '1001';
  document.body.appendChild(kitty);

  const targetX = noBtnX + (noBtnW / 2) - 40;
  const kittyRestY = noBtnY - 80;

  // Walk in
  let currentX = -100;
  playWalk();
  const walkIn = setInterval(() => {
    currentX += 5;
    kitty.style.left = currentX + 'px';
    if (currentX >= targetX) {
      clearInterval(walkIn);
      stopWalk();
      pauseThenJump();
    }
  }, 20);

  function pauseThenJump() {
    // Switch to jump image and pause for 0.4 seconds
    const jumpKitty = document.createElement('img');
    jumpKitty.src = kittyJumpUrl;
    jumpKitty.style.position = 'fixed';
    jumpKitty.style.width = '80px';
    jumpKitty.style.top = kitty.style.top;
    jumpKitty.style.left = kitty.style.left;
    jumpKitty.style.zIndex = '1001';
    kitty.replaceWith(jumpKitty);
    setTimeout(() => startJumping(jumpKitty), 400);
  }

  function startJumping(frozenKitty) {
    let jumpCount = 0;
    const maxJumps = 4;
    let buttonShake = 0;
    let kittyY = kittyRestY;

    function doJump() {
      jumpCount++;
      let jumpPhase = 0;

      const jump = setInterval(() => {
        jumpPhase += 0.2;
        const jumpOffset = Math.sin(jumpPhase) * 80;
        kittyY = kittyRestY - jumpOffset;
        frozenKitty.style.top = kittyY + 'px';

        if (jumpPhase >= Math.PI) {
          clearInterval(jump);
          playStomp();
          buttonShake += 3;
          noBtn.style.left = (noBtnX + (Math.random() - 0.5) * buttonShake) + 'px';
          noBtn.style.top = (noBtnY + jumpCount * 2) + 'px';

          if (jumpCount < maxJumps) {
            setTimeout(doJump, 200);
          } else {
            fallOff(frozenKitty);
          }
        }
      }, 15);
    }
    doJump();
  }

  function fallOff(frozenKitty) {
    let fallSpeed = 0;
    let kittyY = parseFloat(frozenKitty.style.top);
    let btnY = parseFloat(noBtn.style.top);

    const fall = setInterval(() => {
      fallSpeed += 2;
      kittyY += fallSpeed;
      btnY += fallSpeed;
      frozenKitty.style.top = kittyY + 'px';
      noBtn.style.top = btnY + 'px';

      if (kittyY > window.innerHeight + 100) {
        clearInterval(fall);
        frozenKitty.remove();
        noBtn.style.display = 'none';
      }
    }, 15);
  }

  function returnButton() {
    fadeBgmIn();
    noBtn.style.display = '';
    noBtn.style.left = noBtnX + 'px';
    noBtn.style.top = noBtnY + 'px';
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnBubble, i * 100);
    }
    kittyBusy = false;
  }
}

// Yes button impatient hover effect
let yesHoverInterval = null;
let yesHoverTime = 0;
const maxScale = 1.4;
const maxShake = 5;
const growthDuration = 3000; // Time to reach max size (ms)

yesBtn.addEventListener('mouseenter', () => {
  yesHoverTime = 0;
  yesHoverInterval = setInterval(() => {
    yesHoverTime += 20;

    // Negative acceleration growth (ease out)
    const progress = Math.min(yesHoverTime / growthDuration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

    const scale = 1 + (maxScale - 1) * easedProgress;

    // Shake starts very small and grows (ease in - starts slow)
    const shakeProgress = Math.pow(progress, 2); // Quadratic ease in for shake
    const shake = maxShake * shakeProgress;

    // Random shake offset
    const shakeX = (Math.random() - 0.5) * shake * 2;
    const shakeY = (Math.random() - 0.5) * shake * 2;

    yesBtn.style.transform = `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`;
    yesBtn.style.boxShadow = `0 ${5 + easedProgress * 10}px ${20 + easedProgress * 20}px rgba(201, 24, 74, ${0.3 + easedProgress * 0.3})`;
  }, 20);
});

yesBtn.addEventListener('mouseleave', () => {
  if (yesHoverInterval) {
    clearInterval(yesHoverInterval);
    yesHoverInterval = null;
  }
  yesBtn.style.transform = '';
  yesBtn.style.boxShadow = '';
});

// Victory song
const yesSong = new Audio(yesSongUrl);
yesSong.volume = 0;

// Yes button click
yesBtn.addEventListener('click', function() {
  // Clear hover effect
  if (yesHoverInterval) {
    clearInterval(yesHoverInterval);
    yesHoverInterval = null;
  }
  yesBtn.style.transform = '';
  yesBtn.style.boxShadow = '';

  result.innerHTML = '<div class="celebration">Yay!! ♥♥♥</div>';
  noBtn.style.display = 'none';
  yesBtn.style.display = 'none';

  // Stop peeking kitty
  if (peekInterval) clearInterval(peekInterval);
  if (peekTimeout) clearTimeout(peekTimeout);
  if (kittyPeek) kittyPeek.remove();

  // Fade out BGM, fade in victory song
  fadeBgmOut();
  yesSong.play().catch(() => {}); // Ignore autoplay errors
  let yesSongFadeIn = setInterval(() => {
    if (yesSong.volume < 0.3) {
      yesSong.volume += 0.02;
    } else {
      yesSong.volume = 0.3;
      clearInterval(yesSongFadeIn);
    }
  }, 50);

  // Move clouds off screen
  const clouds = document.querySelectorAll('.cloud');
  const screenCenter = window.innerWidth / 2;
  clouds.forEach(cloud => {
    const cloudCenter = parseFloat(cloud.style.left) + cloud.offsetWidth / 2;
    if (cloudCenter < screenCenter) {
      cloud.classList.add('exit-left');
    } else {
      cloud.classList.add('exit-right');
    }
  });

  // Slide in sonny angels
  const sonnyContainer = document.querySelector('.sonny-container');
  sonnyContainer.classList.add('visible');

  // Start individual jumping animations after slide-in
  setTimeout(() => {
    const sonnys = document.querySelectorAll('.sonny');
    sonnys.forEach((sonny, index) => {
      const duration = 0.4 + Math.random() * 0.3; // 0.4-0.7s
      const delay = index * 0.1 + Math.random() * 0.2; // staggered + random
      sonny.style.animation = `sonnyJump ${duration}s ease-in-out ${delay}s infinite`;
    });
  }, 800); // Wait for slide-in

  // Spawn fireworks
  spawnFireworks();

  // Create exit button
  const exitBtn = document.createElement('img');
  exitBtn.src = 'assets/exit-btn.png';
  exitBtn.className = 'exit-btn';
  exitBtn.title = 'Return to main screen';
  document.body.appendChild(exitBtn);

  exitBtn.addEventListener('click', exitVictoryScreen);
});

function spawnFireworks() {
  const fireworkCount = 4 + Math.floor(Math.random() * 2); // 4-5 fireworks
  const sectionWidth = window.innerWidth / fireworkCount;

  for (let i = 0; i < fireworkCount; i++) {
    const delay = i * 200 + Math.random() * 300; // Staggered appearance
    setTimeout(() => spawnFirework(i, sectionWidth), delay);
  }
}

function spawnFirework(index, sectionWidth) {
  const firework = document.createElement('img');
  firework.src = fireworkGifUrl;
  firework.className = 'firework';

  // Random size between 150px and 250px
  const size = 150 + Math.random() * 100;
  firework.style.width = size + 'px';

  // Position within assigned section (evenly spaced), upper 45% of screen
  const sectionStart = index * sectionWidth;
  const left = sectionStart + Math.random() * (sectionWidth - size);
  const top = Math.random() * (window.innerHeight * 0.45);
  firework.style.left = Math.max(0, left) + 'px';
  firework.style.top = Math.max(0, top) + 'px';

  // Random delay to offset GIF animation cycles
  const delay = Math.random() * 1500;
  setTimeout(() => document.body.appendChild(firework), delay);
}


// Spawn clouds on page load
window.addEventListener('load', () => {
  const cloudCount = 3 + Math.floor(Math.random() * 2); // 3-4 clouds
  const sectionWidth = window.innerWidth / cloudCount;

  for (let i = 0; i < cloudCount; i++) {
    spawnCloud(i, sectionWidth);
  }
});

function spawnCloud(index, sectionWidth) {
  const cloud = document.createElement('img');
  cloud.src = cloudGifUrl;
  cloud.className = 'cloud';

  // Random size between 120px and 280px
  const size = 120 + Math.random() * 160;
  cloud.style.width = size + 'px';

  // Position within assigned section (evenly spaced), upper 35% of screen
  const sectionStart = index * sectionWidth;
  const left = sectionStart + Math.random() * (sectionWidth - size);
  const top = Math.random() * (window.innerHeight * 0.35);
  cloud.style.left = Math.max(0, left) + 'px';
  cloud.style.top = Math.max(0, top) + 'px';

  // Random delay to offset GIF animation cycles
  const delay = Math.random() * 2000;
  setTimeout(() => document.body.appendChild(cloud), delay);
}

// Exit victory screen and return to main
function exitVictoryScreen() {
  // Remove exit button
  const exitBtn = document.querySelector('.exit-btn');
  if (exitBtn) exitBtn.remove();

  // Clear celebration message
  result.innerHTML = '';

  // Show buttons again
  yesBtn.style.display = '';
  noBtn.style.display = '';

  // Remove all fireworks
  document.querySelectorAll('.firework').forEach(fw => fw.remove());

  // Hide sonny angels and stop their animations
  const sonnyContainer = document.querySelector('.sonny-container');
  sonnyContainer.classList.remove('visible');
  document.querySelectorAll('.sonny').forEach(sonny => {
    sonny.style.animation = '';
  });

  // Bring clouds back
  document.querySelectorAll('.cloud').forEach(cloud => {
    cloud.classList.remove('exit-left', 'exit-right');
  });

  // Fade out victory song, fade in BGM
  let yesSongFadeOut = setInterval(() => {
    if (yesSong.volume > 0.02) {
      yesSong.volume -= 0.02;
    } else {
      yesSong.volume = 0;
      yesSong.pause();
      yesSong.currentTime = 0;
      clearInterval(yesSongFadeOut);
    }
  }, 50);
  fadeBgmIn();

  // Restart peeking kitty
  kittyFallen = false;
  resetKittyPeek();
  if (peekInterval) clearInterval(peekInterval);
  peekInterval = setInterval(() => {
    if (!kittyBusy && !kittyFallen) {
      peekKitty();
    }
  }, 4000 + Math.random() * 3000);
}
