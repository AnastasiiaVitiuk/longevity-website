const form = document.getElementById("userinfo");
const responseDiv = document.getElementById("form-response");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!fname || !lname || !email) {
        responseDiv.textContent = "All fields are required!";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fname, lname, email })
        });
        const result = await res.json();

        if (res.ok) {
            responseDiv.textContent = `Thank you ${result.data.fname}, your submission has been saved!`;
            form.reset();
        } else {
            responseDiv.textContent = result.error;
        }
    } catch (err) {
        console.error(err);
        responseDiv.textContent = "Error submitting form";
    }
});