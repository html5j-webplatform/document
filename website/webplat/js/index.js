let $id = (id) => { return document.getElementById(id); }
let thisPage;

let stateManager = {
    isRenderedEventList: false,
    isReanderdMovieList:false,
    ctrl_previousPage: null,
    ctrl_previousIndicator: null
};

const VIEW_TOP = 'viewTop',
    VIEW_OTHER = 'viewOther',
    VIEW_STATEMENT = 'viewStatement',
    VIEW_POLICY = 'viewPolicy',
    VIEW_EVENT = 'viewEvent',
    VIEW_MOVIE = 'viewMovie';

const VIEW_HEADER_IMAGES = {
    'viewStatement': 'images/PCtopStatement.png',
    'viewEvent': 'images/PCtopEvent.png',
    'viewMovie': 'images/PCtopMovie.png',
    'viewPolicy': 'images/PCtopPolicy.png'
}

const VIEW_HEADER_SP_IMAGES = {
    'viewStatement': 'images/SPtopStatement.png',
    'viewEvent': 'images/SPtopEvent.png',
    'viewMovie': 'images/SPtopMovie.png',
    'viewPolicy': 'images/SPtopPolicy.png'
}

const RESPONCIVE_BREAKPOINT = 750;

document.addEventListener('DOMContentLoaded', (event) => {
    if (document.documentElement.clientWidth >= RESPONCIVE_BREAKPOINT) {
        thisPage = new PCfunctions();
        thisPage.PC = true;
    } else {
        thisPage = new Mobilefunctions();
        thisPage.PC = false;
    }
    thisPage.setControls().setHandlers().initControls();
});

window.onresize = () => {
    if (document.documentElement.clientWidth >= RESPONCIVE_BREAKPOINT) {
        if (thisPage.PC) return;
        thisPage = null;
        thisPage = new PCfunctions();
        thisPage.PC = true;
    } else {
        if (!thisPage.PC) return;
        thisPage = null;
        thisPage = new Mobilefunctions();
        thisPage.PC = false;
    }
    thisPage.setControls().setHandlers().initControls();
}

//既定クラス
class ViewController {
    setControls(nameOfCtrls) {
        this.ctrl_pgTopButton = $id('pgTopButton');
        this.crtl_vwTop = $id(VIEW_TOP);
        this.crtl_vwOther = $id(VIEW_OTHER);
        this.crtl_vwStatement = $id(VIEW_STATEMENT);
        this.crtl_vwPolicy = $id(VIEW_POLICY);
        this.crtl_vwEvent = $id(VIEW_EVENT);
        this.crtl_vwMovie = $id(VIEW_MOVIE);
        if (!stateManager.ctrl_previousPage) stateManager.ctrl_previousPage = this.crtl_vwTop;

        this.ctrl_gotoTopLabel = $id(nameOfCtrls.vwTopButton);
        this.ctrl_vwStatementButton = $id(nameOfCtrls.vwStatementButton);
        this.ctrl_vwEventButton = $id(nameOfCtrls.vwEventButton);
        this.ctrl_vwMovieButton = $id(nameOfCtrls.vwMovieButton);
        this.ctrl_vwJoinusButton = $id(nameOfCtrls.vwJoinusButton);
        this.ctrl_vwPolicyButton = $id(nameOfCtrls.vwPolicyButton);
        this.ctrl_vwContactButton = $id(nameOfCtrls.vwContactButton);

        this.ctrl_eventList_vwTop = $id('eventlist-vwTop');
        this.ctrl_eventList_vwEvent = $id('block-event-list');
        this.ctrl_movieList_vwTop = $id('movielist-vwTop');
        this.ctrl_movieList_vwMovie = $id('block-flex-movie-container');

        this.ctrl_vwHeader_image = $id('vwHeader-img');

    }

