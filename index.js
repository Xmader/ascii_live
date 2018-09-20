/*!
 * ASCII字符画视频流 (https://www.xmader.com/ascii_live/)
 * 
 * Copyright (c) 2018 Xmader
 * Released under the MIT license
 * 
 * Source Code: https://github.com/Xmader/ascii_live
 * 
 * 部分代码参考了 https://gist.github.com/justjavac/6696499
 * 
 * 为了更好的兼容性，不使用任何ES6特性和新增语法
 * 
 * 如果你在这里发现了bug，请多多包涵，欢迎使用 https://github.com/Xmader/ascii_live/issues 向我提出。
 * 
*/

var video = document.getElementById("video1");
var cv = document.getElementById('cv');
var ctx = cv.getContext('2d');
var txtDiv = document.getElementById('txt');
var uploadBtn = document.getElementById("upload-button");

var font_size_range = document.getElementById("font_size_range")
var font_size_span = document.getElementById("font_size")
var footer = document.getElementById("footer")

var isFirefox = navigator.userAgent.indexOf("Firefox") > -1
var isWindows = navigator.userAgent.indexOf("Windows") > -1

if (isWindows) { // 中易宋体只在Windows系统中可用
    var scale_x = isFirefox ? 0.0895 : 0.1
}
else {
    var scale_x = 0.0835
}

var video_show = false

var font_size = 2 // ASCII字符画的字号，数值越小分辨率越高，占用的CPU百分比也就越高 (和占用的内存没有关系)，必须是2的倍数，单位: px (像素)

// 根据调整字号滑动条动态地改变ASCII字符画的字号
function change_font_size() {
    var n = +font_size_range.value // 获取的原始值是一个字符串，用"+"号将它转换成一个数字
    font_size_span.innerText = n

    txtDiv.style["transform"] = "scale(" + (n * scale_x) + "," + (n / 10) + ")"

    font_size = n

    convert() // 实时重绘，不需要等待额外的20毫秒

    font_size_range.scrollIntoView() // 调整字号结束后页面自动回到滑动条所在的位置
}

// 根据灰度生成相应字符
function toText(g) {
    if (g <= 30) {
        return '#';
    } else if (g > 30 && g <= 60) {
        return '&';
    } else if (g > 60 && g <= 120) {
        return '$';
    } else if (g > 120 && g <= 150) {
        return '*';
    } else if (g > 150 && g <= 180) {
        return 'o';
    } else if (g > 180 && g <= 210) {
        return '!';
    } else if (g > 210 && g <= 240) {
        return ';';
    } else {
        return ' ';
    }
}

// 根据rgb值计算灰度
function getGray(r, g, b) {
    return 0.299 * r + 0.578 * g + 0.114 * b;
}

// 转换
function convert() {
    var video_width = video.clientWidth
    var video_height = video.clientHeight
    var txtDiv_height = txtDiv.clientHeight

    cv.width = video_width
    cv.height = video_height

    txtDiv.style.left = video_show ?
        video_width + 10 + 'px'
        : "5px"

    footer.style["margin-top"] = video_show ?
        "0px"
        : (txtDiv_height * (font_size / 10)) + 'px'

    if (document.body.clientWidth < 767) { // 小屏幕设备
        var footer_margin_top = -txtDiv_height * (1 - font_size / 10) // (1 - font_size / 10) 可能会是负数

        if (footer_margin_top > 0) {
            footer_margin_top = (font_size - 10) * 12
        }

        footer.style["margin-top"] = footer_margin_top + "px"
    }

    ctx.drawImage(video, 0, 0, video_width, video_height)

    var imgData = ctx.getImageData(0, 0, video_width, video_height);
    var imgDataArr = imgData.data;
    var imgDataWidth = imgData.width;
    var imgDataHeight = imgData.height;
    var html = '';
    for (h = 0; h < imgDataHeight; h += font_size) {
        var p = '';
        for (w = 0; w < imgDataWidth; w += (font_size / 2)) {
            var index = (w + imgDataWidth * h) * 4;
            var r = imgDataArr[index + 0];
            var g = imgDataArr[index + 1];
            var b = imgDataArr[index + 2];
            var gray = getGray(r, g, b);
            p += toText(gray);
        }
        p += '\n';
        html += p;
    }
    txtDiv.innerHTML = html;
}

// 获取上传的视频文件
function getFile() {
    var reader = new FileReader();
    reader.readAsDataURL(uploadBtn.files[0]);

    video.src = "converting.mp4"
    video.poster = null

    reader.onload = function () {
        video.src = reader.result; // 是一个base64 Data URL字符串
        video.play()
    }
}

// 显示/隐藏原始视频
function toggle_video() {
    video.classList.toggle('hidden')
    video_show = !video_show
}

window.onload = function () {
    change_font_size()
    window.setInterval(convert, 20);
}

uploadBtn.onchange = getFile

txtDiv.onclick = function () {
    video.paused ? video.play() : video.pause()
}
