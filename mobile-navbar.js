class MobileNavbar {
  constructor(mobileMenu, headerList, headerLinks) {
    this.mobileMenu  = document.querySelector(mobileMenu);
    this.headerList  = document.querySelector(headerList);
    this.headerLinks = document.querySelectorAll(headerLinks);
    this.activeClass = 'active';
    this.isOpen      = false;
  }

  animateLinks() {
    this.headerLinks.forEach((link, i) => {
      if (this.isOpen) {
        link.style.animation = `navLinkFade 0.4s ease forwards ${i * 0.1 + 0.2}s`;
      } else {
        link.style.animation = '';
      }
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.headerList.classList.toggle(this.activeClass, this.isOpen);
    this.mobileMenu.classList.toggle(this.activeClass, this.isOpen);
    this.animateLinks();
  }

  addClickEvent() {
    this.mobileMenu.addEventListener('click', () => this.toggleMenu());

    // Fecha o menu ao clicar em um link
    this.headerLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) this.toggleMenu();
      });
    });
  }

  init() {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  }
}

const mobileNavbar = new MobileNavbar(
  '.mobile-menu',
  '.header-links',
  '.header-links li'
);

mobileNavbar.init();
