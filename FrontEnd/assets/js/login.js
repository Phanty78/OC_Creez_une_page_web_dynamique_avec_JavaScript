const logInForm = document.querySelector(".login-form")

function getLogInInformation() {
    logInForm.addEventListener("submit", (event) =>{

        // Cette ligne de code empéche le rechargement de la page qui est le comportement par default du bouton submit du formulaire
        event.preventDefault();

        let email = document.getElementById("email").value
        let password = document.getElementById("password").value

    })
}

getLogInInformation() 