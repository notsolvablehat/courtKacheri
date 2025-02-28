class DataService {
    static async getData() {
        try {
            const response = await fetch('data.json');
            return await response.json();
        } catch (error) {
            console.error('Error reading data:', error);
            return { users: [], cases: [], appointments: [] };
        }
    }

    static async saveData(data) {
        try {
            // In a real application, this would be a POST request to your backend
            // For GitHub, we'll need to use the GitHub API
            const token = 'YOUR_GITHUB_TOKEN'; // You'll need to create this
            const owner = 'YOUR_GITHUB_USERNAME';
            const repo = 'YOUR_REPO_NAME';
            const path = 'data.json';

            // Get the current file's SHA
            const currentFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const fileInfo = await currentFile.json();

            // Update the file
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: 'Update data.json',
                    content: btoa(JSON.stringify(data, null, 2)),
                    sha: fileInfo.sha
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }

            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    static async getUsers() {
        const data = await this.getData();
        return data.users || [];
    }

    static async getCases() {
        const data = await this.getData();
        return data.cases || [];
    }

    static async getAppointments() {
        const data = await this.getData();
        return data.appointments || [];
    }

    static async addUser(user) {
        const data = await this.getData();
        data.users.push(user);
        return await this.saveData(data);
    }

    static async addCase(caseData) {
        const data = await this.getData();
        data.cases.push(caseData);
        return await this.saveData(data);
    }

    static async updateCase(caseId, updates) {
        const data = await this.getData();
        const caseIndex = data.cases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            data.cases[caseIndex] = { ...data.cases[caseIndex], ...updates };
            return await this.saveData(data);
        }
        return false;
    }

    static async addAppointment(appointment) {
        const data = await this.getData();
        data.appointments.push(appointment);
        return await this.saveData(data);
    }
} 