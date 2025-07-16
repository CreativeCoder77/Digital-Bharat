const apiKey = "AIzaSyC0br2ojApvYftpmJ6vwtdjzlwPHzmIf40";

function debounce(func, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

function formatTextForDisplay(text) {
    if (!text) return '';
    let formattedText = text;

    formattedText = formattedText.replace(/^##\s*(.*)$/gm, '<h2>$1</h2>');
    formattedText = formattedText.replace(/^#\s*(.*)$/gm, '<h1>$1</h1>');

    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="formatted-bold">$1</strong>');
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formattedText = formattedText.replace(/\n/g, '<br>');


    return formattedText;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

function setupModalCloseHandlers() {
    document.querySelectorAll('.modal-container').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    document.querySelectorAll('.close-modal-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal-container');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal-container').forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    closeModal(modal.id);
                }
            });
        }
    });
}

function openInvolvedModal() {
    openModal('getInvolvedModal');
}

function openSuccessNotificationModal() {
    openModal('successNotificationModal');
}

function openSteamModal(category) {
    const steamData = {
        science: {
            icon: '<i class="fas fa-flask text-red-500"></i>',
            image: 'https://placehold.co/400x400/FF5733/FFFFFF?text=Science+in+Digital+Bharat&fontsize=40',
            content: "<strong>Science</strong> plays a foundational role in <strong>Digital Bharat</strong> by providing the principles behind <strong>new technologies</strong>. This includes research in <strong>materials science</strong> for better electronics, <strong>physics</strong> for quantum computing, and <strong>biology</strong> for bioinformatics and digital health solutions. <strong>Scientific inquiry</strong> drives the fundamental discoveries that enable <strong>technological advancements</strong>."
        },
        technology: {
            icon: '<i class="fas fa-laptop-code text-blue-500"></i>',
            image: 'https://placehold.co/400x400/3366FF/FFFFFF?text=Technology+in+Digital+Bharat&fontsize=40',
            content: "<strong>Technology</strong> is the backbone of <strong>Digital Bharat</strong>, encompassing <strong>software development</strong>, <strong>cybersecurity</strong>, <strong>data analytics</strong>, <strong>cloud computing</strong>, and <strong>AI</strong>. Initiatives like <strong>UPI</strong>, <strong>DigiLocker</strong>, and <strong>CoWIN</strong> are direct applications of advanced technology to deliver services <strong>efficiently</strong> and <strong>securely</strong> to citizens."
        },
        engineering: {
            icon: '<i class="fas fa-cogs text-green-500"></i>',
            image: 'https://placehold.co/400x400/33CC66/FFFFFF?text=Engineering+in+Digital+Bharat&fontsize=40',
            content: "<strong>Engineering</strong> is crucial for building the <strong>infrastructure</strong> and <strong>systems</strong> of <strong>Digital Bharat</strong>. This involves designing <strong>robust networks</strong> (like <strong>BharatNet</strong>), developing <strong>scalable software architectures</strong>, creating <strong>user-friendly interfaces</strong>, and ensuring the <strong>reliability</strong> and <strong>performance</strong> of digital services. Engineers translate <strong>scientific discoveries</strong> into <strong>practical solutions</strong>."
        },
        arts: {
            icon: '<i class="fas fa-paint-brush text-purple-500"></i>',
            image: 'https://placehold.co/400x400/9933FF/FFFFFF?text=Arts+in+Digital+Bharat&fontsize=40',
            content: "<strong>Arts</strong>, including <strong>design</strong>, <strong>creativity</strong>, and <strong>communication</strong>, are vital for making <strong>digital initiatives</strong> <strong>accessible</strong> and <strong>engaging</strong>. <strong>UI/UX design</strong> ensures intuitive user experiences for apps like <strong>UMANG</strong>, while <strong>creative content</strong> and <strong>storytelling</strong> are essential for <strong>digital literacy campaigns</strong> and promoting <strong>adoption</strong> of digital services. Arts foster <strong>human-centered design</strong>."
        },
        mathematics: {
            icon: '<i class="fas fa-calculator text-orange-500"></i>',
            image: 'https://placehold.co/400x400/FF9933/FFFFFF?text=Mathematics+in+Digital+Bharat&fontsize=40',
            content: "<strong>Mathematics</strong> provides the <strong>analytical tools</strong> and <strong>logical frameworks</strong> underpinning all <strong>digital technologies</strong>. This includes <strong>algorithms</strong> for AI, <strong>cryptography</strong> for cybersecurity, <strong>statistical analysis</strong> for data science, and <strong>mathematical modeling</strong> for <strong>network optimization</strong>. Strong <strong>mathematical foundations</strong> are essential for developing <strong>efficient</strong> and <strong>secure</strong> digital systems."
        }
    };


    const data = steamData[category];
    if (data) {
        document.getElementById('steamModalIcon').innerHTML = data.icon;
        document.getElementById('steamModalContent').innerHTML = data.content;
        document.getElementById('steamModalImage').src = data.image;
        openModal('steamModal');
    }
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const getInvolvedMobileBtn = document.getElementById('getInvolvedMobileBtn');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('translate-x-full');
    });

    closeMobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('translate-x-full');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('translate-x-full');
        });
    });

    getInvolvedMobileBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('translate-x-full');
        openInvolvedModal();
    });
}

