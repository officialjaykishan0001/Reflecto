const apiUrl = 'https://reflecto-jnv1.onrender.com/api/journals'; // Journals API endpoint
const userApiUrl = 'https://reflecto-jnv1.onrender.com/api/users'; // Users API endpoint

// Check if token is available in cookies
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const token = getCookie('token');
if (!token) {
    alert('Please log in to access the dashboard.');
    window.location.href = 'login.html';
}

// Fetch and display user's name
const fetchUserName = async () => {
    try {
        const res = await fetch(`${userApiUrl}/me`, {
            credentials: 'include', // Send cookies with the request
        });

        if (res.ok) {
            const user = await res.json();
            document.querySelector('.font-medium').textContent = `Hi, ${user.username}`;
        } else {
            alert('Failed to fetch user information.');
        }
    } catch (err) {
        console.error('Error fetching user information:', err);
    }
};

// Format date for display
const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options); // Adjust locale as needed
};

// Fetch and display journal entries
const fetchJournals = async () => {
    try {
        const res = await fetch(`${apiUrl}/get`, {
            credentials: 'include', // Send cookies with the request
        });

        if (res.ok) {
            const journals = await res.json();
            const journalContainer = document.getElementById('journal-container');
            journalContainer.innerHTML = journals
                .map(
                    (journal) => `
                <div class="min-h-[150px] w-[45%] bg-[#FEE2E2] p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-bold">${journal.title}</h3>
                    <p class="text-sm mt-2">${journal.content}</p>
                    <p class="text-gray-500 text-sm mt-2">${formatDate(journal.createdAt)}</p>
                    <button onclick="deleteJournal('${journal._id}')" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2">
                        Delete
                    </button>
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
        const res = await fetch(`${apiUrl}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Send cookies with the request
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
            credentials: 'include', // Send cookies with the request
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
const logout = async () => {
    try {
        const res = await fetch(`${userApiUrl}/logout`, {
            method: 'POST',
            credentials: 'include', // Send cookies with the request
        });

        if (res.ok) {
            alert('Logged out successfully.');
            window.location.href = 'login.html';
        } else {
            alert('Error logging out.');
        }
    } catch (err) {
        console.error('Error during logout:', err);
    }
};

// Event Listeners
document.getElementById('journal-form').addEventListener('submit', addJournal);
document.querySelector('.material-symbols-outlined').addEventListener('click', logout);

// Fetch user name and journals on load
window.onload = () => {
    fetchUserName();
    fetchJournals();
};
