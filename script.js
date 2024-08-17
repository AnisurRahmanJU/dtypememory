document.addEventListener('DOMContentLoaded', function() {
    const dataTypes = document.querySelectorAll('.draggable');
    const memoryLayout = document.getElementById('memoryLayout');
    const memorySizeDisplay = document.getElementById('memorySizeDisplay');
    const generateMemorySizeButton = document.getElementById('generateMemorySize');
    const clearLayoutButton = document.getElementById('clearLayout');
    const statusMessage = document.getElementById('statusMessage');

    let memorySize = 0;
    let currentOffset = 0;

    // Initialize drag-and-drop functionality
    dataTypes.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.size);
            e.dataTransfer.setData('type', e.target.dataset.type);
        });
    });

    memoryLayout.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    memoryLayout.addEventListener('drop', function(e) {
        e.preventDefault();
        const size = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const type = e.dataTransfer.getData('type');
        addMemoryBlock(size, type);
    });

    generateMemorySizeButton.addEventListener('click', function() {
        const randomSize = Math.floor(Math.random() * 15) + 1; // Random size between 1 and 15 bytes
        memorySize = randomSize + 1; // Add 1 byte
        memorySizeDisplay.textContent = `Memory Size: ${memorySize} bytes`;
        updateMemoryLayout();
    });

    clearLayoutButton.addEventListener('click', function() {
        memoryLayout.innerHTML = '';
        currentOffset = 0;
        statusMessage.textContent = '';
        updateMemoryLayout();
    });

    function updateMemoryLayout() {
        memoryLayout.innerHTML = ''; // Clear current layout
        currentOffset = 0;
        for (let i = 0; i < memorySize; i++) {
            const cell = document.createElement('div');
            if (i === memorySize - 1) {
                cell.className = 'memory-cell memory-disabled'; // Last cell disabled
            } else {
                cell.className = 'memory-cell memory-cell-null'; // Null terminator
                cell.textContent = '\0'; // Display null character
            }
            cell.dataset.address = i;
            memoryLayout.appendChild(cell);
        }
    }

    function addMemoryBlock(size, type) {
        if (currentOffset + size > memorySize - 1) {
            statusMessage.textContent = 'Error: Not enough memory space!';
            return;
        }

        let blockClass = '';
        switch (type) {
            case 'int':
                blockClass = 'memory-block-int';
                break;
            case 'float':
                blockClass = 'memory-block-float';
                break;
            case 'char':
                blockClass = 'memory-block-char';
                break;
            case 'string':
                blockClass = 'memory-block-string';
                break;
        }

        for (let i = 0; i < size; i++) {
            const cell = memoryLayout.children[currentOffset + i];
            if (cell && !cell.classList.contains('memory-disabled')) {
                cell.className = 'memory-cell ' + blockClass;
            }
        }

        currentOffset += size;

        if (currentOffset < memorySize - 1) {
            const remainingSpace = memorySize - currentOffset;
            if (remainingSpace > 0) {
                addPaddingBlock(remainingSpace);
            }
        }
    }

    function addPaddingBlock(size) {
        for (let i = 0; i < size; i++) {
            const cell = memoryLayout.children[currentOffset + i];
            if (cell) {
                cell.className = 'memory-cell memory-padding';
            }
        }
    }
});
