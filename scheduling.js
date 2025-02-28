// Import dataService functions
import { DataService } from './dataService.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Get case ID from localStorage
    const caseId = localStorage.getItem('schedulingCaseId');
    if (!caseId) {
        alert('No case selected for scheduling');
        redirectToDashboard();
        return;
    }
    
    // Back button functionality
    document.getElementById('back-btn').addEventListener('click', redirectToDashboard);
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Load case details
    async function loadCaseDetails() {
        try {
            const data = await DataService.getData();
            const currentCase = data.cases.find(c => c.id === caseId);
            
            if (!currentCase) {
                alert('Case not found');
                redirectToDashboard();
                return;
            }
            
            // Check if case already has an appointment
            const existingAppointment = data.appointments.find(a => a.caseId === caseId);
            if (existingAppointment) {
                alert('An appointment already exists for this case!');
                redirectToDashboard();
                return;
            }

            // Display case details
            const caseDetailsElement = document.getElementById('case-details');
            caseDetailsElement.innerHTML = `
                <h3>${currentCase.title}</h3>
                <p><strong>Client:</strong> ${currentCase.clientName}</p>
                <p><strong>Type:</strong> ${currentCase.type}</p>
                <p><strong>Description:</strong> ${currentCase.description}</p>
                <p><strong>Client's Preferred Date:</strong> ${currentCase.preferredDate}</p>
            `;

            return currentCase;
        } catch (error) {
            console.error('Error loading case details:', error);
            alert('Error loading case details');
            redirectToDashboard();
        }
    }

    // Set minimum date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('appointment-date').min = formattedDate;
    
    // Schedule appointment form submission
    const scheduleForm = document.getElementById('schedule-form');
    scheduleForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const data = await DataService.getData();
            const currentCase = data.cases.find(c => c.id === caseId);
            
            // Create new appointment object
            const newAppointment = {
                id: `apt-${Date.now()}`,
                caseId: caseId,
                date: document.getElementById('appointment-date').value,
                time: document.getElementById('appointment-time').value,
                meetingType: document.getElementById('meeting-type').value,
                details: document.getElementById('meeting-details').value,
                clientId: currentCase.clientId,
                lawyerId: currentUser.id,
                status: "scheduled",
                createdAt: new Date().toISOString()
            };
            
            // Update case status
            const caseIndex = data.cases.findIndex(c => c.id === caseId);
            if (caseIndex !== -1) {
                data.cases[caseIndex].status = 'scheduled';
                data.cases[caseIndex].appointmentId = newAppointment.id;
            }
            
            // Add new appointment
            data.appointments.push(newAppointment);
            
            // Save updated data
            const success = await DataService.saveData(data);
            
            if (success) {
                alert('Appointment scheduled successfully!');
                localStorage.removeItem('schedulingCaseId');
                redirectToDashboard();
            } else {
                throw new Error('Failed to save appointment');
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            alert('Failed to schedule appointment. Please try again.');
        }
    });
    
    function redirectToDashboard() {
        if (currentUser.type === 'lawyer') {
            window.location.href = 'lawyer-dashboard.html';
        } else {
            window.location.href = 'client-dashboard.html';
        }
    }

    // Load case details when page loads
    loadCaseDetails();
});

// Helper function to get case ID from URL
function getCaseIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('caseId');
}

// Helper function to get current user ID from session/localStorage
function getCurrentUserId() {
    // Implement based on your authentication system
    return localStorage.getItem('currentUserId');
}

// Helper function to get lawyer ID (might come from URL or case details)
function getLawyerId() {
    // Implement based on your system's logic
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lawyerId');
} 