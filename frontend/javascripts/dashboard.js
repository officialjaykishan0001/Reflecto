const apiUrl = 'http://localhost:5000/api/journals'; // Replace with your backend URL
const token = localStorage.getItem('token'); // Assume JWT token is stored after login

if (!token) {
    alert('Please log in to access the dashboard.');
    window.location.href = 'login.html';
}

// Fetch and display journal entries
const fetchJournals = async () => {
    try {
        const res = await fetch(apiUrl + '/get', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const journals = await res.json();

            const journalEntries = document.getElementById('journal-entries');
            journalEntries.innerHTML = journals
                .map(
                    (journal) => `
                    <div class="bg-white p-4 rounded shadow-md">
                        <h3 class="text-xl font-bold">${journal.title}</h3>
                        <p class="text-gray-700 mt-2">${journal.content}</p>
                        <div class="flex justify-end space-x-2 mt-4">
                            <button onclick="deleteJournal('${journal._id}')" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                `
                )
                .join('');
        } else {
            alert('Failed to fetch journal entries.');
        }
    } catch (err) {
        console.error('Error fetching journals:', err);
    }
};

// Add a new journal entry
const addJournal = async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        const res = await fetch(apiUrl + '/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
            document.getElementById('journal-form').reset();
            fetchJournals(); // Refresh entries
        } else {
            const error = await res.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error('Error adding journal:', err);
    }
};

// Delete a journal entry
const deleteJournal = async (id) => {
    try {
        const res = await fetch(`${apiUrl}/delete/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            fetchJournals(); // Refresh entries
        } else {
            const error = await res.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error('Error deleting journal:', err);
    }
};

// Log out user
const logout = () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
};

// Event Listeners
document.getElementById('journal-form').addEventListener('submit', addJournal);
document.getElementById('logout-btn').addEventListener('click', logout);
window.onload = fetchJournals;
