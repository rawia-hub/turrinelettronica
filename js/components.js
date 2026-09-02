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

                        <strong id="liveChatVisitorName">
                            Cliente
                        </strong>

                        <span id="liveChatSessionState">
                            Conversazione attiva
                        </span>

                    </div>


                    <div
                        class="live-chat-messages"
                        id="liveChatMessages"
                        aria-live="polite">

                        <div class="live-chat-empty">
                            Scrivi il primo messaggio.
                        </div>

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
                        I messaggi vengono salvati per consentire
                        al supporto di rispondere alla richiesta.
                    </span>

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


    let messagesChannel =
        null;


    let presenceChannel =
        null;


    let restoreAttempted =
        false;


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


        statusText.textContent =
            online
                ? 'Online'
                : 'Lascia un messaggio';


        if (sessionState) {

            sessionState.textContent =
                online
                    ? 'Supporto online'
                    : 'Messaggio registrato';
        }
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


        const {
            data,
            error
        } =
            await client.auth
                .signInAnonymously();


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


        setChatScreen(
            'conversation'
        );


        await loadMessages(
            currentSessionId
        );


        await subscribeToMessages(
            currentSessionId
        );


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
                        'id, visitor_name, visitor_email, status'
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
                            'id, visitor_name, visitor_email, status'
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


                profileError.textContent =
                    'Non è stato possibile avviare la chat. Riprova tra poco.';
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


    /* =====================================
       AVVIO PRESENZA
       ===================================== */

    initSupportPresence();

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
