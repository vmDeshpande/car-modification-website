document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('modificationForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const customerName = document.getElementById('customerName').value;
        const customerPhoneNumber = document.getElementById('customerPhoneNumber').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const carModel = document.getElementById('carModel').value;
        const carNumber = document.getElementById('carNumber').value;
        const modifications = document.getElementById('modifications').value;

        const formData = {
            customerName,
            customerPhoneNumber,
            customerEmail,
            carModel,
            carNumber,
            modifications,
        };

        try {
            const response = await fetch('/api/submit-modification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Car modification submitted successfully.');
            } else {
                console.error('Failed to submit car modification.');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            form.reset();
        }
    });
});
