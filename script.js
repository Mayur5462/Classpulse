const ratingButtons = document.querySelectorAll(".rating-btn");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const submitBtn = document.getElementById("submitBtn");
const doubtBox = document.getElementById("doubt");
const charCount = document.getElementById("charCount");

const answers = {};


// Rating buttons
ratingButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const topic = button.dataset.topic;
        const value = Number(button.dataset.value);

        answers[topic] = value;

        // Remove selection from same topic
        document
            .querySelectorAll(`[data-topic="${topic}"]`)
            .forEach((btn) => {
                btn.classList.remove("selected");
            });

        // Select clicked button
        button.classList.add("selected");

        updateProgress();
    });

});


// Update progress
function updateProgress() {

    const answered = Object.keys(answers).length;
    const total = 5;

    progressText.textContent = `${answered} / ${total}`;

    const percentage = (answered / total) * 100;

    progressBar.style.width = `${percentage}%`;
}


// Character counter
doubtBox.addEventListener("input", () => {

    const length = doubtBox.value.length;

    charCount.textContent = `${length} / 250`;

});


// Submit feedback
submitBtn.addEventListener("click", () => {

    const answered = Object.keys(answers).length;

    if (answered < 5) {

        alert(
            `Please rate all 5 topics first.\n\nYou have rated ${answered} out of 5 topics.`
        );

        return;
    }


    const feedback = {

        lesson: "Force & Resultant",

        answers: answers,

        doubt: doubtBox.value.trim(),

        submittedAt: new Date().toISOString()

    };


    // Save feedback in browser
    localStorage.setItem(
        "classpulseFeedback",
        JSON.stringify(feedback)
    );


    // Show success screen
    document.querySelector(".feedback-section").innerHTML = `

        <div class="success-screen">

            <div class="success-icon">
                ✅
            </div>

            <h2>Feedback Submitted!</h2>

            <p>
                Thank you. Your anonymous feedback will help improve the lesson.
            </p>

        </div>

    `;

});
