//添加历史类的删除复制等功能

class HistoryManager {
    constructor() {
        this.historyList = document.querySelector('.history-list');
        this.clearBtn = document.querySelector('.clear-history-btn');

        this.bindEvents();

        //从后端获取数据
        this.loadHistory();
    }

    bindEvents() {
        //清空历史按钮，调clearHistory()方法
        //使用箭头函数 () => this.clearHistory()：才可以当'click'触发时调用函数
        this.clearBtn.addEventListener('click', () => this.clearHistory());

        //复制按钮，调copyHistory()方法
        this.historyList.addEventListener('click', (e) => {
            //closest 是 DOM 元素的一个方法
            //用于从当前元素开始，沿着 DOM 树向上查找
            //找到第一个匹配指定选择器的祖先元素
            const copyBtn = e.target.closest('.history-copy-btn');

            //复制按钮，调用copyToClipboard()方法
            if (copyBtn) {
                //找到复制按钮的父元素，即历史记录项
                const historyItem = copyBtn.closest('.history-item');
                const output = historyItem.querySelector('.history-output').textContent;
                this.copyToClipboard(output);
            }
        });
    }

    // 加载历史记录
    async loadHistory() {
        try {
            const response = await fetch('http://localhost:3000/api/history');
            const history = await response.json();
            
            if (history.length === 0) {
                this.showEmptyHistory();
            } else {
                this.removeEmptyHistory();
                history.forEach(item => this.renderHistoryItem(item));
            }
        } catch (err) {
            console.error('Failed to load history:', err);
            this.showEmptyHistory();
        }
    }

    // 添加历史记录
    async addHistory(data) {
        try {
            console.log('发送历史记录到服务器:', data); // 添加日志
            const response = await fetch('http://localhost:3000/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log('服务器响应:', response); // 添加日志

            if (response.ok) {
                const newRecord = await response.json();
                console.log('新记录:', newRecord); // 添加日志
                this.removeEmptyHistory();
                this.renderHistoryItem(newRecord);
            }
        } catch (err) {
            console.error('保存历史记录失败:', err);
        }
    }

    // 清空历史记录
    async clearHistory() {
        try {
            await fetch('http://localhost:3000/api/history', {
                method: 'DELETE'
            });
            this.historyList.innerHTML = '';
            this.showEmptyHistory();
        } catch (err) {
            console.error('Failed to clear history:', err);
        }
    }

    // 渲染历史记录项
    renderHistoryItem(data) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-content">
                <div class="history-numbers">
                    <span class="history-input">${data.input_value}<sub>${data.input_base}</sub></span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="history-output">${data.output_value}<sub>${data.output_base}</sub></span>
                </div>
                <div class="history-info">
                    <span class="history-time">${new Date(data.created_at).toLocaleString()}</span>
                    <span class="history-algorithm">${data.algorithm}</span>
                </div>
            </div>
            <button class="history-copy-btn" title="复制结果">
                <i class="fas fa-copy"></i>
            </button>
        `;
        this.historyList.insertBefore(historyItem, this.historyList.firstChild);
    }

    //显示空历史记录？？这是在干啥
    showEmptyHistory() {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'history-empty';
        emptyMessage.textContent = '暂无历史记录';
        //将空历史记录添加到历史记录列表中
        this.historyList.appendChild(emptyMessage);
    }

    //因为当没有元素时页面实际上是上一个方法创建的元素，所以创建新的时候需要移除
    removeEmptyHistory() {
        const emptyMessage = this.historyList.querySelector('.history-empty');
        if (emptyMessage) {
            //remove() 方法用于从 DOM 中移除指定的元素
            emptyMessage.remove();
        }
    }

    //复制文本
    //需要用到异步：因为复制操作需要时间，所以需要等待复制完成后再执行其他操作
    async copyToClipboard(text) {
        try {
            //API：navigator.clipboard.writeText()
            //navigator 是一个全局对象，提供了与浏览器相关的信息和功能。
            //clipboard 是 navigator 对象的一个属性，用于处理剪贴板操作
            //writeText() 是 clipboard 对象的一个方法，用于将文本写入剪贴板
            await navigator.clipboard.writeText(text);
        } catch (error) {
            alert('复制出错了，请手动复制');
        }
    }
}
