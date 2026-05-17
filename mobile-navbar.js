class MobileNavbar {
  constructor(mobileMenu, headerLists, headerLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.headerLists = document.querySelector(headerLists);
    this.headerLinks = document.querySelectorAll(headerLinks);
    this.activeClass = "active";
  }

  addClickEvent() {
    this.mobileMenu.addEventListener("click", () =>
      console.log("Hey🕺🕺")
    );
  }

  init() {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  }
}

const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".header-links",
  ".header-links li"
);

mobileNavbar.init();