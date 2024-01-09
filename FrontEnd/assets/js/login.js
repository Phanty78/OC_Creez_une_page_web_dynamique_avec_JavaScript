const logInForm = document.querySelector(".login-form")
const errorDisplayZone = document.querySelector(".error-display")

//La fonction etLogInInformations écoute l'événement submit du formulaire et récupère les valeurs de email et password

async function getLogInInformations() {
    // La fonction qui englobe postLogin doit également être async sinon postLogin me retourne une promesse
    logInForm.addEventListener("submit", async (event) =>{

        // Cette ligne de code empéche le rechargement de la page qui est le comportement par default du bouton submit du formulaire
        event.preventDefault();
        // On reinitialise l'affichage de la zone d'erreur errorDisplayZone
        errorDisplayZone.innerHTML = ""
        //Challenge Pascal : créer un console.log en forme de form en utilisant event.target
        console.log(`
        ${event.target.querySelector("#email-label").textContent} : ${event.target.querySelector("#email").value}
        ${event.target.querySelector("#password-label").textContent} : ${event.target.querySelector("#password").value}
                `)
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

// La fonction postLogIn envoi à l'API l'email et le mot de passe de l'utilisateur et en cas de réponse favorable envoi le token de connexion , sinon un message d'erreur.

async function postLogIn(email,password) {
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