async function callGeminiAPI(promptContent, type) {
    const askBtnText = document.getElementById('askBtnText');
    const askBtnSpinner = document.getElementById('askBtnSpinner');
    const moreInfoBtnText = document.getElementById('moreInfoBtnText');
    const moreInfoBtnSpinner = document.getElementById('moreInfoBtnSpinner');
    const steamIdeaBtnText = document.getElementById('steamIdeaBtnText');
    const steamIdeaBtnSpinner = document.getElementById('steamIdeaBtnSpinner');
    const generateQuizBtnText = document.getElementById('generateQuizBtnText');
    const generateQuizBtnSpinner = document.getElementById('generateQuizBtnSpinner');

    if (type === 'digital-bharat-qa') {
        askBtnText.textContent = 'Thinking...';
        askBtnSpinner.classList.remove('hidden');
    } else if (type === 'tool-info-generator') {
        moreInfoBtnText.textContent = 'Generating...';
        moreInfoBtnSpinner.classList.remove('hidden');
    } else if (type === 'steam-idea-generator') {
        steamIdeaBtnText.textContent = 'Generating...';
        steamIdeaBtnSpinner.classList.remove('hidden');
    } else if (type === 'quiz-generator') {
        generateQuizBtnText.textContent = 'Generating...';
        generateQuizBtnSpinner.classList.remove('hidden');
    }

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: promptContent }] });

    let payload = {
        contents: chatHistory,
        generationConfig: {
            temperature: 0.9 // Increased temperature for more varied outputs
        }
    };
    let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    if (type === 'quiz-generator') {
        payload.generationConfig.responseMimeType = "application/json";
        payload.generationConfig.responseSchema = {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    "question": { "type": "STRING" },
                    "options": {
                        "type": "ARRAY",
                        "items": { "type": "STRING" }
                    },
                    "answer": { "type": "STRING" }
                },
                "propertyOrdering": ["question", "options", "answer"]
            }
        };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        let generatedResponse;
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            if (type === 'quiz-generator') {
                generatedResponse = JSON.parse(text);
            } else {
                generatedResponse = text;
            }
        } else {
            console.error("Unexpected API response structure:", result);
            generatedResponse = "I'm sorry, I couldn't generate a response. Please try again.";
        }
        return generatedResponse;

    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        throw error;
    } finally {
        if (type === 'digital-bharat-qa') {
            askBtnText.textContent = 'Ask';
            askBtnSpinner.classList.add('hidden');
        } else if (type === 'tool-info-generator') {
            moreInfoBtnText.textContent = 'Generate More Info';
            moreInfoBtnSpinner.classList.add('hidden');
        } else if (type === 'steam-idea-generator') {
            steamIdeaBtnText.textContent = 'Generate Idea';
            steamIdeaBtnSpinner.classList.add('hidden');
        } else if (type === 'quiz-generator') {
            generateQuizBtnText.textContent = 'Generate Quiz';
            generateQuizBtnSpinner.classList.add('hidden');
        }
    }
}

