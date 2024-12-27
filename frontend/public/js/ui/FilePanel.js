//FilePanel.js 文件面板类，用于处理文件选择、拖拽、显示文件信息等操作
//调用FileHandler.js
class FilePanel {
    constructor() {
        // 获取DOM元素
        this.fileInput = document.getElementById('fileInput');
        //querySelector类选择器，用来查询匹配指定 CSS 选择器的第一个元素。
        this.uploadZone = document.querySelector('.upload-zone');
        this.fileName = document.querySelector('.file-name .value');
        this.fileSize = document.querySelector('.file-size .value');
        this.fileType = document.querySelector('.file-type .value');
        this.operationBtns = document.querySelectorAll('.operation-btn');

        // 绑定事件
        this.bindEvents();
    }

    bindEvents() {
        //文件选择
        //change事件：用户选择文件触发
        //调用handleFileSelect方法用于处理文件选择事件
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // 拖放事件
        //文件拖拽
        //添加dragover类名
        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('dragover');
        });
        
         //移除dragover类名
        this.uploadZone.addEventListener('dragleave', () => {
            this.uploadZone.classList.remove('dragover');
        });
        
        //松手时，drop事件触发，读取文件
        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
            //读取文件
            //dataTransfer是 drag 和 drop 事件对象的一个属性
            //It contains a list of the files that were dropped onto the drop target.
            const files = e.dataTransfer.files;
            if (files.length) {
                this.handleFile(files[0]);
            }
        });

        // 操作按钮事件
        this.operationBtns.forEach(btn => {
            //用btn.dataset.operation读取 data-operation 属性的值
            //重要：btn.dataset.operation 是 HTML 元素的 data-operation 属性值
            //已经传递了参数，后面直接用switch case处理
            btn.addEventListener('click', () => this.handleOperation(btn.dataset.operation));
        });
    }

    handleFileSelect(event) {
        //event:change事触发的对象
        //.target是触发事件的元素<input type="file">
        const file = event.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        // 使用 FileHandler 处理文件
        //这里拿到了文件
        window.fileHandler.setFile(file);
        const fileInfo = window.fileHandler.getFileInfo();
        
        // 更新界面显示
        //textContent是DOM属性，用于设置或返回指定元素的文本内容
        this.fileName.textContent = fileInfo.name;
        this.fileSize.textContent = fileInfo.size;
        this.fileType.textContent = fileInfo.type;
    }

    //这里用异步：因为FileReader是异步的
    //readAsBinary、readAsHex 和 readAsText 是异步操作。
    //这些方法依赖文件读取，而文件读取通常是耗时的任务。
    //await 前提：它只能在 async 函数中使用。
    async handleOperation(operation) {
        try {
            // 获取原始文件名（不含扩展名）
            const originalName = this.fileName.textContent.split('.')[0];
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

            switch (operation) {
                case 'binary':
                    //这里等待FileHandler.readAsBinary()完成
                    const binary = await window.fileHandler.readAsBinary();
                    // 确保输出的是 .txt 文件
                    const binaryFilename = `${originalName}_binary_${timestamp}.txt`;
                    window.fileHandler.saveToFile(binary, binaryFilename);
                    break;
                    
                case 'hex':
                    const hex = await window.fileHandler.readAsHex();
                    const hexFilename = `${originalName}_hex_${timestamp}.txt`;
                    window.fileHandler.saveToFile(hex, hexFilename);
                    break;

                case 'verify':
                    const checksum = await window.fileHandler.calculateChecksum();
                    if (checksum) {
                        const checksumFilename = `${originalName}_checksum_${timestamp}.txt`;
                        window.fileHandler.saveToFile(checksum, checksumFilename);
                    }
                    break;

                default:
                    console.log('Operation not implemented:', operation);
            }
        } catch (error) {
            console.error('Operation failed:', error);
        }
    }
}
