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
            // Handle the visibility of prevBtn and nextBtn using switch case
            switch (numberQuestion) {
                case 0:
                    prevBtn.style.display = 'none'; // Hide prevBtn on the first question
                    nextBtn.style.display = 'inline-block'; // Show nextBtn
                    break;
                case questions.length - 1:
                    prevBtn.style.display = 'inline-block'; // Show prevBtn on the last question
                    nextBtn.style.display = 'none'; // Hide nextBtn
                    break;
                default:
                    prevBtn.style.display = 'inline-block'; // Show prevBtn for intermediate questions
                    nextBtn.style.display = 'inline-block'; // Show nextBtn
                    break;
            }

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
