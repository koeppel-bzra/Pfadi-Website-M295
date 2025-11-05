// Datenschutzerklärung 

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const button = document.getElementById('accept-btn');

    if (localStorage.getItem('cookiesAccepted')) {
        banner!.style.display = 'none';
    }

    button?.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner!.style.display = 'none';
        console.log("dini meutter");
    })
})








// Hamburger

const hamburger = document.querySelector<HTMLInputElement>('.hamburger');
const rightNav = document.querySelector<HTMLInputElement>('.right-nav');

hamburger?.addEventListener('click', () => {
    rightNav?.classList.toggle('open');
})

// Update Padding

function udpateMainPadding() {
    const header = document.querySelector<HTMLElement>('.top-nav');
    const main = document.querySelector<HTMLElement>('main');
    if (header && main) {
        main.style.paddingTop = `${header.offsetHeight}px`
    }
}

window.addEventListener('resize', udpateMainPadding);
window.addEventListener('load', udpateMainPadding);



// Scrollbar

let lastScrollY = window.scrollY;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
        navbar?.classList.remove('hide');
    }

    else if (currentScrollY > lastScrollY) {
        navbar?.classList.add('hide');
    }

    else if (currentScrollY < lastScrollY) {
        navbar?.classList.remove('hide');
    }

    lastScrollY = currentScrollY;
});



// Nach-Oben Button

const oben = document.querySelector<HTMLInputElement>('#nach-oben');

oben?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
})



// Slideshow

const bilder = ["../images/DSC_0039.webp", "../images/DSC_0088.webp", "../images/DSC_0103.webp"];
let index = 0;

const img = document.getElementById('slideshow-images') as HTMLImageElement;
const leftImage = document.getElementById('left-image') as HTMLImageElement;
const rightImage = document.getElementById('right-image') as HTMLImageElement;

leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];

setInterval(() => {
    index = (index + 1) % bilder.length;
    img.src = bilder[index];
    leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
    rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];

}, 8000);

const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');

backButton?.addEventListener('click', () => {
    index = (index - 1 + bilder.length ) % bilder.length;
    img.src = bilder[index];
    leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
    rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];
})

forwardButton?.addEventListener('click', () => {
    index = (index + 1 + bilder.length ) % bilder.length;
    img.src = bilder[index];
    leftImage.src = bilder[(index - 1 + bilder.length) % bilder.length];
    rightImage.src = bilder[(index + 1 + bilder.length) % bilder.length];
})

const lightbox = document.getElementById('lightbox') as HTMLElement;
const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
const closeBtn = lightbox.querySelector('.close') as HTMLElement;

function openLightbox(src: string) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
}

img.addEventListener('click', () => {
    openLightbox(img.src);
})

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
})

