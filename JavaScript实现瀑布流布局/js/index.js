// $ 函数名  id 参数
function $(id) {
    return typeof id == 'string' ? document.getElementById(id) : id;
}
// 当网页加载完毕后要执行的操作
window.onload = function () {
    // 瀑布流布局
    waterFall('main', 'box');

    // 滚动加载盒子
    window.onscroll = function () {
    if (checkWillLoad()){
        // 创建新数据
        var newData = {'data':[{'src':'0.jpg'}, {'src':'4.jpg'}, {'src':'14.jpg'},
            {'src':'24.jpg'}, {'src':'7.jpg'}, {'src':'3.jpg'}, {'src':'6.jpg'}]};
        for (var i = 0; i < newData.data.length; i ++){
            // 创建盒子
            var newBox = document.createElement('div');
            newBox.className = 'box';
            $('main').appendChild(newBox);
            // 创建里面的盒子
            var newPicBox = document.createElement('div');
            newPicBox.className = 'picBox';
            newBox.appendChild(newPicBox);
            // 创建图片
            newImg = document.createElement('img');
            newImg.src = 'images/' + newData.data[i].src;
            newPicBox.appendChild(newImg);
        }
        // 实现瀑布流布局
        waterFall('main', 'box');
    }


    }
    
}

// 实现瀑布流布局(参数:父盒子,子盒子)
function waterFall(parent, child) {

    // ----------盒子居中----------

    // 1.1 获取所有的子盒子
    var  allBox = $(parent).getElementsByClassName(child);
    // 1.2 求出单个盒子的宽度
    var boxWidth = allBox[0].offsetWidth;
    // 1.3 求出浏览器当前宽度
    var screenWidth = document.body.clientWidth;
    // 1.4 求出列数(取整)
    var cols = Math.floor(screenWidth / boxWidth);
    // 1.5 父盒子居中 (块级标签内容居中,设置宽度,让后margin:0, auto)
    $(parent).style.width = boxWidth * cols + 'px';
    $(parent).style.margin = '0 auto';
    // ----------子盒子定位----------

    // 1.1 定义一个高度数组
    var heightArray = [];
    // 1.2 遍历所有的盒子
    for(var i = 0; i < allBox.length; i ++){
        // 1.2.1 求出单个盒子的高度
        var boxHeight = allBox[i].offsetHeight;
        // 1.2.2 存储第一排的所有盒子的高度
        if (i < cols){
            heightArray.push(boxHeight);
        }else { // 需要定位的盒子
            // 1.2.3 求出最矮盒子的高度
            var minBoxHeight = Math.min.apply(this, heightArray);
            // 1.2.4 求出最矮盒子对应的索引
            var minBoxIndex = getMinBoxIndex(heightArray, minBoxHeight);
            // 1.2.5 盒子定位
            allBox[i].style.position = 'absolute';
            allBox[i].style.top = minBoxHeight + 'px';
            allBox[i].style.left = minBoxIndex * boxWidth + 'px';
            // 1.2.6 更新数组中最矮盒子的高度(此时最矮盒子的高度变为了之前高度+此时拼接的盒子高度)
            heightArray[minBoxIndex] += boxHeight;
        }

    }
    console.log(heightArray);


}

// 获取最矮盒子对应的索引
function getMinBoxIndex(array, value) {
    for (var i in array){
        if (value == array[i]) return i;
    }
}
// 判断是否符合加载条件
function checkWillLoad() {
    // 取出所有的盒子
    var allBox = $('main').getElementsByClassName('box');
    // 取出最后一个盒子
    var lastBox = allBox[allBox.length - 1];
    // 求出最后一个盒子(高度的一半+头部偏离的距离)
    var lastBoxDis = lastBox.offsetHeight * 0.5 + lastBox.offsetTop;
    // 求出浏览器的高度(标准模式和混杂模式:累加所有元素的高度)
    var screenHeight = document.body.clientHeight || document.documentElement.clientHeight;
    console.log(screenHeight);
    // 求出偏离屏幕的高度
    var scroolTopHeight = document.body.scrollHeight;
    // 判断是否具备加载条件 (当最后一个盒子高度的一般+头部偏离的距离 <= 浏览器的高度+偏离屏幕的高度)
    return lastBoxDis <= (screenHeight + scroolTopHeight);
}