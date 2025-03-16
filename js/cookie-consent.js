// Cookie Consent Banner Implementation

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already consented
    if (!localStorage.getItem('cookieConsent')) {
        // Create cookie consent banner
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <p>We use cookies and analytics to improve your experience and to understand how our site is used. 
                   By continuing to use this site, you consent to this use as described in our 
                   <a href="privacy-policy.html">Privacy Policy</a>.</p>
                <div class="cookie-consent-buttons">
                    <button id="cookie-accept">Accept</button>
                    <button id="cookie-decline">Decline</button>
                </div>
            </div>
        `;
        
        // Add styles for the banner
        const style = document.createElement('style');
        style.textContent = `
            .cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(20, 20, 40, 0.95);
                color: #e0e0ff;
                padding: 15px;
                z-index: 1000;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(5px);
                border-top: 1px solid rgba(123, 104, 238, 0.3);
            }
            
            .cookie-consent-content {
                max-width: 800px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .cookie-consent-content p {
                margin-bottom: 15px;
            }
            
            .cookie-consent-content a {
                color: #64ffda;
                text-decoration: none;
            }
            
            .cookie-consent-content a:hover {
                text-decoration: underline;
            }
            
            .cookie-consent-buttons {
                display: flex;
                gap: 10px;
            }
            
            .cookie-consent-buttons button {
                padding: 8px 16px;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-family: 'Exo 2', sans-serif;
                transition: all 0.3s ease;
            }
            
            #cookie-accept {
                background-color: #64ffda;
                color: #0a0a1a;
            }
            
            #cookie-decline {
                background-color: transparent;
                color: #e0e0ff;
                border: 1px solid #64ffda;
            }
            
            #cookie-accept:hover {
                background-color: #7b68ee;
                color: #e0e0ff;
            }
            
            #cookie-decline:hover {
                background-color: rgba(123, 104, 238, 0.2);
            }
        `;
        
        // Add banner and styles to the document
        document.head.appendChild(style);
        document.body.appendChild(banner);
        
        // Add event listeners for buttons
        document.getElementById('cookie-accept').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.style.display = 'none';
            
            // Enable Mixpanel tracking
            if (typeof mixpanel !== 'undefined') {
                mixpanel.opt_in_tracking();
                // Track consent event
                mixpanel.track('Cookie Consent', { 'consent': 'accepted' });
            }
        });
        
        document.getElementById('cookie-decline').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            banner.style.display = 'none';
            
            // Disable Mixpanel tracking
            if (typeof mixpanel !== 'undefined') {
                mixpanel.opt_out_tracking();
                // We don't track the decline event to respect the user's choice
            }
        });
    } else if (localStorage.getItem('cookieConsent') === 'accepted') {
        // If user has previously accepted, enable tracking
        if (typeof mixpanel !== 'undefined') {
            mixpanel.opt_in_tracking();
        }
    } else {
        // If user has previously declined, disable tracking
        if (typeof mixpanel !== 'undefined') {
            mixpanel.opt_out_tracking();
        }
    }
}); 