document.addEventListener('DOMContentLoaded', async function () {

});

async function attemptLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/check-authentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            hideLoginForm();
            fetchAndDisplayModifications();
        } else {
            alert('Authentication failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
}

async function fetchAndDisplayModifications() {
    try {
        const response = await fetch('/api/get-modifications');
        const modifications = await response.json();

        console.log('Modifications data:', modifications);

        const modificationsList = document.getElementById('adminContent');

        if (modificationsList) {
            modificationsList.innerHTML = '';

            modifications.forEach(modification => {
                const modificationDiv = createModificationDiv(modification);
                modificationsList.appendChild(modificationDiv);
            });
        }
    } catch (error) {
        console.error('Error fetching modifications:', error);
    }
}

function createModificationDiv(modification) {
    const modificationDiv = document.createElement('tr');
    modificationDiv.innerHTML = `
        <td>${modification.customerName}</td>
        <td>${modification.customerPhoneNumber}</td>
        <td>${modification.customerEmail}</td>
        <td>${modification.carModel}</td>
        <td>${modification.carNumber}</td>
        <td>${modification.modifications}</td>
    `;
    return modificationDiv;
}



function hideLoginForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
}
