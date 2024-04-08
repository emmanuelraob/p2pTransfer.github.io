var peer = new Peer();
var conn;

// Escuchar el evento 'open' para obtener la ID
peer.on('open', function(id) {
    document.getElementById('peer-id-display').textContent = id;
});

document.getElementById('connect-button').addEventListener('click', function() {
    var connectToPeerId = document.getElementById('connect-to-peer-id').value;
    if (connectToPeerId) {
        conn = peer.connect(connectToPeerId);
        
        conn.on('open', function() {
            document.getElementById('status').textContent = 'Conectado exitosamente a ' + connectToPeerId;
            // Permitir enviar archivos una vez conectado
            document.getElementById('send-file').disabled = false;
        });
    }
});

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

peer.on('connection', function(connection) {
    conn = connection;
    document.getElementById('status').textContent = 'Conexión entrante establecida';

    conn.on('data', function(jsonData) {
        var fileData = JSON.parse(jsonData);
        var fileName = fileData.name; // Correctamente asignado
        
        // Si enviaste los datos como base64, debes decodificarlos aquí
        const byteCharacters = atob(fileData.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        const blob = new Blob([byteArray]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
    });
});



document.getElementById('send-file').addEventListener('click', function() {
    document.getElementById('file-input').click(); // Abrir diálogo de selección de archivos
});

document.getElementById('file-input').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file && conn) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var base64data = arrayBufferToBase64(e.target.result);
            var fileData = {
                name: file.name,
                data: base64data
            };
            var jsonData = JSON.stringify(fileData);
            conn.send(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }
});
