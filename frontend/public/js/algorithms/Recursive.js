//递归的方法，不需要任何的数据结构
//递归的本质是函数调用自身

class Recursive {

    //老规矩，先将任意进制转换成10进制
    toDecimal(number, fromBase) {
        //如果字符串为空则返回0
        if (number.length === 0) return 0;

        //基本的递归思路
        //取最后一个字符->切片->递归  直到字符串为空

        //.slice()只用在数组和字符串上
        //slice(start,end) 或者 slice(start)
        //或者可以用number.charAt(number,length-1)
        const LastChar = number.slice(-1).toUpperCase();

        const remainingChars = number.slice(0,-1); //不包括-1

        const value = LastChar >= 'A' ? LastChar.charCodeAt(0) - 'A'.charCodeAt(0) + 10 : parseInt(LastChar,fromBase);

        //递归计算十进制结果
        //递归地*fromBase 每次递归都相当于在原来的基础上乘以fromBase
        return this.toDecimal(remainingChars,fromBase) * fromBase + value;  
    }


    //十进制转目标进制，递归实现
    //基本思路：传入是十进制数和目标进制 -> 取余数 
    fromDecimal(number,toBase){
        //如果商为零，则返回'',空字符串，结束
        if(number === 0) return '';

        //计算余数
        const remainder = number % toBase;
        //计算商
        const quatient = Math.floor(number / toBase);

        //处理16进制的情况
        const digit = remainder >= 10 ? String.fromCharCode('A'.charCodeAt(0) + remainder - 10) : remainder.toString();

        //递归调用 递归处理商，同时累加当前余数
        return this.fromDecimal(quatient,toBase) + digit;
    }

    //主函数
    convert(number,fromBase,toBase){
        if(number === 0) return '0';
        
        const decimal = this.toDecimal(number,fromBase);
        return this.fromDecimal(decimal,toBase);
    }
}

