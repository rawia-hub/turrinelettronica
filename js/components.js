async function loadComponent(
    selector,
    file,
    root
) {

    const container =
        document.querySelector(
            selector
        );


    if (!container)
        return;


    try {

        const response =
            await fetch(
                root + file
            );


        if (!response.ok) {

            throw new Error(
                'Errore caricamento ' +
                file
            );

        }


        let html =
            await response.text();


        /*
         * Corregge automaticamente
         * link e immagini.
         */
        html =
            html.replaceAll(
                '{{ROOT}}',
                root
            );


        container.innerHTML =
            html;

    }
    catch (error) {

        console.error(
            error
        );

    }

}


/* =====================================
   CARICAMENTO COMPONENTI
   ===================================== */

async function loadSiteComponents() {

    const headerContainer =
        document.getElementById(
            'siteHeader'
        );


    const root =
        headerContainer
            ?.dataset.root
        || './';


    await loadComponent(
        '#siteHeader',
        'components/header.html',
        root
    );


    await loadComponent(
        '#siteFooter',
        'components/footer.html',
        root
    );


    initMobileMenu();

}


/* =====================================
   MENU MOBILE
   ===================================== */

function initMobileMenu() {

    const menuToggle =
        document.querySelector(
            '.menu-toggle'
        );


    const nav =
        document.querySelector(
            '.main-nav'
        );


    if (
        !menuToggle ||
        !nav
    ) {
        return;
    }


    menuToggle.addEventListener(
        'click',
        () => {

            nav.classList.toggle(
                'open'
            );


            menuToggle.setAttribute(
                'aria-expanded',
                nav.classList.contains(
                    'open'
                )
            );

        }
    );

}


loadSiteComponents();
function initFloatingSupport() {

    const widget = document.createElement('div');

    widget.className = 'floating-support';

    widget.innerHTML = `
        <button
            type="button"
            class="back-to-top"
            aria-label="Torna all'inizio della pagina"
            title="Torna su">

            <svg
                viewBox="0 0 24 24"
                aria-hidden="true">

                <path
                    d="M6 15l6-6 6 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                </path>

            </svg>

        </button>


        <div class="live-chat-widget">

            <div
                class="live-chat-card"
                id="liveChatCard"
                aria-hidden="true">

                <button
                    type="button"
                    class="live-chat-close"
                    aria-label="Chiudi chat">
                    ×
                </button>


                <div class="live-chat-card-top">

                    <div class="live-chat-avatar">

                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true">

                            <path
                                d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-8l-4.5 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                                stroke-linejoin="round">
                            </path>

                            <circle cx="8" cy="12" r="1"></circle>
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="16" cy="12" r="1"></circle>

                        </svg>

                    </div>


                    <div>

                        <span class="live-chat-status">

                            <span></span>

                            Online
                        </span>

                        <h3>
                            Come possiamo aiutarti?
                        </h3>

                    </div>

                </div>


                <p>
                    Hai bisogno di informazioni sui nostri
                    prodotti o servizi? Scrivici, siamo qui
                    per aiutarti.
                </p>


                <button
                    type="button"
                    class="live-chat-start">

                    <span>
                        Avvia la chat
                    </span>

                    <span aria-hidden="true">
                        →
                    </span>

                </button>


                <span class="live-chat-note">
                    Turrin Elettronica · Supporto clienti
                </span>

            </div>


            <button
                type="button"
                class="live-chat-button"
                aria-label="Apri chat"
                aria-expanded="false">

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true">

                    <path
                        d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round">
                    </path>

                    <circle cx="8" cy="11.5" r="1"></circle>
                    <circle cx="12" cy="11.5" r="1"></circle>
                    <circle cx="16" cy="11.5" r="1"></circle>

                </svg>

            </button>

        </div>

    `;


    document.body.appendChild(widget);


    const backToTop =
        widget.querySelector('.back-to-top');


    const chatButton =
        widget.querySelector('.live-chat-button');


    const chatCard =
        widget.querySelector('.live-chat-card');


    const closeButton =
        widget.querySelector('.live-chat-close');


    const startButton =
        widget.querySelector('.live-chat-start');


    /* =====================================
       BACK TO TOP
       ===================================== */

    function updateBackToTop() {

        backToTop.classList.toggle(
            'visible',
            window.scrollY > 450
        );

    }


    window.addEventListener(
        'scroll',
        updateBackToTop,
        {
            passive: true
        }
    );


    updateBackToTop();


    backToTop.addEventListener(
        'click',
        () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


    /* =====================================
       LIVE CHAT CARD
       ===================================== */

    function openChatCard() {

        chatCard.classList.add('open');

        chatCard.setAttribute(
            'aria-hidden',
            'false'
        );

        chatButton.setAttribute(
            'aria-expanded',
            'true'
        );

    }


    function closeChatCard() {

        chatCard.classList.remove('open');

        chatCard.setAttribute(
            'aria-hidden',
            'true'
        );

        chatButton.setAttribute(
            'aria-expanded',
            'false'
        );

    }


    chatButton.addEventListener(
        'click',
        () => {

            if (
                chatCard.classList.contains('open')
            ) {
                closeChatCard();
            }
            else {
                openChatCard();
            }

        }
    );


    closeButton.addEventListener(
        'click',
        closeChatCard
    );


    /*
        Per ora apre soltanto il box.
        Qui collegheremo il vero servizio Live Chat.
    */

    startButton.addEventListener(
        'click',
        () => {

            console.log(
                'Avvio Live Chat Turrin Elettronica'
            );

        }
    );

}


/* Avvia support widget */

initFloatingSupport();