async function handleDigitalBharatQuestion() {
    const questionInput = document.getElementById('digitalBharatQuestion');
    const responseDiv = document.getElementById('digitalBharatResponse');
    const question = questionInput.value.trim();

    if (!question) {
        responseDiv.innerHTML = '<p class="text-red-500">Please enter a question.</p>';
        return;
    }

    responseDiv.innerHTML = '<p class="text-gray-500 flex items-center space-x-2"><i class="fas fa-spinner fa-spin"></i><span>Thinking...</span></p>';

    try {
        const prompt = `Answer the following question about Digital Bharat initiatives, programs, or impact: "${question}"`;
        const response = await callGeminiAPI(prompt, 'digital-bharat-qa');
        responseDiv.innerHTML = formatTextForDisplay(response);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        responseDiv.innerHTML = '<p class="text-red-500">Failed to get a response. Please try again.</p>';
    }
}

function setupDigitalBharatAI() {
    document.getElementById('askDigitalBharatBtn').addEventListener('click', handleDigitalBharatQuestion);
    document.querySelectorAll('.predefined-question-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            document.getElementById('digitalBharatQuestion').value = event.target.dataset.question;
            handleDigitalBharatQuestion();
        });
    });
}

const toolData = {
    upi: {
        title: "Unified Payments Interface (UPI)",
        icon: '<i class="fas fa-mobile-alt"></i>',
        image: 'https://placehold.co/400x400/3366FF/FFFFFF?text=UPI',
        description: "UPI is a real-time payment system that facilitates instant inter-bank peer-to-peer and person-to-merchant transactions. It's built by the National Payments Corporation of India (NPCI) and is a cornerstone of India's digital economy.",
        link: "https://www.npci.org.in/what-we-do/upi/product-overview"
    },
    digilocker: {
        title: "DigiLocker",
        icon: '<i class="fas fa-cloud"></i>',
        image: 'https://placehold.co/400x400/9933FF/FFFFFF?text=DigiLocker',
        description: "DigiLocker is a secure cloud-based platform for issuance, storage, and verification of documents and certificates. It aims to reduce the need for physical documents and promote paperless governance.",
        link: "https://digilocker.gov.in/"
    },
    umang: {
        title: "UMANG (Unified Mobile Application for New-age Governance)",
        icon: '<i class="fas fa-list-ul"></i>',
        image: 'https://placehold.co/400x400/008080/FFFFFF?text=UMANG',
        description: "UMANG provides a single platform for all Indian citizens to access pan India e-Gov services ranging from Central to Local Government bodies and other utility services.",
        link: "https://web.umang.gov.in/"
    },
    cowin: {
        title: "CoWIN",
        icon: '<i class="fas fa-shield-alt"></i>',
        image: 'https://placehold.co/400x400/CC0000/FFFFFF?text=CoWIN',
        description: "CoWIN is the Indian government's web portal for COVID-19 vaccination registration and scheduling. It also issues digital vaccination certificates.",
        link: "https://www.cowin.gov.in/"
    },
    epathshala: {
        title: "ePathshala",
        icon: '<i class="fas fa-book-open"></i>',
        image: 'https://placehold.co/400x400/3366FF/FFFFFF?text=ePathshala',
        description: "ePathshala is a joint initiative of Ministry of Education, NCERT and CBSE to disseminate e-resources including textbooks, audio, video, periodicals, and a variety of other digital resources.",
        link: "https://epathshala.nic.in/"
    },
    bhashini: {
        title: "BHASHINI (BHASHa INterface for India)",
        icon: '<i class="fas fa-font"></i>',
        image: 'https://placehold.co/400x400/00CC00/FFFFFF?text=BHASHINI',
        description: "BHASHINI is India's AI-led language translation platform, part of the National Language Translation Mission. It aims to break language barriers and enable digital inclusion across all Indian languages.",
        link: "https://www.meity.gov.in/content/bhashini"
    },
    bharatnet: {
        title: "BharatNet",
        icon: '<i class="fas fa-broadcast-tower"></i>',
        image: 'https://placehold.co/400x400/333333/FFFFFF?text=BharatNet',
        description: "BharatNet is a project to provide broadband connectivity to over 2.5 lakh Gram Panchayats (village councils) across India using optical fiber, bridging the digital divide.",
        link: "https://dot.gov.in/broadband-connectivity/bharatnet"
    },
    aadhaar: {
        title: "Aadhaar",
        icon: '<i class="fas fa-id-card"></i>',
        image: 'https://placehold.co/400x400/FF6600/FFFFFF?text=Aadhaar',
        description: "Aadhaar is a 12-digit unique identification number issued by the Unique Identification Authority of India (UIDAI) to all residents of India. It serves as a proof of identity and address.",
        link: "https://uidai.gov.in/"
    }
};

