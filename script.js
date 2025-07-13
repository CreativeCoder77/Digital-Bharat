/**
 * Debounces a function, so it only runs after a certain delay.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Formats raw text (potentially with Markdown-like syntax) for HTML display.
 * @param {string} text - The input text.
 * @returns {string} The formatted HTML string.
 */
function formatTextForDisplay(text) {
    return text
        .replace(/^##\s*(.*)$/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>') // Convert ## to h2
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to strong
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert *text* to em
        .replace(/\n/g, '<br>'); // Convert newlines to <br> tags
}

/**
 * Displays the generated answer in the specified elements.
 * @param {string} text - The text content to display.
 * @param {HTMLElement} textElement - The element where the text will be inserted.
 * @param {HTMLElement} outputElement - The container element to make visible.
 */
function showAnswerOutput(text, textElement, outputElement) {
    if (textElement) textElement.innerHTML = formatTextForDisplay(text);
    if (outputElement) outputElement.classList.remove('hidden');
}

/**
 * Opens the 'Get Involved' modal and prevents background scrolling.
 */
function openInvolvedModal() {
    document.getElementById('get-involved-modal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Prevent scrolling
}

/**
 * Closes the 'Get Involved' modal and re-enables background scrolling.
 */
function closeInvolvedModal() {
    document.getElementById('get-involved-modal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden'); // Re-enable scrolling
}

/**
 * Opens the success notification modal and prevents background scrolling.
 */
function openSuccessNotificationModal() {
    document.getElementById('success-notification-modal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Prevent scrolling
}

/**
 * Closes the success notification modal and re-enables background scrolling.
 */
function closeSuccessNotificationModal() {
    document.getElementById('success-notification-modal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden'); // Re-enable scrolling
}

/**
 * Closes the STEAM modal and re-enables background scrolling.
 */
function closeSteamModal() {
    const modal = document.getElementById('modal-steam');
    if (modal) modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden'); // Re-enable scrolling
}

/**
 * Sets up event listeners for closing modals by clicking outside or pressing Escape.
 * @param {string} modalId - The ID of the modal element.
 * @param {Function} closeFunction - The function to call to close the modal.
 */
function setupModalCloseHandlers(modalId, closeFunction) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeFunction();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeFunction();
        }
    });
}

/**
 * Initializes the mobile menu toggle functionality.
 */
function initializeMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Data for STEAM education sections
const steamEducationData = {
    science: {
        title: 'Science (S): Advancing Frontiers with ISRO & Space Tech',
        content: "The Indian Space Research Organisation (ISRO) is a prime example of scientific excellence. Its INSAT series revolutionized communication, enabling widespread TV broadcasting, tele-education, and telemedicine, and facilitating mobile connectivity even in remote areas. ISRO's advancements in satellite technology and launch vehicles directly contribute to Digital India's infrastructure, from broadband connectivity to disaster management. Technologies developed by ISRO are now being transferred to private companies, fostering a robust space industrial ecosystem.",
        image: "https://img.freepik.com/free-photo/earth-spacecraft-elements-this-image-furnished-by-nasa_335224-749.jpg"
    },
    technology: {
        title: 'Technology (T): UPI, AI, 5G - Pillars of Connectivity',
        content: "The Unified Payments Interface (UPI) is a testament to India's technological prowess in financial inclusion. Its ease of use and widespread adoption have made digital payments accessible to millions, driving a cashless economy. India's rapid 5G deployment, one of the fastest globally, is enhancing connectivity, enabling faster digital services, and opening new avenues for innovation in areas like IoT, smart cities, and remote operations. Government initiatives like the $1.2 billion India AI Mission are fostering research, development, and adoption of AI across sectors.",
        image: "https://img.freepik.com/free-photo/representation-user-experience-interface-design_23-2150169850.jpg?t=st=1752222856~exp=1752226456~hmac=2586ee1bc3f9f3949663e4cef8f87d8eb0f6cd65fac60fd486d17f775f45a8de&w=2000"
    },
    engineering: {
        title: 'Engineering (E): Building the Digital Backbone',
        content: "The backbone of Digital Bharat is robust engineering. Projects like BharatNet are connecting over 2.18 lakh Gram Panchayats with high-speed optical fiber, ensuring last-mile connectivity. The engineering behind platforms like UMANG, DigiLocker, and various e-governance portals ensures seamless, secure, and scalable delivery of public services, making government accessible on demand.",
        image: "https://img.freepik.com/free-photo/construction-site-silhouettes_1127-3253.jpg"
    },
    arts: {
        title: 'Arts (A): Enhancing User Experience & Cultural Integration',
        content: "The 'Arts' in STEAM, particularly in the context of Digital Bharat, refers to the critical role of User Interface (UI) and User Experience (UX) design. The Guidelines for Indian Government Websites and apps (GIGW) emphasize creating intuitive, accessible, and visually appealing digital platforms. This ensures that digital services are not just functional but also easy and enjoyable for all citizens to use. The focus on providing digital resources in Indian languages (e.g., through BHASHINI) integrates cultural and linguistic diversity into the digital landscape, making technology truly inclusive.",
        image: "https://img.freepik.com/free-vector/gradient-ui-ux-elements-background_23-2149056159.jpg"
    },
    mathematics: {
        title: 'Mathematics (M): Data Science & Algorithms for Informed Decisions',
        content: "Mathematics, through data science and algorithms, underpins many Digital India initiatives. Government agencies are increasingly using Big Data Analytics, Machine Learning models, and predictive analytics to analyze vast datasets. This data-driven approach is evident in systems like the Aadhaar-based Direct Benefit Transfer (DBT), which uses algorithms to ensure efficient and leak-proof delivery of welfare payments. The CoWIN platform demonstrated the power of data management and algorithms in orchestrating the world's largest vaccination drive.",
        image: "https://img.freepik.com/premium-photo/understanding-dx-data-technology-conceptual-representation-advanced-score-vast-data-network_981640-85953.jpg"
    }
};


