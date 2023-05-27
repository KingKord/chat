/* Загружаем модули */
const ws = require('ws');
// Обьект для хранения подключённых клиентов
var clients = {};
let myClients = {};
// Запускаем WebSocket-сервер на порту 3000
var webSocketServer = new ws.Server({
    port: 3000
});

const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "registerchat",
    password: "12345678"
});

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
})

// connection.end(function (err) {
//     if (err) {
//         return console.log("Ошибка: " + err.message);
//     }
//     console.log("Подключение закрыто")
// })
// Добавляем в сервер слушателя на событие подключения
webSocketServer.on('connection', function (ws) {
    var id = Math.random();
    clients[id] = ws; //Каждому клиенту присваиваем ссылку на объект сервера
    console.log("новое соединение " + id);

    //Отправляем клиенту id соединения, чтобы потом индивидуально отправлять сообщения
    clients[id].send(JSON.stringify({'id_first': id}));
    //Обработка входящих сообщений
    ws.on('message', function (message) {
        console.log('получено сообщение ' + message);

        let p_ms = JSON.parse(message);
        let answer = {
            from_id: "",
            from_name: "",
            message: "",
            date: ""
        };
        if (p_ms) {
            if (p_ms.first_name !== undefined) {
                myClients[p_ms.id] = p_ms.first_name;
                /*
                *Если это первое подключение и клиент прислал свое имя для чата
                *Проверяем имена других клиентов и изменяем исходное так, чтобы не повторялось
                *(пока не сделано)
                */
                // Ща сделаем
                for (let clientsKey in myClients) {
                    if ((p_ms.first_name === myClients[clientsKey])) {
                        if ((clientsKey != p_ms.id)) {
                            p_ms.first_name = p_ms.first_name + " #" + clientsKey;
                        }
                    }
                }
//Полученное имя передаем обратно конкретному клиенту
                answer.name_first = p_ms.first_name;
                clients[p_ms.id].send(JSON.stringify(answer));
            } else if (p_ms.connect !== undefined){
                console.log("Отправляю сообщение в бд");
                connection.query("INSERT INTO messages (userid, name, message, date)\n" +
                    "VALUES ('"+p_ms.connect.id +"', '"+p_ms.connect.name +"', '"+p_ms.message +"', NOW());");
                answer.message = p_ms.message;
                answer.from_id = p_ms.connect.id;
                answer.from_name = p_ms.connect.name;
//Рассылка сообщений всем клиентам
                for (var key in clients) {
//Отправляем сообщение каждому клиенту
                    clients[key].send(JSON.stringify(answer));
                }

            } else {
                // кнопка загрузить

                clients[p_ms.data.id].send(JSON.stringify(answer));
                let result = connection.query("SELECT * from messages", function (err, result, fields) {
                    if (err) throw err;
                    // console.log(result);
                    for (let resultKey in result) {
                        console.log(result[resultKey].message);
                        answer.message = result[resultKey].message;
                        answer.from_id = result[resultKey].id;
                        answer.from_name = result[resultKey].name;
                        answer.date = result[resultKey].date;
                        console.log(answer);
                        clients[p_ms.data.id].send(JSON.stringify(answer));

                    }
                });
                console.log(result);
                for (const resultKey in result) {
                    console.log(resultKey['message']);
                }
                console.log("ya nazhal na kknopkuuuuuuuuuuuuuuuuuuuuuu");
            }
        }
    });
});