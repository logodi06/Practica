eventListeners();

//lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    //Boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //Boton para una nueva tarea
    document.querySelector('#nuevaTarea').addEventListener('click', agregarTarea);

    ///Botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e) {
    e.preventDefault();
    console.log("Presionaste nuevo proyecto");

    //Crea un input para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto"> ';
    listaProyectos.appendChild(nuevoProyecto);

    //Selecionar el id con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //AL presionar enter crear el prooyecto

    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.which || e.keyCode;
        if (tecla === 13) {
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        }

    });

}

function guardarProyectoDB(nombreProyecto) {
    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //Enviar datos por formData
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');
    //Abrir conexión 
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    //
    xhr.onload = function() {
        if (this.status === 200) {
            //Obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;
            if (resultado === 'correcto') {
                //fue exitoso
                if (tipo === 'crear') {
                    //Se creo un nuevo proyecto
                    //Inyectar en el html
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                    <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                        ${proyecto}
                    </a>
                    `;

                    //Agregar al html 
                    listaProyectos.appendChild(nuevoProyecto);

                    //Enviar alerta
                    swal({
                            title: 'Proyecto creado',
                            text: 'El proyecto: ' + proyecto + 'se creó exitosamente',
                            type: 'success'
                        })
                        .then(resultado => {
                            //Redireccionar a la nueva URL
                            if (resultado.value) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        })
                } else {
                    //Se actualizo o elimino
                }
            } else {
                //Hubo un erro
                swal({
                    title: 'Error',
                    text: 'Hubo un error!!',
                    type: 'error'
                });
            }
        }
    };

    //Enviar datos
    xhr.send(datos);
}

//Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    //Validar que el campo tenga algo escriito
    if (nombreTarea === '') {
        swal({
            title: 'Error',
            text: 'Una tarea no puede ir vacia',
            type: 'error'
        });
    } else {
        //La tarea tiene algo
        //insertar en php
        //Llamado a Ajax
        var xhr = new XMLHttpRequest();

        //Crear formData
        var datos = new FormData();

        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //Abrir ajax
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //Ejecutarlo
        xhr.onload = function() {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;
                if (resultado === 'correcto') {
                    //Se agregó correctamente
                    if (tipo === 'crear') {
                        //Lanzar  alerta
                        swal({
                            title: "Tarea creada",
                            type: 'success',
                            text: 'La tarea: ' + tarea + ' se agregó correctamente'
                        });

                        //Seleccionar el parrafo con la lista vacia
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }
                        //Construir en el template
                        var nuevaTarea = document.createElement('li');

                        //Agregamos el ID de la tarea
                        nuevaTarea.id = 'tarea:' + id_insertado;

                        //Agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        //Insertar en el html
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>

                            </div>
                        `;

                        //Agregarlo al DOM
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        //Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();
                    }
                } else {
                    //Ocurrio un error
                    swal({
                        type: 'error',
                        title: 'Error!',
                        text: 'Hubo un error'
                    });
                }
            }
        }

        xhr.send(datos);
    }
}

//Cambiar el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    } else if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: 'Estas seguro de elimiar?',
            text: "Esta acción no se puede deshacers!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {


                var tareaEliminar = e.target.parentElement.parentElement;

                //Borrar de la BD
                eliminarTareaBD(tareaEliminar);

                //borrar del HTML
                tareaEliminar.remove();

                Swal(
                    'Eliminado!',
                    'La tarea ha sido eliminada.',
                    'success'
                )
            }
        })
    }

}

//COmpleta o descompleta la tarea
function cambiarEstadoTarea(tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split(':');

    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //Crear formData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    console.log(estado);

    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //Obtener resultados
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
        } else {

        }
    }

    xhr.send(datos);
}


//Elimina las tareas de la BD
function eliminarTareaBD(tarea) {
    var idTarea = tarea.id.split(':');

    //Crear llamado a Ajax
    var xhr = new XMLHttpRequest();

    //Crear formData
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //Obtener resultados
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            //Comprobar que haya tareas restanes
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes').innerHTML = `"<p class='lista-vacia'>No hay tareas en este proyecto</p>"`;
            }

        } else {

        }
    }

    xhr.send(datos);


}