/**
 * Sets up click handlers for STEAM cards to open their respective modals.
 */
function setupSteamModals() {
    const steamCards = document.querySelectorAll('.steam-card-new');
    steamCards.forEach(card => {
        card.addEventListener('click', function () {
            const contentType = this.getAttribute('data-content');
            openSteamModal(contentType);
        });
    });
    setupModalCloseHandlers('modal-steam', closeSteamModal);
}

/**
 * Opens the STEAM modal with content specific to the selected type.
 * @param {string} type - The type of STEAM content (e.g., 'science', 'technology').
 */
function openSteamModal(type) {
    const data = steamEducationData[type];
    if (!data) return;

    const modal = document.getElementById('modal-steam');
    document.getElementById('modal-steam-title').textContent = data.title;
    document.getElementById('modal-steam-content').textContent = data.content;
    document.getElementById('modal-steam-image').src = data.image;
    document.getElementById('modal-steam-image').alt = data.title;

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Prevent scrolling
}

// Object to store Chart.js instances
const charts = {};

/**
 * Sets up click handlers for impact chart buttons to switch between charts.
 */
function setupImpactCharts() {
    const impactButtons = document.querySelectorAll('.impact-btn');
    const chartContainers = document.querySelectorAll('.chart-container-new');

    impactButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Deactivate all buttons
            impactButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-300', 'text-gray-800');
            });

            // Activate the clicked button
            this.classList.add('active', 'bg-blue-600', 'text-white');
            this.classList.remove('bg-gray-300', 'text-gray-800');

            // Hide all chart containers
            chartContainers.forEach(container => {
                container.style.display = 'none';
            });

            // Show the target chart container
            const targetChartId = this.dataset.chart + '-chart-container';
            const targetContainer = document.getElementById(targetChartId);
            if (targetContainer) {
                targetContainer.style.display = 'block';
            }

            // Initialize the specific chart if not already initialized
            initializeSpecificChart(this.dataset.chart);
        });
    });

    // Initialize the default chart on load
    initializeSpecificChart('internet');
}

/**
 * Initializes a specific Chart.js chart if it hasn't been initialized yet.
 * @param {string} chartId - The ID of the chart to initialize (e.g., 'internet', 'women').
 */
function initializeSpecificChart(chartId) {
    if (charts[chartId]) {
        return; // Chart already initialized
    }

    let canvas;
    let chartFunction;

    // Determine which canvas and chart creation function to use based on chartId
    switch (chartId) {
        case 'internet':
            canvas = document.getElementById('internetPenetrationChart');
            chartFunction = createInternetPenetrationChart;
            break;
        case 'women':
            canvas = document.getElementById('womenInTechChart');
            chartFunction = createWomenInTechChart;
            break;
        case 'learning':
            canvas = document.getElementById('onlineLearningChart');
            chartFunction = createOnlineLearningChart;
            break;
        default:
            return; // Invalid chart ID
    }

    // Create and store the chart instance
    if (canvas) {
        charts[chartId] = chartFunction();
    }
}

/**
 * Creates and returns a Chart.js instance for Internet Penetration data.
 * @returns {Chart|null} The Chart.js instance or null if canvas not found.
 */