    initControls() {
        
        let thisClass = this;

        (() => {
            //json を取得してテンプレートをバインドする
            if (stateManager.isRenderedEventList) return;
            const OLD_EVENS_JSON_URL = 'data/events.json';
            const DOOR_KEEPER_URL = 'https://connpass.com/api/v1/event/?series_id=2894';
            const NO_IMAGE_URL = 'images/webplat-logo-box225.png';
            const NO_SAMLL_IMAGE_URL = 'images/webplat-logo-small.png';
            fetch(OLD_EVENS_JSON_URL).then(function (response) {
                return response.json();
            }).then(function (json) {
                thisClass.ctrl_eventList_vwTop.style.width = (230 * (json.length + 2)) + 'px';
                for (let jsonItem of json) {
                    if (new Date(jsonItem.datetime) > new Date()) {
                        jsonItem.className = 'element-event-indicator-yet';
                    } else {
                        jsonItem.className = 'element-event-indicator-done';
                    }
                    if (jsonItem.image === '') {
                        jsonItem.image = NO_IMAGE_URL
                        jsonItem.smallImage = NO_SAMLL_IMAGE_URL;
                    } else {
                        jsonItem.smallImage = jsonItem.image;
                    };
                }
                DOMTemplate.bindTemplate(thisClass.ctrl_eventList_vwTop, json, DOMTemplate.oderBy.DESC);
                DOMTemplate.bindTemplate(thisClass.ctrl_eventList_vwEvent, json, DOMTemplate.oderBy.DESC);
                stateManager.isRenderedEventList = true;
            });
        })();

        (() => {
            if (stateManager.isReanderdMovieList) return;
            const API_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyAR1x_ygG9amPOuBt5G4GAPPlrfLXhDMkI&part=snippet&playlistId=PLPK9jxaA7cq-OOZx9c0qTL_Z9Su1kla1-&maxResults=50';
            const MOVIE_URL_PLEFIX = 'https://www.youtube.com/watch?v=';
            const NO_IMAGE_URL = 'images/webplat-logo-box225.png';
            let binditems = [];
            fetch(API_URL).then(function (response) {
                return response.json();
            }).then(function (json) {
                var playlistItems = json.items;
                if (playlistItems) {
                    thisClass.ctrl_movieList_vwTop.style.width = (225 * (playlistItems.length + 2)) + 'px';
                    for (let moveItem of playlistItems) {
                        let item = moveItem.snippet,
                        binditem = {};
                        binditem.title = item.title;
                        binditem.description = item.description;
                        binditem.datetime = item.publishedAt;
                        binditem.url = MOVIE_URL_PLEFIX + item.resourceId.videoId;
                        binditem.image = item.thumbnails.medium.url;
                        binditems.push(binditem);
                        item = null;
                    }
                }
                DOMTemplate.bindTemplate(thisClass.ctrl_movieList_vwTop, binditems, DOMTemplate.oderBy.DESC);
                DOMTemplate.bindTemplate(thisClass.ctrl_movieList_vwMovie, binditems, DOMTemplate.oderBy.DESC);
                stateManager.isReanderdMovieList = true;
            });
        })();
    }

    //view 切り替えのハンドラをセット
    setHandler(menu, view, indicator) {
        menu.addEventListener('click', () => {
            if (indicator) {
                this.AfterworkForIndicator(indicator);
            }
            this.changeView(view);
        });
    }

    hndrPgTop() {
        let scrolled = window.scrollY;
        window.scrollTo(0, Math.floor(scrolled / 2));
        if (scrolled > 0) {
            window.setTimeout(thisPage.hndrPgTop, 30);
        }
    }

    //View を切り替える
    changeView(viewCtrl) {
        stateManager.ctrl_previousPage.style.display = 'none';
        if (viewCtrl.id == VIEW_TOP) {
            this.ctrl_gotoTopLabel.style.display = 'none';
            this.crtl_vwOther.style.display = 'none';
        } else {
            this.crtl_vwOther.style.display = 'block';
            this.ctrl_gotoTopLabel.style.display = 'block';
        }
        viewCtrl.style.display = 'block';
        stateManager.ctrl_previousPage = viewCtrl;
        if(thisPage.PC){ 
            this.ctrl_vwHeader_image.src = VIEW_HEADER_IMAGES[viewCtrl.id];
        }else{
            this.ctrl_vwHeader_image.src = VIEW_HEADER_SP_IMAGES[viewCtrl.id];
        }

    }

    requestJson(url) {
        //const url = 'http://192.168.1.101:8001/';
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            let retJson = json;
        });
    }
}

