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
    const cases = JSON.parse(localStorage.getItem('cases')) || [];
    const currentCase = cases.find(c => c.id === caseId);
    
    if (!currentCase) {
        alert('Case not found');
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
    
    // Set minimum date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('appointment-date').min = formattedDate;
    
    // Schedule appointment form submission
    const scheduleForm = document.getElementById('schedule-form');
    scheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const appointmentData = {
            id: Date.now().toString(),
            caseId: currentCase.id,
            caseTitle: currentCase.title,
            clientId: currentCase.clientId,
            clientName: currentCase.clientName,
            lawyerId: currentUser.id,
            lawyerName: currentUser.name,
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            meetingType: document.getElementById('meeting-type').value,
            details: document.getElementById('meeting-details').value,
            createdAt: new Date().toISOString()
        };
        
        // Save appointment
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointmentData);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        // Update case status
        const caseIndex = cases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            cases[caseIndex].status = 'scheduled';
            cases[caseIndex].appointmentId = appointmentData.id;
            localStorage.setItem('cases', JSON.stringify(cases));
        }
        
        alert('Appointment scheduled successfully!');
        
        // Clear scheduling case ID and redirect to dashboard
        localStorage.removeItem('schedulingCaseId');
        redirectToDashboard();
    });
    
    function redirectToDashboard() {
        if (currentUser.type === 'lawyer') {
            window.location.href = 'lawyer-dashboard.html';
        } else {
            window.location.href = 'client-dashboard.html';
        }
    }
}); 