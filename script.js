document.addEventListener('DOMContentLoaded', () => {

    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.top-navbar'); // Get the navbar
    const navbarHeight = navbar ? navbar.offsetHeight : 0; // Get navbar height

    // --- Sidebar Toggle for Mobile (Optional) ---
    // ... (Mobile toggle code unchanged) ...

    // --- Smooth Scrolling & Scrollspy ---
    const sections = document.querySelectorAll('main section[id]');
    const tocLinks = document.querySelectorAll('.sidebar ul a[href^="#"]');

    // Smooth scroll - Adjusted Offset
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset = navbar height + desired extra space (e.g., 20px)
                const scrollOffset = navbarHeight + 20;
                const elementPosition = targetElement.getBoundingClientRect().top;
                // Calculate final position considering current scroll and offset
                const offsetPosition = elementPosition + window.pageYOffset - scrollOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scrollspy Logic - Adjusted Offset
    const activateTocLink = (id) => {
        // ... (Logic to activate link unchanged) ...
         let activeLinkFound = false;
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
                activeLinkFound = true;
                const linkRect = link.getBoundingClientRect();
                const sidebarRect = sidebar.getBoundingClientRect();
                if (linkRect.top < sidebarRect.top + 50 || linkRect.bottom > sidebarRect.bottom - 50) {
                     link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                }
            }
        });
    };

    const onScrollSpy = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        // Activation offset from the top of the viewport, considering navbar height
        const activationOffset = navbarHeight + (window.innerHeight * 0.2); // Activate when section top is 20% below navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop; // Use offsetTop for more reliable position relative to document
            const sectionHeight = section.offsetHeight;

            // Check if the top of the section is within the activation zone (relative to document top)
             if (scrollPosition >= sectionTop - activationOffset && scrollPosition < sectionTop + sectionHeight - activationOffset) {
                 currentSectionId = section.getAttribute('id');
            }
        });

         // Check edge cases (relative to document top)
         if (scrollPosition < activationOffset && sections.length > 0) { // Scrolled near top
             currentSectionId = sections[0].getAttribute('id');
         } else if (window.innerHeight + scrollPosition >= document.body.offsetHeight - 50 && sections.length > 0) { // Scrolled near bottom
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }

        if (currentSectionId) {
            activateTocLink(currentSectionId);
        } else {
            tocLinks.forEach(link => link.classList.remove('active'));
        }
    };


    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    function revealSections() {
        // ... (Reveal logic unchanged) ...
         const windowHeight = window.innerHeight;
        const elementVisibleThreshold = 80;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisibleThreshold) {
                el.classList.add('active');
            }
        });
    }

    // Combined scroll handler
    let scrollTimeout;
    function handleScroll() {
        onScrollSpy();
        revealSections();
    }
    window.addEventListener('scroll', () => {
        if (scrollTimeout) { window.cancelAnimationFrame(scrollTimeout); }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    }, { passive: true });
    handleScroll(); // Initial checks

    // --- Copy Button for Code Blocks ---
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        // ... (Copy button logic unchanged) ...
         button.addEventListener('click', () => {
            const wrapper = button.closest('.code-block-wrapper');
            const codeElement = wrapper.querySelector('pre code');
            const codeText = codeElement.innerText || codeElement.textContent;

            navigator.clipboard.writeText(codeText).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.classList.add('copied');
                setTimeout(() => {
                    button.innerHTML = '<i class="far fa-copy"></i>';
                    button.classList.remove('copied');
                }, 1500);
            }).catch(err => {
                console.error('Clipboard copy failed: ', err);
                button.innerText = 'Lỗi!';
                 setTimeout(() => {
                    button.innerHTML = '<i class="far fa-copy"></i>';
                }, 1500);
            });
        });
    });

}); // End DOMContentLoaded