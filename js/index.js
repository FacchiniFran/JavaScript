/*Se toman los elementos que se verán modificados del DOM*/
const enter = document.getElementById("enter");
const create = document.getElementById("create");
const forget = document.getElementById("forget");
const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const mailInput = document.getElementById("mail");
const formTitle = document.getElementById("formTitle");
const closeForm = document.getElementById("closeForm");
const loginButton = document.getElementById("loginTxt");
const createUser = document.getElementById("createUser");
const passRepeat = document.getElementById("passRepeat");
const loginForm = document.getElementById("loginFormContainer");

/*Función de chequeo de usuario*/
function checkUsername(users, input) {
    for (let user of users) {
        if (user.userName === input) {
            return true;
        }
    }
    return false;
}

/*Función de chequeo de contraseña*/
function checkPassForUser(users, userCheck, passCheck) {
    for (let user of users) {
        if (user.userName === userCheck && user.password === passCheck) {
            return true;
        }
    }
    return false;
}

/*Función que se encarga de habilitar un elemento*/
function activate(element) {
    element.classList.remove("inactive");
}

/*Función que se encarga de inhabilitar un elemento*/
function deactivate(element) {
    element.classList.add("inactive");
}

/*Función que cierra el formulario*/
function cierreForm() {
    activate(forget);
    activate(userInput);
    activate(passInput);
    activate(createUser);
    userInput.value = "";
    passInput.value = "";
    mailInput.value = "";
    passRepeat.value = "";
    deactivate(loginForm);
    deactivate(mailInput);
    deactivate(passRepeat);
    enter.value = "Iniciar Sesión";
    enter.removeAttribute("style");
    formTitle.textContent = "Inicio de Sesión";
}

/*Función que abre el formulario*/
loginButton.addEventListener('click', () => {
    if (loginButton.textContent === "Iniciar Sesión") {
        activate(loginForm);
    } else {
        Swal.fire({
            color: "#fff",
            icon: "question",
            background: "#2c2c2c",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#0050c1",
            title: "Esta seguro de querer cerrar sesión?"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    color: "#fff",
                    background: "#2c2c2c",
                    title: "Sesión Cerrada",
                    confirmButtonColor: "#0050c1"
                });
                loginButton.textContent = "Iniciar Sesión";
            }
        });
    }
})

/*Cierre manual del formulario*/
closeForm.addEventListener('click', () => {
    cierreForm();
})

/*Función que modifica el formulario para recupero de clave*/
forget.addEventListener('click', () => {
    deactivate(forget);
    activate(mailInput);
    deactivate(passInput);
    deactivate(createUser);
    enter.value = "Verificar";
    enter.style.marginTop = "10%";
    formTitle.textContent = "Reset de Contraseña";
})

/*Función que modifica el formulario para creación de usuario*/
create.addEventListener('click', () => {
    deactivate(forget);
    activate(passRepeat);
    deactivate(createUser);
    enter.value = "Crear Usuario";
    formTitle.textContent = "Creación de Usuario";
})

