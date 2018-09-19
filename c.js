var video = document.getElementById("video1");
var cv = document.getElementById('cv');
var ctx = cv.getContext('2d');
var txtDiv = document.getElementById('txt');
var uploadBtn = document.getElementById("upload-button");

var font_size = 2 // ASCII字符画的字号，数值越小分辨率越高，占用的CPU也就越高 (和占用的内存没有关系)，必须是2的倍数，单位: px (像素)

// 根据调整字号滑动条动态地改变ASCII字符画的字号
function chang_font_size() {
    var txt_style = document.getElementById("txt").style

    var n = +document.getElementById("font_size_range").value
    document.getElementById("font_size").innerText = n

    txt_style["font-size"] = txt_style["line-height"] = n + "px" // 设置ASCII字符画显示区域的字号和行高为设置的数值

    font_size = n
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
        return '&ensp;'; // 此处不能用&nbsp;，因为正常的空格在等宽字体中和其它字符不等宽，要用en空格代替
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

    cv.width = video_width
    cv.height = video_height

    txtDiv.style.width = video_width + 'px';

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
function getFile(file) {
    var reader = new FileReader();
    reader.readAsDataURL(uploadBtn.files[0]);

    video.src = ".mp4"
    video.poster = null

    reader.onload = function () {
        video.src = reader.result; // 是一个base64 Data URL字符串
        video.play()
    }
}

video.addEventListener('play', function () {
    window.setInterval(convert, 20);
}, false);

window.onload = function () {
    chang_font_size()
    convert()
}

uploadBtn.onchange = getFile
