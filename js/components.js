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
   MENU MOBILE + DROPDOWN HEADER
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


    const dropdowns =
        Array.from(
            nav.querySelectorAll(
                '.nav-dropdown'
            )
        );


    function closeDropdowns(
        except = null
    ) {

        dropdowns.forEach(
            dropdown => {

                if (
                    dropdown ===
                    except
                ) {
                    return;
                }


                dropdown.classList.remove(
                    'open'
                );


                dropdown
                    .querySelector(
                        '.nav-dropdown-toggle'
                    )
                    ?.setAttribute(
                        'aria-expanded',
                        'false'
                    );
            }
        );
    }


    function closeMobileMenu() {

        nav.classList.remove(
            'open'
        );


        menuToggle.setAttribute(
            'aria-expanded',
            'false'
        );


        closeDropdowns();
    }


    menuToggle.addEventListener(
        'click',
        () => {

            const willOpen =
                !nav.classList.contains(
                    'open'
                );


            nav.classList.toggle(
                'open',
                willOpen
            );


            menuToggle.setAttribute(
                'aria-expanded',
                String(willOpen)
            );


            if (!willOpen) {
                closeDropdowns();
            }
        }
    );


    dropdowns.forEach(
        dropdown => {

            const toggle =
                dropdown.querySelector(
                    '.nav-dropdown-toggle'
                );


            if (!toggle)
                return;


            toggle.addEventListener(
                'click',
                event => {

                    event.preventDefault();


                    const willOpen =
                        !dropdown.classList.contains(
                            'open'
                        );


                    closeDropdowns(
                        dropdown
                    );


                    dropdown.classList.toggle(
                        'open',
                        willOpen
                    );


                    toggle.setAttribute(
                        'aria-expanded',
                        String(willOpen)
                    );
                }
            );
        }
    );


    nav.querySelectorAll(
        'a'
    )
    .forEach(
        link => {

            link.addEventListener(
                'click',
                () => {

                    if (
                        window.matchMedia(
                            '(max-width: 900px)'
                        ).matches
                    ) {
                        closeMobileMenu();
                    }
                }
            );
        }
    );


    document.addEventListener(
        'click',
        event => {

            if (
                nav.contains(
                    event.target
                ) ||
                menuToggle.contains(
                    event.target
                )
            ) {
                return;
            }


            closeDropdowns();
        }
    );


    document.addEventListener(
        'keydown',
        event => {

            if (
                event.key !==
                'Escape'
            ) {
                return;
            }


            closeDropdowns();


            if (
                window.matchMedia(
                    '(max-width: 900px)'
                ).matches
            ) {
                closeMobileMenu();
            }
        }
    );


    window.addEventListener(
        'resize',
        () => {

            if (
                !window.matchMedia(
                    '(max-width: 900px)'
                ).matches
            ) {
                nav.classList.remove(
                    'open'
                );


                menuToggle.setAttribute(
                    'aria-expanded',
                    'false'
                );
            }
        }
    );
}


loadSiteComponents();

/* =====================================
   LIVE CHAT - CONFIGURAZIONE SUPABASE
   Inserisci qui URL e anon/publishable key
   del progetto Supabase.
   NON usare mai la service_role key.
   ===================================== */

const TURRIN_CHAT_SUPABASE_URL =
    'https://gxlquwudampvcuxiocmh.supabase.co';


const TURRIN_CHAT_SUPABASE_ANON_KEY =
    'sb_publishable_TXv6HGzmzYe2c-CFD2hkkQ_qzkOa4XR';


/*
 * Cloudflare Turnstile SITE KEY (pubblica).
 * Non inserire mai qui la Secret Key.
 */
const TURRIN_CHAT_TURNSTILE_SITE_KEY =
    '0x4AAAAAAEk3BroGgbq1bBWm';


const TURRIN_CHAT_AUTH_STORAGE_KEY =
    'turrin_live_chat_auth';


const TURRIN_CHAT_SESSION_STORAGE_KEY =
    'turrin_live_chat_session_id';


const TURRIN_CHAT_NAME_STORAGE_KEY =
    'turrin_live_chat_name';


const TURRIN_CHAT_EMAIL_STORAGE_KEY =
    'turrin_live_chat_email';


let turrinChatClient = null;


let turrinChatLibraryPromise = null;


let turrinTurnstileLibraryPromise = null;


/* =====================================
   CARICA SUPABASE JS SOLO SE NECESSARIO
   ===================================== */

function loadLiveChatSupabaseLibrary() {

    if (
        window.supabase &&
        typeof window.supabase.createClient ===
            'function'
    ) {
        return Promise.resolve(
            window.supabase
        );
    }


    if (turrinChatLibraryPromise) {
        return turrinChatLibraryPromise;
    }


    turrinChatLibraryPromise =
        new Promise(
            (resolve, reject) => {

                const script =
                    document.createElement(
                        'script'
                    );


                script.src =
                    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';


                script.async =
                    true;


                script.onload =
                    () => {

                        if (
                            window.supabase &&
                            typeof window.supabase
                                .createClient ===
                                'function'
                        ) {
                            resolve(
                                window.supabase
                            );
                        }
                        else {
                            reject(
                                new Error(
                                    'Supabase JS non disponibile.'
                                )
                            );
                        }
                    };


                script.onerror =
                    () => {

                        reject(
                            new Error(
                                'Impossibile caricare Supabase JS.'
                            )
                        );
                    };


                document.head.appendChild(
                    script
                );

            }
        );


    return turrinChatLibraryPromise;
}


/* =====================================
   CARICA CLOUDFLARE TURNSTILE
   ===================================== */

function loadLiveChatTurnstileLibrary() {

    if (
        window.turnstile &&
        typeof window.turnstile.render ===
            'function'
    ) {
        return Promise.resolve(
            window.turnstile
        );
    }


    if (turrinTurnstileLibraryPromise) {
        return turrinTurnstileLibraryPromise;
    }


    turrinTurnstileLibraryPromise =
        new Promise(
            (resolve, reject) => {

                const existingScript =
                    document.querySelector(
                        'script[data-turrin-turnstile="true"]'
                    );


                if (existingScript) {

                    existingScript.addEventListener(
                        'load',
                        () => {

                            if (
                                window.turnstile &&
                                typeof window.turnstile.render ===
                                    'function'
                            ) {
                                resolve(
                                    window.turnstile
                                );
                            }
                            else {
                                reject(
                                    new Error(
                                        'Cloudflare Turnstile non disponibile.'
                                    )
                                );
                            }
                        },
                        {
                            once: true
                        }
                    );


                    existingScript.addEventListener(
                        'error',
                        () => {

                            reject(
                                new Error(
                                    'Impossibile caricare Cloudflare Turnstile.'
                                )
                            );
                        },
                        {
                            once: true
                        }
                    );


                    return;
                }


                const script =
                    document.createElement(
                        'script'
                    );


                script.src =
                    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';


                script.async =
                    true;


                script.defer =
                    true;


                script.dataset.turrinTurnstile =
                    'true';


                script.onload =
                    () => {

                        if (
                            window.turnstile &&
                            typeof window.turnstile.render ===
                                'function'
                        ) {
                            resolve(
                                window.turnstile
                            );
                        }
                        else {
                            reject(
                                new Error(
                                    'Cloudflare Turnstile non disponibile.'
                                )
                            );
                        }
                    };


                script.onerror =
                    () => {

                        reject(
                            new Error(
                                'Impossibile caricare Cloudflare Turnstile.'
                            )
                        );
                    };


                document.head.appendChild(
                    script
                );
            }
        );


    return turrinTurnstileLibraryPromise;
}


/* =====================================
   CLIENT SUPABASE LIVE CHAT
   ===================================== */

async function getLiveChatClient() {

    if (turrinChatClient) {
        return turrinChatClient;
    }


    if (
        !TURRIN_CHAT_SUPABASE_URL ||
        !TURRIN_CHAT_SUPABASE_ANON_KEY
    ) {
        return null;
    }


    const supabaseLibrary =
        await loadLiveChatSupabaseLibrary();


    turrinChatClient =
        supabaseLibrary.createClient(
            TURRIN_CHAT_SUPABASE_URL,
            TURRIN_CHAT_SUPABASE_ANON_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: false,
                    storageKey:
                        TURRIN_CHAT_AUTH_STORAGE_KEY
                }
            }
        );


    return turrinChatClient;
}


/* =====================================
   STILI AGGIUNTIVI CHAT
   ===================================== */

