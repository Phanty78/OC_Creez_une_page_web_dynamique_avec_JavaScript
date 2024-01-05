/*
email: sophie.bluel@test.tld

password: S0phie 
*/

const logInForm = document.querySelector(".login-form")
const errorDisplayZone = document.querySelector(".error-display")

//La fonction etLogInInformations écoute l'événement submit du formulaire et récupère les valeurs de email et password

async function getLogInInformations() {
    // La fonction qui englobe postLogin doit également être async sinon postLogin me retourne une promesse
    logInForm.addEventListener("submit", async (event) =>{

        // Cette ligne de code empéche le rechargement de la page qui est le comportement par default du bouton submit du formulaire
        event.preventDefault();

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        // On appel la fonction postLogin afin d'envoyer nos variables à l'API pour récupérer le token d'identification.
       let token = await postLogIn(email,password)
       console.log(token)

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

            throw new Error(`Response has fail with the status ${apiPostLogIn.status}`)
            
        } else {

            const responseData = await apiPostLogIn.json();
            return  responseData.token
            
        }
        
    } catch (error) {

        console.error('An error was encounter during the API execution : ',error)
        const errorMessage = document.createElement("p")
        errorMessage.textContent= "Mauvais identifiant ou mauvais mot de passe"
        errorDisplayZone.classList.remove("hidden")
        errorDisplayZone.appendChild(errorMessage)
    }

}

getLogInInformations()
