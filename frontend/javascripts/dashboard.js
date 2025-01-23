const apiUrl = 'https://reflecto-jnv1.onrender.com/api/journals'; // Journals API endpoint
const userApiUrl = 'https://reflecto-jnv1.onrender.com/api/users'; // Users API endpoint
const token = localStorage.getItem('token'); // JWT token stored after login
const alert = document.getElementById('alert');

if (!token) {
    alert('Please log in to access the dashboard.');
    window.location.href = 'login.html';
}

// Generate Alert function
const generateAlert = (alertType, alertMessage) => {
    alert.style.display = '';
    if(alertType === 'alert-danger'){
        alert.classList.replace('alert-success', alertType);
    }else{
        alert.classList.replace('alert-danger', alertType);
    }
    alert.innerHTML = alertMessage;
}

// Fetch and display user's name
const fetchUserName = async () => {
    try {
        const res = await fetch(`${userApiUrl}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const user = await res.json();
            document.getElementById('user-name').textContent = `Hi, ${user.username}`;
            document.getElementById('hamburger-content-user-name').textContent = `${user.username}`;

        } else {
            generateAlert('alert-danger', 'Failed to fetch user information.')
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
                    <div class="journal-card min-h-[150px] bg-[#DBEAFE] p-4 rounded-lg shadow-md" data-id="${journal._id}">
                  <h3 class="text-lg font-bold">${journal.title}</h3>
                  <p class="text-sm mt-2">${journal.content}</p>
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
            document.getElementById('title').value = "";
            document.getElementById('content').value = "";
            document.getElementById('journal-edit-workplace').classList.add('hidden');
            fetchJournals(); // Refresh entries
        } else {
            const error = await res.json();
            generateAlert('alert-danger', error.message)
        }
    } catch (err) {
        console.error('Error adding journal:', err);
        generateAlert('alert-danger', 'Error Adding Journal.')
    }
};

// Function to update a journal
const updateJournal = async (journalId, updatedData) => {
    try {
        // API endpoint for updating a journal
        const res = await fetch(`${apiUrl}/update/${journalId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData), // Updated journal data
        });

        if (res.ok) {
            generateAlert('alert-success', 'Journal Updated successfully!')
            fetchJournals(); // Refresh entries
        } else {
            const error = await res.json();
            generateAlert('alert-danger', error.message)
        }

    } catch (error) {
        console.error("Error updating journal:", error);
        generateAlert('alert-danger','Failed to update the journal. Please try again.' )
    }
}

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
            generateAlert('alert-danger', error.message);
        }
    } catch (err) {
        console.error('Error deleting journal:', err);
    }
};

// Variable Declaration
const cardContainer = document.getElementById('journal-entries');
const updateTitle = document.getElementById('title');
const updateContent = document.getElementById('content');
const cancelUpdate = document.getElementById('back-button');
const deleteBtn = document.getElementById('delete-btn');


// Log out user
// const logout = () => {
//     localStorage.removeItem('token');
//     window.location.href = 'login.html';
// };

// Event Listeners
// document.getElementById('journal-form').addEventListener('submit', addJournal);
// document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById("save-journal-btn").addEventListener('click', addJournal);

// Event Listener for update journal
document.getElementById("update-journal-btn").addEventListener("click", () => {
    const title = updateTitle.value;
    const content = updateContent.value;
    updateJournal(document.getElementById('journal-edit-workplace').dataset.cardId, { title, content })
})

// Cancel Update Action
cancelUpdate.addEventListener('click', () => {
    // Hide the update section and clear inputs
    updateTitle.value = '';
    updateContent.value = '';
    document.getElementById('journal-edit-workplace').dataset.cardId = '';//remove the id 
    document.getElementById("journal-edit-workplace").classList.add('hidden');
    document.getElementById("save-journal-btn").classList.remove('hidden');
    document.getElementById("update-journal-btn").classList.add('hidden');

});

// Event Listener for Delete Journal
deleteBtn.addEventListener("click", () => {
    if (journalEditWorkplace.dataset.cardId != '') {
        deleteJournal(journalEditWorkplace.dataset.cardId)
        // Hide the update section and clear inputs
        updateTitle.value = '';
        updateContent.value = '';
        document.getElementById('journal-edit-workplace').dataset.cardId = '';//remove the id 
        document.getElementById("journal-edit-workplace").classList.add('hidden');

    } else {
        alert("No Journal found!")
    }
})

// Event Listener for Cards
cardContainer.addEventListener('click', (event) => {

    const card = event.target.closest('.journal-card');
    if (!card) return; // Ensure a card was clicked

    // Extract card details
    const id = card.getAttribute('data-id');
    const title = card.getElementsByTagName('h3')[0].innerHTML;
    const content = card.getElementsByTagName('p')[0].innerHTML;

    // Populate the update section
    updateTitle.value = title;
    updateContent.value = content;

    // Show and scroll to the update section
    document.getElementById("journal-edit-workplace").classList.remove('hidden');
    // updateSection.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('update-journal-btn').classList.remove('hidden');
    document.getElementById('save-journal-btn').classList.add('hidden')

    // Optional: Store the ID for update/delete operations
    document.getElementById('journal-edit-workplace').dataset.cardId = id;
});


// Fetch user name and journals on load
window.onload = () => {
    fetchUserName();
    fetchJournals();
};

// document.getElementById("alert").classList.contains(ss
if (alert.style.display === '') {

    setInterval(() => {
        alert.style.display = 'none';
    }, 2000);
}








