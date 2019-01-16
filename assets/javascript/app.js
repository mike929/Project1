function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  if (!audio) return; // stop function from running for undefined keys
  audio.currentTime = 0; // rewind audio to the start
  audio.play();
  key.classList.add('playing');

}

// =================================================
// NOTE: PAUL MOVED THIS TO DASHBOARD CONTROLLER ab useds JQUERY FOR CARD FLIPPING
// var card = document.querySelector('.cardR');
// card.addEventListener('click', function () {
//   card.classList.toggle('is-flipped');
//   console.log('is-flipped');
// });
// =================================================

// TURNING THIS BLOCK OF CODE INTO A FUNCTION - playSound
// window.addEventListener('keydown', function (e) {
//   // console.log(e.keyCode); to see the keycodes of keys
//   const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
//   const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

//   // console.log(audio);  press key to see if it has audio class
//   if (!audio) return; // stop function from running for undefined keys
//   audio.currentTime = 0; // rewind audio to the start
//   audio.play();
//   // console.log(key);
//   key.classList.add('playing');
// });

function removeTransition(e) {
  // console.log(e);
  if (e.propertyName !== 'transform') return; // skip it if it's not a transform
  // console.log(e.propertyName);
  // console.log(this);  HOW TO FIND OUT WHAT THIS IS equal TO
  this.classList.remove('playing');
}



const keys = document.querySelectorAll('.key');
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', playSound);