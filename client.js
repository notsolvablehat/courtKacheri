document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.type !== 'client') {
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
    loadCases();
    loadAppointments();
    
    // Case submission
    const caseForm = document.getElementById('case-form');
    caseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const caseData = {
            id: Date.now().toString(),
            title: document.getElementById('case-title').value,
            type: document.getElementById('case-type').value,
            description: document.getElementById('case-description').value,
            preferredDate: document.getElementById('preferred-date').value,
            clientId: currentUser.id,
            clientName: currentUser.name,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        const cases = JSON.parse(localStorage.getItem('cases')) || [];
        cases.push(caseData);
        localStorage.setItem('cases', JSON.stringify(cases));
        
        alert('Case submitted successfully! Lawyers will be notified.');
        caseForm.reset();
        
        // Refresh cases list
        loadCases();
    });
    
    function loadCases() {
        const casesList = document.getElementById('cases-list');
        const cases = JSON.parse(localStorage.getItem('cases')) || [];
        
        // Filter cases for current user
        const userCases = cases.filter(c => c.clientId === currentUser.id);
        
        if (userCases.length === 0) {
            casesList.innerHTML = '<p>You have not submitted any cases yet.</p>';
            return;
        }
        
        casesList.innerHTML = '';
        userCases.forEach(caseItem => {
            const card = document.createElement('div');
            card.className = 'card';
            
            let statusClass = '';
            switch(caseItem.status) {
                case 'pending':
                    statusClass = 'text-warning';
                    break;
                case 'accepted':
                    statusClass = 'text-success';
                    break;
                case 'scheduled':
                    statusClass = 'text-primary';
                    break;
            }
            
            card.innerHTML = `
                <h3>${caseItem.title}</h3>
                <div class="card-info">
                    <p><strong>Type:</strong> ${caseItem.type}</p>
                    <p><strong>Status:</strong> <span class="${statusClass}">${caseItem.status}</span></p>
                    <p><strong>Submitted:</strong> ${new Date(caseItem.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="card-actions">
                    <button class="btn primary view-case" data-id="${caseItem.id}">View Details</button>
                </div>
            `;
            casesList.appendChild(card);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-case').forEach(button => {
            button.addEventListener('click', function() {
                const caseId = this.dataset.id;
                const caseItem = userCases.find(c => c.id === caseId);
                
                alert(`
                    Case: ${caseItem.title}
                    Type: ${caseItem.type}
                    Description: ${caseItem.description}
                    Status: ${caseItem.status}
                    ${caseItem.lawyerId ? 'Lawyer: ' + caseItem.lawyerName : ''}
                `);
            });
        });
    }
    
    function loadAppointments() {
        const appointmentsList = document.getElementById('appointments-list');
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        // Filter appointments for current user
        const userAppointments = appointments.filter(a => a.clientId === currentUser.id);
        
        if (userAppointments.length === 0) {
            appointmentsList.innerHTML = '<p>You have no upcoming appointments.</p>';
            return;
        }
        
        appointmentsList.innerHTML = '';
        userAppointments.forEach(appointment => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <h3>Appointment: ${appointment.caseTitle}</h3>
                <div class="card-info">
                    <p><strong>Lawyer:</strong> ${appointment.lawyerName}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${appointment.time}</p>
                    <p><strong>Meeting Type:</strong> ${appointment.meetingType}</p>
                </div>
            `;
            appointmentsList.appendChild(card);
        });
    }
}); 