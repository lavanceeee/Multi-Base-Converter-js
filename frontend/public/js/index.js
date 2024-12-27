// 动态加载脚本的函数
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });
}
//异步函数，使用 await 来等待异步操作的结果
// 按顺序加载所需的脚本
//await loadScript 让程序可以有序加载脚本，同时不中断页面的其他操作。
//使用 await 确保脚本按顺序加载，解决了脚本之间可能的依赖问题。
//window 是 JavaScript 中的一个全局对象，代表了浏览器中运行的整个窗口（或全局环境）
//它们被挂载到全局作用域的 window 对象上
async function initializeApp() {
    try {
        // 1. 加载基础数据结构
        await loadScript('js/datastructures/Stack.js');
        await loadScript('js/datastructures/ArrayList.js');
        
        // 2. 加载算法实现
        await loadScript('js/algorithms/StackConverter.js');
        await loadScript('js/algorithms/ArrayConverter.js');
        await loadScript('js/algorithms/Recursive.js');
        
        // 3. 加载核心功能
        await loadScript('js/core/Converter.js');

        //加载弹窗
        await loadScript('js/ui/ModalManager.js');
        //初始化弹窗
        window.modalManager = new ModalManager();
        
        // 4. 初始化应用
        window.converter = new Converter();
        
        // 初始化文件处理功能
        await loadScript('js/core/FileHandler.js');
        await loadScript('js/ui/FilePanel.js');
        
        window.fileHandler = new FileHandler();
        window.filePanel = new FilePanel();

        //引入历史记录
        await loadScript('js/ui/HistoryManager.js');
        window.historyManager = new HistoryManager();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// 当 DOM 加载完成后初始化应用
// 使用 DOMContentLoaded 事件确保 initializeApp 函数在 HTML 和 DOM 元素加载完成后执行。
document.addEventListener('DOMContentLoaded', initializeApp);
