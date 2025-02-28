document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Toggle lawyer-specific fields
    const registerType = document.getElementById('register-type');
    const lawyerFields = document.querySelectorAll('.lawyer-fields');
    
    registerType.addEventListener('change', function() {
        const isLawyer = this.value === 'lawyer';
        lawyerFields.forEach(field => {
            field.style.display = isLawyer ? 'block' : 'none';
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const userType = document.getElementById('login-type').value;
        
        const users = await DataService.getUsers();
        const user = users.find(u => u.email === email && u.password === password && u.type === userType);
        
        if (user) {
            // Store only user ID in sessionStorage instead of localStorage
            sessionStorage.setItem('currentUserId', user.id);
            
            if (userType === 'client') {
                window.location.href = 'client-dashboard.html';
            } else {
                window.location.href = 'lawyer-dashboard.html';
            }
        } else {
            alert('Invalid credentials or user not found');
        }
    });
    
    // Registration form submission
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const userType = document.getElementById('register-type').value;
        
        const users = await DataService.getUsers();
        
        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return;
        }
        
        const user = {
            id: Date.now().toString(),
            name,
            email,
            password,
            type: userType
        };
        
        if (userType === 'lawyer') {
            user.specialization = document.getElementById('specialization').value;
            user.location = document.getElementById('location').value;
        }
        
        const success = await DataService.addUser(user);
        
        if (success) {
            alert('Registration successful! You can now login.');
            document.querySelector('.tab[data-tab="login"]').click();
        } else {
            alert('Registration failed. Please try again.');
        }
    });
}); 