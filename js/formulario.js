eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);

}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        //Validación fallo
        Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Ambos campos son obligatorios',

        })
    } else {
        //Ambos tienen algo, mandar a ejecutar Ajax

        //Datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);


        //Crear el llamado a Ajax
        var xhr = new XMLHttpRequest();

        //Abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        //Retorno de datos
        xhr.onload = function() {
            if (this.status === 200) {
                console.log(JSON.parse(xhr.responseText));
                var respuesta = JSON.parse(xhr.responseText);
                if (respuesta.respuesta === 'correcto') {
                    //Si es un nuevo usuario
                    if (respuesta.tipo === 'crear') {
                        swal({
                            title: 'Usuario Creado',
                            text: 'El usuario se creo correctamente',
                            type: 'success'
                        });
                    }
                } else {
                    //Hubo un error
                    swal({
                        title: 'Ocurrio un error',
                        text: 'Ocurrio un error',
                        type: 'error'
                    });
                }

            }
        }

        //ENviar la peticion
        xhr.send(datos);
    }


}