/*Operador principal*/
enter.addEventListener('click', () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const name = userInput.value;
    const password = passInput.value;
    if (enter.value === "Iniciar Sesión") {
        let userExists = checkUsername(users, name);
        if (userExists) {
            let userIndex = users.findIndex(user => user.userName === name);
            if (users[userIndex].tries >= 3) {
                Swal.fire({
                    icon: "info",
                    color: "#fff",
                    padding: "1.5em",
                    background: "#2c2c2c",
                    confirmButtonColor: "#0050c1",
                    title: "La contraseña de este usuario se encuentra bloqueada. Deberá realizar el recupero con Mail"
                });
            } else {
                let passExists = checkPassForUser(users, name, password);
                if (passExists) {
                    Swal.fire({
                        color: "#fff",
                        icon: "success",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        title: "Inicio de sesión exitoso. Bienvenido"
                    });
                    loginButton.textContent = "Cerrar Sesión";
                    userInput.value = "";
                    passInput.value = "";
                    cierreForm();
                } else {
                    if (password === "") {
                        Swal.fire({
                            icon: "error",
                            color: "#fff",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            text: "No se ha ingresado una contraseña"
                        });
                    } else {
                        users[userIndex].tries++;
                        Swal.fire({
                            icon: "error",
                            color: "#fff",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            text: "La contraseña ingresada es incorrecta. Favor vuelva a intentar.Recuerde que si falla 3 veces el ingreso de contraseña se bloqueará su usuario"
                        });
                        localStorage.setItem("users", JSON.stringify(users));
                    }
                }
            }
        } else {
            if (name === "") {
                Swal.fire({
                    icon: "error",
                    color: "#fff",
                    padding: "1.5em",
                    background: "#2c2c2c",
                    confirmButtonColor: "#0050c1",
                    text: "No se ha ingresado un usuario. Favor recuerde que el usuario diferencia minúsculas de mayúsculas"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    color: "#fff",
                    padding: "1.5em",
                    background: "#2c2c2c",
                    confirmButtonColor: "#0050c1",
                    text: "El usuario ingresado no existe o es incorrecto. Favor reingrese el usuario. Favor recuerde que el usuario diferencia minúsculas de mayúsculas"
                });
            }
        }
    }
    if (enter.value === "Crear Usuario") {
        let userExists = checkUsername(users, name);
        if (!userExists) {
            if (name === "") {
                Swal.fire({
                    icon: "error",
                    color: "#fff",
                    padding: "1.5em",
                    background: "#2c2c2c",
                    confirmButtonColor: "#0050c1",
                    text: "No se ha ingresado un usuario. Favor recuerde que el usuario diferencia minúsculas de mayúsculas"
                });
            } else {
                if (password === "") {
                    Swal.fire({
                        icon: "error",
                        color: "#fff",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        text: "No se ha ingresado una contraseña"
                    });
                } else {
                    if (password === passRepeat.value) {
                        users.push({ userName: name, password: password, mail: mailInput, tries: 0 });
                        localStorage.setItem("users", JSON.stringify(users));
                        Swal.fire({
                            color: "#fff",
                            icon: "success",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            title: "Usuario creado exitosamente. Inicie sesión"
                        });
                        userInput.value = "";
                        passInput.value = "";
                        passRepeat.value = "";
                        enter.value = "Iniciar Sesión";
                        activate(forget);
                        activate(createUser);
                        deactivate(passRepeat);
                    } else {
                        Swal.fire({
                            icon: "info",
                            color: "#fff",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            title: "Las contraseñas ingresadas no coinciden. Intente nuevamente"
                        });
                        passInput.value = "";
                        passRepeat.value = "";
                    }
                }
            }
        } else {
            Swal.fire({
                color: "#fff",
                icon: "warning",
                padding: "1.5em",
                background: "#2c2c2c",
                confirmButtonColor: "#0050c1",
                title: "El usuario ingresado ya existe"
            });
        }
    }
    if (enter.value === "Verificar") {
        let userExists = checkUsername(users, name);
        if (userExists) {
            let userIndex = users.findIndex(user => user.userName === name);
            if (users[userIndex].mail === mailInput.value) {
                if (users[userIndex].tries >= 3) {
                    Swal.fire({
                        color: "#fff",
                        icon: "success",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        title: "Usuario desbloqueado",
                        text: "La contraseña del usuario '" + name + "' es: '" + users[userIndex].password + "'"
                    });
                    localStorage.setItem("users", JSON.stringify(users));
                } else {
                    let triesLeft = 3 - users[userIndex].tries;
                    Swal.fire({
                        icon: "info",
                        color: "#fff",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        title: "El usuario '" + name + "' tiene " + triesLeft + " intentos restantes.",
                        text: "La contraseña del usuario '" + name + "' es: '" + users[userIndex].password + "'"
                    });
                }
            } else {
                if (!mailInput.value.includes("@") || !mailInput.value.includes(".")) {
                    Swal.fire({
                        icon: "error",
                        color: "#fff",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        text: "El mail ingresado no cumple con el formato correspondiente"
                    });
                } else {
                    if (mailInput.value === "") {
                        Swal.fire({
                            icon: "error",
                            color: "#fff",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            text: "No se ha ingresado un mail"
                        });
                    } else {
                        Swal.fire({
                            color: "#fff",
                            icon: "error",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            title: "El mail ingresado no corresponde al usuario"
                        });
                    }
                }
            }
        } else {
            if (name === "") {
                Swal.fire({
                    icon: "error",
                    color: "#fff",
                    padding: "1.5em",
                    background: "#2c2c2c",
                    confirmButtonColor: "#0050c1",
                    text: "No se ha ingresado un usuario. Favor recuerde que el usuario diferencia minúsculas de mayúsculas"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    color: "#fff",
                    padding: "1.5em",
                    background: "#2c2c2c",
                    confirmButtonColor: "#0050c1",
                    text: "El usuario ingresado no existe o es incorrecto. Favor reingrese el usuario. Favor recuerde que el usuario diferencia minúsculas de mayúsculas"
                });
            }
        }
    }
});