async function showToolModal(toolKey) {
    const tool = toolData[toolKey];
    if (tool) {
        document.getElementById('toolModalTitle').textContent = tool.title;
        document.getElementById('toolModalIcon').innerHTML = tool.icon;
        document.getElementById('toolModalImage').src = tool.image;
        document.getElementById('toolModalDescription').textContent = tool.description;
        document.getElementById('toolModalLink').href = tool.link;
        document.getElementById('toolModalMoreInfo').innerHTML = " ";
        document.getElementById('generateMoreInfoBtn').dataset.toolKey = toolKey;
        openModal('toolInfoModal');
    }
}

async function generateToolInfo(event) {
    const toolKey = event.currentTarget.dataset.toolKey;
    const tool = toolData[toolKey];

    if (tool) {
        const moreInfoDiv = document.getElementById('toolModalMoreInfo');
        moreInfoDiv.innerHTML = '<p class="text-gray-500 flex items-center space-x-2"><i class="fas fa-spinner fa-spin"></i><span>Generating...</span></p>';

        try {
            const prompt = `Provide a fun fact or advanced use case for the digital tool: ${tool.title}. Focus on its impact or unique features and dont make it too long keep it short and crispy and also not too short and give it in points. `;
            const response = await callGeminiAPI(prompt, 'tool-info-generator');
            moreInfoDiv.innerHTML = formatTextForDisplay(response);
        } catch (error) {
            console.error("Error generating tool info:", error);
            moreInfoDiv.innerHTML = '<p class="text-red-500">Failed to generate more info. Please try again.</p>';
        }
    }
}

function setupToolModals() {
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const toolKey = event.currentTarget.dataset.tool;
            showToolModal(toolKey);
        });
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * 100;
            const y = (e.clientY - rect.top) / rect.height * 100;
            card.style.setProperty('--x', `${x}%`);
            card.style.setProperty('--y', `${y}%`);
        });
    });
    document.getElementById('generateMoreInfoBtn').addEventListener('click', generateToolInfo);
}

let impactChartInstance = null;
let statsChartInstance = null;

const chartData = {
    connectivity: {
        labels: ['2015', '2018', '2021', '2024 (Est.)'],
        datasets: [{
            label: 'Internet Penetration (%)',
            data: [25, 40, 60, 75],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    inclusion: {
        labels: ['Women in Tech Workforce (%)', 'Digital Literacy Rate (%)'],
        datasets: [{
            label: 'Inclusion Metrics',
            data: [35, 70],
            backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
            borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1
        }]
    },
    education: {
        labels: ['Online Learning Platform Users (Millions)', 'E-Content Downloads (Billions)'],
        datasets: [{
            label: 'Education Metrics',
            data: [250, 5],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1
        }]
    }
};

function initializeSpecificChart(chartId, type) {
    const ctx = document.getElementById(chartId).getContext('2d');
    if (chartId === 'impactChart') {
        if (impactChartInstance) {
            impactChartInstance.destroy();
        }
        impactChartInstance = new Chart(ctx, {
            type: type === 'connectivity' ? 'bar' : 'doughnut',
            data: chartData[type],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: type.charAt(0).toUpperCase() + type.slice(1) + ' Impact'
                    }
                }
            }
        });
    } else if (chartId === 'statsChart') {
        if (statsChartInstance) {
            statsChartInstance.destroy();
        }
        statsChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [1947, 1980, 1995, 2000, 2005, 2010, 2014, 2016, 2020, 2022, 2025],
                datasets: [
                    {
                        label: 'Internet Users',
                        data: [0, 0, 0.05, 0.5, 1.6, 10, 25, 50, 75, 80, 85],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3
                    },
                    {
                        label: 'UPI Transactions/Month',
                        data: [0, 0, 0, 0, 0, 0, 0, 0.2, 1, 40, 50],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3
                    },
                    {
                        label: 'Aadhaar Enrollments',
                        data: [0, 0, 0, 0, 0, 1, 10, 12, 12.5, 13, 13],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245,158,11,0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3
                    },
                    {
                        label: 'Unicorn Startups',
                        data: [0, 0, 0, 0.01, 0.03, 0.05, 0.1, 0.2, 0.6, 1, 1.2],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'India\'s Digital Growth (in Crore)',
                        font: {
                            size: 18
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                const label = ctx.dataset.label;
                                const value = ctx.raw.toFixed(2);
                                return `${label}: ${value} Cr`;
                            }
                        }
                    }
                }
            }
        });

    }
}

