/**
 * Strava Unfollowers Tool
 * Find who doesn't follow you back on Strava
 * 
 * Usage:
 * 1. Go to https://www.strava.com and log in
 * 2. Open browser console (F12 or Cmd+Option+J on Mac)
 * 3. Paste this entire script and press Enter
 */

(function() {
  'use strict';

  // Check if we're on Strava
  if (location.hostname !== 'www.strava.com') {
    alert('Please run this script on www.strava.com');
    return;
  }

  // ============================================
  // STYLES
  // ============================================
  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

    .su-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a1f25 100%);
      z-index: 999999;
      overflow: auto;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .su-container {
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .su-header {
      position: sticky;
      top: 0;
      background: rgba(13, 17, 23, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(252, 82, 0, 0.2);
      padding: 1rem 2rem;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .su-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }

    .su-logo-text {
      display: flex;
      flex-direction: column;
      font-family: 'Space Mono', monospace;
    }

    .su-logo-text .title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fc5200;
    }

    .su-logo-text .subtitle {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .su-header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .su-btn {
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .su-btn-primary {
      background: linear-gradient(135deg, #fc5200 0%, #ff7033 100%);
      color: white;
    }

    .su-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(252, 82, 0, 0.4);
    }

    .su-btn-secondary {
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
    }

    .su-btn-secondary:hover {
      background: rgba(255,255,255,0.15);
    }

    .su-btn-danger {
      background: linear-gradient(135deg, #dc3545 0%, #ff4757 100%);
      color: white;
    }

    .su-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .su-close-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .su-close-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .su-main {
      display: flex;
      flex: 1;
      gap: 0;
    }

    .su-sidebar {
      width: 320px;
      background: rgba(0,0,0,0.3);
      border-right: 1px solid rgba(255,255,255,0.1);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .su-content {
      flex: 1;
      padding: 1.5rem 2rem;
    }

    .su-stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .su-stat-card {
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
    }

    .su-stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #fc5200;
      font-family: 'Space Mono', monospace;
    }

    .su-stat-label {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 0.25rem;
    }

    .su-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 1rem;
    }

    .su-tab {
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .su-tab:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    .su-tab.active {
      background: rgba(252, 82, 0, 0.2);
      color: #fc5200;
    }

    .su-search {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.3);
      color: white;
      font-size: 0.9rem;
    }

    .su-search::placeholder {
      color: rgba(255,255,255,0.4);
    }

    .su-search:focus {
      outline: none;
      border-color: #fc5200;
    }

    .su-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .su-card {
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .su-card:hover {
      background: rgba(255,255,255,0.08);
      transform: translateY(-2px);
    }

    .su-card.selected {
      border-color: #fc5200;
      background: rgba(252, 82, 0, 0.1);
    }

    .su-card.whitelisted {
      border-color: #28a745;
      background: rgba(40, 167, 69, 0.1);
    }

    .su-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      background: rgba(255,255,255,0.1);
    }

    .su-card-info {
      flex: 1;
      min-width: 0;
    }

    .su-card-name {
      font-weight: 600;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .su-card-location {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .su-premium-badge {
      background: linear-gradient(135deg, #fc5200, #ff7033);
      color: white;
      font-size: 0.65rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .su-checkbox {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 2px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .su-card.selected .su-checkbox {
      background: #fc5200;
      border-color: #fc5200;
    }

    .su-card.selected .su-checkbox::after {
      content: '✓';
      color: white;
      font-size: 0.8rem;
    }

    .su-progress-bar {
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-top: 1rem;
    }

    .su-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #fc5200, #ff7033);
      transition: width 0.3s ease;
    }

    .su-toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      color: white;
      font-weight: 500;
      z-index: 1000001;
      animation: slideIn 0.3s ease;
      max-width: 400px;
    }

    .su-toast.success { background: linear-gradient(135deg, #28a745, #34ce57); }
    .su-toast.error { background: linear-gradient(135deg, #dc3545, #ff4757); }
    .su-toast.warning { background: linear-gradient(135deg, #ffc107, #ffca2c); color: #000; }
    .su-toast.info { background: linear-gradient(135deg, #17a2b8, #20c9e0); }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .su-empty {
      text-align: center;
      padding: 4rem 2rem;
      color: rgba(255,255,255,0.5);
    }

    .su-empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .su-section-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 0.75rem;
    }

    .su-bulk-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .su-bulk-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      border-radius: 6px;
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      cursor: pointer;
    }

    .su-bulk-btn:hover {
      background: rgba(255,255,255,0.15);
    }

    .su-initial-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 2rem;
    }

    .su-initial-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }

    .su-initial-title {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .su-initial-subtitle {
      color: rgba(255,255,255,0.6);
      margin-bottom: 2rem;
      max-width: 500px;
    }

    .su-scanning-status {
      text-align: center;
      padding: 2rem;
    }

    .su-scanning-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(252, 82, 0, 0.2);
      border-top-color: #fc5200;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .su-log {
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      padding: 1rem;
      max-height: 200px;
      overflow-y: auto;
      font-family: 'Space Mono', monospace;
      font-size: 0.8rem;
    }

    .su-log-entry {
      padding: 0.25rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .su-log-entry.success { color: #28a745; }
    .su-log-entry.error { color: #dc3545; }
    .su-log-entry.info { color: rgba(255,255,255,0.7); }

    .su-pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .su-page-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      cursor: pointer;
    }

    .su-page-btn:hover:not(:disabled) {
      background: rgba(255,255,255,0.15);
    }

    .su-page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .su-page-btn.active {
      background: #fc5200;
    }

    .su-whitelist-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.25rem;
      opacity: 0.5;
      transition: opacity 0.2s;
    }

    .su-whitelist-btn:hover {
      opacity: 1;
    }

    .su-whitelist-btn.active {
      opacity: 1;
    }

    .su-settings-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000002;
    }

    .su-modal-content {
      background: #1a1f25;
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
    }

    .su-modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1.5rem;
    }

    .su-form-group {
      margin-bottom: 1rem;
    }

    .su-form-label {
      display: block;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.7);
      margin-bottom: 0.5rem;
    }

    .su-form-input {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.3);
      color: white;
    }

    .su-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
  `;

  // ============================================
  // STATE
  // ============================================
  const state = {
    status: 'initial', // initial, scanning, results, unfollowing
    following: [],
    followers: [],
    nonFollowers: [],
    selectedAthletes: new Set(),
    whitelisted: new Set(JSON.parse(localStorage.getItem('strava_unfollowers_whitelist') || '[]')),
    currentTab: 'non_followers',
    searchTerm: '',
    page: 1,
    itemsPerPage: 50,
    progress: 0,
    progressText: '',
    unfollowLog: [],
    toast: null,
    showSettings: false,
    settings: {
      delayBetweenRequests: 1500,
      delayAfterFiveRequests: 8000,
      delayBetweenUnfollows: 3000,
      delayAfterFiveUnfollows: 60000,
      ...JSON.parse(localStorage.getItem('strava_unfollowers_settings') || '{}')
    },
    athleteId: null
  };

  // ============================================
  // UTILITIES
  // ============================================
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function saveWhitelist() {
    localStorage.setItem('strava_unfollowers_whitelist', JSON.stringify([...state.whitelisted]));
  }

  function saveSettings() {
    localStorage.setItem('strava_unfollowers_settings', JSON.stringify(state.settings));
  }

  function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : '';
  }

  function showToast(message, type = 'info', duration = 4000) {
    state.toast = { message, type };
    render();
    if (duration > 0) {
      setTimeout(() => {
        state.toast = null;
        render();
      }, duration);
    }
  }

  // ============================================
  // STRAVA API FUNCTIONS
  // ============================================
  async function fetchFollowsPage(athleteId, type, page = 1) {
    const url = `https://www.strava.com/athletes/${athleteId}/follows?type=${type}&page=${page}`;
    
    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      return parseAthletesFromHTML(html);
    } catch (error) {
      console.error(`Error fetching ${type} page ${page}:`, error);
      return { athletes: [], hasMore: false };
    }
  }

  function parseAthletesFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const athletes = [];
    
    // Athletes are in <li data-athlete-id="..."> elements
    const athleteElements = doc.querySelectorAll('li[data-athlete-id]');
    
    athleteElements.forEach(el => {
      const athlete = parseAthleteCard(el);
      if (athlete) athletes.push(athlete);
    });
    
    // Check for next page - look for pagination link with rel="next"
    const nextPageLink = doc.querySelector('.pagination a[rel="next"]');
    const hasMore = nextPageLink !== null;
    
    console.log(`Parsed ${athletes.length} athletes, hasMore: ${hasMore}`);
    
    return { athletes, hasMore };
  }

  function parseAthleteCard(element) {
    try {
      // Get athlete ID from data attribute
      const id = element.getAttribute('data-athlete-id');
      if (!id) return null;
      
      // Get name from .text-callout a
      let name = '';
      const nameLink = element.querySelector('.text-callout a');
      if (nameLink) {
        name = nameLink.textContent.trim();
      }
      
      // Get location from .location div
      let location = '';
      const locationEl = element.querySelector('.location');
      if (locationEl) {
        location = locationEl.textContent.trim();
      }
      
      // Get avatar and premium status from data-react-props
      let avatar = 'https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/large-59a8e8528934934c80cc56ea197a256eb5dc71bc6e6451ba5769cdd968c7e232.png';
      let isPremium = false;
      
      const avatarWrapper = element.querySelector('[data-react-props]');
      if (avatarWrapper) {
        try {
          const props = JSON.parse(avatarWrapper.getAttribute('data-react-props'));
          if (props.src) {
            avatar = props.src;
          }
          if (props.badge === 'premium') {
            isPremium = true;
          }
        } catch (e) {
          // JSON parse error, use defaults
        }
      }
      
      // Get the follow relationship ID from the unfollow button
      let followId = null;
      const unfollowBtn = element.querySelector('button[data-follow]');
      if (unfollowBtn) {
        followId = unfollowBtn.getAttribute('data-follow');
      }
      
      return { id, name, avatar, location, isPremium, followId };
    } catch (error) {
      console.error('Error parsing athlete card:', error);
      return null;
    }
  }

  async function getAllFollows(athleteId, type, onProgress) {
    const allAthletes = [];
    let page = 1;
    let hasMore = true;
    let requestCount = 0;
    
    while (hasMore) {
      const result = await fetchFollowsPage(athleteId, type, page);
      
      if (result.athletes.length === 0 && page === 1) {
        // First page empty means no data
        hasMore = false;
        break;
      }
      
      allAthletes.push(...result.athletes);
      hasMore = result.hasMore;
      page++;
      requestCount++;
      
      if (onProgress) {
        onProgress(allAthletes.length, type);
      }
      
      // Rate limiting
      if (hasMore) {
        if (requestCount % 5 === 0) {
          state.progressText = `Sleeping ${state.settings.delayAfterFiveRequests / 1000}s to avoid rate limiting...`;
          render();
          await sleep(state.settings.delayAfterFiveRequests);
        } else {
          await sleep(state.settings.delayBetweenRequests);
        }
      }
    }
    
    // Remove duplicates by ID
    const uniqueAthletes = [];
    const seenIds = new Set();
    for (const athlete of allAthletes) {
      if (!seenIds.has(athlete.id)) {
        seenIds.add(athlete.id);
        uniqueAthletes.push(athlete);
      }
    }
    
    return uniqueAthletes;
  }

  async function unfollowAthlete(athlete) {
    const csrfToken = getCsrfToken();
    const myAthleteId = state.athleteId;
    
    if (!myAthleteId) {
      console.error('No athlete ID found');
      return false;
    }
    
    if (!athlete.followId) {
      console.error(`No followId for ${athlete.name}`);
      return false;
    }
    
    // The correct endpoint: DELETE /athletes/{MY_ID}/follows/{FOLLOW_ID}
    const url = `https://www.strava.com/athletes/${myAthleteId}/follows/${athlete.followId}`;
    
    console.log(`Unfollowing ${athlete.name}: DELETE ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
        }
      });
      
      if (response.ok || response.status === 204) {
        console.log(`✓ Successfully unfollowed ${athlete.name}`);
        return true;
      } else {
        console.error(`Failed to unfollow ${athlete.name}: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`Error unfollowing ${athlete.name}:`, error);
      return false;
    }
  }

  // ============================================
  // DETECT ATHLETE ID
  // ============================================
  async function detectAthleteId() {
    // Try URL first
    const urlMatch = location.pathname.match(/\/athletes\/(\d+)/);
    if (urlMatch) {
      return urlMatch[1];
    }
    
    // Try to find from page
    const links = document.querySelectorAll('a[href*="/athletes/"]');
    for (const link of links) {
      if (link.classList.contains('nav-link') || link.closest('.user-nav, .athlete-profile')) {
        const match = link.href.match(/\/athletes\/(\d+)/);
        if (match) return match[1];
      }
    }
    
    // Try fetching profile page
    try {
      const response = await fetch('https://www.strava.com/settings/profile', {
        credentials: 'include'
      });
      const html = await response.text();
      
      // Look for athlete ID in various places
      const patterns = [
        /\/athletes\/(\d+)/,
        /"athleteId":(\d+)/,
        /data-athlete-id="(\d+)"/
      ];
      
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
      }
    } catch (err) {
      console.error('Failed to get athlete ID from profile:', err);
    }
    
    return null;
  }

  // ============================================
  // SCAN & UNFOLLOW OPERATIONS
  // ============================================
  async function startScan() {
    state.status = 'scanning';
    state.progress = 0;
    state.progressText = 'Detecting your athlete ID...';
    state.following = [];
    state.followers = [];
    state.nonFollowers = [];
    render();
    
    // Get athlete ID
    const athleteId = await detectAthleteId();
    
    if (!athleteId) {
      showToast('Could not detect your athlete ID. Please go to your profile page first.', 'error');
      state.status = 'initial';
      render();
      return;
    }
    
    state.athleteId = athleteId;
    console.log(`Found athlete ID: ${athleteId}`);
    state.progressText = `Found athlete ID: ${athleteId}. Scanning who you follow...`;
    render();
    
    // Fetch following list
    state.following = await getAllFollows(athleteId, 'following', (count) => {
      state.progressText = `Found ${count} people you follow...`;
      state.progress = Math.min(45, Math.round((count / 200) * 45));
      render();
    });
    
    console.log(`Total following: ${state.following.length}`);
    state.progress = 50;
    state.progressText = `Found ${state.following.length} following. Now scanning your followers...`;
    render();
    
    // Fetch followers list
    state.followers = await getAllFollows(athleteId, 'followers', (count) => {
      state.progressText = `Found ${count} followers...`;
      state.progress = Math.min(95, 50 + Math.round((count / 200) * 45));
      render();
    });
    
    console.log(`Total followers: ${state.followers.length}`);
    
    // Calculate non-followers
    const followerIds = new Set(state.followers.map(f => f.id));
    state.nonFollowers = state.following.filter(a => !followerIds.has(a.id));
    
    console.log(`Non-followers: ${state.nonFollowers.length}`);
    
    state.progress = 100;
    state.status = 'results';
    render();
    
    showToast(`✓ Scan complete! Found ${state.nonFollowers.length} non-followers out of ${state.following.length} following.`, 'success', 5000);
  }

  async function startUnfollow() {
    const selectedArray = Array.from(state.selectedAthletes);
    if (selectedArray.length === 0) {
      showToast('No athletes selected', 'warning');
      return;
    }
    
    if (!confirm(`Are you sure you want to unfollow ${selectedArray.length} athlete(s)?`)) {
      return;
    }
    
    state.status = 'unfollowing';
    state.unfollowLog = [];
    state.progress = 0;
    render();
    
    let count = 0;
    
    for (const id of selectedArray) {
      const athlete = state.following.find(a => a.id === id);
      if (!athlete) continue;
      
      count++;
      state.progress = Math.round((count / selectedArray.length) * 100);
      state.progressText = `Unfollowing ${athlete.name}... (${count}/${selectedArray.length})`;
      render();
      
      const success = await unfollowAthlete(athlete);
      
      state.unfollowLog.push({ athlete, success });
      
      if (success) {
        state.following = state.following.filter(a => a.id !== id);
        state.nonFollowers = state.nonFollowers.filter(a => a.id !== id);
      }
      
      render();
      
      // Delay between unfollows
      if (count < selectedArray.length) {
        if (count % 5 === 0) {
          state.progressText = `Sleeping ${state.settings.delayAfterFiveUnfollows / 1000}s to avoid rate limiting...`;
          render();
          await sleep(state.settings.delayAfterFiveUnfollows);
        } else {
          await sleep(state.settings.delayBetweenUnfollows);
        }
      }
    }
    
    state.selectedAthletes = new Set();
    state.status = 'results';
    
    const successCount = state.unfollowLog.filter(l => l.success).length;
    showToast(`✓ Unfollowed ${successCount}/${selectedArray.length} athlete(s)`, 'success', 5000);
    render();
  }

  // ============================================
  // RENDER FUNCTIONS
  // ============================================
  function getFilteredAthletes() {
    let athletes = [];
    
    switch (state.currentTab) {
      case 'non_followers':
        athletes = state.nonFollowers.filter(a => !state.whitelisted.has(a.id));
        break;
      case 'whitelisted':
        athletes = state.nonFollowers.filter(a => state.whitelisted.has(a.id));
        break;
      case 'all_following':
        athletes = state.following;
        break;
    }
    
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      athletes = athletes.filter(a => 
        a.name.toLowerCase().includes(term) ||
        (a.location && a.location.toLowerCase().includes(term))
      );
    }
    
    return athletes;
  }

  function renderAthleteCard(athlete) {
    const isSelected = state.selectedAthletes.has(athlete.id);
    const isWhitelisted = state.whitelisted.has(athlete.id);
    const isFollower = state.followers.some(f => f.id === athlete.id);
    
    return `
      <div class="su-card ${isSelected ? 'selected' : ''} ${isWhitelisted ? 'whitelisted' : ''}" data-id="${athlete.id}">
        <div class="su-checkbox"></div>
        <img class="su-avatar" src="${athlete.avatar}" alt="${athlete.name}" onerror="this.src='https://d3nn82uaxijpm6.cloudfront.net/assets/avatar/athlete/large-59a8e8528934934c80cc56ea197a256eb5dc71bc6e6451ba5769cdd968c7e232.png'">
        <div class="su-card-info">
          <div class="su-card-name">${athlete.name}</div>
          <div class="su-card-location">${athlete.location || 'No location'}</div>
          ${isFollower ? '<span style="color: #28a745; font-size: 0.75rem;">✓ Follows you</span>' : '<span style="color: #dc3545; font-size: 0.75rem;">✗ Doesn\'t follow you</span>'}
        </div>
        ${athlete.isPremium ? '<span class="su-premium-badge">Premium</span>' : ''}
        <button class="su-whitelist-btn ${isWhitelisted ? 'active' : ''}" data-whitelist="${athlete.id}" title="${isWhitelisted ? 'Remove from whitelist' : 'Add to whitelist'}">
          ${isWhitelisted ? '🛡️' : '⚪'}
        </button>
      </div>
    `;
  }

  function render() {
    let overlay = document.querySelector('.su-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'su-overlay';
      document.body.appendChild(overlay);
      
      const style = document.createElement('style');
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
    
    const athletes = getFilteredAthletes();
    const totalPages = Math.ceil(athletes.length / state.itemsPerPage);
    const startIdx = (state.page - 1) * state.itemsPerPage;
    const pageAthletes = athletes.slice(startIdx, startIdx + state.itemsPerPage);
    
    let content = '';
    
    if (state.status === 'initial') {
      content = `
        <div class="su-initial-screen">
          <div class="su-initial-icon">🔍</div>
          <h1 class="su-initial-title">Strava Unfollowers</h1>
          <p class="su-initial-subtitle">Find out who doesn't follow you back on Strava. Click the button below to start scanning your connections.</p>
          <button class="su-btn su-btn-primary" onclick="window.stravaUnfollowers.startScan()">
            🚀 Start Scan
          </button>
        </div>
      `;
    } else if (state.status === 'scanning') {
      content = `
        <div class="su-scanning-status">
          <div class="su-scanning-spinner"></div>
          <h2 style="color: white; margin-bottom: 0.5rem;">Scanning...</h2>
          <p style="color: rgba(255,255,255,0.6);">${state.progressText}</p>
          <div class="su-progress-bar" style="max-width: 400px; margin: 1rem auto;">
            <div class="su-progress-fill" style="width: ${state.progress}%"></div>
          </div>
        </div>
      `;
    } else if (state.status === 'unfollowing') {
      content = `
        <div class="su-scanning-status">
          <div class="su-scanning-spinner"></div>
          <h2 style="color: white; margin-bottom: 0.5rem;">Unfollowing...</h2>
          <p style="color: rgba(255,255,255,0.6);">${state.progressText}</p>
          <div class="su-progress-bar" style="max-width: 400px; margin: 1rem auto;">
            <div class="su-progress-fill" style="width: ${state.progress}%"></div>
          </div>
          <div class="su-log" style="max-width: 500px; margin: 1rem auto; text-align: left;">
            ${state.unfollowLog.slice(-10).map(log => `
              <div class="su-log-entry ${log.success ? 'success' : 'error'}">
                ${log.success ? '✓' : '✗'} ${log.athlete.name}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      content = `
        <div class="su-sidebar">
          <div class="su-stats-grid">
            <div class="su-stat-card">
              <div class="su-stat-value">${state.following.length}</div>
              <div class="su-stat-label">Following</div>
            </div>
            <div class="su-stat-card">
              <div class="su-stat-value">${state.followers.length}</div>
              <div class="su-stat-label">Followers</div>
            </div>
            <div class="su-stat-card">
              <div class="su-stat-value" style="color: #dc3545;">${state.nonFollowers.length}</div>
              <div class="su-stat-label">Non-followers</div>
            </div>
            <div class="su-stat-card">
              <div class="su-stat-value" style="color: #28a745;">${state.whitelisted.size}</div>
              <div class="su-stat-label">Whitelisted</div>
            </div>
          </div>
          
          <div>
            <div class="su-section-title">Search</div>
            <input type="text" class="su-search" placeholder="Search by name or location..." value="${state.searchTerm}" oninput="window.stravaUnfollowers.setSearch(this.value)">
          </div>
          
          <div>
            <div class="su-section-title">Bulk Actions</div>
            <div class="su-bulk-actions">
              <button class="su-bulk-btn" onclick="window.stravaUnfollowers.selectAll()">Select All</button>
              <button class="su-bulk-btn" onclick="window.stravaUnfollowers.selectPage()">Select Page</button>
              <button class="su-bulk-btn" onclick="window.stravaUnfollowers.deselectAll()">Deselect All</button>
            </div>
          </div>
          
          ${state.selectedAthletes.size > 0 ? `
            <div>
              <button class="su-btn su-btn-danger" style="width: 100%;" onclick="window.stravaUnfollowers.startUnfollow()">
                🗑️ Unfollow Selected (${state.selectedAthletes.size})
              </button>
            </div>
          ` : ''}
          
          <div>
            <button class="su-btn su-btn-secondary" style="width: 100%;" onclick="window.stravaUnfollowers.startScan()">
              🔄 Rescan
            </button>
          </div>
          
          <div>
            <button class="su-btn su-btn-secondary" style="width: 100%;" onclick="window.stravaUnfollowers.openSettings()">
              ⚙️ Settings
            </button>
          </div>
        </div>
        
        <div class="su-content">
          <div class="su-tabs">
            <button class="su-tab ${state.currentTab === 'non_followers' ? 'active' : ''}" onclick="window.stravaUnfollowers.setTab('non_followers')">
              Non-Followers (${state.nonFollowers.filter(a => !state.whitelisted.has(a.id)).length})
            </button>
            <button class="su-tab ${state.currentTab === 'whitelisted' ? 'active' : ''}" onclick="window.stravaUnfollowers.setTab('whitelisted')">
              Whitelisted (${state.nonFollowers.filter(a => state.whitelisted.has(a.id)).length})
            </button>
            <button class="su-tab ${state.currentTab === 'all_following' ? 'active' : ''}" onclick="window.stravaUnfollowers.setTab('all_following')">
              All Following (${state.following.length})
            </button>
          </div>
          
          ${pageAthletes.length === 0 ? `
            <div class="su-empty">
              <div class="su-empty-icon">🎉</div>
              <h3 style="color: white;">No athletes found</h3>
              <p>${state.currentTab === 'non_followers' ? 'Everyone you follow, follows you back!' : 'No matching athletes'}</p>
            </div>
          ` : `
            <div class="su-grid">
              ${pageAthletes.map(renderAthleteCard).join('')}
            </div>
            
            ${totalPages > 1 ? `
              <div class="su-pagination">
                <button class="su-page-btn" ${state.page === 1 ? 'disabled' : ''} onclick="window.stravaUnfollowers.setPage(${state.page - 1})">← Prev</button>
                <span style="color: rgba(255,255,255,0.6); padding: 0.5rem 1rem;">Page ${state.page} of ${totalPages}</span>
                <button class="su-page-btn" ${state.page === totalPages ? 'disabled' : ''} onclick="window.stravaUnfollowers.setPage(${state.page + 1})">Next →</button>
              </div>
            ` : ''}
          `}
        </div>
      `;
    }
    
    overlay.innerHTML = `
      <div class="su-container">
        <div class="su-header">
          <div class="su-logo">
            <div class="su-logo-text">
              <span class="title">Strava Unfollowers</span>
              <span class="subtitle">Find non-followers</span>
            </div>
          </div>
          <div class="su-header-actions">
            <button class="su-close-btn" onclick="window.stravaUnfollowers.close()">×</button>
          </div>
        </div>
        <div class="su-main">
          ${content}
        </div>
      </div>
      ${state.toast ? `<div class="su-toast ${state.toast.type}">${state.toast.message}</div>` : ''}
      ${state.showSettings ? renderSettingsModal() : ''}
    `;
    
    // Add event listeners
    overlay.querySelectorAll('.su-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.su-whitelist-btn')) return;
        const id = card.dataset.id;
        toggleSelection(id);
      });
    });
    
    overlay.querySelectorAll('.su-whitelist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.whitelist;
        toggleWhitelist(id);
      });
    });
  }

  function renderSettingsModal() {
    return `
      <div class="su-settings-modal" onclick="if(event.target === this) window.stravaUnfollowers.closeSettings()">
        <div class="su-modal-content">
          <h2 class="su-modal-title">⚙️ Settings</h2>
          
          <div class="su-form-group">
            <label class="su-form-label">Delay between requests (ms)</label>
            <input type="number" class="su-form-input" value="${state.settings.delayBetweenRequests}" onchange="window.stravaUnfollowers.updateSetting('delayBetweenRequests', this.value)">
          </div>
          
          <div class="su-form-group">
            <label class="su-form-label">Delay after 5 requests (ms)</label>
            <input type="number" class="su-form-input" value="${state.settings.delayAfterFiveRequests}" onchange="window.stravaUnfollowers.updateSetting('delayAfterFiveRequests', this.value)">
          </div>
          
          <div class="su-form-group">
            <label class="su-form-label">Delay between unfollows (ms)</label>
            <input type="number" class="su-form-input" value="${state.settings.delayBetweenUnfollows}" onchange="window.stravaUnfollowers.updateSetting('delayBetweenUnfollows', this.value)">
          </div>
          
          <div class="su-form-group">
            <label class="su-form-label">Delay after 5 unfollows (ms)</label>
            <input type="number" class="su-form-input" value="${state.settings.delayAfterFiveUnfollows}" onchange="window.stravaUnfollowers.updateSetting('delayAfterFiveUnfollows', this.value)">
          </div>
          
          <p style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-top: 1rem;">
            ⚠️ Lower delays may trigger rate limiting from Strava. Use with caution.
          </p>
          
          <div class="su-modal-actions">
            <button class="su-btn su-btn-secondary" onclick="window.stravaUnfollowers.closeSettings()">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================
  function toggleSelection(id) {
    if (state.selectedAthletes.has(id)) {
      state.selectedAthletes.delete(id);
    } else {
      state.selectedAthletes.add(id);
    }
    render();
  }

  function toggleWhitelist(id) {
    if (state.whitelisted.has(id)) {
      state.whitelisted.delete(id);
    } else {
      state.whitelisted.add(id);
      state.selectedAthletes.delete(id);
    }
    saveWhitelist();
    render();
  }

  function selectAll() {
    const athletes = getFilteredAthletes();
    athletes.forEach(a => {
      if (!state.whitelisted.has(a.id)) {
        state.selectedAthletes.add(a.id);
      }
    });
    render();
  }

  function selectPage() {
    const athletes = getFilteredAthletes();
    const startIdx = (state.page - 1) * state.itemsPerPage;
    const pageAthletes = athletes.slice(startIdx, startIdx + state.itemsPerPage);
    pageAthletes.forEach(a => {
      if (!state.whitelisted.has(a.id)) {
        state.selectedAthletes.add(a.id);
      }
    });
    render();
  }

  function deselectAll() {
    state.selectedAthletes.clear();
    render();
  }

  function setTab(tab) {
    state.currentTab = tab;
    state.page = 1;
    state.selectedAthletes.clear();
    render();
  }

  function setSearch(term) {
    state.searchTerm = term;
    state.page = 1;
    render();
  }

  function setPage(page) {
    state.page = page;
    render();
  }

  function openSettings() {
    state.showSettings = true;
    render();
  }

  function closeSettings() {
    state.showSettings = false;
    render();
  }

  function updateSetting(key, value) {
    state.settings[key] = parseInt(value, 10);
    saveSettings();
  }

  function close() {
    const overlay = document.querySelector('.su-overlay');
    if (overlay) overlay.remove();
  }

  // ============================================
  // PUBLIC API
  // ============================================
  window.stravaUnfollowers = {
    startScan,
    startUnfollow,
    selectAll,
    selectPage,
    deselectAll,
    setTab,
    setSearch,
    setPage,
    openSettings,
    closeSettings,
    updateSetting,
    close
  };

  // Initialize
  render();
  console.log('🚀 Strava Unfollowers loaded! The UI should now be visible.');

})();