function createInternetPenetrationChart() {
    const canvas = document.getElementById('internetPenetrationChart');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2014', '2024'],
            datasets: [{
                label: 'Internet Subscribers (in Millions)',
                data: [251.59, 954.40],
                backgroundColor: 'rgba(74, 144, 226, 0.8)',
                borderColor: 'rgba(74, 144, 226, 1)',
                borderWidth: 1,
                yAxisID: 'y',
            }, {
                label: 'Data Consumption/User (GB/Month)',
                data: [0.27, 20.27],
                type: 'line',
                borderColor: 'rgba(252, 92, 125, 1)',
                backgroundColor: 'rgba(252, 92, 125, 0.2)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1000, easing: 'easeOutQuart' },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: { display: true, text: 'Subscribers (Millions)', font: { size: 14, weight: 'bold' } },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: { display: true, text: 'Data (GB/Month)', font: { size: 14, weight: 'bold' } },
                    grid: { drawOnChartArea: false }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Internet Connectivity Growth (2014 vs 2024)',
                    font: { size: 18, weight: 'bold' },
                    color: '#2c3e50'
                },
                legend: {
                    labels: {
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

/**
 * Creates and returns a Chart.js instance for Women in Tech data.
 * @returns {Chart|null} The Chart.js instance or null if canvas not found.
 */
function createWomenInTechChart() {
    const canvas = document.getElementById('womenInTechChart');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Women in Tech Workforce', 'Men in Tech Workforce'],
            datasets: [{
                label: 'Workforce Composition',
                data: [27.98, 72.02],
                backgroundColor: ['#fc5c7d', '#6a82fb'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { animateScale: true, animateRotate: true },
            plugins: {
                title: {
                    display: true,
                    text: 'Female Participation in Tech Contractual Workforce (2024)',
                    font: { size: 18, weight: 'bold' },
                    color: '#2c3e50'
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

/**
 * Creates and returns a Chart.js instance for Online Learning data.
 * @returns {Chart|null} The Chart.js instance or null if canvas not found.
 */
function createOnlineLearningChart() {
    const canvas = document.getElementById('onlineLearningChart');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['DIKSHA Learning Sessions (Billions)', 'iGOT Learning Certificates (Crores)'],
            datasets: [{
                label: 'Platform Engagement',
                data: [1.85, 3.24],
                backgroundColor: ['#4caf50', '#ff9800'],
                borderColor: ['#4caf50', '#ff9800'],
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            animation: { duration: 1000, easing: 'easeOutQuart' },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value', font: { size: 14, weight: 'bold' } },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                y: {
                    grid: { drawOnChartArea: false }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Online Learning Growth on Government Platforms',
                    font: { size: 18, weight: 'bold' },
                    color: '#2c3e50'
                },
                legend: { display: false }
            }
        }
    });
}

/**
 * Sets up scroll event listener to highlight active navigation links.
 */
function setupScrollNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const debouncedScrollHandler = debounce(function () {
        let currentSectionId = '';
        const headerHeight = document.getElementById('header').offsetHeight || 0;
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100; // Adjust for header height and some offset
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }, 100); // Debounce to prevent too many calls

    window.addEventListener('scroll', debouncedScrollHandler);
    debouncedScrollHandler(); // Call once on load to set initial active link
}

/**
 * Sets up event listeners for the "Ask Digital Bharat" AI and "Generate STEAM Idea" buttons.
 */
function setupDigitalBharatAI() {
    const askButton = document.getElementById('ask-button');
    const questionInput = document.getElementById('question-input');
    const steamIdeaButton = document.getElementById('generate-steam-idea-button');
    const predefinedQuestionsContainer = document.getElementById('predefined-questions-container');
    const predefinedQuestionButtons = predefinedQuestionsContainer ? predefinedQuestionsContainer.querySelectorAll('.predefined-question-button') : [];

    if (askButton && questionInput) {
        askButton.addEventListener('click', handleDigitalBharatQuestion);
        questionInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) { // Trigger on Enter key press, but not Shift+Enter
                event.preventDefault(); // Prevent newline in textarea
                handleDigitalBharatQuestion();
            }
        });

        // Hide predefined questions when user starts typing
        questionInput.addEventListener('input', function () {
            if (predefinedQuestionsContainer) {
                predefinedQuestionsContainer.classList.add('hidden');
            }
        });

        // Show predefined questions when input is focused (if they were hidden by typing)
        questionInput.addEventListener('focus', function () {
            if (questionInput.value.trim() === '' && predefinedQuestionsContainer) {
                predefinedQuestionsContainer.classList.remove('hidden');
            }
        });
    }

    // Add click listeners to predefined question buttons
    predefinedQuestionButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (questionInput) {
                questionInput.value = this.dataset.question; // Set input value
            }
            if (predefinedQuestionsContainer) {
                predefinedQuestionsContainer.classList.add('hidden'); // Hide options
            }
            handleDigitalBharatQuestion(); // Trigger AI response
        });
    });

    if (steamIdeaButton) {
        steamIdeaButton.addEventListener('click', generateSteamIdea);
    }
}

/**
 * Handles the "Ask Digital Bharat" AI question submission.
 */
async function handleDigitalBharatQuestion() {
    const questionInput = document.getElementById('question-input');
    const answerText = document.getElementById('answer-text');
    const answerOutput = document.getElementById('answer-output');
    const loadingIndicator = document.getElementById('ask-loading');
    const askButton = document.getElementById('ask-button');

    const question = questionInput.value.trim();

    if (!question) {
        showAnswerOutput("Please enter a question about Digital Bharat.", answerText, answerOutput);
        return;
    }

    // Show loading state
    loadingIndicator.classList.remove('hidden');
    askButton.disabled = true;
    answerOutput.classList.add('hidden'); // Hide previous answer
    answerText.textContent = ''; // Clear previous answer content

    try {
        const response = await callGeminiAPI(question, 'digital-bharat-qa');
        showAnswerOutput(response, answerText, answerOutput);
    } catch (error) {
        console.error("Error getting answer from AI:", error);
        showAnswerOutput("Sorry, I couldn't get an answer right now. Please try again later.", answerText, answerOutput);
    } finally {
        // Hide loading state and re-enable button
        loadingIndicator.classList.add('hidden');
        askButton.disabled = false;
    }
}

