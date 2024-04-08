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
    
    // Suponiendo que 'conn' es tu conexión WebRTC
    conn.onmessage = async function(event) {
        // Decodificamos el objeto JSON recibido
        var fileData = JSON.parse(event.data);
        
        // Aquí convertimos los datos codificados en base64 de nuevo a un formato binario
        const byteCharacters = atob(fileData.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        // Crear un Blob con los datos del archivo
        const blob = new Blob([byteArray]);
        
        // Crear un enlace y descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileData.name); // Utilizamos el nombre original del archivo
        document.body.appendChild(link);
        link.click();
        
        // Opcional: Limpieza
        window.URL.revokeObjectURL(url); // Liberar el objeto URL
        link.remove(); // Remover el enlace del DOM
    };
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
            // Crear un objeto que incluya los datos del archivo y el nombre del archivo
            var fileData = {
                name: file.name, // Incluye la extensión del archivo
                data: data
            };
            // Convertir el objeto a una cadena JSON
            var jsonData = JSON.stringify(fileData);
            // Enviar la cadena JSON
            conn.send(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }
});
