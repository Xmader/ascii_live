const pics_iterator = pics[Symbol.iterator]();

const main = () => {
    var pic = pics_iterator.next().value
    pic ? (document.getElementById("pics").innerText = pic) : clearInterval(handle)
}

const handle = setInterval(main, 100)