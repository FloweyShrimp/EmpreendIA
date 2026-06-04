const mascot = document.querySelector('.mascot');

document.addEventListener('mousemove', (e)=>{

  const x = (window.innerWidth / 2 - e.pageX) / 40;
  const y = (window.innerHeight / 2 - e.pageY) / 40;

  mascot.style.transform = `translate(${x}px, ${y}px)`;

});