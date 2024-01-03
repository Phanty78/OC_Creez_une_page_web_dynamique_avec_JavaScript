/*
email: sophie.bluel@test.tld

password: S0phie 
*/

const logInForm = document.querySelector(".login-form")

//La fonction etLogInInformations écoute l'événement submit du formulaire et récupère les valeurs de email et password

async function getLogInInformations(email,password) {
    logInForm.addEventListener("submit", (event) =>{

        // Cette ligne de code empéche le rechargement de la page qui est le comportement par default du bouton submit du formulaire
        event.preventDefault();

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value

        if (email === undefined || email === null) {
            throw new Error('L\'e-mail est undefined ou null.');
        }

        postLogIn(email,password)

    })

}

// La fonction postLogIn envoi à l'API l'email et le mot de passe de l'utilisateur et en cas de réponse favorable envoi le token de connexion , sinon un message d'erreur.

async function postLogIn(email,password) {

    const postData = {
        "email": email,
        "password": password
      }

      const requestOption = {
        method : 'POST',
        header : {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(postData)
      }
    
    try {

        const apiPostLogIn = await fetch("http://localhost:5678/api/users/login",requestOption)

        if (!apiPostLogIn.ok) {

            throw new Error(`Response has fail with the status ${apiPostLogIn.status}`)
            
        } else {

            const responseData = await apiPostLogIn.json();
            console.log(responseData);
            
        }
        
    } catch (error) {

        console.error('An error was encounter during the API execution : ',error)
        
    }

}

getLogInInformations()
