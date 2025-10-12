// ==UserScript==
// @name         Duolingo PRO
// @namespace    http://duolingopro.net
// @version      3.1BETA.02.2
// @description  The fastest Duolingo XP gainer, working as of October 2025.
// @author       anonymousHackerIV
// @match        https://*.duolingo.com/*
// @match        https://*.duolingo.cn/*
// @icon         https://www.duolingopro.net/static/favicons/duo/128/light/primary.png
// @grant        GM_log
// ==/UserScript==

let storageLocal;
let storageSession;
let versionNumber = "02.1";
let storageLocalVersion = "06";
let storageSessionVersion = "06";
let versionName = "BETA.02.1";
let versionFull = "3.1BETA.02.1";
let versionFormal = "3.1 BETA.02.1";
let serverURL = "https://www.duolingopro.net";
let apiURL = "https://api.duolingopro.net";
let greasyfork = true;
let alpha = false;

let hidden = false;
let lastPage;
let currentPage = 1;
let windowBlurState = true;

let solvingIntervalId;
let isAutoMode;
let findReactMainElementClass = '_3yE3H';
let reactTraverseUp = 1;

const debug = false;
const flag01 = false;
const flag02 = false;

let temporaryRandom16 = Array.from({ length: 16 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

if (localStorage.getItem("DLP_Local_Storage") == null || JSON.parse(localStorage.getItem("DLP_Local_Storage")).storageVersion !== storageLocalVersion) {
    localStorage.setItem("DLP_Local_Storage", JSON.stringify({
        "version": versionNumber,
        "terms": "00",
        "random16": temporaryRandom16,
        "pins": {
            "home": ["DLP_Get_XP_1_ID", "DLP_Get_GEMS_1_ID"],
            "legacy": ["DLP_Get_PATH_1_ID", "DLP_Get_PRACTICE_1_ID"]
        },
        "settings": {
            "autoUpdate": !greasyfork,
            "showSolveButtons": true,
            "showAutoServerButton": alpha,
            "muteLessons": false,
            "anonymousUsageData": alpha,
            "solveSpeed": 0.9
        },
        "chats": [],
        "notifications": [
            {
                "id": "0001"
            }
        ],
        "tips": {
            "seeMore1": false
        },
        "languagePackVersion": "00",
        "onboarding": false,
        "storageVersion": storageLocalVersion
    }));
    storageLocal = JSON.parse(localStorage.getItem("DLP_Local_Storage"));
} else {
    storageLocal = JSON.parse(localStorage.getItem("DLP_Local_Storage"));
}
function saveStorageLocal() {
    localStorage.setItem("DLP_Local_Storage", JSON.stringify(storageLocal));
}

if (sessionStorage.getItem("DLP_Session_Storage") == null || JSON.parse(sessionStorage.getItem("DLP_Session_Storage")).storageVersion !== storageSessionVersion) {
    sessionStorage.setItem("DLP_Session_Storage", JSON.stringify({
        "legacy": {
            "page": 0,
            "status": false,
            "path": {
                "type": "lesson",
                "amount": 0
            },
            "practice": {
                "type": "lesson",
                "amount": 0
            },
            "listen": {
                "type": "lesson",
                "amount": 0
            },
            "lesson": {
                "section": 1,
                "unit": 1,
                "level": 1,
                "type": "lesson",
                "amount": 0
            }
        },
        "notifications": [
            {
                "id": "0001"
            }
        ],
        "storageVersion": storageSessionVersion
    }));
    storageSession = JSON.parse(sessionStorage.getItem("DLP_Session_Storage"));
} else {
    storageSession = JSON.parse(sessionStorage.getItem("DLP_Session_Storage"));
}
function saveStorageSession() {
    sessionStorage.setItem("DLP_Session_Storage", JSON.stringify(storageSession));
}

if (alpha) apiURL = "https://api.duolingopro.net/alpha";

let systemLanguage = document.cookie.split('; ').find(row => row.startsWith('lang=')).split('=')[1];
let systemText = {
    en: {
        1: "Switch to Legacy",
        2: "Show",
        3: "Connecting",
        4: "Donate",
        5: "Feedback",
        6: "Settings",
        7: "What's New",
        8: "How much XP would you like to gain?",
        9: "GET",
        10: "How many Gems would you like to gain?",
        12: "Would you like to redeem 3 days of Super Duolingo?",
        13: "REDEEM",
        14: "Terms & Conditions",
        15: "See More",
        16: "Back",
        17: "How many lessons would you like to solve on the path?",
        18: "START",
        19: "How many practices would you like to solve?",
        21: "How many listening practices would you like to solve? (Requires Super Duolingo)",
        23: "Which and how many lessons would you like to repeat?",
        25: "Please read and accept the Terms & Conditions to use Duolingo PRO 3.1.",
        26: "These are the Terms & Conditions you agreed to use Duolingo PRO 3.1.",
        27: "LOADING TERMS & CONDITIONS<br><br>YOU CANNOT USE THIS SOFTWARE UNTIL TERMS & CONDITIONS ARE LOADED",
        28: "DECLINE",
        29: "ACCEPT",
        30: "Without accepting the Terms & Conditions, you cannot use Duolingo PRO 3.1.",
        31: "BACK",
        32: "Settings",
        34: "Automatic Updates",
        35: "Duolingo PRO 3.1 will automatically update itself when there's a new version available.",
        37: "SAVE",
        38: "Feedback",
        39: "Help us make Duolingo PRO 3.1 better.",
        40: "Write here as much as you can with as many details as possible.",
        41: "Feedback Type: ",
        42: "BUG REPORT",
        43: "SUGGESTION",
        44: "Add Attachment: (Optional)",
        45: "UPLOAD",
        47: "SEND",
        48: "What's New",
        51: "LEARN MORE",
        52: "Welcome to",
        53: "The next generation of Duolingo PRO is here, with Instant XP, Magnet UI, all powerful than ever. ",
        54: "START",
        100: "SOLVE",
        101: "SOLVE ALL",
        102: "PAUSE SOLVE",
        103: "Hide",
        104: "Show",
        105: "Switch to 3.1",
        106: "Switch to Legacy",
        107: "STOP",
        108: "Connected",
        109: "Error",
        110: "SEND",
        111: "SENDING",
        112: "SENT",
        113: "LOADING",
        114: "DONE",
        115: "FAILED",
        116: "SAVING AND APPLYING",
        200: "Under Construction",
        201: "The Gems function is currently under construction. We plan to make it accessible to everyone soon.",
        202: "Update Available",
        203: "You are using an outdated version of Duolingo PRO.<br><br>Please <a href='https://www.duolingopro.net/greasyfork' target='_blank' style='font-family: Duolingo PRO Rounded; color: #007AFF; text-decoration: underline;'>update Duolingo PRO</a> or turn on automatic updates.",
        204: "Feedback Sent",
        205: "Your feedback was successfully sent, and our developers will look over it. Keep in mind, we cannot respond back to your feedback.",
        206: "Error Sending Feedback",
        207: "Your feedback was not sent. This might be because you are using an outdated or a modified version of Duolingo PRO.",
        208: "Unknown Error",
        209: "Please try again later. An unknown error occurred. Number: ",
        210: "hour",
        211: "hours",
        212: "minute",
        213: "minutes",
        214: "and",
        215: "{hours} {hourUnit}",
        216: "{minutes} {minuteUnit}",
        217: "{hourPhrase} {conjunction} {minutePhrase}",
        218: "XP Successfully Received",
        219: "You received {amount} XP. You can request up to {remainingXP} XP before your limit resets back to {totalLimit} XP in {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' style='font-family: Duolingo PRO Rounded; text-decoration: underline; color: #007AFF;'>donate</a>.",
        220: "Super Duolingo Successfully Redeemed",
        221: "You redeemed a 3 day Super Duolingo trial. You can request another 3 day Super Duolingo trial in {timeMessage}.",
        222: "Limit Warning",
        223: "You can only request up to {limitAmount} XP before your limit resets back to {totalLimitAmount} XP in {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' style='font-family: Duolingo PRO Rounded; text-decoration: underline; color: #007AFF;'>donate</a>.",
        224: "Limit Reached",
        225: "You reached your XP limit for the next {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' style='font-family: Duolingo PRO Rounded; text-decoration: underline; color: #007AFF;'>donate</a>.",
        227: "You already redeemed a 3 day Super Duolingo trial. You can request another 3 day Super Duolingo trial in {timeMessage}.",
        229: "GEMS testing",
        230: "GEMS testing",
        231: "Error Connecting",
        232: "Duolingo PRO was unable to connect to our servers. This may be because our servers are temporarily unavailable or you are using an outdated version. Check for <a href='https://status.duolingopro.net' target='_blank' style='font-family: Duolingo PRO Rounded; text-decoration: underline; color: #007AFF;'>server status</a> or <a href='https://duolingopro.net/greasyfork' target='_blank' style='font-family: Duolingo PRO Rounded; text-decoration: underline; color: #007AFF;'>updates</a>.",
        233: "Update Duolingo PRO",
        234: "You are using an outdated version of Duolingo PRO. Please <a href='https://www.duolingopro.net/greasyfork' target='_blank' style='font-family: Duolingo PRO Rounded; color: #007AFF; text-decoration: underline;'>update Duolingo PRO</a> or turn on automatic updates."
    },
};

let CSS1;
let HTML2;
let CSS2;
let HTML3;
let HTML4;
let HTML5;
let CSS5;
let HTML6;
let CSS6;
let HTML7;
let CSS7;

function Two() {
CSS1 = `
@font-face {
    font-family: 'Duolingo PRO Rounded';
    src: url(${serverURL}/static/fonts/V7R100DB1/Duolingo-PRO-Rounded-Semibold.woff2) format('woff2');
    font-weight: 600;
}

:root {
    --DLP-red-hex: #ff3b30;
    --DLP-orange-hex: #ff9500;
    --DLP-yellow-hex: #ffcc00;
    --DLP-green-hex: #34c759;
    --DLP-teal-hex: #00c7be;
    --DLP-cyan-hex: #5ac8fa;
    --DLP-blue-hex: #007aff;
    --DLP-indigo-hex: #5856d6;
    --DLP-purple-hex: #af52de;
    --DLP-pink-hex: #ff2d55;

    --DLP-red-rgb: rgb(255, 59, 48);
    --DLP-orange-rgb: rgb(255, 149, 0);
    --DLP-yellow-rgb: rgb(255, 204, 0);
    --DLP-green-rgb: rgb(52, 199, 89);
    --DLP-teal-rgb: rgb(0, 199, 190);
    --DLP-cyan-rgb: rgb(90, 200, 250);
    --DLP-blue-rgb: rgb(0, 122, 255);
    --DLP-indigo-rgb: rgb(88, 86, 214);
    --DLP-purple-rgb: rgb(175, 82, 222);
    --DLP-pink-rgb: rgb(255, 45, 85);

    --DLP-red: 255, 59, 48;
    --DLP-orange: 255, 149, 0;
    --DLP-yellow: 255, 204, 0;
    --DLP-green: 52, 199, 89;
    --DLP-teal: 0, 199, 190;
    --DLP-cyan: 90, 200, 250;
    --DLP-blue: 0, 122, 255;
    --DLP-indigo: 88, 86, 214;
    --DLP-purple: 175, 82, 222;
    --DLP-pink: 255, 45, 85;
}
@media (prefers-color-scheme: dark) {
    :root {
        --DLP-red-hex: #ff453a;
        --DLP-orange-hex: #ff9f0a;
        --DLP-yellow-hex: #ffd60a;
        --DLP-green-hex: #30d158;
        --DLP-teal-hex: #63e6e2;
        --DLP-cyan-hex: #64d2ff;
        --DLP-blue-hex: #0a84ff;
        --DLP-indigo-hex: #5e5ce6;
        --DLP-purple-hex: #bf5af2;
        --DLP-pink-hex: #ff375f;

        --DLP-red-rgb: rgb(255, 69, 58);
        --DLP-orange-rgb: rgb(255, 159, 10);
        --DLP-yellow-rgb: rgb(255, 214, 10);
        --DLP-green-rgb: rgb(48, 209, 88);
        --DLP-teal-rgb: rgb(99, 230, 226);
        --DLP-cyan-rgb: rgb(100, 210, 255);
        --DLP-blue-rgb: rgb(10, 132, 255);
        --DLP-indigo-rgb: rgb(94, 92, 230);
        --DLP-purple-rgb: rgb(191, 90, 242);
        --DLP-pink-rgb: rgb(255, 55, 95);

        --DLP-red: 255, 69, 58;
        --DLP-orange: 255, 159, 10;
        --DLP-yellow: 255, 214, 10;
        --DLP-green: 48, 209, 88;
        --DLP-teal: 99, 230, 226;
        --DLP-cyan: 100, 210, 255;
        --DLP-blue: 10, 132, 255;
        --DLP-indigo: 94, 92, 230;
        --DLP-purple: 191, 90, 242;
        --DLP-pink: 255, 55, 95;

        --DLP-background: var(--color-snow);
    }
}
`;

HTML2 = `
<canvas style="position: fixed; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100vh; z-index: 211; pointer-events: none;" id="DLP_Confetti_Canvas"></canvas>
<div class="DLP_Notification_Main"></div>
<div class="DLP_Main">
    <div class="DLP_HStack_8" style="align-self: flex-end;">
        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Switch_Legacy_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀱏</p>
            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue)); white-space: nowrap;">${systemText[systemLanguage][1]}</p>
        </div>
        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Hide_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); flex: none; backdrop-filter: blur(16px);">
            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀋮</p>
            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][2]}</p>
        </div>
    </div>
    <div class="DLP_Main_Box">
        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_1_ID" style="display: block;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8">
                    <div class="DLP_HStack_8">
                        <div id="DLP_Main_1_Server_Connection_Button_1_ID" class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgb(var(--color-eel), 0.20); outline-offset: -2px; background: rgb(var(--color-eel), 0.10); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1); padding: 10px 0px 10px 10px;">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel));">􀓞</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--color-eel));">${systemText[systemLanguage][3]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Donate_Button_1_ID" onclick="window.open('https://duolingopro.net/donate', '_blank');" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="17" height="19" viewBox="0 0 17 19" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 5.90755C16.4968 3.60922 14.6997 1.72555 12.5913 1.04588C9.97298 0.201877 6.51973 0.324211 4.01956 1.49921C0.989301 2.92355 0.0373889 6.04355 0.00191597 9.15522C-0.0271986 11.7136 0.229143 18.4517 4.04482 18.4997C6.87998 18.5356 7.30214 14.8967 8.61397 13.1442C9.5473 11.8974 10.749 11.5452 12.2284 11.1806C14.7709 10.5537 16.5037 8.55506 16.5 5.90755Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][4]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Feedback_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􂄺</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][5]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Settings_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀍟</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][6]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Earn_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀑊</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">Earn</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_YouTube_Button_1_ID" onclick="window.open('https://duolingopro.net/youtube', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-pink));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2043 1.0885C20.1084 1.33051 20.8189 2.041 21.0609 2.9451C21.4982 4.58216 21.5 7.99976 21.5 7.99976C21.5 7.99976 21.5 11.4174 21.0609 13.0544C20.8189 13.9585 20.1084 14.669 19.2043 14.911C17.5673 15.3501 11 15.3501 11 15.3501C11 15.3501 4.43274 15.3501 2.79568 14.911C1.89159 14.669 1.1811 13.9585 0.939084 13.0544C0.5 11.4174 0.5 7.99976 0.5 7.99976C0.5 7.99976 0.5 4.58216 0.939084 2.9451C1.1811 2.041 1.89159 1.33051 2.79568 1.0885C4.43274 0.649414 11 0.649414 11 0.649414C11 0.649414 17.5673 0.649414 19.2043 1.0885ZM14.3541 8.00005L8.89834 11.1497V4.85038L14.3541 8.00005Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Discord_Button_1_ID" onclick="window.open('https://duolingopro.net/discord', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-indigo));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.289 1.34C16.9296 0.714 15.4761 0.259052 13.9565 0C13.7699 0.332095 13.5519 0.77877 13.4016 1.1341C11.7862 0.894993 10.1857 0.894993 8.60001 1.1341C8.44972 0.77877 8.22674 0.332095 8.03844 0C6.51721 0.259052 5.06204 0.715671 3.70267 1.34331C0.960812 5.42136 0.21754 9.39811 0.589177 13.3184C2.40772 14.655 4.17011 15.467 5.90275 15.9984C6.33055 15.4189 6.71209 14.8028 7.04078 14.1536C6.41478 13.9195 5.81521 13.6306 5.24869 13.2952C5.39898 13.1856 5.546 13.071 5.68803 12.9531C9.14342 14.5438 12.8978 14.5438 16.3119 12.9531C16.4556 13.071 16.6026 13.1856 16.7512 13.2952C16.183 13.6322 15.5818 13.9211 14.9558 14.1553C15.2845 14.8028 15.6644 15.4205 16.0939 16C17.8282 15.4687 19.5922 14.6567 21.4107 13.3184C21.8468 8.77378 20.6658 4.83355 18.289 1.34ZM7.51153 10.9075C6.47426 10.9075 5.62361 9.95435 5.62361 8.7937C5.62361 7.63305 6.45609 6.67831 7.51153 6.67831C8.56699 6.67831 9.41761 7.63138 9.39945 8.7937C9.40109 9.95435 8.56699 10.9075 7.51153 10.9075ZM14.4884 10.9075C13.4511 10.9075 12.6005 9.95435 12.6005 8.7937C12.6005 7.63305 13.4329 6.67831 14.4884 6.67831C15.5438 6.67831 16.3945 7.63138 16.3763 8.7937C16.3763 9.95435 15.5438 10.9075 14.4884 10.9075Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_GitHub_Button_1_ID" onclick="window.open('https://duolingopro.net/github', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(255, 255, 255, 0.20); outline-offset: -2px; background: #333333;">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0087 0.5C5.19766 0.5 0.5 5.3125 0.5 11.2662C0.5 16.0253 3.50995 20.0538 7.68555 21.4797C8.2076 21.5868 8.39883 21.248 8.39883 20.963C8.39883 20.7134 8.38162 19.8578 8.38162 18.9664C5.45836 19.6082 4.84962 17.683 4.84962 17.683C4.37983 16.4353 3.68375 16.1146 3.68375 16.1146C2.72697 15.4551 3.75345 15.4551 3.75345 15.4551C4.81477 15.5264 5.37167 16.5602 5.37167 16.5602C6.31103 18.1999 7.82472 17.7366 8.43368 17.4514C8.52058 16.7562 8.79914 16.2749 9.09491 16.0076C6.7634 15.758 4.31035 14.8312 4.31035 10.6957C4.31035 9.51928 4.72765 8.55678 5.38888 7.80822C5.28456 7.54091 4.9191 6.43556 5.49342 4.95616C5.49342 4.95616 6.38073 4.67091 8.38141 6.06128C9.23797 5.82561 10.1213 5.70573 11.0087 5.70472C11.896 5.70472 12.8005 5.82963 13.6358 6.06128C15.6367 4.67091 16.524 4.95616 16.524 4.95616C17.0983 6.43556 16.7326 7.54091 16.6283 7.80822C17.3069 8.55678 17.707 9.51928 17.707 10.6957C17.707 14.8312 15.254 15.7401 12.905 16.0076C13.2879 16.3463 13.6183 16.9878 13.6183 18.0039C13.6183 19.4477 13.6011 20.6064 13.6011 20.9627C13.6011 21.248 13.7926 21.5868 14.3144 21.4799C18.49 20.0536 21.5 16.0253 21.5 11.2662C21.5172 5.3125 16.8023 0.5 11.0087 0.5Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="margin-top: 2px; font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p id="DLP_Main_Warning_1_ID" class="DLP_Text_Style_1" style="transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); text-align: center; opacity: 0.5; display: none;"></p>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID" style="opacity: 0.5; pointer-events: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    <div class="DLP_VStack_8" id="DLP_Get_XP_1_ID" style="flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][8]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_GEMS_1_ID" style="flex: 1 0 0; align-self: stretch;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][10]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active" style="position: relative; overflow: hidden;">
                                <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; pointer-events: none; transform: translateX(-150px); animation: slideRight 4s ease-in-out forwards infinite; animation-delay: 2s;">
                                    <path opacity="0.5" d="M72 0H96L72 48H48L72 0Z" fill="rgb(var(--DLP-blue))"/>
                                    <path opacity="0.5" d="M24 0H60L36 48H0L24 0Z" fill="rgb(var(--DLP-blue))"/>
                                    <path opacity="0.5" d="M108 0H120L96 48H84L108 0Z" fill="rgb(var(--DLP-blue))"/>
                                </svg>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_SUPER_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][12]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_DOUBLE_XP_BOOST_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to redeem an XP Boost?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_Freeze_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many Streak Freezes would you like to get?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many days would you like to increase your Streak by?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Heart_Refill_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to refill your Hearts to full?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">REFILL</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_See_More_1_Button_1_ID" style="outline: rgba(var(--DLP-blue), 0.2) solid 2px; outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px); transform: translate(0px, 0px) scale(1); align-self: stretch; justify-content: space-between;">
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][15]}</p>
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">􀯻</p>
                    </div>
                </div>
                <div class="DLP_HStack_Auto" style="padding-top: 4px;">
                    <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Terms_1_Button_1_ID" style="align-items: center;">
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue)); opacity: 0.5;">${systemText[systemLanguage][14]}</p>
                    </div>
                    <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Whats_New_1_Button_1_ID" style="align-items: center;">
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][7]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_2_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4 DLP_Hover_1" id="DLP_Universal_Back_1_Button_1_ID">
                        <p class="DLP_Text_Style_2" style="font-size: 20px;">􀯶</p>
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID">
                    <div class="DLP_HStack_8">
                        <div class="DLP_VStack_8" id="DLP_Get_XP_2_ID" style="flex: 1 0 0;">
                            <div class="DLP_HStack_8" style="align-items: center;">
                                <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][8]}</p>
                            </div>
                            <div class="DLP_HStack_8">
                                <div class="DLP_Input_Style_1_Active">
                                    <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                    <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                                </div>
                                <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                    <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                    <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                                </div>
                            </div>
                        </div>
                        <div class="DLP_VStack_8" id="DLP_Get_GEMS_2_ID" style="flex: 1 0 0; align-self: stretch;">
                            <div class="DLP_HStack_8" style="align-items: center;">
                                <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][10]}</p>
                            </div>
                            <div class="DLP_HStack_8">
                                <div class="DLP_Input_Style_1_Active" style="position: relative; overflow: hidden;">
                                    <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; pointer-events: none; transform: translateX(-150px); animation: slideRight 4s ease-in-out forwards infinite; animation-delay: 2s;">
                                        <path opacity="0.5" d="M72 0H96L72 48H48L72 0Z" fill="rgb(var(--DLP-blue))"/>
                                        <path opacity="0.5" d="M24 0H60L36 48H0L24 0Z" fill="rgb(var(--DLP-blue))"/>
                                        <path opacity="0.5" d="M108 0H120L96 48H84L108 0Z" fill="rgb(var(--DLP-blue))"/>
                                    </svg>
                                    <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                    <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                                </div>
                                <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                    <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                    <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_VStack_8" id="DLP_Get_SUPER_2_ID" style="flex: 1 0 0;">
                            <div class="DLP_HStack_8" style="align-items: center;">
                                <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][12]}</p>
                            </div>
                            <div class="DLP_HStack_8">
                                <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                                </div>
                            </div>
                        </div>
                        <div class="DLP_VStack_8" id="DLP_Get_DOUBLE_XP_BOOST_2_ID" style="flex: 1 0 0;">
                            <div class="DLP_HStack_8" style="align-items: center;">
                                <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to redeem an XP Boost?</p>
                            </div>
                            <div class="DLP_HStack_8">
                                <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_VStack_8" id="DLP_Get_Streak_Freeze_2_ID" style="flex: 1 0 0;">
                            <div class="DLP_HStack_8" style="align-items: center;">
                                <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many Streak Freezes would you like to get?</p>
                            </div>
                            <div class="DLP_HStack_8">
                                <div class="DLP_Input_Style_1_Active">
                                    <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                    <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                                </div>
                                <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                    <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                    <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                                </div>
                            </div>
                        </div>
                        <div class="DLP_VStack_8" id="DLP_Get_Streak_2_ID" style="flex: 1 0 0;">
                            <div class="DLP_HStack_8" style="align-items: center;">
                                <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">How many days would you like to increase your Streak by?</p>
                            </div>
                            <div class="DLP_HStack_8">
                                <div class="DLP_Input_Style_1_Active">
                                    <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                    <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                                </div>
                                <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                    <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                    <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_VStack_8" id="DLP_Get_Heart_Refill_2_ID" style="flex: 1 0 0;">
                            <div class="DLP_HStack_8" style="align-items: center;">
                                <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">Would you like to refill your Hearts to full?</p>
                            </div>
                            <div class="DLP_HStack_8">
                                <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">REFILL</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                                </div>
                            </div>
                        </div>
                        <div style="flex: 1 0 0; align-self: stretch; opacity: 0; pointer-events: none;"></div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_3_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8">
                    <div class="DLP_HStack_8">
                        <div id="DLP_Secondary_1_Server_Connection_Button_1_ID" class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgb(var(--color-eel), 0.20); outline-offset: -2px; background: rgb(var(--color-eel), 0.10); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1); padding: 10px 0px 10px 10px; opacity: 0.25; pointer-events: none;">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀓞</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #000; transition: 0.4s;">${systemText[systemLanguage][3]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Donate_Button_1_ID" onclick="window.open('https://duolingopro.net/donate', '_blank');" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="17" height="19" viewBox="0 0 17 19" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 5.90755C16.4968 3.60922 14.6997 1.72555 12.5913 1.04588C9.97298 0.201877 6.51973 0.324211 4.01956 1.49921C0.989301 2.92355 0.0373889 6.04355 0.00191597 9.15522C-0.0271986 11.7136 0.229143 18.4517 4.04482 18.4997C6.87998 18.5356 7.30214 14.8967 8.61397 13.1442C9.5473 11.8974 10.749 11.5452 12.2284 11.1806C14.7709 10.5537 16.5037 8.55506 16.5 5.90755Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][4]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Feedback_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􂄺</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][5]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Settings_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀍟</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][6]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Main_Earn_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀑊</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">Earn</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_YouTube_Button_1_ID" onclick="window.open('https://duolingopro.net/youtube', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-pink));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2043 1.0885C20.1084 1.33051 20.8189 2.041 21.0609 2.9451C21.4982 4.58216 21.5 7.99976 21.5 7.99976C21.5 7.99976 21.5 11.4174 21.0609 13.0544C20.8189 13.9585 20.1084 14.669 19.2043 14.911C17.5673 15.3501 11 15.3501 11 15.3501C11 15.3501 4.43274 15.3501 2.79568 14.911C1.89159 14.669 1.1811 13.9585 0.939084 13.0544C0.5 11.4174 0.5 7.99976 0.5 7.99976C0.5 7.99976 0.5 4.58216 0.939084 2.9451C1.1811 2.041 1.89159 1.33051 2.79568 1.0885C4.43274 0.649414 11 0.649414 11 0.649414C11 0.649414 17.5673 0.649414 19.2043 1.0885ZM14.3541 8.00005L8.89834 11.1497V4.85038L14.3541 8.00005Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Discord_Button_1_ID" onclick="window.open('https://duolingopro.net/discord', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-indigo));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.289 1.34C16.9296 0.714 15.4761 0.259052 13.9565 0C13.7699 0.332095 13.5519 0.77877 13.4016 1.1341C11.7862 0.894993 10.1857 0.894993 8.60001 1.1341C8.44972 0.77877 8.22674 0.332095 8.03844 0C6.51721 0.259052 5.06204 0.715671 3.70267 1.34331C0.960812 5.42136 0.21754 9.39811 0.589177 13.3184C2.40772 14.655 4.17011 15.467 5.90275 15.9984C6.33055 15.4189 6.71209 14.8028 7.04078 14.1536C6.41478 13.9195 5.81521 13.6306 5.24869 13.2952C5.39898 13.1856 5.546 13.071 5.68803 12.9531C9.14342 14.5438 12.8978 14.5438 16.3119 12.9531C16.4556 13.071 16.6026 13.1856 16.7512 13.2952C16.183 13.6322 15.5818 13.9211 14.9558 14.1553C15.2845 14.8028 15.6644 15.4205 16.0939 16C17.8282 15.4687 19.5922 14.6567 21.4107 13.3184C21.8468 8.77378 20.6658 4.83355 18.289 1.34ZM7.51153 10.9075C6.47426 10.9075 5.62361 9.95435 5.62361 8.7937C5.62361 7.63305 6.45609 6.67831 7.51153 6.67831C8.56699 6.67831 9.41761 7.63138 9.39945 8.7937C9.40109 9.95435 8.56699 10.9075 7.51153 10.9075ZM14.4884 10.9075C13.4511 10.9075 12.6005 9.95435 12.6005 8.7937C12.6005 7.63305 13.4329 6.67831 14.4884 6.67831C15.5438 6.67831 16.3945 7.63138 16.3763 8.7937C16.3763 9.95435 15.5438 10.9075 14.4884 10.9075Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_GitHub_Button_1_ID" onclick="window.open('https://duolingopro.net/github', '_blank');" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(255, 255, 255, 0.20); outline-offset: -2px; background: #333333;">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0087 0.5C5.19766 0.5 0.5 5.3125 0.5 11.2662C0.5 16.0253 3.50995 20.0538 7.68555 21.4797C8.2076 21.5868 8.39883 21.248 8.39883 20.963C8.39883 20.7134 8.38162 19.8578 8.38162 18.9664C5.45836 19.6082 4.84962 17.683 4.84962 17.683C4.37983 16.4353 3.68375 16.1146 3.68375 16.1146C2.72697 15.4551 3.75345 15.4551 3.75345 15.4551C4.81477 15.5264 5.37167 16.5602 5.37167 16.5602C6.31103 18.1999 7.82472 17.7366 8.43368 17.4514C8.52058 16.7562 8.79914 16.2749 9.09491 16.0076C6.7634 15.758 4.31035 14.8312 4.31035 10.6957C4.31035 9.51928 4.72765 8.55678 5.38888 7.80822C5.28456 7.54091 4.9191 6.43556 5.49342 4.95616C5.49342 4.95616 6.38073 4.67091 8.38141 6.06128C9.23797 5.82561 10.1213 5.70573 11.0087 5.70472C11.896 5.70472 12.8005 5.82963 13.6358 6.06128C15.6367 4.67091 16.524 4.95616 16.524 4.95616C17.0983 6.43556 16.7326 7.54091 16.6283 7.80822C17.3069 8.55678 17.707 9.51928 17.707 10.6957C17.707 14.8312 15.254 15.7401 12.905 16.0076C13.2879 16.3463 13.6183 16.9878 13.6183 18.0039C13.6183 19.4477 13.6011 20.6064 13.6011 20.9627C13.6011 21.248 13.7926 21.5868 14.3144 21.4799C18.49 20.0536 21.5 16.0253 21.5 11.2662C21.5172 5.3125 16.8023 0.5 11.0087 0.5Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO LE</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">You are using an outdated version of Duolingo PRO. <br><br>Please update Duolingo PRO or turn on automatic updates. </p>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">Duolingo PRO failed to connect. This might be happening because of an issue on our system or your device. <br><br>Try updating Duolingo PRO. If the issue persists afterwards, join our Discord Server to get support. </p>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">We are currently unable to receive new requests due to high demand. Join our Discord Server to learn more. <br><br>You can help us handle more demand by donating on Patreon while getting exclusive features and higher limits. </p>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_2_Divider_1_ID">
                    <div class="DLP_VStack_8" id="DLP_Get_PATH_1_ID">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][17]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_PRACTICE_1_ID">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][19]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LISTEN_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][21]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LESSON_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][23]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <div style="display: flex; align-items: center; gap: 8px; width: 100%; justify-content: flex-end;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); opacity: 0.5;">Unit:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_3_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); opacity: 0.5;">Lesson:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_4_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                </div>
                            </div>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_See_More_1_Button_1_ID" style="outline: rgba(var(--DLP-blue), 0.2) solid 2px; outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px); transform: translate(0px, 0px) scale(1); align-self: stretch; justify-content: space-between;">
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][15]}</p>
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">􀯻</p>
                    </div>
                    <div class="DLP_HStack_Auto" style="padding-top: 4px;">
                        <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Terms_1_Button_1_ID" style="align-items: center;">
                            <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue)); opacity: 0.5;">${systemText[systemLanguage][14]}</p>
                        </div>
                        <div class="DLP_HStack_4 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Secondary_Whats_New_1_Button_1_ID" style="align-items: center;">
                            <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][7]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_4_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4 DLP_Hover_1" id="DLP_Universal_Back_1_Button_1_ID">
                        <p class="DLP_Text_Style_2" style="font-size: 20px;">􀯶</p>
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO LE</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID">
                    <div class="DLP_VStack_8" id="DLP_Get_PATH_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][17]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_PRACTICE_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][19]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LISTEN_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][21]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LESSON_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5;">${systemText[systemLanguage][23]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <div style="display: flex; align-items: center; gap: 8px; width: 100%; justify-content: flex-end;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); opacity: 0.5;">Unit:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_3_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); opacity: 0.5;">Lesson:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_4_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                </div>
                            </div>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_5_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" id="DLP_Terms_1_Text_1_ID" style="opacity: 0.5;">${systemText[systemLanguage][25]}</p>
                <p class="DLP_Text_Style_1 DLP_NoSelect" id="DLP_Terms_1_Text_2_ID" style="opacity: 0.5; display: none; align-self: stretch;">${systemText[systemLanguage][26]}</p>
                <div class="DLP_Scroll_Box_Style_1">
                    <p id="DLP_Terms_Main_Text_1_ID" class="DLP_Scroll_Box_Text_Style_1">${systemText[systemLanguage][27]}</p>
                </div>
                <div class="DLP_HStack_8" id="DLP_Terms_1_Button_1_ID">
                    <div id="DLP_Terms_Decline_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10);">
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">􀆄</p>
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][28]}</p>
                    </div>
                    <div id="DLP_Terms_Accept_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1" style="color: #FFF;">ACCEPT</p>
                        <p class="DLP_Text_Style_1" style="color: #FFF;">􀰫</p>
                    </div>
                </div>
                <div class="DLP_HStack_8" id="DLP_Terms_1_Button_2_ID" style="display: none;">
                    <div class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Terms_Back_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10);">
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">􀯶</p>
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][29]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_6_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2">Duolingo</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">${systemText[systemLanguage][30]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Terms_Declined_Back_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10);">
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">􀯶</p>
                        <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][31]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_7_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][32]}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_8" style="padding-bottom: 4px;">
                    <div id="DLP_Settings_Show_Solve_Buttons_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                        <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">Show Solve Buttons</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">In lessons and practices, see the solve and solve all buttons.</p>
                        </div>
                        <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                        </div>
                    </div>
                    <div id="DLP_Settings_Show_AutoServer_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                        <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">Show AutoServer Button</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">See the AutoServer by Duolingo PRO button in your Duolingo menubar.</p>
                        </div>
                        <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                        </div>
                    </div>
                    <div id="DLP_Settings_Legacy_Solve_Speed_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                        <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">Legacy Solve Speed</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">Legacy will solve each question every this amount of seconds. The lower speed you set, the more mistakes Legacy can make.</p>
                        </div>
                        <div class="DLP_Input_Style_1_Active" style="flex: none; width: 72px;">
                            <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1" style="text-align: center;">
                        </div>
                    </div>
                    <div id="DLP_Settings_Help_Us_Make_Better_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;${alpha ? ' opacity: 0.5; pointer-events: none;' : ''}">
                        <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">Help Us Make Duolingo PRO Better</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">Allow Duolingo PRO to collect anonymous usage data for us to improve the script.</p>
                        </div>
                        <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                        </div>
                    </div>
                    <div id="DLP_Settings_Auto_Update_Toggle_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center; opacity: 0.5; pointer-events: none; cursor: not-allowed;">
                        <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">${systemText[systemLanguage][34]}</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.25;">${systemText[systemLanguage][35]}</p>
                        </div>
                        <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_8">
                    <div id="DLP_Settings_Save_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][37]}</p>
                        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                    </div>
                </div>
            </div>
        </div>


        <div clas="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_8_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][38]}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_4" style="padding: 16px; border-radius: 8px; outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); box-sizing: border-box;">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀁝</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgb(var(--DLP-blue));">Need Support?</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgb(var(--DLP-blue)); opacity: 0.5;">Get help from our <a href='https://www.duolingopro.net/faq' target='_blank' style='font-family: Duolingo PRO Rounded; color: rgb(var(--DLP-blue)); text-decoration: underline;'>FAQ page</a>, enhanced with AI, or join our <a href='https://www.duolingopro.net/discord' target='_blank' style='font-family: Duolingo PRO Rounded; color: rgb(var(--DLP-blue)); text-decoration: underline;'>Discord server</a> and talk with the devs.</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5; align-self: stretch;">${systemText[systemLanguage][39]}</p>
                <textarea id="DLP_Feedback_Text_Input_1_ID" class="DLP_Large_Input_Box_Style_1" style="height: 128px; max-height: 256px;" placeholder="${systemText[systemLanguage][40]}"/></textarea>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5; align-self: stretch;">${systemText[systemLanguage][41]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Type_Bug_Report_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Feedback_Type_Button_Style_1_OFF" style="transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="transition: 0.4s;">􀌛</p>
                        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="transition: 0.4s;">${systemText[systemLanguage][42]}</p>
                    </div>
                    <div id="DLP_Feedback_Type_Suggestion_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Feedback_Type_Button_Style_2_ON" style="transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="transition: 0.4s;">􁷙</p>
                        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="transition: 0.4s;">${systemText[systemLanguage][43]}</p>
                    </div>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5; align-self: stretch;">${systemText[systemLanguage][44]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Attachment_Upload_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue)); transition: 0.4s;">${systemText[systemLanguage][45]}</p>
                        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀅼</p>
                    </div>
                </div>
                <input type="file" accept="image/png, image/jpg, image/jpeg, video/mp4, image/gif, video/mov, video/webm" id="DLP_Feedback_Attachment_Input_Hidden_1_ID" style="display: none;"/>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Send_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][47]}</p>
                        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_9_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][48]}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Release_Notes_List_1_ID"></div>
                <div id="DLP_Release_Notes_Controls" class="DLP_NoSelect" style="display: flex; align-items: center; gap: 8px; margin: 8px;">
                    <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀯶</p>
                    <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">1/3</p>
                    <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_Inset_Icon_2_ID" style="color: rgb(var(--DLP-blue));">􀯻</p>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_10_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8" style="padding: 8px 0;">
                    <div class="DLP_VStack_0">
                        <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][52]}</p>
                        <div class="DLP_HStack_4" style="align-self: auto;">
                            <p class="DLP_Text_Style_2">Duolingo</p>
                            <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                        </div>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; opacity: 0.5; text-align: center;">${systemText[systemLanguage][53]}</p>
                </div>
                <div class="DLP_HStack_8">
                    <div id="DLP_Onboarding_Start_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1" style="color: #FFF;">${systemText[systemLanguage][54]}</p>
                        <p class="DLP_Text_Style_1" style="color: #FFF;">􀰫</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_11_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top DLP_NoSelect">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Support</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
                </div>

                <div class="DLP_VStack_8" style="height: 500px;">
                    <div id="DLP_Inset_Card_1" style="display: flex; padding: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; align-self: stretch; border-radius: 8px; outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <div class="DLP_HStack_6">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀅵</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); flex: 1 0 0;">Response Times</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀯻</p>
                        </div>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgb(var(--DLP-blue)); opacity: 0.5; display: none; opacity: 0; filter: blur(4px); height: 0px; transition: 0.4s cubic-bezier(0.16, 1, 0.32, 1);">It may take a few hours for a developer to respond to you. You will be notified in Duolingo PRO when there’s a reply.</p>
                    </div>

                    <div class="DLP_Chat_Box_1_ID_1" style="display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1 0 0; align-self: stretch; overflow-y: auto;">

                    </div>

                    <div style="display: flex; display: none; flex-direction: column; justify-content: center; align-items: center; gap: 8px; flex: 1 0 0; align-self: stretch;">
                        <div class="DLP_VStack_4" style="padding: 0px 32px;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􂄺</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; text-align: center; opacity: 0.5;">Send a message to start chatting</p>
                        </div>
                    </div>

                    <div class="DLP_VStack_8" id="DLP_Inset_Group_2" style="display: none;">
                        <div id="DLP_Inset_Card_2" style="display: flex; padding: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; align-self: stretch; border-radius: 8px; outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                            <div class="DLP_HStack_6">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀿌</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); flex: 1 0 0;">This chat was closed.</p>
                            </div>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgb(var(--DLP-blue)); opacity: 0.5;">We hope to have solved your issue. If not, you can start a new chat.</p>
                        </div>

                        <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_3_ID" style="width: 100%;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Start a New Chat</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀅼</p>
                        </div>
                    </div>

                    <div class="DLP_VStack_8" id="DLP_Inset_Group_1">
                        <div id="DLP_Attachment_Preview_Parent" class="DLP_Row DLP_Left DLP_Gap_8" style="width: 100%; overflow-y: scroll; display: none;">
                            <div class="DLP_Attachment_Box_Drop_1 DLP_Fill_Col" style="height: 96px; display: none;">
                                <div class="DLP_Row DLP_Gap_6" style="opacity: 0.5;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀉂</p>
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">Drop here to attach</p>
                                </div>
                            </div>
                        </div>

                        <div class="DLP_HStack_8" style="align-items: flex-end;">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Hide_Scrollbar" id="DLP_Inset_Button_1_ID" style="width: 48px; background: rgba(var(--DLP-blue), 0.10); outline-offset: -2px; outline: 2px solid rgba(var(--DLP-blue), 0.20);">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀅼</p>
                                <input type="file" id="DLP_Attachment_Input_1" accept="image/*, video/*" multiple style="display: none;">
                            </div>
                            <div class="DLP_Input_Style_1_Active" style="padding: 0;">
                                <textarea type="text" placeholder="Type here..." id="DLP_Inset_Input_1_ID" class="DLP_Input_Style_1 DLP_Hide_Scrollbar" style="padding: 16px; box-sizing: content-box; overflow: scroll;"></textarea>
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_NoSelect" id="DLP_Inset_Button_2_ID" style="width: 48px;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</div>
`;
CSS2 = `
.DLP_NoSelect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.DLP_Text_Style_1 {
    font-family: "Duolingo PRO Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_Text_Style_2 {
    font-family: "Duolingo PRO Rounded";
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_Magnetic_Hover_1 {
    transition: filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);
    cursor: pointer;
}
.DLP_Magnetic_Hover_1:hover {
    filter: brightness(0.9);
    transform: scale(1.05);
}
.DLP_Magnetic_Hover_1:active {
    filter: brightness(0.9);
    transform: scale(0.9);
}

.DLP_Hover_1 {
    transition: filter 0.4s cubic-bezier(0.16, 1, 0.32, 1);
    cursor: pointer;
}
.DLP_Hover_1:hover {
    filter: brightness(0.9);
}
.DLP_Hover_1:active {
    filter: brightness(0.9);
}



.DLP_Row {
    display: flex;
    flex-direction: row;
}
.DLP_Col {
    display: flex;
    flex-direction: column;
}

.DLP_Auto {
    justify-content: space-between;
}
.DLP_Hug {
    justify-content: center;
}
.DLP_Fill_Row {
    align-self: stretch;
}
.DLP_Fill_Col {
    flex: 1 0 0;
}

.DLP_Left {
    justify-content: flex-start;
}
.DLP_Right {
    justify-content: flex-end;
}

.DLP_Top {
    align-items: flex-start;
}
.DLP_Center {
    align-items: center;
}
.DLP_Bottom {
    align-items: flex-end;
}

.DLP_Gap_0 {
    gap: 0px;
}
.DLP_Gap_2 {
    gap: 2px;
}
.DLP_Gap_4 {
    gap: 4px;
}
.DLP_Gap_6 {
    gap: 6px;
}
.DLP_Gap_8 {
    gap: 8px;
}
.DLP_Gap_12 {
    gap: 12px;
}
.DLP_Gap_16 {
    gap: 16px;
}
.DLP_Gap_24 {
    gap: 24px;
}
.DLP_Gap_32 {
    gap: 32px;
}



.DLP_Main {
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 8px;

    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 2;
}
@media (max-width: 699px) {
    .DLP_Main {
        display: inline-flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        gap: 8px;

        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 2;
        margin-bottom: 80px;
    }
}
.DLP_Main_Box {
    display: flex;
    width: 312px;
    padding: 16px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    overflow: hidden;

    border-radius: 20px;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);
    backdrop-filter: blur(16px);
}
.DLP_Main_Box_Divider {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    width: 100%;
}
svg {
    flex-shrink: 0;
}
.DLP_HStack_Auto {
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
}
.DLP_HStack_Auto_Top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    align-self: stretch;
}
.DLP_HStack_0 {
    display: flex;
    align-items: center;
    gap: 0;
    align-self: stretch;
}
.DLP_HStack_4 {
    display: flex;
    align-items: center;
    gap: 4px;
    align-self: stretch;
}
.DLP_HStack_6 {
    display: flex;
    align-items: center;
    gap: 6px;
    align-self: stretch;
}
.DLP_HStack_8 {
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}
.DLP_VStack_0 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    align-self: stretch;
}
.DLP_VStack_4 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
}
.DLP_VStack_6 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    align-self: stretch;
}
.DLP_VStack_8 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}
.DLP_VStack_12 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    align-self: stretch;
}
.DLP_Hide_Scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.DLP_Hide_Scrollbar::-webkit-scrollbar {
    display: none;
}
.DLP_Button_Style_1 {
    display: flex;
    height: 40px;
    padding: 10px 12px 10px 10px;
    box-sizing: border-box;
    align-items: center;
    gap: 6px;
    flex: 1 0 0;

    border-radius: 8px;
}
.DLP_Input_Style_1 {
    border: none;
    outline: none;
    background: none;

    font-family: "Duolingo PRO Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: rgb(var(--DLP-blue));

    width: 100%;

    width: 100%; /* Full width */
    height: auto; /* Let the height be controlled dynamically */
    min-height: 1.2em; /* Set minimum height for one line */
    max-height: calc(1.2em * 5); /* Limit to 5 lines */
    line-height: 1.2em; /* Adjust the line height */
    overflow-y: hidden; /* Hide vertical scrollbar */
    resize: none; /* Prevent manual resizing */
    padding: 0; /* Remove padding to eliminate extra space */
    margin: 0; /* Remove margin to eliminate extra space */
    box-sizing: border-box; /* Include padding in height calculation */

}
.DLP_Input_Style_1::placeholder {
    color: rgba(var(--DLP-blue), 0.50);
}
.DLP_Input_Input_Style_1 {
    border: none;
    outline: none;
    background: none;
    text-align: right;

    font-family: "Duolingo PRO Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    color: rgb(var(--DLP-blue));

    width: 100%;
}
.DLP_Input_Input_Style_1::placeholder {
    color: rgba(var(--DLP-blue), 0.50);
}
.DLP_Input_Style_1_Active {
    display: flex;
    height: 48px;
    padding: 16px;
    box-sizing: border-box;
    align-items: center;
    flex: 1 0 0;
    gap: 6px;

    border-radius: 8px;
    outline: 2px solid rgba(var(--DLP-blue), 0.20);
    outline-offset: -2px;
    background: rgba(var(--DLP-blue), 0.10);
}
.DLP_Input_Button_Style_1_Active {
    display: flex;
    height: 48px;
    padding: 12px 12px 12px 14px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    gap: 6px;

    border-radius: 8px;
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: rgb(var(--DLP-blue));
}
@keyframes DLP_Rotate_360_Animation_1 {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes DLP_Pulse_Opacity_Animation_1 {
    0% {
        opacity: 1;
    }
    16.66666666% {
        opacity: 0.75;
    }
    33.33333333% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
}
@keyframes DLP_Pulse_Opacity_Animation_2 {
    0% {
        opacity: 0.75;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 0.75;
    }
}
.DLP_Scroll_Box_Style_1 {
    display: flex;
    height: 200px;
    padding: 14px 16px;
    box-sizing: border-box;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    border-radius: 8px;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);

    position: relative;
}
.DLP_Scroll_Box_Text_Style_1 {
    font-family: "Duolingo PRO Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    opacity: 0.5;
    margin: 0;

    overflow-y: scroll;
    overflow-x: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 16px;
    left: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
}
.DLP_Scroll_Box_Text_Style_1::-webkit-scrollbar {
    transform: translateX(16px);
}
.DLP_Button_Style_2 {
    display: flex;
    height: 48px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    gap: 6px;
    flex: 1 0 0;

    border-radius: 8px;
}
.DLP_Toggle_Style_1 {
    display: flex;
    width: 48px;
    height: 48px;
    padding: 16px;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    gap: 6px;

    border-radius: 8px;
    transition: background 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);
}
.DLP_Toggle_Style_1_ON {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: rgb(var(--DLP-green));
}
.DLP_Toggle_Style_1_OFF {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: rgb(var(--DLP-pink));
}
.DLP_Large_Input_Box_Style_1 {
    display: flex;
    padding: 16px;
    box-sizing: border-box;
    justify-content: center;
    align-items: flex-start;
    align-self: stretch;

    border-radius: 8px;
    border: none;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);

    color: rgb(var(--color-eel), 0.50);
    font-size: 16px;
    font-weight: 500;
    font-family: Duolingo PRO Rounded, 'din-round' !important;

    resize: vertical;
    transition: .2s;
}
.DLP_Large_Input_Box_Style_1::placeholder {
    font-weight: 500;
    color: rgb(var(--color-eel), 0.25);
}
.DLP_Large_Input_Box_Style_1:focus {
    outline: 2px solid rgb(var(--DLP-blue));
}
.DLP_Feedback_Type_Button_Style_1_ON {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: rgb(var(--DLP-pink));
}
.DLP_Feedback_Type_Button_Style_1_ON .DLP_Text_Style_1 {
    color: #FFF;
}
.DLP_Feedback_Type_Button_Style_1_OFF {
    outline: 2px solid rgba(255, 45, 85, 0.20);
    outline-offset: -2px;
    background: rgba(255, 45, 85, 0.10);
}
.DLP_Feedback_Type_Button_Style_1_OFF .DLP_Text_Style_1 {
    color: rgb(var(--DLP-pink));
}
.DLP_Feedback_Type_Button_Style_2_ON {
    outline: 2px solid rgba(0, 0, 0, 0.20);
    outline-offset: -2px;
    background: rgb(var(--DLP-green));
}
.DLP_Feedback_Type_Button_Style_2_ON .DLP_Text_Style_1 {
    color: #FFF;
}
.DLP_Feedback_Type_Button_Style_2_OFF {
    outline: 2px solid rgba(52, 199, 89, 0.20);
    outline-offset: -2px;
    background: rgba(52, 199, 89, 0.10);
}
.DLP_Feedback_Type_Button_Style_2_OFF .DLP_Text_Style_1 {
    color: rgb(var(--DLP-green));
}

.DLP_Notification_Main {
    display: flex;
    justify-content: center;
    align-items: center;

    transition: 0.8s cubic-bezier(0.16, 1, 0.32, 1);
    width: 300px;
    position: fixed;
    left: calc(50% - (300px / 2));
    z-index: 210;
    bottom: 16px;
    border-radius: 16px;
}
.DLP_Notification_Box {
    display: flex;
    width: 300px;
    padding: 16px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;

    border-radius: 16px;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);
    backdrop-filter: blur(16px);

    transition: 0.8s cubic-bezier(0.16, 1, 0.32, 1);
    filter: blur(16px);
    opacity: 0;
}
._2V6ug._1ursp._7jW2t._2hkLC._1wiIJ {
    width: 36px !important;
    height: 38px !important;
}
._2V6ug._1ursp._7jW2t._2hkLC._1wiIJ::before {
    border-radius: 20px !important;
}
.DLP_Tooltip {
    position: fixed;
    display: inline-flex;
    height: 40px;
    padding: 10px 14px;
    box-sizing: border-box;
    margin: 0;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;

    border-radius: 24px;
    outline: 2px solid rgb(var(--color-eel), 0.10);
    outline-offset: -2px;
    background: rgb(var(--color-snow), 0.90);
    backdrop-filter: blur(4px);
    filter: blur(8px);

    font-family: Duolingo PRO Rounded;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;
    white-space: nowrap;
    pointer-events: none;
}
.DLP_Tooltip.DLP_Tooltip_Visible {
    opacity: 1;
    filter: blur(0px);
}
.DLP_Attachment_Box_1 {
    width: 96px;
    height: 96px;
    aspect-ratio: 1/1;
    object-fit: cover;
    overflow: hidden;
    position: relative;

    border-radius: 8px;
    outline: 2px solid rgba(var(--color-black-white), 0.20);
    outline-offset: -2px;
    background: rgba(var(--color-black-text), 0.20); /* Gotta change */
}
.DLP_Attachment_Box_1_Content {
    width: 100%;
    height: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
}
.DLP_Attachment_Box_1_Hover {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    background: rgba(var(--color-snow), 0.50);
    backdrop-filter: blur(8px);
    outline: inherit;
    outline-offset: inherit;
    border-radius: inherit;
}
.DLP_Attachment_Box_Large_View_1 {
    display: flex;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    background: rgba(var(--color-snow), 0.00);
    backdrop-filter: blur(0px);
    z-index: 211;
    transition: 0.4s cubic-bezier(0.16, 1, 0.32, 1);
}
.DLP_Attachment_Box_Drop_1 {
    display: flex;
    height: 48px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 6px;

    border-radius: 8px;
    /* outline: 2px dashed rgba(var(--DLP-blue), 0.20); */
    outline: 2px solid rgba(var(--DLP-blue), 0.20);
    outline-offset: -2px;
    background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.90);
}

@keyframes slideRight {
  0% {
    transform: translateX(-150px);
  }
  20% {
    transform: translateX(200px);
  }
  100% {
    transform: translateX(200px);
  }
}

`;

HTML3 = `
<div class="DLP_Notification_Box" style="position: fixed;">
    <div class="DLP_HStack_4" style="align-items: center;">
        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID DLP_NoSelect" style="align-self: stretch;"></p>
        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="opacity: 0.5; flex: 1 0 0;"></p>
        <p class="DLP_Text_Style_1 DLP_Inset_Icon_2_ID DLP_Magnetic_Hover_1 DLP_NoSelect" style="opacity: 0.5; align-self: stretch;">􀆄</p>
    </div>
    <p class="DLP_Text_Style_1 DLP_Inset_Text_2_ID" style="opacity: 0.25; align-self: stretch; overflow-wrap: break-word;"></p>
</div>
`;

HTML4 = `
.solving-btn {
    position: relative;
    min-width: 150px;
    font-size: 17px;
    border: none;
    border-bottom: 4px solid #2b70c9;
    border-radius: 16px;
    padding: 13px 16px;
    transition: filter .0s;
    font-weight: 700;
    letter-spacing: .8px;
    background: #1cb0f6;
    color: rgb(var(--color-snow));
    cursor: pointer;
}
.solve-btn {
    position: relative;
    min-width: 100px;
    font-size: 17px;
    border: none;
    border-bottom: 4px solid #ff9600;
    border-radius: 16px;
    padding: 13px 16px;
    transition: filter .0s;
    font-weight: 700;
    letter-spacing: .8px;
    background: #ffc800;
    color: rgb(var(--color-snow));
    cursor: pointer;
}
.auto-solver-btn:hover {
    filter: brightness(1.1);
}
.auto-solver-btn:active {
    border-bottom: 0px;
    margin-bottom: 4px;
    top: 4px;
}
`;

HTML5 = `
<div class="DLP_AutoServer_Mother_Box" style="display: none; opacity: 0; filter: blur(8px);">
    <div class="DLP_AutoServer_Box DLP_Hide_Scrollbar">
        <div class="DLP_AutoServer_Menu_Bar">
            <div style="display: flex; justify-content: center; align-items: center; gap: 6px; opacity: 0.5;">
                <p id="DLP_AutoServer_Close_Button_1_ID" class="DLP_AutoServer_Text_Style_1 DLP_Magnetic_Hover_1" style="color: rgb(var(--color-black-text));">􀆄</p>
            </div>
            <div class="DLP_NoSelect" style="display: flex; justify-content: center; align-items: center; gap: 6px; opacity: 0.5;">
                <p class="DLP_AutoServer_Text_Style_1 DLP_Inset_Text_1_ID" style="color: rgb(var(--color-black-text));">Unavailable</p>
                <p class="DLP_AutoServer_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-black-text));">􀌔</p>
            </div>
        </div>
        <div class="DLP_AutoServer_Scroll_Box">

            <div style="display: flex; justify-content: space-between; align-items: center; align-self: stretch;">
                <div style="display: flex; align-items: flex-end; gap: 4px;">
                    <p class="DLP_AutoServer_Text_Style_2 DLP_NoSelect">AutoServer</p>
                    <div class="DLP_HStack_4" style="align-items: center; padding-top: 6px;">
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">by Duolingo</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO</p>
                    </div>
                </div>
                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${versionName}</p>
            </div>

            <div class="DLP_AutoServer_Default_Box" style="background: linear-gradient(rgba(var(--color-snow), 0.8), rgba(var(--color-snow), 0.8)), url(${serverURL}/static/images/flow/primary/512/light.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="display: flex; display: none; flex-direction: column; align-items: flex-start; gap: 6px; align-self: stretch; width: 100%;">
                    <div class="DLP_HStack_Auto">
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect">Settings</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect">􀍟</p>
                    </div>
                    <div class="DLP_HStack_Auto">
                        <div class="DLP_HStack_4" style="align-items: center;">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect">􀆪</p>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect">Timezone</p>
                        </div>
                        <p class="DLP_AutoServer_Text_Style_1">America/NewYork - 11:45 PM</p>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; align-self: stretch; width: 100%;">
                    <div class="DLP_HStack_Auto" style="align-items: center; width: 100%;">
                        <p class="DLP_AutoServer_Text_Style_1">Under Construction</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect">􀇿</p>
                    </div>
                    <p class="DLP_AutoServer_Text_Style_1" style="opacity: 0.5;">AutoServer is currently under construction and unavailable. We appreciate your patience and will provide updates as progress continues.</p>
                </div>
            </div>

            <div class="DLP_AutoServer_Default_Box" style="height: 256px; background: linear-gradient(rgba(var(--color-snow), 0), rgba(var(--color-snow), 0)), url(${serverURL}/static/images/flow/primary/512/light.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="display: flex; width: 168px; flex-direction: column; justify-content: space-between; align-items: flex-start; align-self: stretch;">
                    <div class="DLP_VStack_6">
                        <div class="DLP_HStack_Auto">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀙭</p>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Streak Protector</p>
                        </div>
                        <div class="DLP_HStack_Auto">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            <div class="DLP_HStack_4 DLP_Magnetic_Hover_1">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Active</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀃳</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF; display: none;">􀂒</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_12">
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀃟</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">2 Days</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_2_ID" style="color: #FFF;">􀑎</p>
                            </div>
                        </div>
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting Time:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀄃</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Morning</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_2_ID" style="color: #FFF;">􀯿</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: 1 0 0; align-self: stretch;">
                    <div class="DLP_VStack_6" style="height: 100%; justify-content: flex-start;">
                        <div class="DLP_HStack_Auto">
                            <div class="DLP_HStack_4">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀅵</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Info</p>
                            </div>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">This function is in BETA</p>
                        </div>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Streak Protector extends your streak by completing a lesson in our servers.</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">You can only protect your streak for up to 7 days. Donate to protect longer.</p>
                        <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 6px; flex: 1 0 0; align-self: stretch;">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Learn More</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="DLP_AutoServer_Default_Box" style="height: 256px; background: linear-gradient(rgba(var(--color-snow), 0), rgba(var(--color-snow), 0)), url(${serverURL}/static/images/flow/secondary/512/light.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="display: flex; width: 168px; flex-direction: column; justify-content: space-between; align-items: flex-start; align-self: stretch;">
                    <div class="DLP_VStack_6">
                        <div class="DLP_HStack_Auto">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀙨</p>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">League Protector</p>
                        </div>
                        <div class="DLP_HStack_Auto">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            <div class="DLP_HStack_4 DLP_Magnetic_Hover_1">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Active</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀃳</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF; display: none;">􀂒</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_12">
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀃟</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">5 Days</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_2_ID" style="color: #FFF;">􀑎</p>
                            </div>
                        </div>
                        <div class="DLP_VStack_6">
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Protecting Mode:</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0;">BETA</p>
                            </div>
                            <div class="DLP_HStack_Auto">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_1_ID" style="color: #FFF;">􀄃</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Chill</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Magnetic_Hover_1 DLP_Inset_Icon_2_ID" style="color: #FFF;">􀯿</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; flex: 1 0 0; align-self: stretch;">
                    <div class="DLP_VStack_6" style="height: 100%; justify-content: flex-start;">
                        <div class="DLP_HStack_Auto">
                            <div class="DLP_HStack_4">
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀅵</p>
                                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF;">Info</p>
                            </div>
                            <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">This function is in BETA</p>
                        </div>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">League Protector protects your league position by completing lessons in our servers.</p>
                        <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">You only have access to Chill and Standard Mode with up to 7 days of protection. Donate to get access to Aggressive Mode and longer protection.</p>
                        <div style="display: flex; justify-content: flex-end; align-items: flex-end; gap: 6px; flex: 1 0 0; align-self: stretch;">
                            <p class="DLP_AutoServer_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="color: #FFF; opacity: 0.5;">Learn More</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
`;
CSS5 = `
.DLP_AutoServer_Text_Style_1 {
    font-family: "Duolingo PRO Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_AutoServer_Text_Style_2 {
    font-family: "Duolingo PRO Rounded";
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.DLP_AutoServer_Mother_Box {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    z-index: 210;
    transition: filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1);

    background: rgba(var(--color-snow), 0.50);
    backdrop-filter: blur(16px);
}

.DLP_AutoServer_Box {
    display: flex;
    width: 512px;
    height: 512px;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;

    border-radius: 20px;
    border: 2px solid rgba(var(--color-eel), 0.10);
    background: rgba(var(--color-snow), 0.90);
    backdrop-filter: blur(16px);
    box-sizing: border-box;
}

.DLP_AutoServer_Menu_Bar {
    display: flex;
    width: 100%;
    height: 64px;
    padding: 16px;
    justify-content: space-between;
    align-items: center;

    position: sticky;
    top: 0;
    right: 0;
    left: 0;

    background: rgba(var(--color-snow), 0.80);
    backdrop-filter: blur(8px);
    z-index: 2;
}

.DLP_AutoServer_Scroll_Box {
    display: flex;
    padding: 0 16px 16px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
}

.DLP_AutoServer_Default_Box {
    display: flex;
    padding: 16px;
    justify-content: center;
    align-items: center;
    gap: 16px;
    align-self: stretch;

    border-radius: 8px;
    outline: 2px solid rgba(0, 0, 0, 0.10);
    outline-offset: -2px;
}
`;

HTML6 = `
<div class="DPAutoServerButtonMainMenu">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_952_270)">
            <rect width="30" height="30" rx="15" fill="rgb(var(--DLP-blue))"/>
            <path d="M19.9424 20.5947H10.4404C7.96582 20.5947 6.04492 18.7764 6.04492 16.582C6.04492 14.8115 7.02246 13.3623 8.61523 13.0342C8.73145 11.0859 10.5361 9.77344 12.3545 10.1904C13.2773 8.88477 14.7061 8.02344 16.4766 8.02344C19.4502 8.02344 21.7334 10.2998 21.7402 13.458C23.1279 14.0322 23.9551 15.3926 23.9551 16.876C23.9551 18.9404 22.1777 20.5947 19.9424 20.5947ZM10.6318 16.1445C10.2285 16.6504 10.6934 17.1904 11.2539 16.9102L13.4688 15.7549L16.1006 17.2109C16.2578 17.2998 16.4082 17.3477 16.5586 17.3477C16.7705 17.3477 16.9688 17.2383 17.1465 17.0195L19.3818 14.1963C19.7646 13.7109 19.3203 13.1641 18.7598 13.4443L16.5312 14.5928L13.9062 13.1436C13.7422 13.0547 13.5986 13.0068 13.4414 13.0068C13.2363 13.0068 13.0381 13.1094 12.8535 13.335L10.6318 16.1445Z" fill="white"/>
        </g>
        <defs>
            <clipPath id="clip0_952_270">
                <rect width="30" height="30" rx="15" fill="#FFF"/>
            </clipPath>
        </defs>
    </svg>
    <p class="DPAutoServerElementsMenu DLP_NoSelect" style="flex: 1 0 0; color: rgb(var(--DLP-blue)); font-size: 16px; font-style: normal; font-weight: 700; line-height: normal; margin: 0px;">AUTOSERVER</p>
    <svg class="DPAutoServerElementsMenu" style="opacity: 0;" width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.57031 7.85938C8.57031 8.24219 8.4375 8.5625 8.10938 8.875L2.20312 14.6641C1.96875 14.8984 1.67969 15.0156 1.33594 15.0156C0.648438 15.0156 0.0859375 14.4609 0.0859375 13.7734C0.0859375 13.4219 0.226562 13.1094 0.484375 12.8516L5.63281 7.85156L0.484375 2.85938C0.226562 2.60938 0.0859375 2.28906 0.0859375 1.94531C0.0859375 1.26562 0.648438 0.703125 1.33594 0.703125C1.67969 0.703125 1.96875 0.820312 2.20312 1.05469L8.10938 6.84375C8.42969 7.14844 8.57031 7.46875 8.57031 7.85938Z" fill="rgb(var(--DLP-blue))"/>
    </svg>
</div>
`;
CSS6 = `
.DPAutoServerButtonMainMenu {
	display: flex;
	box-sizing: border-box;
	justify-content: center;
	align-items: center;
	gap: 16px;
	flex-shrink: 0;

	border-radius: 12px;

	cursor: pointer;
}
.DPAutoServerButtonMainMenu:hover {
	background: rgba(var(--DLP-blue), 0.10);
}
.DPAutoServerButtonMainMenu:active {
	filter: brightness(.9);

}

.DPAutoServerButtonMainMenu:hover .DPAutoServerElementsMenu {
	opacity: 1 !important;
}

.DPAutoServerButtonMainMenuMedium {
	width: 56px;
	height: 52px;
	padding: 8px;
}

.DPAutoServerButtonMainMenuLarge {
	width: 222px;
	height: 52px;
	padding: 16px 17px;
}
`;
HTML7 = `
<div id="DLP_The_Bar_Thing_Box" class="DuolingoProCounterBoxOneClass" style="display: inline-flex; justify-content: center; flex-direction: row-reverse; align-items: center; gap: 4px;">
    <div class="vCIrKKxykXwXyUza DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Button_1_ID">
        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel)); display: none;">􀯠</p>
        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID"></p>
    </div>
    <div class="vCIrKKxykXwXyUza DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Button_2_ID">
        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel));">􀊣</p>
        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID">Mute</p>
    </div>
    <div class="vCIrKKxykXwXyUza DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Button_3_ID" style="width: 40px; padding: 0;">
        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel)); transition: all 0.8s cubic-bezier(0.16, 1, 0.32, 1);">􀯸</p>
    </div>
</div>
`;
CSS7 = `
.vCIrKKxykXwXyUza {
    outline: 2px solid rgb(var(--color-swan));
    outline-offset: -2px;
    height: 40px;
    width: auto;
    padding: 0 16px;
    gap: 6px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;

    border-radius: 32px;
    background: rgb(var(--color-snow), 0.84);
    backdrop-filter: blur(16px);
    overflow: hidden;

    transition: all 0.4s cubic-bezier(0.16, 1, 0.32, 1);
    cursor: pointer;
}
.vCIrKKxykXwXyUza p {
    white-space: nowrap;
}
.vCIrKKxykXwXyUza svg {
    flex-shrink: 0;
}
`;
}

function One() {
    Two();

    document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS1 }));
    document.body.insertAdjacentHTML('beforeend', HTML2);
    document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS2 }));

    document.body.insertAdjacentHTML('beforeend', HTML5);
    document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS5 }));

    let DPAutoServerButtonMainMenuElement = null;
    let DPAutoServerButtonMainMenuStyle = null;

    function DPAutoServerButtonMainMenuFunction() {
        try {
            if (storageLocal.settings.showAutoServerButton && alpha) {
                let targetElement = document.querySelector('._2uLXp');
                if (!targetElement || document.querySelector('.DPAutoServerButtonMainMenu')) return;

                DPAutoServerButtonMainMenuStyle = document.createElement('style');
                DPAutoServerButtonMainMenuStyle.type = 'text/css';
                DPAutoServerButtonMainMenuStyle.innerHTML = CSS6;
                document.head.appendChild(DPAutoServerButtonMainMenuStyle);

                let targetDivLast = document.querySelector('[data-test="profile-tab"]');

                if (targetElement && targetDivLast) {
                    targetElement.lastChild.insertAdjacentHTML('beforebegin', HTML6);

                    let otherTargetDiv = document.querySelector('.DPAutoServerButtonMainMenu');
                    otherTargetDiv.addEventListener('click', () => {
                        manageAutoServerWindowVisibility(true);
                    });

                    let lastWidth = targetElement.offsetWidth;
                    const resizeObserver = new ResizeObserver(entries => {
                        for (let entry of entries) {
                            if (entry.target.offsetWidth !== lastWidth) {
                                otherTargetDiv.remove();
                                DPAutoServerButtonMainMenuFunction();
                                lastWidth = entry.target.offsetWidth;
                            }
                        }
                    });
                    resizeObserver.observe(targetElement);

                    if (targetElement.offsetWidth < 100) {
                        otherTargetDiv.classList.add('DPAutoServerButtonMainMenuMedium');
                        document.querySelectorAll('.DPAutoServerElementsMenu').forEach(function(element) {
                            element.remove();
                        });
                    } else {
                        otherTargetDiv.classList.add('DPAutoServerButtonMainMenuLarge');
                    }
                }
            }
        } catch(error) {}
    }
    setInterval(DPAutoServerButtonMainMenuFunction, 500);

    document.querySelector('.DLP_AutoServer_Mother_Box').querySelector('#DLP_AutoServer_Close_Button_1_ID').addEventListener('click', () => {
        manageAutoServerWindowVisibility(false);
    });
    document.querySelector('.DLP_AutoServer_Mother_Box').addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            manageAutoServerWindowVisibility(false);
        }
    });
    function manageAutoServerWindowVisibility(state) {
        if (state) {
            document.querySelector('.DLP_AutoServer_Mother_Box').style.display = "";
            document.querySelector('.DLP_AutoServer_Mother_Box').offsetHeight;
            document.querySelector('.DLP_AutoServer_Mother_Box').style.opacity = "1";
            document.querySelector('.DLP_AutoServer_Mother_Box').style.filter = "blur(0px)";
        } else {
            document.querySelector('.DLP_AutoServer_Mother_Box').style.opacity = "0";
            document.querySelector('.DLP_AutoServer_Mother_Box').style.filter = "blur(8px)";
            setTimeout(() => {
                document.querySelector('.DLP_AutoServer_Mother_Box').style.display = "none";
            }, 400);
        }
    }

    let counterPaused = false;
    function DuolingoProCounterOneFunction() {
        function handleMuteTab(value) {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            muteTab(value);
            let button = document.querySelector('#DLP_Inset_Button_2_ID');
            if (value) {
                setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Muted', icon: '􀊣'}, {text: '', icon: ' '}, () => {
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                });
            } else {
                setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Mute', icon: '􀊧'}, {text: '', icon: ' '}, () => {
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                });
            }
        }

        if ((window.location.pathname.includes('/lesson') || window.location.pathname.includes('/practice')) && storageSession.legacy.status) {
            let theBarThing = document.querySelector('#DLP_The_Bar_Thing_Box');
            if (!theBarThing) {
                document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS7 }));
                //const targetElement1 = document.querySelector('.I-Avc._1zcW8');
                const targetElement1 = document.querySelector('._1zcW8');
                const targetElement2 = document.querySelector('.mAxZF');
                if (targetElement1) {
                    targetElement1.insertAdjacentHTML('beforeend', HTML7);
                    theBarThing = document.querySelector('#DLP_The_Bar_Thing_Box');
                    targetElement1.style.display = "flex";
                    document.querySelector('[role="progressbar"]').style.width = "100%";
                } else if (targetElement2) {
                    targetElement2.insertAdjacentHTML('beforeend', HTML7);
                    theBarThing = document.querySelector('#DLP_The_Bar_Thing_Box');
                    theBarThing.style.marginLeft = '24px';
                    document.querySelector('._15ch1').style.pointerEvents = 'all';
                }
                else if (debug) console.log('Element with class ._1zcW8 or .mAxZF not found');

                let muteButton = theBarThing.querySelector('.DLP_Inset_Button_2_ID');
                let expandButton = theBarThing.querySelector('.DLP_Inset_Button_3_ID');
                let expandButtonIcon = expandButton.querySelector('.DLP_Inset_Icon_1_ID');
                let theBarThingExtended = false;
                function theBarThingExtend(button, visibility, noAnimation) {
                    if (visibility) {
                        button.style.display = "";
                        button.style.width = "";
                        button.style.padding = "";
                        button.style.transition = '';
                        let remember0010 = button.offsetWidth;
                        button.style.width = "0px";
                        requestAnimationFrame(() => {
                            button.style.width = remember0010 + "px";
                            button.style.padding = "";
                            button.style.filter = "blur(0px)";
                            button.style.opacity = "1";
                            button.style.margin = "";
                        });
                    } else {
                        button.style.transition = '';
                        button.style.width = button.offsetWidth + "px";
                        requestAnimationFrame(() => {
                            button.style.width = "4px";
                            button.style.padding = "0";
                            button.style.filter = "blur(8px)";
                            button.style.margin = "0 -4px";
                            button.style.opacity = "0";
                        });
                        if (!noAnimation) {
                            setTimeout(function() {
                                button.style.display = "none";
                            }, 400);
                        } else {
                            button.style.display = "none";
                        }
                    }
                }
                theBarThingExtend(muteButton, false, true);
                expandButton.addEventListener('click', () => {
                    if (theBarThingExtended) {
                        expandButtonIcon.style.transform = "rotate(0deg)";
                        theBarThingExtended = false;
                        theBarThingExtend(muteButton, false);
                    } else {
                        expandButtonIcon.style.transform = "rotate(180deg)";
                        theBarThingExtended = true;
                        theBarThingExtend(muteButton, true);
                    }
                });

                let counterButton = theBarThing.querySelector('.DLP_Inset_Button_1_ID');
                counterButton.addEventListener('click', () => {
                    if (isBusySwitchingPages) return;
                    isBusySwitchingPages = true;
                    if (theBarThing.querySelector('#DLP_Inset_Button_1_ID').querySelector('#DLP_Inset_Text_1_ID').innerHTML === 'Click Again to Stop Legacy') {
                        setButtonState(counterButton, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Stopping', icon: undefined}, {text: '', icon: ''}, () => {
                            storageSession.legacy.status = false;
                            saveStorageSession();
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                                window.location.href = "https://duolingo.com";
                            }, 400);
                        });
                    } else {
                        counterPaused = true;
                        setButtonState(counterButton, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Click Again to Stop', icon: undefined}, {text: '', icon: ''}, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                                setTimeout(() => {
                                    if (storageSession.legacy.status) counterPaused = false;
                                }, 4000);
                            }, 400);
                        });
                    }
                });

                if (storageLocal.settings.muteLessons) {
                    handleMuteTab(true);
                }

                document.querySelector('#DLP_Inset_Button_2_ID').addEventListener('click', () => {
                    storageLocal.settings.muteLessons = !storageLocal.settings.muteLessons;
                    saveStorageLocal();
                    handleMuteTab(storageLocal.settings.muteLessons);
                });
            }

            function updateCounter() {
                let button = theBarThing.querySelector('.DLP_Inset_Button_1_ID');
                let text = button.querySelector('.DLP_Inset_Text_1_ID');

                if (storageSession.legacy[storageSession.legacy.status].type === 'infinity' && text.textContent !== 'Infinity') {
                    isBusySwitchingPages = true;
                    setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Infinity', icon: '􀯠'}, {text: '', icon: ''}, () => {
                        setTimeout(() => {
                            isBusySwitchingPages = false;
                        }, 400);
                    });
                } else if (storageSession.legacy[storageSession.legacy.status].type === 'xp' && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' XP Left')) {
                    isBusySwitchingPages = true;
                    setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: String(storageSession.legacy[storageSession.legacy.status].amount + ' XP Left'), icon: ''}, {text: '', icon: ''}, () => {
                        setTimeout(() => {
                            isBusySwitchingPages = false;
                        }, 400);
                    });
                } else if (window.location.pathname === '/practice') {
                    if (storageSession.legacy[storageSession.legacy.status].amount === 1 && text.textContent !== 'Last Practice') {
                        isBusySwitchingPages = true;
                        setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Last Practice', icon: ''}, {text: '', icon: ''}, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount === 0 && text.textContent !== 'Finishing Up') {
                        isBusySwitchingPages = true;
                        setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Finishing Up', icon: ''}, {text: '', icon: ''}, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount > 1 && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' Practices Left')) {
                        isBusySwitchingPages = true;
                        setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: String(storageSession.legacy[storageSession.legacy.status].amount + ' Practices Left'), icon: ''}, {text: '', icon: ''}, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    }
                } else if (storageSession.legacy[storageSession.legacy.status].type === 'lesson') {
                    if (storageSession.legacy[storageSession.legacy.status].amount === 1 && text.textContent !== 'Last Lesson') {
                        isBusySwitchingPages = true;
                        setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Last Lesson', icon: ''}, {text: '', icon: ''}, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount === 0 && text.textContent !== 'Finishing Up') {
                        isBusySwitchingPages = true;
                        setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: 'Finishing Up', icon: ''}, {text: '', icon: ''}, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount > 1 && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' Lessons Left')) {
                        isBusySwitchingPages = true;
                        setButtonState(button, {button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))'}, {text: String(storageSession.legacy[storageSession.legacy.status].amount + ' Lessons Left'), icon: ''}, {text: '', icon: ''}, () => {
                            setTimeout(() => {
                                isBusySwitchingPages = false;
                            }, 400);
                        });
                    }
                }
            }

            if (!counterPaused) updateCounter();
        }
    }
    setInterval(DuolingoProCounterOneFunction, 500);


    window.onfocus = () => {
        windowBlurState = true;
    };
    window.onblur = () => {
        windowBlurState = false;
    };

    function addButtons() {
        if (!storageLocal.settings.showSolveButtons) return;
        if (window.location.pathname === '/learn' && document.querySelector('a[data-test="global-practice"]')) return;
        if (document.querySelector("#solveAllButton")) return;

        document.querySelector('[data-test="quit-button"]')?.addEventListener('click', function() {
            solving("stop");
            //storageSession.legacy.status = false;
            //saveStorageSession();
        });

        function createButton(id, text, styleClass, eventHandlers) {
            const button = document.createElement('button');
            button.id = id;
            button.innerText = text;
            button.className = styleClass;
            Object.keys(eventHandlers).forEach(event => {
                button.addEventListener(event, eventHandlers[event]);
            });
            return button;
        }

        const nextButton = document.querySelector('[data-test="player-next"]');
        const storiesContinueButton = document.querySelector('[data-test="stories-player-continue"]');
        const storiesDoneButton = document.querySelector('[data-test="stories-player-done"]');
        const target = nextButton || storiesContinueButton || storiesDoneButton;

        if (document.querySelector('[data-test="story-start"]') && storageSession.legacy.status) {
            document.querySelector('[data-test="story-start"]').click();
        }
        if (!target) {
            const startButton = document.querySelector('[data-test="start-button"]');
            if (!startButton) {
                return;
            }
            const solveAllButton = createButton("solveAllButton", "COMPLETE SKILL", "solve-all-btn", {
                'click': () => {
                    solving(true);
                    setInterval(() => {
                        const startButton = document.querySelector('[data-test="start-button"]');
                        if (startButton && startButton.innerText.startsWith("START")) {
                            startButton.click();
                        }
                    }, 1000);
                    startButton.click();
                }
            });
            startButton.parentNode.appendChild(solveAllButton);
        } else {
            if (document.querySelector('.MYehf') !== null) {
                document.querySelector('.MYehf').style.display = "flex";
                document.querySelector('.MYehf').style.gap = "20px";
            } else if (document.querySelector(".FmlUF") !== null) { // Story
                findReactMainElementClass = '_3TJzR';
                reactTraverseUp = 0;
                document.querySelector('._3TJzR').style.display = "flex";
                document.querySelector('._3TJzR').style.gap = "20px";
            }

            const buttonsCSS = document.createElement('style');
            buttonsCSS.innerHTML = HTML4;
            document.head.appendChild(buttonsCSS);

            const solveCopy = createButton('solveAllButton', systemText[systemLanguage][101], 'auto-solver-btn solving-btn', { click: solving });
            const pauseCopy = createButton('', systemText[systemLanguage][100], 'auto-solver-btn solve-btn', { click: solve });

            target.parentElement.appendChild(pauseCopy);
            target.parentElement.appendChild(solveCopy);

            if (storageSession.legacy.status) {
                solving("start");
            }
        }
    }
    setInterval(addButtons, 500);



    let notificationCount = 0;
    let currentNotification = [];
    let notificationsHovered = false;

    const notificationMain = document.querySelector('.DLP_Notification_Main');
    notificationMain.addEventListener('mouseenter', () => {
        notificationsHovered = true;
    });
    notificationMain.addEventListener('mouseleave', () => {
        notificationsHovered = false;
    });

    function showNotification(icon, head, body, time = 0) {
        notificationCount++;
        let notificationID = notificationCount;
        currentNotification.push(notificationID);

        let element = new DOMParser().parseFromString(HTML3, 'text/html').body.firstChild;
        element.id = 'DLP_Notification_Box_' + notificationID + '_ID';
        notificationMain.appendChild(element);
        initializeMagneticHover(element.querySelector('.DLP_Inset_Icon_2_ID'));

        let iconElement = element.querySelector('.DLP_Inset_Icon_1_ID');
        if (icon === "") {
            iconElement.style.display = 'none';
            playHaptic();
        } else if (icon === "checkmark") {
            iconElement.style.color = "rgb(var(--DLP-green))";
            iconElement.textContent = "􀁣";
            playHaptic("success");
        } else if (icon === "warning") {
            iconElement.style.color = "rgb(var(--DLP-orange))";
            iconElement.textContent = "􀁟";
            playHaptic("warning");
        } else if (icon === "error") {
            iconElement.style.color = "rgb(var(--DLP-pink))";
            iconElement.textContent = "􀇿";
            playHaptic("error");
        } else {
            iconElement.style.color = icon.color;
            iconElement.textContent = icon.icon;
            playHaptic();
        }

        element.querySelector('.DLP_Inset_Text_1_ID').innerHTML = head;
        if (body && body !== "") {
            element.querySelector('.DLP_Inset_Text_2_ID').innerHTML = body;
        } else {
            element.querySelector('.DLP_Inset_Text_2_ID').style.display = "none";
        }

        let notification = document.querySelector(
            '#DLP_Notification_Box_' + notificationID + '_ID'
        );
        let notificationHeight = notification.offsetHeight;
        notification.style.bottom = '-' + notificationHeight + 'px';

        setTimeout(() => {
            requestAnimationFrame(() => {
                notification.style.bottom = "16px";
                notification.style.filter = "blur(0px)";
                notification.style.opacity = "1";
            });
        }, 50);

        let isBusyDisappearing = false;

        let timerData = null;
        if (time !== 0) {
            timerData = {
                remaining: time * 1000,
                lastTimestamp: Date.now(),
                timeoutHandle: null,
                paused: false,
            };
            timerData.timeoutHandle = setTimeout(internalDisappear, timerData.remaining);
        }

        let repeatInterval = setInterval(() => {
            if (document.body.offsetWidth <= 963) {
                requestAnimationFrame(() => {
                    notificationMain.style.width = "300px";
                    notificationMain.style.position = "fixed";
                    notificationMain.style.left = "16px";
                });
            } else {
                requestAnimationFrame(() => {
                    notificationMain.style.width = "";
                    notificationMain.style.position = "";
                    notificationMain.style.left = "";
                });
            }

            if (isBusyDisappearing) return;

            if (timerData) {
                if (notificationsHovered && !timerData.paused) {
                    clearTimeout(timerData.timeoutHandle);
                    let elapsed = Date.now() - timerData.lastTimestamp;
                    timerData.remaining -= elapsed;
                    timerData.paused = true;
                }
                if (!notificationsHovered && timerData.paused) {
                    timerData.paused = false;
                    timerData.lastTimestamp = Date.now();
                    timerData.timeoutHandle = setTimeout(internalDisappear, timerData.remaining);
                }
            }

            if (notificationsHovered) {
                let allIDs = currentNotification.slice();
                let bottoms = {};
                let currentBottom = 16;
                for (let i = allIDs.length - 1; i >= 0; i--) {
                    let notifEl = document.querySelector(
                        '#DLP_Notification_Box_' + allIDs[i] + '_ID'
                    );
                    if (!notifEl) continue;
                    notifEl.style.width = "";
                    notifEl.style.height = "";
                    notifEl.style.transform = "";
                    bottoms[allIDs[i]] = currentBottom;
                    currentBottom += notifEl.offsetHeight + 8;
                }
                notification.style.bottom = bottoms[notificationID] + "px";

                let totalHeight = 0;
                for (let i = 0; i < allIDs.length; i++) {
                    let notifEl = document.querySelector(
                        '#DLP_Notification_Box_' + allIDs[i] + '_ID'
                    );
                    if (notifEl) {
                        totalHeight += notifEl.offsetHeight;
                    }
                }
                if (allIDs.length > 1) {
                    totalHeight += (allIDs.length - 1) * 8;
                }
                notificationMain.style.height = totalHeight + "px";
            } else {
                notificationMain.style.height = '';
                notification.style.bottom = "16px";
                if (currentNotification[currentNotification.length - 1] !== notificationID) {
                    notification.style.height = notificationHeight + 'px';
                    requestAnimationFrame(() => {
                        let latestNotif = document.querySelector(
                            '#DLP_Notification_Box_' +
                            String(currentNotification[currentNotification.length - 1]) +
                            '_ID'
                        );
                        if (latestNotif) {
                            notification.style.height = latestNotif.offsetHeight + 'px';
                        }
                        notification.style.width = "284px";
                        notification.style.transform = "translateY(-8px)";
                    });
                } else {
                    requestAnimationFrame(() => {
                        notification.style.height = notificationHeight + "px";
                        notification.style.width = "";
                        notification.style.transform = "";
                    });
                }
            }
        }, 20);

        function internalDisappear() {
            if (timerData && timerData.timeoutHandle) {
                clearTimeout(timerData.timeoutHandle);
            }
            if (isBusyDisappearing) return;
            isBusyDisappearing = true;
            currentNotification.splice(currentNotification.indexOf(notificationID), 1);

            requestAnimationFrame(() => {
                notification.style.bottom = "-" + notificationHeight + "px";
                notification.style.filter = "blur(16px)";
                notification.style.opacity = "0";
            });
            clearInterval(repeatInterval);
            setTimeout(() => {
                notification.remove();
                if (currentNotification.length === 0) {
                    notificationMain.style.height = '';
                }
            }, 800);
        }

        function disappear() {
            internalDisappear();
        }

        notification.querySelector('.DLP_Inset_Icon_2_ID').addEventListener("click", disappear);

        return {
            close: disappear
        };
    }


    let isBusySwitchingPages = false;
    let pages = {
        "DLP_Onboarding_Start_Button_1_ID": [5],
        "DLP_Switch_Legacy_Button_1_ID": [3],

        "DLP_Universal_Back_1_Button_1_ID": [1],

        "DLP_Main_Settings_1_Button_1_ID": [7],
        //"DLP_Main_Feedback_1_Button_1_ID": [8],

        "DLP_Main_Feedback_1_Button_1_ID": [11],

        "DLP_Main_Whats_New_1_Button_1_ID": [9],
        "DLP_Main_See_More_1_Button_1_ID": [2],
        "DLP_Main_Terms_1_Button_1_ID": [5],

        "DLP_Secondary_Settings_1_Button_1_ID": [7],
        "DLP_Secondary_Feedback_1_Button_1_ID": [8],
        "DLP_Secondary_Whats_New_1_Button_1_ID": [9],
        "DLP_Secondary_See_More_1_Button_1_ID": [4],
        "DLP_Secondary_Terms_1_Button_1_ID": [5],

        "DLP_Terms_Back_Button_1_ID": [1],
        "DLP_Terms_Accept_Button_1_ID": [1],
        "DLP_Terms_Decline_Button_1_ID": [6],
        "DLP_Terms_Declined_Back_Button_1_ID": [5]
    };
    function goToPage(to, buttonID) {
        if (isBusySwitchingPages) return;
        isBusySwitchingPages = true;

        let mainBox = document.querySelector(`.DLP_Main_Box`);
        let toNumber = to;
        let fromPage = document.querySelector(`#DLP_Main_Box_Divider_${currentPage}_ID`);
        let toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);

        let mainBoxNewToBeWidth = mainBox.offsetWidth;

        if (buttonID === 'DLP_Main_Terms_1_Button_1_ID' || buttonID === 'DLP_Secondary_Terms_1_Button_1_ID') {
            document.querySelector(`#DLP_Terms_1_Text_1_ID`).style.display = 'none';
            document.querySelector(`#DLP_Terms_1_Button_1_ID`).style.display = 'none';
            document.querySelector(`#DLP_Terms_1_Text_2_ID`).style.display = 'block';
            document.querySelector(`#DLP_Terms_1_Button_2_ID`).style.display = 'block';
        } else if (buttonID === 'DLP_Terms_Back_Button_1_ID') {
            toNumber = lastPage;
            toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
            setTimeout(() => {
                document.querySelector(`#DLP_Terms_1_Text_1_ID`).style.display = 'block';
                document.querySelector(`#DLP_Terms_1_Button_1_ID`).style.display = 'block';
                document.querySelector(`#DLP_Terms_1_Text_2_ID`).style.display = 'none';
                document.querySelector(`#DLP_Terms_1_Button_2_ID`).style.display = 'none';
            }, 400);
        } else if (buttonID === 'DLP_Universal_Back_1_Button_1_ID' || to === -1) {
            toNumber = lastPage;
            toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
        } else if (buttonID === 'DLP_Switch_Legacy_Button_1_ID') {
            let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
            console.log(storageSession.legacy.page);
            if (storageSession.legacy.page !== 0) {
                toNumber = 1;
                toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
                setButtonState(button, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][106], icon: '􀱏'}, {text: '', icon: ''});
                storageSession.legacy.page = 0;
                saveStorageSession();
            } else {
                toNumber = 3;
                toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
                setButtonState(button, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][105], icon: '􀂑'}, {text: '', icon: ''});
                storageSession.legacy.page = 1;
                saveStorageSession();
            }
        } else if (buttonID === 'DLP_Terms_Accept_Button_1_ID') {
            storageLocal.terms = newTermID;
            saveStorageLocal();
            connectToServer();
        } else if (buttonID === 'DLP_Onboarding_Start_Button_1_ID') {
            storageLocal.onboarding = true;
            saveStorageLocal();
            goToPage(1);
        } else if (buttonID === 'DLP_Main_Feedback_1_Button_1_ID') {
            setTimeout(() => {
                const chatBox = document.querySelector('#DLP_Main_Box_Divider_11_ID')?.querySelector('.DLP_Chat_Box_1_ID_1');
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 420);
        }

        if (toNumber === 11) {
            if (newReplyButtonActive) {
                newReplyButtonActive = false;
                updateConnetionButtonStyles(document.getElementById("DLP_Main_Feedback_1_Button_1_ID"), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][5], icon: '􂄺'}, {text: '', icon: ''});
            }
        }

        if (toNumber === 2) mainBoxNewToBeWidth = "600";
        else if (toNumber === 5) mainBoxNewToBeWidth = "400";
        else if (toNumber === 7) mainBoxNewToBeWidth = "400";
        else if (toNumber === 8) mainBoxNewToBeWidth = "400";
        else if (toNumber === 9) mainBoxNewToBeWidth = "400";
        else if (toNumber === 11) mainBoxNewToBeWidth = "400";
        else mainBoxNewToBeWidth = "312";

        if ([1, 2, 3, 4].includes(toNumber)) legacyButtonVisibility(true);
        else legacyButtonVisibility(false);

        if (toNumber === 3) {
            storageSession.legacy.page = 1;
            saveStorageSession();
        } else if (toNumber === 4) {
            storageSession.legacy.page = 2;
            saveStorageSession();
        }

        let mainBoxOldWidth = mainBox.offsetWidth;
        let mainBoxOldHeight = mainBox.offsetHeight;
        let fromBoxOldWidth = fromPage.offsetWidth;
        let fromBoxOldHeight = fromPage.offsetHeight;
        console.log(fromBoxOldWidth, fromBoxOldHeight);
        mainBox.style.transition = "";
        fromPage.style.display = "none";
        toPage.style.display = "block";
        mainBox.offsetHeight;
        mainBox.style.width = `${mainBoxNewToBeWidth}px`;
        let mainBoxNewWidth = mainBoxNewToBeWidth;
        let mainBoxNewHeight = mainBox.offsetHeight;
        let toBoxOldWidth = toPage.offsetWidth;
        let toBoxOldHeight = toPage.offsetHeight;
        console.log(toBoxOldWidth, toBoxOldHeight);
        fromPage.style.display = "block";
        toPage.style.display = "none";
        mainBox.style.width = `${mainBoxOldWidth}px`;
        mainBox.style.height = `${mainBoxOldHeight}px`;
        mainBox.offsetHeight;

        if (flag02) mainBox.style.transition = "0.8s linear(0.00, -0.130, 0.164, 0.450, 0.687, 0.861, 0.973, 1.04, 1.06, 1.07, 1.06, 1.04, 1.03, 1.02, 1.01, 1.00, 0.999, 0.997, 0.997, 0.997, 0.998, 0.998, 0.999, 0.999, 1.00)";
        else mainBox.style.transition = "0.8s cubic-bezier(0.16, 1, 0.32, 1)";

        mainBox.offsetHeight;
        mainBox.style.width = `${mainBoxNewToBeWidth}px`;
        mainBox.style.height = `${mainBoxNewHeight}px`;

        fromPage.style.transform = `scaleX(1) scaleY(1)`;
        fromPage.style.width = `${fromBoxOldWidth}px`;
        fromPage.style.height = `${fromBoxOldHeight}px`;

        if (flag02) fromPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 1.5s linear(0.00, -0.130, 0.164, 0.450, 0.687, 0.861, 0.973, 1.04, 1.06, 1.07, 1.06, 1.04, 1.03, 1.02, 1.01, 1.00, 0.999, 0.997, 0.997, 0.997, 0.998, 0.998, 0.999, 0.999, 1.00)";
        else fromPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.8s cubic-bezier(0.16, 1, 0.32, 1)";

        fromPage.offsetHeight;
        fromPage.style.opacity = "0";
        fromPage.style.filter = "blur(4px)";
        fromPage.style.transform = `scaleX(${toBoxOldWidth / fromBoxOldWidth}) scaleY(${toBoxOldHeight / fromBoxOldHeight})`;

        toPage.style.width = `${toBoxOldWidth}px`;
        toPage.style.height = `${toBoxOldHeight}px`;
        toPage.style.opacity = "0";
        toPage.style.filter = "blur(4px)";
        toPage.style.transform = `scaleX(${fromBoxOldWidth / toBoxOldWidth}) scaleY(${fromBoxOldHeight / toBoxOldHeight})`;

        if (flag02) toPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 1.5s linear(0.00, -0.130, 0.164, 0.450, 0.687, 0.861, 0.973, 1.04, 1.06, 1.07, 1.06, 1.04, 1.03, 1.02, 1.01, 1.00, 0.999, 0.997, 0.997, 0.997, 0.998, 0.998, 0.999, 0.999, 1.00)";
        else toPage.style.transition = "opacity 0.4s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.8s cubic-bezier(0.16, 1, 0.32, 1)";

        toPage.offsetHeight;
        toPage.style.transform = `scaleX(1) scaleY(1)`;

        setTimeout(() => {
            fromPage.style.display = "none";

            fromPage.style.width = ``;
            fromPage.style.height = ``;
            fromPage.style.transform = ``;

            toPage.style.display = "block";
            toPage.offsetHeight;
            toPage.style.opacity = "1";
            toPage.style.filter = "blur(0px)";
            setTimeout(() => {
                toPage.style.opacity = "";
                toPage.style.filter = "";
                toPage.style.transition = "";

                fromPage.style.transition = "";
                toPage.style.opacity = "";
                toPage.style.filter = "";

                mainBox.style.height = "";

                toPage.style.width = ``;
                toPage.style.height = ``;
                toPage.style.transform = ``;

                lastPage = currentPage;
                currentPage = toNumber;
                isBusySwitchingPages = false;
            }, 400);
        }, 400);
    }
    Object.keys(pages).forEach(function (key) {
        document.querySelectorAll(`#${key}`).forEach(element => {
            element.addEventListener("click", function () {
                if (isBusySwitchingPages || isGetButtonsBusy) return;
                goToPage(pages[key][0], key);
            });
        });
    });
    document.getElementById('DLP_Hide_Button_1_ID').addEventListener("click", function () {
        if (isBusySwitchingPages) return;
        hidden = !hidden;
        hide(hidden);
    });
    function hide(value) {
        if (isBusySwitchingPages) return;
        isBusySwitchingPages = true;
        let button = document.querySelector(`#DLP_Hide_Button_1_ID`);
        let main = document.querySelector(`.DLP_Main`);
        let mainBox = document.querySelector(`.DLP_Main_Box`);

        let mainBoxHeight = mainBox.offsetHeight;

        main.style.transition = "0.8s cubic-bezier(0.16, 1, 0.32, 1)";
        mainBox.style.transition = "0.8s cubic-bezier(0.16, 1, 0.32, 1)";
        if (value) {
            setButtonState(button, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][104], icon: '􀋮'}, {text: '', icon: ''});
            main.style.bottom = `-${mainBoxHeight - 8}px`;
            legacyButtonVisibility(false);
            mainBox.style.filter = "blur(8px)";
            mainBox.style.opacity = "0";
        } else {
            setButtonState(button, {button: 'rgb(var(--DLP-blue)', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][103], icon: '􀋰'}, {text: '', icon: ''});
            main.style.bottom = "16px";
            if (currentPage === 1 || currentPage === 3) legacyButtonVisibility(true);
            mainBox.style.filter = "";
            mainBox.style.opacity = "";
        }
        setTimeout(() => {
            main.style.transition = "";
            mainBox.style.transition = "";
            isBusySwitchingPages = false;
        }, 800);
    }
    document.querySelector(`.DLP_Main`).style.bottom = `-${document.querySelector(`.DLP_Main_Box`).offsetHeight - 8}px`;
    document.querySelector(`.DLP_Main_Box`).style.opacity = "0";
    document.querySelector(`.DLP_Main_Box`).style.filter = "blur(8px)";
    document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`).style.filter = "blur(8px)";
    document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`).style.opacity = "0";
    document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`).style.display = "none";
    hide(false, false);
    function legacyButtonVisibility(value) {
        let legacyButton = document.querySelector(`#DLP_Switch_Legacy_Button_1_ID`);
        legacyButton.style.transition = 'width 0.8s cubic-bezier(0.77,0,0.18,1), opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.8s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
        if (value) {
            legacyButton.style.display = "";
            legacyButton.offsetWidth;
            legacyButton.style.filter = "";
            legacyButton.style.opacity = "";
        } else {
            legacyButton.style.filter = "blur(8px)";
            legacyButton.style.opacity = "0";
            setTimeout(() => {
                legacyButton.style.display = "none";
            }, 800);
        }
    }
    function handleVisibility() {
        if (document.querySelector('.MYehf') !== null || window.location.pathname.includes('/lesson') || window.location.pathname === '/practice') {
            document.querySelector('.DLP_Main').style.display = 'none';
        } else {
            document.querySelector('.DLP_Main').style.display = '';
        }
    }
    setInterval(handleVisibility, 200);

    let isGetButtonsBusy = false;
    function setButtonState(button, color, content, animation, callback) {
        try {
            let textElement = button.querySelector('.DLP_Inset_Text_1_ID');
            let iconElement = button.querySelector('.DLP_Inset_Icon_1_ID');

            let previousText = textElement.textContent;
            let previousIcon = undefined;
            if (iconElement.style.display !== 'none') {
                previousIcon = {
                    icon: iconElement.textContent,
                    color: iconElement.style.color
                };
            }
            textElement.textContent = content.text;
            if (content.icon !== '') {
                if (content.icon !== undefined) iconElement.textContent = content.icon;
            } else {
                iconElement.style.display = 'none';
            }
            let buttonNewWidth = button.offsetWidth;
            textElement.textContent = previousText;
            if (previousIcon !== undefined) {
                iconElement.textContent = previousIcon.icon;
                iconElement.style.color = previousIcon.color;
                iconElement.style.display = '';
            }

            button.style.transition = 'width 0.8s cubic-bezier(0.77,0,0.18,1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
            button.style.width = `${button.offsetWidth}px`;

            requestAnimationFrame(() => {
                textElement.style.transition = '0.4s';
                if (previousIcon !== undefined) iconElement.style.transition = '0.4s';

                textElement.style.filter = 'blur(4px)';
                if (previousIcon !== undefined) iconElement.style.filter = 'blur(4px)';
                textElement.style.opacity = '0';
                if (previousIcon !== undefined) iconElement.style.opacity = '0';
                button.style.width = `${buttonNewWidth}px`;

                button.style.background = color.button;
                button.style.outline = `solid 2px ${color.outline}`;
            });

            setTimeout(() => {
                textElement.style.animation = '';
                if (content.icon !== '') iconElement.style.animation = '';

                textElement.style.transition = '0s';
                if (content.icon !== '') iconElement.style.transition = '0s';
                textElement.style.color = color.text;
                if (content.icon !== '') iconElement.style.color = color.icon;
                void textElement.offsetWidth;
                textElement.style.transition = '0.4s';
                if (content.icon !== '') iconElement.style.transition = '0.4s';

                textElement.textContent = content.text;
                if (content.icon !== '') {
                    if (content.icon !== undefined) iconElement.textContent = content.icon;
                } else {
                    iconElement.style.display = 'none';
                }

                requestAnimationFrame(() => {
                    textElement.style.filter = 'blur(0px)';
                    if (content.icon !== '') iconElement.style.filter = 'blur(0px)';
                    textElement.style.opacity = '1';
                    if (content.icon !== '') iconElement.style.opacity = '1';
                });

                setTimeout(() => {
                    textElement.style.animation = animation.text;
                    if (content.icon !== '') iconElement.style.animation = animation.icon;

                    button.style.width = '';
                }, 400);

                if (callback) callback();
            }, 400);
        } catch (e) {
            console.log('setButton error', e);
        }
    }

    const tooltipObserver = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-dlp-tooltip') {
                tooltipCreate(mutation.target);
                console.log('Attribute changed: registered');
            } else if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-dlp-tooltip')) {
                        tooltipCreate(node);
                        console.log('New element with attribute: registered');
                    }
                });
            }
        });
    });

    tooltipObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-dlp-tooltip']
    });

    const tooltipData = new WeakMap(); // Store tooltip data associated with elements

    function tooltipCreate(element) {
        if (!flag01) return;
        // Check if there's an existing tooltip for this element and hide it
        if (tooltipData.has(element)) {
            hideTooltip(element);
        }

        let timeoutId = null;
        let currentTooltip = null; // Use a local variable here

        const showTooltipForElement = (event) => { // Pass event to showTooltipForElement
            timeoutId = setTimeout(() => {
                currentTooltip = showTooltip(element, event); // Pass event to showTooltip
                tooltipData.set(element, { tooltip: currentTooltip, timeoutId: timeoutId }); // Store data
            }, 1000);
        };

        const hideTooltipForElement = () => {
            clearTimeout(timeoutId);
            hideTooltip(element);
        };

        const positionTooltipForElement = (event) => { // Pass event to positionTooltipForElement
            if(!currentTooltip) return; // Use the local currentTooltip
            positionTooltip(currentTooltip, event); // Pass tooltip and event to positionTooltip
        };

        element.addEventListener('mouseenter', showTooltipForElement);
        element.addEventListener('mouseleave', hideTooltipForElement);
        element.addEventListener('mousemove', positionTooltipForElement);

        // Store the listeners so we can remove them later if needed (though not explicitly required by the prompt, good practice)
        tooltipData.set(element, {
            timeoutId: null,
            tooltip: null,
            listeners: {
                mouseenter: showTooltipForElement,
                mouseleave: hideTooltipForElement,
                mousemove: positionTooltipForElement
            }
        });

        console.log('Tooltip listeners attached to element');

        // Immediately show tooltip if mouse is already over and attribute is just added/changed
        if (element.matches(':hover')) {
            // Simulate mousemove event to position tooltip correctly on initial hover if attribute is added dynamically
            const mockEvent = new MouseEvent('mousemove', {
                clientX: element.getBoundingClientRect().left, // Or any reasonable default cursor position
                clientY: element.getBoundingClientRect().top
            });
            showTooltipForElement(mockEvent);
        }
    };

    function showTooltip(element, event) { // Accept event in showTooltip
        const tooltipText = element.dataset.dlpTooltip;
        let tooltip = document.createElement('div'); // Create a new tooltip each time
        tooltip.classList.add('DLP_Tooltip');
        document.body.appendChild(tooltip);

        tooltip.textContent = tooltipText;
        tooltip.offsetHeight; // Trigger reflow for transition
        tooltip.classList.add('DLP_Tooltip_Visible');

        positionTooltip(tooltip, event); // Pass tooltip and event to positionTooltip
        console.log('created tooltip');
        return tooltip; // Return the created tooltip
    }

    function positionTooltip(tooltip, event){ // Accept tooltip and event in positionTooltip
        if (!tooltip || !event) return; // Exit if tooltip or event is null

        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const cursorX = event.clientX;
        const cursorY = event.clientY;

        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        const offsetX = 10; // Horizontal offset from cursor
        const offsetY = 10; // Vertical offset from cursor

        let preferredPosition = 'bottom-right'; // Default position
        let tooltipLeft, tooltipTop, tooltipBottom, tooltipRight;

        // Check bottom-right position
        tooltipLeft = cursorX + offsetX;
        tooltipTop = cursorY + offsetY;
        if (tooltipLeft + tooltipWidth <= viewportWidth && tooltipTop + tooltipHeight <= viewportHeight) {
            preferredPosition = 'bottom-right';
        } else if (cursorX - offsetX - tooltipWidth >= 0 && tooltipTop + tooltipHeight <= viewportHeight) { // Check bottom-left
            tooltipLeft = cursorX - offsetX - tooltipWidth;
            tooltipTop = cursorY + offsetY;
            preferredPosition = 'bottom-left';
        } else if (tooltipLeft + tooltipWidth <= viewportWidth && cursorY - offsetY - tooltipHeight >= 0) { // Check top-right
            tooltipLeft = cursorX + offsetX;
            tooltipTop = cursorY - offsetY - tooltipHeight;
            preferredPosition = 'top-right';
        } else if (cursorX - offsetX - tooltipWidth >= 0 && cursorY - offsetY - tooltipHeight >= 0) { // Check top-left
            tooltipLeft = cursorX - offsetX - tooltipWidth;
            tooltipTop = cursorY - offsetY - tooltipHeight;
            preferredPosition = 'top-left';
        } else { // Fallback to bottom-right if none fit (might go off-screen)
            tooltipLeft = cursorX + offsetX;
            tooltipTop = cursorY + offsetY;
            preferredPosition = 'bottom-right';
        }

        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.top = tooltipTop + 'px';
        tooltip.style.bottom = 'auto'; // Ensure bottom is not overriding top
        tooltip.style.right = 'auto'; // Ensure right is not overriding left
    }

    function hideTooltip(element) {
        if (!tooltipData.has(element)) return; // Exit if no tooltip data for this element

        const data = tooltipData.get(element);
        const tooltip = data.tooltip;
        if (tooltip) {
            tooltip.classList.remove('DLP_Tooltip_Visible');
            setTimeout(() => {
                if (tooltip && tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
                tooltipData.delete(element); // Clear tooltip data when hidden
                console.log('tooltip removed');
            }, 500);
        } else {
            tooltipData.delete(element); // Clear data even if no tooltip element (to avoid memory leak)
        }
    }




    const DLP_Get_PATH_1_ID = document.getElementById("DLP_Get_PATH_1_ID");
    const DLP_Get_PATH_2_ID = document.getElementById("DLP_Get_PATH_2_ID");
    const DLP_Get_PRACTICE_1_ID = document.getElementById("DLP_Get_PRACTICE_1_ID");
    const DLP_Get_PRACTICE_2_ID = document.getElementById("DLP_Get_PRACTICE_2_ID");
    const DLP_Get_LISTEN_1_ID = document.getElementById("DLP_Get_LISTEN_1_ID");
    const DLP_Get_LISTEN_2_ID = document.getElementById("DLP_Get_LISTEN_2_ID");
    const DLP_Get_LESSON_1_ID = document.getElementById("DLP_Get_LESSON_1_ID");
    const DLP_Get_LESSON_2_ID = document.getElementById("DLP_Get_LESSON_2_ID");

    function inputCheck2() {
        const ids = {
            "DLP_Get_PATH_1_ID": ["path"],
            "DLP_Get_PATH_2_ID": ["path"],
            "DLP_Get_PRACTICE_1_ID": ["practice"],
            "DLP_Get_PRACTICE_2_ID": ["practice"],
            "DLP_Get_LISTEN_1_ID": ["listen"],
            "DLP_Get_LISTEN_2_ID": ["listen"],
            "DLP_Get_LESSON_1_ID": ["lesson"],
            "DLP_Get_LESSON_2_ID": ["lesson"]
        };

        Object.keys(ids).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            const input = element.querySelector('#DLP_Inset_Input_1_ID');
            const button = element.querySelector('#DLP_Inset_Button_1_ID');
            if (!input || !button) return;
            function updateButtonState() {
                const isEmpty = input.value.length === 0;
                button.style.opacity = isEmpty ? '0.5' : '';
                button.style.pointerEvents = isEmpty ? 'none' : '';
            };
            const category = ids[id][0];
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "");
                if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                if (this.value.length > 6) this.value = this.value.slice(0, 6);
                updateButtonState();
                //if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                storageSession.legacy[category].amount = Number(this.value);
                saveStorageSession();
            });
            if (['DLP_Get_LESSON_1_ID', 'DLP_Get_LESSON_2_ID'].includes(id)) {
                const input3 = element.querySelector('#DLP_Inset_Input_3_ID');
                const input4 = element.querySelector('#DLP_Inset_Input_4_ID');

                input3.addEventListener("input", function () {
                    this.value = this.value.replace(/[^0-9]/g, "");
                    if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                    if (this.value.length > 2) this.value = this.value.slice(0, 2);
                    //if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                    storageSession.legacy[category].unit = Number(this.value);
                    saveStorageSession();
                });
                input3.addEventListener("blur", function () {
                    if (this.value.trim() === "") {
                        this.value = "1";
                        storageSession.legacy[category].unit = 1;
                        saveStorageSession();
                    }
                });

                input4.addEventListener("input", function () {
                    this.value = this.value.replace(/[^0-9]/g, "");
                    if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                    if (this.value.length > 2) this.value = this.value.slice(0, 2);
                    //if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                    storageSession.legacy[category].level = Number(this.value);
                    saveStorageSession();
                });
                input4.addEventListener("blur", function () {
                    if (this.value.trim() === "") {
                        this.value = "1";
                        storageSession.legacy[category].level = 1;
                        saveStorageSession();
                    }
                });
            }
            if (storageSession.legacy[category].amount !== 0) input.value = storageSession.legacy[category].amount; updateButtonState();
        });

        Object.keys(ids).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            const input = element.querySelector('#DLP_Inset_Input_1_ID');
            const button = element.querySelector('#DLP_Inset_Button_1_ID');
            if (!input || !button) return;
            function updateButtonState() {
                const isEmpty = input.value.length === 0;
                button.style.opacity = isEmpty ? '0.5' : '';
                button.style.pointerEvents = isEmpty ? 'none' : '';
            };
            const category = ids[id][0];
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "");
                if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                if (this.value.length > 6) this.value = this.value.slice(0, 6);
                updateButtonState();
                if (!storageSession.legacy[category]) storageSession.legacy[category] = [];
                storageSession.legacy[category].amount = Number(this.value);
                saveStorageSession();
            });
            if (storageSession.legacy[category].amount !== 0) input.value = storageSession.legacy[category].amount; updateButtonState();
        });

        function updatePinnedItems() {
            const pinnedIds = storageLocal.pins.legacy || [];
            for (const id in ids) {
                if (id.endsWith("1_ID")) {
                    const element = document.getElementById(id);
                    if (element) {
                        if (pinnedIds.includes(id)) {
                            element.style.display = 'flex';
                        } else {
                            element.style.display = 'none';
                        }
                    }
                }
            }
        };
        updatePinnedItems();

        Object.keys(ids).forEach(id => {
            if (id.endsWith("2_ID")) {
                const pinIcon = document.querySelector(`#${id} > .DLP_HStack_8 > .DLP_Inset_Icon_1_ID`);
                const modifiedId = id.replace("2_ID", "1_ID");

                function updatePinViews() {
                    if (storageLocal.pins.legacy.includes(modifiedId)) {
                        pinIcon.textContent = "􀎧";
                        pinIcon.style.color = "rgb(var(--DLP-blue))";
                    } else {
                        pinIcon.textContent = "􀎦";
                        pinIcon.style.color = "rgba(var(--color-eel), 0.50)";
                    }
                }
                updatePinViews();

                function updatePins(isAdding) {
                    const index = storageLocal.pins.legacy.indexOf(modifiedId);
                    if (isAdding && index === -1) {
                        if (storageLocal.pins.legacy.length > Math.floor(((window.innerHeight) / 200) - 1)) {
                            showNotification("warning", "Pin Limit Reached", "You've pinned too many functions. Please unpin one to continue.", 15);
                        } else {
                            storageLocal.pins.legacy.push(modifiedId);
                        }
                    } else if (!isAdding && index !== -1) {
                        storageLocal.pins.legacy.splice(index, 1);
                    } else {
                        console.log("Something unexpected happened: djr9234.");
                    }
                    updatePinViews();
                    saveStorageLocal();
                    updatePinnedItems();
                }

                pinIcon.addEventListener('click', () => {
                    updatePins(!storageLocal.pins.legacy.includes(modifiedId));
                });
            }
        });
    }

    inputCheck2();

    function setupButton1Events(baseId, page, type) {
        const button1 = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_1_ID');
        const input1 = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Input_1_ID');

        function clickHandler() {
            if (isGetButtonsBusy) return;
            isGetButtonsBusy = true;

            const buttonElement = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_1_ID');

            if (!storageSession.legacy.status && storageSession.legacy[type].amount > 0) {
                setButtonState(buttonElement, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
                storageSession.legacy.page = page;
                storageSession.legacy.status = type;
                saveStorageSession();
            } else if (storageSession.legacy.status === type) {
                setButtonState(buttonElement, {button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][18], icon: '􀰫'}, {text: '', icon: ''});
                storageSession.legacy.status = false;
                saveStorageSession();
            }
            setTimeout(() => {
                isGetButtonsBusy = false;
            }, 800);
        };

        button1.addEventListener('click', clickHandler);

        input1.onkeyup = function (event) {
            if (event.keyCode === 13) {
                if (isGetButtonsBusy) return;
                isGetButtonsBusy = true;

                const buttonElement = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_1_ID');

                if (!storageSession.legacy.status && storageSession.legacy[type].amount > 0) {
                    setButtonState(buttonElement, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
                    storageSession.legacy.page = page;
                    storageSession.legacy.status = type;
                    saveStorageSession();
                }
                setTimeout(() => {
                    isGetButtonsBusy = false;
                }, 800);
            }
        };
    }

    function setupButton2Events(baseId, type) {
        const button2 = document.querySelector(`#${baseId}_ID`).querySelector('#DLP_Inset_Button_2_ID');

        function clickHandler() {
            const icon = button2.querySelector('.DLP_Inset_Icon_1_ID');
            const input = button2.parentElement.querySelector('#DLP_Inset_Input_1_ID');

            function animateElement(element, visibility, duration = 400) {
                if (visibility) {
                    element.style.display = 'block';
                    element.style.filter = 'blur(4px)';
                    element.style.opacity = '0';
                    element.style.transition = '0.4s';

                    requestAnimationFrame(() => {
                        element.style.filter = 'blur(0px)';
                        element.style.opacity = '1';
                    });

                    setTimeout(() => {
                        element.style.filter = '';
                        element.style.opacity = '';

                        element.style.transition = '';
                    }, duration);
                } else {
                    element.style.display = 'block';
                    element.style.filter = 'blur(0px)';
                    element.style.opacity = '1';
                    element.style.transition = '0.4s';

                    requestAnimationFrame(() => {
                        element.style.filter = 'blur(4px)';
                        element.style.opacity = '0';
                    });

                    setTimeout(() => {
                        element.style.display = 'none';
                        element.style.filter = '';
                        element.style.opacity = '';
                        element.style.transition = '';
                    }, duration);
                }
            }

            if (storageSession.legacy[type].type === 'lesson') {
                let inputTo;
                button2.setAttribute("data-dlp-tooltip", "Lesson Mode");

                if (input.style.display === 'none') inputTo = 'show';

                animateElement(icon, false);
                setTimeout(() => {
                    icon.textContent = '􀆃';
                    animateElement(icon, true);
                }, 400);
                if (inputTo === 'show') setTimeout(() => animateElement(input, true), 400);
            } else if (storageSession.legacy[type].type === 'xp') {
                let inputTo;
                button2.setAttribute("data-dlp-tooltip", "XP Mode");

                if (input.style.display === 'none') inputTo = 'show';

                animateElement(icon, false);
                setTimeout(() => {
                    icon.textContent = 'XP';
                    animateElement(icon, true);
                }, 400);
                if (inputTo === 'show') setTimeout(() => animateElement(input, true), 400);

            } else if (storageSession.legacy[type].type === 'infinity') {
                let inputTo;
                button2.setAttribute("data-dlp-tooltip", "Infinity Mode");

                if (input.style.display !== 'none') inputTo = 'hide';

                animateElement(icon, false);
                setTimeout(() => {
                    icon.textContent = '􀯠';
                    animateElement(icon, true);
                }, 400);
                if (inputTo === 'hide') animateElement(input, false);

            }
        };
        clickHandler();

        button2.addEventListener('click', () => {
            if (isGetButtonsBusy) return;
            isGetButtonsBusy = true;
            if (storageSession.legacy[type].type === 'lesson') {
                storageSession.legacy[type].type = 'xp';
                saveStorageSession();
            } else if (storageSession.legacy[type].type === 'xp') {
                storageSession.legacy[type].type = 'infinity';
                saveStorageSession();
            } else if (storageSession.legacy[type].type === 'infinity') {
                storageSession.legacy[type].type = 'lesson';
                saveStorageSession();
            }
            clickHandler();
            setTimeout(() => {
                isGetButtonsBusy = false;
            }, 800);
        });
    }

    for (const type of ['PATH', 'PRACTICE', 'LISTEN', 'LESSON']) {
        for (let i = 1; i <= 2; i++) {
            const baseId = `DLP_Get_${type}_${i}`;
            setupButton1Events(baseId, i, type.toLowerCase());
            setupButton2Events(baseId, type.toLowerCase());
        }
    }

    if (storageSession.legacy.status === 'path' && storageSession.legacy.path.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_PATH_1_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_PATH_2_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        }
    } else if (storageSession.legacy.status === 'practice' && storageSession.legacy.practice.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_PRACTICE_1_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_PRACTICE_2_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        }
    } else if (storageSession.legacy.status === 'listen' && storageSession.legacy.listen.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_LISTEN_1_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_LISTEN_2_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        }
    } else if (storageSession.legacy.status === 'lesson' && storageSession.legacy.lesson.amount > 0) {
        if (storageSession.legacy.page === 1) {
            setButtonState(DLP_Get_LESSON_1_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        } else if (storageSession.legacy.page === 2) {
            setButtonState(DLP_Get_LESSON_2_ID.querySelector('#DLP_Inset_Button_1_ID'), {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][107], icon: '􀊆'}, {text: '', icon: ''});
        }
    }

    let pageSwitching = false;
    function process1() {
        if (window.location.href.includes('/lesson') || window.location.href.includes('/practice') || window.location.href.includes('/practice-hub/listening-practice')) return;
        if (storageSession.legacy.status && storageSession.legacy[storageSession.legacy.status].amount > 0) {
            if (pageSwitching) return;
            pageSwitching = true;
            setTimeout(() => {
                checkChest();
            }, 2000);
        } else {
            pageSwitching = false;
        }
    }
    setInterval(process1, 500);
    function process2() {
        if (storageSession.legacy.status && storageSession.legacy[storageSession.legacy.status].amount > 0) {
            if (storageSession.legacy.status === 'path') {
                window.location.href = "https://duolingo.com/lesson";
            } else if (storageSession.legacy.status === 'practice') {
                window.location.href = "https://duolingo.com/practice";
            } else if (storageSession.legacy.status === 'listen') {
                window.location.href = "https://duolingo.com/practice-hub/listening-practice";
            } else if (storageSession.legacy.status === 'lesson') {
                //storageSession.legacy[storageSession.legacy.status].section
                window.location.href = `https://duolingo.com/lesson/unit/${storageSession.legacy[storageSession.legacy.status].unit}/level/${storageSession.legacy[storageSession.legacy.status].level}`;
            }
        } else {
            pageSwitching = false;
        }
    }
    let checkChestCount = 0;
    function checkChest() {
        try {
            if (document.readyState === 'complete') {
                const imageUrl = 'https://d35aaqx5ub95lt.cloudfront.net/images/path/09f977a3e299d1418fde0fd053de0beb.svg';
                const images = document.querySelectorAll('.TI9Is');
                if (!images.length) {
                    setTimeout(function () {
                        process2();
                    }, 2000);
                } else {
                    let imagesProcessed = 0;
                    let chestFound = false;
                    images.forEach(image => {
                        if (image.src === imageUrl) {
                            image.click();
                            chestFound = true;
                            setTimeout(function () {
                                process2();
                            }, 2000);
                        }
                        imagesProcessed++;
                        if (imagesProcessed >= images.length && !chestFound) {
                            process2();
                        }
                    });
                }
            } else {
                setTimeout(function () {
                    checkChestCount++;
                    checkChest();
                }, 100);
            }
        } catch (error) {
            setTimeout(function () {
                process2();
            }, 2000);
        }
    };

    if (storageSession.legacy.page === 1) {
        document.querySelector(`#DLP_Main_Box_Divider_${currentPage}_ID`).style.display = 'none';
        document.querySelector(`#DLP_Main_Box_Divider_3_ID`).style.display = 'block';
        currentPage = 3;
        let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
        setButtonState(button, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][105], icon: '􀂑'}, {text: '', icon: ''});
    } else if (storageSession.legacy.page === 2) {
        document.querySelector(`#DLP_Main_Box_Divider_${currentPage}_ID`).style.display = 'none';
        document.querySelector(`#DLP_Main_Box_Divider_4_ID`).style.display = 'block';
        lastPage = 3;
        currentPage = 4;
        let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
        setButtonState(button, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][105], icon: '􀂑'}, {text: '', icon: ''});
    }







    const DLP_Get_XP_1_ID = document.getElementById("DLP_Get_XP_1_ID");
    const DLP_Get_XP_2_ID = document.getElementById("DLP_Get_XP_2_ID");
    const DLP_Get_GEMS_1_ID = document.getElementById("DLP_Get_GEMS_1_ID");
    const DLP_Get_GEMS_2_ID = document.getElementById("DLP_Get_GEMS_2_ID");
    const DLP_Get_SUPER_1_ID = document.getElementById("DLP_Get_SUPER_1_ID");
    const DLP_Get_SUPER_2_ID = document.getElementById("DLP_Get_SUPER_2_ID");
    const DLP_Get_DOUBLE_XP_BOOST_1_ID = document.getElementById("DLP_Get_DOUBLE_XP_BOOST_1_ID");
    const DLP_Get_DOUBLE_XP_BOOST_2_ID = document.getElementById("DLP_Get_DOUBLE_XP_BOOST_2_ID");
    const DLP_Get_Streak_Freeze_1_ID = document.getElementById("DLP_Get_Streak_Freeze_1_ID");
    const DLP_Get_Streak_Freeze_2_ID = document.getElementById("DLP_Get_Streak_Freeze_2_ID");
    const DLP_Get_Heart_Refill_1_ID = document.getElementById("DLP_Get_Heart_Refill_1_ID");
    const DLP_Get_Heart_Refill_2_ID = document.getElementById("DLP_Get_Heart_Refill_2_ID");
    const DLP_Get_Streak_1_ID = document.getElementById("DLP_Get_Streak_1_ID");
    const DLP_Get_Streak_2_ID = document.getElementById("DLP_Get_Streak_2_ID");

    if (storageLocal.pins.home.includes("DLP_Get_XP_1_ID")) {
        document.querySelector("#DLP_Get_Heart_Refill_2_ID > .DLP_HStack_8 > #DLP_Inset_Icon_1_ID");
    }

    function inputCheck1() {
        const ids = {
            "DLP_Get_XP_1_ID": ["xp"],
            "DLP_Get_XP_2_ID": ["xp"],
            "DLP_Get_GEMS_1_ID": ["gems"],
            "DLP_Get_GEMS_2_ID": ["gems"],
            "DLP_Get_SUPER_1_ID": ["super"],
            "DLP_Get_SUPER_2_ID": ["super"],
            "DLP_Get_DOUBLE_XP_BOOST_1_ID": ["double_xp_boost"],
            "DLP_Get_DOUBLE_XP_BOOST_2_ID": ["double_xp_boost"],
            "DLP_Get_Streak_Freeze_1_ID": ["streak_freeze"],
            "DLP_Get_Streak_Freeze_2_ID": ["streak_freeze"],
            "DLP_Get_Heart_Refill_1_ID": ["heart_refill"],
            "DLP_Get_Heart_Refill_2_ID": ["heart_refill"],
            "DLP_Get_Streak_1_ID": ["streak"],
            "DLP_Get_Streak_2_ID": ["streak"]
        };

        Object.keys(ids).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            const input = element.querySelector('#DLP_Inset_Input_1_ID');
            const button = element.querySelector('#DLP_Inset_Button_1_ID');
            if (!input || !button) return;
            function updateButtonState() {
                const isEmpty = input.value.length === 0;
                button.style.opacity = isEmpty ? '0.5' : '';
                button.style.pointerEvents = isEmpty ? 'none' : '';
            };
            const category = ids[id][0];
            input.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "");
                if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                if (this.value.length > 9) this.value = this.value.slice(0, 9);
                updateButtonState();
            });
            if (!input.value) updateButtonState();
        });

        function updatePinnedItems() {
            const pinnedIds = storageLocal.pins.home || [];
            for (const id in ids) {
                if (id.endsWith("1_ID")) {
                    const element = document.getElementById(id);
                    if (element) {
                        if (pinnedIds.includes(id)) {
                            element.style.display = 'flex';
                        } else {
                            element.style.display = 'none';
                        }
                    }
                }
            }
        };
        updatePinnedItems();

        Object.keys(ids).forEach(id => {
            if (id.endsWith("2_ID")) {
                const pinIcon = document.querySelector(`#${id} > .DLP_HStack_8 > .DLP_Inset_Icon_1_ID`);
                const modifiedId = id.replace("2_ID", "1_ID");

                function updatePinViews() {
                    if (storageLocal.pins.home.includes(modifiedId)) {
                        pinIcon.textContent = "􀎧";
                        pinIcon.style.color = "rgb(var(--DLP-blue))";
                    } else {
                        pinIcon.textContent = "􀎦";
                        pinIcon.style.color = "rgba(var(--color-eel), 0.50)";
                    }
                }
                updatePinViews();

                function updatePins(isAdding) {
                    const index = storageLocal.pins.home.indexOf(modifiedId);
                    if (isAdding && index === -1) {
                        if (storageLocal.pins.home.length > Math.floor(((window.innerHeight) / 200) - 1)) {
                            showNotification("warning", "Pin Limit Reached", "You've pinned too many functions. Please unpin one to continue.", 15);
                        } else {
                            storageLocal.pins.home.push(modifiedId);
                        }
                    } else if (!isAdding && index !== -1) {
                        storageLocal.pins.home.splice(index, 1);
                    } else {
                        console.log("Something unexpected happened: djr9234.");
                    }
                    updatePinViews();
                    saveStorageLocal();
                    updatePinnedItems();
                }

                pinIcon.addEventListener('click', () => {
                    updatePins(!storageLocal.pins.home.includes(modifiedId));
                });
            }
        });
    }
    inputCheck1();


    function initializeMagneticHover(element) {
        let mouseDown = false;
        let originalZIndex = null;
        element.addEventListener('pointermove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if (mouseDown) {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(0.9)`;
            } else {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
            }
            if (!originalZIndex) {
                if (element.style.zIndex) originalZIndex = parseInt(element.style.zIndex);
                else originalZIndex = 0;
            }
            element.style.zIndex = originalZIndex + 1;
        });
        element.addEventListener('pointerleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
            element.style.zIndex = originalZIndex;
            mouseDown = false;
        });
        element.addEventListener('pointerdown', (e) => {
            mouseDown = true;
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            if (mouseDown) {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(0.9)`;
            } else {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
            }
        });
        element.addEventListener('pointerup', (e) => {
            mouseDown = false;
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const isPointerWithinElement = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            if (isPointerWithinElement) {
                playHaptic();
            }

            if (mouseDown) {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(0.9)`;
            } else {
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.1)`;
            }
        });
    }
    document.querySelectorAll('.DLP_Magnetic_Hover_1').forEach(element => {
        initializeMagneticHover(element);
    });

    function initializeDefaultHover(element) {
        element.addEventListener('pointerup', (e) => {
            const rect = element.getBoundingClientRect();
            const isPointerWithinElement = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            if (isPointerWithinElement) {
                playHaptic();
            }
        });
    }
    document.querySelectorAll('.DLP_Hover_1').forEach(element => {
        initializeDefaultHover(element);
    });


    let DLP_Server_Connection_Button = document.getElementById("DLP_Main_1_Server_Connection_Button_1_ID");
    let DLP_Server_Connection_Button_2 = document.getElementById("DLP_Secondary_1_Server_Connection_Button_1_ID");
    function updateConnetionButtonStyles(button, color, content, animation) {
        let iconToChange = button.querySelector(".DLP_Inset_Icon_1_ID");
        let textToChange = button.querySelector(".DLP_Inset_Text_1_ID");
        textToChange.style.animation = '';
        iconToChange.style.animation = '';
        void button.offsetWidth;
        requestAnimationFrame(() => {
            textToChange.style.filter = 'blur(4px)';
            textToChange.style.opacity = '0';
            iconToChange.style.filter = 'blur(4px)';
            iconToChange.style.opacity = '0';
            button.style.background = color.button;
            button.style.outline = `2px solid ${color.outline}`;
        });
        setTimeout(() => {
            textToChange.style.animation = 'none';
            iconToChange.style.animation = 'none';
            requestAnimationFrame(() => {
                textToChange.style.transition = '0s';
                iconToChange.style.transition = '0s';
                textToChange.textContent = content.text;
                iconToChange.textContent = content.icon;
                textToChange.style.color = color.text;
                iconToChange.style.color = color.icon;
                void button.offsetWidth;
                textToChange.style.transition = '0.4s';
                iconToChange.style.transition = '0.4s';
                void button.offsetWidth;
                textToChange.style.filter = 'blur(0px)';
                iconToChange.style.filter = 'blur(0px)';
                textToChange.style.opacity = '1';
                iconToChange.style.opacity = '1';
                setTimeout(() => {
                    textToChange.style.animation = animation.text;
                    iconToChange.style.animation = animation.icon;
                }, 400);
            });
        }, 400);
    }
    let serverConnectedBefore = 'no';
    let serverConnectedBeforeNotification;
    let newTermID;
    let chatMemory = [];
    let chatTempSendList = [];
    let chatMemoryFingerprints = [];

    function normalizeMessageValue(value) {
        if (Array.isArray(value)) {
            return value.map(normalizeMessageValue);
        }
        if (value && typeof value === 'object') {
            const sortedKeys = Object.keys(value).sort();
            const normalizedObject = {};
            sortedKeys.forEach(key => {
                normalizedObject[key] = normalizeMessageValue(value[key]);
            });
            return normalizedObject;
        }
        if (value === undefined || Number.isNaN(value)) {
            return null;
        }
        return value;
    }

    function computeMessageFingerprint(message) {
        const relevantData = {
            accent: message?.accent ?? '',
            author: message?.author ?? '',
            deleted: message?.deleted ?? false,
            edited: message?.edited ?? false,
            files: Array.isArray(message?.files) ? message.files.slice() : [],
            message: message?.message ?? '',
            profile_picture: message?.profile_picture ?? '',
            role: message?.role ?? '',
            send_time: message?.send_time ?? null,
            status: message?.status ?? ''
        };

        try {
            return JSON.stringify(normalizeMessageValue(relevantData));
        } catch (error) {
            console.error('Failed to compute message fingerprint', error);
            return JSON.stringify({ send_time: message?.send_time ?? null });
        }
    }

    function areArraysEqual(arrayA = [], arrayB = []) {
        if (arrayA.length !== arrayB.length) return false;
        for (let i = 0; i < arrayA.length; i++) {
            if (arrayA[i] !== arrayB[i]) return false;
        }
        return true;
    }
    let newReplyButtonActive = false;
    let userBioData = false;
    let kqjzvmbt = false;
    let intelligentXPAmount = 20000;
    function connectToServer() {
        let mainInputsDiv1 = document.getElementById('DLP_Main_Inputs_1_Divider_1_ID');

        let chatTempSendListSnapshot = chatTempSendList;
        const chatKeyValue = storageLocal?.chatKey?.[0] ?? false;

        //fetch(apiURL + '/server', {
        fetch('https://api.duolingopro.net/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: versionFormal,
                key: storageLocal.random16,
                ...(chatKeyValue && { chat_key: chatKeyValue })
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.global || data.versions) {
                    console.log(data.chats);

                    if (!userBioData && !fetchingUserBioData) {
                        fetchUserBioData();
                    }

                    if (chatKeyValue) {
                        if (!data.chats) {
                            if (kqjzvmbt) {
                                storageLocal.chatKey.shift();
                                saveStorageLocal();
                            }
                            kqjzvmbt = true;
                        } else {
                            buildChat(data);
                        }
                    }

                    function buildChat(data) {
                        const chatParent = document.querySelector('#DLP_Main_Box_Divider_11_ID').lastElementChild;
                        const chatBox = chatParent?.querySelector('.DLP_Chat_Box_1_ID_1');
                        if (!chatBox) return;

                        if (typeof data === 'undefined' || typeof data.chats === 'undefined' || !Array.isArray(data.chats.messages)) return;

                        if (data.chats.solved) {
                            chatParent.querySelector('#DLP_Inset_Group_1').style.display = 'none';
                            chatParent.querySelector('#DLP_Inset_Group_2').style.display = '';
                        }

                        const incomingMessages = data.chats.messages.filter(msg => !msg?.deleted && msg?.status !== 'deleted');
                        const nextFingerprints = incomingMessages.map(computeMessageFingerprint);
                        const hasChanges = nextFingerprints.length !== chatMemoryFingerprints.length || nextFingerprints.some((fingerprint, index) => fingerprint !== chatMemoryFingerprints[index]);

                        if (hasChanges) {
                            const previousLength = chatMemory.length;
                            const wasAtBottom = Math.abs(chatBox.scrollHeight - (chatBox.scrollTop + chatBox.clientHeight)) < 5;
                            const scrollOffsetFromBottom = chatBox.scrollHeight - chatBox.scrollTop;

                            chatBox.innerHTML = '';
                            incomingMessages.forEach(message => {
                                createMessage(message);
                            });

                            const hasNewMessages = incomingMessages.length > previousLength;
                            if (hasNewMessages || wasAtBottom) {
                                chatBox.scrollTop = chatBox.scrollHeight;
                            } else {
                                const newScrollTop = chatBox.scrollHeight - scrollOffsetFromBottom;
                                chatBox.scrollTop = newScrollTop < 0 ? 0 : newScrollTop;
                            }
                        }

                        chatMemory = incomingMessages.map(message => ({ ...message }));
                        chatMemoryFingerprints = nextFingerprints;

                        const knownSendTimes = storageLocal.chats ?? [];
                        if (currentPage === 11) {
                            const newSendTimes = chatMemory.map(msg => msg.send_time);
                            if (!areArraysEqual(knownSendTimes, newSendTimes)) {
                                storageLocal.chats = newSendTimes;
                                saveStorageLocal();
                            }
                        } else {
                            incomingMessages.forEach(msg => {
                                if (!knownSendTimes.includes(msg.send_time) && !newReplyButtonActive) {
                                    newReplyButtonActive = true;
                                    updateConnetionButtonStyles(document.getElementById("DLP_Main_Feedback_1_Button_1_ID"), {button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: 'New Reply', icon: '􀝗'}, {text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite'});
                                    showNotification({icon: "􂄺", color: "rgb(var(--DLP-blue))"}, "Support Team Response", "You have a new message from our support team.", 30);
                                }
                            });
                        }

                        for (let i = 0; i < chatTempSendListSnapshot.length; i++) {
                            updateMessageOnServer(false, chatTempSendListSnapshot[i]);
                            chatTempSendList.splice(chatTempSendList.indexOf(chatTempSendListSnapshot[i]), 1);
                        }
                    }


                    const globalData = data.global;
                    const versionData = data.versions[versionFull];
                    const warnings = versionData.warnings || [];

                    const termsText = Object.entries(globalData.terms)[0][1];
                    newTermID = Object.entries(globalData.terms)[0][0];

                    //console.log('Global Warning:', globalData.warning);
                    //console.log('Notifications:', globalData.notifications);

                    document.querySelector(`#DLP_Terms_Main_Text_1_ID`).innerHTML = termsText;

                    if (versionData.status === 'latest') {
                        if (storageLocal.terms === newTermID) {
                            if (serverConnectedBefore !== 'yes') {
                                updateReleaseNotes(warnings);
                                mainInputsDiv1.style.opacity = '1';
                                mainInputsDiv1.style.pointerEvents = 'auto';
                                updateConnetionButtonStyles(DLP_Server_Connection_Button, {button: 'rgb(var(--DLP-green))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][108], icon: '􀤆'}, {text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite'});
                                updateConnetionButtonStyles(DLP_Server_Connection_Button_2, {button: 'rgb(var(--DLP-green))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][108], icon: '􀤆'}, {text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite'});
                                if (serverConnectedBefore === 'error' || serverConnectedBeforeNotification) {
                                    serverConnectedBeforeNotification.close();
                                    serverConnectedBeforeNotification = false;
                                }
                                serverConnectedBefore = 'yes';
                            }
                        } else {
                            if (storageLocal.onboarding) {
                                if (currentPage !== 5 && currentPage !== 6) goToPage(5);
                            } else {
                                if (currentPage !== 10) goToPage(10);
                            }
                        }
                    } else if (serverConnectedBefore !== 'outdated') {
                        updateConnetionButtonStyles(DLP_Server_Connection_Button, {button: 'rgb(var(--DLP-orange))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: 'Outdated', icon: '􀁟'}, {text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite'});
                        updateConnetionButtonStyles(DLP_Server_Connection_Button_2, {button: 'rgb(var(--DLP-orange))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: 'Outdated', icon: '􀁟'}, {text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite'});
                        if (serverConnectedBefore === 'no') {
                            mainInputsDiv1.style.opacity = '0.5';
                            mainInputsDiv1.style.pointerEvents = 'none';
                            showNotification("warning", systemText[systemLanguage][233], systemText[systemLanguage][234], 0);
                        } else if (serverConnectedBefore === 'error' || serverConnectedBeforeNotification) {
                            serverConnectedBeforeNotification.close();
                            serverConnectedBeforeNotification = false;
                        }
                        serverConnectedBefore = 'outdated';
                    }

                    //if (storageLocal.languagePackVersion !== versionData.languagePackVersion) {
                    //    fetch(serverURL + "/static/3.0/resources/language_pack.json")
                    //        .then(response => response.json())
                    //        .then(data => {
                    //            if (data[versionFull]) {
                    //                storageLocal.languagePack = data[versionFull];
                    //                console.log(data[versionFull]);
                    //                storageLocal.languagePackVersion = versionData.languagePackVersion;
                    //                saveStorageLocal();
                    //            }
                    //        })
                    //        .catch(error => console.error('Error fetching systemText:', error));
                    //}
                } else {
                    console.error(`Version ${versionNumber} not found in the data`);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (serverConnectedBefore !== 'error') {
                    mainInputsDiv1.style.opacity = '0.5';
                    mainInputsDiv1.style.pointerEvents = 'none';
                    updateConnetionButtonStyles(DLP_Server_Connection_Button, {button: 'rgb(var(--DLP-pink))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][109], icon: '􀇿'}, {text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite'});
                    updateConnetionButtonStyles(DLP_Server_Connection_Button_2, {button: 'rgb(var(--DLP-pink))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][109], icon: '􀇿'}, {text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite'});
                    serverConnectedBeforeNotification = showNotification("error", systemText[systemLanguage][231], systemText[systemLanguage][232], 0);
                    serverConnectedBefore = 'error';
                }
            });
    }
    connectToServer();
    setTimeout(() => {
        connectToServer();
    }, 1000);
    setInterval(() => {
        //if (windowBlurState) connectToServer();
        if (document.visibilityState === "visible" || isAutoMode) connectToServer();
    }, 4000);

    let fetchingUserBioData = false;
    async function fetchUserBioData() {
        fetchingUserBioData = true;
        console.log('FETHCING FOR YOU YOUR HONOR');
        const userResponse = await fetch('https://www.duolingo.com/2017-06-30/users/' + JSON.parse(atob(document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1].split('.')[1])).sub + '?fields=name,username,picture');
        if (!userResponse.ok) {
            fetchingUserBioData = false;
            return;
        }
        const userData = await userResponse.json();
        console.log(userData);
        userBioData = {
            username: (userData.name && userData.name.trim().length > 0) ? userData.name : userData.username,
            profile_picture: "https:" + userData.picture + "/xlarge"
        };
        fetchingUserBioData = false;
    }

    function createMessage(message, isBefore=false, isTemp=false) {
        function formatTimeAgo(timestamp) {
            // If the timestamp is in seconds (10 digits), convert to ms
            if (timestamp < 1e12) {
                timestamp = timestamp * 1000;
            }
            const now = Date.now();
            const diff = now - timestamp; // Difference in milliseconds

            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);

            if (seconds < 60) {
                return "now";
            } else if (minutes < 60) {
                return `${minutes}m ago`;
            } else if (hours < 24) {
                return `${hours}h ago`;
            } else if (days < 7) {
                return `${days}d ago`;
            } else if (weeks < 4) {
                return `${weeks}w ago`;
            } else if (months < 12) {
                return `${months}m ago`;
            } else {
                return `${years}y ago`;
            }
        }
        function toMilliseconds(ts) {
            return ts < 1e12 ? ts * 1000 : ts;
        }
        function updateTimeAgo(element, timestamp) {
            function update() {
                if (!document.contains(element)) {
                    clearInterval(intervalId);
                    return;
                }
                const newText = formatTimeAgo(timestamp);
                if (element.textContent !== newText) {
                    element.textContent = newText;
                }
            }

            update();
            const intervalId = setInterval(update, 1000);
        }

        const chatBox = document.querySelector('#DLP_Main_Box_Divider_11_ID')?.querySelector('.DLP_Chat_Box_1_ID_1');

        let lastChatChild = chatBox.lastElementChild;
        if (isBefore) lastChatChild = isBefore.previousElementSibling;

        function createStartersMessage(message) {
            const temp = document.createElement('div');
            temp.innerHTML = `
                <div class="DLP_VStack_4" data-group-timestamp="${message.send_time}" data-author-name="${message.author}">
                    <div data-chat-header="true" style="display: flex; justify-content: space-between; align-items: center; align-self: stretch;">
                        <div class="DLP_HStack_6">
                            <div style="width: 20px; height: 20px; border-radius: 16px; outline: rgba(0, 0, 0, 0.2) solid 2px; outline-offset: -2px; background: url(${message.profile_picture}) 50% center / cover no-repeat white;"></div>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: ${message.accent}; opacity: 0.5;">${message.author}</p>
                        </div>
                        <div class="DLP_HStack_6">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: ${message.accent}; opacity: 0.5;">${message.role}</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: ${message.accent}; opacity: 0.5; font-size: 4px;">􀀁</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" data-time-element="true" style="color: ${message.accent}; opacity: 0.5;">${formatTimeAgo(message.send_time)}</p>
                        </div>
                    </div>
                </div>
            `;
            const newElement = temp.firstElementChild;
            chatBox.appendChild(newElement);
            lastChatChild = newElement;

            updateTimeAgo(document.querySelector(`[data-group-timestamp="${message.send_time}"] [data-time-element="true"]`), message.send_time);

            createContinuationMessage(message);
        }

        function createContinuationMessage(message) {
            const firstMessageTimestamp = parseInt(lastChatChild.getAttribute('data-group-timestamp'));
            if (toMilliseconds(message.send_time) - toMilliseconds(firstMessageTimestamp) > 900000) { // 15 minutes, 900,000 milliseconds
                createStartersMessage(message);
                return;
            }
            if (message.message !== "") {
                const temp = document.createElement('div');
                temp.innerHTML = `
                    <p class="DLP_Text_Style_1" data-message-timestamp="${message.send_time}"${isTemp ? ` data-is-temp="${isTemp}"` : ''} style="align-self: stretch; opacity: 0.5; white-space: pre-line; overflow-wrap: anywhere; word-break: break-word;${isTemp ? ' animation: DLP_Pulse_Opacity_Animation_2 2s ease-in-out infinite;' : ''}">${message.message}</p>
                `;
                const newElement = temp.firstElementChild;
                lastChatChild.appendChild(newElement);
            }
            createAttachmentMessage(message);
        }

        function expandAttachment(lastAttachment) {
            let expanded = false;

            function getElementPosition(element) {
                if (!element || !(element instanceof Element)) {
                    return false;
                }
                const rect = element.getBoundingClientRect();
                return {
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                };
            }

            async function getElementDimensions(element) {
                return new Promise((resolve, reject) => {
                    if (!(element instanceof HTMLImageElement) && !(element instanceof HTMLVideoElement)) {
                    return reject(new Error('Element must be an image or video'));
                    }

                    if (element instanceof HTMLImageElement) {
                    if (element.complete) {
                        return resolve({ width: element.naturalWidth, height: element.naturalHeight });
                    }
                    element.addEventListener('load', () => {
                        resolve({ width: element.naturalWidth, height: element.naturalHeight });
                    }, { once: true });
                    element.addEventListener('error', () => {
                        reject(new Error('Failed to load image'));
                    }, { once: true });
                    } else if (element instanceof HTMLVideoElement) {
                    if (element.readyState >= 1) {
                        return resolve({ width: element.videoWidth, height: element.videoHeight });
                    }
                    element.addEventListener('loadedmetadata', () => {
                        resolve({ width: element.videoWidth, height: element.videoHeight });
                    }, { once: true });
                    element.addEventListener('error', () => {
                        reject(new Error('Failed to load video'));
                    }, { once: true });
                    }
                });
            }

            function getMaxDimensions(element) {
                const computedStyle = window.getComputedStyle(element);
                const maxWidth = computedStyle.maxWidth;
                const maxHeight = computedStyle.maxHeight;

                const result = { width: null, height: null };

                function parseCalcOrPixel(value, dimension) {
                    // If value is in pixels, return it
                    if (value.endsWith('px')) {
                    return parseFloat(value);
                    }

                    // Handle calc(100% - Npx)
                    if (value.includes('calc')) {
                    const match = value.match(/calc\(100% - (\d+\.?\d*?)px\)/);
                    if (match) {
                        const subtractedPx = parseFloat(match[1]);
                        const parent = element.parentElement;
                        if (dimension === 'width') {
                        return parent ? parent.getBoundingClientRect().width - subtractedPx : window.innerWidth - subtractedPx;
                        } else if (dimension === 'height') {
                        return parent ? parent.getBoundingClientRect().height - subtractedPx : window.innerHeight - subtractedPx;
                        }
                    }
                    }

                    return false; // Fallback
                }

                // Calculate max-width and max-height in pixels
                result.width = parseCalcOrPixel(maxWidth, 'width');
                result.height = parseCalcOrPixel(maxHeight, 'height');

                return result;
            }

            async function fitToWindow() {
                const max = getMaxDimensions(lastAttachment);
                const lastAttachmentContent = lastAttachment.querySelector('.DLP_Attachment_Box_1_Content');
                const orig = await getElementDimensions(lastAttachmentContent);
                const scale = Math.min(max.width / orig.width, max.height / orig.height);

                const w = Math.floor(orig.width * scale);
                const h = Math.floor(orig.height * scale);
                lastAttachment.style.width = `${w}px`;
                lastAttachment.style.height = `${h}px`;
            }

            lastAttachment.addEventListener('mouseenter', () => {
                if (expanded) return;
                lastAttachment.querySelector('.DLP_Attachment_Box_1_Hover').style.display = '';
            });
            lastAttachment.addEventListener('mouseleave', () => {
                if (expanded) return;
                lastAttachment.querySelector('.DLP_Attachment_Box_1_Hover').style.display = 'none';
            });
            lastAttachment.querySelector('.DLP_Attachment_Box_1_Hover p').addEventListener('click', async () => {
                expanded = true;
                lastAttachment.querySelector('.DLP_Attachment_Box_1_Hover').style.display = 'none';

                let pos = getElementPosition(lastAttachment);
                const tempHover = document.createElement('div');
                tempHover.style.width = pos.width + 'px';
                tempHover.style.height = pos.height + 'px';
                tempHover.style.opacity = '0';

                // append tempHover right before lastAttachment
                lastAttachment.parentNode.insertBefore(tempHover, lastAttachment);

                const largeViewMotherBox = document.createElement('div');
                largeViewMotherBox.className = 'DLP_Attachment_Box_Large_View_1';
                document.body.appendChild(largeViewMotherBox);

                let closeBtn = `
                    <div style="display: flex; padding: 2px; justify-content: center; align-items: center; gap: 6px; opacity: 0.5; position: absolute; bottom: 24px; pointer-events: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect">􀆄</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect">Close</p>
                    </div>
                `;
                largeViewMotherBox.insertAdjacentHTML('beforeend', closeBtn);

                function getTransformToMatchPosition(element) {
                    const parentRect = largeViewMotherBox.getBoundingClientRect();
                    const centerX = parentRect.width / 2;
                    const centerY = parentRect.height / 2;
                    const elementRect = element.getBoundingClientRect();
                    const elementCenterX = elementRect.width / 2;
                    const elementCenterY = elementRect.height / 2;
                    const shiftX = pos.left + elementCenterX - centerX;
                    const shiftY = pos.top + elementCenterY - centerY;
                    return { translateX: shiftX, translateY: shiftY };
                }

                largeViewMotherBox.appendChild(lastAttachment);

                translate = getTransformToMatchPosition(lastAttachment);

                lastAttachment.style.transform = `translate(${translate.translateX}px, ${translate.translateY}px)`;
                void lastAttachment.offsetHeight;

                lastAttachment.style.transition = '0.4s cubic-bezier(0.16, 1, 0.32, 1)';

                void lastAttachment.offsetHeight;

                lastAttachment.style.transform = 'translate(0px, 0px)';

                largeViewMotherBox.style.background = 'rgba(var(--color-snow), 0.50)';
                largeViewMotherBox.style.backdropFilter = 'blur(16px)';

                lastAttachment.style.aspectRatio = 'unset';

                let lastAttachmentContent = lastAttachment.querySelector('.DLP_Attachment_Box_1_Content');

                lastAttachmentContent.style.aspectRatio = 'unset';
                lastAttachmentContent.style.maxWidth = '100%';
                lastAttachmentContent.style.maxHeight = '100%';
                lastAttachmentContent.style.width = 'auto';
                lastAttachmentContent.style.height = 'auto';

                lastAttachment.style.maxWidth = 'calc(100% - 32px)';
                lastAttachment.style.maxHeight = 'calc(100% - 142px)';

                lastAttachment.style.display = 'inline-flex';

                lastAttachment.style.width = 'auto';
                lastAttachment.style.height = 'auto';

                void lastAttachment.offsetHeight;

                const maxDimensions = getMaxDimensions(lastAttachment);
                const elementDimensions = await getElementDimensions(lastAttachmentContent);

                // compute uniform scale to fit within maxDimensions
                const scale = Math.min(maxDimensions.width / elementDimensions.width, maxDimensions.height / elementDimensions.height);

                // calculate final pixel dimensions
                let newWidth = Math.floor(elementDimensions.width * scale);
                let newHeight = Math.floor(elementDimensions.height * scale);

                //let newWidth = lastAttachmentContent.offsetWidth;
                //let newHeight = lastAttachmentContent.offsetHeight;

                lastAttachment.style.width = '';
                lastAttachment.style.height = '';

                void lastAttachment.offsetHeight;

                lastAttachment.style.width = newWidth + 'px';
                lastAttachment.style.height = newHeight + 'px';

                lastAttachmentContent.style.width = '100%';
                lastAttachmentContent.style.height = '100%';

                if (lastAttachmentContent.tagName.toLowerCase() === 'video') {
                    lastAttachmentContent.controls = true;
                    lastAttachmentContent.autoplay = false;
                    lastAttachmentContent.muted = false;
                    lastAttachmentContent.currentTime = 0;
                    lastAttachmentContent.play();
                }

                window.addEventListener('resize', fitToWindow);

                largeViewMotherBox.addEventListener('click', (event) => {
                    if (largeViewMotherBox === event.target && lastAttachment !== event.target) {
                        window.removeEventListener('resize', fitToWindow);

                        if (lastAttachmentContent.tagName.toLowerCase() === 'video') {
                            lastAttachmentContent.controls = false;
                            lastAttachmentContent.autoplay = true;
                            lastAttachmentContent.muted = true;
                            lastAttachmentContent.play();
                        }

                        lastAttachment.style.transform = `translate(${translate.translateX}px, ${translate.translateY}px)`;
                        lastAttachment.style.width = pos.width + 'px';
                        lastAttachment.style.height = pos.height + 'px';

                        largeViewMotherBox.style.background = 'rgba(var(--color-snow), 0.00)';
                        largeViewMotherBox.style.backdropFilter = 'blur(0px)';

                        setTimeout(() => {
                            tempHover.parentNode.insertBefore(lastAttachment, tempHover);
                            lastAttachment.style.transform = '';
                            tempHover.remove();
                            largeViewMotherBox.remove();

                            lastAttachment.style.aspectRatio = '';
                            lastAttachment.querySelector('.DLP_Attachment_Box_1_Content').style.aspectRatio = '';
                            lastAttachment.querySelector('.DLP_Attachment_Box_1_Content').style.maxWidth = '';
                            lastAttachment.querySelector('.DLP_Attachment_Box_1_Content').style.maxHeight = '';
                            lastAttachment.querySelector('.DLP_Attachment_Box_1_Content').style.width = '';
                            lastAttachment.querySelector('.DLP_Attachment_Box_1_Content').style.height = '';

                            lastAttachment.style.maxWidth = '';
                            lastAttachment.style.maxHeight = '';

                            lastAttachment.style.display = '';

                            lastAttachment.style.transition = '';
                            void lastAttachment.offsetHeight;

                            expanded = false;
                        }, 400);
                    }
                });
            });
        }

        async function createAttachmentMessage(message) {
            async function contentType(url) {
                const imageExts = ['jpg','jpeg','png','gif','webp','bmp','svg'];
                const videoExts = ['mp4','webm','ogg','mov','m4v'];

                let ft = '';
                try {
                    const u = new URL(url);
                    ft = (u.searchParams.get('filetype') || '').toLowerCase();
                } catch (e) {
                    const qs = url.split('?')[1] || '';
                    const match = qs.match(/(?:^|&)filetype=([^&]+)/i);
                    ft = match ? decodeURIComponent(match[1]).toLowerCase() : '';
                }
                if (imageExts.includes(ft)) return 'image';
                if (videoExts.includes(ft)) return 'video';

                // 3) give up
                return 'other';
            }

            if (message.files.length > 0) {
                const temp2 = document.createElement('div');
                temp2.innerHTML = `
                    <div data-message-timestamp="${message.send_time}"${isTemp ? ` data-is-temp="${isTemp}"` : ''} class="DLP_Hide_Scrollbar" style="display: flex; align-items: center; gap: 8px; align-self: stretch; width: 100%; overflow-y: scroll; opacity: 1; filter: blur(0px); margin-top: 0px; transition: 0.4s cubic-bezier(0.16, 1, 0.32, 1);"></div>
                `;
                const newElement2 = temp2.firstElementChild;
                lastChatChild.appendChild(newElement2);
                let attachmentParent = lastChatChild.lastElementChild;
                for (let i = 0; i < message.files.length; i++) {
                    const file = message.files[i];
                    const temp = document.createElement('div');
                    let extensionType = await contentType(file);
                    if (extensionType === 'image') {
                        temp.innerHTML = `
                            <div class="DLP_Attachment_Box_1" data-preview-src="${file}">
                                <img class="DLP_Attachment_Box_1_Content" src="${file}">
                                <div class="DLP_Attachment_Box_1_Hover" style="display: none;">
                                    <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">􂅆</p>
                                </div>
                            </div>
                        `;
                    } else if (extensionType === 'video') {
                        temp.innerHTML = `
                            <div class="DLP_Attachment_Box_1" data-preview-src="${file}">
                                <video class="DLP_Attachment_Box_1_Content" src="${file}" muted autoplay loop></video>
                                <div class="DLP_Attachment_Box_1_Hover" style="display: none;">
                                    <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">􂅆</p>
                                </div>
                            </div>
                        `;
                    } else {
                        temp.innerHTML = `
                            <div class="DLP_Attachment_Box_1" data-preview-src="${file}">
                                <div style="display: flex; width: 100%; height: 100%; padding-top: 6px; flex-direction: column; justify-content: center; align-items: center; gap: 6px; flex-shrink: 0;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 24px;">􀈸</p>
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="opacity: 0.5;">File</p>
                                </div>
                                <div class="DLP_Attachment_Box_1_Hover" style="display: none;">
                                    <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect">􀄉</p>
                                </div>
                            </div>
                        `;
                    }
                    const newElement = temp.firstElementChild;
                    attachmentParent.appendChild(newElement);

                    expandAttachment(newElement);
                }
            }
        }

        if (lastChatChild !== null && message.author === lastChatChild.getAttribute('data-author-name')) {
            createContinuationMessage(message);
        } else {
            createStartersMessage(message);
        }
    }

    function updateMessageOnServer(messageSendTime, isTemp=false) {
        const chatBox = document.querySelector('#DLP_Main_Box_Divider_11_ID')?.querySelector('.DLP_Chat_Box_1_ID_1');
        if (isTemp) {
            chatBox.querySelectorAll(`[data-is-temp="${isTemp}"]`).forEach(element => {
                element.remove();
            });
        }
    }

    function intelligentLeaderboardBasedWarningLimit() {
        const defaultBoardId = "7d9f5dd1-8423-491a-91f2-2532052038ce";
        const tournamentBoardId = "4b668ba6-288d-4b78-81a3-7b213175ae2c";
        const baseUrl = "https://duolingo-leaderboards-prod.duolingo.com/leaderboards/";

        function getDuolingoUserIdFromJwt(token) {
            try {
                const p = token.split('.')[1];
                const decoded = decodeURIComponent(atob(p.replace(/-/g, '+').replace(/_/g, '/').padEnd(p.length + (4 - p.length % 4) % 4, '=')).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                return JSON.parse(decoded).sub;
            } catch (e) {
                console.error("Failed to decode JWT:", e);
                return null;
            }
        }

        function processLeaderboardData(data, userId) {
            if (!data || !data.active || !data.active.cohort || !data.active.cohort.rankings) {
                console.log("Chosen leaderboard data is invalid or inactive.");
                return;
            }

            const rankings = data.active.cohort.rankings;

            const topN = 5;
            const topScores = [...rankings].sort((a, b) => b.score - a.score).slice(0, topN).map(user => user.score);

            const userRanking = rankings.find(u => u.user_id === userId);
            const userScore = userRanking ? userRanking.score : 0;

            const avgTopScore = topScores.length ? Math.round(topScores.reduce((sum, val) => sum + val, 0) / topScores.length) : 0;

            const intelligentAmount = Math.max(0, avgTopScore - userScore);
            intelligentXPAmount = intelligentAmount;

            console.log(`Using leaderboard: ${data.active.contest.contest_id}`);
            console.log(`Average top ${topN} score:`, avgTopScore);
            console.log(`Your score:`, userScore);
            console.log(`Calculated intelligent warning limit:`, intelligentAmount);
        }

        const jwtToken = document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='))?.split('=')[1];
        if (!jwtToken) {
            console.error("JWT token not found. Cannot proceed.");
            return;
        }

        const userID = getDuolingoUserIdFromJwt(jwtToken);
        if (!userID) {
            console.error("Could not extract User ID from JWT.");
            return;
        }

        const spedTimestamp = Date.now();
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        };

        const defaultBoardPromise = fetch(`${baseUrl}${defaultBoardId}/users/${userID}?_=${spedTimestamp}`, fetchOptions).then(res => res.json());
        const tournamentBoardPromise = fetch(`${baseUrl}${tournamentBoardId}/users/${userID}?_=${spedTimestamp}`, fetchOptions).then(res => res.json());

        Promise.allSettled([tournamentBoardPromise, defaultBoardPromise])
            .then(([tournamentResult, defaultResult]) => {
                let selectedData = null;
                let boardType = "";

                if (tournamentResult.status === 'fulfilled' && tournamentResult.value.active) {
                    console.log("Tournament leaderboard is active. Using it for calculation.");
                    selectedData = tournamentResult.value;
                    boardType = "Tournament";
                }
                else if (defaultResult.status === 'fulfilled' && defaultResult.value.active) {
                    console.log("Default leaderboard is active. Using it for calculation.");
                    selectedData = defaultResult.value;
                    boardType = "Default";
                }

                if (selectedData) {
                    processLeaderboardData(selectedData, userID);
                } else {
                    console.log("No active leaderboards found (neither tournament nor default).");
                    if(tournamentResult.status === 'rejected') console.error("Tournament fetch failed:", tournamentResult.reason);
                    if(defaultResult.status === 'rejected') console.error("Default fetch failed:", defaultResult.reason);
                }
            })
            .catch(error => {
                console.error("An unexpected error occurred during the fetch process:", error);
            });
    }
    function intelligentLeaderboardBasedWarningLimitTicker() {
        intelligentLeaderboardBasedWarningLimit();
        function randPeriod() { return (60 + Math.floor(Math.random() * 61)) * 1000; } // 60–120s inclusive
        let periodMs = randPeriod();
        let lastRun = Date.now();

        const id = setInterval(() => {
            if (Date.now() - lastRun >= periodMs) {
                lastRun = Date.now();
                try { intelligentLeaderboardBasedWarningLimit(); } catch (e) { console.error(e); }
                periodMs = randPeriod(); // pick next period
            }
        }, 1000);
    }
    // intelligentLeaderboardBasedWarningLimitTicker();

    function updateReleaseNotes(warnings) {
        const releaseNotesContainer = document.getElementById('DLP_Release_Notes_List_1_ID');
        const controlsContainer = document.getElementById('DLP_Release_Notes_Controls');
        const warningCounterDisplay = controlsContainer.querySelector('.DLP_Inset_Text_1_ID');
        const prevButton = controlsContainer.querySelector('.DLP_Inset_Icon_1_ID');
        const nextButton = controlsContainer.querySelector('.DLP_Inset_Icon_2_ID');

        releaseNotesContainer.innerHTML = '';

        let currentWarningIndex = 0;
        const totalWarnings = warnings.length;

        function updateCounterDisplay(current, total, displayElement) {
            displayElement.textContent = `${current}/${total}`;
        }

        function updateButtonOpacity(current, total, prevButton, nextButton) {
            if (current === 0) {
                prevButton.style.opacity = '0.5';
                prevButton.style.pointerEvents = 'none';
            } else {
                prevButton.style.opacity = '1';
                prevButton.style.pointerEvents = 'auto';
            }

            if (current === total - 1) {
                nextButton.style.opacity = '0.5';
                nextButton.style.pointerEvents = 'none';
            } else {
                nextButton.style.opacity = '1';
                nextButton.style.pointerEvents = 'auto';
            }
        }

        warnings.forEach((warning, index) => {
            if (warning.head && warning.body && warning.icon) {
                const warningHTML = `
                <div id="warning-${index}" style="display: ${index === 0 ? 'flex' : 'none'}; height: 200px; flex-direction: column; justify-content: center; align-items: center; gap: 8px; align-self: stretch; transition: filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        ${warning.icon}
                        <p class="DLP_Text_Style_2">${warning.head}</p>
                        <p class="DLP_Text_Style_1" style="background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${warning.tag}</p>
                    </div>
                    <p class="DLP_Text_Style_1" style="text-align: center; opacity: 0.5;">${warning.body}</p>
                </div>
                `;
                releaseNotesContainer.insertAdjacentHTML('beforeend', warningHTML);
            }
        });

        updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
        updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);

        prevButton.addEventListener('click', () => {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            if (currentWarningIndex > 0) {
                const oldWarning = document.getElementById(`warning-${currentWarningIndex}`);
                const newWarning = document.getElementById(`warning-${currentWarningIndex - 1}`);

                oldWarning.style.filter = 'blur(16px)';
                oldWarning.style.opacity = '0';
                newWarning.style.filter = 'blur(16px)';
                newWarning.style.opacity = '0';

                setTimeout(() => {
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.offsetHeight;
                    newWarning.style.filter = 'blur(0px)';
                    newWarning.style.opacity = '1';
                    currentWarningIndex--;
                    updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                }, 400);
            }
        });

        nextButton.addEventListener('click', () => {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            if (currentWarningIndex < totalWarnings - 1) {
                const oldWarning = document.getElementById(`warning-${currentWarningIndex}`);
                const newWarning = document.getElementById(`warning-${currentWarningIndex + 1}`);
                oldWarning.style.filter = 'blur(16px)';
                oldWarning.style.opacity = '0';
                newWarning.style.filter = 'blur(16px)';
                newWarning.style.opacity = '0';

                setTimeout(() => {
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.offsetHeight;
                    newWarning.style.filter = 'blur(0px)';
                    newWarning.style.opacity = '1';
                    currentWarningIndex++;
                    updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                    setTimeout(() => {
                        isBusySwitchingPages = false;
                    }, 400);
                }, 400);
            }
        });
    }

    let DLP_Feedback_Text_Input_1_ID = document.getElementById("DLP_Feedback_Text_Input_1_ID");
    let DLP_Feedback_Type_Bug_Report_Button_1_ID = document.getElementById("DLP_Feedback_Type_Bug_Report_Button_1_ID");
    let DLP_Feedback_Type_Suggestion_Button_1_ID = document.getElementById("DLP_Feedback_Type_Suggestion_Button_1_ID");
    let DLP_Feedback_Attachment_Upload_Button_1_ID = document.getElementById("DLP_Feedback_Attachment_Upload_Button_1_ID");
    let DLP_Feedback_Attachment_Input_Hidden_1_ID = document.getElementById("DLP_Feedback_Attachment_Input_Hidden_1_ID");
    let DLP_Feedback_Send_Button_1_ID = document.getElementById("DLP_Feedback_Send_Button_1_ID");

    let sendFeedbackStatus = '';
    DLP_Feedback_Send_Button_1_ID.addEventListener('click', () => {
        if (sendFeedbackStatus !== '') return;
        let FeedbackText = DLP_Feedback_Text_Input_1_ID.value;
        sendFeedbackServer(feedbackType, FeedbackText);

        setButtonState(DLP_Feedback_Send_Button_1_ID, {button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][111], icon: '􀓞'}, {text: '', icon: 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite'}, () => {
            function f() {
                if (sendFeedbackStatus === 'sent') {
                    setButtonState(DLP_Feedback_Send_Button_1_ID, {button: 'linear-gradient(0deg, rgba(var(--DLP-green), 0.10) 0%, rgba(var(--DLP-green), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-green), 0.20)', text: 'rgb(var(--DLP-green))', icon: 'rgb(var(--DLP-green))'}, {text: systemText[systemLanguage][112], icon: '􀁣'}, {text: '', icon: ' '}, () => {
                        confetti();
                    });
                } else if (sendFeedbackStatus === 'error') {
                    setButtonState(DLP_Feedback_Send_Button_1_ID, {button: 'linear-gradient(0deg, rgba(var(--DLP-pink), 0.10) 0%, rgba(var(--DLP-pink), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-pink), 0.20)', text: 'rgb(var(--DLP-pink))', icon: 'rgb(var(--DLP-pink))'}, {text: systemText[systemLanguage][115], icon: '􀇿'}, {text: '', icon: ' '}, () => {
                    });
                } else if (sendFeedbackStatus === 'sending') {
                    setTimeout(() => { f(); }, 800);
                }
            }
            f();
        });
    });

    let feedbackType = 'Suggestion';
    DLP_Feedback_Type_Bug_Report_Button_1_ID.addEventListener('click', () => {
        feedbackType = 'Bug Report';
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_1_ON');
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_1_OFF');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_2_OFF');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_2_ON');
    });
    DLP_Feedback_Type_Suggestion_Button_1_ID.addEventListener('click', () => {
        feedbackType = 'Suggestion';
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_1_OFF');
        DLP_Feedback_Type_Bug_Report_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_1_ON');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.add('DLP_Feedback_Type_Button_Style_2_ON');
        DLP_Feedback_Type_Suggestion_Button_1_ID.classList.remove('DLP_Feedback_Type_Button_Style_2_OFF');
    });
    let currentFileName = '';
    setInterval(() => {
        if (DLP_Feedback_Attachment_Input_Hidden_1_ID.files.length > 0) {
            let fileName = DLP_Feedback_Attachment_Input_Hidden_1_ID.files[0].name;
            if (currentFileName === fileName) return;
            currentFileName = fileName;
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Text_1_ID').style.filter = 'blur(4px)';
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Text_1_ID').style.opacity = '0';
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Icon_1_ID').style.filter = 'blur(4px)';
            DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Icon_1_ID').style.opacity = '0';
            DLP_Feedback_Attachment_Upload_Button_1_ID.style.background = 'rgb(var(--DLP-blue))';
            DLP_Feedback_Attachment_Upload_Button_1_ID.style.outline = '2px solid rgba(0, 0, 0, 0.20)';
            setTimeout(() => {
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Icon_1_ID').style.display = 'none';
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Text_1_ID').textContent = fileName;
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Text_1_ID').style.color = '#FFF';
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Text_1_ID').style.filter = '';
                DLP_Feedback_Attachment_Upload_Button_1_ID.querySelector('.DLP_Inset_Text_1_ID').style.opacity = '';
            }, 400);
        }
    }, 1000);
    DLP_Feedback_Attachment_Upload_Button_1_ID.addEventListener('click', () => {
        DLP_Feedback_Attachment_Input_Hidden_1_ID.click();
    });

    DLP_Feedback_Send_Button_1_ID.style.pointerEvents = 'none';
    DLP_Feedback_Send_Button_1_ID.style.opacity = '0.5';
    DLP_Feedback_Text_Input_1_ID.addEventListener("input", function () {
        if (DLP_Feedback_Text_Input_1_ID.value.replace(/\s/g, "").length <= 16) {
            DLP_Feedback_Send_Button_1_ID.style.pointerEvents = 'none';
            DLP_Feedback_Send_Button_1_ID.style.opacity = '0.5';
        } else {
            DLP_Feedback_Send_Button_1_ID.style.pointerEvents = '';
            DLP_Feedback_Send_Button_1_ID.style.opacity = '';
        }
    });
    async function sendFeedbackServer(head, body) {
        try {
            sendFeedbackStatus = 'sending';

            let payload = {
                head: head,
                body: body,
                version: versionFormal
            };

            if (DLP_Feedback_Attachment_Input_Hidden_1_ID.files.length > 0) {
                const file = DLP_Feedback_Attachment_Input_Hidden_1_ID.files[0];
                const base64File = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
                payload.file = base64File;
            }

            const response = await fetch(apiURL + "/feedback", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (responseData.status) sendFeedbackStatus = 'sent';
            else sendFeedbackStatus = 'error';

            showNotification(responseData.notification.icon, responseData.notification.head, responseData.notification.body, responseData.notification.duration);
        } catch (error) {
            console.error('Error:', error);
            sendFeedbackStatus = 'error';
            showNotification("error", systemText[systemLanguage][206], systemText[systemLanguage][207], 30);
        }
    }


    function handleClick(button, id, amount) {
        setButtonState(button, {button: 'rgba(var(--DLP-blue), 0.10)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))'}, {text: systemText[systemLanguage][113], icon: '􀓞'}, {text: '', icon: 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite'}, () => {
            let status = 'loading';

            if (id === "streak" || id === "gems") {
                (async () => {
                    try {
                        console.log(apiURL + (id === "streak" ? "/streak" : id === "gems" ? "/gem" : ""));
                        const response = await fetch(apiURL + (id === "streak" ? "/streak" : id === "gems" ? "/gem" : ""), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                            },
                            body: JSON.stringify({
                                amount: amount
                            })
                        });

                        if (!response.ok) {
                            throw new Error('Request failed with status ' + response.status);
                        }

                        const reader = response.body.getReader();
                        const decoder = new TextDecoder();
                        let done = false;
                        let buffer = '';

                        while (!done) {
                            const { value, done: doneReading } = await reader.read();
                            done = doneReading;
                            buffer += decoder.decode(value, { stream: true });

                            let openBraces = 0;
                            let start = 0;
                            for (let i = 0; i < buffer.length; i++) {
                                if (buffer[i] === '{') {
                                    openBraces++;
                                } else if (buffer[i] === '}') {
                                    openBraces--;
                                    if (openBraces === 0) {
                                        const jsonStr = buffer.substring(start, i + 1).trim();
                                        try {
                                            const data = JSON.parse(jsonStr);

                                            if (data.status === 'completed') {
                                                status = "done";
                                                done = true;
                                                showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                                                const input = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                                                if (input) {
                                                    input.value = "";
                                                    setTimeout(() => input.dispatchEvent(new Event("input")), 2400);
                                                }
                                            } else if (data.status == 'failed') {
                                                status = "error";
                                                done = true;
                                                showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                                                console.log(data);
                                            } else if (data.status === 'rejected') {
                                                status = 'rejected';
                                                done = true;
                                                showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                                                const input = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                                                if (data.max_amount) {
                                                    input.value = data.max_amount;
                                                    setTimeout(() => input.dispatchEvent(new Event("input")), 2400);
                                                }
                                            } else {
                                                console.log(`Percentage: ${data.percentage}%`);
                                                button.querySelector('.DLP_Inset_Text_1_ID').innerHTML = data.percentage + '%';
                                            }

                                            buffer = buffer.substring(i + 1);
                                            i = -1;
                                            start = 0;
                                            openBraces = 0;
                                        } catch (e) {
                                        }
                                    }
                                } else if (openBraces === 0 && buffer[i].trim() !== "") {
                                    start = i;
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error during request:', error);
                        status = 'error';
                    }
                })();
            } else {
                fetch(apiURL + '/request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                    },
                    body: JSON.stringify({
                        gain_type: id,
                        amount: amount
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === true) {
                        status = 'done';
                        showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                        const input = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                        if (input) {
                            input.value = "";
                            setTimeout(() => input.dispatchEvent(new Event("input")), 2400);
                        }
                    } else {
                        status = 'rejected';
                        showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                        const input = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                        if (data.max_amount && input) input.value = data.max_amount;
                        else if (input) {
                            input.value = "";
                            setTimeout(() => input.dispatchEvent(new Event("input")), 2400);
                        }
                    }
                })
                .catch(error => {
                    status = 'error';
                    console.error('Error fetching data:', error);
                    showNotification("error", systemText[systemLanguage][208], systemText[systemLanguage][209] + "0001", 15);
                });
            }
            setTimeout(() => {
                // this function is called like this because the animation done setButtonState takes 800ms (it also has a callback but idk how to use it)
                f();
            }, 800);
            function f() {
                if (status === 'done') {
                    setButtonState(button, {button: 'rgba(var(--DLP-green), 0.10)', outline: 'rgba(var(--DLP-green), 0.20)', text: 'rgb(var(--DLP-green))', icon: 'rgb(var(--DLP-green))'}, {text: systemText[systemLanguage][114], icon: '􀁣'}, {text: '', icon: ''}, () => {
                        confetti();
                        setTimeout(() => {
                            setButtonState(button, {button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][9], icon: '􀰫'}, {text: '', icon: ''});
                            setTimeout(() => {
                                isGetButtonsBusy = false;
                            }, 800);
                        }, 800);
                    });
                } else if (status === 'error') {
                    setButtonState(button, {button: 'rgb(var(--DLP-pink))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][115], icon: '􀇿'}, {text: '', icon: ''}, () => {
                        setTimeout(() => {
                            setButtonState(button, {button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][9], icon: '􀰫'}, {text: '', icon: ''});
                            setTimeout(() => {
                                isGetButtonsBusy = false;
                            }, 800);
                        }, 800);
                    });
                } else if (status === 'rejected') {
                    setButtonState(button, {button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF'}, {text: systemText[systemLanguage][9], icon: '􀰫'}, {text: '', icon: ''});
                    setTimeout(() => {
                        isGetButtonsBusy = false;
                    }, 800);
                } else {
                    setTimeout(() => { f(); }, 400);
                }
            }
        });
    }

    const getButtonsList1 = [
        { base: 'DLP_Get_XP', type: 'xp', input: true },
        { base: 'DLP_Get_GEMS', type: 'gems', input: true },
        { base: 'DLP_Get_SUPER', type: 'super' },
        { base: 'DLP_Get_DOUBLE_XP_BOOST', type: 'double_xp_boost' },
        { base: 'DLP_Get_Streak_Freeze', type: 'streak_freeze', input: true },
        { base: 'DLP_Get_Heart_Refill', type: 'heart_refill' },
        { base: 'DLP_Get_Streak', type: 'streak', input: true },
    ];
    function setupGetButtons(base, type, hasInput) {
        [1, 2].forEach(n => {
            const parent = document.getElementById(`${base}_${n}_ID`);
            if (!parent) return;

            const button = parent.querySelector('#DLP_Inset_Button_1_ID');
            const handler = () => {
                if (isGetButtonsBusy) return;
                isGetButtonsBusy = true;
                handleClick(button, type, hasInput ? Number(parent.querySelector('#DLP_Inset_Input_1_ID').value) : 1);
            };

            button.addEventListener('click', handler);

            if (hasInput) {
                const input = parent.querySelector('#DLP_Inset_Input_1_ID');
                input.onkeyup = e => e.keyCode === 13 && handler();
            }
        });
    };
    getButtonsList1.forEach(({ base, type, input }) => setupGetButtons(base, type, input));


    let DLP_Settings_Save_Button_1_ID = document.getElementById("DLP_Settings_Save_Button_1_ID");
    DLP_Settings_Save_Button_1_ID.addEventListener('click', () => {
        if (isBusySwitchingPages) return;
        isBusySwitchingPages = true;
        storageLocal.settings.autoUpdate = DLP_Settings_Var.autoUpdate;
        storageLocal.settings.showAutoServerButton = DLP_Settings_Var.showAutoServerButton;
        storageLocal.settings.showSolveButtons = DLP_Settings_Var.showSolveButtons;
        storageLocal.settings.anonymousUsageData = DLP_Settings_Var.anonymousUsageData;
        storageLocal.settings.solveSpeed = Number(settingsLegacySolveSpeedInputSanitizeValue(DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').value, true));
        saveStorageLocal();
        setButtonState(DLP_Settings_Save_Button_1_ID, {button: 'linear-gradient(0deg, rgba(var(--DLP-green), 0.10) 0%, rgba(var(--DLP-green), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-green), 0.20)', text: 'rgb(var(--DLP-green))', icon: 'rgb(var(--DLP-green))'}, {text: systemText[systemLanguage][116], icon: ''}, {text: '', icon: ' '}, () => {
            //confetti();
            setTimeout(() => {
                //goToPage(-1);
                location.reload();
            }, 1600);
            //setTimeout(() => {
            //    setButtonState(DLP_Settings_Save_Button_1_ID, systemText[systemLanguage][37], DLP_Settings_Save_Button_1_ID.querySelector('#DLP_Inset_Icon_1_ID'), DLP_Settings_Save_Button_1_ID.querySelector('#DLP_Inset_Icon_3_ID'), 'rgb(var(--DLP-blue))', '2px solid rgba(0, 0, 0, 0.20)', '#FFF', 400);
            //    isBusySwitchingPages = false;
            //}, 2400);
        });
    });

    let DLP_Settings_Var = {
        autoUpdate: storageLocal.settings.autoUpdate,
        showAutoServerButton: storageLocal.settings.showAutoServerButton,
        showSolveButtons: storageLocal.settings.showSolveButtons,
        solveSpeed: storageLocal.settings.solveSpeed,
        anonymousUsageData: storageLocal.settings.anonymousUsageData
    };
    let DLP_Settings_Toggle_Busy = false;
    let DLP_Settings_Show_Solve_Buttons_1_ID = document.getElementById("DLP_Settings_Show_Solve_Buttons_1_ID");
    let DLP_Settings_Show_AutoServer_Button_1_ID = document.getElementById("DLP_Settings_Show_AutoServer_Button_1_ID");
    let DLP_Settings_Legacy_Solve_Speed_1_ID = document.getElementById("DLP_Settings_Legacy_Solve_Speed_1_ID");
    let DLP_Settings_Help_Us_Make_Better_Button_1_ID = document.getElementById("DLP_Settings_Help_Us_Make_Better_Button_1_ID");
    let DLP_Settings_Auto_Update_Toggle_1_ID = document.getElementById("DLP_Settings_Auto_Update_Toggle_1_ID");

    handleToggleClick(DLP_Settings_Show_Solve_Buttons_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.showSolveButtons);
    if (alpha) handleToggleClick(DLP_Settings_Show_AutoServer_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.showAutoServerButton);
    else DLP_Settings_Show_AutoServer_Button_1_ID.remove();
    handleToggleClick(DLP_Settings_Auto_Update_Toggle_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.autoUpdate);
    handleToggleClick(DLP_Settings_Help_Us_Make_Better_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.anonymousUsageData);
    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').value = DLP_Settings_Var.solveSpeed;

    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').addEventListener("input", function () {
        this.value = settingsLegacySolveSpeedInputSanitizeValue(this.value, false);
    });
    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').addEventListener("blur", function () {
        this.value = settingsLegacySolveSpeedInputSanitizeValue(this.value, true);
        DLP_Settings_Var.solveSpeed = Number(this.value);
    });

    function settingsLegacySolveSpeedInputSanitizeValue(value, completeSanitization) {
        value = value.replace(/[^0-9.,]/g, '');
        let match = value.match(/[.,]/g);
        if (match && match.length > 1) {
            value = value.slice(0, value.lastIndexOf(match[match.length - 1]));
        }
        let decimalIndex = value.indexOf('.');
        if (decimalIndex !== -1) {
            value = value.slice(0, decimalIndex + 3);
        }
        let digitCount = value.replace(/[^0-9]/g, '').length;
        if (digitCount > 3) {
            value = value.replace(/(\d{3})\d+/, '$1');
        }
        if (/^0\d/.test(value) && !value.startsWith("0.")) {
            value = value.replace(/^0+/, '0');
        }

        if (!completeSanitization) return value;

        value = value.replace(',', '.');
        value = parseFloat(value);
        if (!isNaN(value)) {
            if (value < 0.6) value = 0.6;
        } else {
            value = 0.8;
        }
        return value;
    }


    function handleToggleClick(button, state) {
        try {
            let iconToChange = button.querySelector(".DLP_Inset_Icon_1_ID");
            iconToChange.style.transition = '0.4s';

            void button.offsetWidth;
            iconToChange.style.filter = 'blur(4px)';
            iconToChange.style.opacity = '0';

            if (state) {
                button.classList.add('DLP_Toggle_Style_1_ON');
                button.classList.remove('DLP_Toggle_Style_1_OFF');
            } else {
                button.classList.add('DLP_Toggle_Style_1_OFF');
                button.classList.remove('DLP_Toggle_Style_1_ON');
            }

            setTimeout(() => {
                iconToChange.textContent = state ? '􀁣' : '􀁡';

                void button.offsetWidth;
                iconToChange.style.filter = 'blur(0px)';
                iconToChange.style.opacity = '1';
            }, 400);
        } catch (e) {
            console.error(e);
        }
    }
    DLP_Settings_Auto_Update_Toggle_1_ID.querySelector('#DLP_Inset_Toggle_1_ID').addEventListener('click', () => {
        if (DLP_Settings_Toggle_Busy) return;
        if (!greasyfork) {
            DLP_Settings_Var.autoUpdate = !DLP_Settings_Var.autoUpdate;
            DLP_Settings_Toggle_Busy = true;
            handleToggleClick(DLP_Settings_Auto_Update_Toggle_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.autoUpdate);
            setTimeout(() => {
                DLP_Settings_Toggle_Busy = false;
            }, 800);
        }
    });
    DLP_Settings_Show_Solve_Buttons_1_ID.querySelector('#DLP_Inset_Toggle_1_ID').addEventListener('click', () => {
        if (DLP_Settings_Toggle_Busy) return;
        DLP_Settings_Var.showSolveButtons = !DLP_Settings_Var.showSolveButtons;
        DLP_Settings_Toggle_Busy = true;
        handleToggleClick(DLP_Settings_Show_Solve_Buttons_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.showSolveButtons);
        setTimeout(() => {
            DLP_Settings_Toggle_Busy = false;
        }, 800);
    });
    DLP_Settings_Show_AutoServer_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID').addEventListener('click', () => {
        if (DLP_Settings_Toggle_Busy) return;
        DLP_Settings_Var.showAutoServerButton = !DLP_Settings_Var.showAutoServerButton;
        DLP_Settings_Toggle_Busy = true;
        handleToggleClick(DLP_Settings_Show_AutoServer_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.showAutoServerButton);
        setTimeout(() => {
            DLP_Settings_Toggle_Busy = false;
        }, 800);
    });
    DLP_Settings_Help_Us_Make_Better_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID').addEventListener('click', () => {
        if (DLP_Settings_Toggle_Busy) return;
        if (alpha) return;
        DLP_Settings_Var.anonymousUsageData = !DLP_Settings_Var.anonymousUsageData;
        DLP_Settings_Toggle_Busy = true;
        handleToggleClick(DLP_Settings_Help_Us_Make_Better_Button_1_ID.querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.anonymousUsageData);
        setTimeout(() => {
            DLP_Settings_Toggle_Busy = false;
        }, 800);
    });


    function confetti() {
        let canvas = document.getElementById("DLP_Confetti_Canvas");
        if (!canvas.confettiInitialized) {
            let ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            let cx = ctx.canvas.width / 2;
            let cy = ctx.canvas.height / 2;

            canvas.ctx = ctx;
            canvas.cx = cx;
            canvas.cy = cy;
            canvas.confetti = [];
            canvas.animationId = null;
            canvas.confettiInitialized = true;

            let resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.cx = canvas.ctx.canvas.width / 2;
                canvas.cy = canvas.ctx.canvas.height / 2;
            };

            const resizeObserver = new ResizeObserver(() => {
                resizeCanvas();
            });
            resizeObserver.observe(canvas);

            let render = () => {
                canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.confetti.forEach((confetto, index) => {
                    let width = confetto.dimensions.x * confetto.scale.x;
                    let height = confetto.dimensions.y * confetto.scale.y;
                    canvas.ctx.translate(confetto.position.x, confetto.position.y);
                    canvas.ctx.rotate(confetto.rotation);

                    confetto.velocity.x -= confetto.velocity.x * drag;
                    confetto.velocity.y = Math.min(
                        confetto.velocity.y + gravity,
                        terminalVelocity,
                    );
                    confetto.velocity.x +=
                        Math.random() > 0.5 ? Math.random() : -Math.random();

                    confetto.position.x += confetto.velocity.x;
                    confetto.position.y += confetto.velocity.y;

                    if (confetto.position.y >= canvas.height) canvas.confetti.splice(index, 1);

                    if (confetto.position.x > canvas.width) confetto.position.x = 0;
                    if (confetto.position.x < 0) confetto.position.x = canvas.width;

                    canvas.ctx.fillStyle = confetto.color.front;
                    canvas.ctx.fillRect(-width / 2, -height / 2, width, height);
                    canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
                });
                canvas.animationId = window.requestAnimationFrame(render);
            };
            render();
        }

        const gravity = 0.5;
        const terminalVelocity = 10;
        const drag = 0.01;
        const colors = [
            { front: "#FF2D55", back: "#FF2D55" },
            { front: "#FF9500", back: "#FF9500" },
            { front: "#FFCC00", back: "#FFCC00" },
            { front: "#34C759", back: "#34C759" },
            { front: "#5AC8FA", back: "#5AC8FA" },
            { front: "#007AFF", back: "#007AFF" },
            { front: "#5856D6", back: "#5856D6" },
            { front: "#AF52DE", back: "#AF52DE" },
        ];

        const confettiSizeRange = {
            min: 5,
            max: 15
        };

        let randomRange = (min, max) => Math.random() * (max - min) + min;

        const confettiCount = 400;
        for (let i = 0; i < confettiCount; i++) {
            canvas.confetti.push({
                color: colors[Math.floor(randomRange(0, colors.length))],
                dimensions: {
                    x: randomRange(confettiSizeRange.min, confettiSizeRange.max),
                    y: randomRange(confettiSizeRange.min, confettiSizeRange.max),
                },
                position: {
                    x: randomRange(0, canvas.width),
                    y: canvas.height - 1,
                },
                rotation: randomRange(0, 2 * Math.PI),
                scale: {
                    x: 1,
                    y: 1,
                },
                velocity: {
                    x: randomRange(-25, 25),
                    y: randomRange(0, -50),
                },
            });
        }
    }

    function playHaptic(type) {
        function isIPhone() {
            return (/iPhone/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
        }
        function isAndroid() {
            return /Android/.test(navigator.userAgent) && 'vibrate' in navigator;
        }

        // iOS haptic trick
        function iosHaptic() {
            try {
                const label = document.createElement("label");
                label.ariaHidden = "true";
                label.style.display = "none";
                const input = document.createElement("input");
                input.type = "checkbox";
                input.setAttribute("switch", "");
                label.appendChild(input);
                document.head.appendChild(label);
                label.click();
                document.head.removeChild(label);
            } catch {
                console.log("iOS haptic error");
            }
        }

        // Android/Browser Vibration API
        function androidHaptic(pattern) {
            try {
                if (navigator.vibrate) {
                    navigator.vibrate(pattern);
                }
            } catch {
                console.log("Android haptic error");
            }
        }

        if (isIPhone()) {
            if (type === "success") {
                iosHaptic();
                setTimeout(iosHaptic, 80);
            } else if (type === "warning" || type === "error") {
                iosHaptic();
                setTimeout(iosHaptic, 100);
                setTimeout(iosHaptic, 200);
                setTimeout(iosHaptic, 280);
            } else {
                iosHaptic();
            }
        } else if (isAndroid()) {
            if (type === "success") {
                androidHaptic([30, 40, 30]);
            } else if (type === "fail" || type === "error") {
                androidHaptic([30, 40, 30, 40, 30]);
            } else {
                androidHaptic(30);
            }
        } else if (navigator.vibrate) {
            // fallback for other platforms supporting Vibration API
            if (type === "success") {
                navigator.vibrate([30, 40, 30]);
            } else if (type === "fail" || type === "error") {
                navigator.vibrate([30, 40, 30, 40, 30]);
            } else {
                navigator.vibrate(30);
            }
        }
        // else: no-op
    }



    async function generateEarnKey() {
        const endpoint = `https://api.duolingopro.net/earn/connect/generate`;

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.earn_key) {
                    console.log('Earn Key:', data.earn_key);
                    return data.earn_key;
                } else {
                    throw new Error('Earn key not found in the response.');
                }
            } else if (response.status === 401) {
                throw new Error('Unauthorized: Invalid or missing authentication token.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded: Please try again later.');
            } else if (response.status === 500) {
                const errorData = await response.json();
                throw new Error(`Server Error: ${errorData.detail || 'An unexpected error occurred.'}`);
            } else {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.detail || 'An unexpected error occurred.'}`);
            }
        } catch (error) {
            console.error('Error generating earn key:', error.message);
            throw error;
        }
    }

    let earnButtonAssignedLink = false;
    document.querySelectorAll("#DLP_Main_Earn_Button_1_ID, #DLP_Secondary_Earn_Button_1_ID").forEach(button => {
        button.addEventListener('click', () => {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';

            generateEarnKey()
                .then(earnKey => {
                console.log('Successfully retrieved earn key:', earnKey);
                button.setAttribute("onclick", `window.open('${serverURL}/earn/connect/link/${earnKey}', '_blank');`);
                if (!earnButtonAssignedLink) {
                    earnButtonAssignedLink = true;
                    window.open(serverURL + "/earn/connect/link/" + earnKey, "_blank");
                }
            })
                .catch(error => {
                console.error('Failed to retrieve earn key:', error.message);
            })
                .finally(() => {
                button.style.opacity = '';
                button.style.pointerEvents = '';
            });
        });
    });




    let currentChatId = 1;
    let allTexts = {}; // { [chatId]: text }
    let allAttachments = {}; // { [chatId]: [ {id, file}, … ] }

    function setupSupportPage() {
        const container = document.getElementById("DLP_Main_Box_Divider_11_ID");
        const chatBox = container.querySelector('.DLP_Chat_Box_1_ID_1');
        const attachmentVisualButton = container.querySelector('#DLP_Inset_Button_1_ID');
        const sendButton = container.querySelector("#DLP_Inset_Button_2_ID");
        const attachmentInput = container.querySelector("#DLP_Attachment_Input_1");
        const messageInput = container.querySelector("#DLP_Inset_Input_1_ID");
        const activeContainer = container.querySelector('.DLP_Input_Style_1_Active');

        function resetMessageInputState() {
            messageInput.value = '';
            messageInput.style.height = '1.2em';
            if (activeContainer) activeContainer.style.height = '48px';
            messageInput.scrollTop = 0;
            checkSendButton();
        }

        function setupCard() {
            let card = document.getElementById("DLP_Main_Box_Divider_11_ID").querySelector("#DLP_Inset_Card_1");
            let cardExpanded = false;
            let cardAnimating = false;

            let descriptionText = card.querySelectorAll(':scope > .DLP_Text_Style_1');

            card.addEventListener('click', () => {
                if (cardAnimating) return;
                cardAnimating = true;
                if (!cardExpanded) {
                    let cardHeight = card.offsetHeight;
                    let textHeight = false;
                    if (descriptionText.length > 0) {
                        textHeight = Array.from(descriptionText).map(() => "0");
                        descriptionText.forEach(element => {
                            element.style.display = 'block';
                            element.style.height = 'auto';
                        });
                    }
                    void card.offsetHeight;
                    let newCardHeight = card.offsetHeight;
                    let newTextHeight = false;
                    if (descriptionText.length > 0) {
                        newTextHeight = Array.from(descriptionText).map(element => element.offsetHeight);
                    }
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.height = '0px';
                        });
                    }
                    card.style.height = `${cardHeight}px`;
                    void card.offsetHeight;
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.filter = 'blur(0px)';
                            element.style.opacity = '1';
                        });
                    }
                    card.style.height = `${newCardHeight}px`;
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.height = `${newTextHeight[Array.from(descriptionText).indexOf(element)]}px`;
                        });
                    }
                    card.querySelector('.DLP_HStack_6').style.opacity = '0.5';
                    card.querySelector('.DLP_HStack_6').lastElementChild.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
                    card.querySelector('.DLP_HStack_6').lastElementChild.style.transform = 'rotate(90deg)';
                    setTimeout(() => {
                        card.style.height = 'auto';
                        if (descriptionText.length > 0) {
                            descriptionText.forEach(element => {
                                element.style.height = 'auto';
                            });
                        }
                        cardExpanded = true;
                        cardAnimating = false;
                    }, 400);
                } else {
                    let cardHeight = card.offsetHeight;
                    let textHeight = false;
                    if (descriptionText.length > 0) {
                        textHeight = Array.from(descriptionText).map(element => element.offsetHeight);
                        descriptionText.forEach(element => {
                            element.style.display = 'none';
                        });
                    }
                    void card.offsetHeight;
                    let newCardHeight = card.offsetHeight;
                    let newTextHeight = false;
                    if (descriptionText.length > 0) {
                        newTextHeight = Array.from(descriptionText).map(() => "0");
                        descriptionText.forEach(element => {
                            element.style.display = 'block';
                            element.style.height = `${textHeight[Array.from(descriptionText).indexOf(element)]}px`;
                        });
                    }
                    card.style.height = `${cardHeight}px`;
                    void card.offsetHeight;

                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.filter = 'blur(4px)';
                            element.style.opacity = '0';
                        });
                    }
                    card.style.height = `${newCardHeight}px`;
                    if (descriptionText.length > 0) {
                        descriptionText.forEach(element => {
                            element.style.height = '0px';
                        });
                    }
                    card.querySelector('.DLP_HStack_6').style.opacity = '1';
                    card.querySelector('.DLP_HStack_6').lastElementChild.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.32, 1)';
                    card.querySelector('.DLP_HStack_6').lastElementChild.style.transform = 'rotate(0deg)';
                    setTimeout(() => {
                        card.style.height = 'auto';
                        if (descriptionText.length > 0) {
                            descriptionText.forEach(element => {
                                element.style.display = 'none';
                            });
                        }
                        cardExpanded = false;
                        cardAnimating = false;
                    }, 400);
                }
            });
        }
        setupCard();

        function setupSendButton() {
            sendButton.addEventListener('click', async () => {
                if (!storageLocal.chatKey || storageLocal.chatKey.length === 0) {
                    try {
                        let response = await fetch(apiURL + "/chats/create", {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                            }
                        });

                        let data = await response.json();
                        console.log("Server Response:", data);
                        storageLocal.chatKey = [data.chat_key];
                        saveStorageLocal();
                    } catch (error) {
                        console.error("Fetch error:", error);
                    }
                }

                let formData = new FormData();
                formData.append("message", messageInput.value);

                let fileUrls = [];
                for (const attachment of allAttachments[currentChatId] ?? []) {
                    const file = attachment.file;
                    console.log("attaching", file);
                    formData.append("files", file);
                    const url = URL.createObjectURL(file);
                    console.log("url", url);
                    fileUrls.push(url);
                }

                let tempData = {
                    "accent": '#007AFF',
                    "author": userBioData.username,
                    "edited": false,
                    "files": fileUrls,
                    "message": messageInput.value,
                    "profile_picture": userBioData.profile_picture,
                    "role": "You",
                    "send_time": Number(Date.now())
                }

                let chatTempSendNumber = chatTempSendList.length ? chatTempSendList[chatTempSendList.length - 1] + 1 : 1;
                createMessage(tempData, false, chatTempSendNumber);

                chatTempSendList.push(chatTempSendNumber);

                chatBox.scrollTop = chatBox.scrollHeight;
                allAttachments[currentChatId] = [];
                renderAttachmentsPreview();
                resetMessageInputState();

                sendButton.style.opacity = '0.5';
                sendButton.style.pointerEvents = 'none';

                try {
                    let response = await fetch(apiURL + "/chats/send_message", {
                        method: "POST",
                        headers: alpha
                        ? {
                            'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`,
                            'X-Chat-Key': `${storageLocal.chatKey[0]}`
                        }
                        : {
                            'X-Chat-Key': `${storageLocal.chatKey[0]}`
                        },
                        body: formData
                    });

                    let responseData = await response.json();
                    console.log("Server Response:", responseData);
                    if (!responseData.status) showNotification(responseData.notification.icon, responseData.notification.head, responseData.notification.body, responseData.notification.duration);
                    chatBox.querySelectorAll(`[data-is-temp="${chatTempSendNumber}"]`).forEach(element => {
                        //
                    });

                } catch (error) {
                    console.error("Fetch error:", error);
                }
            });
        }
        setupSendButton();

        function setupTextInput() {
            const sendButton = container.querySelector("#DLP_Inset_Button_2_ID");
            resetMessageInputState();

            messageInput.addEventListener('input', function () {
                messageInput.style.height = '1.2em';

                const lineHeight = parseInt(getComputedStyle(messageInput).lineHeight);
                const maxRows = 5;
                const maxHeight = lineHeight * maxRows;

                const newHeight = Math.min((messageInput.scrollHeight - 32), maxHeight);

                messageInput.style.height = newHeight + 'px';

                if (newHeight < 20) {
                    activeContainer.style.height = '48px';
                } else {
                    activeContainer.style.height = (newHeight + 32) + 'px';
                }

                if (messageInput.value.trim() === '') {
                    sendButton.style.opacity = '0.5';
                    sendButton.style.pointerEvents = 'none';
                } else {
                    sendButton.style.opacity = '';
                    sendButton.style.pointerEvents = '';
                }
            });

            messageInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    if (sendButton.style.pointerEvents !== 'none') {
                        sendButton.click();
                    }
                }
            });
        }
        setupTextInput();

        let nextAttachmentId = 0;
        let attachmentDropBoxExpanded = false;

        const MAX_ATTACHMENT_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
        const MAX_ATTACHMENT_FILE_COUNT = 3;

        function setupAttachmentsInput() {
            const attachmentBox = container.querySelector('#DLP_Attachment_Preview_Parent');
            const attachmentBoxDrop = attachmentBox.querySelector('.DLP_Attachment_Box_Drop_1');

            attachmentBoxDrop.addEventListener('dragenter', event => {
                event.preventDefault();
                //attachmentBoxDrop.style.outline = '2px solid rgba(var(--DLP-blue), 0.20)';
                attachmentBoxDrop.firstElementChild.style.opacity = '1';
            });

            attachmentBoxDrop.addEventListener('dragleave', event => {
                event.preventDefault();
                if (attachmentBoxDrop.contains(event.relatedTarget)) return;
                //attachmentBoxDrop.style.outline = '2px dashed rgba(var(--DLP-blue), 0.20)';
                attachmentBoxDrop.firstElementChild.style.opacity = '0.5';
            });

            window.addEventListener('dragover', (event) => {
                event.preventDefault();
                if (attachmentInput.disabled) return;
                if (event.dataTransfer && event.dataTransfer.types.includes('Files')) {
                    if (attachmentBox.style.display === 'none') {
                        attachmentBox.style.display = '';
                    }
                    [...attachmentBox.children].forEach(child => {
                        if (child !== attachmentBoxDrop) {
                            child.style.display = 'none';
                        }
                    });
                    attachmentBoxDrop.style.display = '';
                }
            });

            window.addEventListener('dragleave', (event) => {
                if (event.clientX <= 0 || event.clientY <= 0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
                    if (attachmentBox.children.length === 1 && attachmentBox.children[0] === attachmentBoxDrop) {
                        attachmentBox.style.display = 'none';
                    }
                    [...attachmentBox.children].forEach(child => {
                        if (child !== attachmentBoxDrop) {
                            child.style.display = '';
                        }
                    });
                    attachmentBoxDrop.style.display = 'none';
                    //attachmentBoxDrop.style.outline = '2px dashed a(var(--DLP-blue), 0.20)';
                    attachmentBoxDrop.firstElementChild.style.opacity = '0.5';
                }
            });

            window.addEventListener('drop', (event) => {
                event.preventDefault();
                [...attachmentBox.children].forEach(child => {
                    if (child !== attachmentBoxDrop) {
                        child.style.display = '';
                    }
                });
                attachmentBoxDrop.style.display = 'none';
                //attachmentBoxDrop.style.outline = '2px dashed rgba(var(--DLP-blue), 0.20)';
                attachmentBoxDrop.firstElementChild.style.opacity = '0.5';
            });

            attachmentBoxDrop.addEventListener('drop', (event) => {
                event.preventDefault();
                attachmentBoxDrop.style.display = 'none';

                const selectedFiles = Array.from(event.dataTransfer.files);
                triggerInputAttachments(selectedFiles);
            });

            attachmentVisualButton.addEventListener('click', () => attachmentInput.click());

            attachmentInput.addEventListener('change', (event) => {
                const selectedFiles = Array.from(event.target.files);
                triggerInputAttachments(selectedFiles);
            });
        }
        setupAttachmentsInput();

        function triggerInputAttachments(selectedFiles) {
            if (!allAttachments[currentChatId]) {
                allAttachments[currentChatId] = [];
            }
            const validFiles = [];

            selectedFiles.forEach(file => {
                if (file.size > MAX_ATTACHMENT_FILE_SIZE) {
                    showNotification("warning", "File Too Large", `${file.name} is over 10 MB, please choose a smaller file.`, 10);
                } else {
                    validFiles.push(file);
                }
            });

            const remainingSlots = MAX_ATTACHMENT_FILE_COUNT - allAttachments[currentChatId]?.length;
            if (validFiles.length > remainingSlots) {
                showNotification("warning", "Too Many Files", `You can only attach up to ${MAX_ATTACHMENT_FILE_COUNT} files at once.`, 10);
                validFiles.length = remainingSlots;
            }

            validFiles.forEach(file => {
                allAttachments[currentChatId]?.push({ id: String(nextAttachmentId++), file }); // wrap each in an {id, file} and append
            });

            updateAttachmentsInput();
            renderAttachmentsPreview();
            checkSendButton();
            attachmentInput.value = '';
        }

        function updateAttachmentsInput() {
            const dt = new DataTransfer();
            allAttachments[currentChatId]?.forEach(a => dt.items.add(a.file));
            attachmentInput.files = dt.files;
        }

        function removeAttachmentById(id) {
            allAttachments[currentChatId] = allAttachments[currentChatId]?.filter(a => a.id !== id);
            updateAttachmentsInput();
            renderAttachmentsPreview();
            checkSendButton();
        }

        function renderAttachmentsPreview() {
            const attachmentBox = container.querySelector('#DLP_Attachment_Preview_Parent');
            const attachmentBoxDrop = attachmentBox.querySelector('.DLP_Attachment_Box_Drop_1');

            const currentIds = new Set(allAttachments[currentChatId]?.map(a => a.id));

            // 1) remove deleted attachments from the DOM
            Array.from(attachmentBox.children).forEach(child => {
                const childId = child.getAttribute('data-id');
                if (!currentIds.has(childId) && child !== attachmentBoxDrop) {
                    attachmentBox.removeChild(child);
                }
            });

            // 2) add new attachments to the DOM
            allAttachments[currentChatId]?.forEach(({ id, file }) => {
                if (attachmentBox.querySelector(`[data-id="${id}"]`)) return;

                const url = URL.createObjectURL(file);
                const box = document.createElement('div');
                box.className = 'DLP_Attachment_Box_1';
                box.setAttribute('data-id', id);
                box.style.position = 'relative';

                let media;
                if (file.type.startsWith('image/')) {
                    media = document.createElement('img');
                    media.src = url;
                    media.className = 'DLP_Attachment_Box_1_Content';
                } else if (file.type.startsWith('video/')) {
                    media = document.createElement('video');
                    media.src = url;
                    media.autoplay = true;
                    media.muted = true;
                    media.loop = true;
                    media.className = 'DLP_Attachment_Box_1_Content';
                } else {
                    media = document.createElement('div');
                    media.style.display = 'flex';
                    media.style.width = '100%';
                    media.style.height = '100%';
                    media.style.paddingTop = '6px';
                    media.style.flexDirection = 'column';
                    media.style.justifyContent = 'center';
                    media.style.alignItems = 'center';
                    media.style.gap = '6px';
                    media.style.flexShrink = '0';

                    mediaChild1 = document.createElement('p');
                    mediaChild1.className = 'DLP_Text_Style_1 DLP_NoSelect';
                    mediaChild1.style.fontSize = '24px';
                    mediaChild1.textContent = '􀈸';
                    media.appendChild(mediaChild1);

                    mediaChild2 = document.createElement('p');
                    mediaChild2.className = 'DLP_Text_Style_1 DLP_NoSelect';
                    mediaChild2.style.opacity = '0.5';
                    mediaChild2.textContent = 'File';
                    //mediaChild2.textContent = file.name;
                    media.appendChild(mediaChild2);
                }

                // Create and append delete button
                const hover = document.createElement('div');
                hover.className = 'DLP_Attachment_Box_1_Hover';
                hover.style.display = 'none';
                box.addEventListener('mouseenter', () => {
                    hover.style.display = '';
                });
                box.addEventListener('mouseleave', () => {
                    hover.style.display = 'none';
                });
                const btn = document.createElement('p');
                btn.className = 'DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect';
                if ((file.type.startsWith('image/') || file.type.startsWith('video/'))) btn.textContent = '􀻀';
                else btn.textContent = '􀈸';
                btn.addEventListener('click', () => removeAttachmentById(id));
                hover.appendChild(btn);

                box.appendChild(media);
                box.appendChild(hover);
                attachmentBox.appendChild(box);

                if (false) {
                    if (file.type.startsWith('image/')) {
                        media.addEventListener('load', () => updateContrast(box));
                        if (media.complete) updateContrast(box);
                    } else if (file.type.startsWith('video/')) {
                        media.addEventListener('loadeddata', () => {
                            const iv = setInterval(() => {
                                if (!document.contains(media)) {
                                    clearInterval(iv);
                                } else {
                                    updateContrast(box);
                                }
                            }, 250);
                            updateContrast(box);
                        });
                    } else {
                        updateContrast(box);
                    }
                }
            });

            // Show or hide the attachmentBox and adjust padding/navigation
            if ((allAttachments[currentChatId]?.length ?? 0) === 0 && attachmentDropBoxExpanded) {
                attachmentBox.style.display = 'none';
                attachmentDropBoxExpanded = false;
                chatBox.scrollTop = chatBox.scrollHeight;
                //const nav = document.querySelector('#DLP_Main_Navigation_Box_5_ID .DLP_Col.DLP_Fill_Col.DLP_Fill_Row.DLP_Gap_8');
                //nav.style.paddingBottom = `${parseFloat(getComputedStyle(nav).paddingBottom) - 104}px`;
            } else if (allAttachments[currentChatId]?.length > 0 && !attachmentDropBoxExpanded) {
                attachmentBox.style.display = '';
                attachmentDropBoxExpanded = true;
                chatBox.scrollTop = chatBox.scrollHeight;
                //const nav = document.querySelector('#DLP_Main_Navigation_Box_5_ID .DLP_Col.DLP_Fill_Col.DLP_Fill_Row.DLP_Gap_8');
                //nav.style.paddingBottom = `${parseFloat(getComputedStyle(nav).paddingBottom) + 104}px`;
                //void container.offsetHeight;
                //document.querySelector('#DLP_Main_Navigation_Box_5_ID').scrollTop += 104;
            }

            // Disable input if there are too many files
            if (allAttachments[currentChatId]?.length >= MAX_ATTACHMENT_FILE_COUNT) {
                attachmentInput.disabled = true;
                attachmentVisualButton.style.opacity = '0.5';
                attachmentVisualButton.style.pointerEvents = 'none';
            } else {
                attachmentInput.disabled = false;
                attachmentVisualButton.style.opacity = '';
                attachmentVisualButton.style.pointerEvents = '';
            }

        }

        function setupCreateNewChatButton() {
            let theButton = container.querySelector('#DLP_Inset_Group_2').querySelector('#DLP_Inset_Button_3_ID');
            theButton.addEventListener('click', async () => {
                theButton.style.opacity = "0.5";
                theButton.style.pointerEvents = "none";
                try {
                    let response = await fetch(apiURL + "/chats/create", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                        }
                    });

                    let data = await response.json();
                    console.log("Server Response:", data);
                    storageLocal.chatKey = [data.chat_key];
                    saveStorageLocal();

                    chatBox.innerHTML = '';

                    container.querySelector('#DLP_Inset_Group_1').style.display = "";
                    container.querySelector('#DLP_Inset_Group_2').style.display = "none";

                    theButton.style.opacity = "";
                    theButton.style.pointerEvents = "";
                } catch (error) {
                    console.error("Fetch error:", error);
                    theButton.style.opacity = "";
                    theButton.style.pointerEvents = "";
                }
            });
        }
        setupCreateNewChatButton();

        function checkSendButton() {
            if (messageInput.value.trim() !== "" || allAttachments[currentChatId]?.length > 0) {
                sendButton.style.opacity = "";
                sendButton.style.pointerEvents = "";
            } else {
                sendButton.style.opacity = "0.5";
                sendButton.style.pointerEvents = "none";
            }
        }
        checkSendButton();
    }
    setupSupportPage();










    const originalPlay = HTMLAudioElement.prototype.play;
    function muteTab(value) {
        HTMLAudioElement.prototype.play = function () {
            if (value) {
                this.muted = true;
            } else {
                this.muted = false;
            }
            return originalPlay.apply(this, arguments);
        };
    }

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            if (event.shiftKey) {
                solving();
            } else {
                solve();
            }
        }
    });

    let currentQuestionId = null;
    let hasLoggedForCurrent = false;

    async function logOnce(flag, sol, dom) {
        // flag: 1 = solved, 2 = wrong, 3 = stuck
        if (!hasLoggedForCurrent) {
            if (alpha) {
                console.log(flag);
                //console.log(sol);
                //console.log(dom);
                console.log(sol.challengeGeneratorIdentifier.generatorId);
            }
            hasLoggedForCurrent = true;

            if (storageLocal.settings.anonymousUsageData) {
                if (flag === 2) showNotification("error", "Legacy Solved Incorrectly", "Legacy has detected that it solved a question incorrectly. A report has been made under ID: " + sol.challengeGeneratorIdentifier.generatorId, 10);
                else if (flag === 3) showNotification("error", "Legacy is Stuck", "Legacy has detected that it is stuck on a question. A report has been made under ID: " + sol.challengeGeneratorIdentifier.generatorId, 10);

                const payload = {
                    version: versionFormal,
                    random: storageLocal.random16,
                    flag: flag,
                    sol: sol,
                    dom: dom.outerHTML
                };

                const response = await fetch("https://api.duolingopro.net/analytics/legacy", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                if (flag === 2) showNotification("error", "Legacy Solved Incorrectly", "Legacy has detected that it solved a question incorrectly. Turn on share anonymous usage data in settings to help us fix this bug.", 10);
                else if (flag === 3) showNotification("error", "Legacy is Stuck", "Legacy has detected that it is stuck on a question. Turn on share anonymous usage data in settings to help us fix this bug.", 10);
            }
        }
    }

    function updateSolveButtonText(text) {
        document.getElementById("solveAllButton").innerText = text;
    }

    function solving(value) {
        if (value === "start") isAutoMode = true;
        else if (value === "stop") isAutoMode = false;
        else isAutoMode = !isAutoMode;
        updateSolveButtonText(isAutoMode ? systemText[systemLanguage][102] : systemText[systemLanguage][101]);
        solvingIntervalId = isAutoMode ? (function() {
            let initialUrl = window.location.href;
            return setInterval(function() {
                if (window.location.href !== initialUrl) {
                    isAutoMode = false;
                    clearInterval(solvingIntervalId);
                    updateSolveButtonText(isAutoMode ? systemText[systemLanguage][102] : systemText[systemLanguage][101]);
                    return;
                } else {
                    solve();
                }
            }, storageLocal.settings.solveSpeed * 1000);
        })() : clearInterval(solvingIntervalId);
    }

    let hcwNIIOdaQqCZRDL = false;
    function solve() {
        const practiceAgain = document.querySelector('[data-test="player-practice-again"]');
        const sessionCompleteSlide = document.querySelector('[data-test="session-complete-slide"]');

        const selectorsForSkip = [
            '[data-test="practice-hub-ad-no-thanks-button"]',
            '.vpDIE',
            '[data-test="plus-no-thanks"]',
            '._1N-oo._36Vd3._16r-S._1ZBYz._23KDq._1S2uf.HakPM',
            '._8AMBh._2vfJy._3Qy5R._28UWu._3h0lA._1S2uf._1E9sc',
            '._1Qh5D._36g4N._2YF0P._28UWu._3h0lA._1S2uf._1E9sc',
            '[data-test="story-start"]',
            '._3bBpU._1x5JY._1M9iF._36g4N._2YF0P.T7I0c._2EnxW.MYehf',
            '._2V6ug._1ursp._7jW2t._28UWu._3h0lA._1S2uf._1E9sc', // No Thanks Legendary Button
            '._1rcV8._1VYyp._1ursp._7jW2t._1gKir', // Language Score
			'._2V6ug._1ursp._7jW2t._3zgLG' // Create Profile Later
        ];
        selectorsForSkip.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.click();
        });


        const status = storageSession.legacy.status;
        const type = status ? storageSession.legacy[status]?.type : null;
        let amount;

        if (sessionCompleteSlide !== null && isAutoMode && storageSession.legacy.status) {
            if (!hcwNIIOdaQqCZRDL) {
                hcwNIIOdaQqCZRDL = true;
                if (type === 'lesson') {
                    storageSession.legacy[status].amount -= 1;
                    saveStorageSession();
                    amount = status ? storageSession.legacy[status]?.amount : null;
                    if (amount > 0) {
                        if (practiceAgain !== null) {
                            practiceAgain.click();
                            return;
                        } else {
                            location.reload();
                        }
                    } else {
                        storageSession.legacy[status].amount = 0;
                        storageSession.legacy.status = false;
                        saveStorageSession();
                        window.location.href = "https://duolingo.com";
                        return;
                    }
                } else if (type === 'xp') {
                    storageSession.legacy[status].amount -= findSubReact(document.getElementsByClassName("_1XNQX")[0]).xpGoalSessionProgress.totalXpThisSession;
                    saveStorageSession();
                    amount = status ? storageSession.legacy[status]?.amount : null;
                    if (amount > 0) {
                        if (practiceAgain !== null) {
                            practiceAgain.click();
                            return;
                        } else {
                            location.reload();
                        }
                    } else {
                        storageSession.legacy[status].amount = 0;
                        storageSession.legacy.status = false;
                        saveStorageSession();
                        window.location.href = "https://duolingo.com";
                        return;
                    }
                } else if (type === 'infinity') {
                    if (practiceAgain !== null) {
                        practiceAgain.click();
                        return;
                    } else {
                        location.reload();
                    }
                }
            }
        }

        try {
            window.sol = findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge;
        } catch (error) {
            console.log(error);
            //let next = document.querySelector('[data-test="player-next"]');
            //if (next) {
            //    next.click();
            //}
            //return;
        }
        //if (!window.sol) {
        //    return;
        //}

        let challengeType;
        if (window.sol) {
            challengeType = determineChallengeType();
        } else {
            challengeType = 'error';
            nextClickFunc();
        }

        let questionKey;
        if (window.sol && window.sol.id) {
            questionKey = window.sol.id;
        } else if (window.sol) {
            // Fallback if no 'id' property: use type + prompt
            questionKey = JSON.stringify({
                type: window.sol.type,
                prompt: window.sol.prompt || ''
            });
        } else {
            questionKey = null;
        }

        if (questionKey !== currentQuestionId) {
            currentQuestionId = questionKey;
            hasLoggedForCurrent = false;
        }

        if (challengeType === 'error') {
            nextClickFunc();
        } else if (challengeType) {
            if (debug) document.getElementById("solveAllButton").innerText = challengeType;
            handleChallenge(challengeType);
            nextClickFunc();
        } else {
            nextClickFunc();
        }
    }



    function nextClickFunc() {
        setTimeout(function () {
            try {
                let nextButtonNormal = document.querySelector('[data-test="player-next"]');
                let storiesContinueButton = document.querySelector('[data-test="stories-player-continue"]');
                let storiesDoneButton = document.querySelector('[data-test="stories-player-done"]');

                let nextButtonAriaValueNormal = nextButtonNormal ? nextButtonNormal.getAttribute('aria-disabled') : null;
                let nextButtonAriaValueStoriesContinue = storiesContinueButton ? storiesContinueButton.disabled : null;

                let nextButton = nextButtonNormal || storiesContinueButton || storiesDoneButton;
                let nextButtonAriaValue = nextButtonAriaValueNormal || nextButtonAriaValueStoriesContinue || storiesDoneButton;

                if (nextButton) {
                    if (nextButtonAriaValue === 'true' || nextButtonAriaValue === true) {
                        requestAnimationFrame(() => {
                            if (document.querySelectorAll('._35QY2._3jIlr.f2zGP._18W4a.xtPuL').length > 0) {
                            } else {
                                if (nextButtonAriaValue === 'true') {
                                    //console.log('The next button is disabled.');
                                    logOnce(3, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                                }
                            }
                        });
                    } else if (nextButtonAriaValue === 'false' || nextButtonAriaValue === false) {
                        nextButton.click();
                        requestAnimationFrame(() => {
                            if (document.querySelector('[data-test="player-next"]').classList.contains('_2oGJR')) { // _1rcV8 _1VYyp _1ursp _7jW2t _3DbUj _2VWgj _3S8jJ
                                logOnce(1, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                                //mainSolveStatistics('question', 1);
                                if (isAutoMode) {
                                    setTimeout(function () {
                                        nextButton.click();
                                    }, 100);
                                }
                            } else if (document.querySelector('[data-test="player-next"]').classList.contains('_3S8jJ')) {
                                logOnce(2, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                                //if (solveSpeed < 0.6) {
                                //    solveSpeed = 0.6;
                                //    localStorage.setItem('duopro.autoSolveDelay', solveSpeed);
                                //}
                            } else {
                                console.log('The element does not have the class ._9C_ii or .NAidc or the element is not found.');
                            }
                        });
                    } else {
                        console.log('The aria-disabled attribute is not set or has an unexpected value.');
                        //notificationCall("what", "Idk");
                        nextButton.click();
                    }
                } else {
                    console.log('Element with data-test="player-next" or data-test="stories-player-continue" not found.');
                }
            } catch (error) { }
        }, 100);
    }


    function LhEqEHHc() {
        const randomImageValue = Math.random().toString(36).substring(2, 15);
        //questionErrorLogs(findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge, document.body.innerHTML, randomImageValue);
        //const challengeAssistElement = document.querySelector('[data-test="challenge challenge-assist"]');
        const challengeAssistElement = document.querySelector('._3x0ok');
        if (challengeAssistElement) {
        } else {
            console.log('Element not found');
        }
    }
    function determineChallengeType() {
        try {
            //console.log(window.sol);
            if (document.getElementsByClassName("FmlUF").length > 0) {
                // Story
                if (window.sol.type === "arrange") {
                    return "Story Arrange"
                } else if (window.sol.type === "multiple-choice" || window.sol.type === "select-phrases") {
                    return "Story Multiple Choice"
                } else if (window.sol.type === "point-to-phrase") {
                    return "Story Point to Phrase"
                } else if (window.sol.type === "match") {
                    return "Story Pairs"
                }
            } else {
                // Lesson
                if (document.querySelectorAll('[data-test*="challenge-speak"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Challenge Speak';
                } else if (document.querySelectorAll('[data-test*="challenge-name"]').length > 0 && document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Challenge Name';
                } else if (window.sol.type === 'listenMatch') {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Listen Match';
                } else if (document.querySelectorAll('[data-test="challenge challenge-listenSpeak"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Listen Speak';
                } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                        return 'Challenge Choice with Text Input';
                    } else {
                        return 'Challenge Choice'
                    }
                } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    if (window.sol.pairs !== undefined) {
                        return 'Pairs';
                    } else if (window.sol.correctTokens !== undefined) {
                        return 'Tokens Run';
                    } else if (window.sol.correctIndices !== undefined) {
                        return 'Indices Run';
                    }
                } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Fill in the Gap';
                } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Challenge Text Input';
                } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Partial Reverse';
                } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
                    hcwNIIOdaQqCZRDL = false;
                    return 'Challenge Translate Input';
                } else if (document.querySelectorAll('[data-test="session-complete-slide"]').length > 0) {
                    return 'Session Complete';
                } else if (document.querySelectorAll('[data-test="daily-quest-progress-slide"]').length > 0) {
                    return 'Daily Quest Progress';
                } else if (document.querySelectorAll('[data-test="streak-slide"]').length > 0) {
                    return 'Streak';
                } else if (document.querySelectorAll('[data-test="leaderboard-slide"]').length > 0) { // needs maintainance
                    return 'Leaderboard';
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log(error);
            return 'error';
        }
    }

    function handleChallenge(challengeType) {
        // Implement logic to handle different challenge types
        // This function should encapsulate the logic for each challenge type
        if (challengeType === 'Challenge Speak' || challengeType === 'Listen Match' || challengeType === 'Listen Speak') {
            const buttonSkip = document.querySelector('button[data-test="player-skip"]');
            buttonSkip?.click();
        } else if (challengeType === 'Challenge Choice' || challengeType === 'Challenge Choice with Text Input') {
            // Text input
            if (challengeType === 'Challenge Choice with Text Input') {
                let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0].split(/(?<=^\S+)\s/)[1] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
                let inputEvent = new Event('input', {
                    bubbles: true
                });

                elm.dispatchEvent(inputEvent);
            } else if (challengeType === 'Challenge Choice') {
                document.querySelectorAll("[data-test='challenge-choice']")[window.sol.correctIndex].click();
            }

        } else if (challengeType === 'Pairs') {
            let nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
            if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length === nl.length) {
                window.sol.pairs?.forEach((pair) => {
                    for (let i = 0; i < nl.length; i++) {
                        const nlInnerText = nl[i].querySelector('[data-test="challenge-tap-token-text"]').innerText.toLowerCase().trim();

                        try {
                            if (
                                (
                                    nlInnerText === pair.transliteration.toLowerCase().trim() ||
                                    nlInnerText === pair.character.toLowerCase().trim()
                                )
                                && !nl[i].disabled
                            ) {
                                nl[i].click()
                            }
                        } catch (TypeError) {
                            if (
                                (
                                    nlInnerText === pair.learningToken.toLowerCase().trim() ||
                                    nlInnerText === pair.fromToken.toLowerCase().trim()
                                )
                                && !nl[i].disabled
                            ) {
                                nl[i].click()
                            }
                        }
                    }
                })
            }

        } else if (challengeType === 'Story Pairs') {
            const nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
            const textElements = document.querySelectorAll('[data-test="challenge-tap-token-text"]');

            const textToElementMap = new Map();
            for (let i = 0; i < nl.length; i++) {
                const text = textElements[i].innerText.toLowerCase().trim();
                textToElementMap.set(text, nl[i]);
            }

            for (const key in window.sol.dictionary) {
                if (window.sol.dictionary.hasOwnProperty(key)) {
                    const value = window.sol.dictionary[key];
                    const keyPart = key.split(":")[1].toLowerCase().trim();
                    const normalizedValue = value.toLowerCase().trim();

                    const element1 = textToElementMap.get(keyPart);
                    const element2 = textToElementMap.get(normalizedValue);

                    if (element1 && !element1.disabled) element1.click();
                    if (element2 && !element2.disabled) element2.click();
                }
            }

        } else if (challengeType === 'Tokens Run') {
            correctTokensRun();

        } else if (challengeType === 'Indices Run') {
            correctIndicesRun();

        } else if (challengeType === 'Fill in the Gap') {
            correctIndicesRun();

        } else if (challengeType === 'Challenge Text Input') {
            let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0];
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : (window.sol.displayTokens ? window.sol.displayTokens.find(t => t.isBlank).text : window.sol.prompt));
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);

        } else if (challengeType === 'Partial Reverse') {
            let elm = document.querySelector('[data-test*="challenge-partialReverseTranslate"]')?.querySelector("span[contenteditable]");
            let nativeInputNodeTextSetter = Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set
            nativeInputNodeTextSetter.call(elm, window.sol?.displayTokens?.filter(t => t.isBlank)?.map(t => t.text)?.join()?.replaceAll(',', ''));
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);

        } else if (challengeType === 'Challenge Translate Input') {
            const elm = document.querySelector('textarea[data-test="challenge-translate-input"]');
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);

            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        } else if (challengeType === 'Challenge Name') {

            let articles = findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge.articles;
            let correctSolutions = findReact(document.getElementsByClassName(findReactMainElementClass)[0]).props.currentChallenge.correctSolutions[0];

            let matchingArticle = articles.find(article => correctSolutions.startsWith(article));
            let matchingIndex = matchingArticle !== undefined ? articles.indexOf(matchingArticle) : null;
            let remainingValue = correctSolutions.substring(matchingArticle.length);

            let selectedElement = document.querySelector(`[data-test="challenge-choice"]:nth-child(${matchingIndex + 1})`);
            if (selectedElement) {
                selectedElement.click();
            }

            let elm = document.querySelector('[data-test="challenge-text-input"]');
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(elm, remainingValue);
            let inputEvent = new Event('input', {
                bubbles: true
            });

            elm.dispatchEvent(inputEvent);
        } else if (challengeType === 'Session Complete') {
        } else if (challengeType === 'Story Arrange') {
            let choices = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
            for (let i = 0; i < window.sol.phraseOrder.length; i++) {
                choices[window.sol.phraseOrder[i]].click();
            }
        } else if (challengeType === 'Story Multiple Choice') {
            let choices = document.querySelectorAll('[data-test="stories-choice"]');
            choices[window.sol.correctAnswerIndex].click();
        } else if (challengeType === 'Story Point to Phrase') {
            let choices = document.querySelectorAll('[data-test="challenge-tap-token-text"]');
            var correctIndex = -1;
            for (let i = 0; i < window.sol.parts.length; i++) {
                if (window.sol.parts[i].selectable === true) {
                    correctIndex += 1;
                    if (window.sol.correctAnswerIndex === i) {
                        choices[correctIndex].parentElement.click();
                    }
                }
            }
        }
    }

    function correctTokensRun() {
        const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
        const correct_tokens = window.sol.correctTokens;
        const clicked_tokens = [];

        correct_tokens.forEach(correct_token => {
            const matching_elements = Array.from(all_tokens).filter(element => element.textContent.trim() === correct_token.trim());
            if (matching_elements.length > 0) {
                const match_index = clicked_tokens.filter(token => token.textContent.trim() === correct_token.trim()).length;
                if (match_index < matching_elements.length) {
                    matching_elements[match_index].click();
                    clicked_tokens.push(matching_elements[match_index]);
                } else {
                    clicked_tokens.push(matching_elements[0]);
                }
            }
        });
    }


    function correctIndicesRun() {
        if (window.sol.correctIndices) {
            window.sol.correctIndices?.forEach(index => {
                document.querySelectorAll('div[data-test="word-bank"] [data-test*="challenge-tap-token"]:not(span)')[index].click();
            });
        }
    }

    function findSubReact(dom, traverseUp = reactTraverseUp) {
        const key = Object.keys(dom).find(key => key.startsWith("__reactProps"));
        return dom?.[key]?.children?.props?.slide;
    }

    function findReact(dom, traverseUp = reactTraverseUp) {
        const key = Object.keys(dom).find(key => {
            return key.startsWith("__reactFiber$") // react 17+
                || key.startsWith("__reactInternalInstance$"); // react <17
        });
        const domFiber = dom[key];
        if (domFiber == null) return null;
        // react <16
        if (domFiber._currentElement) {
            let compFiber = domFiber._currentElement._owner;
            for (let i = 0; i < traverseUp; i++) {
                compFiber = compFiber._currentElement._owner;
            }
            return compFiber._instance;
        }
        // react 16+
        const GetCompFiber = fiber => {
            //return fiber._debugOwner; // this also works, but is __DEV__ only
            let parentFiber = fiber.return;
            while (typeof parentFiber.type == "string") {
                parentFiber = parentFiber.return;
            }
            return parentFiber;
        };
        let compFiber = GetCompFiber(domFiber);
        for (let i = 0; i < traverseUp; i++) {
            compFiber = GetCompFiber(compFiber);
        }
        return compFiber.stateNode;
    }

    window.findReact = findReact;
    window.findSubReact = findSubReact;
    window.ss = solving;
}

try {
    if (false) {
        if (storageLocal.languagePackVersion !== "00") {
            if (!storageLocal.languagePack.hasOwnProperty(systemLanguage)) systemLanguage = "en";
            systemText = storageLocal.languagePack;
            One();
        } else {
            systemLanguage = "en";
            One();
        }
    } else {
        systemLanguage = "en";
        One();
    }
} catch (error) {
    console.log(error);
    One();
}
