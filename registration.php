<?php


$USER = array(
    'login' => filter_var(trim($_POST['login']), FILTER_SANITIZE_EMAIL),
    'password' => filter_var(trim($_POST['password']), FILTER_SANITIZE_STRING),
    'name' => filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING),
    'authorised' => false
);
// Проверяем авторизацию пользовательской функцией checkUser
checkUser($USER);
function checkUser($arr)
{
    // проверка входа в бд
    echo $arr['login'].'<br>';
    echo $arr['password'].'<br>';
    echo $arr['name'].'<br>';

    try {
        $mysql = new mysqli('localhost', 'root', '12345678', 'registerchat');

    } catch (Exception $exception) {
        echo $exception;
    }
        if ($mysql->connect_errno) {
        die("Ошибка подключения: " . $mysql->connect_error);
    }


//

        echo "Успешное подключение к базе данных!";
    $login = $arr['login'];
    $password = $arr['password'];
    $name = $arr['name'];
    $message = '';
    try {
        $result = $mysql->query("SELECT * FROM registration
         WHERE login= '$login'");
        if (mysqli_num_rows($result) > 0) {
            $message =  "Ваш логин уже был использован";
//                while ($row = $result->fetch_assoc()) {
//                    echo "<br> id: ".$row["id"]. " - login: ".$row["login"];
//                }
            header("Location: signIn.php?message=" . urlencode($message));
            exit();
        } else {
            echo "Ваш логин: " . $arr['login'] . '<br>' . "Ваш пароль :" . $arr['password'];

            $mysql->query("INSERT INTO `registration` (`login`, `password`, `name`, `lastseen`) VALUES ('$login', '$password', '$name', NOW())");
            $message = 'Регистрация прошла успешно!';
            header("Location: signIn.php?message=" . urlencode($message));
            exit();
        }

    } catch (Exception $exception) {
        $message = 'Регистрация не прошла';
    }
    echo $message;


//
//
//        setcookie('login', $login);
//        setcookie('password', $password);
//    $mysql->close();
//    $arr['authorised']=true;
//}
//// Функция присвоит 'authorised' результаты проверки
//if( $USER['authorised']) {
//    echo 'Вы авторизованы!';
//
//
}

?>