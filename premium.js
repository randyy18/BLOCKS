document.addEventListener('DOMContentLoaded', () => {
    console.log("App DOMContentLoaded: Initializing with FULL Premium Features (No Learn More)...");
    // --- DOM ELEMENTS ---
    const activeProfileDisplay = document.getElementById('activeProfileDisplay');
    const freeFeaturesBtn = document.getElementById('freeFeaturesBtn');
    const parentalModeBtn = document.getElementById('parentalModeBtn');
    const parentalControlsModal = document.getElementById('parentalControlsModal');
    const closeBtn = document.querySelector('.close-btn');
    const passwordInput = document.getElementById('passwordInput');
    const submitPasswordBtn = document.getElementById('submitPasswordBtn');
    const passwordSection = document.getElementById('passwordSection');
    const settingsSection = document.getElementById('settingsSection');
    const passwordError = document.getElementById('passwordError');
    const videoUrlInput = document.getElementById('videoUrlInput');
    const videoChannelNameInput = document.getElementById('videoChannelNameInput');
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
    const lockScreenTitle = document.getElementById('lockScreenTitle');
    const lockScreenMessage = document.getElementById('lockScreenMessage');
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
    const goalRewardTextElement = document.getElementById('goalRewardText');
    const categoryVisibilityControls = document.getElementById('categoryVisibilityControls');
    const resetScreenTimeBtn = document.getElementById('resetScreenTimeBtn');
    const screenTimeResetMessage = document.getElementById('screenTimeResetMessage');
    const floatingShapesContainer = document.getElementById('floatingShapesContainer');
    const currentProfileNameParentalSpans = document.querySelectorAll('.current-profile-name-parental');


    // PREMIUM FEATURE DOM ELEMENTS
    const togglePremiumBtn = document.getElementById('togglePremiumBtn');
    const premiumStatusText = document.getElementById('premiumStatusText');
    const customRewardInput = document.getElementById('customRewardInput');
    const blockedKeywordsInput = document.getElementById('blockedKeywordsInput');
    const accessScheduleStartInput = document.getElementById('accessScheduleStart');
    const accessScheduleEndInput = document.getElementById('accessScheduleEnd');
    const immediateLockoutBtn = document.getElementById('immediateLockoutBtn');

    // Profile Management
    const profileNameInput = document.getElementById('profileNameInput');
    const addProfileBtn = document.getElementById('addProfileBtn');
    const activeProfileSelect = document.getElementById('activeProfileSelect');
    const deleteProfileBtn = document.getElementById('deleteProfileBtn');
    const profileMessage = document.getElementById('profileMessage');

    // Block Creators
    const blockedChannelNamesInput = document.getElementById('blockedChannelNamesInput');

    // Content History
    const contentHistoryDisplayUl = document.querySelector('#contentHistoryDisplay ul');
    const contentHistoryDisplayText = document.querySelector('#contentHistoryDisplay p');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // Weekly Milestones
    const weeklyMilestoneTargetInput = document.getElementById('weeklyMilestoneTargetInput');
    const educationalCategoriesInput = document.getElementById('educationalCategoriesInput');
    const weeklyMilestoneProgressText = document.getElementById('weeklyMilestoneProgressText');

    // Real-time Monitoring
    const realTimeStatusText = document.getElementById('realTimeStatusText');

    // Weekly Reports
    const weeklyReportDisplay = document.getElementById('weeklyReportDisplay');
    const generateReportBtn = document.getElementById('generateReportBtn');

    // PREMIUM INFO MODAL AND BUTTONS ARE REMOVED


    // --- APP STATE & DEFAULTS ---
    let parentalPassword = '1234'; 
    let isPremium = false; 
    let profiles = ['Default']; 
    let activeProfile = 'Default'; 

    let videos = [];
    let screenTimeLimitMinutes = 60;
    let timeSpentTodaySeconds = 0;
    let lastDatePlayed = new Date().toLocaleDateString();
    let screenTimeInterval;
    let goalTargetVideos = 0;
    let videosWatchedForGoal = 0;
    let isGoalCompletedToday = false;
    let blockedCategories = [];
    let customReward = "";
    let blockedKeywords = [];
    let accessSchedule = { start: null, end: null };
    let blockedChannelNames = [];
    let contentHistory = [];
    let weeklyMilestoneTarget = 5;
    let weeklyMilestoneProgress = 0;
    let educationalCategoriesForMilestone = ['education'];
    let lastMilestoneResetWeek = null; 
    let categoryWatchCount = {}; 
    let currentlyPlayingVideoInfo = { title: null, videoId: null };


    const getStorageKey = (key) => `blocksApp_${activeProfile}_${key}`;
    const getGlobalStorageKey = (key) => `blocksApp_global_${key}`;

    function createFloatingShapes() {
        if (!floatingShapesContainer) return;
        floatingShapesContainer.innerHTML = ''; 
        const numShapes = 15;
        const kidFriendlyColors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
        const shapeTypes = ['circle', 'square', 'rounded-square'];
        for (let i = 0; i < numShapes; i++) {
            const shape = document.createElement('div');
            const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            shape.classList.add('floating-shape', type);
            const size = Math.random() * 60 + 20;
            shape.style.width = `${size}px`; shape.style.height = `${size}px`;
            shape.style.left = `${Math.random() * 100}%`; shape.style.top = `${Math.random() * 100}%`;
            shape.style.backgroundColor = kidFriendlyColors[Math.floor(Math.random() * kidFriendlyColors.length)];
            const duration = Math.random() * 15 + 15; const delay = Math.random() * -10;
            shape.style.animationDuration = `${duration}s`; shape.style.animationDelay = `${delay}s`;
            floatingShapesContainer.appendChild(shape);
        }
    }

    function loadGlobalSettings() {
        const storedPassword = localStorage.getItem(getGlobalStorageKey('parentalPassword'));
        if (storedPassword) parentalPassword = storedPassword;

        const storedPremium = localStorage.getItem(getGlobalStorageKey('isPremium'));
        isPremium = storedPremium === 'true';

        const storedProfiles = localStorage.getItem(getGlobalStorageKey('profiles'));
        if (storedProfiles) profiles = JSON.parse(storedProfiles);
        else profiles = ['Default'];

        const storedActiveProfile = localStorage.getItem(getGlobalStorageKey('activeProfile'));
        activeProfile = storedActiveProfile && profiles.includes(storedActiveProfile) ? storedActiveProfile : profiles[0];
    }

    function saveGlobalSettings() {
        localStorage.setItem(getGlobalStorageKey('parentalPassword'), parentalPassword);
        localStorage.setItem(getGlobalStorageKey('isPremium'), isPremium.toString());
        localStorage.setItem(getGlobalStorageKey('profiles'), JSON.stringify(profiles));
        localStorage.setItem(getGlobalStorageKey('activeProfile'), activeProfile);
    }
    
    function populateProfileSelect() {
        if (!activeProfileSelect) return;
        activeProfileSelect.innerHTML = '';
        profiles.forEach(profile => {
            const option = document.createElement('option');
            option.value = profile;
            option.textContent = profile;
            if (profile === activeProfile) {
                option.selected = true;
            }
            activeProfileSelect.appendChild(option);
        });
        updateActiveProfileDisplay();
    }

    function updateActiveProfileDisplay() {
        if(activeProfileDisplay) {
            activeProfileDisplay.textContent = `(${activeProfile})`;
            activeProfileDisplay.classList.remove('hidden');
        }
        currentProfileNameParentalSpans.forEach(span => span.textContent = activeProfile);
    }


    function loadProfileData() {
        const storedVideos = localStorage.getItem(getStorageKey('videos'));
        if (storedVideos) videos = JSON.parse(storedVideos);
        else {
            videos = (activeProfile === "BlippiFan") ? [ 
                { id: 'e_pH2TFy0S8', title: 'Blippi Visits a Farm', category: 'education', channelName: 'Blippi' },
                { id: 'dhFME__5Y2w', title: 'Blippi Learns About The Police', category: 'education', channelName: 'Blippi' }
            ] : [
                { id: 'e_pH2TFy0S8', title: 'Blippi Visits a Farm', category: 'education', channelName: 'Blippi' },
                { id: 'f2-CKVo0sWw', title: 'Peppa Pig Full Episodes', category: 'entertainment', channelName: 'Peppa Pig' },
                { id: 'WxHbanded_Qms', title: 'Baby Shark Dance', category: 'songs', channelName: 'Pinkfong' }
            ];
            saveVideosToLocalStorage();
        }

        const storedScreenTimeLimit = localStorage.getItem(getStorageKey('screenTimeLimit'));
        screenTimeLimitMinutes = storedScreenTimeLimit ? parseInt(storedScreenTimeLimit, 10) : 60;
        
        const today = new Date().toLocaleDateString();
        const storedLastDate = localStorage.getItem(getStorageKey('lastDatePlayed'));
        if (storedLastDate === today) {
            const storedTimeSpent = localStorage.getItem(getStorageKey('timeSpentToday'));
            timeSpentTodaySeconds = storedTimeSpent ? parseInt(storedTimeSpent, 10) : 0;
            const storedGoalCompleted = localStorage.getItem(getStorageKey('goalCompletedToday'));
            isGoalCompletedToday = storedGoalCompleted ? JSON.parse(storedGoalCompleted) : false;
        } else {
            timeSpentTodaySeconds = 0;
            isGoalCompletedToday = false;
            videosWatchedForGoal = 0; 
            localStorage.setItem(getStorageKey('timeSpentToday'), '0');
            localStorage.setItem(getStorageKey('goalCompletedToday'), 'false');
            localStorage.setItem(getStorageKey('videosWatchedForGoal'), '0');
        }
        lastDatePlayed = today;

        const storedGoalTarget = localStorage.getItem(getStorageKey('goalTargetVideos'));
        goalTargetVideos = storedGoalTarget ? parseInt(storedGoalTarget, 10) : 3;
        
        const storedGoalProgress = localStorage.getItem(getStorageKey('videosWatchedForGoal'));
        videosWatchedForGoal = (storedGoalProgress && !isGoalCompletedToday && storedLastDate === today) ? parseInt(storedGoalProgress, 10) : 0;
        
        const storedBlockedCategories = localStorage.getItem(getStorageKey('blockedCategories'));
        blockedCategories = storedBlockedCategories ? JSON.parse(storedBlockedCategories) : [];

        const storedCustomReward = localStorage.getItem(getStorageKey('customReward'));
        customReward = storedCustomReward || "";
        
        const storedBlockedKeywords = localStorage.getItem(getStorageKey('blockedKeywords'));
        blockedKeywords = storedBlockedKeywords ? JSON.parse(storedBlockedKeywords) : [];

        const storedSchedule = localStorage.getItem(getStorageKey('accessSchedule'));
        accessSchedule = storedSchedule ? JSON.parse(storedSchedule) : { start: null, end: null };

        const storedBlockedChannelNames = localStorage.getItem(getStorageKey('blockedChannelNames'));
        blockedChannelNames = storedBlockedChannelNames ? JSON.parse(storedBlockedChannelNames) : [];

        const storedContentHistory = localStorage.getItem(getStorageKey('contentHistory'));
        contentHistory = storedContentHistory ? JSON.parse(storedContentHistory) : [];

        const storedWeeklyMilestoneTarget = localStorage.getItem(getStorageKey('weeklyMilestoneTarget'));
        weeklyMilestoneTarget = storedWeeklyMilestoneTarget ? parseInt(storedWeeklyMilestoneTarget, 10) : 5;
        
        const storedEducationalCategories = localStorage.getItem(getStorageKey('educationalCategoriesForMilestone'));
        educationalCategoriesForMilestone = storedEducationalCategories ? JSON.parse(storedEducationalCategories) : ['education'];

        const storedLastReset = localStorage.getItem(getStorageKey('lastMilestoneResetWeek'));
        lastMilestoneResetWeek = storedLastReset ? parseInt(storedLastReset) : null;
        checkAndResetWeeklyMilestone(); 

        const storedWeeklyProgress = localStorage.getItem(getStorageKey('weeklyMilestoneProgress'));
        weeklyMilestoneProgress = (storedWeeklyProgress && (lastMilestoneResetWeek === getCurrentWeekNumber())) ? parseInt(storedWeeklyProgress, 10) : 0;
        
        const storedCategoryWatchCount = localStorage.getItem(getStorageKey('categoryWatchCount'));
        categoryWatchCount = storedCategoryWatchCount ? JSON.parse(storedCategoryWatchCount) : {};

        if(screenTimeLimitInput) screenTimeLimitInput.value = screenTimeLimitMinutes;
        if(goalVideosCountInput) goalVideosCountInput.value = goalTargetVideos;
        if(customRewardInput && isPremium) customRewardInput.value = customReward;
        if(blockedKeywordsInput && isPremium) blockedKeywordsInput.value = blockedKeywords.join(', ');
        if(accessScheduleStartInput && accessSchedule.start && isPremium) accessScheduleStartInput.value = accessSchedule.start;
        if(accessScheduleEndInput && accessSchedule.end && isPremium) accessScheduleEndInput.value = accessSchedule.end;
        if(blockedChannelNamesInput && isPremium) blockedChannelNamesInput.value = blockedChannelNames.join(', ');
        if(weeklyMilestoneTargetInput && isPremium) weeklyMilestoneTargetInput.value = weeklyMilestoneTarget;
        if(educationalCategoriesInput && isPremium) educationalCategoriesInput.value = educationalCategoriesForMilestone.join(', ');

        updateGoalDisplay();
        updateScreenTimeDisplayVisibility();
        updateWeeklyMilestoneDisplay();
        renderContentHistory();
        populateCategoryFilter(); 
        renderThumbnails(); 
    }

    function saveProfileData() {
        saveVideosToLocalStorage();
        localStorage.setItem(getStorageKey('screenTimeLimit'), screenTimeLimitMinutes.toString());
        localStorage.setItem(getStorageKey('timeSpentToday'), timeSpentTodaySeconds.toString());
        localStorage.setItem(getStorageKey('lastDatePlayed'), lastDatePlayed);
        localStorage.setItem(getStorageKey('goalTargetVideos'), goalTargetVideos.toString());
        localStorage.setItem(getStorageKey('videosWatchedForGoal'), videosWatchedForGoal.toString());
        localStorage.setItem(getStorageKey('goalCompletedToday'), JSON.stringify(isGoalCompletedToday));
        localStorage.setItem(getStorageKey('blockedCategories'), JSON.stringify(blockedCategories));
        
        if (isPremium) {
            localStorage.setItem(getStorageKey('customReward'), customReward);
            localStorage.setItem(getStorageKey('blockedKeywords'), JSON.stringify(blockedKeywords));
            localStorage.setItem(getStorageKey('accessSchedule'), JSON.stringify(accessSchedule));
            localStorage.setItem(getStorageKey('blockedChannelNames'), JSON.stringify(blockedChannelNames));
            localStorage.setItem(getStorageKey('contentHistory'), JSON.stringify(contentHistory));
            localStorage.setItem(getStorageKey('weeklyMilestoneTarget'), weeklyMilestoneTarget.toString());
            localStorage.setItem(getStorageKey('educationalCategoriesForMilestone'), JSON.stringify(educationalCategoriesForMilestone));
            localStorage.setItem(getStorageKey('weeklyMilestoneProgress'), weeklyMilestoneProgress.toString());
            if (lastMilestoneResetWeek !== null) { 
                localStorage.setItem(getStorageKey('lastMilestoneResetWeek'), lastMilestoneResetWeek.toString());
            } else {
                localStorage.removeItem(getStorageKey('lastMilestoneResetWeek'));
            }
            localStorage.setItem(getStorageKey('categoryWatchCount'), JSON.stringify(categoryWatchCount));
        } else {
            localStorage.removeItem(getStorageKey('customReward'));
            localStorage.removeItem(getStorageKey('blockedKeywords'));
            localStorage.removeItem(getStorageKey('accessSchedule'));
            localStorage.removeItem(getStorageKey('blockedChannelNames'));
            localStorage.removeItem(getStorageKey('weeklyMilestoneTarget'));
            localStorage.removeItem(getStorageKey('educationalCategoriesForMilestone'));
            localStorage.removeItem(getStorageKey('weeklyMilestoneProgress'));
            localStorage.removeItem(getStorageKey('lastMilestoneResetWeek'));
            localStorage.removeItem(getStorageKey('categoryWatchCount'));
        }
    }


    function updatePremiumUI() {
        const premiumSectionsAndPlaceholders = document.querySelectorAll('.premium-only-setting');
        
        if (isPremium) {
            if(togglePremiumBtn) {
                togglePremiumBtn.textContent = 'Premium Features Active (Global)';
                togglePremiumBtn.classList.add('premium-active-btn');
            }
            if(premiumStatusText) premiumStatusText.textContent = 'Enjoy your enhanced controls! Profile-specific premium settings are now available.';
            premiumSectionsAndPlaceholders.forEach(section => {
                if (section.classList.contains('premium-placeholder') && section.style.flexDirection === 'column') {
                    section.style.display = 'flex'; 
                } else {
                    section.style.display = 'block'; 
                }
            });


            if(customRewardInput) customRewardInput.value = customReward;
            if(blockedKeywordsInput) blockedKeywordsInput.value = blockedKeywords.join(', ');
            if(accessScheduleStartInput && accessSchedule.start) accessScheduleStartInput.value = accessSchedule.start; else if(accessScheduleStartInput) accessScheduleStartInput.value = '';
            if(accessScheduleEndInput && accessSchedule.end) accessScheduleEndInput.value = accessSchedule.end; else if(accessScheduleEndInput) accessScheduleEndInput.value = '';
            if(blockedChannelNamesInput) blockedChannelNamesInput.value = blockedChannelNames.join(', ');
            if(weeklyMilestoneTargetInput) weeklyMilestoneTargetInput.value = weeklyMilestoneTarget;
            if(educationalCategoriesInput) educationalCategoriesInput.value = educationalCategoriesForMilestone.join(', ');

        } else {
            if(togglePremiumBtn) {
                togglePremiumBtn.textContent = 'Activate Premium Features (Global)';
                togglePremiumBtn.classList.remove('premium-active-btn');
            }
            if(premiumStatusText) premiumStatusText.textContent = 'Unlock more features by activating premium. These apply per profile.';
            premiumSectionsAndPlaceholders.forEach(section => section.style.display = 'none');
        }
        updateWeeklyMilestoneDisplay(); 
        renderContentHistory();
        updateRealTimeMonitoringDisplay();
    }
    
    function saveVideosToLocalStorage() { localStorage.setItem(getStorageKey('videos'), JSON.stringify(videos)); }

    function controlYouTubePlayer(action) { 
        const iframe = videoPlayerContainer.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            try {
                let command = action.endsWith('Video') ? action : action + 'Video';
                iframe.contentWindow.postMessage(`{"event":"command","func":"${command}","args":""}`, 'https://www.youtube.com');
            } catch (e) {
                console.warn("PostMessage to YouTube iframe failed:", e);
            }
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
        } else { categoryFilter.value = 'all';}
    }
    
    function renderThumbnails() { 
        if (!videoThumbnailGrid) return;
        videoThumbnailGrid.innerHTML = '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        
        let videosToDisplay = videos.filter(video => { 
            if (blockedCategories.includes(video.category)) return false; 
            if (isPremium && blockedKeywords.length > 0) { 
                const titleLower = (video.title || '').toLowerCase();
                if (blockedKeywords.some(keyword => titleLower.includes(keyword.toLowerCase().trim()))) {
                    return false;
                }
            }
            if (isPremium && blockedChannelNames.length > 0 && video.channelName) { 
                 if (blockedChannelNames.some(bcn => video.channelName.toLowerCase().includes(bcn.toLowerCase().trim()))) {
                    return false;
                 }
            }
            return true;
        });

        if (isPremium && Object.keys(categoryWatchCount).length > 0) {
            videosToDisplay.sort((a, b) => {
                const countA = categoryWatchCount[a.category] || 0;
                const countB = categoryWatchCount[b.category] || 0;
                return countB - countA; 
            });
        }

        const filteredVideos = videosToDisplay.filter(video => selectedCategory === 'all' || video.category === selectedCategory);
        
        if (videos.length === 0 ) {
            videoThumbnailGrid.innerHTML = `<p class="empty-state">No videos added for ${activeProfile}. Ask a parent to add some!</p>`;
            return;
        }
        if (filteredVideos.length === 0) {
            let message = `No videos found for "${selectedCategory === 'all' ? 'any category' : (categoryFilter.options[categoryFilter.selectedIndex]?.textContent || selectedCategory)}" for ${activeProfile}.`;
            if (blockedCategories.length > 0 && selectedCategory === 'all') {
                message += " Some categories might be hidden by parental controls.";
            }
            if (isPremium && (blockedKeywords.length > 0 || blockedChannelNames.length > 0)) {
                message += " Some videos might be hidden by keyword or channel filters.";
            }
            videoThumbnailGrid.innerHTML = `<p class="empty-state">${message}</p>`;
            return;
        }

        filteredVideos.forEach((video, index) => {
            const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
            const item = document.createElement('div'); item.classList.add('thumbnail-item'); item.dataset.videoId = video.id;
            
            if (isPremium && Object.keys(categoryWatchCount).length > 0 && index < 3 ) {
                const mostWatchedCatCount = Math.max(0, ...Object.values(categoryWatchCount)); 
                if( (categoryWatchCount[video.category] || 0) === mostWatchedCatCount && mostWatchedCatCount > 0){
                    item.classList.add('recommended');
                }
            }

            item.innerHTML = `
                <img src="${thumbnailUrl}" alt="${video.title || 'Video Thumbnail'}">
                <p>${video.title || 'Untitled Video'} <span class="category-tag">(${(video.category || 'Uncategorized')})</span></p>
            `;
            item.addEventListener('click', () => playVideo(video.id, video.title, video.category, video.channelName));
            videoThumbnailGrid.appendChild(item);
        });
    }

    function isWithinScheduledTime() { 
        if (!isPremium || !accessSchedule.start || !accessSchedule.end) { return true; }
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return currentTime >= accessSchedule.start && currentTime <= accessSchedule.end;
    }

    function playVideo(videoId, videoTitle, videoCategory, videoChannelName) { 
        if (!isWithinScheduledTime()) {
            showScreenTimeLock("Access is currently outside scheduled hours.", "Scheduled Time Block"); return;
        }
        if (isScreenTimeLimitReached()) { showScreenTimeLock(); return; }
        if (screenTimeLock) screenTimeLock.classList.add('hidden');
        if (instructionsP) instructionsP.style.display = 'none';
        
        const origin = window.location.protocol === 'file:' ? '*' : (window.location.origin || '*');
        const originParam = `&origin=${encodeURIComponent(origin)}`;

        const existingIframe = videoPlayerContainer.querySelector('iframe');
        if (existingIframe) existingIframe.remove();
        videoPlayerContainer.insertAdjacentHTML('beforeend', `
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1${originParam}"
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>`);
        
        currentlyPlayingVideoInfo = { title: videoTitle, videoId: videoId };
        updateRealTimeMonitoringDisplay(); 
        logVideoPlayStart(videoId, videoTitle, videoCategory, videoChannelName);
        updateCategoryWatchCount(videoCategory); 

        startScreenTimer();
        if (goalTargetVideos > 0 && !isGoalCompletedToday && videosWatchedForGoal < goalTargetVideos) {
            videosWatchedForGoal++;
            if (videosWatchedForGoal >= goalTargetVideos) {
                isGoalCompletedToday = true;
            }
            if (isPremium && educationalCategoriesForMilestone.includes(videoCategory.toLowerCase())) {
                weeklyMilestoneProgress++;
                updateWeeklyMilestoneDisplay(); 
            }
            updateGoalDisplay(); 
            saveProfileData(); 
        }
    }

    // FEATURE INFO MODAL FUNCTIONS ARE REMOVED

    if (freeFeaturesBtn) { freeFeaturesBtn.addEventListener('click', () => { window.location.href = 'index.html'; }); }
    
    if (togglePremiumBtn) {
        togglePremiumBtn.addEventListener('click', () => {
            isPremium = !isPremium; 
            saveGlobalSettings(); 
            updatePremiumUI(); 
            renderThumbnails(); 
        });
    }

    if (parentalModeBtn) parentalModeBtn.addEventListener('click', () => { 
        controlYouTubePlayer('pause'); 
        currentlyPlayingVideoInfo = { title: null, videoId: null }; 
        stopScreenTimer(); 
        if(parentalControlsModal) parentalControlsModal.classList.remove('hidden');
        if(passwordSection) passwordSection.classList.remove('hidden');
        if(settingsSection) settingsSection.classList.add('hidden');
        if(passwordInput) passwordInput.value = ''; 
        if(passwordError) passwordError.textContent = '';
        if(newPasswordInput) newPasswordInput.value = ''; 
        if(videoUrlInput) videoUrlInput.value = '';
        if(videoChannelNameInput) videoChannelNameInput.value = '';
        if(videoAddError) videoAddError.textContent = ''; 
        
        if(screenTimeLimitInput) screenTimeLimitInput.value = screenTimeLimitMinutes;
        if(goalVideosCountInput) goalVideosCountInput.value = goalTargetVideos;
        populateProfileSelect(); 
        
        if (screenTimeResetMessage) screenTimeResetMessage.classList.add('hidden');
        if (goalSetMessage) goalSetMessage.classList.add('hidden');
        if (profileMessage) profileMessage.textContent = '';

        updatePremiumUI(); 
        renderContentHistory();
        updateWeeklyMilestoneDisplay();
        updateRealTimeMonitoringDisplay(); 
    });

    if(closeBtn) closeBtn.addEventListener('click', () => { 
        if(parentalControlsModal) parentalControlsModal.classList.add('hidden'); 
        updateInitialInstructionOrLock();
    });
    window.addEventListener('click', (event) => { 
        if (event.target === parentalControlsModal) {
            if(parentalControlsModal) parentalControlsModal.classList.add('hidden'); updateInitialInstructionOrLock();
        }
        // Click listener for featureInfoModal is removed
    });

    if(submitPasswordBtn) submitPasswordBtn.addEventListener('click', () => { 
        if (passwordInput && passwordInput.value === parentalPassword) {
            if(passwordSection) passwordSection.classList.add('hidden');
            if(settingsSection) settingsSection.classList.remove('hidden');
            if(passwordError) passwordError.textContent = '';
            
            populateProfileSelect(); 
            if(screenTimeLimitInput) screenTimeLimitInput.value = screenTimeLimitMinutes;
            if(goalVideosCountInput) goalVideosCountInput.value = goalTargetVideos;
            if(customRewardInput && isPremium) customRewardInput.value = customReward; else if(customRewardInput) customRewardInput.value = "";
            if(blockedKeywordsInput && isPremium) blockedKeywordsInput.value = blockedKeywords.join(', '); else if(blockedKeywordsInput) blockedKeywordsInput.value = "";
            if(accessScheduleStartInput && accessSchedule.start && isPremium) accessScheduleStartInput.value = accessSchedule.start; else if(accessScheduleStartInput) accessScheduleStartInput.value = "";
            if(accessScheduleEndInput && accessSchedule.end && isPremium) accessScheduleEndInput.value = accessSchedule.end; else if(accessScheduleEndInput) accessScheduleEndInput.value = "";
            if(blockedChannelNamesInput && isPremium) blockedChannelNamesInput.value = blockedChannelNames.join(', '); else if(blockedChannelNamesInput) blockedChannelNamesInput.value = "";
            if(weeklyMilestoneTargetInput && isPremium) weeklyMilestoneTargetInput.value = weeklyMilestoneTarget; else if(weeklyMilestoneTargetInput) weeklyMilestoneTargetInput.value = 0;
            if(educationalCategoriesInput && isPremium) educationalCategoriesInput.value = educationalCategoriesForMilestone.join(', '); else if(educationalCategoriesInput) educationalCategoriesInput.value = "";

            renderCurrentVideosList(); 
            renderCategoryVisibilityControls(); 
            updatePremiumUI(); 
            renderContentHistory();
            updateWeeklyMilestoneDisplay();
            updateRealTimeMonitoringDisplay();
        } else {
            if(passwordError) passwordError.textContent = 'Incorrect password.'; if(passwordInput) passwordInput.focus();
        }
    });

    if(addVideoBtn) addVideoBtn.addEventListener('click', () => { 
        const url = videoUrlInput.value.trim(); 
        const category = videoCategoryInput.value;
        const channelName = videoChannelNameInput.value.trim(); 

        if(videoAddError) videoAddError.textContent = '';
        if (!url) { if(videoAddError) videoAddError.textContent = 'Please enter a YouTube video URL or ID.'; return; }
        const videoId = getYouTubeVideoId(url) || (url.length === 11 ? url : null);
        if (videoId) {
            if (videos.find(v => v.id === videoId)) { if(videoAddError) videoAddError.textContent = 'This video is already in the list for this profile.'; return; }
            const title = prompt(`Enter a title for this video (ID: ${videoId}):`, `Video: ${videoId}`);
            if (title === null) return; 

            const newVideo = { id: videoId, title: title || `Video ${videoId.substring(0,5)}...`, category: category };
            if (channelName) { 
                newVideo.channelName = channelName;
            }
            videos.push(newVideo); 

            saveVideosToLocalStorage(); 
            renderCurrentVideosList(); 
            populateCategoryFilter(); 
            renderCategoryVisibilityControls();
            renderThumbnails();
            videoUrlInput.value = '';
            videoChannelNameInput.value = ''; 
        } else { if(videoAddError) videoAddError.textContent = 'Invalid YouTube URL or Video ID.'; }
    });

    function renderCurrentVideosList() {  
        if (!currentVideosListUl) return; currentVideosListUl.innerHTML = '';
        if (videos.length === 0) { currentVideosListUl.innerHTML = `<li>No videos added for ${activeProfile}.</li>`; return; }
        videos.forEach((video, index) => { 
            const li = document.createElement('li'); 
            const titleSpan = document.createElement('span');
            titleSpan.textContent = `${video.title || video.id} (Category: ${video.category || 'N/A'})`;
            if(video.channelName) {
                const channelDisplay = document.createElement('span');
                channelDisplay.classList.add('channel-name-display');
                channelDisplay.textContent = `[Ch: ${video.channelName}]`;
                titleSpan.appendChild(channelDisplay);
            }

            const removeBtn = document.createElement('button'); 
            removeBtn.classList.add('remove-video-btn', 'small-btn'); 
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => {
                videos.splice(index, 1); 
                saveVideosToLocalStorage(); 
                renderCurrentVideosList(); 
                populateCategoryFilter(); 
                renderCategoryVisibilityControls();
                renderThumbnails();
            });
            li.appendChild(titleSpan); li.appendChild(removeBtn); currentVideosListUl.appendChild(li);
        });
    }

    function renderCategoryVisibilityControls() {  
        if (!categoryVisibilityControls) return; categoryVisibilityControls.innerHTML = '';
        const uniqueCategoriesInUse = getUniqueCategories(videos); 
        if (uniqueCategoriesInUse.length === 0) { categoryVisibilityControls.innerHTML = `<p>No categories to manage (add videos for ${activeProfile} first).</p>`; return; }
        
        uniqueCategoriesInUse.forEach(cat => {
            if (!cat) return;
            const itemId = `cat-toggle-${cat.replace(/\s+/g, '-')}`;
            const itemDiv = document.createElement('div'); itemDiv.classList.add('category-visibility-item');
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = itemId; checkbox.value = cat;
            checkbox.checked = !blockedCategories.includes(cat); 
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) blockedCategories = blockedCategories.filter(blockedCat => blockedCat !== cat);
                else if (!blockedCategories.includes(cat)) blockedCategories.push(cat);
                populateCategoryFilter(); 
                renderThumbnails();
            });
            const label = document.createElement('label'); label.htmlFor = itemId; label.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            itemDiv.appendChild(checkbox); itemDiv.appendChild(label); categoryVisibilityControls.appendChild(itemDiv);
        });
    }

    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', () => { 
        const newPass = newPasswordInput.value.trim();
        if (newPass) {
            if (newPass.length < 4) { alert("New password must be at least 4 characters long."); return; }
            parentalPassword = newPass;
        }
        saveGlobalSettings(); 

        const newLimitStr = screenTimeLimitInput.value; 
        const newLimit = parseInt(newLimitStr, 10);
        if (!isNaN(newLimit) && newLimit >= 0) {
            if (screenTimeLimitMinutes !== newLimit) { 
                screenTimeLimitMinutes = newLimit; 
            }
        } else { alert("Invalid screen time limit."); return; }

        if (isPremium) {
            if (customRewardInput) customReward = customRewardInput.value.trim();
            if (blockedKeywordsInput) {
                blockedKeywords = blockedKeywordsInput.value.split(',')
                                    .map(kw => kw.trim().toLowerCase()).filter(kw => kw !== '');
            }
            if (accessScheduleStartInput && accessScheduleEndInput) {
                accessSchedule.start = accessScheduleStartInput.value; 
                accessSchedule.end = accessScheduleEndInput.value;
                if (accessSchedule.start && accessSchedule.end && accessSchedule.start >= accessSchedule.end) {
                    alert("Access schedule end time must be after start time. Schedule not saved for this part.");
                    const storedSchedule = localStorage.getItem(getStorageKey('accessSchedule')); 
                    if (storedSchedule) accessSchedule = JSON.parse(storedSchedule); else {accessSchedule.start = null; accessSchedule.end = null;}
                    if(accessScheduleStartInput && accessSchedule.start) accessScheduleStartInput.value = accessSchedule.start; else if(accessScheduleStartInput) accessScheduleStartInput.value = "";
                    if(accessScheduleEndInput && accessSchedule.end) accessScheduleEndInput.value = accessSchedule.end; else if(accessScheduleEndInput) accessScheduleEndInput.value = "";
                }
            }
            if (blockedChannelNamesInput) {
                blockedChannelNames = blockedChannelNamesInput.value.split(',')
                                    .map(cn => cn.trim()).filter(cn => cn !== '');
            }
            if (weeklyMilestoneTargetInput) {
                const newMilestoneTarget = parseInt(weeklyMilestoneTargetInput.value, 10);
                if (!isNaN(newMilestoneTarget) && newMilestoneTarget >= 0) {
                    weeklyMilestoneTarget = newMilestoneTarget;
                } else {
                    alert("Invalid weekly milestone target."); weeklyMilestoneTargetInput.value = weeklyMilestoneTarget; 
                }
            }
            if (educationalCategoriesInput) {
                educationalCategoriesForMilestone = educationalCategoriesInput.value.split(',')
                                    .map(cat => cat.trim().toLowerCase()).filter(cat => cat !== '');
            }
        }
        
        saveProfileData(); 

        if (goalSetMessage) { 
            goalSetMessage.textContent = "All settings saved!";
            goalSetMessage.classList.remove('hidden');
            setTimeout(() => { goalSetMessage.classList.add('hidden'); goalSetMessage.textContent = ""; }, 3000);
        }
        if (newPasswordInput) newPasswordInput.value = ''; 
        
        updateScreenTimeDisplayVisibility(); 
        populateCategoryFilter(); 
        renderThumbnails(); 
        updateWeeklyMilestoneDisplay();
        if(parentalControlsModal) parentalControlsModal.classList.add('hidden');
        updateInitialInstructionOrLock();
    });
    
    if(categoryFilter) categoryFilter.addEventListener('change', renderThumbnails);

    function formatTime(totalSeconds) {  
        if (totalSeconds < 0) totalSeconds = 0;
        const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    function updateScreenTimeDisplay() {  
        if (!timeLeftValue || !screenTimeDisplay) return;
        if (screenTimeLimitMinutes === 0) { timeLeftValue.textContent = "∞"; screenTimeDisplay.classList.remove('low-time'); return; }
        const totalLimitSeconds = screenTimeLimitMinutes * 60;
        const remainingSeconds = totalLimitSeconds - timeSpentTodaySeconds;
        timeLeftValue.textContent = formatTime(remainingSeconds);
        if (remainingSeconds <= 0) timeLeftValue.textContent = "00:00";
        if (remainingSeconds <= 60 && remainingSeconds > 0) screenTimeDisplay.classList.add('low-time');
        else screenTimeDisplay.classList.remove('low-time');

        updateRealTimeMonitoringDisplay(); 
    }
    function updateScreenTimeDisplayVisibility() {  
        if (!screenTimeDisplay) return;
        const iframe = videoPlayerContainer.querySelector('iframe');
        const isLockScreenActive = screenTimeLock && !screenTimeLock.classList.contains('hidden');
        if (isLockScreenActive) { screenTimeDisplay.classList.add('hidden'); }
        else if ( (screenTimeLimitMinutes > 0 && iframe) || (screenTimeLimitMinutes === 0 && iframe) ) { screenTimeDisplay.classList.remove('hidden');}
        else if (screenTimeLimitMinutes > 0 && !iframe && timeSpentTodaySeconds < (screenTimeLimitMinutes * 60) && isWithinScheduledTime()) { screenTimeDisplay.classList.remove('hidden'); }
        else { screenTimeDisplay.classList.add('hidden'); }
        updateScreenTimeDisplay();
    }
    function startScreenTimer() {  
        updateScreenTimeDisplayVisibility();
        if (screenTimeLimitMinutes === 0) { return; }
        if (isScreenTimeLimitReached() || !isWithinScheduledTime()) { updateInitialInstructionOrLock(); return; }
        if (screenTimeInterval) clearInterval(screenTimeInterval);
        updateScreenTimeDisplay(); 
        screenTimeInterval = setInterval(() => {
            timeSpentTodaySeconds++; updateScreenTimeDisplay(); 
            if (isScreenTimeLimitReached() || !isWithinScheduledTime()) { 
                stopScreenTimer(); 
                saveProfileData(); 
                updateInitialInstructionOrLock(); 
            }
        }, 1000);
    }
    function stopScreenTimer() { 
        if (screenTimeInterval) { 
            clearInterval(screenTimeInterval); 
            screenTimeInterval = null; 
            saveProfileData(); 
        }
    }
    function isScreenTimeLimitReached() { if (screenTimeLimitMinutes === 0) return false; return (timeSpentTodaySeconds / 60) >= screenTimeLimitMinutes;}
    
    function showScreenTimeLock(message = "Time for a break! Please ask a parent to unlock more time.", title = "Screen Time Limit Reached!") { 
        controlYouTubePlayer('pause');
        currentlyPlayingVideoInfo = { title: null, videoId: null };
        const iframe = videoPlayerContainer.querySelector('iframe'); if (iframe) iframe.remove();
        if (instructionsP) instructionsP.style.display = 'none';
        if (screenTimeLock && lockScreenTitle && lockScreenMessage) {
            screenTimeLock.classList.remove('hidden');
            lockScreenTitle.textContent = title; lockScreenMessage.textContent = message;
        }
        if (screenTimeDisplay) screenTimeDisplay.classList.add('hidden'); 
        stopScreenTimer(); 
        updateRealTimeMonitoringDisplay();
    }
    function hideScreenTimeLock() {  
        if (screenTimeLock) screenTimeLock.classList.add('hidden');
        updateScreenTimeDisplayVisibility(); 
        const hasIframe = videoPlayerContainer.querySelector('iframe');
        if (instructionsP) {
            if (!hasIframe) {
                instructionsP.textContent = videos.length === 0 ? `No videos added for ${activeProfile}.` : "Select a video below to start watching!";
                instructionsP.style.display = 'block';
            } else { instructionsP.style.display = 'none'; }
        }
    }

    if(setGoalBtn) setGoalBtn.addEventListener('click', () => { 
        const count = parseInt(goalVideosCountInput.value, 10);
        if (!isNaN(count) && count >= 0) {
            goalTargetVideos = count; 
            videosWatchedForGoal = 0; 
            isGoalCompletedToday = false;
            updateGoalDisplay();
            if (goalSetMessage) {
                goalSetMessage.textContent = goalTargetVideos > 0 ? `Daily goal updated for ${activeProfile}.` : `Daily goal tracking disabled for ${activeProfile}.`;
                goalSetMessage.classList.remove('hidden');
                setTimeout(() => { goalSetMessage.classList.add('hidden'); goalSetMessage.textContent = ""; }, 3000);
            }
        } else { alert("Please enter a valid non-negative number for the goal."); }
    });
    function updateGoalDisplay() { 
        if (!goalStatusContainer || !goalProgressText || !goalCompleteText || !goalRewardDisplay || !goalRewardTextElement) return;
        if (goalTargetVideos > 0) {
            goalStatusContainer.classList.remove('hidden');
            goalProgressText.textContent = `Goal: Watched ${videosWatchedForGoal} of ${goalTargetVideos} videos.`;
            if (isGoalCompletedToday || (videosWatchedForGoal >= goalTargetVideos && goalTargetVideos > 0)) {
                isGoalCompletedToday = true; 
                goalCompleteText.textContent = "🎉 Goal Complete! Well Done! 🎉"; goalCompleteText.classList.remove('hidden');
                goalRewardDisplay.classList.remove('hidden');
                goalRewardTextElement.textContent = (isPremium && customReward) ? customReward : "Awesome! You reached the goal!";
            } else {
                goalCompleteText.classList.add('hidden'); goalRewardDisplay.classList.add('hidden');
            }
        } else {
            goalStatusContainer.classList.add('hidden'); goalCompleteText.classList.add('hidden'); goalRewardDisplay.classList.add('hidden');
        }
    }

    if (resetScreenTimeBtn) {  
        resetScreenTimeBtn.addEventListener('click', () => {
            timeSpentTodaySeconds = 0; 
            updateScreenTimeDisplay(); 
            if (screenTimeLock && !screenTimeLock.classList.contains('hidden') && !isScreenTimeLimitReached() && isWithinScheduledTime()) { 
                hideScreenTimeLock(); 
            } else { 
                updateScreenTimeDisplayVisibility(); 
            }
            if (screenTimeResetMessage) {
                screenTimeResetMessage.textContent = `Today's screen time reset for ${activeProfile}!`;
                screenTimeResetMessage.classList.remove('hidden');
                setTimeout(() => { screenTimeResetMessage.classList.add('hidden'); screenTimeResetMessage.textContent = ""; }, 3000);
            }
        });
    }
    
    if (immediateLockoutBtn) {
        immediateLockoutBtn.addEventListener('click', () => {
            if (!isPremium) {
                alert("Immediate Lockout is a premium feature.");
                return; 
            }
            console.log("Immediate lockout activated by parent for profile:", activeProfile);
            const effectiveLimitMinutes = screenTimeLimitMinutes > 0 ? screenTimeLimitMinutes : 60;
            timeSpentTodaySeconds = effectiveLimitMinutes * 60 + 1; 

            controlYouTubePlayer('pause'); 
            const iframe = videoPlayerContainer.querySelector('iframe'); 
            if (iframe) iframe.remove();
            currentlyPlayingVideoInfo = { title: null, videoId: null }; 
            
            saveProfileData(); 
            showScreenTimeLock("Access locked by parent.", "Screen Locked");
            
            if(parentalControlsModal && !parentalControlsModal.classList.contains('hidden')) {
                parentalControlsModal.classList.add('hidden');
            }
        });
    }


    if (addProfileBtn) {
        addProfileBtn.addEventListener('click', () => {
            const newProfileName = profileNameInput.value.trim();
            if (newProfileName && !profiles.includes(newProfileName)) {
                profiles.push(newProfileName);
                activeProfile = newProfileName; 
                saveGlobalSettings();
                populateProfileSelect();
                loadProfileData(); 
                renderCurrentVideosList();
                renderCategoryVisibilityControls();
                renderThumbnails();
                updateGoalDisplay();
                updateScreenTimeDisplayVisibility();
                updateWeeklyMilestoneDisplay();
                renderContentHistory();
                profileNameInput.value = '';
                if (profileMessage) profileMessage.textContent = `Profile "${newProfileName}" added and activated.`;
            } else if (profiles.includes(newProfileName)) {
                if (profileMessage) profileMessage.textContent = 'Profile name already exists.';
            } else {
                if (profileMessage) profileMessage.textContent = 'Please enter a valid profile name.';
            }
        });
    }

    if (activeProfileSelect) {
        activeProfileSelect.addEventListener('change', (e) => {
            const selectedProfile = e.target.value;
            if (activeProfile !== selectedProfile) {
                controlYouTubePlayer('pause'); 
                stopScreenTimer(); 
                currentlyPlayingVideoInfo = { title: null, videoId: null}; 

                activeProfile = selectedProfile;
                saveGlobalSettings(); 
                loadProfileData(); 
                
                if(screenTimeLimitInput) screenTimeLimitInput.value = screenTimeLimitMinutes;
                if(goalVideosCountInput) goalVideosCountInput.value = goalTargetVideos;
                if(customRewardInput && isPremium) customRewardInput.value = customReward; else if(customRewardInput) customRewardInput.value = "";
                if(blockedKeywordsInput && isPremium) blockedKeywordsInput.value = blockedKeywords.join(', '); else if(blockedKeywordsInput) blockedKeywordsInput.value = "";
                if(accessScheduleStartInput && accessSchedule.start && isPremium) accessScheduleStartInput.value = accessSchedule.start; else if(accessScheduleStartInput) accessScheduleStartInput.value = "";
                if(accessScheduleEndInput && accessSchedule.end && isPremium) accessScheduleEndInput.value = accessSchedule.end; else if(accessScheduleEndInput) accessScheduleEndInput.value = "";
                if(blockedChannelNamesInput && isPremium) blockedChannelNamesInput.value = blockedChannelNames.join(', '); else if(blockedChannelNamesInput) blockedChannelNamesInput.value = "";
                if(weeklyMilestoneTargetInput && isPremium) weeklyMilestoneTargetInput.value = weeklyMilestoneTarget; else if(weeklyMilestoneTargetInput) weeklyMilestoneTargetInput.value = 0;
                if(educationalCategoriesInput && isPremium) educationalCategoriesInput.value = educationalCategoriesForMilestone.join(', '); else if(educationalCategoriesInput) educationalCategoriesInput.value = "";
                
                renderCurrentVideosList();
                renderCategoryVisibilityControls();
                updateWeeklyMilestoneDisplay();
                renderContentHistory();
                updateRealTimeMonitoringDisplay(); 
                renderThumbnails(); 
                updateInitialInstructionOrLock(); 

                if (profileMessage) profileMessage.textContent = `Switched to profile: ${activeProfile}.`;
            }
        });
    }
    
    if (deleteProfileBtn) {
        deleteProfileBtn.addEventListener('click', () => {
            if (profiles.length <= 1) {
                if (profileMessage) profileMessage.textContent = "Cannot delete the last profile.";
                return;
            }
            const profileToDelete = activeProfileSelect.value; 
            if (confirm(`Are you sure you want to delete profile "${profileToDelete}" and all its data? This cannot be undone.`)) {
                controlYouTubePlayer('pause'); 
                stopScreenTimer(); 
                currentlyPlayingVideoInfo = { title: null, videoId: null};

                const keysToRemove = ['videos', 'screenTimeLimit', 'timeSpentToday', 'lastDatePlayed', 
                                      'goalTargetVideos', 'videosWatchedForGoal', 'goalCompletedToday', 
                                      'blockedCategories', 'customReward', 'blockedKeywords', 'accessSchedule',
                                      'blockedChannelNames', 'contentHistory', 'weeklyMilestoneTarget',
                                      'educationalCategoriesForMilestone', 'weeklyMilestoneProgress', 'lastMilestoneResetWeek',
                                      'categoryWatchCount'];
                keysToRemove.forEach(key => localStorage.removeItem(`blocksApp_${profileToDelete}_${key}`));

                profiles = profiles.filter(p => p !== profileToDelete);
                activeProfile = profiles[0]; 
                saveGlobalSettings();
                populateProfileSelect();
                loadProfileData(); 
                renderCurrentVideosList();
                renderCategoryVisibilityControls();
                renderThumbnails(); 
                updateGoalDisplay();
                updateScreenTimeDisplayVisibility();
                updateWeeklyMilestoneDisplay();
                renderContentHistory();
                updateRealTimeMonitoringDisplay();
                updateInitialInstructionOrLock();
                if (profileMessage) profileMessage.textContent = `Profile "${profileToDelete}" deleted. Switched to "${activeProfile}".`;
            }
        });
    }

    function updateCategoryWatchCount(category) {
        if (!isPremium) return;
        categoryWatchCount[category] = (categoryWatchCount[category] || 0) + 1;
    }

    function logVideoPlayStart(videoId, title, category, channelName) { 
        if (!isPremium) return;
        const now = new Date();
        contentHistory.push({
            videoId,
            title,
            category,
            channelName: channelName || 'Unknown Channel',
            startTime: now.toISOString(),
            date: now.toLocaleDateString()
        });
        if (contentHistory.length > 100) { 
            contentHistory.shift(); 
        }
        renderContentHistory(); 
    }

    function renderContentHistory() {
        if (!contentHistoryDisplayUl || !contentHistoryDisplayText) return;
        
        contentHistoryDisplayUl.innerHTML = '';
        if (contentHistory.length === 0) {
            contentHistoryDisplayText.textContent = `No viewing history yet for ${activeProfile}.`;
            contentHistoryDisplayText.classList.remove('hidden');
            contentHistoryDisplayUl.classList.add('hidden');
        } else {
            contentHistoryDisplayText.classList.add('hidden');
            contentHistoryDisplayUl.classList.remove('hidden');
            [...contentHistory].reverse().forEach(entry => {
                const li = document.createElement('li');
                const startTime = new Date(entry.startTime);
                li.innerHTML = `<strong>${entry.title || entry.videoId}</strong> (Cat: ${entry.category}) - Played on ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`;
                contentHistoryDisplayUl.appendChild(li);
            });
        }
    }
    if(clearHistoryBtn) { 
        clearHistoryBtn.addEventListener('click', () => {
            if(!isPremium){ alert("Clearing history is a premium feature."); return; }
            if(confirm(`Are you sure you want to clear all viewing history for profile "${activeProfile}"?`)) {
                contentHistory = [];
                renderContentHistory();
                 if (profileMessage) profileMessage.textContent = `History cleared for ${activeProfile}. (Save settings to persist)`;
            }
        });
    }

    function getCurrentWeekNumber() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        now.setDate(now.getDate() + 3 - (now.getDay() + 6) % 7);
        const week1 = new Date(now.getFullYear(), 0, 4);
        return 1 + Math.round(((now - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    }


    function checkAndResetWeeklyMilestone() {
        if (!isPremium) return;
        const currentWeek = getCurrentWeekNumber();
        if (lastMilestoneResetWeek === null) { 
             lastMilestoneResetWeek = currentWeek;
        } else if (lastMilestoneResetWeek !== currentWeek) {
            weeklyMilestoneProgress = 0;
            lastMilestoneResetWeek = currentWeek;
            console.log(`Weekly milestone reset for profile ${activeProfile} for week ${currentWeek}`);
        }
    }

    function updateWeeklyMilestoneDisplay() {
        if (!weeklyMilestoneProgressText) return;
        if (!isPremium) {
            weeklyMilestoneProgressText.textContent = "Weekly Milestones is a premium feature.";
            return;
        }
        checkAndResetWeeklyMilestone(); 
        weeklyMilestoneProgressText.textContent = `Weekly Progress: ${weeklyMilestoneProgress} / ${weeklyMilestoneTarget} educational videos watched.`;
    }

    function updateRealTimeMonitoringDisplay() {
        if (!realTimeStatusText) return;
         if (!isPremium) {
            realTimeStatusText.textContent = "Real-time Monitoring is a premium feature.";
            return;
        }
        let status = `Currently Watching: ${currentlyPlayingVideoInfo.title || '(Nothing)'}`;
        let timeLeftStr = "N/A";
        if (screenTimeLimitMinutes === 0) {
            timeLeftStr = "Unlimited";
        } else {
            const remainingSeconds = (screenTimeLimitMinutes * 60) - timeSpentTodaySeconds;
            timeLeftStr = formatTime(remainingSeconds > 0 ? remainingSeconds : 0);
        }
        status += ` | Time Left: ${timeLeftStr}`;
        realTimeStatusText.textContent = status;
    }

    if (generateReportBtn) { 
        generateReportBtn.addEventListener('click', () => {
            if(!isPremium){ alert("Weekly Reports is a premium feature."); return; }
            renderWeeklyReport();
        });
    }

    function renderWeeklyReport() {
        if (!isPremium || !weeklyReportDisplay) return;
        weeklyReportDisplay.innerHTML = ''; 

        const AVERAGE_VIDEO_DURATION_MINUTES = 4; 

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const recentHistory = contentHistory.filter(entry => new Date(entry.startTime) >= oneWeekAgo);

        if (recentHistory.length === 0) {
            weeklyReportDisplay.innerHTML = `
                <div class="wrapped-report-container" style="text-align:center; padding: 40px 20px;">
                    <span class="wrapped-logo" style="font-size: 2.5em; display:block; margin-bottom: 10px;">📊</span>
                    <h2 style="margin-bottom: 10px;">Weekly Wrapped</h2>
                    <p style="color: var(--border-neutral);">Not enough activity in the last 7 days for ${activeProfile} to generate a report.</p>
                    <p style="font-size: 0.8em; margin-top: 15px; color: var(--text-secondary);">Check back after more videos have been watched!</p>
                </div>`;
            return;
        }

        const totalVideosWatched = recentHistory.length;
        const totalMinutesWatched = totalVideosWatched * AVERAGE_VIDEO_DURATION_MINUTES;

        const categoryCounts = {};
        recentHistory.forEach(entry => {
            const category = entry.category || 'Uncategorized';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        const sortedCategories = Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a);

        const channelStats = {};
        recentHistory.forEach(entry => {
            const channelName = entry.channelName || 'Unknown Channel';
            if (!channelStats[channelName]) {
                channelStats[channelName] = { videos: 0 };
            }
            channelStats[channelName].videos++;
        });

        const sortedChannels = Object.entries(channelStats)
            .map(([name, data]) => ({
                name,
                videos: data.videos,
                minutes: data.videos * AVERAGE_VIDEO_DURATION_MINUTES
            }))
            .sort((a, b) => b.videos - a.videos || b.minutes - a.minutes);

        // --- Summary Generation Logic ---
        let summaryText = `This week, ${activeProfile} watched <strong>${totalVideosWatched}</strong> videos, spending an estimated <strong>${totalMinutesWatched}</strong> minutes exploring new things! `;

        if (sortedCategories.length > 0) {
            const topCategory = sortedCategories[0][0];
            summaryText += `They seemed particularly interested in the <strong>"${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}"</strong> category. `;
            if (sortedCategories.length > 1) {
                const secondTopCategory = sortedCategories[1][0];
                summaryText += `<strong>"${secondTopCategory.charAt(0).toUpperCase() + secondTopCategory.slice(1)}"</strong> was also a popular choice. `;
            }
        }

        if (sortedChannels.length > 0) {
            const topChannel = sortedChannels[0].name;
            summaryText += `Their go-to channel appears to be <strong>${topChannel}</strong>. `;
        }
        if (totalVideosWatched < 5) {
            summaryText += "It was a light week of watching, perfect for a little bit of fun and learning. ";
        } else if (totalVideosWatched >= 5 && totalVideosWatched < 15) {
            summaryText += "They've been moderately active, balancing screen time with other activities. ";
        } else {
            summaryText += "Wow, a very active week of discoveries! ";
        }
        summaryText += "Keep up the great exploring!";
        // --- End Summary Generation Logic ---


        let reportHTML = `
            <div class="wrapped-report-container">
                <div class="wrapped-header">
                    <span class="wrapped-logo">📊</span>
                    <h2>Weekly Wrapped</h2>
                </div>

                <div class="wrapped-summary">
                    <h4>This Week's Highlights for ${activeProfile}</h4>
                    <p>${summaryText}</p>
                </div>

                <div class="wrapped-main-content">
                    <div class="wrapped-stats">
                        <div class="stat-item">
                            <span class="stat-label">Minutes Watched (est.)</span>
                            <span class="stat-value">${totalMinutesWatched.toLocaleString()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Videos Watched</span>
                            <span class="stat-value">${totalVideosWatched.toLocaleString()}</span>
                        </div>
                        <div class="stat-item top-tags">
                            <span class="stat-label">Top Categories</span>
                            ${sortedCategories.length > 0
                                ? `<p class="tags-list">${sortedCategories.slice(0, 5).map(c => c[0].charAt(0).toUpperCase() + c[0].slice(1)).join(', ')}</p>`
                                : '<p class="tags-list" style="color: var(--border-neutral);">No specific category data.</p>'
                            }
                        </div>
                    </div>
                    <div class="wrapped-top-channels">
                        <h3>Top Channels</h3>
                        ${sortedChannels.length > 0
                            ? `<ul class="channel-list">
                                    ${sortedChannels.slice(0, 5).map(channel => `
                                        <li>
                                            <span class="channel-name">${channel.name}</span>
                                            <span class="channel-details">${channel.videos} videos • ${channel.minutes} min (est.)</span>
                                        </li>
                                    `).join('')}
                               </ul>`
                            : '<p style="color: var(--border-neutral);">No channel data in the last week.</p>'
                        }
                    </div>
                </div>
                <p class="report-footer">
                    <em>Weekly report for ${activeProfile}. Generated: ${new Date().toLocaleDateString()}</em>
                    <em>(Minutes watched are estimated based on an average video duration of ${AVERAGE_VIDEO_DURATION_MINUTES} min.)</em>
                </p>
            </div>
        `;
        weeklyReportDisplay.innerHTML = reportHTML;
    }

    // Event Listeners for Premium Info Buttons are removed

    function updateInitialInstructionOrLock() { 
        if (!isWithinScheduledTime()) {
            showScreenTimeLock("Access is currently outside scheduled hours.", "Scheduled Time Block"); return;
        }
        if (isScreenTimeLimitReached()) { showScreenTimeLock(); } 
        else {
            hideScreenTimeLock();
            const iframe = videoPlayerContainer.querySelector('iframe');
            if (iframe) { 
            } else { 
                stopScreenTimer(); 
                updateScreenTimeDisplayVisibility(); 
            }
        }
    }

    loadGlobalSettings(); 
    populateProfileSelect(); 
    loadProfileData(); 
    
    createFloatingShapes();
    updatePremiumUI(); 
    updateInitialInstructionOrLock(); 

    console.log("App Initialized with FULL Premium Features (No Learn More). Active Profile:", activeProfile);
});
