document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.type !== 'lawyer') {
        window.location.href = 'index.html';
        return;
    }
    
    // Set user name
    document.getElementById('user-name').textContent = currentUser.name;
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Navigation
    const menuItems = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            
            // Update active menu item
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === target) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Load cases and appointments
    loadNewCases();
    loadAcceptedCases();
    loadAppointments();
    
    function loadNewCases() {
        const casesList = document.getElementById('new-cases-list');
        const cases = JSON.parse(localStorage.getItem('cases')) || [];
        
        // Filter pending cases matching lawyer's specialization
        const pendingCases = cases.filter(c => 
            c.status === 'pending' && c.type === currentUser.specialization
        );
        
        // Update notification count
        document.getElementById('notification-count').textContent = pendingCases.length;
        
        if (pendingCases.length === 0) {
            casesList.innerHTML = '<p>No new case requests available.</p>';
            return;
        }
        
        casesList.innerHTML = '';
        pendingCases.forEach(caseItem => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <h3>${caseItem.title}</h3>
                <div class="card-info">
                    <p><strong>Client:</strong> ${caseItem.clientName}</p>
                    <p><strong>Type:</strong> ${caseItem.type}</p>
                    <p><strong>Preferred Date:</strong> ${caseItem.preferredDate}</p>
                    <p><strong>Description:</strong> ${caseItem.description.substring(0, 100)}...</p>
                </div>
                <div class="card-actions">
                    <button class="btn success accept-case" data-id="${caseItem.id}">Accept Case</button>
                </div>
            `;
            casesList.appendChild(card);
        });
        
        // Add event listeners to accept buttons
        document.querySelectorAll('.accept-case').forEach(button => {
            button.addEventListener('click', function() {
                const caseId = this.dataset.id;
                acceptCase(caseId);
            });
        });
    }
    
    function acceptCase(caseId) {
        const cases = JSON.parse(localStorage.getItem('cases')) || [];
        const caseIndex = cases.findIndex(c => c.id === caseId);
        
        if (caseIndex !== -1) {
            // Update case status
            cases[caseIndex].status = 'accepted';
            cases[caseIndex].lawyerId = currentUser.id;
            cases[caseIndex].lawyerName = currentUser.name;
            
            localStorage.setItem('cases', JSON.stringify(cases));
            
            alert('Case accepted! Please schedule an appointment with the client.');
            
            // Store case ID for scheduling
            localStorage.setItem('schedulingCaseId', caseId);
            
            // Redirect to scheduling page
            window.location.href = 'scheduling.html';
        }
    }
    
    function loadAcceptedCases() {
        const casesList = document.getElementById('accepted-cases-list');
        const cases = JSON.parse(localStorage.getItem('cases')) || [];
        
        // Filter cases accepted by current lawyer
        const acceptedCases = cases.filter(c => 
            (c.status === 'accepted' || c.status === 'scheduled') && c.lawyerId === currentUser.id
        );
        
        if (acceptedCases.length === 0) {
            casesList.innerHTML = '<p>You have not accepted any cases yet.</p>';
            return;
        }
        
        casesList.innerHTML = '';
        acceptedCases.forEach(caseItem => {
            const card = document.createElement('div');
            card.className = 'card';
            
            let statusText = caseItem.status;
            let scheduleButton = '';
            
            if (caseItem.status === 'accepted') {
                scheduleButton = `<button class="btn primary schedule-case" data-id="${caseItem.id}">Schedule Appointment</button>`;
            }
            
            card.innerHTML = `
                <h3>${caseItem.title}</h3>
                <div class="card-info">
                    <p><strong>Client:</strong> ${caseItem.clientName}</p>
                    <p><strong>Type:</strong> ${caseItem.type}</p>
                    <p><strong>Status:</strong> ${statusText}</p>
                </div>
                <div class="card-actions">
                    ${scheduleButton}
                </div>
            `;
            casesList.appendChild(card);
        });
        
        // Add event listeners to schedule buttons
        document.querySelectorAll('.schedule-case').forEach(button => {
            button.addEventListener('click', function() {
                const caseId = this.dataset.id;
                localStorage.setItem('schedulingCaseId', caseId);
                window.location.href = 'scheduling.html';
            });
        });
    }
    
    function loadAppointments() {
        const appointmentsList = document.getElementById('appointments-list');
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        // Filter appointments for current lawyer
        const lawyerAppointments = appointments.filter(a => a.lawyerId === currentUser.id);
        
        if (lawyerAppointments.length === 0) {
            appointmentsList.innerHTML = '<p>You have no scheduled appointments.</p>';
            return;
        }
        
        appointmentsList.innerHTML = '';
        lawyerAppointments.forEach(appointment => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <h3>Appointment: ${appointment.caseTitle}</h3>
                <div class="card-info">
                    <p><strong>Client:</strong> ${appointment.clientName}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${appointment.time}</p>
                    <p><strong>Meeting Type:</strong> ${appointment.meetingType}</p>
                </div>
            `;
            appointmentsList.appendChild(card);
        });
    }
}); 