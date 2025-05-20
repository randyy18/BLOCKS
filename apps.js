document.addEventListener('DOMContentLoaded', () => {
    console.log("App DOMContentLoaded: Initializing with Visible Countdown Timer...");
    // --- DOM ELEMENTS ---
    const parentalModeBtn = document.getElementById('parentalModeBtn');
    const premiumFeaturesBtn = document.getElementById('premiumFeaturesBtn'); // <-- NEW DOM ELEMENT
    const parentalControlsModal = document.getElementById('parentalControlsModal');
    const closeBtn = document.querySelector('.close-btn');
    const passwordInput = document.getElementById('passwordInput');
    const submitPasswordBtn = document.getElementById('submitPasswordBtn');
    const passwordSection = document.getElementById('passwordSection');
    const settingsSection = document.getElementById('settingsSection');
    const passwordError = document.getElementById('passwordError');
    const videoUrlInput = document.getElementById('videoUrlInput');
    const addVideoBtn = document.getElementById('addVideoBtn');
    const videoAddError = document.getElementById('videoAddError');
    const currentVideosListUl = document.querySelector('#currentVideosList ul');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const videoThumbnailGrid = document.getElementById('videoThumbnailGrid');
    const instructionsP = document.getElementById('instructions');
    const videoCategoryInput = document.getElementById('videoCategoryInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const screenTimeLock = document.getElementById('screenTimeLock');
    const screenTimeLimitInput = document.getElementById('screenTimeLimitInput');

    const screenTimeDisplay = document.getElementById('screenTimeDisplay');
    const timeLeftValue = document.getElementById('timeLeftValue');

    const goalVideosCountInput = document.getElementById('goalVideosCountInput');
    const setGoalBtn = document.getElementById('setGoalBtn');
    const goalSetMessage = document.getElementById('goalSetMessage');
    const goalStatusContainer = document.getElementById('goalStatusContainer');
    const goalProgressText = document.getElementById('goalProgressText');
    const goalCompleteText = document.getElementById('goalCompleteText');
    const goalRewardDisplay = document.getElementById('goalRewardDisplay');
    const goalRewardTextElement = document.createElement('p');
    goalRewardTextElement.id = 'goalRewardText';
    if (goalRewardDisplay) goalRewardDisplay.appendChild(goalRewardTextElement);
    const categoryVisibilityControls = document.getElementById('categoryVisibilityControls');

    const resetScreenTimeBtn = document.getElementById('resetScreenTimeBtn');
    const screenTimeResetMessage = document.getElementById('screenTimeResetMessage');

    const floatingShapesContainer = document.getElementById('floatingShapesContainer');


    // --- APP STATE & DEFAULTS ---
    let videos = [];
    let parentalPassword = '1234';
    let screenTimeLimitMinutes = 60;
    let timeSpentTodaySeconds = 0;
    let lastDatePlayed = new Date().toLocaleDateString();
    let screenTimeInterval;
    let goalTargetVideos = 0;
    let videosWatchedForGoal = 0;
    let isGoalCompletedToday = false;
    let blockedCategories = [];


    // FLOATING SHAPES FUNCTIONALITY
    function createFloatingShapes() {
        if (!floatingShapesContainer) return;
        const numShapes = 15;
        const kidFriendlyColors = ['#FFADAD','#FFD6A5','#FDFFB6','#CAFFBF','#9BF6FF','#A0C4FF','#BDB2FF','#FFC6FF'];
        const shapeTypes = ['circle', 'square', 'rounded-square'];
        for (let i = 0; i < numShapes; i++) {
            const shape = document.createElement('div');
            const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            shape.classList.add('floating-shape', type);
            const size = Math.random() * 60 + 20;
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.backgroundColor = kidFriendlyColors[Math.floor(Math.random() * kidFriendlyColors.length)];
            const duration = Math.random() * 15 + 15;
            const delay = Math.random() * -10;
            shape.style.animationDuration = `${duration}s`;
            shape.style.animationDelay = `${delay}s`;
            floatingShapesContainer.appendChild(shape);
        }
    }


    // --- LOCAL STORAGE FUNCTIONS ---
    // ... (all your existing functions: loadFromLocalStorage, saveVideosToLocalStorage, etc.) ...
    function loadFromLocalStorage() {
        console.log("loadFromLocalStorage: Loading data...");
        const storedVideos = localStorage.getItem('blocksAppVideos');
        if (storedVideos) videos = JSON.parse(storedVideos);
        else {
            videos = [
                { id: 'e_pH2TFy0S8', title: 'Blippi Visits a Farm', category: 'education' },
                { id: 'f2-CKVo0sWw', title: 'Peppa Pig Full Episodes', category: 'entertainment' },
                { id: 'WxHbanded_Qms', title: 'Baby Shark Dance', category: 'songs'}
            ];
            saveVideosToLocalStorage();
        }
        const storedPassword = localStorage.getItem('blocksAppPassword');
        if (storedPassword) parentalPassword = storedPassword;

        const storedScreenTimeLimit = localStorage.getItem('blocksAppScreenTimeLimit');
        if (storedScreenTimeLimit) screenTimeLimitMinutes = parseInt(storedScreenTimeLimit, 10);
        else screenTimeLimitMinutes = 60;
        if(screenTimeLimitInput) screenTimeLimitInput.value = screenTimeLimitMinutes;

        const today = new Date().toLocaleDateString();
        const storedLastDate = localStorage.getItem('blocksAppLastDate');
        if (storedLastDate === today) {
            const storedTimeSpent = localStorage.getItem('blocksAppTimeSpent');
            if (storedTimeSpent) timeSpentTodaySeconds = parseInt(storedTimeSpent, 10);
            const storedGoalCompleted = localStorage.getItem('blocksAppGoalCompletedToday');
            if (storedGoalCompleted) isGoalCompletedToday = JSON.parse(storedGoalCompleted);
        } else {
            timeSpentTodaySeconds = 0;
            isGoalCompletedToday = false;
            localStorage.setItem('blocksAppTimeSpent', '0');
            localStorage.setItem('blocksAppLastDate', today);
            localStorage.setItem('blocksAppGoalCompletedToday', 'false');
        }
        lastDatePlayed = today;
        const storedGoalTarget = localStorage.getItem('blocksAppGoalTarget');
        if (storedGoalTarget) goalTargetVideos = parseInt(storedGoalTarget, 10);
        if(goalVideosCountInput) goalVideosCountInput.value = goalTargetVideos > 0 ? goalTargetVideos : 3;
        const storedGoalProgress = localStorage.getItem('blocksAppGoalProgress');
        if (storedGoalProgress && goalTargetVideos > 0) videosWatchedForGoal = parseInt(storedGoalProgress, 10);
        else videosWatchedForGoal = 0;
        const storedBlockedCategories = localStorage.getItem('blocksAppBlockedCategories');
        if (storedBlockedCategories) blockedCategories = JSON.parse(storedBlockedCategories);
        updateGoalDisplay();
        updateScreenTimeDisplayVisibility();
    }
    function saveVideosToLocalStorage() { localStorage.setItem('blocksAppVideos', JSON.stringify(videos)); }
    function savePasswordToLocalStorage() { localStorage.setItem('blocksAppPassword', parentalPassword); }
    function saveScreenTimeSettings() {
        localStorage.setItem('blocksAppScreenTimeLimit', screenTimeLimitMinutes.toString());
        localStorage.setItem('blocksAppTimeSpent', timeSpentTodaySeconds.toString());
        localStorage.setItem('blocksAppLastDate', lastDatePlayed);
    }
    function saveGoalSettings() {
        localStorage.setItem('blocksAppGoalTarget', goalTargetVideos.toString());
        localStorage.setItem('blocksAppGoalProgress', videosWatchedForGoal.toString());
        localStorage.setItem('blocksAppGoalCompletedToday', JSON.stringify(isGoalCompletedToday));
    }
    function saveBlockedCategoriesToLocalStorage() { localStorage.setItem('blocksAppBlockedCategories', JSON.stringify(blockedCategories)); }


    // --- CORE APP FUNCTIONS (Video Playing, Thumbnails, Categories, etc.) ---
    // ... (controlYouTubePlayer, getYouTubeVideoId, getUniqueCategories, populateCategoryFilter, renderThumbnails, playVideo) ...
    function controlYouTubePlayer(action) {
        const iframe = videoPlayerContainer.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            const targetOrigin = window.location.protocol === 'file:' ? '*' : window.location.origin;
            iframe.contentWindow.postMessage(`{"event":"command","func":"${action}","args":""}`, targetOrigin);
        }
    }
    function getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    function getUniqueCategories(videoArray) { return [...new Set(videoArray.map(v => v.category))].sort(); }

    function populateCategoryFilter() {
        if (!categoryFilter) return;
        const currentFilterValue = categoryFilter.value;
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        const uniqueCategories = getUniqueCategories(videos);
        uniqueCategories.forEach(cat => {
            if (cat && !blockedCategories.includes(cat)) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                categoryFilter.appendChild(option);
            }
        });
        if (categoryFilter.querySelector(`option[value="${currentFilterValue}"]`)) {
            categoryFilter.value = currentFilterValue;
        } else {
            categoryFilter.value = 'all';
        }
    }

    function renderThumbnails() {
        if (!videoThumbnailGrid) return;
        videoThumbnailGrid.innerHTML = '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const allowedContent = videos.filter(video => !blockedCategories.includes(video.category));
        const filteredVideos = allowedContent.filter(video => selectedCategory === 'all' || video.category === selectedCategory);

        if (videos.length === 0) {
            videoThumbnailGrid.innerHTML = `<p class="empty-state">No videos added yet. Ask a parent to add some!</p>`;
            return;
        }
        if (filteredVideos.length === 0) {
            let message = `No videos found for "${selectedCategory === 'all' ? 'any category' : (categoryFilter.options[categoryFilter.selectedIndex]?.textContent || selectedCategory)}".`;
            if (blockedCategories.length > 0 && selectedCategory === 'all') {
                message += " Some categories might be hidden by parental controls.";
            }
            videoThumbnailGrid.innerHTML = `<p class="empty-state">${message}</p>`;
            return;
        }
        filteredVideos.forEach((video) => {
            const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
            const item = document.createElement('div');
            item.classList.add('thumbnail-item');
            item.dataset.videoId = video.id;
            item.innerHTML = `
                <img src="${thumbnailUrl}" alt="${video.title || 'Video Thumbnail'}">
                <p>${video.title || 'Untitled Video'} <span class="category-tag">(${(video.category || 'Uncategorized')})</span></p>
            `;
            item.addEventListener('click', () => playVideo(video.id));
            videoThumbnailGrid.appendChild(item);
        });
    }

    function playVideo(videoId) {
        console.log(`playVideo: Attempting to play ${videoId}. Limit: ${screenTimeLimitMinutes}m, Spent: ${timeSpentTodaySeconds}s`);
        if (isScreenTimeLimitReached()) {
            showScreenTimeLock();
            return;
        }
        if (screenTimeLock) screenTimeLock.classList.add('hidden');
        if (instructionsP) instructionsP.style.display = 'none';
        
        const origin = window.location.protocol === 'file:' ? null : window.location.origin;
        const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : '';
        const existingIframe = videoPlayerContainer.querySelector('iframe');
        if (existingIframe) existingIframe.remove();
        videoPlayerContainer.insertAdjacentHTML('beforeend', `
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1${originParam}"
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>`);
        
        startScreenTimer();

        if (goalTargetVideos > 0 && !isGoalCompletedToday && videosWatchedForGoal < goalTargetVideos) {
            videosWatchedForGoal++;
            if (videosWatchedForGoal >= goalTargetVideos) isGoalCompletedToday = true;
            updateGoalDisplay();
            saveGoalSettings();
        }
    }

    // --- EVENT LISTENERS FOR BUTTONS & MODAL ---
    // ... (parentalModeBtn, closeBtn, window click for modal, submitPasswordBtn, addVideoBtn) ...
    if (premiumFeaturesBtn) { // <-- NEW EVENT LISTENER
        premiumFeaturesBtn.addEventListener('click', () => {
            window.location.href = 'premium.html'; // Navigate to premium.html
        });
    }

    if(parentalModeBtn) parentalModeBtn.addEventListener('click', () => {
        controlYouTubePlayer('pauseVideo');
        stopScreenTimer();
        if(parentalControlsModal) parentalControlsModal.classList.remove('hidden');
        if(passwordSection) passwordSection.classList.remove('hidden');
        if(settingsSection) settingsSection.classList.add('hidden');
        if(passwordInput) passwordInput.value = '';
        if(passwordError) passwordError.textContent = '';
        if(newPasswordInput) newPasswordInput.value = '';
        if(videoUrlInput) videoUrlInput.value = '';
        if(videoAddError) videoAddError.textContent = '';
        if(screenTimeLimitInput) screenTimeLimitInput.value = screenTimeLimitMinutes;
        if(goalVideosCountInput) goalVideosCountInput.value = goalTargetVideos > 0 ? goalTargetVideos : 3;
        if (screenTimeResetMessage) screenTimeResetMessage.classList.add('hidden');
        if (goalSetMessage) goalSetMessage.classList.add('hidden');

    });

    if(closeBtn) closeBtn.addEventListener('click', () => {
        if(parentalControlsModal) parentalControlsModal.classList.add('hidden');
        updateInitialInstructionOrLock();
    });

    window.addEventListener('click', (event) => {
        if (event.target === parentalControlsModal) {
            if(parentalControlsModal) parentalControlsModal.classList.add('hidden');
            updateInitialInstructionOrLock();
        }
    });

    if(submitPasswordBtn) submitPasswordBtn.addEventListener('click', () => {
        if (passwordInput && passwordInput.value === parentalPassword) {
            if(passwordSection) passwordSection.classList.add('hidden');
            if(settingsSection) settingsSection.classList.remove('hidden');
            if(passwordError) passwordError.textContent = '';
            renderCurrentVideosList();
            renderCategoryVisibilityControls();
        } else {
            if(passwordError) passwordError.textContent = 'Incorrect password.';
            if(passwordInput) passwordInput.focus();
        }
    });

    if(addVideoBtn) addVideoBtn.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        const category = videoCategoryInput.value;
        if(videoAddError) videoAddError.textContent = '';
        if (!url) { if(videoAddError) videoAddError.textContent = 'Please enter a YouTube video URL or ID.'; return; }
        const videoId = getYouTubeVideoId(url) || (url.length === 11 ? url : null);
        if (videoId) {
            if (videos.find(v => v.id === videoId)) { if(videoAddError) videoAddError.textContent = 'This video is already in the list.'; return; }
            const title = prompt(`Enter a title for this video (ID: ${videoId}):`, `Video: ${videoId}`);
            videos.push({ id: videoId, title: title || `Video ${videoId.substring(0,5)}...`, category: category });
            saveVideosToLocalStorage();
            renderCurrentVideosList();
            renderCategoryVisibilityControls();
            populateCategoryFilter();
            renderThumbnails();
            videoUrlInput.value = '';
        } else {
            if(videoAddError) videoAddError.textContent = 'Invalid YouTube URL or Video ID.';
        }
    });

    // ... (renderCurrentVideosList, renderCategoryVisibilityControls) ...
    function renderCurrentVideosList() {
        if (!currentVideosListUl) return;
        currentVideosListUl.innerHTML = '';
        if (videos.length === 0) { currentVideosListUl.innerHTML = '<li>No videos added yet.</li>'; return; }
        videos.forEach((video, index) => {
            const li = document.createElement('li');
            const titleSpan = document.createElement('span');
            titleSpan.textContent = `${video.title || video.id} (Category: ${video.category || 'N/A'})`;
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-video-btn');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => {
                videos.splice(index, 1);
                saveVideosToLocalStorage();
                renderCurrentVideosList();
                renderCategoryVisibilityControls();
                populateCategoryFilter();
                renderThumbnails();
            });
            li.appendChild(titleSpan);
            li.appendChild(removeBtn);
            currentVideosListUl.appendChild(li);
        });
    }
    function renderCategoryVisibilityControls() {
        if (!categoryVisibilityControls) return;
        categoryVisibilityControls.innerHTML = '';
        const uniqueCategoriesInUse = getUniqueCategories(videos);
        if (uniqueCategoriesInUse.length === 0) { categoryVisibilityControls.innerHTML = '<p>No categories to manage yet (add videos first).</p>'; return; }
        uniqueCategoriesInUse.forEach(cat => {
            if (!cat) return;
            const itemId = `cat-toggle-${cat.replace(/\s+/g, '-')}`;
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('category-visibility-item');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = itemId;
            checkbox.value = cat;
            checkbox.checked = !blockedCategories.includes(cat);
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) blockedCategories = blockedCategories.filter(blockedCat => blockedCat !== cat);
                else if (!blockedCategories.includes(cat)) blockedCategories.push(cat);
            });
            const label = document.createElement('label');
            label.htmlFor = itemId;
            label.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            categoryVisibilityControls.appendChild(itemDiv);
        });
    }


    // ... (saveSettingsBtn, categoryFilter listener) ...
    if(saveSettingsBtn) saveSettingsBtn.addEventListener('click', () => {
        const newPassword = newPasswordInput.value.trim();
        let passwordUpdated = false;
        if (newPassword) {
            if (newPassword.length < 4) { alert("New password must be at least 4 characters long."); return; }
            parentalPassword = newPassword;
            savePasswordToLocalStorage();
            passwordUpdated = true;
        }
        const newLimitStr = screenTimeLimitInput.value;
        const newLimit = parseInt(newLimitStr, 10);

        if (!isNaN(newLimit) && newLimit >= 0) {
            if (screenTimeLimitMinutes !== newLimit) { 
                screenTimeLimitMinutes = newLimit;
                timeSpentTodaySeconds = 0; // Reset time if limit changed
                localStorage.setItem('blocksAppTimeSpent', '0'); 
            }
        } else {
            alert("Invalid screen time limit. Please enter a non-negative number.");
            return;
        }

        if (goalSetMessage) {
            goalSetMessage.textContent = passwordUpdated ? "Password and settings saved!" : "Settings saved!";
            goalSetMessage.classList.remove('hidden');
            setTimeout(() => {
                goalSetMessage.classList.add('hidden');
                goalSetMessage.textContent = ""; 
            }, 3000);
        }
        if (newPasswordInput) newPasswordInput.value = ''; 

        saveScreenTimeSettings();
        updateScreenTimeDisplayVisibility(); 
        saveBlockedCategoriesToLocalStorage();
        populateCategoryFilter();
        renderThumbnails();
        if(parentalControlsModal) parentalControlsModal.classList.add('hidden');
        updateInitialInstructionOrLock();
    });

    if(categoryFilter) categoryFilter.addEventListener('change', renderThumbnails);


    // --- SCREEN TIME MANAGEMENT ---
    // ... (formatTime, updateScreenTimeDisplay, updateScreenTimeDisplayVisibility, startScreenTimer, stopScreenTimer, isScreenTimeLimitReached, showScreenTimeLock, hideScreenTimeLock) ...
    function formatTime(totalSeconds) {
        if (totalSeconds < 0) totalSeconds = 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateScreenTimeDisplay() {
        if (!timeLeftValue || !screenTimeDisplay) return;
        if (screenTimeLimitMinutes === 0) {
            timeLeftValue.textContent = "∞";
            screenTimeDisplay.classList.remove('low-time');
            return;
        }
        const totalLimitSeconds = screenTimeLimitMinutes * 60;
        const remainingSeconds = totalLimitSeconds - timeSpentTodaySeconds;
        timeLeftValue.textContent = formatTime(remainingSeconds);
        if (remainingSeconds <= 0) timeLeftValue.textContent = "00:00";
        if (remainingSeconds <= 60 && remainingSeconds > 0) screenTimeDisplay.classList.add('low-time');
        else screenTimeDisplay.classList.remove('low-time');
    }
    
    function updateScreenTimeDisplayVisibility() {
        if (!screenTimeDisplay) return;
        const iframe = videoPlayerContainer.querySelector('iframe');
        const isLockScreenActive = screenTimeLock && !screenTimeLock.classList.contains('hidden');

        if (isLockScreenActive) {
            screenTimeDisplay.classList.add('hidden');
        } else if ( (screenTimeLimitMinutes > 0 && iframe) || (screenTimeLimitMinutes === 0 && iframe) ) { 
            screenTimeDisplay.classList.remove('hidden');
        } else if (screenTimeLimitMinutes > 0 && !iframe && timeSpentTodaySeconds < (screenTimeLimitMinutes * 60)) {
            screenTimeDisplay.classList.remove('hidden');
        }
        else {
            screenTimeDisplay.classList.add('hidden');
        }
        updateScreenTimeDisplay();
    }

    function startScreenTimer() {
        updateScreenTimeDisplayVisibility();
        if (screenTimeLimitMinutes === 0) { return; }
        if (isScreenTimeLimitReached()) { showScreenTimeLock(); return; }
        if (screenTimeInterval) clearInterval(screenTimeInterval);
        updateScreenTimeDisplay(); 
        screenTimeInterval = setInterval(() => {
            timeSpentTodaySeconds++;
            updateScreenTimeDisplay();
            saveScreenTimeSettings();
            if (isScreenTimeLimitReached()) {
                stopScreenTimer();
                showScreenTimeLock();
            }
        }, 1000);
    }

    function stopScreenTimer() {
        if (screenTimeInterval) {
            clearInterval(screenTimeInterval);
            screenTimeInterval = null;
        }
    }

    function isScreenTimeLimitReached() {
        if (screenTimeLimitMinutes === 0) return false;
        return (timeSpentTodaySeconds / 60) >= screenTimeLimitMinutes;
    }

    function showScreenTimeLock() {
        controlYouTubePlayer('pauseVideo');
        const iframe = videoPlayerContainer.querySelector('iframe');
        if (iframe) iframe.remove();
        if (instructionsP) instructionsP.style.display = 'none';
        if (screenTimeLock) screenTimeLock.classList.remove('hidden'); 
        if (screenTimeDisplay) screenTimeDisplay.classList.add('hidden');
        stopScreenTimer();
    }

    function hideScreenTimeLock() {
        if (screenTimeLock) screenTimeLock.classList.add('hidden');
        updateScreenTimeDisplayVisibility(); 
        const hasIframe = videoPlayerContainer.querySelector('iframe');
        if (instructionsP) {
            if (!hasIframe) {
                instructionsP.textContent = videos.length === 0 ? "No videos added yet. Ask a parent to add some!" : "Select a video below to start watching!";
                instructionsP.style.display = 'block';
            } else {
                instructionsP.style.display = 'none';
            }
        }
    }

    // --- GOAL MANAGEMENT ---
    // ... (setGoalBtn listener, updateGoalDisplay) ...
    if(setGoalBtn) setGoalBtn.addEventListener('click', () => {
        const count = parseInt(goalVideosCountInput.value, 10);
        if (!isNaN(count) && count >= 0) {
            goalTargetVideos = count;
            videosWatchedForGoal = 0; 
            isGoalCompletedToday = false; 
            saveGoalSettings();
            updateGoalDisplay();
            if (goalSetMessage) {
                goalSetMessage.textContent = goalTargetVideos > 0 ? `Goal updated: Watch ${goalTargetVideos} videos.` : `Goal tracking disabled.`;
                goalSetMessage.classList.remove('hidden');
                setTimeout(() => {
                    goalSetMessage.classList.add('hidden');
                    goalSetMessage.textContent = ""; 
                }, 3000);
            }
        } else {
            alert("Please enter a valid non-negative number for the goal.");
        }
    });
    function updateGoalDisplay() {
        if (!goalStatusContainer || !goalProgressText || !goalCompleteText || !goalRewardDisplay || !goalRewardTextElement) return;
        if (goalTargetVideos > 0) {
            goalStatusContainer.classList.remove('hidden');
            goalProgressText.textContent = `Goal: Watched ${videosWatchedForGoal} of ${goalTargetVideos} videos.`;
            if (isGoalCompletedToday || (videosWatchedForGoal >= goalTargetVideos && goalTargetVideos > 0) ) { 
                isGoalCompletedToday = true; 
                goalCompleteText.textContent = "🎉 Goal Complete! Well Done! 🎉";
                goalCompleteText.classList.remove('hidden');
                goalRewardDisplay.classList.remove('hidden');
                goalRewardTextElement.textContent = "Awesome! You reached the goal!"; 
            } else {
                goalCompleteText.classList.add('hidden');
                goalRewardDisplay.classList.add('hidden');
            }
        } else {
            goalStatusContainer.classList.add('hidden');
            goalCompleteText.classList.add('hidden');
            goalRewardDisplay.classList.add('hidden');
        }
    }


    // --- RESET SCREEN TIME BUTTON ---
    // ... (resetScreenTimeBtn listener) ...
    if (resetScreenTimeBtn) {
        resetScreenTimeBtn.addEventListener('click', () => {
            timeSpentTodaySeconds = 0;
            saveScreenTimeSettings(); 
            updateScreenTimeDisplay(); 
            if (screenTimeLock && !screenTimeLock.classList.contains('hidden')) {
                hideScreenTimeLock(); 
            } else {
                updateScreenTimeDisplayVisibility(); 
            }
            if (screenTimeResetMessage) {
                screenTimeResetMessage.textContent = "Today's screen time has been reset!";
                screenTimeResetMessage.classList.remove('hidden');
                setTimeout(() => {
                    screenTimeResetMessage.classList.add('hidden');
                    screenTimeResetMessage.textContent = ""; 
                }, 3000);
            }
        });
    }


    // --- INITIALIZATION & UI UPDATES ---
    // ... (updateInitialInstructionOrLock) ...
    function updateInitialInstructionOrLock() {
        if (isScreenTimeLimitReached()) {
            showScreenTimeLock();
        } else {
            hideScreenTimeLock(); 
            const iframe = videoPlayerContainer.querySelector('iframe');
            if (iframe) { 
                startScreenTimer(); // Start or continue timer if video is present and not locked
            } else { // No video playing
                stopScreenTimer(); 
                updateScreenTimeDisplayVisibility(); // Update visibility based on whether time remains
            }
        }
    }

    // --- INITIALIZATION CALLS ---
    loadFromLocalStorage();
    populateCategoryFilter();
    renderThumbnails();
    updateInitialInstructionOrLock();
    createFloatingShapes(); 

    console.log("App Initialized with Premium Button, Visible Countdown Timer and Floating Shapes.");
});
