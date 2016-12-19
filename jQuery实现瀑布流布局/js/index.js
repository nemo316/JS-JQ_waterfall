// 当页面加载完毕
$(window).on('load', function () {
    // 1. 实现瀑布流布局
    waterFall();
    // 2. 滚动加载
    $(window).on('scroll', function () {
        // 是否加载
        if (checkWillLoad()){
            // 创建新数据
            var newData = {'data':[{'src':'0.jpg'}, {'src':'4.jpg'}, {'src':'14.jpg'},
                {'src':'24.jpg'}, {'src':'7.jpg'}, {'src':'3.jpg'}, {'src':'6.jpg'}]};
            // 遍历创建新的标签
            $.each(newData.data, function (index, value) {
                var newBox = $('<div>').addClass('box').appendTo($('#main'));
                var newPicBox = $('<div>').addClass('pic').appendTo($(newBox));
                $('<img>').attr('src', 'images/' + $(value).attr('src')).appendTo($(newPicBox));
            })
            // 实现瀑布流布局
            waterFall();
        }
    })
});

// 1. 实现瀑布流布局
function waterFall(){
    // 拿到所有的盒子
    var allBox = $('#main .box');
    // 取出其中一个盒子的宽度
    // var boxWidth = $(allBox).eq(0).width(); // 不包含margin padding等宽度
    var boxWidth = $(allBox).eq(0).outerWidth(); // 包含margin padding等宽度
    // 取出屏幕的宽度
    var screenWidth = $(window).width();
    // 求出列数
    var cols = Math.floor(screenWidth / boxWidth);
    // 父标签居中
    $('#main').css({
        'width': cols * boxWidth + 'px',
        'margin': '0 auto'
    });
    // 对子盒子定位
    var heightArrray = [];
    // 遍历
    $.each(allBox, function (index, value) {
        // 取出单独盒子的高度
        var boxHeight = $(value).outerHeight();
        // 将第一行所有盒子的高度放入数组
        if (index < cols){
            heightArrray[index] = boxHeight;
        }else { // 非第一行
            // 取出高度数组中最矮的高度
            var minBoxHeight = Math.min.apply(this, heightArrray);
            // 取出最矮高度对应的索引
            var minBoxIndex = $.inArray(minBoxHeight, heightArrray);
            // 定位
            $(value).css({
                'position': 'absolute',
                'top': minBoxHeight + 'px',
                'left': minBoxIndex * boxWidth + 'px'
            }) ;
            // 更新数组中最矮盒子的高度(此时最矮盒子的高度变为了之前高度+此时拼接的盒子高度)
            heightArrray[minBoxIndex] += boxHeight;
        }

    });

}
// 判断是否符合加载条件
function checkWillLoad() {
    // 拿到最后一个盒子
    var lastBox = $('#main .box').last();
    // 求出最后一个盒子(高度的一半+头部偏离的距离)
    var lastBoxDis = $(lastBox).outerHeight() + $(lastBox).offset().top;
    // 求出浏览器屏幕的高度
    var clientHeight = $(window).height();
    // 求出偏离屏幕的高度
    var scrollTopHeight = $(window).scrollTop();
    // 判断是否具备加载条件 (当最后一个盒子高度的一般+头部偏离的距离 <= 浏览器的高度+偏离屏幕的高度)
    return lastBoxDis <= clientHeight + clientHeight;
}