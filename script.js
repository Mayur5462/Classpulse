/* =========================================
   CLASSPULSE - SUPABASE CONNECTION
========================================= */

const SUPABASE_URL =
    "https://ucetnfdqkzoexqnijmel.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_H_HBQJHKBgEDHtIGym167w_dbDxX3GL";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================
   STUDENT ANSWERS
========================================= */

const answers = {};


/* =========================================
   SELECT RATING
========================================= */

function setupRatingButtons() {

    document.querySelectorAll(".topic").forEach(topic => {

        const topicName = topic.dataset.topic;

        topic.querySelectorAll(".rating-btn").forEach(button => {

            button.addEventListener("click", () => {

                topic.querySelectorAll(".rating-btn").forEach(btn => {
                    btn.classList.remove("selected");
                });

                button.classList.add("selected");

                answers[topicName] =
                    Number(button.dataset.value);

                updateProgress();

            });

        });

    });

}


/* =========================================
   PROGRESS
========================================= */

function updateProgress() {

    const totalTopics =
        document.querySelectorAll(".topic").length;

    const completedTopics =
        Object.keys(answers).length;

    const progressText =
        document.querySelector(".progress-text");

    const progressBar =
        document.querySelector(".progress-bar");

    if (progressText) {
        progressText.textContent =
            `${completedTopics} / ${totalTopics}`;
    }

    if (progressBar && totalTopics > 0) {

        const percentage =
            (completedTopics / totalTopics) * 100;

        progressBar.style.width =
            `${percentage}%`;
    }

}


/* =========================================
   SUBMIT FEEDBACK
========================================= */

async function submitFeedback() {

    const topicNames =
        Object.keys(answers);

    if (topicNames.length === 0) {

        alert(
            "Please select a rating for at least one topic."
        );

        return;
    }


    const subject =
        window.selectedSubject || "Unknown Subject";

    const chapter =
        window.selectedChapter || "Unknown Chapter";


    /*
       One selected topic = one database row
    */

    const feedbackRows =
        topicNames.map(topicName => {

            return {

                subject: subject,

                chapter: chapter,

                subtopic: topicName,

                rating: answers[topicName],

                doubt: "",

                submitted_at:
                    new Date().toISOString()

            };

        });


    console.log("Sending to Supabase:");
    console.log(feedbackRows);


    try {

        const { error } =
            await supabaseClient
                .from("Reviews")
                .insert(feedbackRows);


        if (error) {

            console.error(
                "SUPABASE ERROR:",
                error
            );

            alert(
                "❌ Feedback save nahi hua.\n\n" +
                error.message
            );

            return;
        }


        console.log(
            "Feedback successfully saved!"
        );

        alert(
            "✅ Feedback successfully submitted!"
        );


        Object.keys(answers).forEach(key => {
            delete answers[key];
        });


        document
            .querySelectorAll(".rating-btn.selected")
            .forEach(button => {

                button.classList.remove("selected");

            });


        updateProgress();

    } catch (error) {

        console.error(
            "CONNECTION ERROR:",
            error
        );

        alert(
            "❌ Supabase connection error.\n\n" +
            error.message
        );

    }

}


/* =========================================
   SUBMIT BUTTON
========================================= */

function setupSubmitButton() {

    const submitButton =
        document.querySelector("#submitFeedback");


    if (!submitButton) {

        console.warn(
            "Submit button #submitFeedback nahi mila."
        );

        return;
    }


    submitButton.addEventListener(
        "click",
        submitFeedback
    );

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRatingButtons();

        setupSubmitButton();

        updateProgress();

        console.log(
            "ClassPulse connected to Supabase."
        );

    }
);
