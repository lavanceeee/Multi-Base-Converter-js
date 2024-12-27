class ArrayConverter {
    //构造函数，初始化一个自定义的数组
    constructor() {
        this.array = new ArrayList();
    }

    //老样子，先转十进制
    toDecimal(number, fromBase) {
        ///清空数组
        this.array.clear();

        //先转换成一个字符数组
        const digits = number.toString().toUpperCase().split('');
        let decimal = 0;

        //数组的话就是遍历，拿索引对应指数从而得到结果
        //将每一位数字存储到数组
        for (let digit of digits) {
            const value = digit >= 'A' ? digit.charCodeAt(0) - 'A'.charCodeAt(0) + 10 : parseInt(digit,fromBase);
            this.array.add(value);
        }

        for (let i = this.array.length()-1; i >=0; i--) {
            decimal += this.array.get(i) * Math.pow(fromBase, this.array.length()-1-i);
        }
        return decimal;
    }

    //十进制转目标进制
    fromDecimal(decimal, toBase) {
        this.array.clear();

        //熟悉的取余法
        let number = decimal;

        //考虑输入零的情况，因为如果没有这一步就直接导致输出空字符串，无法进入while循环
        if (decimal === 0) return '0';

        //取余法 先不管16进制的问题
        while (number > 0) {
            this.array.add(number % toBase);
            number = Math.floor(number / toBase); //向下取整   
        }

        let result = ''; 
        //需要倒着遍历，因为前面的是正着来的
        for(let i = this.array.length() - 1 ; i >= 0 ; i--){
            const digit = this.array.get(i);
            result += digit > 10 ? String.fromCharCode('A'.charCodeAt(0) + digit - 10 ) : digit.toString();
        }
        return result;
    }

    //主函数
    convert(number, fromBase, toBase) {
        if (number === '0') return '0';
        const decimal = this.toDecimal(number, fromBase);
        return this.fromDecimal(decimal, toBase);
    }
}