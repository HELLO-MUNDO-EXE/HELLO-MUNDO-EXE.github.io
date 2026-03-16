document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quiz-form');
    const submitBtn = document.getElementById('submit-btn');
    const scoreDiv = document.getElementById('score');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let score = 0;

        // Question 1: RPG correct = d
        const q1 = document.querySelector('input[name="q1"]:checked');
        const fb1 = document.getElementById('feedback-q1');
        if (q1 && q1.value === 'd') {
            score++;
            fb1.innerHTML = 'Correct!';
            fb1.classList.add('correct');
        } else {
            fb1.innerHTML = 'Incorrect.<br>Correct answer: Role-Playing Game';
            fb1.classList.add('incorrect');
        }

        // Question 2: MOBA correct = b
        const q2 = document.querySelector('input[name="q2"]:checked');
        const fb2 = document.getElementById('feedback-q2');
        if (q2 && q2.value === 'b') {
            score++;
            fb2.innerHTML = 'Correct!';
            fb2.classList.add('correct');
        } else {
            fb2.innerHTML = 'Incorrect.<br>Correct answer: Multiplayer Online Battle Arena';
            fb2.classList.add('incorrect');
        }

        // Question 3: FPS correct = b & c
        const q3Checked = Array.from(document.querySelectorAll('input[name="q3"]:checked')).map(el => el.value);
        const fb3 = document.getElementById('feedback-q3');
        const q3Correct = q3Checked.length === 2 && q3Checked.includes('b') && q3Checked.includes('c');
        if (q3Correct) {
            score++;
            fb3.innerHTML = 'Correct!';
            fb3.classList.add('correct');
        } else {
            fb3.innerHTML = 'Incorrect.<br>Correct answers: Frames Per Second and First-Person Shooter';
            fb3.classList.add('incorrect');
        }

        // Question 4: RTS correct = a 
        const q4Checked = Array.from(document.querySelectorAll('input[name="q4"]:checked')).map(el => el.value);
        const fb4 = document.getElementById('feedback-q4');
        const q4Correct = q4Checked.length === 1 && q4Checked.includes('a');
        if (q4Correct) {
            score++;
            fb4.innerHTML = 'Correct!';
            fb4.classList.add('correct');
        } else {
            fb4.innerHTML = 'Incorrect.<br>Correct answer: Real-Time Strategy';
            fb4.classList.add('incorrect');
        }

        // final score
        scoreDiv.innerHTML = `Your score: <span style="color:#007bff;">${score}/4</span>`;
    });
});