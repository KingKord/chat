<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Регистрация</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
            crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
            integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
            crossorigin="anonymous"></script>
    <link rel="stylesheet" href="styles/style.css">
    <style>
        .success-message {
            color: green;
            font-weight: bold;
        }

        .error-message {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>

<h1 style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 36px; color: #0088FF; text-align: center; text-transform: uppercase; letter-spacing: 2px; line-height: 1.2; margin-top: 20px;">
    Добро пожаловать в Чат!</h1>

<div class="form-container">
    <?php
    if (isset($_GET['message'])) {
        $message = $_GET['message'];
        if ($message == "Регистрация прошла успешно!") {
            echo '<p class="success-message">' . htmlspecialchars($message) . '</p>';
        } else if ($message == "Ваш логин уже был использован") {
            echo '<p class="error-message">' . htmlspecialchars($message) . '</p>';
        } else if ($message == "Ваш пароль или логин неправильный!") {
            echo '<p class="error-message">' . htmlspecialchars($message) . '</p>';
        } else {
            echo '<p>' . htmlspecialchars($message) . '</p>';
        }
    }
    ?>
    <form method="POST" action="sign.php">
        <label for="username">Логин:</label>
        <input type="text" id="login" name="login" required>

        <label for="password">Пароль:</label>
        <input type="password" id="password" name="password" required>

        <button type="submit">Войти</button>
        <a class="register-button" href="reg.html">Зарегистрироваться</a>
    </form>
</div>
<script src="scripts/main.js"></script>

</body>
