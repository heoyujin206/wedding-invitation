// 음악

function toggleMusic() {

    const music = document.getElementById("bgm")

    if (music.paused) {

        music.play()

    } else {

        music.pause()

    }

}


// 계좌 복사

function copyAccount() {

    const account = "123-456-789"

    navigator.clipboard.writeText(account)

    document.getElementById("copyMessage").innerText = "계좌번호가 복사되었습니다."

}


// 갤러리 확대

const images = document.querySelectorAll(".gallery img")

images.forEach(img => {

    img.addEventListener("click", () => {

        const popup = document.createElement("div")

        popup.style.position = "fixed"

        popup.style.top = "0"

        popup.style.left = "0"

        popup.style.width = "100%"

        popup.style.height = "100%"

        popup.style.background = "rgba(0,0,0,0.9)"

        popup.style.display = "flex"

        popup.style.justifyContent = "center"

        popup.style.alignItems = "center"

        const image = document.createElement("img")

        image.src = img.src

        image.style.maxWidth = "90%"

        popup.appendChild(image)

        document.body.appendChild(popup)

        popup.addEventListener("click", () => {

            popup.remove()

        })

    })

})

function shareURL() {

    const url = window.location.href

    navigator.clipboard.writeText(url)

    document.getElementById("shareMessage").innerText =
        "청첩장 링크가 복사되었습니다."

}

function createPetal() {

    const petal = document.createElement("div")

    petal.classList.add("petal")

    petal.style.left = Math.random() * window.innerWidth + "px"

    petal.style.animationDuration = (Math.random() * 5 + 5) + "s"

    document.querySelector(".petal-container").appendChild(petal)

    setTimeout(() => {
        petal.remove()
    }, 10000)

}

setInterval(createPetal, 500)