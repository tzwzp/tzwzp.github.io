$('.nav li').hover(function() {
    $(this).children('dl').slideDown();
}, function() {
    $(this).children('dl').hide();
});


$('.menu').click(function() {
    $(this).toggleClass('xz')
});
$('.menu').click(function() {
    $('.menu_down').slideToggle()
});

var proli = $('.in_news_nav li'),
    prodea = $('.news_con .news_list');

for (var i = 0; i < proli.length; i++) {
    proli[i].id = i;
    proli[i].onmouseover = function() {
        for (var j = 0; j < proli.length; j++) {
            // 清除所有li上的class
            proli[j].className = '';
            prodea[j].style.display = 'none';
        }
        // 给当前的li添加切换样式
        this.className = 'choose';
        prodea[this.id].style.display = 'block';
    }
};