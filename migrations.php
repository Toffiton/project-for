<?php

include('database.php');

$query ="CREATE TABLE cities (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name_city varchar(255) NOT NULL
);

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(30) NOT NULL,
  age int NOT NULL,
  city_id int DEFAULT NULL,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

INSERT INTO cities (id, name_city) VALUES
(1, 'Санкт-Петербург'),
(2, 'Москва'),
(3, 'Смоленск'),
(4, 'Брянск'),
(5, 'Рославль'),
(6, 'Минск'),
(7, 'Витебск');
";
$result = mysqli_multi_query($connection, $query) or die("Ошибка " . mysqli_error($connection));
if($result)
{
    echo "Создание таблицы прошло успешно";
}

mysqli_close($connection);
?>