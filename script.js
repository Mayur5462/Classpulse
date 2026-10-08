const SUPABASE_URL = "https://ucetnfdqkzoexqnijmel.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_H_HBQJHKBgEDHtIGym167w_dbDxX3GL";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase connected:", supabaseClient);
const answers = {};

document.querySelectorAll(".topic").forEach(topic => {
    const topicName = topic.dataset.topic;

    topic.querySelectorAll(".rating-btn").forEach(button => {
        button.addEventListener("click", () => {

            // Sirf isi topic ke buttons ko unselect karo
            topic.querySelectorAll(".rating-btn").forEach(btn => {
                btn.classList.remove("selected");
            });

            // Jo button click hua usko select karo
            button.classList.add("selected");

            // Is topic ka answer save karo
            answers[topicName] = button.dataset.value;

            updateProgress();
        });
    });
});

function updateProgress() {
    const totalTopics = document.querySelectorAll(".topic").length;
    const completedTopics = Object.keys(answers).length;

    const progressText = document.querySelector(".progress-text");
    const progressBar = document.querySelector(".progress-bar");

    if (progressText) {
        progressText.textContent = `${completedTopics} / ${totalTopics}`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${(completedTopics / totalTopics) * 100}%`;
    }
}
