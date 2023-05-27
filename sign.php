<?php


$USER = array(
    'login' => filter_var(trim($_POST['login']), FILTER_SANITIZE_EMAIL),
    'password' => filter_var(trim($_POST['password']), FILTER_SANITIZE_STRING),
    'authorised' => false
);
// Проверяем авторизацию пользовательской функцией checkUser

checkUser($USER);
function checkUser($arr)
{

    // проверка входа в бд
    //
    try {
        $mysql = new mysqli('localhost', 'root', '12345678', 'registerchat');

    } catch (Exception $exception) {
        echo $exception;
    }

    if ($mysql->connect_errno) {
        die("Ошибка подключения: " . $mysql->connect_error);
    }
    //        echo "Успешное подключение к базе данных!";
    $login = $arr['login'];
    $password = $arr['password'];
    $auth = $arr['authorised'];
    echo $login.'<br>'.
    $password.'<br>';
//    if ($login == "") {
//        $login = $_COOKIE['login'];
//        $password = $_COOKIE['password'];
//        $auth = $_COOKIE['auth'];
//
//    }
    //        echo $login;
    //
    try {
        $result = $mysql->query("SELECT * FROM registration
             WHERE login= '$login' AND password= '$password'");
        if (mysqli_num_rows($result) > 0) {
            $auth = true;
            $row = $result->fetch_assoc();
            setcookie('auth', $auth);
            setcookie('name', $row['name']);
            setcookie('userid', $row['id']);
            setcookie('login', $login);
            $mysql->query("UPDATE registration SET lastseen = NOW() WHERE login = '$login'");
            header("Location: index.php");

        } else if (mysqli_num_rows($result) == 0) {
            $message =  "Ваш пароль или логин неправильный!";
            setcookie('auth', false);
            header("Location: signIn.php?message=". urlencode($message));

        }

    } catch (Exception $exception) {
        echo "ex";
    }

}