//モバイル画面用クラス
class Mobilefunctions extends ViewController {
    constructor() {
        super();
        this.menuIdicatorColorTable = {
            'viewStatement': '#E4007F',
            'viewEvent': '#FFD800',
            'viewMovie': '#009944',
            'hbg-indicator-joinus': '#00A0E9',
            'viewPolicy': '#9F9F9F'
        };
    }
    setControls() {
        let nameOfCtrls = {
            vwTopButton: 'block-hbg-logo',
            vwStatementButton: 'hbg-statement',
            vwEventButton: 'hbg-event',
            vwMovieButton: 'hbg-movie',
            vwJoinusButton: 'hbg-joinus',
            vwPolicyButton: 'hbg-policy',
            vwContactButton: 'hbg-mail'
        };
        super.setControls(nameOfCtrls);

        this.ctrl_hbgButton = $id('element-hbg-button');
        this.ctrl_hbgMenu = $id('block-hbg-menu');
        this.ctrl_hbgBracket = $id('block-hbg-bracket');
        this.ctrl_hbgClose = $id('element-hbg-close');
        this.ctrl_vwStatementIndicator = $id('hbg-indicator-statement');
        this.ctrl_vwEventIndicator = $id('hbg-indicator-event');
        this.ctrl_vwMovieIndicator = $id('hbg-indicator-movie');
        this.ctrl_vwJoinusIndicator = $id('hbg-indicator-joinus');
        this.ctrl_vwPolicyIndicator = $id('hbg-indicator-policy');
        // this.ctrl_previousIndicator = null;

        return this;
    }

    setHandlers() {
        this.ctrl_pgTopButton.addEventListener('click', this.hndrPgTop);
        window.onscroll = () => {
            this.ctrl_pgTopButton.style.visibility = (window.scrollY > 200) ? 'visible' : 'hidden';
        };

        this.ctrl_hbgButton.addEventListener('click', () => {
            this.ctrl_hbgMenu.style.height = document.documentElement.clientHeight + 'px';
            this.ctrl_hbgBracket.style.display = 'inline';
            this.ctrl_hbgButton.style.display = 'none';
        });

        this.ctrl_hbgClose.addEventListener('click', () => {
            this.ctrl_hbgButton.style.display = 'block';
            this.ctrl_hbgBracket.style.display = 'none'
        });

        super.setHandler(this.ctrl_gotoTopLabel, this.crtl_vwTop);
        super.setHandler(this.ctrl_vwStatementButton, this.crtl_vwStatement, this.ctrl_vwStatementIndicator);
        super.setHandler($id('element-readmore'), this.crtl_vwStatement, this.ctrl_vwStatementIndicator);
        super.setHandler(this.ctrl_vwEventButton, this.crtl_vwEvent, this.ctrl_vwEventIndicator);
        super.setHandler($id('element-watchEvent-button'), this.crtl_vwEvent, this.ctrl_vwEventIndicator);
        super.setHandler(this.ctrl_vwMovieButton, this.crtl_vwMovie, this.ctrl_vwMovieIndicator);
        super.setHandler($id('element-watchMovie-button'), this.crtl_vwMovie, this.ctrl_vwMovieIndicator);
        super.setHandler(this.ctrl_vwPolicyButton, this.crtl_vwPolicy, this.ctrl_vwPolicyIndicator);

        return this;
    }

    hndrPgTop() {
        super.hndrPgTop();
    }

    //View を切り替える
    changeView(viewCtrl) {
        super.changeView(viewCtrl);
        this.ctrl_hbgButton.style.display = 'block';
        this.ctrl_hbgBracket.style.display = 'none'
    }

    AfterworkForIndicator(indicatorCtrl) {
        indicatorCtrl.style.color = 'white';
        if (stateManager.ctrl_previousPage.id !== VIEW_TOP && stateManager.ctrl_previousIndicator) {
            stateManager.ctrl_previousIndicator.style.color = this.menuIdicatorColorTable[stateManager.ctrl_previousPage.id];
        }
        stateManager.ctrl_previousIndicator = indicatorCtrl;
    }

    initControls() {
        super.initControls();
        return this;
    }

    requestJson(url) {
        super.requestJson(url);
    }
}


