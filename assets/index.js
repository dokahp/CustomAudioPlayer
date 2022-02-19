let audio = new Audio('./assets/audio/beyonce.mp3');
let isPlay = false;
let trackNumber = 0;
let radioNumber = 0;
let isRadio = false;
let radioList = []
let radioPage = 0
let API = 'https://de1.api.radio-browser.info/json/stations/search?limit=10&language=english&hidebroken=true&order=clickcount&reverse=true'
let trackList = [{'artist': 'Beyonce', 'track': "Don't Hurt Yourself", 'img': 'beyonce.png', 'song':"beyonce.mp3"}, 
{'artist': 'Dua Lipa', 'track': "Don't Start Now", 'img': 'dontstartnow.png', 'song':"dontstartnow.mp3"},
{'artist': 'Bob Dylan', 'track': "Knockin' On Heaven's Door", 'img': 'bobdylan.jpg', 'song': 'bobdylan.mp3'},
{'artist': 'Lil Nas X', 'track': "Old Town Road", 'img': 'LilNasX.jpg', 'song': 'LilNasX.mp3'}]
let playBtn = document.querySelector('.play-pause')
let trackProgress = document.querySelector('.track-progress')
let currentTime = document.querySelector('.time-now')
let prevBtn = document.querySelector('.prev')
let nextBtn = document.querySelector('.next')
let artist = document.querySelector('.artist')
let songTitle = document.querySelector('.song-title')
let background = document.querySelector('.blury-image')
let trackImage = document.querySelector('.track-image')
let audioDuration = document.querySelector('.full-time')
let returnToPlayList = document.querySelector('.switch-to-playlist')
let volume = document.querySelector('.volume')
let volumeImg = document.querySelector('.volume-img')
let repeatBtn = document.querySelector('.repeat')
let alert = document.querySelector('.alert')
let audioDownloadLink = document.querySelector('.download-link')
let nextRadioBtn = document.querySelector('.next-radio')
let prevRadioBtn = document.querySelector('.prev-radio')
audioDownloadLink.href = audio.src

const play = () => {
    playBtn.src = "./assets/png/pause.png"
    isPlay? '': isPlay = !isPlay
    audio.play()
}
const pause = () => {
    playBtn.src = "./assets/png/play.png"
    isPlay? isPlay = !isPlay: ''
    audio.pause()
}
const checkPlay = (isPlay) => {
    isPlay? pause(): play()
}
const playAudio = (number) => {
    if (number < 0) {
        trackNumber = trackList.length - 1
    } else if (number >= trackList.length) {
        trackNumber = 0
    }
    audio.src = `./assets/audio/${trackList[trackNumber].song}`
    audioDownloadLink.href = audio.src
    artist.textContent = trackList[trackNumber].artist
    songTitle.textContent = trackList[trackNumber].track
    background.style.setProperty('--image', `url('./img/${trackList[trackNumber].img}')`)
    trackImage.src = `./assets/img/${trackList[trackNumber].img}`
    isPlay? audio.play(): audio.pause()
}
const prevTrack = () => {
    isRadio? prevRadio(): playAudio(--trackNumber)
}
const nextTrack = () => {
    if (isRadio) {
        nextRadio()
    } else {
        if (!audio.loop) {
            trackNumber++
        }
        playAudio(trackNumber)
    }
}
const prevRadio = () => {
    if (radioNumber == 0) {
        document.querySelector(`[data-number="9"]`).click()
    } else {
        document.querySelector(`[data-number="${--radioNumber}"]`).click()
    }
}
const nextRadio = () => {
    if (radioNumber < 9) {
        document.querySelector(`[data-number="${++radioNumber}"]`).click()
    } else {
        document.querySelector(`[data-number="0"]`).click()
    }
}
const duration = () => {
    document.querySelector('.full-time').textContent = audio.duration
}
const timeTextFormat = (duration) => {
    let minutes = Math.floor(duration / 60)
    let seconds = Math.floor(duration - Math.floor(duration / 60) * 60)
    return `${minutes}:${seconds < 10? '0'+ seconds: seconds }`
}
const changeProgressBar = () => {
    isRadio? trackProgress.value = trackProgress.max: trackProgress.value = audio.currentTime
    currentTime.textContent = timeTextFormat(audio.currentTime) 
}
audio.addEventListener('loadedmetadata', function() {
    isRadio? audioDuration.textContent = 'Online playing': audioDuration.textContent = timeTextFormat(audio.duration);
    isRadio? trackProgress.max = "Infinity": trackProgress.max = audio.duration;
});
audio.addEventListener('timeupdate', () => {
    changeProgressBar()
    if (trackProgress.value == Math.floor(audio.duration)) {
        nextTrack()
        audio.currentTime = 0
        changeProgressBar()
    }
})
trackProgress.addEventListener('change', () => {
    audio.currentTime = trackProgress.value
})
volume.addEventListener('change', () => {
    volume.value == 0? volumeImg.src = './assets/svg/mute.svg' : volumeImg.src = './assets/svg/sound.svg'
    audio.volume = volume.value / 100
})
volumeImg.addEventListener('click', () => {
    if (audio.volume > 0) {
        volumeImg.src = './assets/svg/mute.svg'
        audio.volume = 0
        volume.value = 0
    } else {
        volumeImg.src = './assets/svg/sound.svg'
        audio.volume = 1
        volume.value = 100
    }
})

