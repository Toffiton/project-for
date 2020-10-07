<?php
require_once "User.php";
require_once 'database.php';

if(isset($_POST['id'])) {

    $id = (int)htmlentities(mysqli_real_escape_string($connection, $_POST['id']));

    $user = new User($id);
    $user->delete();
    mysqli_close($connection);
}


