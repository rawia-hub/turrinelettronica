(() => {
    'use strict';

    const SUPABASE_URL =
        'https://gxlquwudampvcuxiocmh.supabase.co';

    const SUPABASE_KEY =
        'sb_publishable_TXv6HGzmzYe2c-CFD2hkkQ_qzkOa4XR';


    let sharedSupabase = null;


    function ensureStyles() {

        if (
            document.getElementById(
                'turrin-shared-updates-styles'
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                'style'
            );


        style.id =
            'turrin-shared-updates-styles';


        style.textContent = `

            /* =========================================
               COMPONENTE AGGIORNAMENTI CONDIVISO
               ========================================= */

            .shared-updates-section {
                position: relative;
                overflow: hidden;
                padding: 82px 0;
                background:
                    linear-gradient(
                        180deg,
                        #f8fbff 0%,
                        #f3f7fc 100%
                    );
            }


            .shared-updates-heading {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 32px;
                margin-bottom: 31px;
            }


            .shared-updates-heading-copy {
                max-width: 760px;
            }


            .shared-updates-heading .section-label {
                display: inline-flex;
                margin-bottom: 12px;
                color: #0759d8;
                font-size: 10px;
                font-weight: 900;
                letter-spacing: .09em;
                text-transform: uppercase;
            }


            .shared-updates-heading h2 {
                margin: 0;
                color: #071b3a;
                font-size: clamp(29px, 3.4vw, 42px);
                line-height: 1.12;
                letter-spacing: -.035em;
            }


            .shared-updates-heading p {
                max-width: 670px;
                margin: 13px 0 0;
                color: #6e7d91;
                font-size: 12px;
                line-height: 1.72;
            }


            .shared-updates-all-link {
                flex: 0 0 auto;
                display: inline-flex;
                align-items: center;
                gap: 7px;
                color: #0759d8;
                font-size: 10px;
                font-weight: 900;
                text-decoration: none;
                white-space: nowrap;
            }


            .shared-updates-all-link span {
                transition: transform .2s ease;
            }


            .shared-updates-all-link:hover span {
                transform: translateX(3px);
            }


            .shared-updates-carousel {
                position: relative;
                width: 100%;
                min-width: 0;
            }


            .shared-updates-track {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                overflow-y: hidden;
                padding: 2px 1px 5px;
                scroll-snap-type: x mandatory;
                scroll-behavior: smooth;
                scrollbar-width: none;
                -ms-overflow-style: none;
                -webkit-overflow-scrolling: touch;
                cursor: grab;
            }


            .shared-updates-track::-webkit-scrollbar {
                display: none;
            }


            .shared-updates-track.is-dragging {
                cursor: grabbing;
                scroll-behavior: auto;
                scroll-snap-type: none;
                user-select: none;
            }


            .shared-updates-track,
            .shared-updates-track * {
                -webkit-user-drag: none;
            }


            .shared-update-card {
                flex: 0 0 calc((100% - 40px) / 3);
                min-width: 0;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                scroll-snap-align: start;
                scroll-snap-stop: always;
                border: 1px solid #dfe7f0;
                border-radius: 15px;
                background: #ffffff;
                box-shadow:
                    0 10px 32px
                    rgba(24, 50, 83, .055);
                transition:
                    transform .25s ease,
                    box-shadow .25s ease,
                    border-color .25s ease;
            }


            .shared-update-card:hover {
                transform: translateY(-4px);
                border-color: #cbd8e7;
                box-shadow:
                    0 18px 45px
                    rgba(22, 49, 83, .10);
            }


            .shared-update-image-link {
                display: block;
                color: inherit;
                text-decoration: none;
            }


            .shared-update-image {
                position: relative;
                aspect-ratio: 16 / 10;
                overflow: hidden;
                background:
                    linear-gradient(
                        135deg,
                        #e9f1fb,
                        #f8fbff
                    );
            }


            .shared-update-image img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
                user-select: none;
                -webkit-user-select: none;
                transition: transform .45s ease;
            }


            .shared-update-card:hover
            .shared-update-image img {
                transform: scale(1.035);
            }


            .shared-update-image::after {
                content: '';
                position: absolute;
                inset: auto 0 0;
                height: 30%;
                background:
                    linear-gradient(
                        180deg,
                        transparent,
                        rgba(7, 27, 58, .11)
                    );
                pointer-events: none;
            }


            .shared-update-product-badge {
                position: absolute;
                top: 14px;
                left: 14px;
                z-index: 2;
                min-height: 27px;
                display: inline-flex;
                align-items: center;
                padding: 0 10px;
                border: 1px solid rgba(255,255,255,.76);
                border-radius: 999px;
                background: rgba(255,255,255,.92);
                color: #0759d8;
                font-size: 8px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: .045em;
                box-shadow:
                    0 5px 15px
                    rgba(7, 27, 58, .10);
                backdrop-filter: blur(9px);
            }


            .shared-update-placeholder {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 28px;
                color: #ffffff;
                text-align: center;
                font-size: 23px;
                font-weight: 900;
                letter-spacing: -.025em;
            }


            .shared-update-placeholder::before {
                content: '';
                position: absolute;
                width: 165px;
                height: 165px;
                right: -62px;
                bottom: -82px;
                border: 1px solid rgba(255,255,255,.18);
                border-radius: 50%;
                box-shadow:
                    0 0 0 34px rgba(255,255,255,.035),
                    0 0 0 68px rgba(255,255,255,.022);
            }


            .shared-update-placeholder span {
                position: relative;
                z-index: 1;
            }


            .shared-update-placeholder.te-mc3 {
                background: linear-gradient(135deg,#0759d8,#071b3a);
            }


            .shared-update-placeholder.te-trace {
                background: linear-gradient(135deg,#17263e,#0759d8);
            }


            .shared-update-placeholder.te-tuning {
                background: linear-gradient(135deg,#09598f,#071b3a);
            }


            .shared-update-placeholder.te-check {
                background: linear-gradient(135deg,#315a80,#071b3a);
            }


            .shared-update-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 21px 21px 19px;
            }


            .shared-update-meta {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 10px;
            }


            .shared-update-product {
                color: #0759d8;
                font-size: 8px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: .06em;
            }


            .shared-update-version {
                color: #8a97a8;
                font-size: 8px;
                font-weight: 700;
            }


            .shared-update-title-link {
                color: inherit;
                text-decoration: none;
            }


            .shared-update-title {
                margin: 0;
                color: #132e4e;
                font-size: 17px;
                line-height: 1.33;
                letter-spacing: -.02em;
                transition: color .2s ease;
            }


            .shared-update-title-link:hover
            .shared-update-title {
                color: #0759d8;
            }


            .shared-update-description {
                margin: 11px 0 0;
                display: -webkit-box;
                overflow: hidden;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                color: #718095;
                font-size: 10px;
                line-height: 1.7;
            }


            .shared-update-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 13px;
                margin-top: auto;
                padding-top: 18px;
            }


            .shared-update-date {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: #8996a7;
                font-size: 8px;
                font-weight: 700;
            }


            .shared-update-date svg {
                width: 13px;
                height: 13px;
            }


            .shared-update-more {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                color: #0759d8;
                font-size: 9px;
                font-weight: 900;
                text-decoration: none;
                white-space: nowrap;
            }


            .shared-update-more span {
                transition: transform .2s ease;
            }


            .shared-update-more:hover span {
                transform: translateX(3px);
            }


            .shared-updates-dots {
                min-height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 23px;
            }


            .shared-updates-dots[hidden] {
                display: none;
            }


            .shared-updates-dot {
                width: 8px;
                height: 8px;
                flex: 0 0 auto;
                padding: 0;
                border: 0;
                border-radius: 999px;
                background: rgba(7,89,216,.20);
                cursor: pointer;
                transition:
                    width .25s ease,
                    background-color .25s ease,
                    transform .25s ease;
            }


            .shared-updates-dot:hover {
                transform: scale(1.12);
            }


            .shared-updates-dot.active {
                width: 24px;
                background: #0759d8;
            }


            .shared-updates-dot:focus-visible {
                outline: 2px solid rgba(7,89,216,.35);
                outline-offset: 4px;
            }


            .shared-updates-spacer {
                height: 1px;
                flex: 0 0 0;
                pointer-events: none;
            }


            .shared-updates-message {
                width: 100%;
                flex: 0 0 100%;
                padding: 42px 24px;
                border: 1px dashed #d5dfeb;
                border-radius: 11px;
                background: rgba(255,255,255,.75);
                color: #758497;
                font-size: 11px;
                line-height: 1.6;
                text-align: center;
            }


            .shared-updates-message.error {
                border-color: #efcdcd;
                background: #fff7f7;
                color: #a54040;
            }


            @media(max-width: 920px) {

                .shared-update-card {
                    flex-basis: calc((100% - 20px) / 2);
                }
            }


            @media(max-width: 680px) {

                .shared-updates-section {
                    padding: 64px 0;
                }


                .shared-updates-heading {
                    align-items: flex-start;
                    flex-direction: column;
                    gap: 18px;
                }


                .shared-updates-track {
                    gap: 14px;
                }


                .shared-update-card {
                    flex-basis: 100%;
                }


                .shared-update-content {
                    padding: 19px;
                }
            }


            @media(max-width: 420px) {

                .shared-update-meta,
                .shared-update-footer {
                    align-items: flex-start;
                    flex-direction: column;
                }
            }
        `;


        document.head.appendChild(
            style
        );
    }


    function getClient() {

        if (sharedSupabase)
            return sharedSupabase;


        if (
            !window.supabase ||
            typeof window.supabase.createClient !==
                'function'
        ) {
            return null;
        }


        sharedSupabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        return sharedSupabase;
    }


    function escapeHtml(value) {

        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }


    function formatDate(value) {

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


        return date.toLocaleDateString(
            'it-IT',
            {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }
        );
    }


    function getProductClass(
        productKey
    ) {

        switch (productKey) {

            case 'mc3':
                return 'te-mc3';

            case 'trace':
                return 'te-trace';

            case 'tuning':
                return 'te-tuning';

            case 'check':
                return 'te-check';

            default:
                return 'te-mc3';
        }
    }


    function getImageUrl(
        client,
        imagePath
    ) {

        if (!imagePath)
            return null;


        const {
            data
        } =
            client
                .storage
                .from('updates')
                .getPublicUrl(
                    imagePath
                );


        return data?.publicUrl || null;
    }


    function normalizeRoot(root) {

        const value =
            String(root || './');


        if (
            value.endsWith('/')
        ) {
            return value;
        }


        return value + '/';
    }


    function createCard(
        client,
        update,
        root
    ) {

        const product =
            escapeHtml(
                update.product_name || ''
            );


        const version =
            escapeHtml(
                update.version || ''
            );


        const title =
            escapeHtml(
                update.title || ''
            );


        const description =
            escapeHtml(
                update.description || ''
            );


        const date =
            escapeHtml(
                formatDate(
                    update.published_at
                )
            );


        const imageUrl =
            getImageUrl(
                client,
                update.image_path
            );


        const detailUrl =
            root +
            'aggiornamento.html?id=' +
            encodeURIComponent(
                update.id
            );


        const imageHtml =
            imageUrl
                ? `
                    <img
                        src="${escapeHtml(imageUrl)}"
                        alt="${title}"
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                    >
                  `
                : `
                    <div
                        class="
                            shared-update-placeholder
                            ${getProductClass(
                                update.product_key
                            )}
                        ">

                        <span>
                            ${product}
                        </span>

                    </div>
                  `;


        return `
            <article class="shared-update-card">

                <a
                    class="shared-update-image-link"
                    href="${detailUrl}"
                    draggable="false"
                    aria-label="Apri ${title}">

                    <div class="shared-update-image">

                        ${imageHtml}

                        <span
                            class="shared-update-product-badge">
                            ${product}
                        </span>

                    </div>

                </a>


                <div class="shared-update-content">

                    <div class="shared-update-meta">

                        <span class="shared-update-product">
                            ${product}
                        </span>

                        ${
                            version
                                ? `
                                    <span class="shared-update-version">
                                        v. ${version}
                                    </span>
                                  `
                                : ''
                        }

                    </div>


                    <a
                        class="shared-update-title-link"
                        href="${detailUrl}">

                        <h3 class="shared-update-title">
                            ${title}
                        </h3>

                    </a>


                    ${
                        description
                            ? `
                                <p class="shared-update-description">
                                    ${description}
                                </p>
                              `
                            : ''
                    }


                    <div class="shared-update-footer">

                        <time
                            class="shared-update-date"
                            datetime="${escapeHtml(
                                update.published_at || ''
                            )}">

                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true">

                                <rect
                                    x="4"
                                    y="5"
                                    width="16"
                                    height="15"
                                    rx="2"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.7">
                                </rect>

                                <path
                                    d="M8 3v4M16 3v4M4 9h16"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round">
                                </path>

                            </svg>

                            ${date}

                        </time>


                        <a
                            class="shared-update-more"
                            href="${detailUrl}">

                            Leggi aggiornamento
                            <span>→</span>

                        </a>

                    </div>

                </div>

            </article>
        `;
    }


    function initCarousel(
        track,
        dotsContainer
    ) {

        if (
            !track ||
            !dotsContainer
        ) {
            return;
        }


        let isDragging = false;
        let hasDragged = false;

        let startX = 0;
        let startScrollLeft = 0;

        let resizeTimer = null;
        let scrollFrame = null;


        let spacer =
            track.querySelector(
                '.shared-updates-spacer'
            );


        if (!spacer) {

            spacer =
                document.createElement(
                    'div'
                );


            spacer.className =
                'shared-updates-spacer';


            spacer.setAttribute(
                'aria-hidden',
                'true'
            );


            track.appendChild(
                spacer
            );
        }


        function getCards() {

            return Array.from(
                track.querySelectorAll(
                    '.shared-update-card'
                )
            );
        }


        function getItemsPerPage() {

            if (
                window.innerWidth <=
                680
            ) {
                return 1;
            }


            if (
                window.innerWidth <=
                920
            ) {
                return 2;
            }


            return 3;
        }


        function getPageCount() {

            const cards =
                getCards();


            if (!cards.length)
                return 0;


            return Math.ceil(
                cards.length /
                getItemsPerPage()
            );
        }


        function preparePages() {

            const cards =
                getCards();


            const perPage =
                getItemsPerPage();


            cards.forEach(
                (card, index) => {

                    card.style
                        .scrollSnapAlign =
                        index % perPage === 0
                            ? 'start'
                            : 'none';
                }
            );


            if (
                !cards.length ||
                perPage <= 1
            ) {

                spacer.style.display =
                    'none';


                spacer.style.flexBasis =
                    '0px';


                return;
            }


            const remainder =
                cards.length % perPage;


            const missing =
                remainder === 0
                    ? 0
                    : perPage - remainder;


            if (!missing) {

                spacer.style.display =
                    'none';


                spacer.style.flexBasis =
                    '0px';


                return;
            }


            const cardWidth =
                cards[0]
                    .getBoundingClientRect()
                    .width;


            const trackStyle =
                window.getComputedStyle(
                    track
                );


            const gap =
                parseFloat(
                    trackStyle.columnGap ||
                    trackStyle.gap ||
                    '0'
                ) || 0;


            const spacerWidth =
                (
                    missing *
                    cardWidth
                ) +
                (
                    Math.max(
                        0,
                        missing - 1
                    ) *
                    gap
                );


            spacer.style.display =
                'block';


            spacer.style.flexBasis =
                `${spacerWidth}px`;
        }


        function getPagePosition(
            pageIndex
        ) {

            const cards =
                getCards();


            const perPage =
                getItemsPerPage();


            if (!cards.length)
                return 0;


            const cardIndex =
                Math.min(
                    pageIndex * perPage,
                    cards.length - 1
                );


            return (
                cards[cardIndex].offsetLeft -
                track.offsetLeft
            );
        }


        function updateActiveDot() {

            const dots =
                dotsContainer
                    .querySelectorAll(
                        '.shared-updates-dot'
                    );


            if (!dots.length)
                return;


            let nearestPage = 0;
            let nearestDistance =
                Infinity;


            dots.forEach(
                (dot, index) => {

                    const distance =
                        Math.abs(
                            track.scrollLeft -
                            getPagePosition(
                                index
                            )
                        );


                    if (
                        distance <
                        nearestDistance
                    ) {

                        nearestDistance =
                            distance;


                        nearestPage =
                            index;
                    }
                }
            );


            dots.forEach(
                (dot, index) => {

                    const active =
                        index ===
                        nearestPage;


                    dot.classList.toggle(
                        'active',
                        active
                    );


                    if (active) {

                        dot.setAttribute(
                            'aria-current',
                            'true'
                        );
                    }
                    else {

                        dot.removeAttribute(
                            'aria-current'
                        );
                    }
                }
            );
        }


        function buildDots() {

            preparePages();


            const pageCount =
                getPageCount();


            dotsContainer.innerHTML =
                '';


            if (pageCount <= 1) {

                dotsContainer.hidden =
                    true;


                return;
            }


            dotsContainer.hidden =
                false;


            for (
                let page = 0;
                page < pageCount;
                page++
            ) {

                const dot =
                    document.createElement(
                        'button'
                    );


                dot.type =
                    'button';


                dot.className =
                    'shared-updates-dot';


                dot.setAttribute(
                    'aria-label',
                    `Vai alla pagina ${page + 1} degli aggiornamenti`
                );


                dot.addEventListener(
                    'click',
                    () => {

                        track.scrollTo({
                            left:
                                getPagePosition(
                                    page
                                ),

                            behavior:
                                'smooth'
                        });
                    }
                );


                dotsContainer.appendChild(
                    dot
                );
            }


            updateActiveDot();
        }


        track.addEventListener(
            'scroll',
            () => {

                if (scrollFrame) {

                    cancelAnimationFrame(
                        scrollFrame
                    );
                }


                scrollFrame =
                    requestAnimationFrame(
                        updateActiveDot
                    );
            },
            {
                passive: true
            }
        );


        track.addEventListener(
            'dragstart',
            event => {

                event.preventDefault();
            }
        );


        track.addEventListener(
            'mousedown',
            event => {

                if (event.button !== 0)
                    return;


                isDragging = true;
                hasDragged = false;


                event.preventDefault();


                startX =
                    event.pageX;


                startScrollLeft =
                    track.scrollLeft;


                track.classList.add(
                    'is-dragging'
                );
            }
        );


        window.addEventListener(
            'mousemove',
            event => {

                if (!isDragging)
                    return;


                const distance =
                    event.pageX -
                    startX;


                if (
                    Math.abs(distance) >
                    5
                ) {

                    hasDragged =
                        true;
                }


                track.scrollLeft =
                    startScrollLeft -
                    distance;
            }
        );


        window.addEventListener(
            'mouseup',
            () => {

                if (!isDragging)
                    return;


                isDragging =
                    false;


                track.classList.remove(
                    'is-dragging'
                );


                const pageCount =
                    getPageCount();


                let nearestPage = 0;
                let nearestDistance =
                    Infinity;


                for (
                    let page = 0;
                    page < pageCount;
                    page++
                ) {

                    const position =
                        getPagePosition(
                            page
                        );


                    const distance =
                        Math.abs(
                            track.scrollLeft -
                            position
                        );


                    if (
                        distance <
                        nearestDistance
                    ) {

                        nearestDistance =
                            distance;


                        nearestPage =
                            page;
                    }
                }


                track.scrollTo({
                    left:
                        getPagePosition(
                            nearestPage
                        ),

                    behavior:
                        'smooth'
                });
            }
        );


        track.addEventListener(
            'click',
            event => {

                if (!hasDragged)
                    return;


                event.preventDefault();


                event.stopPropagation();


                hasDragged =
                    false;
            },
            true
        );


        window.addEventListener(
            'resize',
            () => {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    window.setTimeout(
                        () => {

                            track.scrollLeft =
                                0;


                            buildDots();
                        },
                        150
                    );
            }
        );


        buildDots();
    }


    async function initComponent(
        section
    ) {

        if (
            section.dataset
                .updatesReady ===
            'true'
        ) {
            return;
        }


        section.dataset
            .updatesReady =
            'true';


        const client =
            getClient();


        const track =
            section.querySelector(
                '[data-updates-grid]'
            );


        const dotsContainer =
            section.querySelector(
                '[data-updates-dots]'
            );


        if (!track)
            return;


        track.innerHTML = `
            <div class="shared-updates-message">
                Caricamento aggiornamenti...
            </div>
        `;


        if (!client) {

            track.innerHTML = `
                <div class="shared-updates-message error">
                    Configurazione Supabase non disponibile.
                </div>
            `;


            return;
        }


        const root =
            normalizeRoot(
                section.dataset
                    .updatesRoot ||
                './'
            );


        const product =
            String(
                section.dataset
                    .updatesProduct ||
                'all'
            );


        const requestedLimit =
            Number(
                section.dataset
                    .updatesLimit ||
                9
            );


        const limit =
            Number.isFinite(
                requestedLimit
            )
                ? Math.max(
                    1,
                    Math.min(
                        requestedLimit,
                        30
                    )
                  )
                : 9;


        let query =
            client
                .from('updates')
                .select(`
                    id,
                    product_key,
                    product_name,
                    version,
                    title,
                    description,
                    image_path,
                    published_at
                `)
                .eq(
                    'published',
                    true
                )
                .order(
                    'published_at',
                    {
                        ascending: false
                    }
                )
                .limit(
                    limit
                );


        if (
            product &&
            product !== 'all'
        ) {

            query =
                query.eq(
                    'product_key',
                    product
                );
        }


        const {
            data,
            error
        } =
            await query;


        if (error) {

            console.error(
                'Errore aggiornamenti condivisi:',
                error
            );


            track.innerHTML = `
                <div class="shared-updates-message error">
                    Impossibile caricare gli aggiornamenti.
                </div>
            `;


            if (dotsContainer) {
                dotsContainer.hidden =
                    true;
            }


            return;
        }


        if (
            !data ||
            data.length === 0
        ) {

            track.innerHTML = `
                <div class="shared-updates-message">
                    Nessun aggiornamento disponibile.
                </div>
            `;


            if (dotsContainer) {
                dotsContainer.hidden =
                    true;
            }


            return;
        }


        track.innerHTML =
            data
                .map(
                    update =>
                        createCard(
                            client,
                            update,
                            root
                        )
                )
                .join('');


        if (
            dotsContainer &&
            section.dataset
                .updatesCarousel !==
                'false'
        ) {

            initCarousel(
                track,
                dotsContainer
            );
        }
        else if (dotsContainer) {

            dotsContainer.hidden =
                true;
        }
    }


    async function initAll() {

        ensureStyles();


        const components =
            Array.from(
                document.querySelectorAll(
                    '[data-updates-component]'
                )
            );


        await Promise.all(
            components.map(
                initComponent
            )
        );
    }


    window.TurrinUpdates = {
        init: initAll
    };


    if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initAll,
            {
                once: true
            }
        );
    }
    else {

        initAll();
    }

})();
