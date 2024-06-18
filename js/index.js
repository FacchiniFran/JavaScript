const userANDpass = { user1: 'pass1', user2: 'pass2', user3: 'pass3' };
let ask = true;

function checkUsername(users, input) {

    for (let i = 0; i < users.length; i++) {

        if (users[i] === input) {

            console.log('Usuario existe.');
            return true;
        }
    }

    return false;
}

function checkPassForUser(object, user, pass) {

    if (object[user] === pass) {
        
        console.log('Contraseña existe.');
        return true;
    }

    return false;
}

function mainLogin() {

    do {

        let option = prompt('Desea Iniciar Sesion o Crear Usuario?');

        if (option.toLowerCase() == 'iniciar sesion') {

            let users = Object.keys(userANDpass);
            let userInput = prompt('Ingrese Nombre de Usuario');
            let userExists = checkUsername(users, userInput);

            if (userExists) {

                let passInput = prompt('Ingrese su contraseña');
                let passExists = checkPassForUser(userANDpass, userInput, passInput);

                if (passExists) {

                    alert('Inicio de sesión exitoso. Bienvenido.')
                    ask = false;
                    break;
                }

                alert('La contraseña ingresada es incorrecta. Favor vuelva a intentar');
            } else if (!userExists) {
                
                alert('El usuario ingresado no existe o es incorrecto. Favor reingrese el usuario.\n\n(Favor recordar que el usuario diferencia minúsculas de mayúsculas)');
            }

            alert('Falló el inicio de sesión.');

        } else if (option.toLowerCase() == 'crear usuario') {

            let userCreated = false;
            let users = Object.keys(userANDpass);
            let userInput = prompt('Ingrese Nombre de Usuario');
            let userExists = checkUsername(users, userInput);

            if (!userExists) {

                let passInput = prompt('Ingrese su contraseña');
                userANDpass[userInput] = passInput;

                alert('Creación de usuario exitosa. Inicie sesión.');
                userCreated = true;
            } else if (!userCreated) {
                
                alert('El usuario ingresado ya existe.');
            }
        }

        alert('Favor ingrese "Iniciar Sesion" o "Crear Usuario".\n\n(Tenga en cuenta que las opciones deben ser escritas correctamente, con espacios y sin tildes)');
    } while (ask)
}

mainLogin();