import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { app } from '../app.js';

const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    const btnShowModal = document.querySelector("#btnOpenModal");
    const modalWindow = document.querySelector("#modalBlock");
    const btnCloseModal = document.querySelector("#closeModal");
    const titleQuestion = document.querySelector("#question");
    const answersForm = document.querySelector("#formAnswers");
    const btnBack = document.querySelector("#prev");
    const btnForward = document.querySelector("#next");
    const btnSubmit = document.querySelector("#send");

    let questionList = [];
    let currentQuestionIndex = 0;
    let responseStorage = []; 

    const fetchQuestions = async () => {
        try {
            const response = await fetch("./questions.json");
            const data = await response.json();
            questionList = data.questions;
            initiateQuiz();
        } catch (error) {
            console.error("Помилка завантаження питань:", error);
        }
    };

    btnShowModal.addEventListener("click", () => {
        modalWindow.classList.add("d-block");
        fetchQuestions();
    });

    btnCloseModal.addEventListener("click", () => {
        modalWindow.classList.remove("d-block");
    });

    const initiateQuiz = () => {
        const displayQuestion = () => {
            if (currentQuestionIndex < questionList.length) {
                const currentQuestion = questionList[currentQuestionIndex];
                titleQuestion.textContent = currentQuestion.question;

                answersForm.innerHTML = currentQuestion.answers
                    .map(
                        (answer, index) => `
                        <div class="answers-item d-flex flex-column">
                            <input type="${currentQuestion.type}" id="responseItem${index}" name="response" class="d-none" value="${answer.title}">
                            <label for="responseItem${index}" class="d-flex flex-column justify-content-between">
                                <img class="answerImg" src="${answer.url}" alt="${answer.title}">
                                <span>${answer.title}</span>
                            </label>
                        </div>
                    `
                    )
                    .join("");

                btnBack.style.display = currentQuestionIndex === 0 ? "none" : "block";
                btnForward.style.display = "block";
                btnSubmit.classList.add("d-none");
                titleQuestion.style.display = "block";
            } else {
                titleQuestion.textContent = "Введіть ваше ім'я та номер телефону:";
                answersForm.innerHTML = `
                    <div class="form-group w-100 mb-2">
                        <input type="text" id="userName" class="form-control" placeholder="Ім'я">
                    </div>
                    <div class="form-group w-100">
                        <input type="tel" id="userPhone" class="form-control" placeholder="+380........">
                    </div>
                `;
                btnBack.style.display = "none";
                btnForward.style.display = "none";
                btnSubmit.classList.remove("d-none");
                titleQuestion.style.display = "block"; 
            }
        };

        displayQuestion();

        btnBack.addEventListener("click", () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                displayQuestion();
            }
        });

        btnForward.addEventListener("click", () => {
            const selectedOption = answersForm.querySelector('input[name="response"]:checked');
            if (selectedOption) {
                responseStorage.push({
                    question: questionList[currentQuestionIndex].question,
                    answer: selectedOption.value,
                });
            }

            if (currentQuestionIndex < questionList.length) {
                currentQuestionIndex++;
                displayQuestion();
            }
        });
    };

    btnSubmit.addEventListener("click", () => {
        const userName = document.querySelector("#userName").value;
        const userPhone = document.querySelector("#userPhone").value;

        responseStorage.push({ "ім'я": userName });
        responseStorage.push({ "номер телефону": userPhone });

        set(ref(database, 'responses/' + Date.now()), {
            answers: responseStorage
        })
        .then(() => {
            console.log('Дані відправлено до Firebase');
            titleQuestion.style.display = "none";
            const thanksMessage = document.createElement("div");
            thanksMessage.textContent = "Дякуємо за відповідь!";
            thanksMessage.classList.add("thank-you-message", "text-center", "mt-3");
            answersForm.innerHTML = ""; 
            answersForm.appendChild(thanksMessage); 
            btnSubmit.classList.add("d-none"); 
            
            setTimeout(() => {
                thanksMessage.remove(); 
                location.reload(); 
            }, 4000);
        })
        .catch((error) => {
            console.error('Помилка відправки до Firebase:', error);
        });

        titleQuestion.textContent = "";
    });
});
