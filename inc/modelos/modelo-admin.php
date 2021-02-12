<?

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion ==='crear'){
    //Codigo para creear los administrados

    //Hashear el password
    $opciones = array(
        'cost' => 12
    );

    $hash_password = password_hash($password,PASSWORD_BCRYPT,$opciones);

    //Importar la conexión
    include '../funciones/conexion.php';

    try{
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES(?,?)");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if($stmt->affected_rows>0){
            $respuesta = array(
                'respuesta'=>'correcto',
                'id_insertado' => $stmt->insert_id, 
                'tipo' => $accion,
                'usuario' => $usuario,
                'pass' => $hash_password
              
            );
        }else{
            $respuesta = array(
                'respuesta'=>'error'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e){
        //En caso de que haya un error tomar la exception
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);

 }

 if($accion === 'login'){
     //Escribir codigo que logue los administradores
     include '../funciones/conexion.php';

     try {
         //Seleccionar el administrador de la BD
         $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
         $stmt->bind_param('s',$usuario);
         $stmt->execute();
        //Loguear al usuario
        $stmt->bind_result($nombre_usuario,$id_usuario,$password_usuario);
         $stmt->close();
         $conn->close();
     } catch (Exception $e) {
         $respuesta = array(
            'error' => $e->getMessage();

         );
     }
 }