function injectLiveChatStyles() {

    if (
        document.getElementById(
            'turrinLiveChatStyles'
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            'style'
        );


    style.id =
        'turrinLiveChatStyles';


    style.textContent = `
        .live-chat-card {
            width: min(380px, calc(100vw - 28px));
        }

        .live-chat-card.is-conversation {
            width: min(410px, calc(100vw - 28px));
        }

        .live-chat-button {
            position: relative;
        }

        /* Back to top: stile pulito, vicino al sito ufficiale. */
        .back-to-top {
            width: 42px !important;
            height: 42px !important;
            border: 0 !important;
            border-radius: 4px !important;
            background: #071b3a !important;
            color: #ffffff !important;
            box-shadow:
                0 8px 24px rgba(7, 27, 58, .20) !important;
            transition:
                background .2s ease,
                box-shadow .2s ease !important;
        }

        .back-to-top::before,
        .back-to-top::after {
            display: none !important;
        }

        .back-to-top:hover {
            background: #0759d8 !important;
            box-shadow:
                0 10px 28px rgba(7, 89, 216, .22) !important;
        }

        .back-to-top svg {
            width: 18px !important;
            height: 18px !important;
        }

        .back-to-top svg path {
            stroke-width: 2 !important;
        }

        .live-chat-client-unread-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            min-width: 21px;
            height: 21px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
            border: 2px solid #ffffff;
            border-radius: 999px;
            background: #e53935;
            color: #ffffff;
            font-size: 10px;
            font-weight: 900;
            line-height: 1;
            box-shadow: 0 5px 14px rgba(0,0,0,.22);
            pointer-events: none;
        }

        .live-chat-client-unread-badge[hidden] {
            display: none !important;
        }

        .live-chat-screen[hidden] {
            display: none !important;
        }

        .live-chat-status.is-offline > span {
            background: #94a3b8 !important;
            box-shadow: none !important;
        }

        .live-chat-status.is-configuring > span {
            background: #f59e0b !important;
            box-shadow: none !important;
        }

        .live-chat-profile-form {
            display: grid;
            gap: 11px;
            margin-top: 18px;
        }

        .live-chat-field {
            display: grid;
            gap: 6px;
        }

        .live-chat-field label {
            color: #617084;
            font-size: 10px;
            font-weight: 800;
        }

        .live-chat-field input,
        .live-chat-message-form textarea {
            width: 100%;
            border: 1px solid #d9e3ee;
            border-radius: 9px;
            background: #fff;
            color: #172a45;
            font: inherit;
            outline: none;
            transition:
                border-color .2s ease,
                box-shadow .2s ease;
        }

        .live-chat-field input {
            min-height: 43px;
            padding: 0 12px;
        }

        .live-chat-message-form textarea {
            min-height: 48px;
            max-height: 120px;
            resize: none;
            padding: 12px 48px 12px 12px;
            line-height: 1.45;
        }

        .live-chat-field input:focus,
        .live-chat-message-form textarea:focus {
            border-color: #0759d8;
            box-shadow:
                0 0 0 3px rgba(7,89,216,.10);
        }

        .live-chat-form-actions {
            display: flex;
            align-items: center;
            gap: 9px;
            margin-top: 4px;
        }

        .live-chat-secondary-action {
            min-height: 42px;
            padding: 0 14px;
            border: 1px solid #d9e3ee;
            border-radius: 8px;
            background: #fff;
            color: #53657b;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
        }

        .live-chat-turnstile-wrap {
            width: 100%;
            min-height: 0;
            overflow: visible;
            margin-top: 1px;
        }

        .live-chat-turnstile-wrap:empty {
            display: none;
        }

        .live-chat-turnstile-wrap > div {
            max-width: 100%;
        }

        .live-chat-profile-note,
        .live-chat-system-note {
            display: block;
            margin-top: 10px;
            color: #8a97a8;
            font-size: 8px;
            line-height: 1.5;
        }

        .live-chat-session-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            margin: 15px 0 10px;
            padding: 10px 12px;
            border: 1px solid #e0e7ef;
            border-radius: 9px;
            background: #f7faff;
        }

        .live-chat-session-bar strong {
            color: #263b57;
            font-size: 10px;
        }

        .live-chat-session-bar span {
            color: #7d8b9d;
            font-size: 8px;
        }

        .live-chat-session-info {
            min-width: 0;
            display: grid;
            gap: 2px;
        }

        .live-chat-new-session {
            flex: 0 0 auto;
            min-height: 31px;
            padding: 0 10px;
            border: 1px solid #d7e2ee;
            border-radius: 7px;
            background: #ffffff;
            color: #0759d8;
            font-size: 8px;
            font-weight: 900;
            cursor: pointer;
            white-space: nowrap;
        }

        .live-chat-new-session:hover {
            border-color: #0759d8;
            background: #f4f8ff;
        }

        .live-chat-closed-panel {
            display: grid;
            gap: 9px;
            margin: 8px 0 4px;
            padding: 13px;
            border: 1px solid #dce5ef;
            border-radius: 10px;
            background: #f7f9fc;
        }

        .live-chat-closed-panel[hidden],
        .live-chat-confirm-overlay[hidden],
        .live-chat-message-form[hidden] {
            display: none !important;
        }

        .live-chat-closed-panel strong {
            color: #263b57;
            font-size: 10px;
        }

        .live-chat-closed-panel p {
            margin: 0;
            color: #748296;
            font-size: 9px;
            line-height: 1.5;
        }

        .live-chat-closed-new {
            min-height: 38px;
            border: 0;
            border-radius: 8px;
            background: #0759d8;
            color: #ffffff;
            font-size: 9px;
            font-weight: 900;
            cursor: pointer;
        }

        .live-chat-confirm-overlay {
            position: absolute;
            inset: 0;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            border-radius: inherit;
            background: rgba(7, 27, 58, .42);
            backdrop-filter: blur(2px);
        }

        .live-chat-confirm-box {
            width: 100%;
            max-width: 320px;
            padding: 20px;
            border: 1px solid #dce5ef;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 20px 55px rgba(17, 38, 67, .20);
        }

        .live-chat-confirm-box h4 {
            margin: 0 0 8px;
            color: #172a45;
            font-size: 14px;
        }

        .live-chat-confirm-box p {
            margin: 0;
            color: #748296;
            font-size: 10px;
            line-height: 1.55;
        }

        .live-chat-confirm-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
        }

        .live-chat-confirm-cancel,
        .live-chat-confirm-start {
            min-height: 38px;
            padding: 0 13px;
            border-radius: 8px;
            font-size: 9px;
            font-weight: 900;
            cursor: pointer;
        }

        .live-chat-confirm-cancel {
            border: 1px solid #d7e2ee;
            background: #ffffff;
            color: #53657b;
        }

        .live-chat-confirm-start {
            border: 0;
            background: #0759d8;
            color: #ffffff;
        }

        .live-chat-confirm-start:disabled {
            opacity: .55;
            cursor: default;
        }

        .live-chat-messages {
            height: 300px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow-y: auto;
            padding: 13px 4px 13px 0;
            scroll-behavior: smooth;
        }

        .live-chat-empty {
            margin: auto 10px;
            color: #8a97a8;
            font-size: 10px;
            line-height: 1.55;
            text-align: center;
        }

        .live-chat-message {
            max-width: 82%;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .live-chat-message.is-visitor {
            align-self: flex-end;
            align-items: flex-end;
        }

        .live-chat-message.is-admin {
            align-self: flex-start;
            align-items: flex-start;
        }

        .live-chat-message-bubble {
            padding: 10px 12px;
            border-radius: 12px;
            font-size: 10px;
            line-height: 1.5;
            word-break: break-word;
            white-space: pre-wrap;
        }

        .live-chat-message.is-visitor
        .live-chat-message-bubble {
            border-bottom-right-radius: 4px;
            background: #0759d8;
            color: #fff;
        }

        .live-chat-message.is-admin
        .live-chat-message-bubble {
            border: 1px solid #dfe7ef;
            border-bottom-left-radius: 4px;
            background: #f5f8fc;
            color: #31465f;
        }

        .live-chat-message-time {
            color: #9aa6b5;
            font-size: 7px;
        }

        .live-chat-message-form {
            position: relative;
            margin-top: 6px;
        }

        .live-chat-send {
            position: absolute;
            right: 7px;
            bottom: 7px;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 8px;
            background: #0759d8;
            color: #fff;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
        }

        .live-chat-send:disabled,
        .live-chat-start:disabled {
            opacity: .55;
            cursor: default;
        }

        .live-chat-error {
            margin-top: 9px;
            color: #b42318;
            font-size: 8px;
            line-height: 1.5;
        }

        .live-chat-error:empty {
            display: none;
        }

        @media(max-width:600px) {
            .live-chat-card,
            .live-chat-card.is-conversation {
                width: calc(100vw - 24px);
            }

            .live-chat-messages {
                height: min(310px, 42vh);
            }
        }
    `;


    document.head.appendChild(
        style
    );
}


/* =====================================
   FLOATING SUPPORT + LIVE CHAT
   ===================================== */

function initFloatingSupport() {

    injectLiveChatStyles();


    const widget =
        document.createElement(
            'div'
        );


    widget.className =
        'floating-support';


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

                        <span
                            class="live-chat-status is-offline"
                            id="liveChatStatus">

                            <span></span>

                            <b id="liveChatStatusText">
                                Lascia un messaggio
                            </b>

                        </span>

                        <h3>
                            Come possiamo aiutarti?
                        </h3>

                    </div>

                </div>


                <div
                    class="live-chat-screen live-chat-intro"
                    id="liveChatIntro">

                    <p>
                        Hai bisogno di informazioni sui nostri
                        prodotti o servizi? Scrivici: il messaggio
                        viene inviato direttamente al supporto.
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


                <div
                    class="live-chat-screen"
                    id="liveChatProfile"
                    hidden>

                    <form
                        class="live-chat-profile-form"
                        id="liveChatProfileForm">

                        <div class="live-chat-field">

                            <label for="liveChatName">
                                Nome
                            </label>

                            <input
                                id="liveChatName"
                                name="name"
                                type="text"
                                maxlength="80"
                                autocomplete="name"
                                required
                            >

                        </div>


                        <div class="live-chat-field">

                            <label for="liveChatEmail">
                                Email
                                <span>
                                    (facoltativa)
                                </span>
                            </label>

                            <input
                                id="liveChatEmail"
                                name="email"
                                type="email"
                                maxlength="160"
                                autocomplete="email"
                            >

                        </div>


                        <div
                            class="live-chat-turnstile-wrap"
                            id="liveChatTurnstile"
                            aria-live="polite">
                        </div>


                        <div
                            class="live-chat-error"
                            id="liveChatProfileError">
                        </div>


                        <div class="live-chat-form-actions">

                            <button
                                type="button"
                                class="live-chat-secondary-action"
                                id="liveChatBack">

                                Indietro

                            </button>


                            <button
                                type="submit"
                                class="live-chat-start"
                                id="liveChatCreateSession">

                                <span>
                                    Entra in chat
                                </span>

                                <span aria-hidden="true">
                                    →
                                </span>

                            </button>

                        </div>

                    </form>


                    <span class="live-chat-profile-note">
                        Usa la chat solo per richieste di assistenza
                        e informazioni. Non inserire password,
                        dati bancari o altri dati sensibili.
                    </span>

                </div>


                <div
                    class="live-chat-screen"
                    id="liveChatConversation"
                    hidden>

                    <div class="live-chat-session-bar">

                        <div class="live-chat-session-info">

                            <strong id="liveChatVisitorName">
                                Cliente
                            </strong>

                            <span id="liveChatSessionState">
                                Conversazione attiva
                            </span>

                        </div>


                        <button
                            type="button"
                            class="live-chat-new-session"
                            id="liveChatNewSession">

                            Nuova chat

                        </button>

                    </div>


                    <div
                        class="live-chat-messages"
                        id="liveChatMessages"
                        aria-live="polite">

                        <div class="live-chat-empty">
                            Scrivi il primo messaggio.
                        </div>

                    </div>


                    <div
                        class="live-chat-closed-panel"
                        id="liveChatClosedPanel"
                        hidden>

                        <strong>
                            Conversazione conclusa
                        </strong>

                        <p>
                            Puoi rileggere i messaggi oppure
                            iniziare una nuova conversazione
                            con il supporto.
                        </p>

                        <button
                            type="button"
                            class="live-chat-closed-new"
                            id="liveChatClosedNewSession">

                            Inizia una nuova chat

                        </button>

                    </div>


                    <form
                        class="live-chat-message-form"
                        id="liveChatMessageForm">

                        <textarea
                            id="liveChatMessageInput"
                            maxlength="2000"
                            rows="1"
                            placeholder="Scrivi un messaggio..."
                            aria-label="Messaggio"
                            required>
                        </textarea>


                        <button
                            type="submit"
                            class="live-chat-send"
                            aria-label="Invia messaggio">

                            →

                        </button>

                    </form>


                    <div
                        class="live-chat-error"
                        id="liveChatMessageError">
                    </div>


                    <span class="live-chat-system-note">
                        I messaggi vengono conservati per gestire
                        la richiesta. Le conversazioni chiuse vengono
                        eliminate automaticamente dopo 6 mesi.
                    </span>

                </div>



                <div
                    class="live-chat-confirm-overlay"
                    id="liveChatNewSessionConfirm"
                    hidden>

                    <div class="live-chat-confirm-box">

                        <h4>
                            Iniziare una nuova chat?
                        </h4>

                        <p>
                            La conversazione attuale verrà conclusa
                            e resterà nello storico del supporto.
                            Potrai quindi iniziarne una nuova.
                        </p>

                        <div class="live-chat-confirm-actions">

                            <button
                                type="button"
                                class="live-chat-confirm-cancel"
                                id="liveChatNewSessionCancel">

                                Annulla

                            </button>

                            <button
                                type="button"
                                class="live-chat-confirm-start"
                                id="liveChatNewSessionConfirmButton">

                                Nuova chat

                            </button>

                        </div>

                    </div>

                </div>

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

                <span
                    class="live-chat-client-unread-badge"
                    id="liveChatClientUnreadBadge"
                    aria-hidden="true"
                    hidden>
                    0
                </span>

            </button>

        </div>
    `;


    document.body.appendChild(
        widget
    );


    const backToTop =
        widget.querySelector(
            '.back-to-top'
        );


    const chatButton =
        widget.querySelector(
            '.live-chat-button'
        );


    const clientUnreadBadge =
        widget.querySelector(
            '#liveChatClientUnreadBadge'
        );


    const chatCard =
        widget.querySelector(
            '.live-chat-card'
        );


    const closeButton =
        widget.querySelector(
            '.live-chat-close'
        );


    const startButton =
        widget.querySelector(
            '.live-chat-start'
        );


    const introScreen =
        widget.querySelector(
            '#liveChatIntro'
        );


    const profileScreen =
        widget.querySelector(
            '#liveChatProfile'
        );


    const conversationScreen =
        widget.querySelector(
            '#liveChatConversation'
        );


    const profileForm =
        widget.querySelector(
            '#liveChatProfileForm'
        );


    const profileBack =
        widget.querySelector(
            '#liveChatBack'
        );


    const nameInput =
        widget.querySelector(
            '#liveChatName'
        );


    const emailInput =
        widget.querySelector(
            '#liveChatEmail'
        );


    const profileError =
        widget.querySelector(
            '#liveChatProfileError'
        );


    const turnstileContainer =
        widget.querySelector(
            '#liveChatTurnstile'
        );


    const messagesContainer =
        widget.querySelector(
            '#liveChatMessages'
        );


    const messageForm =
        widget.querySelector(
            '#liveChatMessageForm'
        );


    const messageInput =
        widget.querySelector(
            '#liveChatMessageInput'
        );


    const messageError =
        widget.querySelector(
            '#liveChatMessageError'
        );


    const visitorNameLabel =
        widget.querySelector(
            '#liveChatVisitorName'
        );


    const sessionState =
        widget.querySelector(
            '#liveChatSessionState'
        );


    const newSessionButton =
        widget.querySelector(
            '#liveChatNewSession'
        );


    const closedPanel =
        widget.querySelector(
            '#liveChatClosedPanel'
        );


    const closedNewSessionButton =
        widget.querySelector(
            '#liveChatClosedNewSession'
        );


    const newSessionConfirm =
        widget.querySelector(
            '#liveChatNewSessionConfirm'
        );


    const newSessionCancelButton =
        widget.querySelector(
            '#liveChatNewSessionCancel'
        );


    const newSessionConfirmButton =
        widget.querySelector(
            '#liveChatNewSessionConfirmButton'
        );


    const statusElement =
        widget.querySelector(
            '#liveChatStatus'
        );


    const statusText =
        widget.querySelector(
            '#liveChatStatusText'
        );


    let currentSessionId =
        null;


    let currentUserId =
        null;


    let currentSessionStatus =
        null;


    let operatorOnline =
        false;


    let messagesChannel =
        null;


    let sessionChannel =
        null;


    let presenceChannel =
        null;


    let restoreAttempted =
        false;


    let turnstileWidgetId =
        null;


    let renderedMessageIds =
        new Set();


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
       NOTIFICHE CLIENTE - NON LETTI
       ===================================== */

    function renderClientUnreadBadge(
        count
    ) {

        if (!clientUnreadBadge)
            return;


        const safeCount =
            Math.max(
                0,
                Number(count) || 0
            );


        if (safeCount === 0) {

            clientUnreadBadge.hidden =
                true;


            clientUnreadBadge.textContent =
                '0';


            chatButton.setAttribute(
                'aria-label',
                'Apri chat'
            );


            return;
        }


        clientUnreadBadge.hidden =
            false;


        clientUnreadBadge.textContent =
            safeCount > 99
                ? '99+'
                : String(safeCount);


        chatButton.setAttribute(
            'aria-label',
            safeCount === 1
                ? 'Apri chat, 1 messaggio non letto'
                : `Apri chat, ${safeCount} messaggi non letti`
        );
    }


    async function markVisitorMessagesAsRead(
        sessionId
    ) {

        if (!sessionId)
            return;


        try {

            const client =
                await getLiveChatClient();


            if (!client)
                return;


            const { error } =
                await client.rpc(
                    'mark_chat_session_visitor_read',
                    {
                        p_session_id:
                            sessionId
                    }
                );


            if (error) {
                throw error;
            }


            renderClientUnreadBadge(
                0
            );

        }
        catch (error) {

            console.error(
                'Errore lettura messaggi Live Chat:',
                error
            );
        }
    }


    function isConversationVisible() {

        return (
            chatCard.classList.contains(
                'open'
            ) &&
            !conversationScreen.hidden &&
            document.visibilityState ===
                'visible'
        );
    }


    async function subscribeToSession(
        sessionId
    ) {

        const client =
            await getLiveChatClient();


        if (!client)
            return;


        if (sessionChannel) {

            await client.removeChannel(
                sessionChannel
            );


            sessionChannel =
                null;
        }


        sessionChannel =
            client
                .channel(
                    `turrin-chat-session-${sessionId}`
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table:
                            'chat_sessions',
                        filter:
                            `id=eq.${sessionId}`
                    },
                    payload => {

                        const unread =
                            Number(
                                payload.new
                                    ?.visitor_unread_count
                            ) || 0;


                        if (
                            payload.new?.status
                        ) {

                            applySessionStatus(
                                payload.new.status
                            );
                        }


                        if (
                            unread > 0 &&
                            isConversationVisible()
                        ) {

                            markVisitorMessagesAsRead(
                                sessionId
                            );


                            return;
                        }


                        renderClientUnreadBadge(
                            unread
                        );
                    }
                )
                .subscribe();
    }


    async function initVisitorUnreadTracking() {

        const savedSessionId =
            localStorage.getItem(
                TURRIN_CHAT_SESSION_STORAGE_KEY
            );


        if (!savedSessionId) {

            renderClientUnreadBadge(
                0
            );


            return;
        }


        try {

            await ensureVisitorAuth();


            const client =
                await getLiveChatClient();


            const {
                data,
                error
            } =
                await client
                    .from(
                        'chat_sessions'
                    )
                    .select(
                        'id, status, visitor_unread_count'
                    )
                    .eq(
                        'id',
                        savedSessionId
                    )
                    .maybeSingle();


            if (error) {
                throw error;
            }


            if (!data) {

                renderClientUnreadBadge(
                    0
                );


                return;
            }


            currentSessionId =
                data.id;


            renderClientUnreadBadge(
                data.visitor_unread_count
            );


            await subscribeToSession(
                data.id
            );

        }
        catch (error) {

            console.error(
                'Notifiche Live Chat cliente:',
                error
            );
        }
    }


    /* =====================================
       SCHERMATE CHAT
       ===================================== */

    function setChatScreen(
        screen
    ) {

        introScreen.hidden =
            screen !== 'intro';


        profileScreen.hidden =
            screen !== 'profile';


        conversationScreen.hidden =
            screen !== 'conversation';


        chatCard.classList.toggle(
            'is-conversation',
            screen === 'conversation'
        );
    }


    function openChatCard() {

        chatCard.classList.add(
            'open'
        );


        chatCard.setAttribute(
            'aria-hidden',
            'false'
        );


        chatButton.setAttribute(
            'aria-expanded',
            'true'
        );


        if (
            currentSessionId &&
            !conversationScreen.hidden &&
            document.visibilityState ===
                'visible'
        ) {

            markVisitorMessagesAsRead(
                currentSessionId
            );
        }


        if (
            !restoreAttempted &&
            localStorage.getItem(
                TURRIN_CHAT_SESSION_STORAGE_KEY
            )
        ) {

            restoreAttempted =
                true;


            restoreExistingSession();
        }
    }


    function closeChatCard() {

        chatCard.classList.remove(
            'open'
        );


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
                chatCard.classList
                    .contains(
                        'open'
                    )
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


    /* =====================================
       STATO CONVERSAZIONE
       ===================================== */

    function updateSessionStateLabel() {

        if (!sessionState)
            return;


        if (
            currentSessionStatus ===
                'closed'
        ) {

            sessionState.textContent =
                'Conversazione conclusa';


            return;
        }


        sessionState.textContent =
            operatorOnline
                ? 'Supporto online'
                : 'Messaggio registrato';
    }


    function applySessionStatus(
        status
    ) {

        currentSessionStatus =
            status === 'closed'
                ? 'closed'
                : 'open';


        const isClosed =
            currentSessionStatus ===
                'closed';


        messageForm.hidden =
            isClosed;


        closedPanel.hidden =
            !isClosed;


        updateSessionStateLabel();
    }


    /* =====================================
       PRESENZA OPERATORE
       ===================================== */

    function setOperatorOnline(
        online
    ) {

        statusElement.classList.toggle(
            'is-offline',
            !online
        );


        statusElement.classList.remove(
            'is-configuring'
        );


        operatorOnline =
            online;


        statusText.textContent =
            online
                ? 'Online'
                : 'Lascia un messaggio';


        updateSessionStateLabel();
    }


    function setChatConfigMissing() {

        statusElement.classList.remove(
            'is-offline'
        );


        statusElement.classList.add(
            'is-configuring'
        );


        statusText.textContent =
            'Da configurare';


        startButton.disabled =
            true;
    }


    async function initSupportPresence() {

        try {

            const client =
                await getLiveChatClient();


            if (!client) {

                setChatConfigMissing();

                return;
            }


            presenceChannel =
                client.channel(
                    'turrin-support-presence'
                );


            presenceChannel
                .on(
                    'presence',
                    {
                        event: 'sync'
                    },
                    () => {

                        const state =
                            presenceChannel
                                .presenceState();


                        let adminOnline =
                            false;


                        Object.values(
                            state
                        )
                        .forEach(entries => {

                            entries.forEach(
                                entry => {

                                    if (
                                        entry.role ===
                                        'admin'
                                    ) {

                                        adminOnline =
                                            true;
                                    }
                                }
                            );
                        });


                        setOperatorOnline(
                            adminOnline
                        );
                    }
                )
                .subscribe();

        }
        catch (error) {

            console.error(
                'Errore presenza Live Chat:',
                error
            );


            setOperatorOnline(
                false
            );
        }
    }


    /* =====================================
       CLOUDFLARE TURNSTILE
       ===================================== */

    function clearTurnstileWidget() {

        if (
            window.turnstile &&
            turnstileWidgetId !== null
        ) {

            try {

                window.turnstile.remove(
                    turnstileWidgetId
                );
            }
            catch (error) {

                console.warn(
                    'Reset Turnstile:',
                    error
                );
            }
        }


        turnstileWidgetId =
            null;


        if (turnstileContainer) {

            turnstileContainer.innerHTML =
                '';
        }
    }


    async function getTurnstileToken() {

        if (
            !TURRIN_CHAT_TURNSTILE_SITE_KEY
        ) {

            throw new Error(
                'Turnstile Site Key non configurata.'
            );
        }


        if (!turnstileContainer) {

            throw new Error(
                'Contenitore Turnstile non disponibile.'
            );
        }


        const turnstile =
            await loadLiveChatTurnstileLibrary();


        clearTurnstileWidget();


        return new Promise(
            (resolve, reject) => {

                let completed =
                    false;


                const finish =
                    callback => value => {

                        if (completed)
                            return;


                        completed =
                            true;


                        callback(
                            value
                        );
                    };


                const resolveOnce =
                    finish(
                        resolve
                    );


                const rejectOnce =
                    finish(
                        reject
                    );


                try {

                    turnstileWidgetId =
                        turnstile.render(
                            turnstileContainer,
                            {
                                sitekey:
                                    TURRIN_CHAT_TURNSTILE_SITE_KEY,

                                theme:
                                    'light',

                                language:
                                    'it',

                                size:
                                    window.innerWidth <= 420
                                        ? 'compact'
                                        : 'flexible',

                                appearance:
                                    'interaction-only',

                                execution:
                                    'execute',

                                action:
                                    'live_chat_auth',

                                'response-field':
                                    false,

                                callback:
                                    token => {

                                        if (!token) {

                                            rejectOnce(
                                                new Error(
                                                    'Turnstile non ha restituito un token.'
                                                )
                                            );


                                            return;
                                        }


                                        resolveOnce(
                                            token
                                        );
                                    },

                                'error-callback':
                                    errorCode => {

                                        rejectOnce(
                                            new Error(
                                                `Turnstile error ${errorCode}`
                                            )
                                        );


                                        return true;
                                    },

                                'expired-callback':
                                    () => {

                                        rejectOnce(
                                            new Error(
                                                'Turnstile token scaduto.'
                                            )
                                        );
                                    },

                                'timeout-callback':
                                    () => {

                                        rejectOnce(
                                            new Error(
                                                'Turnstile timeout.'
                                            )
                                        );
                                    }
                            }
                        );


                    if (
                        turnstileWidgetId ===
                            undefined ||
                        turnstileWidgetId ===
                            null
                    ) {

                        rejectOnce(
                            new Error(
                                'Impossibile inizializzare Turnstile.'
                            )
                        );


                        return;
                    }


                    turnstile.execute(
                        turnstileContainer
                    );
                }
                catch (error) {

                    rejectOnce(
                        error
                    );
                }
            }
        );
    }


    /* =====================================
       AUTH VISITATORE
       ===================================== */

    async function ensureVisitorAuth() {

        const client =
            await getLiveChatClient();


        if (!client) {

            throw new Error(
                'Live chat non configurata.'
            );
        }


        const {
            data: sessionData,
            error: sessionError
        } =
            await client.auth
                .getSession();


        if (sessionError) {
            throw sessionError;
        }


        if (
            sessionData &&
            sessionData.session &&
            sessionData.session.user
        ) {

            currentUserId =
                sessionData.session.user.id;


            return currentUserId;
        }


        const captchaToken =
            await getTurnstileToken();


        let data =
            null;


        let error =
            null;


        try {

            const response =
                await client.auth
                    .signInAnonymously({
                        options: {
                            captchaToken:
                                captchaToken
                        }
                    });


            data =
                response.data;


            error =
                response.error;
        }
        finally {

            /*
             * I token Turnstile sono monouso.
             * Al prossimo tentativo verrà creato
             * automaticamente un nuovo challenge.
             */
            clearTurnstileWidget();
        }


        if (error) {
            throw error;
        }


        currentUserId =
            data?.user?.id ||
            data?.session?.user?.id ||
            null;


        if (!currentUserId) {

            throw new Error(
                'Impossibile avviare la sessione anonima.'
            );
        }


        return currentUserId;
    }


    /* =====================================
       MESSAGGI
       ===================================== */

    function formatChatTime(
        value
    ) {

        if (!value)
            return '';


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return '';
        }


        return date.toLocaleTimeString(
            'it-IT',
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        );
    }


    function scrollMessagesToBottom() {

        requestAnimationFrame(
            () => {

                messagesContainer.scrollTop =
                    messagesContainer.scrollHeight;
            }
        );
    }


    function appendMessage(
        message
    ) {

        if (
            message.id !== undefined &&
            message.id !== null
        ) {

            const messageKey =
                String(
                    message.id
                );


            if (
                renderedMessageIds.has(
                    messageKey
                )
            ) {
                return;
            }


            renderedMessageIds.add(
                messageKey
            );
        }


        const empty =
            messagesContainer.querySelector(
                '.live-chat-empty'
            );


        if (empty) {
            empty.remove();
        }


        const messageElement =
            document.createElement(
                'div'
            );


        const senderClass =
            message.sender === 'admin'
                ? 'is-admin'
                : 'is-visitor';


        messageElement.className =
            `live-chat-message ${senderClass}`;


        const bubble =
            document.createElement(
                'div'
            );


        bubble.className =
            'live-chat-message-bubble';


        bubble.textContent =
            message.message || '';


        const time =
            document.createElement(
                'span'
            );


        time.className =
            'live-chat-message-time';


        time.textContent =
            formatChatTime(
                message.created_at
            );


        messageElement.appendChild(
            bubble
        );


        messageElement.appendChild(
            time
        );


        messagesContainer.appendChild(
            messageElement
        );


        scrollMessagesToBottom();
    }


    async function loadMessages(
        sessionId
    ) {

        const client =
            await getLiveChatClient();


        if (!client)
            return;


        const {
            data,
            error
        } =
            await client
                .from(
                    'chat_messages'
                )
                .select(
                    'id, sender, message, created_at'
                )
                .eq(
                    'session_id',
                    sessionId
                )
                .order(
                    'created_at',
                    {
                        ascending: true
                    }
                )
                .limit(
                    200
                );


        if (error) {
            throw error;
        }


        renderedMessageIds =
            new Set();


        messagesContainer.innerHTML =
            '';


        if (
            !data ||
            data.length === 0
        ) {

            messagesContainer.innerHTML = `
                <div class="live-chat-empty">
                    Scrivi il primo messaggio.
                </div>
            `;


            return;
        }


        data.forEach(
            appendMessage
        );
    }


    async function subscribeToMessages(
        sessionId
    ) {

        const client =
            await getLiveChatClient();


        if (!client)
            return;


        if (messagesChannel) {

            await client.removeChannel(
                messagesChannel
            );


            messagesChannel =
                null;
        }


        messagesChannel =
            client
                .channel(
                    `turrin-chat-${sessionId}`
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table:
                            'chat_messages',
                        filter:
                            `session_id=eq.${sessionId}`
                    },
                    payload => {

                        appendMessage(
                            payload.new
                        );


                        if (
                            payload.new?.sender ===
                                'admin' &&
                            isConversationVisible()
                        ) {

                            markVisitorMessagesAsRead(
                                sessionId
                            );
                        }
                    }
                )
                .subscribe();
    }


    async function openConversation(
        session
    ) {

        currentSessionId =
            session.id;


        localStorage.setItem(
            TURRIN_CHAT_SESSION_STORAGE_KEY,
            currentSessionId
        );


        const storedName =
            session.visitor_name ||
            localStorage.getItem(
                TURRIN_CHAT_NAME_STORAGE_KEY
            ) ||
            'Cliente';


        visitorNameLabel.textContent =
            storedName;


        applySessionStatus(
            session.status
        );


        setChatScreen(
            'conversation'
        );


        await loadMessages(
            currentSessionId
        );


        await subscribeToMessages(
            currentSessionId
        );


        await subscribeToSession(
            currentSessionId
        );


        if (
            document.visibilityState ===
                'visible'
        ) {

            await markVisitorMessagesAsRead(
                currentSessionId
            );
        }


        messageInput.focus();
    }


    /* =====================================
       RIPRISTINO CONVERSAZIONE
       ===================================== */

    async function restoreExistingSession() {

        const savedSessionId =
            localStorage.getItem(
                TURRIN_CHAT_SESSION_STORAGE_KEY
            );


        if (!savedSessionId)
            return false;


        try {

            await ensureVisitorAuth();


            const client =
                await getLiveChatClient();


            const {
                data,
                error
            } =
                await client
                    .from(
                        'chat_sessions'
                    )
                    .select(
                        'id, visitor_name, visitor_email, status, visitor_unread_count'
                    )
                    .eq(
                        'id',
                        savedSessionId
                    )
                    .maybeSingle();


            if (error) {
                throw error;
            }


            if (!data) {

                localStorage.removeItem(
                    TURRIN_CHAT_SESSION_STORAGE_KEY
                );


                return false;
            }


            await openConversation(
                data
            );


            return true;

        }
        catch (error) {

            console.error(
                'Ripristino Live Chat:',
                error
            );


            localStorage.removeItem(
                TURRIN_CHAT_SESSION_STORAGE_KEY
            );


            return false;
        }
    }


    /* =====================================
       NUOVA CONVERSAZIONE
       ===================================== */

    function showNewSessionConfirm() {

        if (!currentSessionId)
            return;


        newSessionConfirm.hidden =
            false;


        newSessionConfirmButton.focus();
    }


    function hideNewSessionConfirm() {

        newSessionConfirm.hidden =
            true;
    }


    async function clearCurrentSessionChannels() {

        const client =
            await getLiveChatClient();


        if (!client)
            return;


        if (messagesChannel) {

            await client.removeChannel(
                messagesChannel
            );


            messagesChannel =
                null;
        }


        if (sessionChannel) {

            await client.removeChannel(
                sessionChannel
            );


            sessionChannel =
                null;
        }
    }


    function prepareNewSessionProfile() {

        currentSessionId =
            null;


        currentSessionStatus =
            null;


        localStorage.removeItem(
            TURRIN_CHAT_SESSION_STORAGE_KEY
        );


        renderClientUnreadBadge(
            0
        );


        renderedMessageIds =
            new Set();


        messagesContainer.innerHTML = `
            <div class="live-chat-empty">
                Scrivi il primo messaggio.
            </div>
        `;


        messageError.textContent =
            '';


        profileError.textContent =
            '';


        nameInput.value =
            localStorage.getItem(
                TURRIN_CHAT_NAME_STORAGE_KEY
            ) || '';


        emailInput.value =
            localStorage.getItem(
                TURRIN_CHAT_EMAIL_STORAGE_KEY
            ) || '';


        hideNewSessionConfirm();


        setChatScreen(
            'profile'
        );


        nameInput.focus();
    }


    async function startFreshConversation(
        closeCurrentSession
    ) {

        if (
            closeCurrentSession &&
            currentSessionId
        ) {

            const client =
                await getLiveChatClient();


            if (!client) {

                throw new Error(
                    'Live chat non configurata.'
                );
            }


            const {
                error
            } =
                await client.rpc(
                    'close_chat_session_for_visitor',
                    {
                        p_session_id:
                            currentSessionId
                    }
                );


            if (error) {
                throw error;
            }
        }


        await clearCurrentSessionChannels();


        prepareNewSessionProfile();
    }


    newSessionButton.addEventListener(
        'click',
        showNewSessionConfirm
    );


    newSessionCancelButton.addEventListener(
        'click',
        hideNewSessionConfirm
    );


    newSessionConfirm.addEventListener(
        'click',
        event => {

            if (
                event.target ===
                    newSessionConfirm
            ) {

                hideNewSessionConfirm();
            }
        }
    );


    newSessionConfirmButton.addEventListener(
        'click',
        async () => {

            newSessionConfirmButton.disabled =
                true;


            messageError.textContent =
                '';


            try {

                await startFreshConversation(
                    true
                );
            }
            catch (error) {

                console.error(
                    'Errore nuova Live Chat:',
                    error
                );


                messageError.textContent =
                    'Non è stato possibile concludere la conversazione. Riprova.';
            }
            finally {

                newSessionConfirmButton.disabled =
                    false;
            }
        }
    );


    closedNewSessionButton.addEventListener(
        'click',
        async () => {

            try {

                await startFreshConversation(
                    false
                );
            }
            catch (error) {

                console.error(
                    'Errore nuova Live Chat:',
                    error
                );


                messageError.textContent =
                    'Non è stato possibile iniziare una nuova conversazione.';
            }
        }
    );


    /* =====================================
       CREAZIONE SESSIONE
       ===================================== */

    startButton.addEventListener(
        'click',
        async () => {

            profileError.textContent =
                '';


            const restored =
                await restoreExistingSession();


            if (restored)
                return;


            nameInput.value =
                localStorage.getItem(
                    TURRIN_CHAT_NAME_STORAGE_KEY
                ) || '';


            emailInput.value =
                localStorage.getItem(
                    TURRIN_CHAT_EMAIL_STORAGE_KEY
                ) || '';


            setChatScreen(
                'profile'
            );


            nameInput.focus();
        }
    );


    profileBack.addEventListener(
        'click',
        () => {

            profileError.textContent =
                '';


            setChatScreen(
                'intro'
            );
        }
    );


    profileForm.addEventListener(
        'submit',
        async event => {

            event.preventDefault();


            profileError.textContent =
                '';


            const submitButton =
                widget.querySelector(
                    '#liveChatCreateSession'
                );


            const name =
                nameInput.value
                    .trim();


            const email =
                emailInput.value
                    .trim();


            if (!name) {

                profileError.textContent =
                    'Inserisci il tuo nome.';


                nameInput.focus();


                return;
            }


            submitButton.disabled =
                true;


            try {

                const userId =
                    await ensureVisitorAuth();


                const client =
                    await getLiveChatClient();


                const {
                    data,
                    error
                } =
                    await client
                        .from(
                            'chat_sessions'
                        )
                        .insert({
                            visitor_id:
                                userId,

                            visitor_name:
                                name,

                            visitor_email:
                                email || null,

                            page_url:
                                window.location.href,

                            status:
                                'open'
                        })
                        .select(
                            'id, visitor_name, visitor_email, status, visitor_unread_count'
                        )
                        .single();


                if (error) {
                    throw error;
                }


                localStorage.setItem(
                    TURRIN_CHAT_NAME_STORAGE_KEY,
                    name
                );


                if (email) {

                    localStorage.setItem(
                        TURRIN_CHAT_EMAIL_STORAGE_KEY,
                        email
                    );
                }
                else {

                    localStorage.removeItem(
                        TURRIN_CHAT_EMAIL_STORAGE_KEY
                    );
                }


                await openConversation(
                    data
                );

            }
            catch (error) {

                console.error(
                    'Errore creazione Live Chat:',
                    error
                );


                const errorText =
                    String(
                        error?.message ||
                        ''
                    );


                if (
                    errorText.includes(
                        'Site Key non configurata'
                    )
                ) {

                    profileError.textContent =
                        'La verifica di sicurezza non è configurata.';
                }
                else if (
                    errorText.toLowerCase()
                        .includes(
                            'turnstile'
                        ) ||
                    errorText.toLowerCase()
                        .includes(
                            'captcha'
                        )
                ) {

                    profileError.textContent =
                        'Verifica di sicurezza non riuscita. Riprova.';
                }
                else {

                    profileError.textContent =
                        'Non è stato possibile avviare la chat. Riprova tra poco.';
                }
            }
            finally {

                submitButton.disabled =
                    false;
            }
        }
    );


    /* =====================================
       INVIO MESSAGGIO
       ===================================== */

    messageForm.addEventListener(
        'submit',
        async event => {

            event.preventDefault();


            messageError.textContent =
                '';


            const message =
                messageInput.value
                    .trim();


            if (
                !message ||
                !currentSessionId
            ) {
                return;
            }


            if (
                currentSessionStatus ===
                    'closed'
            ) {

                messageError.textContent =
                    'Questa conversazione è conclusa. Inizia una nuova chat.';


                return;
            }


            const sendButton =
                messageForm.querySelector(
                    '.live-chat-send'
                );


            sendButton.disabled =
                true;


            try {

                const userId =
                    await ensureVisitorAuth();


                const client =
                    await getLiveChatClient();


                const {
                    error
                } =
                    await client
                        .from(
                            'chat_messages'
                        )
                        .insert({
                            session_id:
                                currentSessionId,

                            sender:
                                'visitor',

                            sender_user_id:
                                userId,

                            message:
                                message
                        });


                if (error) {
                    throw error;
                }


                messageInput.value =
                    '';


                messageInput.focus();

            }
            catch (error) {

                console.error(
                    'Errore invio Live Chat:',
                    error
                );


                messageError.textContent =
                    'Messaggio non inviato. Controlla la connessione e riprova.';
            }
            finally {

                sendButton.disabled =
                    false;
            }
        }
    );


    messageInput.addEventListener(
        'keydown',
        event => {

            if (
                event.key === 'Enter' &&
                !event.shiftKey
            ) {

                event.preventDefault();


                messageForm.requestSubmit();
            }
        }
    );


    document.addEventListener(
        'keydown',
        event => {

            if (
                event.key === 'Escape' &&
                !newSessionConfirm.hidden
            ) {

                hideNewSessionConfirm();
            }
        }
    );


    document.addEventListener(
        'visibilitychange',
        () => {

            if (
                document.visibilityState ===
                    'visible' &&
                currentSessionId &&
                chatCard.classList.contains(
                    'open'
                ) &&
                !conversationScreen.hidden
            ) {

                markVisitorMessagesAsRead(
                    currentSessionId
                );
            }
        }
    );


    /* =====================================
       AVVIO PRESENZA E NOTIFICHE
       ===================================== */

    initSupportPresence();


    initVisitorUnreadTracking();

}

function initGlobalMotion() {

    /* =====================================
       REVEAL
       ===================================== */

    const motionObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    entry.target
                        .classList
                        .add('visible');


                    motionObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: .12,
                rootMargin:
                    '0px 0px -40px 0px'
            }
        );


    document
        .querySelectorAll('.reveal')
        .forEach(element => {

            if (
                element.dataset.motionBound ===
                'true'
            )
                return;


            element.dataset.motionBound =
                'true';


            motionObserver.observe(
                element
            );

        });


    /* =====================================
       STAGGER
       ===================================== */

    document
        .querySelectorAll('[data-stagger]')
        .forEach(container => {

            const children =
                Array.from(
                    container.children
                );


            children.forEach(
                (element, index) => {

                    element.classList.add(
                        'reveal',
                        'reveal-up'
                    );


                    const delay =
                        Math.min(
                            index * 90,
                            450
                        );


                    element.style
                        .setProperty(
                            '--reveal-delay',
                            `${delay}ms`
                        );


                    if (
                        element.dataset.motionBound !==
                        'true'
                    ) {

                        element.dataset.motionBound =
                            'true';


                        motionObserver.observe(
                            element
                        );

                    }

                });

        });


    /* =====================================
       COUNTER
       ===================================== */

    const countObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;


                    animateCounter(
                        entry.target
                    );


                    countObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: .6
            }
        );


    document
        .querySelectorAll('[data-count]')
        .forEach(element => {

            countObserver.observe(
                element
            );

        });


    function animateCounter(element) {

        const target =
            Number(
                element.dataset.count
            );


        if (
            !Number.isFinite(target)
        )
            return;


        const suffix =
            element.dataset.suffix || '';


        const prefix =
            element.dataset.prefix || '';


        const duration =
            1100;


        const startTime =
            performance.now();


        function update(now) {

            const progress =
                Math.min(
                    (now - startTime) /
                    duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const value =
                Math.round(
                    target * eased
                );


            element.textContent =
                prefix +
                value +
                suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            }

        }


        requestAnimationFrame(
            update
        );

    }


    /* =====================================
       SCROLL PROGRESS
       ===================================== */

    const backToTop =
        document.querySelector(
            '.back-to-top'
        );


    function updateScrollProgress() {

        if (!backToTop)
            return;


        const scrollTop =
            window.scrollY;


        const maxScroll =
            document.documentElement
                .scrollHeight -
            window.innerHeight;


        const progress =
            maxScroll > 0
                ? (
                    scrollTop /
                    maxScroll
                ) * 100
                : 0;


        backToTop.style
            .setProperty(
                '--scroll-progress',
                `${progress}%`
            );

    }


    window.addEventListener(
        'scroll',
        updateScrollProgress,
        {
            passive: true
        }
    );


    updateScrollProgress();

}

/* Avvia support widget */

initFloatingSupport();
initGlobalMotion();


/* =====================================
   COOKIE / PRIVACY PREFERENCES
   ===================================== */

function initCookieConsent() {

    const STORAGE_KEY =
        'turrin_cookie_preferences_v1';


    const CONSENT_VERSION =
        1;


    let currentPreferences =
        null;


    function readPreferences() {

        try {

            const raw =
                window.localStorage
                    .getItem(
                        STORAGE_KEY
                    );


            if (!raw)
                return null;


            const parsed =
                JSON.parse(raw);


            if (
                !parsed ||
                parsed.version !==
                    CONSENT_VERSION
            ) {
                return null;
            }


            return {
                version:
                    CONSENT_VERSION,

                necessary:
                    true,

                externalMedia:
                    parsed.externalMedia ===
                    true,

                updatedAt:
                    parsed.updatedAt ||
                    null
            };
        }
        catch (error) {

            console.warn(
                'Impossibile leggere le preferenze cookie:',
                error
            );


            return null;
        }
    }


    function savePreferences(
        preferences
    ) {

        currentPreferences = {
            version:
                CONSENT_VERSION,

            necessary:
                true,

            externalMedia:
                preferences.externalMedia ===
                true,

            updatedAt:
                new Date()
                    .toISOString()
        };


        try {

            window.localStorage
                .setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        currentPreferences
                    )
                );
        }
        catch (error) {

            console.warn(
                'Impossibile salvare le preferenze cookie:',
                error
            );
        }


        applyPreferences();


        hideBanner();


        closePreferences();


        document.dispatchEvent(
            new CustomEvent(
                'turrin:cookie-preferences-changed',
                {
                    detail:
                        currentPreferences
                }
            )
        );
    }


    function injectStyles() {

        if (
            document.getElementById(
                'turrinCookieConsentStyles'
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                'style'
            );


        style.id =
            'turrinCookieConsentStyles';


        style.textContent = `
            .turrin-cookie-banner {
                position: fixed;
                left: 20px;
                right: 20px;
                bottom: 20px;
                z-index: 2147482000;
                max-width: 1060px;
                margin: 0 auto;
                padding: 19px 20px;
                border: 1px solid #dce5ef;
                border-radius: 13px;
                background: rgba(255,255,255,.98);
                color: #31445e;
                box-shadow: 0 20px 65px rgba(7,27,58,.20);
                backdrop-filter: blur(12px);
            }

            .turrin-cookie-banner[hidden] {
                display: none !important;
            }

            .turrin-cookie-banner-inner {
                display: grid;
                grid-template-columns: minmax(0,1fr) auto;
                align-items: center;
                gap: 24px;
            }

            .turrin-cookie-banner h2 {
                margin: 0 0 6px;
                color: #071b3a;
                font-size: 15px;
                line-height: 1.3;
            }

            .turrin-cookie-banner p {
                margin: 0;
                max-width: 720px;
                color: #6b798c;
                font-size: 10px;
                line-height: 1.65;
            }

            .turrin-cookie-banner p a {
                color: #0759d8;
                font-weight: 800;
                text-decoration: none;
            }

            .turrin-cookie-actions {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 8px;
            }

            .turrin-cookie-button {
                min-height: 39px;
                padding: 0 13px;
                border: 1px solid #d3dde8;
                border-radius: 7px;
                background: #ffffff;
                color: #40516a;
                font: inherit;
                font-size: 10px;
                font-weight: 800;
                cursor: pointer;
            }

            .turrin-cookie-button:hover {
                border-color: #0759d8;
                color: #0759d8;
            }

            .turrin-cookie-button.primary {
                border-color: #0759d8;
                background: #0759d8;
                color: #ffffff;
            }

            .turrin-cookie-button.primary:hover {
                background: #064ab0;
                color: #ffffff;
            }

            .turrin-cookie-modal {
                position: fixed;
                inset: 0;
                z-index: 2147483000;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .turrin-cookie-modal.open {
                display: flex;
            }

            .turrin-cookie-modal-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(7,27,58,.58);
                backdrop-filter: blur(3px);
            }

            .turrin-cookie-modal-box {
                position: relative;
                width: min(620px,100%);
                max-height: min(760px,calc(100vh - 40px));
                overflow-y: auto;
                border: 1px solid #dce5ef;
                border-radius: 15px;
                background: #ffffff;
                box-shadow: 0 28px 80px rgba(7,27,58,.27);
            }

            .turrin-cookie-modal-head {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 18px;
                padding: 22px 23px;
                border-bottom: 1px solid #e5ebf2;
            }

            .turrin-cookie-modal-head h2 {
                margin: 0;
                color: #071b3a;
                font-size: 19px;
            }

            .turrin-cookie-modal-head p {
                margin: 7px 0 0;
                color: #718095;
                font-size: 10px;
                line-height: 1.6;
            }

            .turrin-cookie-close {
                width: 34px;
                height: 34px;
                flex: 0 0 auto;
                border: 1px solid #d8e1ec;
                border-radius: 7px;
                background: #ffffff;
                color: #53637a;
                font-size: 18px;
                line-height: 1;
                cursor: pointer;
            }

            .turrin-cookie-modal-body {
                display: grid;
                gap: 11px;
                padding: 21px 23px;
            }

            .turrin-cookie-category {
                display: grid;
                grid-template-columns: minmax(0,1fr) auto;
                align-items: center;
                gap: 18px;
                padding: 17px;
                border: 1px solid #e0e7ef;
                border-radius: 10px;
                background: #fafcff;
            }

            .turrin-cookie-category strong {
                display: block;
                color: #243a56;
                font-size: 12px;
            }

            .turrin-cookie-category p {
                margin: 6px 0 0;
                color: #748296;
                font-size: 9px;
                line-height: 1.6;
            }

            .turrin-cookie-required {
                min-width: 73px;
                padding: 6px 8px;
                border-radius: 999px;
                background: #eef2f6;
                color: #667589;
                font-size: 8px;
                font-weight: 900;
                text-align: center;
                text-transform: uppercase;
            }

            .turrin-cookie-switch {
                position: relative;
                width: 44px;
                height: 24px;
                display: inline-flex;
                flex: 0 0 auto;
            }

            .turrin-cookie-switch input {
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }

            .turrin-cookie-switch span {
                position: absolute;
                inset: 0;
                border-radius: 999px;
                background: #cbd5e1;
                cursor: pointer;
                transition: background .2s ease;
            }

            .turrin-cookie-switch span::after {
                content: '';
                position: absolute;
                top: 3px;
                left: 3px;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #ffffff;
                box-shadow: 0 2px 5px rgba(0,0,0,.16);
                transition: transform .2s ease;
            }

            .turrin-cookie-switch input:checked + span {
                background: #0759d8;
            }

            .turrin-cookie-switch input:checked + span::after {
                transform: translateX(20px);
            }

            .turrin-cookie-modal-foot {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 10px;
                padding: 18px 23px;
                border-top: 1px solid #e5ebf2;
                background: #fbfcfe;
            }

            .turrin-cookie-modal-links {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .turrin-cookie-modal-links a {
                color: #6f7e91;
                font-size: 9px;
                font-weight: 800;
                text-decoration: none;
            }

            .turrin-external-media {
                min-height: 420px;
                display: grid;
                place-items: center;
                padding: 28px;
                border: 1px solid #dce5ef;
                border-radius: 14px;
                background:
                    radial-gradient(circle at 78% 20%,rgba(7,89,216,.08),transparent 30%),
                    #f7f9fc;
                text-align: center;
            }

            .turrin-external-media[hidden] {
                display: none !important;
            }

            .turrin-external-media-inner {
                max-width: 520px;
            }

            .turrin-external-media-icon {
                width: 52px;
                height: 52px;
                display: grid;
                place-items: center;
                margin: 0 auto 15px;
                border-radius: 13px;
                background: #eaf2ff;
                color: #0759d8;
                font-size: 22px;
            }

            .turrin-external-media h3 {
                margin: 0;
                color: #071b3a;
                font-size: 18px;
            }

            .turrin-external-media p {
                margin: 9px auto 17px;
                color: #708095;
                font-size: 10px;
                line-height: 1.65;
            }

            .turrin-external-media-actions {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 8px;
            }

            iframe[data-cookie-service="google-maps"] {
                width: 100%;
                min-height: 420px;
                border: 0;
            }

            iframe[data-cookie-service="google-maps"][hidden] {
                display: none !important;
            }

            @media(max-width:760px) {
                .turrin-cookie-banner {
                    left: 12px;
                    right: 12px;
                    bottom: 12px;
                    padding: 16px;
                }

                .turrin-cookie-banner-inner {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }

                .turrin-cookie-actions {
                    justify-content: stretch;
                }

                .turrin-cookie-button {
                    flex: 1 1 130px;
                }

                .turrin-cookie-modal-foot {
                    align-items: stretch;
                    flex-direction: column;
                }

                .turrin-cookie-modal-foot .turrin-cookie-button {
                    width: 100%;
                }

                .turrin-external-media {
                    min-height: 350px;
                }
            }
        `;


        document.head
            .appendChild(
                style
            );
    }


    function injectInterface() {

        if (
            document.getElementById(
                'turrinCookieBanner'
            )
        ) {
            return;
        }


        const root =
            document.createElement(
                'div'
            );


        root.innerHTML = `
            <section
                class="turrin-cookie-banner"
                id="turrinCookieBanner"
                aria-label="Preferenze cookie"
                hidden>

                <div class="turrin-cookie-banner-inner">

                    <div>
                        <h2>
                            Privacy e contenuti esterni
                        </h2>

                        <p>
                            Utilizziamo tecnologie necessarie al funzionamento e alla sicurezza del sito.
                            Con il tuo consenso possiamo inoltre caricare contenuti esterni, come Google Maps.
                            Puoi modificare la scelta in qualsiasi momento.
                            <a href="${getRoot()}cookie-policy.html">Cookie Policy</a>
                        </p>
                    </div>

                    <div class="turrin-cookie-actions">

                        <button
                            class="turrin-cookie-button"
                            type="button"
                            data-cookie-choice="necessary">
                            Solo necessari
                        </button>

                        <button
                            class="turrin-cookie-button"
                            type="button"
                            data-cookie-settings>
                            Preferenze
                        </button>

                        <button
                            class="turrin-cookie-button primary"
                            type="button"
                            data-cookie-choice="all">
                            Accetta tutti
                        </button>

                    </div>

                </div>

            </section>


            <div
                class="turrin-cookie-modal"
                id="turrinCookieModal"
                aria-hidden="true">

                <div
                    class="turrin-cookie-modal-backdrop"
                    data-cookie-close>
                </div>

                <div
                    class="turrin-cookie-modal-box"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="turrinCookieModalTitle">

                    <div class="turrin-cookie-modal-head">

                        <div>
                            <h2 id="turrinCookieModalTitle">
                                Preferenze cookie
                            </h2>

                            <p>
                                Scegli quali categorie opzionali consentire.
                                Le tecnologie necessarie restano sempre attive.
                            </p>
                        </div>

                        <button
                            class="turrin-cookie-close"
                            type="button"
                            aria-label="Chiudi preferenze cookie"
                            data-cookie-close>
                            ×
                        </button>

                    </div>

                    <div class="turrin-cookie-modal-body">

                        <div class="turrin-cookie-category">

                            <div>
                                <strong>
                                    Necessari e sicurezza
                                </strong>

                                <p>
                                    Funzioni tecniche, autenticazione richiesta dai servizi,
                                    protezione antifrode e strumenti indispensabili al funzionamento del sito.
                                </p>
                            </div>

                            <span class="turrin-cookie-required">
                                Sempre attivi
                            </span>

                        </div>

                        <div class="turrin-cookie-category">

                            <div>
                                <strong>
                                    Contenuti esterni
                                </strong>

                                <p>
                                    Consente il caricamento di servizi di terze parti come Google Maps.
                                    Disattivando questa categoria la mappa resta bloccata.
                                </p>
                            </div>

                            <label class="turrin-cookie-switch">

                                <input
                                    id="turrinExternalMediaConsent"
                                    type="checkbox">

                                <span aria-hidden="true"></span>

                            </label>

                        </div>

                    </div>

                    <div class="turrin-cookie-modal-foot">

                        <div class="turrin-cookie-modal-links">
                            <a href="${getRoot()}privacy.html">Privacy</a>
                            <a href="${getRoot()}cookie-policy.html">Cookie Policy</a>
                        </div>

                        <button
                            class="turrin-cookie-button primary"
                            id="turrinSaveCookiePreferences"
                            type="button">
                            Salva preferenze
                        </button>

                    </div>

                </div>

            </div>
        `;


        while (
            root.firstElementChild
        ) {

            document.body
                .appendChild(
                    root.firstElementChild
                );
        }
    }


    function getRoot() {

        const header =
            document.getElementById(
                'siteHeader'
            );


        return (
            header?.dataset.root ||
            './'
        );
    }


    function getBanner() {

        return document.getElementById(
            'turrinCookieBanner'
        );
    }


    function getModal() {

        return document.getElementById(
            'turrinCookieModal'
        );
    }


    function showBanner() {

        const banner =
            getBanner();


        if (banner)
            banner.hidden = false;
    }


    function hideBanner() {

        const banner =
            getBanner();


        if (banner)
            banner.hidden = true;
    }


    function openPreferences() {

        const modal =
            getModal();


        const checkbox =
            document.getElementById(
                'turrinExternalMediaConsent'
            );


        if (checkbox) {

            checkbox.checked =
                currentPreferences
                    ?.externalMedia ===
                true;
        }


        if (!modal)
            return;


        modal.classList.add(
            'open'
        );


        modal.setAttribute(
            'aria-hidden',
            'false'
        );


        document.body.style
            .overflow =
            'hidden';
    }


    function closePreferences() {

        const modal =
            getModal();


        if (!modal)
            return;


        modal.classList.remove(
            'open'
        );


        modal.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.style
            .overflow =
            '';
    }


    function enableExternalMedia() {

        document
            .querySelectorAll(
                'iframe[data-cookie-service="google-maps"]'
            )
            .forEach(
                iframe => {

                    const src =
                        iframe.dataset
                            .cookieSrc;


                    if (
                        src &&
                        iframe.getAttribute(
                            'src'
                        ) !== src
                    ) {

                        iframe.setAttribute(
                            'src',
                            src
                        );
                    }


                    iframe.hidden =
                        false;
                }
            );


        document
            .querySelectorAll(
                '[data-cookie-placeholder="google-maps"]'
            )
            .forEach(
                placeholder => {
                    placeholder.hidden =
                        true;
                }
            );
    }


    function disableExternalMedia() {

        document
            .querySelectorAll(
                'iframe[data-cookie-service="google-maps"]'
            )
            .forEach(
                iframe => {

                    iframe.hidden =
                        true;


                    iframe.removeAttribute(
                        'src'
                    );
                }
            );


        document
            .querySelectorAll(
                '[data-cookie-placeholder="google-maps"]'
            )
            .forEach(
                placeholder => {
                    placeholder.hidden =
                        false;
                }
            );
    }


    function applyPreferences() {

        if (
            currentPreferences
                ?.externalMedia ===
            true
        ) {
            enableExternalMedia();
        }
        else {
            disableExternalMedia();
        }
    }


    function handleClick(
        event
    ) {

        const settingsButton =
            event.target.closest(
                '[data-cookie-settings]'
            );


        if (settingsButton) {

            event.preventDefault();

            openPreferences();

            return;
        }


        const closeButton =
            event.target.closest(
                '[data-cookie-close]'
            );


        if (closeButton) {

            event.preventDefault();

            closePreferences();

            return;
        }


        const choiceButton =
            event.target.closest(
                '[data-cookie-choice]'
            );


        if (choiceButton) {

            event.preventDefault();


            savePreferences({
                externalMedia:
                    choiceButton.dataset
                        .cookieChoice ===
                    'all'
            });


            return;
        }


        const enableButton =
            event.target.closest(
                '[data-cookie-enable="externalMedia"]'
            );


        if (enableButton) {

            event.preventDefault();


            savePreferences({
                externalMedia:
                    true
            });


            return;
        }
    }


    function createMissingMapPlaceholders() {

        document
            .querySelectorAll(
                'iframe[data-cookie-service="google-maps"]'
            )
            .forEach(
                iframe => {

                    const container =
                        iframe.parentElement;


                    if (!container)
                        return;


                    if (
                        container.querySelector(
                            '[data-cookie-placeholder="google-maps"]'
                        )
                    ) {
                        return;
                    }


                    const placeholder =
                        document.createElement(
                            'div'
                        );


                    placeholder.className =
                        'turrin-external-media';


                    placeholder.dataset
                        .cookiePlaceholder =
                        'google-maps';


                    placeholder.innerHTML = `
                        <div class="turrin-external-media-inner">

                            <div class="turrin-external-media-icon" aria-hidden="true">
                                ⌖
                            </div>

                            <h3>
                                Mappa Google
                            </h3>

                            <p>
                                Per visualizzare la mappa è necessario autorizzare
                                i contenuti esterni. Google Maps verrà caricato
                                soltanto dopo la tua scelta.
                            </p>

                            <div class="turrin-external-media-actions">

                                <button
                                    class="turrin-cookie-button primary"
                                    type="button"
                                    data-cookie-enable="externalMedia">
                                    Visualizza mappa
                                </button>

                                <button
                                    class="turrin-cookie-button"
                                    type="button"
                                    data-cookie-settings>
                                    Preferenze cookie
                                </button>

                            </div>

                        </div>
                    `;


                    container.insertBefore(
                        placeholder,
                        iframe
                    );
                }
            );
    }


    function start() {

        injectStyles();

        injectInterface();

        createMissingMapPlaceholders();


        currentPreferences =
            readPreferences();


        applyPreferences();


        if (!currentPreferences)
            showBanner();


        document.addEventListener(
            'click',
            handleClick
        );


        document.addEventListener(
            'keydown',
            event => {

                if (
                    event.key ===
                        'Escape' &&
                    getModal()
                        ?.classList
                        .contains(
                            'open'
                        )
                ) {
                    closePreferences();
                }
            }
        );


        document
            .getElementById(
                'turrinSaveCookiePreferences'
            )
            ?.addEventListener(
                'click',
                () => {

                    const checkbox =
                        document.getElementById(
                            'turrinExternalMediaConsent'
                        );


                    savePreferences({
                        externalMedia:
                            checkbox
                                ?.checked ===
                            true
                    });
                }
            );
    }


    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            start,
            {
                once: true
            }
        );
    }
    else {
        start();
    }
}


initCookieConsent();
