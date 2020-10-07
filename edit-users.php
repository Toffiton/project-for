<?php
require_once "User.php";
require_once 'database.php';

$fieldName = htmlentities(mysqli_real_escape_string($connection, $_POST['update']['field']));
$value = htmlentities(mysqli_real_escape_string($connection, $_POST['update']['value']));
$id = (int)htmlentities(mysqli_real_escape_string($connection, $_POST['update']['id']));


$user = new User($id);
$user->{$fieldName} = $value;

mysqli_close($connection);
echo $user->update($fieldName);