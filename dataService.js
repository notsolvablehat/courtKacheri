export async function readData() {
    try {
        const response = await fetch('https://courtkacheri.onrender.com/data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error reading data:', error);
        throw error;
    }
}

export async function writeData(data) {
    try {
        const response = await fetch('https://courtkacheri.onrender.com/data.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error writing data:', error);
        throw error;
    }
}

export class DataService {
    static async getData() {
        try {
            const response = await fetch('https://courtkacheri.onrender.com/data.json');
            return await response.json();
        } catch (error) {
            console.error('Error reading data:', error);
            return { users: [], cases: [], appointments: [] };
        }
    }

    static async saveData(data) {
        try {
            const response = await fetch('https://courtkacheri.onrender.com/data.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
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