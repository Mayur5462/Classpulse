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

                // Sirf current topic ke buttons unselect
                topic.querySelectorAll(".rating-btn").forEach(btn => {
                    btn.classList.remove("selected");
                });

                // Clicked button select
                button.classList.add("selected");

                // Rating save
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


    // At least one topic rating required
    if (topicNames.length === 0) {

        alert(
            "Please select a rating for at least one topic."
        );

        return;

    }


    /*
       Subject and chapter are taken from
       the selected page values.
    */

    const subject =
        window.selectedSubject || "Unknown Subject";

    const chapter =
        window.selectedChapter || "Unknown Chapter";


    /*
       Convert every topic rating
       into one database row.
    */

    const feedbackRows =
        topicNames.map(topicName => {

            return {

                subject: subject,

                chapter: chapter,

                topic: topicName,

                rating: answers[topicName],

                doubt: "",

                submitted_at:
                    new Date().toISOString()

            };

        });


    try {

        const { error } =
            await supabaseClient
                .from("feedback")
                .insert(feedbackRows);


        if (error) {

            console.error(
                "Supabase Error:",
                error
            );

            alert(
                "Feedback save nahi hua.\n\n" +
                error.message
            );

            return;

        }


        /*
           Success
        */

        alert(
            "Feedback successfully submitted! ✅"
        );


        // Clear answers
        Object.keys(answers).forEach(key => {
            delete answers[key];
        });


        // Remove selected buttons
        document
            .querySelectorAll(".rating-btn.selected")
            .forEach(button => {

                button.classList.remove("selected");

            });


        updateProgress();


    } catch (error) {

        console.error(
            "Connection Error:",
            error
        );

        alert(
            "Supabase se connection nahi ho paaya."
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
