import { DataService } from './dataService.js';

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
        
        try {
            const users = await DataService.getUsers();
            // Check if user exists with matching email, password, AND type
            const user = users.find(u => 
                u.email === email && 
                u.password === password && 
                u.type === userType
            );
            
            if (user) {
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect based on user type
                if (user.type === 'lawyer') {
                    window.location.href = 'lawyer-dashboard.html';
                } else {
                    window.location.href = 'client-dashboard.html';
                }
            } else {
                alert('Invalid credentials. Please check your email, password, and user type.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
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
        
        try {
            const users = await DataService.getUsers();
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                alert('This email is already registered. Please use a different email.');
                return;
            }
            
            // Create new user object
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                type: userType
            };
            
            // Add lawyer-specific fields if registering as a lawyer
            if (userType === 'lawyer') {
                newUser.specialization = document.getElementById('specialization').value;
                newUser.location = document.getElementById('location').value;
            }
            
            // Save new user
            const success = await DataService.addUser(newUser);
            
            if (success) {
                alert('Registration successful! Please login with your credentials.');
                // Switch to login tab
                document.querySelector('.tab[data-tab="login"]').click();
                // Clear registration form
                registerForm.reset();
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });
}); 