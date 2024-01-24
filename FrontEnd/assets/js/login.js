const logInForm = document.querySelector(".login-form")
const errorDisplayZone = document.querySelector(".error-display")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const loginForm = document.querySelector(".login-form")
const inputsArray = document.querySelectorAll("input")



async function getLogInInformations() { //La fonction getLogInInformations écoute l'événement submit du formulaire et récupère les valeurs de email et password
    logInForm.addEventListener("submit", async (event) =>{
        event.preventDefault();
        if (errorDisplayZone) {
            deleteMessage()
        }
        const email = event.target.querySelector("#email").value
        const password = event.target.querySelector("#password").value

        // On appel la fonction postLogin afin d'envoyer nos variables à l'API pour récupérer le token d'identification.
       let token = await postLogIn(email,password)
       if (token !== undefined && token !== null) {
            window.localStorage.setItem("token", token)
            window.location.href = "./index.html"
       }    
    })
}

function deleteMessage(){
    errorDisplayZone.innerHTML = ""
}

async function postLogIn(email,password) { // La fonction postLogIn envoi à l'API l'email et le mot de passe de l'utilisateur et en cas de réponse favorable envoi le token de connexion , sinon un message d'erreur.
    const postData = {
        "email": email,
        "password": password
      }
      const requestOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    
    try {
        const apiPostLogIn = await fetch("http://localhost:5678/api/users/login",requestOption)
        if (!apiPostLogIn.ok) {     
            // Gestion des erreurs d'envoie des informations à l'API
            const errorMessage = document.createElement("p")
            if (apiPostLogIn.status == 401) {          
                errorMessage.textContent= `Connexion non autorisée`              
            } else if(apiPostLogIn.status == 404) {
                errorMessage.textContent= `Utilisateur inconnu`
            }
            errorDisplayZone.classList.remove("hidden")
            errorDisplayZone.appendChild(errorMessage)
            // le mot clé throw provoque une interuption du code et doit être placé en dernier dans la condition
            throw new Error(`Response has fail with the status ${apiPostLogIn.status}`)    
        } else {
            const responseData = await apiPostLogIn.json();
            return  responseData.token       
        }  
    } catch (error) {
        console.error('An error was encounter during the API execution : ',error)
    }
}

getLogInInformations()
eraseMessageOnFocus(inputsArray)

function eraseMessageOnFocus(inputsArray) {
    for (let i = 0; i < inputsArray.length; i++) {
        inputsArray[i].addEventListener("focus",(event) =>{
            if (errorDisplayZone) {
                deleteMessage()
            }      
        })
    }
}
