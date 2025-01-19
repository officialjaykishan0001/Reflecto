const apiUrl = 'https://reflecto-jnv1.onrender.com/api/journals'; // Journals API endpoint
const userApiUrl = 'https://reflecto-jnv1.onrender.com/api/users'; // Users API endpoint
const token = localStorage.getItem('token'); // JWT token stored after login

if (!token) {
    alert('Please log in to access the dashboard.');
    window.location.href = 'login.html';
}

// Fetch and display user's name
const fetchUserName = async () => {
    try {
        const res = await fetch(`${userApiUrl}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const user = await res.json();
            document.getElementById('user-name').textContent = `Welcome, ${user.username}`;
        } else {
            alert('Failed to fetch user information.');
        }
    } catch (err) {
        console.error('Error fetching user information:', err);
    }
};
// Format date to display in a readable format
const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options); // Adjust locale as needed
};

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
                        <p class="text-gray-500 text-sm mt-2">${formatDate(journal.createdAt)}</p> <!-- Date, Time, and Day -->
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

// Fetch user name and journals on load
window.onload = () => {
    fetchUserName();
    fetchJournals();
};