window.addEventListener('beforeunload', () => {
    trackProgress.value = 0
    volume.value = 100

})
playBtn.addEventListener('click', () => checkPlay(isPlay))
prevBtn.addEventListener('click', prevTrack)
nextBtn.addEventListener('click', nextTrack)
returnToPlayList.addEventListener('click', () => {
    isRadio = false
    playAudio(trackNumber)
    returnToPlayList.style.setProperty('display', 'none')
})
repeatBtn.addEventListener('click', () => {
    audio.loop = !audio.loop
    repeatBtn.classList.toggle('active')
})

const playRadio = (event) => {
    let parentDiv
    isRadio = true
    event.target.childNodes.length > 1? parentDiv = event.target: parentDiv = event.target.parentElement
    returnToPlayList.style.setProperty('display', 'block')
    trackImage.src = parentDiv.children[0].src
    background.style.setProperty('--image', `url('./img/radio.jpg')`)
    audio.src = parentDiv.dataset.url
    audioDownloadLink.href = audio.src
    radioNumber = parentDiv.dataset.number
    if (parentDiv.children[1].textContent.length > 25) {
        artist.textContent = parentDiv.children[1].textContent.slice(0, 25) + '...'
    } else {
        artist.textContent = parentDiv.children[1].textContent
    }
    songTitle.textContent = 'Online Radio'
    play()
}
const setRadioList = (data) => {
    let allStations = document.querySelectorAll('.station-btn')
    for (let i = 0; i < data.length; i++) {
        allStations[i].dataset.url = data[i].url
        allStations[i].dataset.number = i
        if (data[i].favicon == '') {
            allStations[i].children[0].src = './assets/svg/radio.svg'
        } else {
            allStations[i].children[0].src = data[i].favicon
        }
        allStations[i].children[1].textContent = data[i].name
    }
    allStations.forEach(station => station.addEventListener('click', e => playRadio(e)))
}

const getRadioList = (data) => {
    radioList = [...radioList, ...data]
    setRadioList(data)
}

audio.addEventListener('error', () => {
    // Если браузер не может воспроизвести радио иммитируем клик по следующей радиостанции
    nextRadio()
    alert.style.opacity = 1
    setTimeout(() => alert.style.opacity = 0, 3000)
})
// RADIO
// codec=AAC&codec=MP3
fetch(API)
  .then((response) => {
    return response.json();
  })
  .then((data) => getRadioList(data));


nextRadioBtn.addEventListener('click', () => {
    if (radioPage + 1 < radioList.length / 10) {
        setRadioList(radioList.slice((radioPage + 1) * 10, (radioPage + 2) * 10))
    } else {
        if (API.includes('&offset')) {
            API = API.replace(/offset=\d+/, `&offset=${radioList.length}`)
        } else {
            API += `&offset=${radioList.length}`
        }
        fetch(API)
            .then((response) => {
            return response.json();
        })
        .then((data) => getRadioList(data));
    }
    prevRadioBtn.style.display = 'block'
    radioPage += 1
})
prevRadioBtn.addEventListener('click', () => {
    setRadioList(radioList.slice((radioPage - 1) * 10, radioPage * 10))
    radioPage -= 1
    if (radioPage == 0) {
        prevRadioBtn.style.display = 'none'
    }
})