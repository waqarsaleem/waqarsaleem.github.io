document.getElementById('convertBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('status');
    if (fileInput.files.length === 0) {
        status.innerText = "Please select a file first.";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();
    status.innerText = "Processing file...";

    reader.onload = function(e) {
        try {
            const buffer = e.target.result;
            const offContent = convertAnyPlyToOff(buffer);
            downloadFile(offContent, file.name.replace('.ply', '.off'));
            status.innerText = "Success! .off file downloaded.";
        } catch (err) {
            status.innerText = "Error: " + err.message;
            console.error(err);
        }
    };
    
    // We read as ArrayBuffer to support binary byte-reading
    reader.readAsArrayBuffer(file);
});

function convertAnyPlyToOff(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder('utf-8');
    
    // 1. Read Header
    let offset = 0;
    let headerText = "";
    while (offset < buffer.byteLength) {
        const result = readLine(view, offset);
        headerText += result.text + "\n";
        offset += result.byteLength;
        if (result.text.trim() === "end_header") break;
    }

    const lines = headerText.split('\n');
    let format = "", numVertices = 0, numFaces = 0;
    let vProps = [], currentElement = "";

    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts[0] === "format") format = parts[1];
        if (parts[0] === "element") {
            currentElement = parts[1];
            if (currentElement === "vertex") numVertices = parseInt(parts[2]);
            if (currentElement === "face") numFaces = parseInt(parts[2]);
        }
        if (parts[0] === "property" && currentElement === "vertex") {
            // We only care about property type and name
            vProps.push({ type: parts[1], name: parts[2] });
        }
    });

    const xIdx = vProps.findIndex(p => p.name === 'x');
    const yIdx = vProps.findIndex(p => p.name === 'y');
    const zIdx = vProps.findIndex(p => p.name === 'z');

    if (xIdx === -1) throw new Error("Missing x, y, z properties in PLY header.");

    // --- CASE A: ASCII FORMAT ---
    if (format === "ascii") {
        const remainingText = decoder.decode(buffer.slice(offset));
        const dataLines = remainingText.split(/\r?\n/).filter(l => l.trim() !== "");
        
        let offOutput = `OFF\n${numVertices} ${numFaces} 0\n`;
        
        // Vertices
        for (let i = 0; i < numVertices; i++) {
            const parts = dataLines[i].trim().split(/\s+/);
            offOutput += `${parts[xIdx]} ${parts[yIdx]} ${parts[zIdx]}\n`;
        }
        // Faces
        for (let i = numVertices; i < numVertices + numFaces; i++) {
            offOutput += dataLines[i].trim() + "\n";
        }
        return offOutput;
    }

    // --- CASE B: BINARY FORMAT ---
    const isLe = (format === "binary_little_endian");
    const typeSize = { 'float': 4, 'double': 8, 'int': 4, 'uint': 4, 'short': 2, 'ushort': 2, 'char': 1, 'uchar': 1 };
    const vertexStride = vProps.reduce((sum, p) => sum + (typeSize[p.type] || 0), 0);

    let offOutput = `OFF\n${numVertices} ${numFaces} 0\n`;

    // Extract Binary Vertices
    for (let i = 0; i < numVertices; i++) {
        let x, y, z;
        let internalOffset = offset;
        vProps.forEach((p, idx) => {
            let val = 0;
            if (p.type === 'float') val = view.getFloat32(internalOffset, isLe);
            else if (p.type === 'double') val = view.getFloat64(internalOffset, isLe);
            else if (p.type === 'int') val = view.getInt32(internalOffset, isLe);
            
            if (idx === xIdx) x = val;
            if (idx === yIdx) y = val;
            if (idx === zIdx) z = val;
            internalOffset += typeSize[p.type];
        });
        offOutput += `${x} ${y} ${z}\n`;
        offset += vertexStride;
    }

    // Extract Binary Faces
    for (let i = 0; i < numFaces; i++) {
        const count = view.getUint8(offset); 
        offset += 1;
        let faceIndices = [count];
        for (let j = 0; j < count; j++) {
            faceIndices.push(view.getInt32(offset, isLe));
            offset += 4;
        }
        offOutput += faceIndices.join(" ") + "\n";
    }

    return offOutput;
}

// Helper: Read a single line from the buffer
function readLine(view, offset) {
    let str = "";
    let i = 0;
    while (offset + i < view.byteLength) {
        const b = view.getUint8(offset + i);
        if (b === 10) return { text: str, byteLength: i + 1 };
        if (b !== 13) str += String.fromCharCode(b);
        i++;
    }
    return { text: str, byteLength: i };
}

// Helper: Trigger download
function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}
