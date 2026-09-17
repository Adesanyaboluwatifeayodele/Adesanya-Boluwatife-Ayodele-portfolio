(() => {
    "use strict";

    /* =========================================
       BASIC HELPERS
    ========================================= */

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];


    /* =========================================
       MAIN ELEMENTS
    ========================================= */

    const header = $("#site-header");
    const progress = $(".progress-bar span");
    const nav = $("#primary-nav");
    const menu = $(".menu-button");
    const body = document.body;


    /* =========================================
       HEADER SCROLL EFFECT
       
       Top of page:
       - darker / stronger header

       While scrolling:
       - normal portfolio header
       - subtle shadow
    ========================================= */

    const handleScroll = () => {

        const isScrolled = window.scrollY > 18;

        if (header) {
            header.classList.toggle(
                "scrolled",
                isScrolled
            );
        }


        /* Scroll progress */

        if (progress) {

            const maxScroll =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percentage =
                maxScroll > 0
                    ? Math.min(
                        100,
                        (window.scrollY / maxScroll) * 100
                    )
                    : 0;

            progress.style.width =
                `${percentage}%`;
        }
    };


    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    handleScroll();


    /* =========================================
       ACTIVE NAVIGATION
    ========================================= */

    const currentPage =
        document.documentElement.dataset.page;

    $$("[data-nav]").forEach(link => {

        if (
            currentPage &&
            link.dataset.nav === currentPage
        ) {

            link.classList.add("is-active");

            link.setAttribute(
                "aria-current",
                "page"
            );
        }
    });


    /* =========================================
       MOBILE NAVIGATION
    ========================================= */

    const closeMenu = () => {

        nav?.classList.remove("is-open");

        menu?.classList.remove("is-open");

        menu?.setAttribute(
            "aria-expanded",
            "false"
        );

        body.classList.remove(
            "menu-open"
        );
    };


    if (menu && nav) {

        menu.addEventListener(
            "click",
            () => {

                const isOpen =
                    nav.classList.toggle(
                        "is-open"
                    );

                menu.classList.toggle(
                    "is-open",
                    isOpen
                );

                menu.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

                body.classList.toggle(
                    "menu-open",
                    isOpen
                );
            }
        );


        $$("a", nav).forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );
        });
    }


    /* =========================================
       CLOSE MOBILE MENU WHEN RESIZING
    ========================================= */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 760) {
                closeMenu();
            }
        }
    );


    /* =========================================
       ESCAPE KEY
    ========================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMenu();
                closeModal();
            }
        }
    );


    /* =========================================
       SCROLL REVEAL ANIMATIONS
    ========================================= */

    const revealElements =
        $$(".reveal");


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.1,
                    rootMargin:
                        "0px 0px -30px"
                }
            );


        revealElements.forEach(
            (element, index) => {

                element.style.transitionDelay =
                    `${Math.min(
                        index % 5,
                        4
                    ) * 70}ms`;

                observer.observe(
                    element
                );
            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );
            }
        );
    }


    /* =========================================
       PROJECT FILTERS
    ========================================= */

    const filters =
        $$(".filter-button");

    const projectRows =
        $$(".project-row");

    const projectCount =
        $("[data-project-count]");


    if (
        filters.length &&
        projectRows.length
    ) {

        const applyFilter =
            filter => {

                let count = 0;


                projectRows.forEach(
                    row => {

                        const matches =
                            filter === "all" ||
                            row.dataset.category ===
                            filter;

                        row.classList.toggle(
                            "hidden-filter",
                            !matches
                        );

                        if (matches) {
                            count++;
                        }
                    }
                );


                if (projectCount) {

                    projectCount.textContent =
                        `${count} project${count === 1
                            ? ""
                            : "s"
                        }`;
                }
            };


        filters.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    filters.forEach(
                        item =>
                            item.classList.remove(
                                "is-active"
                            )
                    );


                    button.classList.add(
                        "is-active"
                    );


                    applyFilter(
                        button.dataset.filter ||
                        "all"
                    );
                }
            );
        });


        /* Show all projects initially */

        applyFilter("all");
    }


    /* =========================================
       IMAGE MODAL
    ========================================= */

    const modal =
        $("#image-modal");

    const modalImage =
        $("#modal-image");

    const modalCaption =
        $("#modal-caption");


    function closeModal() {

        if (!modal) return;


        modal.classList.remove(
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        body.style.overflow = "";


        if (modalImage) {
            modalImage.removeAttribute(
                "src"
            );
        }
    }


    $$("[data-image]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        !modal ||
                        !modalImage
                    ) {
                        return;
                    }


                    const image =
                        button.dataset.image;

                    const caption =
                        button.dataset.caption ||
                        "Project preview";


                    modalImage.src =
                        image;

                    modalImage.alt =
                        caption;


                    if (modalCaption) {
                        modalCaption.textContent =
                            caption;
                    }


                    modal.classList.add(
                        "show"
                    );

                    modal.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                    body.style.overflow =
                        "hidden";
                }
            );
        }
    );


    $(".modal-close")?.addEventListener(
        "click",
        closeModal
    );


    modal?.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {
                closeModal();
            }
        }
    );


    /* =========================================
       COPY EMAIL
    ========================================= */

    const toast =
        $("#toast");

    let toastTimer;


    const showToast =
        message => {

            if (!toast) return;


            toast.textContent =
                message;

            toast.classList.add(
                "show"
            );


            clearTimeout(
                toastTimer
            );


            toastTimer =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    2600
                );
        };


    $$("[data-copy-email]").forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard.writeText(
                            "adesanyaoloruntoba@gmail.com"
                        );

                        showToast(
                            "Email copied to clipboard."
                        );

                    } catch {

                        window.location.href =
                            "mailto:adesanyaoloruntoba@gmail.com";
                    }
                }
            );
        }
    );


    /* =========================================
       CONTACT FORM
    ========================================= */

    const form =
        $("#contact-form");

    const formStatus =
        $("#form-status");


    form?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(form);


            const name =
                String(
                    formData.get("name") ||
                    ""
                ).trim();


            const email =
                String(
                    formData.get("email") ||
                    ""
                ).trim();


            const type =
                String(
                    formData.get("type") ||
                    "Website"
                );


            const message =
                String(
                    formData.get("message") ||
                    ""
                ).trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                if (formStatus) {

                    formStatus.textContent =
                        "Please complete your name, email and message.";
                }


                showToast(
                    "Please complete the required fields."
                );

                return;
            }


            const subject =
                encodeURIComponent(
                    "Project enquiry — " +
                    type
                );


            const emailBody =
                encodeURIComponent(
                    `Hello Adesanya,

Name: ${name}
Email: ${email}
Project type: ${type}

${message}

Sent from your portfolio website.`
                );


            if (formStatus) {

                formStatus.textContent =
                    "Opening your email app with the enquiry prepared…";
            }


            showToast(
                "Your enquiry is ready."
            );


            window.location.href =
                `mailto:adesanyaoloruntoba@gmail.com?subject=${subject}&body=${emailBody}`;
        }
    );

})();