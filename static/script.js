document.addEventListener('DOMContentLoaded', function () {
    // DOM Element References
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const tabButtons = document.querySelectorAll('.tab-button'); // For Focus Areas
    const aiTabButtons = document.querySelectorAll('.ai-tab-button'); // For AI Solutions
    const traditionalTabContentContainer = document.getElementById('tab-content-container');
    const contactForm = document.getElementById('contact-form');
    const schemeCategorySelect = document.getElementById('scheme-category-select');
    const schemesContentContainer = document.getElementById('schemes-content-container');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const scrollToTopButton = document.getElementById('scroll-to-top-button');

    // AI-specific elements (updated after removing AI Assistant)
    const medicalPromptInput = document.getElementById('medical-prompt-input');
    const generateMedicalResponseButton = document.getElementById('generate-medical-response-button');
    const medicalResponseContainer = document.getElementById('medical-response-container');
    const medicalLoadingIndicator = document.getElementById('medical-loading-indicator');
    const medicalResponseText = document.getElementById('medical-response-text');
    const medicalActions = document.getElementById('medical-actions');
    const bookMedicineButton = document.getElementById('book-medicine-button');
    const bookAppointmentButton = document.getElementById('book-appointment-button');

    const govtPromptInput = document.getElementById('govt-prompt-input');
    const generateGovtResponseButton = document.getElementById('generate-govt-response-button');
    const govtResponseContainer = document.getElementById('govt-response-container');
    const govtLoadingIndicator = document.getElementById('govt-loading-indicator');
    const govtResponseText = document.getElementById('govt-response-text'); // Fixed: Changed document() to document.getElementById()

    const areaInput = document.getElementById('area-input');
    const locationInput = document.getElementById('location-input');
    const calculateSolarCostButton = document.getElementById('calculate-solar-cost-button');
    const solarCostResultContainer = document.getElementById('solar-cost-result-container');
    const solarLoadingIndicator = document.getElementById('solar-loading-indicator');
    const solarCostResultText = document.getElementById('solar-cost-result-text');

    // Problem Reporting Form elements
    const problemReportForm = document.getElementById('problem-report-form');
    const reporterNameInput = document.getElementById('reporter-name');
    const problemDescriptionInput = document.getElementById('problem-description');
    const forVillageCheckbox = document.getElementById('for-village');
    const villageLocationInput = document.getElementById('village-location');
    const detectLocationButton = document.getElementById('detect-location-button');
    const problemImageUpload = document.getElementById('problem-image-upload');
    const problemImageLoading = document.getElementById('problem-image-loading');


    // Chatbot elements
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotModalOverlay = document.getElementById('chatbot-modal-overlay');
    const chatbotModalCloseButton = document.getElementById('chatbot-modal-close-button');
    const chatbotMessagesContainer = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendButton = document.getElementById('chatbot-send-button');
    const chatbotLoadingIndicator = document.getElementById('chatbot-loading-indicator');


    // Map specific elements and Three.js variables
    const mapCanvas = document.getElementById('india-map-canvas');
    const rotateLeftButton = document.getElementById('rotate-left-button');
    const rotateRightButton = document.getElementById('rotate-right-button');
    const zoomInButton = document.getElementById('zoom-in-button');
    const zoomOutButton = document.getElementById('zoom-out-button');
    const resetMapButton = document.getElementById('reset-map-button');
    const mapLabelsContainer = document.getElementById('map-labels-container'); // New: Container for map labels

    let scene, camera, renderer, mapMesh;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const initialCameraZ = 400; // Initial zoom level
    const rotationSpeed = 0.1; // Radians per pixel for rotation
    const panSpeed = 0.5; // Pixels per mouse movement for panning - Adjusted for better responsiveness
    const zoomSpeed = 0.1; // Zoom speed for mouse wheel

    let mapData = null; // To store map bounds and village data

    let apiKey = null;

    async function fetchApiKey() {
        try {
            const response = await fetch('/get_api_key');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            apiKey = data.api_key;

            console.log("Fetched API Key:", apiKey);

        } catch (error) {
            console.error("Error fetching API key:", error);
        }
    }

    fetchApiKey();


    // Variable to store the last suggested medicines from the AI
    let lastSuggestedMedicines = '';

    /**
     * Initializes the Three.js scene for the map.
     */
    function initMap() {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1A1A1A); // Match CSS background

        // Camera
        camera = new THREE.PerspectiveCamera(75, mapCanvas.clientWidth / mapCanvas.clientHeight, 0.1, 2000);
        camera.position.z = initialCameraZ;

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: mapCanvas, antialias: true });
        renderer.setSize(mapCanvas.clientWidth, mapCanvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Handle high-DPI screens

        // Load map image as texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            '/generate_map', // Flask endpoint for map image
            function (texture) {
                const aspectRatio = texture.image.width / texture.image.height;
                const planeHeight = 500; // Arbitrary height for the plane
                const planeWidth = planeHeight * aspectRatio;

                const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
                const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
                mapMesh = new THREE.Mesh(geometry, material);
                scene.add(mapMesh);

                // Initial camera position to center the map
                camera.position.set(0, 0, 0); // Center the map in the view
                camera.lookAt(0, 0, 0);

                // Fetch map data (bounds and villages) and create labels
                fetchMapDataAndCreateLabels();

                animateMap(); // Start animation loop once texture is loaded
            },
            undefined, // onProgress callback (optional)
            function (err) {
                console.error('An error occurred loading the map texture:', err);
                showModal('Failed to load map image. Please try again later.', 'error');
            }
        );

        // Add event listeners for map interactions
        mapCanvas.addEventListener('mousedown', onMouseDown, false);
        mapCanvas.addEventListener('mouseup', onMouseUp, false);
        mapCanvas.addEventListener('mousemove', onMouseMove, false);
        mapCanvas.addEventListener('wheel', onMouseWheel, false);

        // Touch events for mobile
        mapCanvas.addEventListener('touchstart', onTouchStart, false);
        mapCanvas.addEventListener('touchend', onTouchEnd, false);
        mapCanvas.addEventListener('touchmove', onTouchMove, false);

        // Cursor change events
        mapCanvas.addEventListener('mouseenter', () => {
            if (!isDragging) mapCanvas.style.cursor = 'grab';
        });
        mapCanvas.addEventListener('mouseleave', () => {
            if (!isDragging) mapCanvas.style.cursor = 'default';
        });

        // Resize handler
        window.addEventListener('resize', onWindowResize, false);

        // Button event listeners
        rotateLeftButton.addEventListener('click', () => rotateCanvas(-0.1)); // Rotate by 0.1 radians
        rotateRightButton.addEventListener('click', () => rotateCanvas(0.1));
        zoomInButton.addEventListener('click', () => zoomCanvas(100)); // Zoom in by 100 units
        zoomOutButton.addEventListener('click', () => zoomCanvas(-100)); // Zoom out by 100 units
        resetMapButton.addEventListener('click', resetMap);
    }

    /**
     * Fetches map data (bounds and villages) from the backend and creates HTML labels.
     */
    async function fetchMapDataAndCreateLabels() {
        try {
            const response = await fetch('/get_map_data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            mapData = await response.json();
            createMapLabels();
        } catch (error) {
            console.error('Error fetching map data:', error);
        }
    }
    // AI Usage Tracking
    let aiUsageStats = {
        'ai-doctor': 0,
        'govt-ai': 0,
        'solar-calc': 0
    };

    function trackAIUsage(aiType) {
        fetch('/ai-usage-track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ai_type: aiType })
        })
            .then(res => res.json())
            .then(data => {
                updateUsageDisplay(aiType, data.count);
                // Add visual feedback
                showUsageUpdate(aiType);
            })
            .catch(err => console.error('Usage tracking failed:', err));
    }

    function updateUsageDisplay(aiType, count) {
        const elementMap = {
            'ai-doctor': 'ai-doctor-usage',
            'govt-ai': 'govt-ai-usage',
            'solar-calc': 'solar-calc-usage'
        };

        const element = document.getElementById(elementMap[aiType]);
        if (element) {
            // Add animation class
            element.classList.add('animate-pulse');
            element.textContent = count;

            // Remove animation after 1 second
            setTimeout(() => {
                element.classList.remove('animate-pulse');
            }, 1000);
        }
    }

    function showUsageUpdate(aiType) {
        // Create a small notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
        notification.textContent = 'AI Usage Tracked! 🚀';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function loadUsageStats() {
        fetch('/ai-usage-stats')
            .then(res => res.json())
            .then(data => {
                updateUsageDisplay('ai-doctor', data['ai-doctor'] || 0);
                updateUsageDisplay('govt-ai', data['govt-ai'] || 0);
                updateUsageDisplay('solar-calc', data['solar-calc'] || 0);
            })
            .catch(err => console.error('Loading usage stats failed:', err));
    }

    // Load stats on page load
    document.addEventListener('DOMContentLoaded', loadUsageStats);
    /**
     * Converts Latitude and Longitude to Three.js world coordinates on the map plane.
     * Assumes the map plane covers the full geographical bounds provided.
     * @param {number} lat - Latitude.
     * @param {number} lon - Longitude.
     * @param {object} bounds - Geographical bounds {min_lon, min_lat, max_lon, max_lat}.
     * @param {number} planeWidth - Width of the Three.js plane.
     * @param {number} planeHeight - Height of the Three.js plane.
     * @returns {THREE.Vector3} World coordinates.
     */
    function latLonToWorld(lat, lon, bounds, planeWidth, planeHeight) {
        const normalizedX = (lon - bounds.min_lon) / (bounds.max_lon - bounds.min_lon);
        // Latitude needs to be inverted for typical map projections where Y increases upwards
        const normalizedY = 1 - ((lat - bounds.min_lat) / (bounds.max_lat - bounds.min_lat));

        // Convert normalized coordinates to plane local coordinates (-planeWidth/2 to planeWidth/2, -planeHeight/2 to planeHeight/2)
        const x = (normalizedX - 0.5) * planeWidth;
        const y = (normalizedY - 0.5) * planeHeight;

        // The Z coordinate for the label should be slightly above the mapMesh
        const z = mapMesh ? mapMesh.position.z + 1 : 1; // Adjust Z if mapMesh has a Z position

        return new THREE.Vector3(x, y, z);
    }

    /**
     * Converts a Three.js world coordinate to 2D screen coordinates.
     * @param {THREE.Vector3} worldVector - The 3D world vector.
     * @returns {object} Object with x and y screen coordinates.
     */
    function worldToScreen(worldVector) {
        // Project the 3D point to 2D screen space
        worldVector.project(camera);

        const x = (worldVector.x * 0.5 + 0.5) * mapCanvas.clientWidth;
        const y = (-worldVector.y * 0.5 + 0.5) * mapCanvas.clientHeight;

        return { x, y };
    }

    /**
     * Creates and positions HTML labels for villages on the map.
     */
    function createMapLabels() {
        if (!mapData || !mapMesh) return;

        // Clear existing labels
        if (mapLabelsContainer) { // Ensure container exists before clearing
            mapLabelsContainer.innerHTML = '';
        } else {
            // Create the container if it doesn't exist (e.g., if it was removed from HTML)
            const newContainer = document.createElement('div');
            newContainer.id = 'map-labels-container';
            newContainer.style.position = 'absolute';
            newContainer.style.top = '0';
            newContainer.style.left = '0';
            newContainer.style.width = '100%';
            newContainer.style.height = '100%';
            newContainer.style.pointerEvents = 'none'; // Ensure it doesn't block map interactions
            mapCanvas.parentNode.insertBefore(newContainer, mapCanvas.nextSibling); // Insert after canvas
            mapLabelsContainer = newContainer; // Update reference
        }


        const bounds = mapData.map_bounds;
        const villages = mapData.villages;
        const planeWidth = mapMesh.geometry.parameters.width;
        const planeHeight = mapMesh.geometry.parameters.height;

        villages.forEach(village => {
            const worldPos = latLonToWorld(village.lat, village.lon, bounds, planeWidth, planeHeight);

            // Apply mapMesh's current rotation and position to the worldPos
            // This is crucial for labels to move with the map
            const transformedWorldPos = worldPos.clone().applyMatrix4(mapMesh.matrixWorld);

            const screenPos = worldToScreen(transformedWorldPos);

            const labelDiv = document.createElement('div');
            labelDiv.className = 'map-label absolute text-xs font-semibold text-white bg-blue-700/80 px-2 py-1 rounded-md whitespace-nowrap transform -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-200';
            labelDiv.textContent = village.state;
            labelDiv.style.left = `${screenPos.x}px`;
            labelDiv.style.top = `${screenPos.y}px`;
            labelDiv.style.opacity = '1'; // Ensure visible initially

            mapLabelsContainer.appendChild(labelDiv);
        });
    }

    /**
     * Updates the positions of existing map labels.
     */
    function updateMapLabels() {
        if (!mapData || !mapMesh || !mapLabelsContainer) return;

        const bounds = mapData.map_bounds;
        const planeWidth = mapMesh.geometry.parameters.width;
        const planeHeight = mapMesh.geometry.parameters.height;

        // Update camera and mapMesh world matrices before projection
        camera.updateMatrixWorld();
        mapMesh.updateMatrixWorld();

        Array.from(mapLabelsContainer.children).forEach((labelDiv, index) => {
            const village = mapData.villages[index];
            if (!village) return; // Safety check

            const worldPos = latLonToWorld(village.lat, village.lon, bounds, planeWidth, planeHeight);
            const transformedWorldPos = worldPos.clone().applyMatrix4(mapMesh.matrixWorld);
            const screenPos = worldToScreen(transformedWorldPos);

            labelDiv.style.left = `${screenPos.x}px`;
            labelDiv.style.top = `${screenPos.y}px`;

            // Optional: Hide labels if they are off-screen or too far
            const distance = transformedWorldPos.distanceTo(camera.position);
            if (distance > 1000 || screenPos.x < 0 || screenPos.x > mapCanvas.clientWidth || screenPos.y < 0 || screenPos.y > mapCanvas.clientHeight) {
                labelDiv.style.opacity = '0';
            } else {
                labelDiv.style.opacity = '1';
            }
        });
    }


    /**
     * Animation loop for Three.js.
     */
    function animateMap() {
        requestAnimationFrame(animateMap);
        renderer.render(scene, camera);
        if (mapData && mapMesh) { // Only update labels if data and mesh are loaded
            updateMapLabels();
        }
    }

    /**
     * Handles window resizing to adjust canvas and camera.
     */
    function onWindowResize() {
        camera.aspect = mapCanvas.clientWidth / mapCanvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mapCanvas.clientWidth, mapCanvas.clientHeight);
        if (mapData && mapMesh) { // Re-position labels on resize
            updateMapLabels();
        }
    }

    /**
     * Handles mouse down event for dragging.
     * @param {MouseEvent} event - The mouse event.
     */
    function onMouseDown(event) {
        isDragging = true;
        mapCanvas.style.cursor = 'grabbing'; // Change cursor to grabbing
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    /**
     * Handles mouse up event to stop dragging.
     */
    function onMouseUp() {
        isDragging = false;
        mapCanvas.style.cursor = 'grab'; // Change cursor back to grab
    }

    /**
     * Handles mouse move event for panning and rotation.
     * @param {MouseEvent} event - The mouse event.
     */
    function onMouseMove(event) {
        if (!isDragging) return;

        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        // Panning the mapMesh based on mouse movement
        mapMesh.position.x += deltaX * panSpeed;
        mapMesh.position.y -= deltaY * panSpeed; // Invert Y for intuitive drag

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        // Labels will be updated in animateMap loop
    }

    /**
     * Handles mouse wheel event for zooming.
     * @param {WheelEvent} event - The mouse wheel event.
     */
    function onMouseWheel(event) {
        event.preventDefault(); // Prevent page scrolling

        // Adjust camera Z position for zoom
        camera.position.z += event.deltaY * zoomSpeed; // Positive deltaY scrolls down (zoom out)

        // Clamp zoom to reasonable limits (e.g., prevent going too far in or out)
        // Adjust these values based on desired min/max zoom
        camera.position.z = Math.max(100, Math.min(2000, camera.position.z));
        // Labels will be updated in animateMap loop
    }

    /**
     * Handles touch start event for dragging.
     * @param {TouchEvent} event - The touch event.
     */
    function onTouchStart(event) {
        if (event.touches.length === 1) {
            isDragging = true;
            mapCanvas.style.cursor = 'grabbing'; // Change cursor to grabbing for touch
            previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
    }

    /**
     * Handles touch end event to stop dragging.
     */
    function onTouchEnd() {
        isDragging = false;
        mapCanvas.style.cursor = 'grab'; // Change cursor back to grab for touch
    }

    /**
     * Handles touch move event for panning.
     * @param {TouchEvent} event - The touch event.
     */
    function onTouchMove(event) {
        if (!isDragging || event.touches.length !== 1) return;

        const touch = event.touches[0];
        const deltaX = touch.clientX - previousMousePosition.x;
        const deltaY = touch.clientY - previousMousePosition.y;

        // Panning the mapMesh based on touch movement
        mapMesh.position.x += deltaX * panSpeed;
        mapMesh.position.y -= deltaY * panSpeed; // Invert Y for intuitive drag

        previousMousePosition = {
            x: touch.clientX,
            y: touch.clientY
        };
        // Labels will be updated in animateMap loop
    }

    /**
     * Rotates the canvas (scene) by a given angle.
     * This function is currently used by the UI buttons for rotation, not mouse drag.
     * @param {number} angle - The angle in radians to rotate.
     */
    function rotateCanvas(angle) {
        // Apply rotation to the mapMesh directly for independent rotation
        if (mapMesh) {
            mapMesh.rotation.y += angle;
        }
        // Labels will be updated in animateMap loop
    }

    /**
     * Zooms the canvas (camera) by a given amount.
     * @param {number} amount - The amount to zoom in/out. Positive for zoom in, negative for zoom out.
     */
    function zoomCanvas(amount) {
        camera.position.z -= amount;
        camera.position.z = Math.max(100, Math.min(2000, camera.position.z)); // Clamp zoom
        // Labels will be updated in animateMap loop
    }

    /**
     * Resets the map's rotation, position, and zoom to initial state.
     */
    function resetMap() {
        if (mapMesh) {
            mapMesh.rotation.set(0, 0, 0); // Reset map rotation
            mapMesh.position.set(0, 0, 0); // Reset map position (panning)
        }
        camera.position.z = initialCameraZ; // Reset camera zoom
        // Labels will be updated in animateMap loop
    }


    /**
     * Initializes all event listeners for the page.
     */
    function initializeEventListeners() {
        // Smooth scroll for navigation links
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking a link
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        // Toggle mobile menu visibility
        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', function () {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Navbar width and background change on scroll & Scroll to top button visibility
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
                navbar.classList.remove('py-4');
                navbar.classList.add('py-3');
            } else {
                navbar.classList.remove('scrolled');
                navbar.classList.remove('py-3');
                navbar.classList.add('py-4');

            }

            // Show/hide scroll to top button
            if (window.scrollY > 300) {
                scrollToTopButton.classList.add('show');
            } else {
                scrollToTopButton.classList.remove('show');
            }
        });

        // Scroll to top functionality
        if (scrollToTopButton) {
            scrollToTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the section is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        // Apply observer to all sections with the 'section-content' class
        sections.forEach(section => {
            const contentDiv = section.querySelector('.section-content');
            if (contentDiv) {
                observer.observe(contentDiv);
            }
        });

        // Add event listeners to Focus Area tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                handleTabClick('traditional', this);
            });
        });

        // Add event listeners to AI Solution tab buttons
        aiTabButtons.forEach(button => {
            button.addEventListener('click', function () {
                handleTabClick('ai', this);
            });
        });

        // Add hover effects to AI solution cards
        const aiSolutionCards = document.querySelectorAll('.ai-section-card');
        aiSolutionCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('ai-card-active-hover');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('ai-card-active-hover');
            });
        });


        // Handle contact form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }

        // Add event listeners for "Donate Now" buttons
        document.querySelectorAll('.donate-now-button').forEach(button => {
            button.addEventListener('click', function () {
                const optionName = this.dataset.optionName;
                handleDonateNow(optionName);
            });
        });

        // Add event listeners for "Apply Now" buttons
        document.querySelectorAll('.apply-now-button').forEach(button => {
            button.addEventListener('click', function () {
                const roleTitle = this.dataset.roleTitle;
                handleApplyNow(roleTitle);
            });
        });

        // AI Solution button listeners (updated after removing AI Assistant)
        if (generateMedicalResponseButton) {
            generateMedicalResponseButton.addEventListener('click', () => handleAIRequest(
                medicalPromptInput, medicalResponseContainer, medicalLoadingIndicator, medicalResponseText,
                (prompt) => `As an AI doctor, based on the following symptoms: "${prompt}", provide a very concise response that ONLY includes:
1.  **Condition:** A brief potential condition.
2.  **Medicines:** Suggested over-the-counter medicines (if any).
3.  **Appointment:** State clearly if a doctor's appointment is necessary.
AND OUTPUT SHOULD BE IN LANGUAGE USER TYPES
Use simple language and Markdown for bolding and lists. Do not add any extra conversational text.`
                , medicalActions
                
            ));
            trackAIUsage('ai-doctor');
        }

        if (bookMedicineButton) {
            bookMedicineButton.addEventListener('click', () => {
                // The symptoms parameter is no longer directly used for optionName in this function,
                // as we now use the extracted lastSuggestedMedicines.
                const location = villageLocationInput.value.trim();

                // Call the new endpoint for medicines
                handleBookMedicines(location);
            });
        }

        if (bookAppointmentButton) {
            bookAppointmentButton.addEventListener('click', () => {
                // Use the value from the problem reporting form's villageLocationInput

                const location = villageLocationInput.value.trim();
                const displayLocation = location ? location : 'your detected location';
                const appointmentDetails = medicalPromptInput.value.trim(); // Use the symptom input for appointment details

                handledoctorappointement(appointmentDetails, displayLocation)


            });
        }

        if (generateGovtResponseButton) {
            generateGovtResponseButton.addEventListener('click', () => handleAIRequest(
                govtPromptInput, govtResponseContainer, govtLoadingIndicator, govtResponseText,
                (prompt) => `As an AI assistant for Digital Bharat, for the problem: "${prompt}", list relevant government scheme names. For each scheme, ONLY include:
1.  **Scheme Name:** The official name of the scheme.
2.  **Valid Till:** The validity period or deadline (if applicable).
3.  **Benefit:** A concise explanation of how it directly benefits the user.
AND OUTPUT SHOULD BE IN LANGUAGE USER TYPES
Use simple language and Markdown for bolding and lists. Do not add any extra conversational text.`
            ));
            trackAIUsage('govt-ai');
        }

        if (calculateSolarCostButton) {
            calculateSolarCostButton.addEventListener('click', () => {
                const area = parseFloat(areaInput.value.trim());
                const location = locationInput.value.trim();

                if (isNaN(area) || area <= 0 || !location) {
                    showModal('Please enter a valid area (in sq. ft.) and location for solar cost calculation.', 'error');
                    return;
                }

                const prompt = `You are an expert in solar energy installations in India. Based on an area of ${area} sq. ft. located in ${location}, India, provide ONLY the following precise information:

1. **Area:** The specified area in square feet.
2. **City/Location:** The specified city or location.
3. **Cost After Subsidies:** Estimate the installation cost after applying relevant government subsidies (mention PM-KUSUM if applicable).
4. **Company Deduction:** Calculate and mention the amount deducted by the company at a rate of ₹500 per square foot.
5. **Total Cost:** Provide the final estimated installation cost after all deductions.

MAKE IT ACCORDING TO INDIAN SYSTEM AND IF TOTAL COST IS LESS THAN 0 KEEP IT ZERO NOT IN NEGATIVE
AND OUTPUT SHOULD BE IN LANGUAGE USER TYPES
Present the output clearly and concisely, using only the requested data points. Do not include any extra explanations or conversational text.`;

                handleAIRequest(
                    null, // No direct prompt input element, prompt is constructed
                    solarCostResultContainer, solarLoadingIndicator, solarCostResultText,
                    () => prompt // Pass a function that returns the constructed prompt
                );
            });
            trackAIUsage('solar-calc');
        }

        // Problem Reporting Form Listeners
        if (problemReportForm) {
            problemReportForm.addEventListener('submit', handleProblemReportSubmit);
        }
        if (detectLocationButton) {
            detectLocationButton.addEventListener('click', detectLocation); // Corrected: Changed detectLocation.addEventListener to detectLocationButton.addEventListener
        }
        if (problemImageUpload) {
            problemImageUpload.addEventListener('change', handleImageUpload);
        }

        // Chatbot Listeners
        if (chatbotButton) {
            chatbotButton.addEventListener('click', () => {
                // Ensure the 'hidden' class is removed first
                chatbotModalOverlay.classList.remove('hidden');
                chatbotModalOverlay.classList.add('show');
                // Removed: chatbotMessagesContainer.innerHTML = ''; // Do not clear messages on open
                chatbotInput.value = '';
                // Only add initial message if chat is empty
                if (chatbotMessagesContainer.children.length === 0) {
                    addChatMessage('AI', 'Hello! How can I help you today regarding Digital Bharat initiatives? You can ask me to scroll to sections like "About Mission", "Focus Areas", "AI Solutions", "Impact Dashboard", "Get Involved", "Government Schemes", or "Contact Us".', 'ai');
                }
            });
        }

        if (chatbotModalCloseButton) {
            chatbotModalCloseButton.addEventListener('click', () => {
                chatbotModalOverlay.classList.remove('show');
                // Add 'hidden' back when closing to ensure display:none
                chatbotModalOverlay.classList.add('hidden');
            });
        }

        if (chatbotSendButton) {
            chatbotSendButton.addEventListener('click', sendChatMessage);
            chatbotInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    sendChatMessage();
                }
            });
        }
    }

    /**
     * Handles clicks on tab buttons (both traditional and AI solution tabs).
     * @param {string} tabType - 'traditional' or 'ai'
     * @param {HTMLElement} clickedButton - The button that was clicked.
     */
    function handleTabClick(tabType, clickedButton) {
        if (tabType === 'traditional') {
            // Only reset traditional buttons and container
            const allTraditionalButtons = document.querySelectorAll('.tab-button');
            allTraditionalButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-gradient-to-r', 'from-[var(--accent-saffron)]', 'to-[var(--accent-emerald)]', 'text-white', 'shadow-xl', 'transform', 'translate-y-[-2px]');
                btn.classList.add('bg-dark-bg-tertiary', 'text-dark-text-primary', 'hover:bg-accent-saffron', 'hover:text-white', 'shadow-lg', 'border', 'border-dark-border');
            });

            clickedButton.classList.add('active');
            clickedButton.classList.remove('bg-dark-bg-tertiary', 'text-dark-text-primary', 'hover:bg-accent-saffron', 'hover:text-white', 'shadow-lg', 'border', 'border-dark-border');
            clickedButton.classList.add('bg-gradient-to-r', 'from-[var(--accent-saffron)]', 'to-[var(--accent-emerald)]', 'text-white', 'shadow-xl', 'transform', 'translate-y-[-2px]');

            traditionalTabContentContainer.classList.remove('hidden');
            loadTraditionalFocusAreaContent(clickedButton.dataset.tab);
        } else if (tabType === 'ai') {
            // Only reset AI buttons and containers
            const allAiButtons = document.querySelectorAll('.ai-tab-button');
            const allAiContentDivs = document.querySelectorAll('[id$="-tab-content"]');
            allAiButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-gradient-to-r', 'from-[var(--accent-saffron)]', 'to-[var(--accent-emerald)]', 'text-white', 'shadow-xl', 'transform', 'translate-y-[-2px]');
                btn.classList.add('bg-dark-bg-tertiary', 'text-dark-text-primary', 'hover:bg-accent-saffron', 'hover:text-white', 'shadow-lg', 'border', 'border-dark-border');
            });
            allAiContentDivs.forEach(div => {
                div.classList.add('hidden');
            });

            clickedButton.classList.add('active');
            clickedButton.classList.remove('bg-dark-bg-tertiary', 'text-dark-text-primary', 'hover:bg-accent-saffron', 'hover:text-white', 'shadow-lg', 'border', 'border-dark-border');
            clickedButton.classList.add('bg-gradient-to-r', 'from-[var(--accent-saffron)]', 'to-[var(--accent-emerald)]', 'text-white', 'shadow-xl', 'transform', 'translate-y-[-2px]');

            const tabId = clickedButton.dataset.tab;
            const targetContentDiv = document.getElementById(tabId + '-content');
            if (targetContentDiv) {
                targetContentDiv.classList.remove('hidden');
            }
        }
    }


    /**
     * Fetches and loads content for traditional Focus Areas into the designated container.
     * @param {string} tabId - The ID of the focus area to load.
     */
    function loadTraditionalFocusAreaContent(tabId) {
        traditionalTabContentContainer.innerHTML = `
            <div class="flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-saffron)]"></div>
                <p class="text-[var(--accent-saffron)] ml-4">Loading content...</p>
            </div>
        `;

        fetch('/static/data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const focusAreas = data.focus_areas_content;
                const selectedArea = focusAreas.find(area => area.id === tabId);

                if (selectedArea) {
                    let initiativesHtml = selectedArea.initiatives.map(item => `
                        <li class="flex items-start text-[var(--dark-text-primary)]">
                            <i class="material-icons notranslate text-[var(--accent-emerald)] mr-3 w-5 h-5">check_circle</i>
                            <span>${item}</span>
                        </li>
                    `).join('');

                    traditionalTabContentContainer.innerHTML = `
                        <div class="rounded-xl p-8 grid md:grid-cols-2 gap-8 items-center animate-fade-in">
                            <div>
                                <h3 class="text-3xl font-bold text-white mb-4">${selectedArea.title}</h3>
                                <p class="text-lg text-[var(--dark-text-primary)] leading-relaxed mb-6">${selectedArea.description}</p>
                                <h4 class="text-xl font-semibold text-white mb-4">Key Initiatives:</h4>
                                <ul class="space-y-3">
                                    ${initiativesHtml}
                                </ul>
                            </div>
                            <div>
                                <img src="${selectedArea.image_url}" alt="${selectedArea.title}" class="rounded-xl shadow-2xl w-full h-auto object-cover transform hover:scale-103 transition duration-300">
                            </div>
                        </div>
                    `;
                } else {
                    traditionalTabContentContainer.innerHTML = `<p class="text-center text-[var(--dark-text-secondary)] py-10">Content not found for this area.</p>`;
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                traditionalTabContentContainer.innerHTML = `<p class="text-center text-red-500 py-10">Failed to load content. Please try again later.</p>`;
            });
    }

    /**
     * Handles the submission of the contact form.
     * @param {Event} event - The submit event.
     */
    async function handleContactFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        const name = contactForm.querySelector('#name').value;
        const email = contactForm.querySelector('#email').value;
        const message = contactForm.querySelector('#message').value;
        const category = contactForm.querySelector('#category').value;

        if (!name || !email || !message || !category) {
            showModal('Please fill in all required fields.', 'error');
            return;
        }

        showModal('Sending your message...', 'info', 'Processing...');

        try {
            const response = await fetch('/submit_contact_form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message, category })
            });

            const result = await response.json();

            if (response.ok) {
                showModal(result.message, 'success');
                contactForm.reset(); // Clear the form
            } else {
                showModal(result.message || 'Failed to send message.', 'error');
                console.error('Backend error:', result);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            showModal('An error occurred while sending your message. Please try again later.', 'error');
        }
    }

    /**
     * Handles the submission of the problem report form.
     * @param {Event} event - The submit event.
     */
    async function handleProblemReportSubmit(event) {
        event.preventDefault();

        const reporterName = reporterNameInput.value.trim();
        const problemDescription = problemDescriptionInput.value.trim();
        const forVillage = forVillageCheckbox.checked;
        let villageLocation = villageLocationInput.value.trim();
        const imageFile = problemImageUpload.files[0]; // Get the selected file

        if (!reporterName || !problemDescription || !villageLocation) {
            showModal('Please fill in all required fields for the problem report.', 'error');
            return;
        }

        showModal('Submitting your report...', 'info', 'Processing...');

        try {
            const payload = {
                reporterName,
                problemDescription,
                forVillage,
                villageLocation,
                imageAttached: !!imageFile // Indicate if an image is attached
            };

            // In a real application, if imageFile exists, you would upload it separately
            // to a file storage service (e.g., Firebase Storage, AWS S3) and then
            // send the image URL along with the form data.
            // For this example, we'll just indicate its presence.

            const response = await fetch('/submit_problem_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                showModal(result.message, 'success');
                problemReportForm.reset(); // Clear the form
                problemImageLoading.classList.add('hidden'); // Hide loading if it was shown
            } else {
                showModal(result.message || 'Failed to submit problem report.', 'error');
                console.error('Backend error:', result);
            }
        } catch (error) {
            console.error('Error submitting problem report:', error);
            showModal('An error occurred while submitting your report. Please try again later.', 'error');
        }
    }

    /**
     * Handles the image upload process (client-side simulation).
     * In a real app, this would involve sending the file to a backend storage.
     */
    function handleImageUpload() {
        if (problemImageUpload.files.length > 0) {
            problemImageLoading.classList.remove('hidden');
            // Simulate image processing/upload
            setTimeout(() => {
                problemImageLoading.classList.add('hidden');
                // showModal('Image selected for upload. (Upload functionality not fully implemented in demo)', 'info');
            }, 1000);
        } else {
            problemImageLoading.classList.add('hidden');
        }
    }

    /**
     * Handles "Donate Now" button clicks.
     * @param {string} optionName - The name of the donation option.
     */
    async function handleDonateNow(optionName) {
        showModal(`Processing your donation for "${optionName}"...`, 'info', 'Processing Donation');
        try {
            const response = await fetch('/submit_donation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ optionName })
            });

            const result = await response.json();

            if (response.ok) {
                showModal(result.message, 'success', 'Donation Successful!');
            } else {
                showModal(result.message || 'Failed to process donation.', 'error', 'Donation Failed');
                console.error('Backend error:', result);
            }
        } catch (error) {
            console.error('Error processing donation:', error);
            showModal('An error occurred while processing your donation. Please try again later.', 'error', 'Donation Error');
        }
    }

    /**
     * Handles booking medicines request.
     * @param {string} location - The detected/entered location.
     */
    async function handleBookMedicines(location) {
        const medicinesToBook = lastSuggestedMedicines; // Use the extracted medicines
        if (!medicinesToBook || medicinesToBook === 'No specific medicines suggested.') {
            showModal('No specific medicines were suggested by the AI to book. Please get AI medical advice first.', 'error', 'Booking Failed');
            return;
        }

        showModal(`Sending request to book medicines: "${medicinesToBook}" to location: "${location}"...`, 'info', 'Processing Medicine Request');
        try {
            const response = await fetch('/medicines', { // Use the new /medicines endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ optionName: medicinesToBook, location: location }) // Sending extracted medicines as optionName
            });

            const result = await response.json();

            if (response.ok) {
                showModal(result.message, 'success', 'Medicine Request Sent!');
            } else {
                showModal(result.message || 'Failed to book medicines.', 'error', 'Medicine Request Failed');
                console.error('Backend error:', result);
            }
        } catch (error) {
            console.error('Error booking medicines:', error);
            showModal('An error occurred while booking medicines. Please try again later.', 'error', 'Medicine Booking Error');
        }
    }


    async function handledoctorappointement(optionName, location) {
        showModal(`Processing your request for "${optionName}"...`, 'info', 'Processing Donation');
        try {
            const response = await fetch('/doctor_appointement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ optionName, location })
            });

            const result = await response.json();

            if (response.ok) {
                showModal(result.message, 'success', 'Donation Successful!');
            } else {
                showModal(result.message || 'Failed to book doctor.', 'error', 'Donation Failed');
                console.error('Backend error:', result);
            }
        } catch (error) {
            console.error('Error processing appointement:', error);
            showModal('An error occurred while processing your appointemtn. Please try again later.', 'error', 'Donation Error');
        }
    }

    /**
     * Handles "Apply Now" button clicks.
     * @param {string} roleTitle - The title of the role being applied for.
     */
    async function handleApplyNow(roleTitle) {
        showModal(`Submitting your application for "${roleTitle}"...`, 'info', 'Processing Application');
        try {
            const response = await fetch('/submit_application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roleTitle })
            });

            const result = await response.json();

            if (response.ok) {
                showModal(result.message, 'success', 'Application Submitted!');
            } else {
                showModal(result.message || 'Failed to submit application.', 'error', 'Application Failed');
                console.error('Backend error:', result);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            showModal('An error occurred while submitting your application. Please try again later.', 'error', 'Application Error');
        }
    }


    /**
     * Attempts to detect the user's current location using Geolocation API.
     */
    function detectLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    // You would typically use a reverse geocoding API here
                    // For demonstration, we'll just put coordinates or a generic message
                    villageLocationInput.value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;

                    // Optional: Call a reverse geocoding API (e.g., OpenStreetMap Nominatim)
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                        const data = await response.json();
                        if (data.address && data.address.village) {
                            villageLocationInput.value = data.address.village + (data.address.district ? `, ${data.address.district}` : '') + (data.address.state ? `, ${data.address.state}` : '');
                        } else if (data.display_name) {
                            villageLocationInput.value = data.display_name;
                        }
                    } catch (geoError) {
                        console.warn('Reverse geocoding failed:', geoError);
                        // Fallback to coordinates if reverse geocoding fails
                    }

                },
                (error) => {
                    console.error('Geolocation error:', error);
                    let errorMessage = 'Unable to retrieve your location.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please allow location access in your browser settings or type manually.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'The request to get user location timed out.';
                            break;
                    }
                    showModal(errorMessage, 'error');
                }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
            );
        } else {
            showModal('Geolocation is not supported by your browser. Please enter your location manually.', 'error');
        }
    }


    detectLocation()


    /**
     * Shows a custom modal message.
     * @param {string} message - The message to display.
     * @param {string} type - 'success', 'error', or 'info' (defaults to 'success').
     * @param {string} title - Optional title for the modal.
     */
    function showModal(message, type = 'success', title = '') {
        const modalOverlay = document.getElementById('custom-modal-overlay');
        const modalTitle = document.getElementById('custom-modal-title');
        const modalMessage = document.getElementById('custom-modal-message');
        const closeModalButton = document.getElementById('custom-modal-close-button');

        // Ensure the modal overlay is visible
        modalOverlay.classList.remove('hidden'); // Remove hidden class first
        modalOverlay.classList.add('show');

        modalTitle.textContent = title || (type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Information');
        modalMessage.innerHTML = message; // Use innerHTML to allow for basic HTML in message

        // Apply color based on type
        if (type === 'success') {
            modalTitle.style.color = 'var(--accent-emerald)';
        } else if (type === 'error') {
            modalTitle.style.color = 'var(--accent-saffron)'; // Use saffron for errors
        } else {
            modalTitle.style.color = 'var(--accent-blue)';
        }

        const closeAndHideModal = () => {
            modalOverlay.classList.remove('show');
            // Add hidden class after transition, or immediately if no transition
            // For simplicity, adding immediately. If transitions are long, consider a setTimeout.
            modalOverlay.classList.add('hidden');
        };


        closeModalButton.onclick = closeAndHideModal;

        // Close modal if clicked outside content
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeAndHideModal();
            }
        });
    }


    /**
     * Populates the scheme categories dropdown and loads schemes.
     */
    function loadSchemeCategoriesAndSchemes() {
        fetch('/static/data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('[Schemes Debug] Fetched data.json:', data); // Debug log
                const schemes = data.government_subsidy_schemes;
                console.log('[Schemes Debug] Extracted schemes:', schemes); // Debug log

                // Ensure schemes is an array and not empty
                if (!schemes || !Array.isArray(schemes) || schemes.length === 0) {
                    console.log('[Schemes Debug] No schemes found or schemes is not an array. Displaying default message.'); // Debug log
                    // If no schemes, display the friendly message and return
                    displaySchemes('', []); // Pass empty array to ensure default message
                    return;
                }

                const categories = [...new Set(schemes.map(scheme => scheme.category))];
                console.log('[Schemes Debug] Extracted categories:', categories); // Debug log

                // Clear existing options except the default "Select an option"
                schemeCategorySelect.innerHTML = '<option value="" class="bg-gray-800 text-[var(--dark-text-primary)]">Select an option</option>';

                // Populate dropdown with categories
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // Format category name
                    option.classList.add('bg-gray-800', 'text-[var(--dark-text-primary)]'); // Apply dark mode styles to options
                    schemeCategorySelect.appendChild(option);
                });

                // Add event listener for category selection
                schemeCategorySelect.addEventListener('change', function () {
                    displaySchemes(this.value, schemes);
                });

                // Initially display the "Please select a category..." message
                displaySchemes('', schemes); // Pass empty string to show initial message
            })
            .catch(error => {
                console.error('[Schemes Debug] Error fetching scheme data:', error); // Debug log
                // Display a user-friendly error message if data fetch fails
                schemesContentContainer.innerHTML = `
                    <div class="flex flex-col justify-center items-center py-10 text-red-500">
                        <i class="material-icons notranslate text-6xl mb-4">error</i>
                        <p class="text-xl font-semibold mb-2">Failed to load schemes.</p>
                        <p class="text-lg text-center max-w-md">Please try again later or check your internet connection.</p>
                    </div>
                `;
            });
    }

    /**
     * Displays schemes based on the selected category.
     * @param {string} selectedCategory - The category to filter schemes by.
     * @param {Array} allSchemes - All available schemes.
     */
    function displaySchemes(selectedCategory, allSchemes) {
        schemesContentContainer.innerHTML = ''; // Clear previous schemes

        if (!selectedCategory) {
            console.log('[Schemes Debug] No category selected. Displaying initial prompt.'); // Debug log
            // If nothing is selected, display the prompt message
            schemesContentContainer.innerHTML = `
                <div class="flex flex-col justify-center items-center py-10 text-[var(--dark-text-secondary)]">
                    <i class="material-icons notranslate text-6xl mb-4 text-[var(--accent-emerald)]">category</i>
                    <p class="text-xl font-semibold mb-2">Please select a category to view relevant schemes.</p>
                    <p class="text-lg text-center max-w-md">Use the dropdown above to filter government initiatives by category.</p>
                </div>
            `;
            return;
        }

        let filteredSchemes = allSchemes.filter(scheme => scheme.category === selectedCategory);
        console.log(`[Schemes Debug] Filtered schemes for category "${selectedCategory}":`, filteredSchemes); // Debug log

        if (filteredSchemes.length > 0) {
            filteredSchemes.forEach(scheme => {
                const eligibilityHtml = scheme.eligibility.map(item => `<li>${item}</li>`).join('');
                const benefitsHtml = scheme.benefits.map(item => `<li>${item}</li>`).join('');
                const processHtml = scheme.process.map(item => `<li>${item}</li>`).join('');
                const documentsHtml = scheme.documents.map(item => `
                    <span class="bg-[var(--accent-blue)] text-white text-sm font-medium px-4 py-1 rounded-full shadow-sm">${item}</span>
                `).join('');

                const schemeCard = `
                    <div class="glass-card rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h3 class="text-3xl font-bold text-white mb-2 sm:mb-0">${scheme.name}</h3>
                            <span class="text-sm font-semibold px-4 py-1 rounded-full ${scheme.status === 'Active' ? 'bg-[var(--accent-emerald)] text-white' : 'bg-[var(--accent-saffron)] text-white'}">
                                ${scheme.status}
                            </span>
                        </div>
                        <p class="text-[var(--dark-text-primary)] mb-2"><span class="font-semibold text-[var(--accent-saffron)]">Ministry:</span> ${scheme.ministry}</p>
                        <p class="text-[var(--dark-text-primary)] mb-6">${scheme.description}</p>

                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 class="text-xl font-semibold text-white mb-4 flex items-center"><i class="material-icons notranslate text-[var(--accent-saffron)] mr-2 w-6 h-6">person</i>Eligibility:</h4>
                                <ul class="list-disc list-inside text-[var(--dark-text-primary)] space-y-2">
                                    ${eligibilityHtml}
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-xl font-semibold text-white mb-4 flex items-center"><i class="material-icons notranslate text-[var(--accent-saffron)] mr-2 w-6 h-6">emoji_events</i>Benefits:</h4>
                                <ul class="list-disc list-inside text-[var(--dark-text-primary)] space-y-2">
                                    ${benefitsHtml}
                                </ul>
                            </div>
                        </div>

                        <div class="mt-8">
                            <h4 class="text-xl font-semibold text-white mb-4 flex items-center"><i class="material-icons notranslate text-[var(--accent-saffron)] mr-2 w-6 h-6">description</i>Application Process:</h4>
                            <ol class="list-decimal list-inside text-[var(--dark-text-primary)] space-y-2">
                                ${processHtml}
                            </ol>
                        </div>

                        <div class="mt-8">
                            <h4 class="text-xl font-semibold text-white mb-4 flex items-center"><i class="material-icons notranslate text-[var(--accent-saffron)] mr-2 w-6 h-6">folder_open</i>Required Documents:</h4>
                            <div class="flex flex-wrap gap-3">
                                ${documentsHtml}
                            </div>
                        </div>

                        <div class="mt-8 text-right text-sm text-[var(--dark-text-secondary)]">
                            <span class="font-semibold">Deadline:</span> ${scheme.deadline}
                        </div>
                    </div>
                `;
                schemesContentContainer.insertAdjacentHTML('beforeend', schemeCard);
            });
        } else {
            console.log(`[Schemes Debug] No schemes found for category "${selectedCategory}". Displaying "No schemes found" message.`); // Debug log
            schemesContentContainer.innerHTML = `<p class="text-center text-[var(--dark-text-secondary)] py-10">No schemes found for the selected category.</p>`;
        }
    }

    /**
     * Converts Markdown text to basic HTML for display.
     * @param {string} text - The Markdown text to convert.
     * @returns {string} The HTML string.
     */
    function renderMarkdown(text) {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
        formattedText = formattedText.replace(/^- (.*)$/gm, '<li>$1</li>'); // List items
        if (formattedText.includes('<li>')) { // Wrap lists if present
            formattedText = formattedText.replace(/<ul>\s*<li>/s, '<ul><li>').replace(/<\/li>\s*<\/ul>/s, '</li></ul>'); // Clean up whitespace around ul/li
            formattedText = `<ul>${formattedText}</ul>`; // Ensure it's wrapped in <ul>
        }
        formattedText = formattedText.replace(/\n/g, '<br>'); // Newlines to <br>
        return formattedText;
    }

    /**
     * Handles generic AI API requests.
     * @param {HTMLElement} promptInput - The input element containing the user's prompt (can be null if prompt is generated).
     * @param {HTMLElement} responseContainer - The container to show/hide for the response.
     * @param {HTMLElement} loadingIndicator - The loading indicator element.
     * @param {HTMLElement} responseTextElement - The element to display the AI response.
     * @param {Function} promptGenerator - A function that takes the prompt text and returns the full prompt string for the AI.
     * @param {HTMLElement} [actionButtons=null] - Optional element containing action buttons to show after response.
     */
    async function handleAIRequest(promptInput, responseContainer, loadingIndicator, responseTextElement, promptGenerator, actionButtons = null) {
        const promptValue = promptInput ? promptInput.value.trim() : '';
        const prompt = promptGenerator(promptValue);

        if (!promptValue && promptInput) { // Only check if promptInput exists
            showModal('Please enter your query.', 'error');
            return;
        }

        responseContainer.classList.remove('hidden');
        loadingIndicator.classList.remove('hidden');
        responseTextElement.innerHTML = ''; // Clear previous response
        if (actionButtons) {
            actionButtons.classList.add('hidden'); // Hide action buttons initially
        }

        try {
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            // Use the global apiKey variable
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                responseTextElement.innerHTML = renderMarkdown(text);

                // Extract medicines from the AI response for the AI Doctor tab
                if (responseTextElement === medicalResponseText) {
                    // Updated regex to capture all content after "**Medicines:**" until "**Appointment:**" or end of string
                    const medicineMatch = text.match(/\*\*Medicines:\*\*([\s\S]*?)(?=\*\*Appointment:\*\*|$)/);
                    if (medicineMatch && medicineMatch[1]) {
                        lastSuggestedMedicines = medicineMatch[1].trim();
                    } else {
                        lastSuggestedMedicines = 'No specific medicines suggested.';
                    }
                }

                if (actionButtons) {
                    actionButtons.classList.remove('hidden'); // Show action buttons after response
                }
            } else {
                responseTextElement.innerHTML = 'Sorry, I could not generate a response. Please try again.';
                console.error('Unexpected API response structure:', result);
                showModal('Failed to get a response from AI. Please check console for details.', 'error');
            }
        } catch (error) {
            console.error('Error during AI request:', error);
            responseTextElement.innerHTML = 'An error occurred while connecting to the AI. Please try again later.';
            showModal('An error occurred during the AI request. Please try again later.', 'error');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    /**
     * Adds a message to the chatbot interface.
     * @param {string} sender - 'User' or 'AI'.
     * @param {string} message - The message text.
     * @param {string} type - 'user' or 'ai' for styling.
     */
    function addChatMessage(sender, message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', type);
        messageElement.innerHTML = `<strong class="notranslate">${sender}:</strong> ${renderMarkdown(message)}`;
        chatbotMessagesContainer.appendChild(messageElement);
        chatbotMessagesContainer.scrollTop = chatbotMessagesContainer.scrollHeight; // Scroll to bottom
    }

    /**
     * Executes a command received from the AI.
     * @param {string} commandString - The command string (e.g., "SCROLL_TO:#about").
     */
    function handleAiCommand(commandString) {
        const parts = commandString.split(':');
        const commandType = parts[0];
        const commandValue = parts.slice(1).join(':'); // Rejoin in case value has colons

        switch (commandType) {
            case 'SCROLL_TO':
                const targetElement = document.querySelector(commandValue);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Optionally close the chatbot modal after scrolling
                    chatbotModalOverlay.classList.remove('show');
                    chatbotModalOverlay.classList.add('hidden'); // Ensure it's hidden after action
                } else {
                    console.warn(`AI tried to scroll to non-existent element: ${commandValue}`);
                    showModal(`Sorry, I couldn't find the section "${commandValue.replace('#', '')}".`, 'error');
                }
                break;
            // Add more command types here if needed (e.g., OPEN_MODAL, SHOW_INFO)
            default:
                console.warn(`Unknown AI command: ${commandString}`);
                showModal('AI issued an unknown command.', 'error');
                break;
        }
    }

    /**
     * Sends a message from the chatbot input to the AI.
     */
    async function sendChatMessage() {
        const userMessage = chatbotInput.value.trim();
        if (!userMessage) return;

        addChatMessage('You', userMessage, 'user');
        chatbotInput.value = ''; // Clear input

        chatbotLoadingIndicator.classList.remove('hidden');
        chatbotMessagesContainer.scrollTop = chatbotMessagesContainer.scrollHeight; // Scroll to bottom to show loading

        // Check for specific keywords to redirect to problem reporting form
        if (userMessage.toLowerCase().includes('drought') || userMessage.toLowerCase().includes('problem') || userMessage.toLowerCase().includes('issue')) {
            addChatMessage('AI', 'It sounds like you are facing a problem. I\'ll take you to the Problem Reporting form where you can submit details.', 'ai');
            handleAiCommand('SCROLL_TO:#problem-reporting');
            chatbotLoadingIndicator.classList.add('hidden');
            return; // Exit the function to prevent AI call
        }

        try {
            let chatHistory = [];
            // The prompt needs to instruct the AI on how to use commands.
            const aiPrompt = `You are a helpful assistant for the Digital Bharat website.
If the user asks about a specific section (e.g., "About Mission", "Our Solution", "Focus Areas", "AI Solutions", "Impact Dashboard", "Get Involved", "Government Schemes", "Contact Us", "Problem Reporting"),
respond with a command to scroll to that section using the exact format: [COMMAND:SCROLL_TO:#section-id].
For example, if asked about "About Mission", respond with: [COMMAND:SCROLL_TO:#about]
If asked about "Our Solution", respond with: [COMMAND:SCROLL_TO:#solution]
If asked about "Problem Reporting", respond with: [COMMAND:SCROLL_TO:#problem-reporting]
If you cannot fulfill the request with a command, provide a concise and helpful textual answer.
User query: ${userMessage}`;

            chatHistory.push({ role: "user", parts: [{ text: aiPrompt }] });

            const payload = { contents: chatHistory };
            // Use the global apiKey variable
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiResponse = result.candidates[0].content.parts[0].text;

                // Check for a command in the AI response
                const commandMatch = aiResponse.match(/\[COMMAND:([^\]]+)\]/);
                if (commandMatch) {
                    const command = commandMatch[1];
                    handleAiCommand(command);
                    // Display the text part of the response, removing the command tag
                    const cleanResponse = aiResponse.replace(/\[COMMAND:([^\]]+)\]/, '').trim();
                    addChatMessage('AI', cleanResponse || 'Command executed.', 'ai');
                } else {
                    addChatMessage('AI', aiResponse, 'ai');
                }
            } else {
                addChatMessage('AI', 'Sorry, I could not generate a response. Please try again.', 'ai');
                console.error('Unexpected API response structure:', result);
            }
        } catch (error) {
            console.error('Error during chatbot AI request:', error);
            addChatMessage('AI', 'An error occurred while connecting to the AI. Please try again later.', 'ai');
        } finally {
            chatbotLoadingIndicator.classList.add('hidden');
            chatbotMessagesContainer.scrollTop = chatbotMessagesContainer.scrollHeight; // Scroll to bottom after response
        }
    }


    // Initializations on DOM Content Loaded
    initializeEventListeners();
    loadSchemeCategoriesAndSchemes(); // Load scheme categories and schemes on page load
    initMap(); // Initialize the Three.js map

    // Activate the "Digital Education" tab by default for Focus Areas
    const digitalEducationTabButton = document.querySelector('.tab-button[data-tab="digital-education"]');
    if (digitalEducationTabButton) {
        digitalEducationTabButton.click();
    } else {
        // Fallback: Activate the first traditional tab if 'digital-education' is not found
        const firstTraditionalTabButton = document.querySelector('.tab-button:not([data-tab$="-tab"])');
        if (firstTraditionalTabButton) {
            firstTraditionalTabButton.click();
        }
    }

    // Activate the "AI Doctor" tab by default for AI Solutions (since AI Assistant is removed)
    const aiDoctorTabButton = document.querySelector('.ai-tab-button[data-tab="ai-doctor-tab"]');
    if (aiDoctorTabButton) {
        aiDoctorTabButton.click();
    }
});
