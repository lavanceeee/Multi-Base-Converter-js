//构造转换对象
class Converter {

    //构造器
    constructor() {
        //默认输入和输出进制
        this.currentAlgorithm = 'stack'; //默认使用栈实现
        this.inputBase = 10; //默认输入十进制
        this.outputBase = 2; //默认输出二进制

        //获取DOM
        this.initElements();
        
        //绑定事件
        this.bindEvents();
        //设置默认状态
        this.setDefaultState();

        //初始化栈、数组和递归，new一个对象
        this.stackConverter = new StackConverter();
        this.arrayConverter = new ArrayConverter();
        this.recursiveConverter = new Recursive();

        //防抖 防抖（Debounce） 是一种优化技术，主要用于控制某些频繁触发的操作
        //比如输入框的监听、窗口大小变化等。
        // 让操作在触发一段时间后执行，如果在这段时间内再次触发，就重新计时
        this.inputElement.addEventListener('input',() => {
            // console.log('输入触发');
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout( () => {
                const result = this.convert();
                // console.log('转换结果:', result);
                if(result && this.inputElement.value){
                    // console.log('准备添加历史记录', {
                    //     input: {
                    //         value: this.inputElement.value,
                    //         base: this.inputBase
                    //     },
                    //     output: {
                    //         value: result,
                    //         base: this.outputBase
                    //     },
                    //     algorithm: this.currentAlgorithm
                    // });
                    window.historyManager.addHistory({
                        input: {
                            value: this.inputElement.value,
                            base: this.inputBase
                        },
                        output: {
                            value: result,
                            base: this.outputBase
                        },
                        algorithm: this.currentAlgorithm
                    });
                }
            },500);
        });
    }

    //获取DOM方法
    initElements() {
        //算法选择按钮
        this.algoButtons = document.querySelectorAll('.algo-btn');
        //输入区域进制选择按钮
        this.inputBaseButton = document.querySelector('.input-section .base-selector').querySelectorAll('.base-btn');
        //输出区域进制选择按钮
        this.outputBaseButton = document.querySelector('.output-section .base-selector').querySelectorAll('.base-btn');
        //输入输出框
        this.inputElement = document.querySelector('.number-input');
        this.outputElement = document.querySelector('.number-output');
    }

    //默认事件的设置
    //这个是在设置active状态，最后可删除
    setDefaultState() {
        this.algoButtons[0].classList.add('active');
    }

    //绑定事件
    bindEvents() {
        //算法切换事件
        this.algoButtons.forEach(button => {
            button.addEventListener('click', () => {
                //先移除所有的active状态
                this.algoButtons.forEach(btn => btn.classList.remove('active'));
                //给当前被点击的按钮添加active状态
                button.classList.add('active');
                //更新当前算法？？什么意思？？
                this.currentAlgorithm = button.dataset.algo;
                //更新当前输入进制
                this.convert();
            });
        });

        //输入进制切换
        this.inputBaseButton.forEach(button => {
            button.addEventListener('click', () => {
                //老样子，先移除所有的active状态
                this.inputBaseButton.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                //更新当前输入进制
                //dataset.base是按钮的进制字符串，将其转换成整数
                this.inputBase = parseInt(button.dataset.base);
                this.convert();
            });
        });

        //输出进制的切换
        this.outputBaseButton.forEach(button => {
            button.addEventListener('click', () => {
                this.outputBaseButton.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.outputBase = parseInt(button.dataset.base);
                this.convert();
            });
        });

        //输入框
        this.inputElement.addEventListener('input', () => this.convert());
    }

    convert() {
        //获取输入框的值
        const input = this.inputElement.value;
        if (!input) {
            this.outputElement.value = '';
            return '';
        }

        //正则验证。方法在下面
        if (!this.validateInput(input)) {
            this.outputElement.value = '输入有误，请重新输入！';
            return '';
        }

        let result;
        switch (this.currentAlgorithm) {
            case 'stack':
                result = this.convertByStack(input);
                break;
            case 'array':
                result = this.convertByArray(input);
                break;
            case 'recursive':
                result = this.convertByRecursive(input);
                break;
        }
        this.outputElement.value = result;
        return result;
    }

    validateInput(input) {
        // 根据不同的进制设置正则
        //类型为对象
        //如果进制为2，那么正则为0和1的组合

        const regex = {
            2: /^[0-1]+$/,  //用//包起来表示正则对象
            8: /^[0-7]+$/,  //+表示至少一个，*表示至少0个
            10: /^[0-9]+$/,
            16: /^[0-9A-Fa-f]+$/  //[a-zA-Z]匹配任意字母  //16进制是0-9，a-f
        };


        //返回一个布尔值用于判断
        //regex对象，传入键this.inputBase, 返回一个正则对象
        //test方法用于测试字符串是否匹配正则
        return regex[this.inputBase].test(input);
    }

    convertByStack(input) {
        return this.stackConverter.convert(input, this.inputBase, this.outputBase);
    }

    convertByArray(input) {
        return this.arrayConverter.convert(input, this.inputBase, this.outputBase);
    }

    convertByRecursive(input) {
        return this.recursiveConverter.convert(input, this.inputBase, this.outputBase);
    }
}