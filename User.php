<?php


class User{
    public $id = null;
    public $name = null;
    public $age = null;
    public $city_id = null;
    protected $connection = null;

    public function __construct($id){
        $this->id = $id;
        $this->connection = mysqli_connect(
            'localhost', 'root', 'root', 'test'
        ) or die("Не удалось подключиться к базе данных " . mysqli_error($this->connection));
        if ($id != null) {
            $query = "SELECT name, age, city_id FROM users WHERE id = '$id'";
            $result = mysqli_query($this->connection, $query);

            while($row = mysqli_fetch_array($result)) {
                $this->name =  $row['name'];
                $this->age =  $row['age'];
                $this->city_id =  $row['city_id'];
            }
        }
    }

    public function update($fieldname) {
        $value = $this->$fieldname;
        $query = $value != null ? "UPDATE users SET $fieldname = '$value' WHERE id = $this->id" : "UPDATE users SET '$fieldname' = NULL WHERE id = $this->id";
        $result = mysqli_query($this->connection, $query) or die("Не удалось подключиться к базе данных " . mysqli_error($this->connection));

        return $result;
    }

    public function delete () {
            $query = "DELETE FROM users WHERE id = '$this->id'";
            $result = mysqli_query($this->connection, $query) or die("Ошибка " . mysqli_error($this->connection));

            return $result;
    }

    public function __destruct()
    {
        mysqli_close($this->connection);
    }
}