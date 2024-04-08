let peer = new Peer(); // Crea una nueva identidad en PeerJS
let conn;
let file;

peer.on('open', (id) => {
    console.log('Mi ID de PeerJS es:', id);
});

// Cuando el enviador prepara un archivo
function prepareFile() {
    let fileInput = document.getElementById('fileInput');
    file = fileInput.files[0];
    document.getElementById('senderStatus').textContent = 'Archivo preparado con ID: ' + peer.id;
}

// Cuando el receptor quiere recibir un archivo
function fetchFile() {
    let fileId = document.getElementById('fileId').value;
    conn = peer.connect(fileId);
    conn.on('open', () => {
        console.log('Conexión establecida con', fileId);
        conn.send('Solicitud de archivo');
    });
}

// Cuando el enviador recibe una solicitud de archivo
peer.on('connection', (connection) => {
    connection.on('data', (data) => {
        if (data === 'Solicitud de archivo') {
            connection.send(file);
            document.getElementById('senderStatus').textContent = 'Archivo enviado';
        }
    });
});

// Cuando el receptor recibe el archivo
conn.on('data', (data) => {
    if (data instanceof Blob) {
        let downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(data);
        downloadLink.download = 'archivo_recibido';
        downloadLink.click();
        document.getElementById('receiverStatus').textContent = 'Archivo recibido y descargado';
    }
});
