const burgerMenu = document.querySelector('.main-nav__toggle');
const mobilemenu = document.querySelector('.main-nav__open');
const closeMenuButton = document.querySelector('.main-nav__open-button');

function openMenu() {
  mobilemenu.classList.remove('visually-hidden');
};

burgerMenu.addEventListener('click', openMenu);

function closeMenu() {
  mobilemenu.classList.add('visually-hidden');
}

closeMenuButton.addEventListener('click', closeMenu);
