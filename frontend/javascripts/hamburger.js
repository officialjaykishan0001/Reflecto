const hamburgerIco = document.getElementById("hamburger");
const hamburgerCancelIco = document.getElementById("hamburger-cancel-btn");
const hamburgerContent = document.getElementById("hamburger-content");

hamburgerIco.addEventListener('click', () => {
    hamburgerContent.classList.remove('hidden');
})
hamburgerCancelIco.addEventListener('click', () => {
    hamburgerContent.classList.add('hidden');
})