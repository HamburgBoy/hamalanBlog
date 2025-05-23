---
statistics: True
---

# Hamalan's Blog
<div id="rcorners2">
    <div id="rcorners1" class="date-display">
        <p class="p1"></p>
    </div>

    <style>
        /* 将rcorners2居中，但不显示背景 */
        #rcorners2 {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 10vh; /* 占用的视口高度 */
            padding: 10px;
            background: none; /* 移除背景 */
        }
    
        /* 设置日期显示区域的样式 */
        .date-display {
            color: #ffffff; /* 白色字体 */
            font-size: 60px;
            font-weight: bold;
            padding: 20px 60px;
            border-radius: 15px;
            background: linear-gradient(to right, #a1c2e7, #788bb8); /* 渐变 */
            text-align: center;
        }
    </style>
    
    <script defer>
        function format(newDate) {
            const day = newDate.getDay();
            const y = newDate.getFullYear();
            const m = newDate.getMonth() + 1 < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
            const d = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
            const h = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
            const min = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
            const s = newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds();
            const dict = {1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 0: "天"};
    
            return `${y}年${m}月${d}日 ${h}:${min}:${s} 星期${dict[day]}`;
        }
    
        const timerId = setInterval(() => {
            const newDate = new Date();
            const p1 = document.querySelector(".p1");
            if (p1) {
                p1.textContent = format(newDate);
            }
        }, 1000);
    </script>
</div>
<br>
<center>
    <font color="#788bb8" size="6" class="ml3">念念不忘，必有回响！</font>
</center>


<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"></script>
<script>
    var textWrapper = document.querySelector('.ml3');
    textWrapper.innerHTML = textWrapper.textContent.replace(/./g, "<span class='letter'>$&</span>");

    anime.timeline({ loop: true })
        .add({
            targets: '.ml3 .letter',
            opacity: [0, 1], // 透明度从0到1
            translateX: [40, 0], // 每个字母从右侧40px移动到原位
            easing: "easeOutExpo", // 缓动效果
            duration: 1200, // 每个字母动画持续时间
            delay: (el, i) => 150 * i // 每个字母动画之间的延迟
        })
        .add({
            targets: '.ml3',
            opacity: 0, // 整体文本透明度变为0
            duration: 1000, // 整体文本淡出动画时间
            easing: "easeOutExpo",
            delay: 1000 // 在淡出前停留一段时间
        });
</script>

***

<div class="grid cards" markdown>

-   :octicons-bookmark-16:{ .lg .middle } __推荐阅读__

    ---

    - [Pytorch学习笔记](https://hamburgboy.github.io/hamalanBlog/extra_learning/Pytorch/Tensor/)
    - [Tmux学习笔记](https://hamburgboy.github.io/hamalanBlog/extra_learning/tmux/description/)


-   :simple-github:{ .lg .middle } __关于我__

    ---

    - 主修信电学院信息工程
    - 辅修竺可桢学院工程教育高级班

</div>

***

!!! quote ""
    <div class="center-text">
    上一次更新时间：{{ git_revision_date_localized }}<br>
    <br>
    目前Hamalan's Blog共 {{ pages }} 页，约 {{ words }} 个字
    </div>



<figure markdown="span">
    ![Homepage Wallpaper Dark Mode](./images/home.jpg#only-dark){ width="900" }
    ![Homepage Wallpaper Light Mode](./images/home.jpg#only-light){ width="900" }
    <figcaption>-- 传说浩瀚银河有颗星是他 --</figcaption>
</figure>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mouse Chase</title>
    <style>
        .img {
            width: 50px;
            height: 50px;
            position: absolute;
            background-image: url('./images/fulilian.png');
            background-size: cover;
        }
    </style>
</head>
<body>
    <div class="experience"></div>
    <div class="img"></div>

    <!-- 引入 JavaScript 文件 -->
    <script src="./assets/javascripts/chase.js"></script>
    <script src="./assets/javascripts/meteor.js"></script>
</body>
</html>

***
<body>
    <font color="#B9B9B9">
        <p style="text-align: center;">
            <span>本站已经运行</span>
            <span id='box1'></span>
        </p>
        <div id="box1"></div>
        <script>
            function timingTime() {
                let start = '2025-04-26 00:00:00';
                let startTime = new Date(start).getTime();
                let currentTime = new Date().getTime();
                let difference = currentTime - startTime;
                let m = Math.floor(difference / 1000);
                let mm = m % 60; // 秒
                let f = Math.floor(m / 60);
                let ff = f % 60; // 分钟
                let s = Math.floor(f / 60); // 小时
                let ss = s % 24;
                let day = Math.floor(s / 24); // 天数
                return day + "天" + ss + "时" + ff + "分" + mm + '秒';
            }
            setInterval(() => {
                document.getElementById('box1').innerHTML = timingTime();
            }, 1000);
        </script>
    </font>
</body>