/**
 * Generates a STEAM idea using the Gemini API.
 */
async function generateSteamIdea() {
    const steamIdeaButton = document.getElementById('generate-steam-idea-button');
    const steamIdeaOutput = document.getElementById('steam-idea-output');
    const steamIdeaText = document.getElementById('steam-idea-text');
    const steamLoading = document.getElementById('steam-loading');

    // Show loading state
    steamLoading.classList.remove('hidden');
    steamIdeaButton.disabled = true;
    steamIdeaOutput.classList.add('hidden'); // Hide previous idea
    steamIdeaText.textContent = ''; // Clear previous idea content

    try {
        const response = await callGeminiAPI('', 'steam-idea-generator'); // Empty input for generator
        showAnswerOutput(response, steamIdeaText, steamIdeaOutput);
    } catch (error) {
        console.error("Error generating STEAM idea:", error);
        showAnswerOutput("Couldn't generate an idea right now. Please try again.", steamIdeaText, steamIdeaOutput);
    } finally {
        // Hide loading state and re-enable button
        steamLoading.classList.add('hidden');
        steamIdeaButton.disabled = false;
    }
}

// Global variable to store the current quiz data and correct answers
let currentQuizData = [];

/**
 * Calls the Gemini API with a specific prompt type and user input.
 * @param {string} userInput - The input text for the API.
 * @param {string} type - The type of prompt to use ('digital-bharat-qa', 'steam-idea-generator', etc.).
 * @returns {Promise<string>} A promise that resolves to the API response text.
 */
async function callGeminiAPI(userInput, type) {
    const prompts = {
        'digital-bharat-qa': `You are a knowledgeable assistant trained only to answer questions about Digital Bharat (Digital India) initiatives and platforms created by the Indian government.
            You should answer only if the question is directly related to:
            - About digital India
            - Digital Bharat facts
            - Idea leading to Digital bharat or the core idea of the new and advanced India
            - UPI (Unified Payments Interface)
            - DigiLocker (Digital Document Storage)
            - UMANG (Unified Mobile Application)
            - CoWIN (COVID Vaccination Platform)
            - ePathshala (Digital Learning)
            - BHASHINI (Language Translation AI)
            - BharatNet (Rural Connectivity)
            - Aadhaar (Digital Identity)
            - India AI Mission
            - or any other official Indian government digital service or technology platform

            Rules:
            - Keep the answers concise, factual, and sourced from public government information.
            - If the question is not related to these, respond:
                "Sorry, I can only answer questions related to Digital Bharat platforms and official Indian government digital services like UPI, DigiLocker, etc."

            Question: ${userInput}`,
        'steam-idea-generator': "Generate a concise and creative STEAM (Science, Technology, Engineering, Arts, Mathematics) learning activity idea for students, specifically linking it to an aspect of Digital India (e.g., UPI, Aadhaar, BharatNet, AI in agriculture, digital literacy, e-governance). Focus on a practical, engaging activity. Start directly with the idea, no preamble.",
        'tool-info-generator': `Give me a unique and interesting fun fact or an advanced use case for ${userInput} in the context of Digital India. Keep it concise, around 1-2 sentences.`,
        'timeline-impact-summarizer': `Summarize the key impact or significance of the following event in the context of Digital India in one concise sentence: "${userInput}"`,
        'quiz-generator': `Generate a 5 multiple-choice questions quiz about Digital India initiatives. The difficulty level is ${userInput}. Each question should have 4 options (A, B, C, D) and one correct answer. Provide the output as a JSON array of objects, each with 'question', 'options' (an array of strings), and 'correctAnswer' (the correct option string). Ensure the questions are distinct and cover various aspects of Digital India. Example format:
    [
        {
        "question": "What does UPI stand for?",
        "options": ["Unified Payment Interface", "Universal Payment Indicator", "Unified Public Identity", "Unique Payment Integration"],
        "correctAnswer": "Unified Payment Interface"
        }
    ]`
    };

    const chatHistory = [{
        role: "user",
        parts: [{ text: prompts[type] }]
    }];

    const payload = { contents: chatHistory };

    // Add responseSchema for 'quiz-generator' type to ensure structured JSON output
    if (type === 'quiz-generator') {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        "question": { "type": "STRING" },
                        "options": {
                            "type": "ARRAY",
                            "items": { "type": "STRING" }
                        },
                        "correctAnswer": { "type": "STRING" }
                    },
                    "propertyOrdering": ["question", "options", "correctAnswer"]
                }
            }
        };
    }

    const apiKey = "AIzaSyC0br2ojApvYftpmJ6vwtdjzlwPHzmIf40"; // API key will be set here
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Extract and return the text content from the API response
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error('No valid response from API or unexpected response structure.');
    }
}

