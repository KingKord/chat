const TIMEOUT = 1000000;

let socket; //Переменная, хранящая сокет подключения
let client = { //Переменная, хранящая свойства клиента
    connect: {
        id: "",
        name: ""
    },
    message: "",
    delInfo: false
};

let loadData = {
    data: {
        id: "",
        name: ""
    },
    message: ""
};
SetConnect();

let timer = setTimeout(kick,TIMEOUT);
function formatDate(dateString) {
    let date = new Date(dateString);

    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };

    return date.toLocaleString('en-US', options);
}

function getCookie(name) {
    const cookieString = decodeURIComponent(document.cookie);
    const cookies = cookieString.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }

    return null;
}


//Устанавливаем коннект с сервером и определяем реакцию на события
function SetConnect() {
//Подключаемся к серверу
    socket = new WebSocket("ws://localhost:3000");

//Метод onopen открывает соединение с сервером
    socket.onopen = function (e) {
        if (socket.OPEN === 1) {
            toLog("[open] Connected");
//Блокируем кнопку установки соединения и закрываем блок с интерфейсом коннекта к
            let nameValue = getCookie('name');

//Разблокируем кнопку отправки сообщения и открываем блок с интерфейсом отправки

            $("#BSubmit").attr("disabled", false);
            $("#MessageBlock").css("display", "");


//Отправляем имя для отображения в списке чата
            client.connect.name = nameValue;
        } else {
            toLog("Connection not found");
        }
    };
    /*
    * Метод onmessage определяет обработчик входящих сообщений, который
    * срабатывает каждый раз когда сервер присылает сообщение
    */
    socket.onmessage = function (event) {
        toLog(`[message] Data from server: ${event.data}`);
        let dataJSON = JSON.parse(event.data);
        if (dataJSON) {
            if (dataJSON.id_first !== undefined) {
//Если получено сообщение с идентификатором сервера
                client.connect.id = dataJSON.id_first;
                socket.send(JSON.stringify({"id": client.connect.id, "first_name": client.connect.name}));
            }
            if (dataJSON.name_first !== undefined) {
//Если получено сообщение с подтвержденным именем
                client.connect.name = dataJSON.name_first;
                // showMessage(client.connect.name + ": вошел в чат ", "");
                client.message = " вошел в чат ";
                send(client);
            }
            if (dataJSON.message !== undefined && dataJSON.message !== "") {

                showMessage(dataJSON.from_name + ": " + dataJSON.message, dataJSON.date);
            }
            if (dataJSON.deleteInfo === true) {
                kick("Вы были удалены с чата");
            }

        }
    };
    /*
* Метод onclose срабатывает при потере коннекта с сервером
*/
    socket.onclose = function (event) {
        if (event.wasClean) {
            toLog(`[close] Connection closed, code=${event.code} cause=${event.reason}`);
        } else {
            toLog('[close] Break connection cause ' + event.code, true);
        }
//Блокируем кнопку отправки сообщения и открываем блок с интерфейсом отправки

        $("#BSubmit").attr("disabled", true);
        $("#MessageBlock").css("display", "none");
//Разблокируем кнопку установки соединения и открываем блок с интерфейсом коннекта

        $("#ConnectOpen").attr("disabled", false);
        $("#ConnectBlock").css("display", "");
    };
    socket.onerror = function (error) {
        alert(`[error] ${error.message}`);
        toLog(`[error] ${error.message}`);
    };
}

//Отправляем сообщение на сервер
function SendMsg(f) {

    
    client.message = f.message.value;
    const str = client.message;
    let name, message;

    if (str.includes('[') && str.includes(']')) {
        const startBracketIndex = str.indexOf('[');
        const endBracketIndex = str.indexOf(']');
        name = str.substring(startBracketIndex + 1, endBracketIndex);
        message = str.substring(endBracketIndex + 2);
        let personal = {
            personal: {
                fromId: client.connect.id,
                fromName: client.connect.name,
                toName: name,
                message: message,
            }

        };
        send(personal);
    } else {
        send(client);
    }


    // send(client);
    const messageInput = document.getElementById('message');
    messageInput.value = '';
    messageInput.focus();
    return false;
}


function showMessage(message, date) {
    let messageElem = document.createElement('div');
    messageElem.classList.add('message');

    let messageText = document.createTextNode(message);
    messageElem.appendChild(messageText);

    let dateElem = document.createElement('span');
    dateElem.classList.add('message-date');
    let currentDate;
    if (date === "") {
        currentDate = new Date().toLocaleString();
    } else {
        currentDate = formatDate(date);
        $("#loadButton").remove();
    }
    let dateText = document.createTextNode(currentDate);
    dateElem.appendChild(dateText);
    messageElem.appendChild(dateElem);

    document.getElementById('messages').appendChild(messageElem);
}


// запись сообщения в лог#log
function toLog(msg, show) {
    let messageElem = document.createElement('div');
    let d = new Date();
//Форматируем дату и время
    dt = ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
    dt += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds();
    if (show) {
        alert(msg);
    }
    messageElem.appendChild(document.createTextNode(dt));
    messageElem.appendChild(document.createElement('br'));
    messageElem.appendChild(document.createTextNode(msg));
    document.getElementById('log').appendChild(messageElem);
}

//Определяем код, срабатывающий после загрузки всех элементов страницы и построения

window.onload = function () {
//Привязываем вызов функции SetConnect к событию клика по кнопке ConnectOpen

    document.forms.publish.onsubmit = function () {
        return SendMsg(this);
    };

    document.getElementById('loadButton').addEventListener('click', function () {
        loadData.data.id = client.connect.id;
        loadData.data.name = client.connect.name;


        send(loadData);

    });
    // Кнопка удалить пользователя показывает overlay
    document.getElementById('deleteButton').addEventListener('click', function() {

        document.getElementById('overlay').style.display = 'flex';
    });

    // Кнопки скрыть окно и удалить в окне overlay
    document.getElementById('closeButton').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
    });

    document.getElementById('delButton').addEventListener('click', function () {
        // Отправляю JSON c кодификатором deleteData
        let deleteData = {
            deleteData: {
                id: "",
                name: "",
                message: ""
            },
        };
        deleteData.deleteData.id = client.connect.id;
        deleteData.deleteData.name = client.connect.name;
        console.log(document.getElementById('delInput').value);
        deleteData.deleteData.message = document.getElementById('delInput').value;
        console.log(deleteData.deleteData.message.value);



        send(deleteData);
        document.getElementById('overlay').style.display = 'none';

    });

    document.getElementById('dragButton').addEventListener('click', function () {

    });
};


function kick(msg) {
    document.cookie = "name=name; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    console.log(getCookie('name'));
    if (msg) {
        alert(msg);
    } else {
        alert("Вы были исключены за неактивность");
    }
    location.reload();


    client.message = "вышел с чата";
    client.delInfo = true;
    send(client);
    client.delInfo = false;
}

function send(data) {

    clearTimeout(timer);
    socket.send(JSON.stringify(data));
    timer = setTimeout(kick, TIMEOUT);
}

