const users = [{userName: 'usuario1', password: 'pass1', mail: 'usuario1@gmail.com', tries: 0},
    {userName: 'usuario2', password: 'pass2', mail: 'usuario2@gmail.com', tries: 0},
    {userName: 'usuario3', password: 'pass3', mail: 'usuario3@gmail.com', tries: 0}];

let ask = true;

function checkUsername(users, input) {

    for (let user of users) {

        if (user.userName === input) {

            console.log('Usuario existe.');
            return true;
        }
    }

    return false;
}

function checkPassForUser(users, userCheck, passCheck) {

    for (let user of users) {

        if (user.userName === userCheck && user.password === passCheck) {

            console.log('Contraseña existe.');
            return true;
        }
    }

    return false;
}

function mainLogin() {

    do {

        let option = prompt('Desea Iniciar Sesion o Crear Usuario?');

        if (option.toLowerCase() === 'iniciar sesion') {

            let userInput = prompt('Ingrese Nombre de Usuario');
            let userExists = checkUsername(users, userInput);

            if (userExists) {

                let currentUser = users.find(user => user.userName === userInput);

                if (currentUser.tries >= 3) {

                    alert('La contraseña de este usuario se encuentra bloqueada.\n\nIngrese su mail para desbloquearla.');
                    let mailInput = prompt('Ingrese su mail.');

                    if (currentUser.mail === mailInput) {

                        let userIndex = users.findIndex(user => user.userName === userInput);
                        users[userIndex].tries = 0;
                        alert('Contraseña desbloqueada. Ingrese su contraseña.');
                    } else {

                        alert('El mail ingresado es incorrecto.');
                        continue;
                    }
                }

                let passInput = prompt('Ingrese su contraseña');
                let passExists = checkPassForUser(users, userInput, passInput);

                if (passExists) {

                    alert('Inicio de sesión exitoso. Bienvenido.');
                    ask = false;
                } else {

                    let userIndex = users.findIndex(user => user.userName === userInput);
                    users[userIndex].tries++;
                    alert('La contraseña ingresada es incorrecta. Favor vuelva a intentar.\n\nRecuerde que si falla 3 veces el ingreso de contraseña se bloqueará su usuario.');
                }
            } else {

                alert('El usuario ingresado no existe o es incorrecto. Favor reingrese el usuario.\n\n(Favor recordar que el usuario diferencia minúsculas de mayúsculas)');
            }

        } else if (option.toLowerCase() === 'crear usuario') {

            let userInput = prompt('Ingrese Nombre de Usuario');
            let userExists = checkUsername(users, userInput);

            if (!userExists) {

                let passInput = prompt('Ingrese su contraseña');
                let mailInput = prompt('Ingrese su mail.');
                users.push({userName: userInput, password: passInput, mail: mailInput, tries: 0});
                alert('Creación de usuario exitosa.\n\nUsuario: ' + userInput + '\nContraseña: ' + passInput + '\nMail: ' + mailInput + '\n\nInicie sesión.');
            } else {

                alert('El usuario ingresado ya existe.');
            }
        } else {
            
            alert('Opción inválida, favor ingrese "Iniciar Sesion" o "Crear Usuario".');
        }
    } while (ask);
}

mainLogin();