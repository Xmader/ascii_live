var a = 1

const pad = (num, n) => {
    var i = (num + "").length;
    while (i++ < n) num = "0" + num;
    return num;
}

const main = () => {
    $.get(`pic/${pad(a, 3)}.txt`)
        .done(
            (txt) => {
                $("#pics").text(txt)
                a++
            }
        )
        .fail(() => clearInterval(handle))
}

const handle = setInterval(main, 100)