// Data for digital tools, including website links
const digitalToolsData = {
    upi: {
        title: 'UPI - Unified Payments Interface',
        content: 'UPI is a <strong>real-time payment system</strong> that facilitates inter-bank transactions by <strong>instantly transferring funds</strong> between two bank accounts on a mobile platform. Launched in <strong>2016</strong>, it has revolutionized digital payments in India with over <strong>8 billion transactions monthly</strong>.',
        link: 'https://www.npci.org.in/what-we-do/upi/product-overview'
    },
    digilocker: {
        title: 'DigiLocker - Digital Document Storage',
        content: 'DigiLocker is a <strong>flagship initiative</strong> to provide a dedicated <strong>personal cloud storage space</strong> to Indian citizens. It allows users to store <strong>official documents like PAN card, Aadhaar, mark sheets</strong>, and certificates in digital format, <strong>eliminating the need for physical documents</strong>.',
        link: 'https://digilocker.gov.in/'
    },
    umang: {
        title: 'UMANG - Unified Mobile Application',
        content: 'UMANG provides a <strong>single platform</strong> for Indian citizens to access <strong>pan India e-Gov services</strong> from Central to Local Government bodies. It offers <strong>1,200+ services</strong> from over <strong>220 departments</strong>.',
        link: 'https://web.umang.gov.in/'
    },
    cowin: {
        title: 'CoWIN - COVID Vaccination Platform',
        content: 'CoWIN is a <strong>digitally powered vaccination platform</strong> that helped India administer over <strong>2 billion COVID vaccine doses</strong>. It provided <strong>real-time tracking, slot booking</strong>, and <strong>certificate generation</strong>, making it one of the world\'s <strong>largest vaccination drives</strong>.',
        link: 'https://www.cowin.gov.in/'
    },
    epathshala: {
        title: 'ePathshala - Digital Learning Platform',
        content: 'ePathshala is a <strong>joint initiative</strong> of Ministry of Education and NCERT to provide <strong>quality education through ICT</strong>. It offers <strong>textbooks, videos, and interactive content</strong> for students from <strong>Class I to XII</strong>.',
        link: 'https://epathshala.nic.in/'
    },
    bhashini: {
        title: 'BHASHINI - Language Translation AI',
        content: 'BHASHINI is India\'s <strong>AI-led language translation platform</strong> that aims to <strong>break language barriers</strong> by providing <strong>real-time translation</strong> in Indian languages. It supports <strong>voice-to-voice, text-to-text</strong>, and <strong>speech-to-text</strong> translation.',
        link: 'https://bhashini.gov.in/'
    },
    bharatnet: {
        title: 'BharatNet - Rural Connectivity Project',
        content: 'BharatNet is the <strong>world\'s largest rural connectivity project</strong>, aiming to connect all <strong>2.5 lakh Gram Panchayats</strong> with <strong>high-speed optical fiber</strong>. It forms the <strong>backbone of Digital India</strong> by ensuring <strong>last-mile connectivity</strong>.',
        link: 'https://www.bharatnet.gov.in/'
    },
    aadhaar: {
        title: 'Aadhaar - Digital Identity System',
        content: 'Aadhaar is the <strong>world\'s largest biometric digital identity system</strong>, providing a <strong>unique 12-digit ID</strong> to over <strong>1.3 billion Indians</strong>. It serves as the <strong>foundation for government services</strong> and <strong>financial inclusion</strong>.',
        link: 'https://uidai.gov.in/'
    }
};

/**
 * Sets up click handlers for tool cards to open their respective modals.
 */
function setupToolModals() {
    const toolModal = document.getElementById('tool-modal');
    const toolCards = document.querySelectorAll('.tool-card-new');
    const generateInfoButton = document.getElementById('generate-tool-info-button');
    const generatedInfoDiv = document.getElementById('generated-tool-info');
    const toolInfoLoading = document.getElementById('tool-info-loading');
    const toolWebsiteLink = document.getElementById('tool-website-link'); // Get the new website link element

    if (!toolModal || toolCards.length === 0) return;

    toolCards.forEach(card => {
        card.addEventListener('click', function () {
            const toolType = this.dataset.tool;
            const toolData = digitalToolsData[toolType];

            if (toolData) {
                showToolModal(toolData, toolType);
            }
        });
    });

    // Event listener for "Generate More Info" button
    if (generateInfoButton) {
        generateInfoButton.addEventListener('click', async function () {
            const toolName = toolModal.dataset.currentTool;
            if (toolName) {
                toolInfoLoading.classList.remove('hidden');
                generateInfoButton.disabled = true;
                generatedInfoDiv.classList.add('hidden');

                try {
                    const response = await callGeminiAPI(toolName, 'tool-info-generator');
                    generatedInfoDiv.innerHTML = formatTextForDisplay(response);
                    generatedInfoDiv.classList.remove('hidden');
                } catch (error) {
                    console.error("Error generating tool info:", error);
                    generatedInfoDiv.innerHTML = "Sorry, couldn't generate more info right now. Please try again.";
                    generatedInfoDiv.classList.remove('hidden');
                } finally {
                    toolInfoLoading.classList.add('hidden');
                    generateInfoButton.disabled = false;
                }
            }
        });
    }

    // Event listener for closing the tool modal
    const closeModalButton = document.getElementById('close-tool-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            toolModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden'); // Re-enable scrolling
            generatedInfoDiv.classList.add('hidden');
            generatedInfoDiv.innerHTML = '';
            if (generateInfoButton) generateInfoButton.disabled = false;
            if (toolInfoLoading) toolInfoLoading.classList.add('hidden');
        });
    }
    // Setup close handlers for clicking outside or pressing Escape
    setupModalCloseHandlers('tool-modal', () => {
        toolModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden'); // Re-enable scrolling
        generatedInfoDiv.classList.add('hidden');
        generatedInfoDiv.innerHTML = '';
        if (generateInfoButton) generateInfoButton.disabled = false;
        if (toolInfoLoading) toolInfoLoading.classList.add('hidden');
    });
}

