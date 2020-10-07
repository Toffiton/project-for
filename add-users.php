<?php

require_once 'database.php';

if(isset($_POST['name'])) {
    $name = htmlentities(mysqli_real_escape_string($connection, $_POST['name']));
    $age = (int)htmlentities(mysqli_real_escape_string($connection, $_POST['age']));
    $city = (int)htmlentities(mysqli_real_escape_string($connection, $_POST['city']));
    if ($city == ""){
        $query = "INSERT into users VALUES (NULL ,'$name', '$age', NULL)";
    }
    else {
        $query = "INSERT into users VALUES (NULL ,'$name', '$age', '$city')";
    }
    $result = mysqli_query($connection, $query) or die("Ошибка " . mysqli_error($connection));

}