function setupImpactCharts() {
    initializeSpecificChart('impactChart', 'connectivity');

    document.querySelectorAll('.chart-toggle-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
                btn.classList.remove('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600', 'text-white');
                btn.classList.add('bg-blue-100', 'text-blue-800', 'hover:bg-blue-200');
            });
            event.target.classList.add('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600', 'text-white');
            event.target.classList.remove('bg-blue-100', 'text-blue-800', 'hover:bg-blue-200');

            const chartType = event.target.dataset.chart;
            initializeSpecificChart('impactChart', chartType);
        });
    });
}

function animateCounter(element, target) {
    const start = 0;
    const duration = 2000;
    let startTime = null;

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;
        const easedProgress = easeOutQuad(progress);

        const currentValue = start + easedProgress * (target - start);
        if (target >= 100) {
            element.textContent = Math.round(currentValue).toLocaleString();
        } else if (target >= 10) {
            element.textContent = Math.round(currentValue).toLocaleString();
        }
        else {
            element.textContent = currentValue.toFixed(1);
        }


        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    requestAnimationFrame(animate);
}

function addPulseAnimation(element) {
    element.classList.add('pulse-animation');
    element.addEventListener('animationend', () => {
        element.classList.remove('pulse-animation');
    }, { once: true });
}

function setupStatsAnimations() {
    const statItems = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target.querySelector('[data-target]');
                const target = parseFloat(valueElement.dataset.target);
                animateCounter(valueElement, target);
                addPulseAnimation(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => {
        observer.observe(item);
    });
}

function toggleStatsView() {
    const statsDisplay = document.getElementById('statsDisplay');
    const statsChartContainer = document.getElementById('statsChartContainer');
    const toggleBtn = document.getElementById('toggleStatsViewBtn');

    if (statsDisplay.classList.contains('hidden')) {
        statsDisplay.classList.remove('hidden');
        statsChartContainer.classList.add('hidden');
        if (statsChartInstance) {
            statsChartInstance.destroy();
            statsChartInstance = null;
        }
        toggleBtn.textContent = 'Show Chart';
        document.querySelectorAll('.stat-item').forEach(item => {
            const valueElement = item.querySelector('[data-target]');
            const target = parseFloat(valueElement.dataset.target);
            animateCounter(valueElement, target);
            addPulseAnimation(item);
        });
    } else {
        statsDisplay.classList.add('hidden');
        statsChartContainer.classList.remove('hidden');
        initializeSpecificChart('statsChart', 'stats');
        toggleBtn.textContent = 'Show Numbers';
    }
}

async function summarizeTimelineImpact(event) {
    const button = event.target;
    const eventName = button.dataset.event;
    const summaryDiv = button.nextElementSibling;
    summaryDiv.style.fontSize = '0.9rem';


    button.textContent = 'Summarizing...';
    button.disabled = true;
    summaryDiv.classList.remove('hidden');
    summaryDiv.innerHTML = '<p class="text-gray-500 flex items-center space-x-2"><i class="fas fa-spinner fa-spin"></i><span>Generating summary...</span></p>';

    try {
        const prompt = `Summarize the impact of the following Digital India event: "${eventName}in not more than 40 words ADD A STRONG TAG TO THE IMPORTANT PARTS OF THE SUMMARY"`;
        const response = await callGeminiAPI(prompt, 'timeline-impact-summarizer');
        summaryDiv.innerHTML = formatTextForDisplay(response);
    } catch (error) {
        console.error("Error summarizing timeline impact:", error);
        summaryDiv.innerHTML = '<p class="text-red-500">Failed to summarize. Please try again.</p>';
    } finally {
        button.textContent = '✨ Summarize Impact';
        button.disabled = false;
    }
}

function setupTimelineSummaries() {
    document.querySelectorAll('.summarize-impact-btn').forEach(button => {
        button.addEventListener('click', summarizeTimelineImpact);
    });
}