/**
 * Displays the tool modal with specific tool data.
 * @param {object} data - The data object for the selected tool.
 * @param {string} toolType - The type/name of the tool.
 */
function showToolModal(data, toolType) {
    const modal = document.getElementById('tool-modal');
    const toolWebsiteLink = document.getElementById('tool-website-link');

    document.getElementById('modal-title').innerHTML = data.title;
    document.getElementById('modal-content').innerHTML = data.content;
    toolWebsiteLink.href = data.link; // Set the href for the "Open Website" link
    modal.dataset.currentTool = toolType; // Store current tool type for AI generation

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Prevent scrolling

    // Reset generated info section
    const generatedInfoDiv = document.getElementById('generated-tool-info');
    const generateInfoButton = document.getElementById('generate-tool-info-button');
    const toolInfoLoading = document.getElementById('tool-info-loading');

    generatedInfoDiv.classList.add('hidden');
    generatedInfoDiv.innerHTML = '';
    if (generateInfoButton) generateInfoButton.disabled = false;
    if (toolInfoLoading) toolInfoLoading.classList.add('hidden');
}

let globalStatsChart = null; // Variable to hold the global stats chart instance

/**
 * Sets up initial animations for stat counters and periodic pulse animations.
 */
function setupStatsAnimations() {
    setTimeout(animateStatCounters, 500); // Animate counters after a short delay
    setInterval(addPulseAnimation, 5000); // Add pulse animation every 5 seconds
}

/**
 * Animates the numerical counters in the stats section.
 */
function animateStatCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target'));
        const suffix = counter.textContent.match(/[A-Z\+%]+$/)?.[0] || ''; // Extract suffix (e.g., 'C+', 'B+')

        animateCounter(counter, targetValue, suffix);
    });
}

/**
 * Performs a counting animation for a single numerical element.
 * @param {HTMLElement} element - The HTML element to animate.
 * @param {number} target - The target numerical value.
 * @param {string} suffix - The suffix to append to the number (e.g., 'C+').
 */
function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = Math.ceil(target / 50); // Determine increment step for smoother animation

    const updateCounter = () => {
        if (current < target) {
            current += increment;
            element.textContent = `${Math.min(current, target)}${suffix}`; // Update text content
            requestAnimationFrame(updateCounter); // Continue animation
        } else {
            element.textContent = `${target}${suffix}`; // Ensure final value is exact
        }
    };

    updateCounter(); // Start the animation
}

/**
 * Adds a temporary pulse animation to stat cards.
 */
function addPulseAnimation() {
    const statsCards = document.querySelectorAll('.stat-item');
    statsCards.forEach(card => {
        card.classList.add('pulse-animation'); // Add animation class
        setTimeout(() => card.classList.remove('pulse-animation'), 1000); // Remove after animation duration
    });
}

/**
 * Toggles between displaying numerical stats and a chart visualization.
 */
function toggleStatsView() {
    const statsSection = document.getElementById('stats');
    const chartContainer = document.getElementById('chartContainer');
    const toggleButton = document.querySelector('.toggle-btn');

    if (!statsSection || !chartContainer || !toggleButton) return;

    const isShowingChart = window.getComputedStyle(chartContainer).display !== 'none';

    if (isShowingChart) {
        // Switch to showing stats
        statsSection.style.display = 'grid';
        chartContainer.style.display = 'none';
        toggleButton.textContent = 'Show as Graph';
        resetAndAnimateCounters(); // Reset and re-animate counters
    } else {
        // Switch to showing chart
        statsSection.style.display = 'none';
        chartContainer.style.display = 'block';
        toggleButton.textContent = 'Show Stats';

        if (!globalStatsChart) {
            createStatsChart(); // Create chart if not already created
        }
    }
}

/**
 * Resets stat counters to zero and then animates them to their target values.
 */
function resetAndAnimateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const suffix = counter.textContent.match(/[A-Z\+%]+$/)?.[0] || '';
        counter.textContent = `0${suffix}`; // Set to zero with original suffix
    });

    setTimeout(animateStatCounters, 100); // Start animation shortly after reset
}

/**
 * Creates and returns a Chart.js instance for the progress statistics.
 * @returns {Chart|null} The Chart.js instance or null if canvas not found.
 */
function createStatsChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    globalStatsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Aadhaar (130C+)', 'UPI (40B+)', 'Internet (80C+)', 'Unicorns (100+)'],
            datasets: [{
                label: 'Digital India Milestones',
                data: [130, 40, 80, 100],
                backgroundColor: [
                    'rgba(74, 144, 226, 0.8)',
                    'rgba(142, 45, 226, 0.8)',
                    'rgba(0, 128, 128, 0.8)',
                    'rgba(252, 92, 125, 0.8)'
                ],
                borderColor: ['#4A90E2', '#8E2DE2', '#008080', '#FC5C7D'],
                borderWidth: 2,
                borderRadius: 12
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 1200, easing: 'easeOutBounce' },
            plugins: {
                title: {
                    display: true,
                    text: 'Digital India Growth Metrics',
                    font: { size: 20, weight: 'bold' },
                    color: '#2c3e50'
                },
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value (Indian Units)',
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
    return globalStatsChart;
}

// Event listener for when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeMobileMenu();
    setupSteamModals();
    setupImpactCharts();
    setupScrollNavigation();
    setupDigitalBharatAI();
    setupToolModals();
    setupStatsAnimations();
    setupTimelineSummaries();
    setupQuizFunctionality();

    // Form submission handler for 'Get Involved' modal
    document.getElementById('involvedForm').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission
        closeInvolvedModal(); // Close the form modal
        openSuccessNotificationModal(); // Show success message
        this.reset(); // Reset form fields
    });

    // Setup close handlers for success notification modal
    setupModalCloseHandlers('success-notification-modal', closeSuccessNotificationModal);
});

/**
 * Sets up click handlers for timeline summary buttons to generate AI summaries.
 */
function setupTimelineSummaries() {
    const summarizeButtons = document.querySelectorAll('.summarize-impact-button');

    summarizeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const timelineItem = this.closest('.timeline-item-new');
            const eventTextElement = timelineItem.querySelector('p');
            const eventDescription = eventTextElement ? eventTextElement.textContent.trim() : '';

            const summaryOutputElement = timelineItem.querySelector('.generated-impact-summary');
            const loadingSpinner = this.querySelector('.summarize-loading');

            if (eventDescription && summaryOutputElement && loadingSpinner) {
                summarizeTimelineImpact(eventDescription, this, summaryOutputElement, loadingSpinner);
            }
        });
    });
}

/**
 * Summarizes the impact of a timeline event using the Gemini API.
 * @param {string} eventDescription - The full text description of the timeline event.
 * @param {HTMLElement} buttonElement - The button element that triggered the request.
 * @param {HTMLElement} summaryOutputElement - The div where the summary will be displayed.
 * @param {HTMLElement} loadingSpinner - The loading spinner element.
 */
async function summarizeTimelineImpact(eventDescription, buttonElement, summaryOutputElement, loadingSpinner) {
    // Show loading state and disable button
    loadingSpinner.classList.remove('hidden');
    buttonElement.disabled = true;
    summaryOutputElement.classList.add('hidden'); // Hide previous summary
    summaryOutputElement.innerHTML = ''; // Clear previous summary content

    try {
        const response = await callGeminiAPI(eventDescription, 'timeline-impact-summarizer');
        summaryOutputElement.innerHTML = formatTextForDisplay(response);
        summaryOutputElement.classList.remove('hidden');
    } catch (error) {
        console.error("Error summarizing timeline impact:", error);
        summaryOutputElement.innerHTML = "Sorry, couldn't summarize the impact right now. Please try again.";
        summaryOutputElement.classList.remove('hidden');
    } finally {
        // Hide loading state and re-enable button
        loadingSpinner.classList.add('hidden');
        buttonElement.disabled = false;
    }
}

/**
 * Opens the quiz modal and resets its state.
 */
function openQuizModal() {
    document.getElementById('quiz-modal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Prevent scrolling

    // Reset quiz state when opening
    document.getElementById('quiz-questions-container').innerHTML = '';
    document.getElementById('submit-quiz-button').classList.add('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-loading').classList.add('hidden');
    document.getElementById('generate-quiz-button').disabled = false;
    document.getElementById('submit-quiz-button').disabled = false; // Ensure submit button is re-enabled for new quiz
    // Clear any selected radio buttons from previous attempts
    const radioButtons = document.querySelectorAll('#quiz-questions-container input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
        radio.disabled = false; // Re-enable radio buttons
    });
}

/**
 * Closes the quiz modal and re-enables background scrolling.
 */
function closeQuizModal() {
    document.getElementById('quiz-modal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden'); // Re-enable scrolling
}

/**
 * Generates a quiz based on selected difficulty using the Gemini API.
 */