//PC 画面用クラス
class PCfunctions extends ViewController {
    constructor() {
        super();
        this.name = 'PC';
    }
    setControls() {
        let nameOfCtrls = {
            vwTopButton: 'element-toppage-logo',
            vwStatementButton: 'element-circle-statement',
            vwEventButton: 'element-circle-event',
            vwMovieButton: 'element-circle-movie',
            vwJoinusButton: 'element-circle-joinus',
            vwPolicyButton: 'element-circle-policy',
            vwContactButton: 'element-contact-link'
        };
        super.setControls(nameOfCtrls);
        this.ctrl_eventCarouselBox = $id('event-carousel-box');
        this.ctrl_carouselEventLeftButton = $id('carousel-event-left');
        this.ctrl_carouselEventRightButton = $id('carousel-event-right');

        this.ctrl_movieCarouselBox = $id('movie-carousel-box');
        this.ctrl_carouselMovieLeftButton = $id('carousel-movie-left');
        this.ctrl_carouselMovieRightButton = $id('carousel-movie-right');
        return this;
    }
    setHandlers() {
        this.ctrl_pgTopButton.addEventListener('click', this.hndrPgTop);

        window.onscroll = () => {
            this.ctrl_pgTopButton.style.visibility = (window.scrollY > 200) ? 'visible' : 'hidden';
        };

        super.setHandler(this.ctrl_gotoTopLabel, this.crtl_vwTop);
        super.setHandler(this.ctrl_vwStatementButton, this.crtl_vwStatement);
        super.setHandler($id('element-readmore'), this.crtl_vwStatement);
        super.setHandler(this.ctrl_vwEventButton, this.crtl_vwEvent);
        super.setHandler($id('element-watchEvent-button'), this.crtl_vwEvent);
        super.setHandler(this.ctrl_vwMovieButton, this.crtl_vwMovie);
        super.setHandler($id('element-watchMovie-button'), this.crtl_vwMovie);
        super.setHandler(this.ctrl_vwPolicyButton, this.crtl_vwPolicy);

        let scrlL = 0, timerId;

        this.ctrl_carouselEventLeftButton.addEventListener('mousedown', () => {
            scrlL = this.ctrl_eventCarouselBox.scrollLeft;
            this.ctrl_eventCarouselBox.scrollLeft = scrlL - 450;
            timerId = setInterval(() => {
                scrlL = this.ctrl_eventCarouselBox.scrollLeft;
                this.ctrl_eventCarouselBox.scrollLeft = scrlL - 450;
            }, 100);
        });

        this.ctrl_carouselEventRightButton.addEventListener('mousedown', () => {
            scrlL = this.ctrl_eventCarouselBox.scrollLeft;
            this.ctrl_eventCarouselBox.scrollLeft = scrlL + 450;
            /* カルーセルの矢印の表示非表示
             this.ctrl_carouselEventLeftButton.style.display = 'inline';
            */

            timerId = setInterval(() => {
                scrlL = this.ctrl_eventCarouselBox.scrollLeft;
                this.ctrl_eventCarouselBox.scrollLeft = scrlL + 450;
            }, 100);
        });

        this.ctrl_carouselEventLeftButton.addEventListener('mouseup', () => {
            clearInterval(timerId);
        });

        this.ctrl_carouselEventRightButton.addEventListener('mouseup', () => {
            clearInterval(timerId);
        });

        this.ctrl_carouselEventLeftButton.addEventListener('focusout', () => {
            clearInterval(timerId);
        });

        this.ctrl_carouselEventRightButton.addEventListener('focusout', () => {
            clearInterval(timerId);
        });



        this.ctrl_carouselMovieLeftButton.addEventListener('mousedown', () => {
            scrlL = this.ctrl_movieCarouselBox.scrollLeft;
            this.ctrl_movieCarouselBox.scrollLeft = scrlL - 450;
            timerId = setInterval(() => {
                scrlL = this.ctrl_movieCarouselBox.scrollLeft;
                this.ctrl_movieCarouselBox.scrollLeft = scrlL - 450;
            }, 100);
            
        });

        this.ctrl_carouselMovieRightButton.addEventListener('mousedown', () => {
            scrlL = this.ctrl_movieCarouselBox.scrollLeft;
            this.ctrl_movieCarouselBox.scrollLeft = scrlL + 450;
            /* カルーセルの矢印の表示非表示
             this.ctrl_carouselEventLeftButton.style.display = 'inline';
            */
            timerId = setInterval(() => {
                scrlL = this.ctrl_movieCarouselBox.scrollLeft;
                this.ctrl_movieCarouselBox.scrollLeft = scrlL + 450;
            }, 100);
        });

        this.ctrl_carouselMovieLeftButton.addEventListener('mouseup', () => {
            clearInterval(timerId);
        });

        this.ctrl_carouselMovieRightButton.addEventListener('mouseup', () => {
            clearInterval(timerId);
        });

        this.ctrl_carouselMovieLeftButton.addEventListener('focusout', () => {
            clearInterval(timerId);
        });

        this.ctrl_carouselMovieRightButton.addEventListener('focusout', () => {
            clearInterval(timerId);
        });


        return this;
    }

    hndrPgTop() {
        super.hndrPgTop();
    }

    //View を切り替える
    changeView(viewCtrl) {
        super.changeView(viewCtrl);
    }

    initControls() {
        super.initControls();
        return this;
    }

    requestJson(url) {
        super.requestJson(url);
    }
}

