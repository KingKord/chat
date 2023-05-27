<?php
define('PORT', "8090");
require_once("classes/chat.php");
$host = '127.0.0.1'; // IP-адрес или доменное имя сервера
$port = 8080; // Порт сервера

$chat = new \classes\chat();

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    echo "Не удалось создать сокет: " . socket_strerror(socket_last_error()) . "\n";
    exit;
}


socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
socket_bind($socket, 0, PORT);

socket_listen($socket);
while (true) {
    $newSocket = socket_accept($socket);
    $header = socket_read($newSocket, 1024);
    $chat->sendHeaders($header, $newSocket, "localhost", PORT);
}


socket_close($socket);