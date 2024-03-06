document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('modificationForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const customerName = document.getElementById('customerName').value;
        const customerPhoneNumber = document.getElementById('customerPhoneNumber').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const carModel = document.getElementById('carModel').value;
        const carModelOptions = document.getElementById('carModelOptions').value;
        const carNumber = document.getElementById('carNumber').value;
        const suggestions = document.getElementById('suggestions').value;
        const modifications = document.getElementById('modifications').value;
        let carModeltext;
        if(carModelOptions === 'Other') {
            carModeltext = carModel
        } else {
            carModeltext = carModelOptions
        }

        const formData = {
            customerName,
            customerPhoneNumber,
            customerEmail,
            carModeltext,
            carNumber,
            suggestions,
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
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: `Car modification submitted successfully.`,
                    confirmButtonText: 'OK',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.href = "/";
                    }
                  });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: `${errorData.message}`,
                  })
            }
        } catch (error) {
            console.error('Error:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: `Failed to submit car modification. ${error.message}`,
              })
        } finally {
            form.reset();
        }
    });
});
