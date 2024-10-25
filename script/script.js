document.addEventListener("DOMContentLoaded", function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    
    let questions = []; 
    let numberQuestion = 0; 

    const loadQuestions = async () => {
        try {
            const response = await fetch('./questions.json'); 
            const data = await response.json();
            questions = data.questions; 
            playTest(); 
        } catch (error) {
            console.error("Помилка завантаження питань:", error);
        }
    };

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        loadQuestions(); 
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });

    const playTest = () => {
        const renderQuestion = () => {
            prevBtn.style.display = numberQuestion > 0 ? 'inline-block' : 'none';

            nextBtn.style.display = (numberQuestion === questions.length - 1) ? 'none' : 'inline-block';

            const currentQuestion = questions[numberQuestion];
            questionTitle.textContent = currentQuestion.question;
            formAnswers.innerHTML = currentQuestion.answers.map((answer, index) => `
                <div class="answers-item d-flex flex-column">
                    <input type="${currentQuestion.type}" id="answerItem${index}" name="answer" class="d-none">
                    <label for="answerItem${index}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="answer image">
                        <span>${answer.title}</span>
                    </label>
                </div>
            `).join(''); 
        };

        renderQuestion(); 

        prevBtn.addEventListener('click', () => {
            if (numberQuestion > 0) {
                numberQuestion--; 
                renderQuestion(); 
            }
        });

        nextBtn.addEventListener('click', () => {
            if (numberQuestion < questions.length - 1) {
                numberQuestion++; 
                renderQuestion(); 
            }
        });
    };
});