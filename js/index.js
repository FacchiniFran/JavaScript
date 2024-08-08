//Variables globales para modificar el DOM
const enter = document.getElementById("enter");
const create = document.getElementById("create");
const forget = document.getElementById("forget");
const icon = document.getElementById("userIcon");
const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const mailInput = document.getElementById("mail");
const formTitle = document.getElementById("formTitle");
const closeForm = document.getElementById("closeForm");
const loginButton = document.getElementById("loginTxt");
const userStatus = document.getElementById("userStatus");
const createUser = document.getElementById("createUser");
const passRepeat = document.getElementById("passRepeat");
const loginForm = document.getElementById("loginFormContainer");

//Variables globales para el manejo de datos
let usersArray;
let currentUser;
let timerReference = null;

//Función de creación de usuario
function User(name, pass, prof, eMail) {
    this.userName = name;
    this.password = pass;
    this.profile = prof;
    this.mail = eMail;
    this.tries = 0;
}

//Función que genera un temporizador para el login
async function sessionTimer() {
    timerReference = setTimeout(async () => {
        const result = await Swal.fire({
            icon: "question",
            background: "#2c2c2c",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#0050c1",
            title: "¿Necesitás más tiempo?",
            cancelButtonText: "No, cerrar formulario"
        });
        if (result.isConfirmed) {
            await sessionTimer();
        } else {
            clsForm();
        }
    }, 30000);
}

//Función que toma los usuarios default, del archivo .json con Fetch
async function loadUsers() {
    try {
        let response = await fetch('../defaultUsers.json');
        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }
        let users = await response.json();
        return users;
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}

//Función para cargar el array con los usuarios default
async function initiateUsers() {
    try {
        const users = await loadUsers();
        const storageUsers = JSON.parse(localStorage.getItem("users"));
        usersArray = storageUsers || users;
        localStorage.setItem("users", JSON.stringify(usersArray));
    } catch (error) {
        console.error('Error al crear Array de Usuarios', error);
    }
}

//Función de chequeo de usuario
function checkUsername(users, input) {
    return users.some(user => user.userName === input)
}

//Función de chequeo de contraseña
function checkPassForUser(users, userCheck, passCheck) {
    return users.some(user => user.userName === userCheck && user.password === passCheck);
}

//Función de chequeo de null
function isNull(object) {
    return object === null ? true : false;
}

//Función que se encarga de habilitar un elemento
function activate(element) {
    element.classList.remove("inactive");
}

//Función que se encarga de inhabilitar un elemento
function deactivate(element) {
    element.classList.add("inactive");
}

//Función que detiene el temporizador
function stopTimer() {
    if (timerReference) {
        clearTimeout(timerReference);
        timerReference = null;
    }
}

//Función que define título e ícono en base al usuario activo
function setMain() {
    if (isNull(currentUser)) {
        userStatus.textContent = "Usuario no conectado";
        icon.src = "./svg/userCancel.svg";
    } else {
        if (currentUser.profile === "Admin") {
            userStatus.textContent = "Usuario con perfil Administrador";
            icon.src = "./svg/userAdmin.svg";
        }
        if (currentUser.profile === "Editor") {
            userStatus.textContent = "Usuario con perfil de Editor";
            icon.src = "./svg/userEditor.svg";
        }
        if (currentUser.profile === "Reader") {
            userStatus.textContent = "Usuario con perfil de Lector";
            icon.src = "./svg/userCLector.svg";
        }
    }
}

//Función que cierra el formulario
function clsForm() {
    setMain();
    stopTimer();
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

//Evento que abre el formulario o cierra la sesión
loginButton.addEventListener('click', () => {
    if (loginButton.textContent === "Iniciar Sesión") {
        sessionTimer();
        initiateUsers();
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
                currentUser = null;
                setMain();
                loginButton.textContent = "Iniciar Sesión";
            }
        });
    }
})

//Cierre manual del formulario
closeForm.addEventListener('click', () => {
    clsForm();
})

//Evento que modifica el formulario para recupero de clave
forget.addEventListener('click', () => {
    stopTimer();
    deactivate(forget);
    activate(mailInput);
    userInput.value = "";
    passInput.value = "";
    mailInput.value = "";
    passRepeat.value = "";
    deactivate(passInput);
    deactivate(createUser);
    enter.value = "Verificar";
    enter.style.marginTop = "10%";
    formTitle.textContent = "Reset de Contraseña";
})

