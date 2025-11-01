
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import imagesLoaded from "imagesloaded";

gsap.registerPlugin(ScrollTrigger);

// Yeh master timeline hai, saare animations iske andar hain
const master = gsap.timeline();

// Navbar ka hide/show animation jab scroll karein
let lastScrollY = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Agar neeche scroll kar rahe hain aur 100px se zyada scroll ho gaya
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Navbar ko hide karo
        gsap.to(navbar, {
            y: -100,
            duration: 0.3,
            ease: "power2.out"
        });
    } 
    // Agar upar scroll kar rahe hain
    else if (currentScrollY < lastScrollY) {
        // Navbar ko wapas show karo
        gsap.to(navbar, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    lastScrollY = currentScrollY;
});

// Navbar items ka load animation
gsap.from('.navbar-logo', {
    opacity: 0,
    y: -20,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.2
});

gsap.from('.navbar-menu li', {
    opacity: 0,
    y: -20,
    duration: 0.6,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.4
});

// Mobile menu toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
        
        // Menu toggle icon ka animation
        const spans = menuToggle.querySelectorAll('span');
        if (navbarMenu.classList.contains('active')) {
            gsap.to(spans[0], { rotation: 45, y: 8, duration: 0.3 });
            gsap.to(spans[1], { opacity: 0, duration: 0.3 });
            gsap.to(spans[2], { rotation: -45, y: -8, duration: 0.3 });
        } else {
            gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(spans[1], { opacity: 1, duration: 0.3 });
            gsap.to(spans[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    });
}

// Hero section ke load-in animations
const heroImage = document.querySelector('.deadpool-image');

imagesLoaded(heroImage, () => {
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl.from(".red-circle", {
        scale: 0,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)"
    }, "-=0.7");

    heroTl.from(".movie-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    }, "-=0.8");

    heroTl.from(".deadpool-image", {
        y: 150,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.7");
});



// Scroll karne par trigger hone wale animations
gsap.from(".projects-section .section-title", {
    scrollTrigger: {
        trigger: ".projects-section",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
});

gsap.from(".carousel-container", {
    scrollTrigger: {
        trigger: ".carousel-container",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1.0,
    ease: "power3.out"
});

gsap.from(".skills-section .section-title", {
    scrollTrigger: {
        trigger: ".skills-section",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
});

gsap.from(".skills-carousel", {
    scrollTrigger: {
        trigger: ".skills-carousel",
        start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1.0,
    ease: "power3.out"
});

// Skills carousel animation
const skillsGrid = document.querySelector('.skills-grid');
const skillItems = Array.from(skillsGrid.children);

skillItems.forEach(item => {
    const clone = item.cloneNode(true);
    skillsGrid.appendChild(clone);
});

const skillsTl = gsap.timeline({ repeat: -1, defaults: { ease: 'linear' } });
skillsTl.to(skillsGrid, { xPercent: -50, duration: 20 });

// Footer summary bar ka animation
master.from(".story-snippet", {
    x: -80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "-=0.5");

master.from(".booking-controls", {
    x: 80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
}, "<");

// Book now button par hover effect
const bookNowButton = document.querySelector('.book-now-btn');
if (bookNowButton) {
    bookNowButton.addEventListener('mouseenter', () => {
        gsap.to(bookNowButton, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    bookNowButton.addEventListener('mouseleave', () => {
        gsap.to(bookNowButton, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
}



