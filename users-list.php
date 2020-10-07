<?php

require_once 'database.php';

$query = "SELECT users.id, users.name, users.age, cities.name_city from users LEFT JOIN cities ON users.city_id = cities.id";
$result = mysqli_query($connection, $query) or die("Ошибка " . mysqli_error($connection));

$json = array();
while($row = mysqli_fetch_array($result)) {
  $json[] = array(
      'id' => $row['id'],
      'name' => $row['name'],
      'age' => $row['age'],
      'city' => $row['name_city']
    );
  }
$jsonstring = json_encode($json);

mysqli_close($connection);
echo $jsonstring;