async function generateSteamIdea() {
    const steamIdeaResponseDiv = document.getElementById('steamIdeaResponse');
    steamIdeaResponseDiv.innerHTML = '<p class="text-gray-500 flex items-center space-x-2"><i class="fas fa-spinner fa-spin"></i><span>Generating idea...</span></p>';

    try {
        const prompt = "Generate a creative STEAM learning activity idea related to Digital India. The idea should clearly integrate elements of Science, Technology, Engineering, Arts, and Mathematics, and explain how each aspect contributes to the project. Provide a concise, engaging description.";
        const response = await callGeminiAPI(prompt, 'steam-idea-generator');
        steamIdeaResponseDiv.innerHTML = formatTextForDisplay(response);
    } catch (error) {
        console.error("Error generating STEAM idea:", error);
        steamIdeaResponseDiv.innerHTML = '<p class="text-red-500">Failed to generate idea. Please try again.</p>';
    }
}

let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let selectedDifficulty = '';

function resetQuizState() {
    currentQuizQuestions = [];
    currentQuestionIndex = 0;
    userAnswers = [];
    selectedDifficulty = '';
    document.getElementById('quizSetup').classList.remove('hidden');
    document.getElementById('quizContent').classList.add('hidden');
    document.getElementById('quizResult').classList.add('hidden');
    document.getElementById('quizQuestionContainer').innerHTML = '';
    document.getElementById('feedbackDisplay').innerHTML = '';
    document.getElementById('generateQuizBtn').disabled = false;
    document.getElementById('generateQuizBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('bg-green-600', 'bg-blue-600', 'bg-red-600');
        btn.classList.add('bg-green-500', 'bg-blue-500', 'bg-red-500');
    });
}

async function generateQuiz() {
    if (!selectedDifficulty) {
        document.getElementById('quizQuestionContainer').innerHTML = '<p class="text-red-500 text-center">Please select a difficulty level first.</p>';
        return;
    }

    document.getElementById('generateQuizBtn').disabled = true;
    document.getElementById('generateQuizBtn').classList.add('opacity-50', 'cursor-not-allowed');
    document.getElementById('quizQuestionContainer').innerHTML = '<p class="text-gray-500 text-center flex items-center justify-center space-x-2"><i class="fas fa-spinner fa-spin"></i><span>Generating quiz...</span></p>';

    try {
        const prompt = `Generate 5 multiple-choice quiz questions about Digital India, focusing on ${selectedDifficulty} difficulty. Each question should have 4 options and a single correct answer. Provide the response as a JSON array of objects, where each object has 'question', 'options' (an array of strings), and 'answer' (the correct option string).`;
        const quizData = await callGeminiAPI(prompt, 'quiz-generator');
        currentQuizQuestions = quizData;
        userAnswers = new Array(currentQuizQuestions.length).fill(null);
        currentQuestionIndex = 0;

        document.getElementById('quizSetup').classList.add('hidden');
        document.getElementById('quizContent').classList.remove('hidden');
        displayQuizQuestion(currentQuestionIndex);
    } catch (error) {
        console.error("Error generating quiz:", error);
        document.getElementById('quizQuestionContainer').innerHTML = '<p class="text-red-500 text-center">Failed to generate quiz. Please try again.</p>';
        resetQuizState();
    } finally {
        document.getElementById('generateQuizBtn').disabled = false;
        document.getElementById('generateQuizBtn').classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

function displayQuizQuestion(index) {
    const questionContainer = document.getElementById('quizQuestionContainer');
    const questionCounter = document.getElementById('questionCounter');
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitQuizBtn');

    if (index < 0 || index >= currentQuizQuestions.length) return;

    const question = currentQuizQuestions[index];
    questionContainer.innerHTML = `
                <div class="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-md mb-6">
                    <p class="text-lg font-semibold mb-4 text-gray-900">Q${index + 1}: ${question.question}</p>
                    <div class="options-container">
                        ${question.options.map((option, optIndex) => `
                            <button class="quiz-option-button ${userAnswers[index] === option ? 'selected' : ''}" data-option="${option}">
                                ${String.fromCharCode(65 + optIndex)}. ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

    questionCounter.textContent = `Question ${index + 1} of ${currentQuizQuestions.length}`;

    prevBtn.classList.toggle('hidden', index === 0);
    nextBtn.classList.toggle('hidden', index === currentQuizQuestions.length - 1);
    submitBtn.classList.toggle('hidden', index !== currentQuizQuestions.length - 1);

    questionContainer.querySelectorAll('.quiz-option-button').forEach(button => {
        button.addEventListener('click', (event) => {
            questionContainer.querySelectorAll('.quiz-option-button').forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            userAnswers[index] = event.target.dataset.option;
        });
    });
}

function navigateQuiz(direction) {
    if (direction === 'next' && currentQuestionIndex < currentQuizQuestions.length - 1) {
        currentQuestionIndex++;
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
        currentQuestionIndex--;
    }
    displayQuizQuestion(currentQuestionIndex);
}

function submitQuiz() {
    let score = 0;
    let feedbackHtml = '';

    currentQuizQuestions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === q.answer;
        if (isCorrect) {
            score++;
        }

        feedbackHtml += `<div class="mb-4 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">`;
        feedbackHtml += `<p class="font-semibold text-gray-900">Q${index + 1}: ${q.question}</p>`;
        feedbackHtml += `<p class="${isCorrect ? 'text-green-700' : 'text-red-700'}">Your Answer: <strong>${userAnswer || 'Not answered'}</strong> ${isCorrect ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>'}</p>`;
        if (!isCorrect) {
            feedbackHtml += `<p class="text-blue-700">Correct Answer: <strong>${q.answer}</strong></p>`;
        }
        feedbackHtml += `</div>`;
    });

    document.getElementById('quizContent').classList.add('hidden');
    document.getElementById('quizResult').classList.remove('hidden');
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('totalQuestionsDisplay').textContent = currentQuizQuestions.length;
    document.getElementById('feedbackDisplay').innerHTML = feedbackHtml;
}

