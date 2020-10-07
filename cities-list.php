<?php

include('database.php');

$query = "SELECT * from  cities ";
$result = mysqli_query($connection, $query) or die("Ошибка " . mysqli_error($connection));

$json = array();
while($row = mysqli_fetch_array($result)) {
    $json[] = array(
        'id' => $row['id'],
        'name' => $row['name_city'],
    );
}
$jsonstring = json_encode($json);
echo $jsonstring;