async function generateQuiz() {
    const difficulty = document.getElementById('quiz-difficulty').value;
    const quizLoading = document.getElementById('quiz-loading');
    const generateButton = document.getElementById('generate-quiz-button');
    const quizQuestionsContainer = document.getElementById('quiz-questions-container');
    const submitQuizButton = document.getElementById('submit-quiz-button');
    const quizResults = document.getElementById('quiz-results');

    // Show loading state and disable buttons
    quizLoading.classList.remove('hidden');
    generateButton.disabled = true;
    submitQuizButton.disabled = false; // Re-enable submit button for a new quiz
    quizQuestionsContainer.innerHTML = ''; // Clear previous questions
    submitQuizButton.classList.add('hidden'); // Hide submit button until quiz is generated
    quizResults.classList.add('hidden'); // Hide previous results

    try {
        const response = await callGeminiAPI(difficulty, 'quiz-generator');
        const quiz = JSON.parse(response); // Parse the JSON response

        if (quiz && quiz.length > 0) { // Check if quiz is an array and not empty
            currentQuizData = quiz; // Store quiz data globally
            displayQuiz(quiz); // Display the questions
            submitQuizButton.classList.remove('hidden'); // Show submit button
        } else {
            quizQuestionsContainer.innerHTML = '<p class="text-red-500 text-center">Failed to generate quiz. Please try again.</p>';
        }
    } catch (error) {
        console.error("Error generating quiz:", error);
        quizQuestionsContainer.innerHTML = '<p class="text-red-500 text-center">Error generating quiz. Please try again.</p>';
    } finally {
        // Hide loading state and re-enable generate button
        quizLoading.classList.add('hidden');
        generateButton.disabled = false;
    }
}

/**
 * Displays the generated quiz questions in the UI.
 * @param {Array<object>} questions - An array of quiz question objects.
 */
function displayQuiz(questions) {
    const quizQuestionsContainer = document.getElementById('quiz-questions-container');
    quizQuestionsContainer.innerHTML = ''; // Clear existing questions

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question-card'); // Apply card styling
        questionDiv.innerHTML = `
        <p class="font-semibold text-lg mb-4 text-gray-800">Q${index + 1}: ${q.question}</p>
        <div class="space-y-3">
        ${q.options.map((option, optIndex) => `
            <label class="flex items-center text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
            <input type="radio" name="question-${index}" value="${option}" class="form-radio h-5 w-5 text-blue-600">
            <span class="ml-3 text-base">${option}</span>
            </label>
        `).join('')}
        </div>
    `;
        quizQuestionsContainer.appendChild(questionDiv);
    });
}

/**
 * Submits the quiz, calculates the score, and displays results.
 */
function submitQuiz() {
    let score = 0;
    const quizQuestionsContainer = document.getElementById('quiz-questions-container');
    const quizResults = document.getElementById('quiz-results');
    const quizScoreSpan = document.getElementById('quiz-score');
    const quizFeedbackDiv = document.getElementById('quiz-feedback');

    currentQuizData.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        const questionDiv = quizQuestionsContainer.children[index];

        // Remove previous border classes
        questionDiv.classList.remove('border-green-500', 'border-red-500');
        // Remove previous background highlight for correct answers
        const allLabels = questionDiv.querySelectorAll('label');
        allLabels.forEach(label => label.classList.remove('bg-green-100', 'font-bold'));


        if (selectedOption) {
            if (selectedOption.value === q.correctAnswer) {
                score++;
                questionDiv.classList.add('border-green-500'); // Mark correct
            } else {
                questionDiv.classList.add('border-red-500'); // Mark incorrect
                // Highlight the correct answer
                const correctLabel = questionDiv.querySelector(`input[value="${q.correctAnswer}"]`).closest('label');
                if (correctLabel) {
                    correctLabel.classList.add('bg-green-100', 'font-bold');
                }
            }
        } else {
            // If no option selected, mark as incorrect and show correct answer
            questionDiv.classList.add('border-red-500');
            const correctLabel = questionDiv.querySelector(`input[value="${q.correctAnswer}"]`).closest('label');
            if (correctLabel) {
                correctLabel.classList.add('bg-green-100', 'font-bold');
            }
        }

        // Disable all radio buttons after submission
        questionDiv.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = true);
    });

    // Display score and feedback
    quizScoreSpan.textContent = `${score} / ${currentQuizData.length}`;
    if (score === currentQuizData.length) {
        quizFeedbackDiv.innerHTML = '<p class="text-green-700">Excellent! You got all answers correct!</p>';
    } else if (score >= currentQuizData.length / 2) {
        quizFeedbackDiv.innerHTML = '<p class="text-blue-700">Good job! Keep learning!</p>';
    } else {
        quizFeedbackDiv.innerHTML = '<p class="text-red-700">You can do better! Review the Digital Bharat content.</p>';
    }
    quizResults.classList.remove('hidden'); // Show results section
    document.getElementById('submit-quiz-button').disabled = true; // Disable submit button after submission
}

/**
 * Sets up event listeners for quiz-related buttons.
 */
function setupQuizFunctionality() {
    const quizButton = document.getElementById('open-quiz-button');
    if (quizButton) {
        quizButton.addEventListener('click', openQuizModal);
    }

    const generateQuizBtn = document.getElementById('generate-quiz-button');
    if (generateQuizBtn) {
        generateQuizBtn.addEventListener('click', generateQuiz);
    }

    const submitQuizBtn = document.getElementById('submit-quiz-button');
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', submitQuiz);
    }

    setupModalCloseHandlers('quiz-modal', closeQuizModal);
}