//Evento que modifica el formulario para creación de usuario
create.addEventListener('click', () => {
    stopTimer();
    deactivate(forget);
    activate(mailInput);
    userInput.value = "";
    passInput.value = "";
    mailInput.value = "";
    activate(passRepeat);
    passRepeat.value = "";
    deactivate(createUser);
    enter.value = "Crear Usuario";
    formTitle.textContent = "Creación de Usuario";
})

//Funcionalidad principal
enter.addEventListener('click', () => {
    const name = userInput.value;
    const password = passInput.value;
    //Modo de inicio de sesión
    if (enter.value === "Iniciar Sesión") {
        let userExists = checkUsername(usersArray, name);
        if (userExists) {
            let userIndex = usersArray.findIndex(user => user.userName === name);
            let passExists = checkPassForUser(usersArray, name, password);
            if (passExists) {
                if (usersArray[userIndex].tries >= 3) {
                    Swal.fire({
                        icon: "info",
                        color: "#fff",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        title: "La contraseña de este usuario se encuentra bloqueada. Deberá realizar el recupero con Mail"
                    });
                } else {
                    stopTimer();
                    Swal.fire({
                        color: "#fff",
                        icon: "success",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        title: "Inicio de sesión exitoso. Bienvenido"
                    });
                    userInput.value = "";
                    passInput.value = "";
                    currentUser = usersArray[userIndex];
                    loginButton.textContent = "Cerrar Sesión";
                    clsForm();
                }
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
                    if (usersArray[userIndex].tries >= 3) {
                        Swal.fire({
                            icon: "info",
                            color: "#fff",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            title: "La contraseña de este usuario se encuentra bloqueada. Deberá realizar el recupero con Mail"
                        });
                    } else {
                        usersArray[userIndex].tries++;
                        Swal.fire({
                            icon: "error",
                            color: "#fff",
                            padding: "1.5em",
                            background: "#2c2c2c",
                            confirmButtonColor: "#0050c1",
                            text: "La contraseña ingresada es incorrecta. Favor vuelva a intentar.Recuerde que si falla 3 veces el ingreso de contraseña se bloqueará su usuario"
                        });
                        localStorage.setItem("users", JSON.stringify(usersArray));
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
    //Modo de creación de usuario
    if (enter.value === "Crear Usuario") {
        const eMail = mailInput.value;
        let userExists = checkUsername(usersArray, name);
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
                                usersArray.push(new User(name, password, "Reader", eMail));
                                localStorage.setItem("users", JSON.stringify(usersArray));
                                Swal.fire({
                                    color: "#fff",
                                    icon: "success",
                                    padding: "1.5em",
                                    background: "#2c2c2c",
                                    confirmButtonColor: "#0050c1",
                                    title: "Usuario lector creado exitosamente. Inicie sesión"
                                });
                                activate(forget);
                                activate(createUser);
                                userInput.value = "";
                                passInput.value = "";
                                mailInput.value = "";
                                passRepeat.value = "";
                                deactivate(mailInput);
                                deactivate(passRepeat);
                                enter.value = "Iniciar Sesión";
                            }
                        }
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
    //Modo de verificación de contraseña
    if (enter.value === "Verificar") {
        let userExists = checkUsername(usersArray, name);
        if (userExists) {
            let userIndex = usersArray.findIndex(user => user.userName === name);
            if (usersArray[userIndex].mail === mailInput.value) {
                if (usersArray[userIndex].tries >= 3) {
                    Swal.fire({
                        color: "#fff",
                        icon: "success",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        title: "Usuario desbloqueado",
                        text: "La contraseña del usuario '" + name + "' es: '" + usersArray[userIndex].password + "'"
                    });
                    usersArray[userIndex].tries = 0;
                    localStorage.setItem("users", JSON.stringify(usersArray));
                } else {
                    let triesLeft = 3 - usersArray[userIndex].tries;
                    Swal.fire({
                        icon: "info",
                        color: "#fff",
                        padding: "1.5em",
                        background: "#2c2c2c",
                        confirmButtonColor: "#0050c1",
                        title: "El usuario '" + name + "' tiene " + triesLeft + " intentos restantes.",
                        text: "La contraseña del usuario '" + name + "' es: '" + usersArray[userIndex].password + "'"
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