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

peer.on('connection', function(connection) {
    conn = connection;
    document.getElementById('status').textContent = 'Conexión entrante establecida';
    
    conn.on('data', function(data) {
        // Recibir y guardar el archivo
        var blob = new Blob([data]);
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'archivo_recibido';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
            var data = e.target.result;
            conn.send(data); // Enviar datos del archivo al par
        };
        reader.readAsArrayBuffer(file);
    }
});
