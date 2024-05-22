const $ =  document.querySelector.bind(document)
const $$ =  document.querySelectorAll.bind(document)

const nameSong = $('.header__play-music-name-song')
const singerSong = $('.header__play-music-info-song')
const imgSong = $('.header__play-music-item-img')
const audioSong = $('#audio')
const btnPlay = $('#audio-play')
const btnPrevious = $('#audio-previous')
const btnNext = $('#audio-next')
const audioRange = $('.header__play-music-play-range')
const btnRandom = $('.header__play-music-random')
const btnRepeat = $('.header__play-music-repeat')
const loopSong = audioSong.loop = false
const playList = $('.container')
const PLAY_STORAGE_KEY = 'Players'

const app = {
    currIndex : 0,
    isPlaying : false,
    isRandom : false,
    config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Ngủ một mình",
            singer: 'Hieuthuhai',
            path: './music/NguMotMinhtinhRatTinh-HIEUTHUHAINegavKewtiie-8397765.mp3',
            img: './music-img/ngumotminh.jpg'
        },
        {
            name: "Từng là",
            singer: 'Vũ Cát Tường',
            path: './music/TungLa-VuCatTuong-13962415.mp3',
            img: './music-img/tungla.jpg'
        },
        {
            name: "Đại Minh Tinh",
            singer: 'Văn Mai Hương',
            path: './music/DaiMinhTinh-VanMaiHuongHuaKimTuyen-11747544.mp3',
            img: './music-img/dai-minh-tinh.png'
        },
        {
            name: "Tháng Tư Là Lời Nói Dối Của Em ",
            singer: 'Hà Anh Tuấn',
            path: './music/ThangTuLaLoiNoiDoiCuaEm-HaAnhTuan-4609544.mp3',
            img: './music-img/thang-tu-loi-noi-doi-cua-em.png'
        },
        {
            name: "DYNAMIC DUO (Single)",
            singer: 'HIEUTHUHAI, HURRYKNG',
            path: './music/DynamicDuo-HIEUTHUHAIHURRYKNG-7136501.mp3',
            img: './music-img/DYNAMICDUO(Single).png'
        },
        {
            name: "Hãy Trao Cho Anh",
            singer: 'Sơn Tùng M-TP, Snoop Dogg',
            path: './music/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3',
            img: './music-img/hay-trao-cho-anh.jpg'
        },
    ],

    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config))
    },

    getSong: function (){
        nameSong.innerText = this.songs[this.currIndex].name
        singerSong.innerText = this.songs[this.currIndex].singer
        imgSong.src = this.songs[this.currIndex].img
        audioSong.src = this.songs[this.currIndex].path
        return this.songs[this.currIndex]
    },

    // lấy tất cả bài hát
    render: function() {
        const htmls = this.songs.map((song, index)=> {
            return `            
                <div class="list-song-block ${index == this.currIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="list-song-item">
                        <div class="list-song-play">
                            <img class="list-song-img" src="${song.img}" alt="" srcset="">
                        </div>
                        <div class="list-song-info">
                            <h3>${song.name}</h3>
                            <p>${song.singer}</p>
                        </div>
                        <div class="list-song-time">4:50</div>
                        <div class="list-song-love">
                            <i class="list-song-love-icon fa-regular fa-heart"></i>
                        </div>
                    </div>
                </div>`
        })
        // console.log($('.container'))
        playList.innerHTML = htmls.join("\n")
    },
    loadConfig: function (){
        this.isRandom = this.config.isRandom
        audioSong.loop = this.config.isRepeat

        if (this.isRandom) {
            btnRandom.classList.add('active')
        }
        if (audioSong.loop) {
            btnRepeat.classList.add('active')
        }
    },

    nextSong: function(){
        this.currIndex ++
        if (this.currIndex >= this.songs.length) {
            this.currIndex = 0
        }
        this.getSong()
        this.render()
        this.scrollSong()
    },
    randomSong: function(){
        let currIndexNext = 0
        do {
            currIndexNext = Math.floor(Math.random() * this.songs.length)
        } while(this.currIndex == currIndexNext)
            this.currIndex = currIndexNext
        this.getSong()
        this.render()
        this.scrollSong()
    },

    backSong: function(){
        this.currIndex --
        if (this.currIndex < 0) {
            this.currIndex = this.songs.length-1
        }
        this.getSong()
        this.render()
        this.scrollSong()
    },

    scrollSong: function(){
        setTimeout(()=>{
            $('.list-song-block.active').scrollIntoView({
                behavior:'smooth',
                block: 'end',
            })
        },200)
    },

    handleEvent: function(){
        _this = this;
        // Xử lí ẩn hình ảnh khi kéo trang
        const musicImg  = $('.header__play-music-item-img')
        const musicImgWidth = 150;


        // Đĩa quay

        const imgSongAnimation =  imgSong.animate([
            {transform : 'rotate(360deg)'}
        ],{
            duration : 15000,
            iterations : Infinity,
        })

        imgSongAnimation.pause()
        document.onscroll   = function () {
            const scroll = document.documentElement.scrollTop
            const newWidthImg = musicImgWidth - scroll
            musicImg.style.width = newWidthImg > 0 ? newWidthImg + 'px': 0
            musicImg.style.height = newWidthImg > 0 ? newWidthImg + 'px': 0
            musicImg.style.opacity = newWidthImg / musicImgWidth
        }

        // xử lí khi lick play
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audioSong.pause()
            } else {
                audioSong.play()
            }

            if (audioRange.value > 0) {
                audioRange.value = audioRange.value
            }else {
                audioRange.value = 0
            }
            
            audioRange.max = audioSong.duration
        }

        // khi audio play
        audioSong.onplay = function () {
            _this.isPlaying = true
            btnPlay.classList.replace('fa-circle-play', 'fa-circle-pause' )
            imgSongAnimation.play()
        }
        audioSong.onpause = function () {
            _this.isPlaying = false
            btnPlay.classList.replace('fa-circle-pause', 'fa-circle-play' )
            imgSongAnimation.pause()
        }

        // Khi audio play thời gian chạy  
        audioSong.ontimeupdate = function () {
            audioRange.value = audioSong.currentTime
        }

        // Xử lí khi tua audio 
        audioRange.oninput = function () {
            audioSong.currentTime = audioRange.value
        }
        audioRange.onmouseout = function () {
            audioRange.title = audioRange.value
        }

        // xử lí khi next audio
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.nextSong()
            }
            audioSong.play()
        }
        // xử lí khi previous audio
        btnPrevious.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            }
            else {
                _this.backSong()
            }
            audioSong.play()
        }

        // xử lí khi bấm random audio
        $('.header__play-music-random').mouseenter = () => $('.header__play-music-random').classList.add('active')
        btnRandom.onclick = function () {
            _this.isRandom =!_this.isRandom
            btnRandom.classList.toggle('active', this.isRandom)
            _this.setConfig('isRandom', _this.isRandom)
        }

        // phát lại
        btnRepeat.onclick = function () {
            audioSong.loop = !audioSong.loop
            $('.header__play-music-repeat').classList.toggle('active', audioSong.loop)
            _this.setConfig('isRepeat', audioSong.loop)
        }

        // auto bài tiếp theo theo thứ tự
        audioSong.onended = function () {
            btnNext.click()
        }

        playList.onclick = function (event) {
            let songNode = event.target.closest('.list-song-block:not(.active')
            if (songNode || event.target.closest('.list-song-love')){
                _this.currIndex = songNode.dataset.index
                _this.getSong()
                _this.render()
                _this.scrollSong()
            }
        }
    },

    start: function () {
        this.loadConfig()
        this.setConfig()
        this.handleEvent()
        this.render()
        this.getSong()
        console.log(audioSong.loop)
    }

}

app.start()