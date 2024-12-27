class ArrayList {
    constructor() {
        //初始化一个空数组
        this.items = new Array(1000);

        //数组长度
        this.size = 0;
    }

    //末尾添加元素
    add(element) {
        if (this.size >= this.items.length) {
            throw new Error('ArrayList is Full');
        }
        this.items[this.size++] = element;
    }


    //在指定位置添加元素
    insert(index,element){
        if(index<0 || index>this.size){
            throw new Error('Index out of bounds');
        }
        //index和后面所有数组元素后移
        for(let i = this.size;i>index;i--){
            this.items[i] = this.items[i-1];
        }
        this.items[index] = element;
        //指针大小加一
        this.size++;
    }

    //获取指定位置的元素
    get(index){
        if(index<0 || index>=this.size){
            throw new Error('Index out of bounds');
        }
        return this.items[index];
    }

    //删除指定位置元素并返回这个数
    remove(index){
        if(index<0 || index>=this/size){
            throw new Error('Index out of bounds');
        }
        const removed = this.items[index];
        //将其后的所以元素全部前移
        for(let i = index ; i<this.size-1 ; i++){
            this.items[i] = this.items[i+1];
        }
        //指针大小减一
        this.size--;
        return removed;
    }

    //清空数组
    clear(){
        this.size = 0;
        //有回收机制，不必在意
    }

    //获取数组大小
    length(){
        return this.size;
    }

    //判断数组是否为空
    isEmpty(){
        return this.size === 0;
    }
}