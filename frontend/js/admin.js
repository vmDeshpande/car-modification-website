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
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: `Authentication failed. Please check your credentials.`,
              })
        }
    } catch (error) {
        console.error('Error during login:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: `An error occurred during login. Please try again. ${error}`,
            confirmButtonText: 'OK',
          })
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
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card mb-3';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    cardBody.innerHTML = `
        <h5 class="card-title">Customer Name: <strong>${modification.customerName}</strong></h5>
        <p class="card-text"><i class="fas fa-phone-alt"></i> Customer Number: <strong>${modification.customerPhoneNumber}</strong></p>
        <p class="card-text"><i class="fas fa-envelope"></i> Customer Email: <strong>${modification.customerEmail}</strong></p>
        <p class="card-text"><i class="fas fa-car"></i> Customer Car Model: <strong>${modification.carModel}</strong></p>
        <p class="card-text"><i class="fas fa-car-side"></i> Customer Car Number: <strong>${modification.carNumber}</strong></p>
        <p class="card-text"><i class="fas fa-lightbulb"></i> Suggestions Customer liked: <strong>${modification.suggestions}</strong></p>
        <p class="card-text"><i class="fas fa-tools"></i> Modification: <strong>${modification.modifications}</strong></p>
    `;

    cardContainer.appendChild(cardBody);

    return cardContainer;
}

function hideLoginForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
}
