<?php

$conn = new mysqli('localhost','root','root','uptask');

if($conn->conect_error){
    echo $conn->conect_error;
}

$conn->set_charset('utf8');