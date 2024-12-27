class FileHandler {
    constructor() {
        this.currentFile = null;
    }

    // 设置当前文件
    setFile(file) {
        this.currentFile = file;
    }

    // 获取文件信息
    getFileInfo() {
        if (!this.currentFile) {
            return {
                name: '未选择文件',
                size: '-',
                type: '-'
            };
        }

        //返回文件的信息数组
        return {
            name: this.currentFile.name,
            size: this.formatFileSize(this.currentFile.size),
            type: this.currentFile.type || '未知类型'
        };
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        //file.size单位是Bytes
        //将字节转换为KB、MB、GB
        //格式化
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        //i 表示单位的级别，比如 0 表示 Bytes，1 表示 KB，2 表示 MB，依此类推。
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 读取文件为二进制
    async readAsBinary() {
        if (!this.currentFile) return null;
        return new Promise((resolve, reject) => {
            //拿FileReader读取文件
            //FileReader 是浏览器提供的 API，用来异步读取文件内容。
            const reader = new FileReader();
            reader.onload = () => {
                // 创建 Uint8Array 来正确处理二进制数据
                const array = new Uint8Array(reader.result);
                // 将二进制数据转换为可读的格式
                const binaryString = Array.from(array)
                    .map(byte => byte.toString(2).padStart(8, '0'))
                    .join(' ');
                resolve(binaryString);
            };
            reader.onerror = () => reject(reader.error);
            //读取文件为 ArrayBuffer，是一种通用的二进制数据类型，可以用于各种数据处理任务。
            reader.readAsArrayBuffer(this.currentFile);  // 使用 ArrayBuffer 而不是 BinaryString
        });
    }

    // 读取文件为十六进制
    async readAsHex() {
        if (!this.currentFile) return null;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const array = new Uint8Array(reader.result);
                const hexString = Array.from(array)
                    .map(byte => byte.toString(16).padStart(2, '0'))
                    .join(' ');
                resolve(hexString);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(this.currentFile);
        });
    }

    // 添加文本读取方法
    async readAsText() {
        if (!this.currentFile) return null;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(this.currentFile, 'utf-8');  // 指定 UTF-8 编码
        });
    }

    saveToFile(content,fileName){
        //new Blob() 是 JavaScript 中用来创建 二进制大对象（Blob）的构造函数
        const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});

        //创建下载连接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        //添加到文档并自动触发点击下载
        document.body.appendChild(link);
        link.click();

        //清理？？？
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // 计算文件的校验和
    async calculateChecksum() {
        if (!this.currentFile) return null;
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const buffer = reader.result;
                    const array = new Uint8Array(buffer);
                    
                    // 计算简单校验和
                    let sum = 0;
                    for (const byte of array) {
                        sum = (sum + byte) % 256;
                    }

                    // 计算 CRC32（循环冗余校验）
                    let crc = 0xFFFFFFFF;
                    for (const byte of array) {
                        for (let i = 0; i < 8; i++) {
                            crc = (crc & 1) ? (crc >>> 1) ^ 0xEDB88320 : crc >>> 1;
                        }
                    }
                    crc = ~crc;

                    // 返回校验结果
                    const result = [
                        '=== 文件校验结果 ===',
                        `文件名: ${this.currentFile.name}`,
                        `文件大小: ${this.formatFileSize(this.currentFile.size)}`,
                        `校验和: ${sum.toString(16).padStart(2, '0')}`,
                        `CRC32: ${crc.toString(16).padStart(8, '0')}`,
                    ].join('\n');
                    
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(this.currentFile);
        });
    }
}