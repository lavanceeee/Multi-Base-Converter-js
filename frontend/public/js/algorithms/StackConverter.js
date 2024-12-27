//单独的文件的话需要上来写一个类

class StackConverter {

    constructor() {
        //引入创建的栈结构并创建一个叫stack的实例
        this.stack = new Stack();
    }

    //先将任意进制转换成10进制
    //toDecimal自定义方法 第一个参数是值，第二个是进制            
    toDecimal(number, fromBase) {
        this.stack.clear(); //先清空栈
        let decimal = 0;

        //将数字转换成字符串，转大写并按单个字母分割。
        //digits是一个数组
        const digits = number.toString().toUpperCase().split('');

        for (let digit of digits) {
            //处理16进制的情况
            //一个字符，返回0号位置的Unicode编码
            //右将其转换成数字
            const value = digit >= 'A' ? digit.charCodeAt(0) - 'A'.charCodeAt(0) + 10 : parseInt(digit, fromBase);
            //push方法在数组的末尾添加元素
            //push()方法模拟入栈
            this.stack.push(value);
        }

        //出栈并计算
        // pointer代表指数
        let pointer = 0;
        while (!this.stack.isEmpty()) {
            decimal += this.stack.pop() * Math.pow(fromBase, pointer);
            pointer++;
        }
        return decimal;
    }

    //将十进制转换成目标进制
    fromDecimal(decimal, toBase) {
        this.stack.clear(); //将栈清空

        let number = decimal;

        //用取余法，取余并压入栈
        //number/tobase：直到商为0就停止
        while (number > 0) {  //这里只能是>0不能等于零，就会导致一个问题->如果输入0就变成空字符串了
            this.stack.push(number % toBase);
            number = Math.floor(number / toBase);
        }

        //出栈，并转换成一个字符串
        let result = '';
        while (!this.stack.isEmpty()) {
            const digit = this.stack.pop();
            //拼接到result上
            //同时处理转换成16进制的可能性
            // String.fromCharCode() 通过偏移量生成对应字符
            //A'.charCodeAt(0) + digit - 10 偏移量
            result += digit >= 10 ? String.fromCharCode('A'.charCodeAt(0) + digit - 10) : digit.toString();
        }

        return result || '0';   //考虑输入了0的情况，原因在while循环的判断
    }

    //主函数
    convert(number, fromBase, toBase) {
        if (number === '0') return '0';
        const decimal = this.toDecimal(number, fromBase);
        return this.fromDecimal(decimal, toBase);
    }
}