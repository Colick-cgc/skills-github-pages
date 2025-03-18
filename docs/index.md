# (⊙ᗜ⊙)

!!! note inline "关于我"

    :crystal_ball: 当你打开这个网页，我们已在促膝长谈  
    :gift: 这个网站是我送给自己的20岁生日礼物  
    :page_facing_up: KARMA —— 因果关系  
    :dvd: 实际上是郑润泽的一首歌哈哈哈  
    
!!! note inline "学校/专业/学习"

    :school: 河南-开封-河南大学  
    :mortar_board: 本科金融数学大三在读  
    :computer: 微微喜欢编程:material-language-python: | :material-language-java:  
    :mag_right: 理论学的很差，喜欢实践  
    
!!! success inline "星座/MBTI/性格"

    :aries: 白羊座  
    :boy: ESFJ  
    :feet: 性格一般  
    :cyclone: 容易多愁善感  
    
!!! success inline "晃晃悠悠"

    :earth_africa: 曾长居平顶山，现居开封  
    :airplane: 喜欢旅游但没钱  
    > 试图努力赚钱，走遍祖国。


- 💻 PC端：点击顶部导航栏选择主题，左侧查看目录；
- 📱 移动端：点击左上角图标选择内容；
- 🔍 搜索：支持中文检索。


<script>
function updateTime() {
    var date = new Date();
    var now = date.getTime();
    var startDate = new Date("2022/12/29 09:10:12");
    var start = startDate.getTime();
    var diff = now - start;
    var y, d, h, m;
    y = Math.floor(diff / (365 * 24 * 3600 * 1000));
    diff -= y * 365 * 24 * 3600 * 1000;
    d = Math.floor(diff / (24 * 3600 * 1000));
    h = Math.floor(diff / (3600 * 1000) % 24);
    m = Math.floor(diff / (60 * 1000) % 60);
    if (y == 0) {
        document.getElementById("web-time").innerHTML = d + "<span class=\"heti-spacing\"> </span>天<span class=\"heti-spacing\"> </span>" + h + "<span class=\"heti-spacing\"> </span>小时<span class=\"heti-spacing\"> </span>" + m + "<span class=\"heti-spacing\"> </span>分钟";
    } else {
        document.getElementById("web-time").innerHTML = y + "<span class=\"heti-spacing\"> </span>年<span class=\"heti-spacing\"> </span>" + d + "<span class=\"heti-spacing\"> </span>天<span class=\"heti-spacing\"> </span>" + h + "<span class=\"heti-spacing\"> </span>小时<span class=\"heti-spacing\"> </span>" + m + "<span class=\"heti-spacing\"> </span>分钟";
    }
    setTimeout(updateTime, 1000 * 60);
}
updateTime();
function toggle_statistics() {
    var statistics = document.getElementById("statistics");
    if (statistics.style.opacity == 0) {
        statistics.style.opacity = 1;
    } else {
        statistics.style.opacity = 0;
    }
}
</script>
