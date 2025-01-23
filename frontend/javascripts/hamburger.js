const hamburgerIco = document.getElementById("hamburger");
const hamburgerCancelIco = document.getElementById("hamburger-cancel-btn");
const hamburgerContent = document.getElementById("hamburger-content");

hamburgerIco.addEventListener('click', () => {
    hamburgerContent.style.right = '0'
})
hamburgerCancelIco.addEventListener('click', () => {
    hamburgerContent.style.right = '-80%'
})