function setupQuizFunctionality() {
    document.getElementById('takeQuizBtn').addEventListener('click', () => openModal('quizModal'));
    document.getElementById('retakeQuizBtn').addEventListener('click', resetQuizState);

    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('bg-green-600', 'bg-blue-600', 'bg-red-600');
                btn.classList.add('bg-green-500', 'bg-blue-500', 'bg-red-500');
            });
            event.target.classList.remove('bg-green-500', 'bg-blue-500', 'bg-red-500');
            event.target.classList.add(event.target.dataset.difficulty === 'easy' ? 'bg-green-600' : event.target.dataset.difficulty === 'medium' ? 'bg-blue-600' : 'bg-red-600');
            selectedDifficulty = event.target.dataset.difficulty;
        });
    });

    document.getElementById('generateQuizBtn').addEventListener('click', generateQuiz);
    document.getElementById('prevQuestionBtn').addEventListener('click', () => navigateQuiz('prev'));
    document.getElementById('nextQuestionBtn').addEventListener('click', () => navigateQuiz('next'));
    document.getElementById('submitQuizBtn').addEventListener('click', submitQuiz);
}

function setupScrollNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    const options = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active-nav-link');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active-nav-link');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 50) {
            header.classList.add('py-3', 'shadow-xl');
            header.classList.remove('py-4', 'shadow-lg');
        } else {
            header.classList.add('py-4', 'shadow-lg');
            header.classList.remove('py-3', 'shadow-xl');
        }
    }, 10));
}

function setupScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }, 50));

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupModalCloseHandlers();
    initializeMobileMenu();
    setupDigitalBharatAI();
    setupToolModals();
    setupImpactCharts();
    setupStatsAnimations();
    setupTimelineSummaries();
    setupQuizFunctionality();
    setupScrollNavigation();
    setupScrollToTopButton();

    document.getElementById('getInvolvedBtn').addEventListener('click', openInvolvedModal);
    document.getElementById('joinMovementBtn').addEventListener('click', openInvolvedModal);
    document.getElementById('contactUsBtn').addEventListener('click', openInvolvedModal);

    document.getElementById('getInvolvedForm').addEventListener('submit', (event) => {
        event.preventDefault();
        closeModal('getInvolvedModal');
        openSuccessNotificationModal();
        document.getElementById('getInvolvedForm').reset();
    });

    document.querySelectorAll('.steam-card').forEach(card => {
        card.addEventListener('click', (event) => {
            event.preventDefault();
            const category = event.currentTarget.dataset.category;
            openSteamModal(category);
        });
    });

    document.getElementById('generateSteamIdeaBtn').addEventListener('click', generateSteamIdea);

    document.getElementById('toggleStatsViewBtn').addEventListener('click', toggleStatsView);

    const heroArrow = document.querySelector('.animate-bounce-slow');
    if (heroArrow) {
        heroArrow.style.animationPlayState = 'running';
    }
});
