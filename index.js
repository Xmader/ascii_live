var a = 1
var max = 360
var pics = []

const pad = (num, n) => {
    var i = (num + "").length;
    while (i++ < n) num = "0" + num;
    return num;
}

while (a > 0) {
    $.ajax(`pic/${pad(a, 3)}.txt`,{async:false})
        .done((txt) => {pics.push(txt);$("#pics").text(`加载中请稍后...\n${a}/${max}`)})
        .fail(() => { a = -1 })
    a++
}

const pics_iterator = pics[Symbol.iterator]();
const main = () => {
    $("#pics").text(pics_iterator.next().value)
}

const handle = setInterval(main, 100)