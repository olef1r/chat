function response (data) {
    let resp = data.responseText;
    try {
        if (data.message != void (0)) {
            resp = data.message;
        } else {
            resp = JSON.parse(data.responseText);
            resp = resp.message;
        }
    } catch (e) {}
    return resp;
}

$(".logout-btn").on('click', e => {
    e.preventDefault();
    $.ajax({
        url: '/logout',
        type: 'POST',
        data: {},
        success: (res) => {
            //alert(response(res));
            location.reload();
        },
        error: (res) => {
            alert(response(res));
        }
    });
});

$(document).ready(() => {
    let socket = io.connect('http://localhost:8080');
    socket.on('connected', msg  => {
        socket.emit('receiveAll');
    });

    socket.on('message', addMessage);
    socket.on('messageValidation', () => {
        alert('Text is less than 200 s')
    });

    socket.on('history', messages => {
        for (let message of messages) {
            addMessage(message);
        }
    });

    $('.chat-message button').on('click', e => {
        e.preventDefault();

        let selector = $("textarea[name='message']");
        let messageText = selector.val().trim();
        if(messageText !== '') {
            socket.emit('msg', messageText);
            selector.val('');
        }
    });

    function encodeHTML (str){
        return $('<div/>').text(str).html();
    }

    function addMessage(message) {
        message.date = (new Date(message.date)).toLocaleString();
        message.username = encodeHTML(message.username);
        message.text = encodeHTML(message.text);

        var html = `
            <li>
                <div class="message-data">
                    <span class="message-data-name">${message.username}</span>
                    <span class="message-data-time">${message.date}</span>
                </div>
                <div class="message my-message" dir="auto">${message.text}</div>
            </li>`;

        $(html).hide().appendTo('.chat-history ul').slideDown(200);

        $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
    }
});