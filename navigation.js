// Add this to ALL HTML files before closing </body> tag
document.addEventListener('DOMContentLoaded', function() {
    // Create global navigation
    const navHTML = `
    <div class="global-nav">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">
                <i class="fas fa-pills"></i> Smart Medicine Box
            </a>
            <div class="nav-links">
                <a href="home.html">Home</a>
                <a href="login.html">Login</a>
                <a href="main.html">Dashboard</a>
            </div>
        </div>
    </div>
    `;
    
    // Insert at top of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Add CSS
    const style = document.createElement('style');
    style.textContent = `
        .global-nav {
            background: #2E86AB;
            padding: 10px 15px;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-logo {
            color: white;
            font-weight: bold;
            font-size: 1.3rem;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .nav-links {
            display: flex;
            gap: 25px;
        }
        .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            padding: 5px 0;
            position: relative;
        }
        .nav-links a:hover {
            opacity: 0.8;
        }
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: white;
            transition: width 0.3s ease;
        }
        .nav-links a:hover::after {
            width: 100%;
        }
        body { 
            padding-top: 70px;
        }
    `;
    document.head.appendChild(style);
});