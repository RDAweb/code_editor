function insertBasicHTML(event) {
    // Check if Shift + 1 is pressed
    if (event.shiftKey && event.key === '!') {
        event.preventDefault(); // Prevent default action
        const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Document Title</title>
</head>
<body>

<!-- This is an HTML comment -->
<div id="myId" style="color: blue;">This is a div with an ID</div>
<div class="myClass" style="color: green;">This is a div with a class</div>

</body>
</html>`;
        
        // Insert the HTML template at the current cursor position
        const textarea = document.getElementById("htmlCode");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        // Update the textarea value
        textarea.value = value.substring(0, start) + htmlTemplate + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + htmlTemplate.length; // Move cursor to the end of the inserted template
    }
}

function runCode() {
    const htmlCode = document.getElementById("htmlCode").value;
    const cssCode = "<style>" + document.getElementById("cssCode").value + "</style>";
    const jsCode = "<script>" + document.getElementById("jsCode").value + "<\/script>";

    // Open a new tab
    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(htmlCode + cssCode + jsCode);
    newWindow.document.close();
}

function downloadCode() {
    const htmlCode = document.getElementById("htmlCode").value;
    const cssCode = "<style>" + document.getElementById("cssCode").value + "</style>";
    const jsCode = "<script>" + document.getElementById("jsCode").value + "<\/script>";

    // Combine all code into a single HTML file
    const completeCode = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Code</title>
${cssCode}
</head>
<body>
${htmlCode}
${jsCode}
</body>
</html>`;

    // Create a Blob from the combined code
    const blob = new Blob([completeCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger a download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-code.html';  // Default file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);  // Clean up
}

function handleKeyDown(event) {
    const target = event.target;
    const isTextArea = target.tagName === "TEXTAREA";

    if (isTextArea) {
        const lines = target.value.split('\n');
        const currentLineIndex = target.selectionStart === 0 ? 0 : target.value.substr(0, target.selectionStart).split('\n').length - 1;
        const currentLine = lines[currentLineIndex];

        // Handle Alt + Arrow Up
        if (event.altKey && event.key === 'ArrowUp') {
            event.preventDefault();
            if (currentLineIndex > 0) {
                const lineToMove = lines.splice(currentLineIndex, 1)[0]; // Remove current line
                lines.splice(currentLineIndex - 1, 0, lineToMove); // Insert above
                target.value = lines.join('\n'); // Update the textarea
                target.setSelectionRange(target.selectionStart - currentLine.length - 1, target.selectionStart - currentLine.length - 1); // Move cursor
            }
        }

        // Handle Alt + Arrow Down
        else if (event.altKey && event.key === 'ArrowDown') {
            event.preventDefault();
            if (currentLineIndex < lines.length - 1) {
                const lineToMove = lines.splice(currentLineIndex, 1)[0]; // Remove current line
                lines.splice(currentLineIndex + 1, 0, lineToMove); // Insert below
                target.value = lines.join('\n'); // Update the textarea
                target.setSelectionRange(target.selectionStart + currentLine.length + 1, target.selectionStart + currentLine.length + 1); // Move cursor
            }
        }

        // Handle Shift + Alt + Arrow Up (Copy line up)
        else if (event.shiftKey && event.altKey && event.key === 'ArrowUp') {
            event.preventDefault();
            if (currentLineIndex > 0) {
                const lineToCopy = lines[currentLineIndex]; // Get current line
                lines.splice(currentLineIndex - 1, 0, lineToCopy); // Insert above
                target.value = lines.join('\n'); // Update the textarea
                target.setSelectionRange(target.selectionStart - currentLine.length - 1, target.selectionStart - currentLine.length - 1); // Move cursor
            }
        }

        // Handle Shift + Alt + Arrow Down (Copy line down)
        else if (event.shiftKey && event.altKey && event.key === 'ArrowDown') {
            event.preventDefault();
            if (currentLineIndex < lines.length - 1) {
                const lineToCopy = lines[currentLineIndex]; // Get current line
                lines.splice(currentLineIndex + 1, 0, lineToCopy); // Insert below
                target.value = lines.join('\n'); // Update the textarea
                target.setSelectionRange(target.selectionStart + currentLine.length + 1, target.selectionStart + currentLine.length + 1); // Move cursor
            }
        }

        // Handle Shift + 1 (Insert Basic HTML)
        insertBasicHTML(event);
    }
}