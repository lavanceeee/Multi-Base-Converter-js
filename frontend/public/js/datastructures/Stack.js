//栈结构的实现
class Stack{
    constructor(){
        this.items = new Array(1000); //初始化一个数组并分配空间
        //栈顶指针
        this.top=-1;
    }

    //入栈操作，push()
    push(element){
        if(this.isFull()){
            throw new Error('Stack is full');
        }
        //栈顶指针先加1再赋值
        this.items[++this.top] = element;
    }

    //出栈pop()
    pop(){
        if(this.isEmpty()){
            throw new Error('Stack is empty');
        }
        //先取出值，栈顶指针再减一
        return this.items[this.top--];
    }

    //查看栈顶元素的值
    peek(){
        if(this.isEmpty()){
            throw new Error ('Stack is empty');
        }
        return this.items[this.top];
    }

    //判断栈空
    isEmpty(){
        return this.top === -1;
    }

    //判断栈满
    isFull(){
        return this.top === this.items.length -1;
    }

    //返回栈的长度
    size(){
        return this.top + 1; 
    }

    //清空栈
    clear(){
        this.top = -1;
        //一旦没有任何变量指向 this.items 数组，它就会被垃圾回收。
        //JS的垃圾回收机制
    }
}