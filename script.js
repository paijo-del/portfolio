// ==========================================
// PORTFOLIO WEBSITE - MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // ELEMENT REFERENCES
    // ==========================================

    const header = document.querySelector(".site-header");
    const sections = document.querySelectorAll("main section");
    const navLinks = document.querySelectorAll(".site-header nav a");

    const revealElements = document.querySelectorAll(
        ".about, .skills, .portfolio, .contact"
    );

    const typingTarget = document.querySelector(".home-text h2 span");
    const heroImage = document.querySelector(".home-img img");

    const contactForm = document.querySelector(".contact-form");

    // ==========================================
    // STICKY HEADER
    // ==========================================

    function updateHeader() {
        if (!header) {
            return;
        }

        if (window.scrollY > 50) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });

    updateHeader();

    // ==========================================
    // ACTIVE NAVIGATION
    // ==========================================

    function updateActiveNavigation() {
        if (!sections.length || !navLinks.length) {
            return;
        }

        const scrollPosition = window.scrollY + 180;

        let currentSection = "home";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            const target = link.getAttribute("href");

            const isActive = target === `#${currentSection}`;

            link.classList.toggle("active", isActive);
        });
    }

    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    updateActiveNavigation();

    // ==========================================
    // SCROLL REVEAL
    // ==========================================

    if ("IntersectionObserver" in window && revealElements.length) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");

                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback untuk browser yang
        // tidak mendukung IntersectionObserver.

        revealElements.forEach(element => {
            element.classList.add("show");
        });
    }

    // ==========================================
    // TYPING EFFECT
    // ==========================================

    if (typingTarget) {
        const words = [
            "modern & responsive",
            "mudah digunakan",
            "profesional",
            "untuk berbagai kebutuhan"
        ];

        let wordIndex = 0;
        let characterIndex = 0;

        let deleting = false;

        const typingSpeed = 80;
        const deletingSpeed = 45;
        const pauseAfterWord = 1400;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (!deleting) {
                characterIndex++;

                typingTarget.textContent = currentWord.substring(
                    0,
                    characterIndex
                );

                if (characterIndex >= currentWord.length) {
                    deleting = true;

                    setTimeout(typeEffect, pauseAfterWord);

                    return;
                }

                setTimeout(typeEffect, typingSpeed);
            } else {
                characterIndex--;

                typingTarget.textContent = currentWord.substring(
                    0,
                    characterIndex
                );

                if (characterIndex <= 0) {
                    characterIndex = 0;

                    deleting = false;

                    wordIndex = (wordIndex + 1) % words.length;
                }

                setTimeout(typeEffect, deletingSpeed);
            }
        }

        // Jangan menjalankan animasi typing
        // jika user memilih reduced motion.

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) {
            typingTarget.textContent = words[0];
        } else {
            typeEffect();
        }
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    // ==========================================
    // HERO IMAGE PARALLAX
    // ==========================================

    // Hanya aktif pada perangkat yang
    // memiliki mouse/pointer yang akurat.
    //
    // Ini sengaja tidak dijalankan pada
    // sebagian besar perangkat mobile.

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (heroImage && finePointer) {
        let animationFrame = null;

        function handlePointerMove(event) {
            if (animationFrame) {
                return;
            }

            animationFrame = requestAnimationFrame(() => {
                const x = (window.innerWidth / 2 - event.clientX) / 70;

                const y = (window.innerHeight / 2 - event.clientY) / 70;

                heroImage.style.transform = `translate3d(${x}px, ${y}px, 0)`;

                animationFrame = null;
            });
        }

        function resetParallax() {
            heroImage.style.transform = "";
        }

        window.addEventListener("mousemove", handlePointerMove, {
            passive: true
        });

        window.addEventListener("mouseleave", resetParallax);
    }

    // ==========================================
    // CONTACT FORM
    // ==========================================

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = contactForm.elements.name?.value.trim();

            const email = contactForm.elements.email?.value.trim();

            const message = contactForm.elements.message?.value.trim();

            if (!name || !email || !message) {
                alert("Mohon isi semua bagian formulir.");

                return;
            }

            // Saat ini form belum terhubung
            // ke backend/email service.
            //
            // Untuk tahap portfolio:
            // kita tampilkan feedback terlebih dahulu.

            alert(
                `Terima kasih, ${name}! Pesan kamu sudah diisi dengan lengkap.`
            );

            contactForm.reset();
        });
    }

    // ==========================================
    // PARTICLES BACKGROUND
    // ==========================================

    function initializeParticles() {
        if (
            typeof particlesJS === "undefined" ||
            !document.getElementById("particles-js")
        ) {
            return;
        }

        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        particlesJS("particles-js", {
            particles: {
                number: {
                    value: isMobile ? 25 : 40,

                    density: {
                        enable: true,
                        value_area: 900
                    }
                },

                color: {
                    value: "#00d9ff"
                },

                shape: {
                    type: "circle"
                },

                opacity: {
                    value: 0.25,

                    random: true
                },

                size: {
                    value: isMobile ? 2 : 3,

                    random: true
                },

                line_linked: {
                    enable: !isMobile,

                    distance: 140,

                    color: "#00d9ff",

                    opacity: 0.12,

                    width: 1
                },

                move: {
                    enable: true,

                    speed: isMobile ? 0.6 : 1,

                    direction: "none",

                    random: true,

                    straight: false,

                    out_mode: "out",

                    bounce: false
                }
            },

            interactivity: {
                detect_on: "canvas",

                events: {
                    onhover: {
                        enable: !isMobile,

                        mode: "grab"
                    },

                    onclick: {
                        enable: false
                    },

                    resize: true
                }
            },

            retina_detect: true
        });
    }

    initializeParticles();

    // ==========================================
    // CONSOLE MESSAGE
    // ==========================================

    console.log("Riki Yakup Portfolio — Website loaded successfully.");
});
