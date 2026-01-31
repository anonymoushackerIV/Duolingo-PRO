// ==UserScript==
// @name         Duolingo PRO
// @namespace    http://duolingopro.net
// @version      3.1BETA.04.1
// @description  The fastest Duolingo XP farmer, now with gems and free Duolingo Max, working as of February 2026.
// @author       anonymousHackerIV
// @match        *://*.duolingo.com/*
// @match        *://*.duolingo.cn/*
// @icon         https://www.duolingopro.net/static/favicons/duo/128/light/primary.png
// @grant        GM_log
// ==/UserScript==

const VERSION_NUMBER = "07";
const STORAGE_LOCAL_VERSION = "07";
const STORAGE_SESSION_VERSION = "07";
const VERSION_NAME = "BETA.04.1";
const VERSION_FULL = "3.1BETA.04.1";
const VERSION_FORMAL = "3.1 BETA.04.1";
let serverURL = "https://www.duolingopro.net";
let apiURL = "https://api.duolingopro.net";
let greasyfork = true;
let alpha = false;

let storageLocal;
let storageSession;

let hidden = false;
let pageHistory = [1];
let windowBlurState = true;
let multipleScriptsDetected = false;
let recentUpdateDetected = false;

let solvingLoopRunning = false;
let isAutoMode = false;
let findReactMainElementClass = '_3yE3H';
let reactTraverseUp = 1;

const debug = false;
const flag01 = false;
const flag02 = false;
const flag03 = false;
const flag04 = false;

// USAGE OR MODIFICATION OF THIS SCRIPT IMPLIES YOU AGREE TO THE TERMS AND CONDITIONS PRESENTED IN THE SCRIPT. IF YOU DO NOT AGREE, DO NOT USE OR MODIFY THIS SCRIPT.

const random16Numbers = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => (b % 10)).join('');
let duplicateDetectionMarker = document.createElement("div");
duplicateDetectionMarker.setAttribute(`data-duolingo-pro-duplicate-detection-marker`, String(VERSION_NUMBER));
duplicateDetectionMarker.setAttribute(`data-duolingo-pro-duplicate-detection-priority`, String(random16Numbers));
duplicateDetectionMarker.style.display = "none";
document.body.appendChild(duplicateDetectionMarker);

function duplicateCheck() {
    let allDuplicateDetectionMarkers = document.querySelectorAll('[data-duolingo-pro-duplicate-detection-marker]');
    let allDuplicateDetectionPriorities = document.querySelectorAll('[data-duolingo-pro-duplicate-detection-priority]');
    if (allDuplicateDetectionMarkers.length > 1) {
        const markerValues = Array.from(allDuplicateDetectionMarkers).map(el => Number(el.getAttribute("data-duolingo-pro-duplicate-detection-marker")));

        // 1. If any marker > VERSION_NUMBER, return
        if (markerValues.some(v => v > Number(VERSION_NUMBER))) return true;

        // 2. If any marker == VERSION_NUMBER, continue to priority check
        if (markerValues.find(v => v === Number(VERSION_NUMBER)) !== undefined) {
            const priorityValues = Array.from(allDuplicateDetectionPriorities).map(el => Number(el.getAttribute("data-duolingo-pro-duplicate-detection-priority")));

            // 1: If any priority > random16Numbers, return
            if (priorityValues.some(p => p > Number(random16Numbers))) return true;

            return false;
        }

        return false;
    }
}


let systemLanguage = document.cookie.split('; ').find(row => row.startsWith('lang=')).split('=')[1];
let systemText = {
    en: {
        1: "Switch to Legacy",
        2: "Show",
        3: "Connecting",
        4: "Donate",
        5: "Support",
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
        53: "Skip the grind and jump straight to the rewards with instant XP, gem gains, streak boosts, auto-solved lessons, and more.",
        54: "START",
        55: "Would you like to redeem an XP Boost?",
        56: "How many Streak Freezes would you like to get?",
        57: "How many days would you like to increase your Streak by?",
        58: "Would you like to refill your Hearts to full?",
        59: "Would you like to complete all your Quests?",
        60: "COMPLETE",
        61: "Pick 3.1 mode for faster, instant results powered by server-side processing, or Legacy mode to keep everything running on-client.",

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
        203: "You are using an outdated version of Duolingo PRO.<br><br>Please <a href='https://www.duolingopro.net/greasyfork' target='_blank' class='DLP_Link_Style_1'>update Duolingo PRO</a> or turn on automatic updates.",
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
        219: "You received {amount} XP. You can request up to {remainingXP} XP before your limit resets back to {totalLimit} XP in {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' class='DLP_Link_Style_1'>donate</a>.",
        220: "Super Duolingo Successfully Redeemed",
        221: "You redeemed a 3 day Super Duolingo trial. You can request another 3 day Super Duolingo trial in {timeMessage}.",
        222: "Limit Warning",
        223: "You can only request up to {limitAmount} XP before your limit resets back to {totalLimitAmount} XP in {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' class='DLP_Link_Style_1'>donate</a>.",
        224: "Limit Reached",
        225: "You reached your XP limit for the next {timeMessage}. To boost your limits, <a href='https://duolingopro.net/donate' target='_blank' class='DLP_Link_Style_1'>donate</a>.",
        227: "You already redeemed a 3 day Super Duolingo trial. You can request another 3 day Super Duolingo trial in {timeMessage}.",
        229: "REFILL",
        230: "GEMS testing",
        231: "Error Connecting",
        232: "Duolingo PRO was unable to connect to our servers. This may be because our servers are temporarily unavailable or you are using an outdated version. Check for <a href='https://status.duolingopro.net' target='_blank' class='DLP_Link_Style_1'>server status</a> or <a href='https://duolingopro.net/greasyfork' target='_blank' class='DLP_Link_Style_1'>updates</a>.",
        233: "Update Duolingo PRO",
        234: "You are using an outdated version of Duolingo PRO. Please <a href='https://www.duolingopro.net/greasyfork' target='_blank' class='DLP_Link_Style_1'>update Duolingo PRO</a>."
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
        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Switch_Legacy_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀱏</p>
            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue)); white-space: nowrap;">${systemText[systemLanguage][1]}</p>
        </div>
        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Hide_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); flex: none; backdrop-filter: blur(16px);">
            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀋮</p>
            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][2]}</p>
        </div>
    </div>
    <div class="DLP_Main_Box">
        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_1_ID" style="display: block;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8">
                    <div class="DLP_HStack_8">
                        <div id="DLP_Main_1_Server_Connection_Button_1_ID" class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" style="outline: 2px solid rgb(var(--color-eel), 0.20); outline-offset: -2px; background: rgb(var(--color-eel), 0.10); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1); padding: 10px 0px 10px 10px;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel)); animation: 4s ease-in-out 0s infinite normal none running DLP_Rotate_360_Animation_1;">􀓞</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--color-eel));">${systemText[systemLanguage][3]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_Donate_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="17" height="19" viewBox="0 0 17 19" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 5.90755C16.4968 3.60922 14.6997 1.72555 12.5913 1.04588C9.97298 0.201877 6.51973 0.324211 4.01956 1.49921C0.989301 2.92355 0.0373889 6.04355 0.00191597 9.15522C-0.0271986 11.7136 0.229143 18.4517 4.04482 18.4997C6.87998 18.5356 7.30214 14.8967 8.61397 13.1442C9.5473 11.8974 10.749 11.5452 12.2284 11.1806C14.7709 10.5537 16.5037 8.55506 16.5 5.90755Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">${systemText[systemLanguage][4]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_Feedback_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􂄺</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][5]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_Settings_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀍟</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][6]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_Earn_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀋦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">Boost</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_YouTube_Button_1_ID" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-pink));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2043 1.0885C20.1084 1.33051 20.8189 2.041 21.0609 2.9451C21.4982 4.58216 21.5 7.99976 21.5 7.99976C21.5 7.99976 21.5 11.4174 21.0609 13.0544C20.8189 13.9585 20.1084 14.669 19.2043 14.911C17.5673 15.3501 11 15.3501 11 15.3501C11 15.3501 4.43274 15.3501 2.79568 14.911C1.89159 14.669 1.1811 13.9585 0.939084 13.0544C0.5 11.4174 0.5 7.99976 0.5 7.99976C0.5 7.99976 0.5 4.58216 0.939084 2.9451C1.1811 2.041 1.89159 1.33051 2.79568 1.0885C4.43274 0.649414 11 0.649414 11 0.649414C11 0.649414 17.5673 0.649414 19.2043 1.0885ZM14.3541 8.00005L8.89834 11.1497V4.85038L14.3541 8.00005Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_Discord_Button_1_ID" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-indigo));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.289 1.34C16.9296 0.714 15.4761 0.259052 13.9565 0C13.7699 0.332095 13.5519 0.77877 13.4016 1.1341C11.7862 0.894993 10.1857 0.894993 8.60001 1.1341C8.44972 0.77877 8.22674 0.332095 8.03844 0C6.51721 0.259052 5.06204 0.715671 3.70267 1.34331C0.960812 5.42136 0.21754 9.39811 0.589177 13.3184C2.40772 14.655 4.17011 15.467 5.90275 15.9984C6.33055 15.4189 6.71209 14.8028 7.04078 14.1536C6.41478 13.9195 5.81521 13.6306 5.24869 13.2952C5.39898 13.1856 5.546 13.071 5.68803 12.9531C9.14342 14.5438 12.8978 14.5438 16.3119 12.9531C16.4556 13.071 16.6026 13.1856 16.7512 13.2952C16.183 13.6322 15.5818 13.9211 14.9558 14.1553C15.2845 14.8028 15.6644 15.4205 16.0939 16C17.8282 15.4687 19.5922 14.6567 21.4107 13.3184C21.8468 8.77378 20.6658 4.83355 18.289 1.34ZM7.51153 10.9075C6.47426 10.9075 5.62361 9.95435 5.62361 8.7937C5.62361 7.63305 6.45609 6.67831 7.51153 6.67831C8.56699 6.67831 9.41761 7.63138 9.39945 8.7937C9.40109 9.95435 8.56699 10.9075 7.51153 10.9075ZM14.4884 10.9075C13.4511 10.9075 12.6005 9.95435 12.6005 8.7937C12.6005 7.63305 13.4329 6.67831 14.4884 6.67831C15.5438 6.67831 16.3945 7.63138 16.3763 8.7937C16.3763 9.95435 15.5438 10.9075 14.4884 10.9075Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_GitHub_Button_1_ID" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(255, 255, 255, 0.20); outline-offset: -2px; background: #333333;">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0087 0.5C5.19766 0.5 0.5 5.3125 0.5 11.2662C0.5 16.0253 3.50995 20.0538 7.68555 21.4797C8.2076 21.5868 8.39883 21.248 8.39883 20.963C8.39883 20.7134 8.38162 19.8578 8.38162 18.9664C5.45836 19.6082 4.84962 17.683 4.84962 17.683C4.37983 16.4353 3.68375 16.1146 3.68375 16.1146C2.72697 15.4551 3.75345 15.4551 3.75345 15.4551C4.81477 15.5264 5.37167 16.5602 5.37167 16.5602C6.31103 18.1999 7.82472 17.7366 8.43368 17.4514C8.52058 16.7562 8.79914 16.2749 9.09491 16.0076C6.7634 15.758 4.31035 14.8312 4.31035 10.6957C4.31035 9.51928 4.72765 8.55678 5.38888 7.80822C5.28456 7.54091 4.9191 6.43556 5.49342 4.95616C5.49342 4.95616 6.38073 4.67091 8.38141 6.06128C9.23797 5.82561 10.1213 5.70573 11.0087 5.70472C11.896 5.70472 12.8005 5.82963 13.6358 6.06128C15.6367 4.67091 16.524 4.95616 16.524 4.95616C17.0983 6.43556 16.7326 7.54091 16.6283 7.80822C17.3069 8.55678 17.707 9.51928 17.707 10.6957C17.707 14.8312 15.254 15.7401 12.905 16.0076C13.2879 16.3463 13.6183 16.9878 13.6183 18.0039C13.6183 19.4477 13.6011 20.6064 13.6011 20.9627C13.6011 21.248 13.7926 21.5868 14.3144 21.4799C18.49 20.0536 21.5 16.0253 21.5 11.2662C21.5172 5.3125 16.8023 0.5 11.0087 0.5Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_Auto_Top">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2 DLP_NoSelect">Duolingo</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="margin-top: 2px; font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <p id="DLP_Main_Warning_1_ID" class="DLP_Text_Style_1" style="transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); text-align: center; opacity: 0.5; display: none;"></p>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID" style="opacity: 0.5; pointer-events: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    <div class="DLP_VStack_8" id="DLP_Get_XP_1_ID" style="flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][8]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_GEM_1_ID" style="flex: 1 0 0; align-self: stretch;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][10]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active" style="position: relative; overflow: hidden;">
                                <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; pointer-events: none; transform: translateX(-150px); animation: slideRight 4s ease-in-out forwards infinite; animation-delay: 2s;">
                                    <path opacity="0.5" d="M72 0H96L72 48H48L72 0Z" fill="rgb(var(--DLP-blue))"/>
                                    <path opacity="0.5" d="M24 0H60L36 48H0L24 0Z" fill="rgb(var(--DLP-blue))"/>
                                    <path opacity="0.5" d="M108 0H120L96 48H84L108 0Z" fill="rgb(var(--DLP-blue))"/>
                                </svg>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Badge_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">Which monthly badge would you like to get?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀉉</p>
                                <div class="DLP_HStack_2">
                                    <input type="text" placeholder="11" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5); font-feature-settings: "case" 1, "cpsp" 1;">/</p>
                                    <input type="text" placeholder="2025" id="DLP_Inset_Input_2_ID" class="DLP_Input_Input_Style_1">
                                </div>
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_SUPER_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][12]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_DOUBLE_XP_BOOST_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][55]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_Freeze_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][56]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][57]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Heart_Refill_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][58]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][229]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Quest_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][59]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][60]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Local_Duolingo_Max_1_ID">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">Would you like to enable on-client Duolingo Max?</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">ENABLE IN SETTINGS</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_See_More_1_Button_1_ID" style="outline: rgba(var(--DLP-blue), 0.2) solid 2px; outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px); transform: translate(0px, 0px) scale(1); align-self: stretch; justify-content: space-between;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][15]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀯻</p>
                    </div>
                </div>
                <div class="DLP_HStack_Auto" style="padding-top: 4px;">
                    <div class="DLP_HStack_4 DLP_Magnetic_Hover_1" id="DLP_Main_Terms_1_Button_1_ID" style="align-items: center;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">${systemText[systemLanguage][14]}</p>
                    </div>
                    <div class="DLP_HStack_4 DLP_Magnetic_Hover_1" id="DLP_Main_Whats_New_1_Button_1_ID" style="align-items: center;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][7]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_2_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top">
                    <div class="DLP_HStack_4 DLP_Hover_1" id="DLP_Universal_Back_1_Button_1_ID">
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="font-size: 20px;">􀯶</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect">Duolingo</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <div id="DLP_Main_Inputs_1_Divider_1_ID" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    <div class="DLP_VStack_8" id="DLP_Get_XP_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][8]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_GEM_2_ID" style="flex: 1 0 0; align-self: stretch;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][10]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active" style="position: relative; overflow: hidden;">
                                <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; pointer-events: none; transform: translateX(-150px); animation: slideRight 4s ease-in-out forwards infinite; animation-delay: 2s;">
                                    <path opacity="0.5" d="M72 0H96L72 48H48L72 0Z" fill="rgb(var(--DLP-blue))"/>
                                    <path opacity="0.5" d="M24 0H60L36 48H0L24 0Z" fill="rgb(var(--DLP-blue))"/>
                                    <path opacity="0.5" d="M108 0H120L96 48H84L108 0Z" fill="rgb(var(--DLP-blue))"/>
                                </svg>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][57]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Streak_Freeze_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][56]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Badge_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">Which monthly badge would you like to get?</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">􀉉</p>
                                <div class="DLP_HStack_2">
                                    <input type="text" placeholder="11" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5); font-feature-settings: "case" 1, "cpsp" 1;">/</p>
                                    <input type="text" placeholder="2025" id="DLP_Inset_Input_2_ID" class="DLP_Input_Input_Style_1">
                                </div>
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][9]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_DOUBLE_XP_BOOST_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][55]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Heart_Refill_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][58]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][229]}</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Quest_2_ID" style="flex: 1 0 0; display: none;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][59]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][60]}</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_Local_Duolingo_Max_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">Would you like to enable on-client Duolingo Max?</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">ENABLE IN SETTINGS</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_SUPER_2_ID" style="flex: 1 0 0;">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][12]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="flex: 1 0 0;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][13]}</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_3_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8">
                    <div class="DLP_HStack_8">
                        <div id="DLP_Secondary_1_Server_Connection_Button_1_ID" class="DLP_Button_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect" style="outline: 2px solid rgb(var(--color-eel), 0.20); outline-offset: -2px; background: rgb(var(--color-eel), 0.10); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.32, 1), background 0.8s cubic-bezier(0.16, 1, 0.32, 1), outline 0.8s cubic-bezier(0.16, 1, 0.32, 1), filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1); padding: 10px 0px 10px 10px; opacity: 0.25; pointer-events: none;">
                            <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue)); animation: 4s ease-in-out 0s infinite normal none running DLP_Rotate_360_Animation_1;">􀓞</p>
                            <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="color: #000; transition: 0.4s;">${systemText[systemLanguage][3]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_Donate_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <svg width="17" height="19" viewBox="0 0 17 19" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 5.90755C16.4968 3.60922 14.6997 1.72555 12.5913 1.04588C9.97298 0.201877 6.51973 0.324211 4.01956 1.49921C0.989301 2.92355 0.0373889 6.04355 0.00191597 9.15522C-0.0271986 11.7136 0.229143 18.4517 4.04482 18.4997C6.87998 18.5356 7.30214 14.8967 8.61397 13.1442C9.5473 11.8974 10.749 11.5452 12.2284 11.1806C14.7709 10.5537 16.5037 8.55506 16.5 5.90755Z"/>
                            </svg>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">${systemText[systemLanguage][4]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_Feedback_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􂄺</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][5]}</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_Settings_1_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀍟</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][6]}</p>
                        </div>
                    </div>
                    <div class="DLP_HStack_8">
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Main_Earn_Button_1_ID" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; padding: 10px 0px 10px 10px;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀋦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">Boost</p>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_YouTube_Button_1_ID" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-pink));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2043 1.0885C20.1084 1.33051 20.8189 2.041 21.0609 2.9451C21.4982 4.58216 21.5 7.99976 21.5 7.99976C21.5 7.99976 21.5 11.4174 21.0609 13.0544C20.8189 13.9585 20.1084 14.669 19.2043 14.911C17.5673 15.3501 11 15.3501 11 15.3501C11 15.3501 4.43274 15.3501 2.79568 14.911C1.89159 14.669 1.1811 13.9585 0.939084 13.0544C0.5 11.4174 0.5 7.99976 0.5 7.99976C0.5 7.99976 0.5 4.58216 0.939084 2.9451C1.1811 2.041 1.89159 1.33051 2.79568 1.0885C4.43274 0.649414 11 0.649414 11 0.649414C11 0.649414 17.5673 0.649414 19.2043 1.0885ZM14.3541 8.00005L8.89834 11.1497V4.85038L14.3541 8.00005Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_Discord_Button_1_ID" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-indigo));">
                            <svg width="22" height="16" viewBox="0 0 22 16" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.289 1.34C16.9296 0.714 15.4761 0.259052 13.9565 0C13.7699 0.332095 13.5519 0.77877 13.4016 1.1341C11.7862 0.894993 10.1857 0.894993 8.60001 1.1341C8.44972 0.77877 8.22674 0.332095 8.03844 0C6.51721 0.259052 5.06204 0.715671 3.70267 1.34331C0.960812 5.42136 0.21754 9.39811 0.589177 13.3184C2.40772 14.655 4.17011 15.467 5.90275 15.9984C6.33055 15.4189 6.71209 14.8028 7.04078 14.1536C6.41478 13.9195 5.81521 13.6306 5.24869 13.2952C5.39898 13.1856 5.546 13.071 5.68803 12.9531C9.14342 14.5438 12.8978 14.5438 16.3119 12.9531C16.4556 13.071 16.6026 13.1856 16.7512 13.2952C16.183 13.6322 15.5818 13.9211 14.9558 14.1553C15.2845 14.8028 15.6644 15.4205 16.0939 16C17.8282 15.4687 19.5922 14.6567 21.4107 13.3184C21.8468 8.77378 20.6658 4.83355 18.289 1.34ZM7.51153 10.9075C6.47426 10.9075 5.62361 9.95435 5.62361 8.7937C5.62361 7.63305 6.45609 6.67831 7.51153 6.67831C8.56699 6.67831 9.41761 7.63138 9.39945 8.7937C9.40109 9.95435 8.56699 10.9075 7.51153 10.9075ZM14.4884 10.9075C13.4511 10.9075 12.6005 9.95435 12.6005 8.7937C12.6005 7.63305 13.4329 6.67831 14.4884 6.67831C15.5438 6.67831 16.3945 7.63138 16.3763 8.7937C16.3763 9.95435 15.5438 10.9075 14.4884 10.9075Z"/>
                            </svg>
                        </div>
                        <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_GitHub_Button_1_ID" style="justify-content: center; flex: none; width: 40px; padding: 10px; outline: 2px solid rgba(255, 255, 255, 0.20); outline-offset: -2px; background: #333333;">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="#FFF" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.0087 0.5C5.19766 0.5 0.5 5.3125 0.5 11.2662C0.5 16.0253 3.50995 20.0538 7.68555 21.4797C8.2076 21.5868 8.39883 21.248 8.39883 20.963C8.39883 20.7134 8.38162 19.8578 8.38162 18.9664C5.45836 19.6082 4.84962 17.683 4.84962 17.683C4.37983 16.4353 3.68375 16.1146 3.68375 16.1146C2.72697 15.4551 3.75345 15.4551 3.75345 15.4551C4.81477 15.5264 5.37167 16.5602 5.37167 16.5602C6.31103 18.1999 7.82472 17.7366 8.43368 17.4514C8.52058 16.7562 8.79914 16.2749 9.09491 16.0076C6.7634 15.758 4.31035 14.8312 4.31035 10.6957C4.31035 9.51928 4.72765 8.55678 5.38888 7.80822C5.28456 7.54091 4.9191 6.43556 5.49342 4.95616C5.49342 4.95616 6.38073 4.67091 8.38141 6.06128C9.23797 5.82561 10.1213 5.70573 11.0087 5.70472C11.896 5.70472 12.8005 5.82963 13.6358 6.06128C15.6367 4.67091 16.524 4.95616 16.524 4.95616C17.0983 6.43556 16.7326 7.54091 16.6283 7.80822C17.3069 8.55678 17.707 9.51928 17.707 10.6957C17.707 14.8312 15.254 15.7401 12.905 16.0076C13.2879 16.3463 13.6183 16.9878 13.6183 18.0039C13.6183 19.4477 13.6011 20.6064 13.6011 20.9627C13.6011 21.248 13.7926 21.5868 14.3144 21.4799C18.49 20.0536 21.5 16.0253 21.5 11.2662C21.5172 5.3125 16.8023 0.5 11.0087 0.5Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_Auto_Top">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2 DLP_NoSelect">Duolingo</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO LE</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">You are using an outdated version of Duolingo PRO. <br><br>Please update Duolingo PRO or turn on automatic updates. </p>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">Duolingo PRO failed to connect. This might be happening because of an issue on our system or your device. <br><br>Try updating Duolingo PRO. If the issue persists afterwards, join our Discord Server to get support. </p>
                <p class="DLP_Text_Style_1" style="display: none; transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); opacity: 0; filter: blur(4px);">We are currently unable to receive new requests due to high demand. Join our Discord Server to learn more. <br><br>You can help us handle more demand by donating on Patreon while getting exclusive features and higher limits. </p>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_2_Divider_1_ID">
                    <div class="DLP_VStack_8" id="DLP_Get_PATH_1_ID">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][17]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_PRACTICE_1_ID">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][19]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LISTEN_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][21]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LESSON_1_ID" style="display: none;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][23]}</p>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">􀆃</p>
                                <div style="display: flex; align-items: center; gap: 8px; width: 100%; justify-content: flex-end;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">Unit:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_3_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">Lesson:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_4_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                </div>
                            </div>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_Button_Style_1 DLP_Magnetic_Hover_1" id="DLP_Secondary_See_More_1_Button_1_ID" style="outline: rgba(var(--DLP-blue), 0.2) solid 2px; outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px); transform: translate(0px, 0px) scale(1); align-self: stretch; justify-content: space-between;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][15]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀯻</p>
                    </div>
                    <div class="DLP_HStack_Auto" style="padding-top: 4px;">
                        <div class="DLP_HStack_4 DLP_Magnetic_Hover_1" id="DLP_Secondary_Terms_1_Button_1_ID" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">${systemText[systemLanguage][14]}</p>
                        </div>
                        <div class="DLP_HStack_4 DLP_Magnetic_Hover_1" id="DLP_Secondary_Whats_New_1_Button_1_ID" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][7]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_4_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top">
                    <div class="DLP_HStack_4 DLP_Hover_1" id="DLP_Universal_Back_1_Button_1_ID">
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="font-size: 20px;">􀯶</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect">Duolingo</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO LE</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Main_Inputs_1_Divider_1_ID">
                    <div class="DLP_VStack_8" id="DLP_Get_PATH_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][17]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_PRACTICE_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][19]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LISTEN_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][21]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                    <div class="DLP_VStack_8" id="DLP_Get_LESSON_2_ID">
                        <div class="DLP_HStack_8" style="align-items: center;">
                            <p class="DLP_Text_Style_1 DLP_Magnetic_Hover_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgba(var(--color-eel), 0.50);">􀎦</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][23]}</p>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Style_1_Active">
                                <div style="display: flex; align-items: center; gap: 8px; width: 100%; justify-content: flex-end;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">Unit:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_3_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgba(var(--DLP-blue), 0.5);">Lesson:</p>
                                    <input type="text" value="1" placeholder="1" id="DLP_Inset_Input_4_ID" class="DLP_Input_Input_Style_1" style="width: 30px;">
                                </div>
                            </div>
                        </div>
                        <div class="DLP_HStack_8">
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px; padding: 0;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀆃</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1">
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][18]}</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_5_ID" style="display: none;">
            <div class="DLP_VStack_8" style="height: 640px; max-height: 80vh;">
                <div class="DLP_HStack_Auto_Top">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2 DLP_NoSelect">Duolingo</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" id="DLP_Terms_1_Text_1_ID">${systemText[systemLanguage][25]}</p>
                <p class="DLP_Text_Style_1 DLP_NoSelect" id="DLP_Terms_1_Text_2_ID" style="display: none; align-self: stretch;">${systemText[systemLanguage][26]}</p>
                <div class="DLP_Scroll_Box_Style_1">
                    <p id="DLP_Terms_Main_Text_1_ID" class="DLP_Scroll_Box_Text_Style_1">${systemText[systemLanguage][27]}</p>
                </div>
                <div class="DLP_HStack_8" id="DLP_Terms_1_Button_1_ID">
                    <div id="DLP_Terms_Decline_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀆄</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][28]}</p>
                    </div>
                    <div id="DLP_Terms_Accept_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">${systemText[systemLanguage][29]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀰫</p>
                    </div>
                </div>
                <div class="DLP_HStack_8" id="DLP_Terms_1_Button_2_ID" style="display: none;">
                    <div class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" id="DLP_Terms_Back_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀯶</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][29]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_6_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_2 DLP_NoSelect">Duolingo</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect">${systemText[systemLanguage][30]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Terms_Declined_Back_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀯶</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">${systemText[systemLanguage][31]}</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_7_ID" style="display: none;">
            <div class="DLP_VStack_8" style="max-height: 80vh;">
                <div class="DLP_HStack_Auto_Top">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][32]}</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <div style="overflow-y: auto; margin: 0 -16px; padding: 0 16px;">
                    <div class="DLP_VStack_8">
                        <div id="DLP_Settings_Show_Solve_Buttons_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Show Solve Buttons</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">In lessons and practices, see the solve and solve all buttons.</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Show_AutoServer_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;${alpha ? '' : ' display: none;'}">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Show AutoServer Button</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">See the AutoServer by Duolingo PRO button in your Duolingo menubar.</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Random Legacy Solve Speed</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">Legacy will wait a random amount of seconds before solving.</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Legacy_Solve_Speed_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Custom Random Legacy Solve Speed</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">Legacy will wait a random amount of seconds in between these two numbers before solving.</p>
                            </div>
                            <div class="DLP_Input_Style_1_Active" style="flex: none; width: 112px;">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_1_ID" class="DLP_Input_Input_Style_1" style="text-align: center;">
                                <input type="text" placeholder="0" id="DLP_Inset_Input_2_ID" class="DLP_Input_Input_Style_1" style="text-align: center;">
                            </div>
                        </div>
                        <div id="DLP_Settings_Help_Us_Make_Better_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Help Us Make Duolingo PRO Better</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">Allow Duolingo PRO to collect anonymous usage data for us to improve the script.</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1" style="${alpha ? 'opacity: 0.5; pointer-events: none; cursor: not-allowed;' : ''}">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Reduce_Effects_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Reduce Processing Intensive Effects</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">Reduce processing intensive effects by disabling confetti, starfield and other visual animations.</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Free_Local_Super_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Free On-Client Duolingo Max</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">Skip the worry of running out of hearts, get free entry to legendary challenges, access to personalized practice, and learn without ads. Only works on-client.</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Show_Super_Trial_Button_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">Show Super Duolingo Trial Function</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">This function rarely works and is currently being deprecated. We recommend you to use Free Duolingo Max instead.</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Auto_Update_Toggle_1_ID" class="DLP_HStack_8" style="justify-content: center; align-items: center; opacity: 0.5; pointer-events: none; cursor: not-allowed; display: none;">
                            <div class="DLP_VStack_0" style="align-items: flex-start; flex: 1 0 0;">
                                <p class="DLP_Text_Style_1">${systemText[systemLanguage][34]}</p>
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--color-wolf), 0.4);">${systemText[systemLanguage][35]}</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Modern_Stats_Main_Box_1_ID" class="DLP_VStack_6" style="background: rgba(var(--DLP-blue), 0.10); outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; padding: 16px; border-radius: 8px;">
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">3.1 Stats</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">XP Gained:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Gems Gained:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Streak Gained:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Heart Refills Requested:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Streak Freezes Requested:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Double XP Boosts Requested:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Quest Completes Requested:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                        </div>
                        <div id="DLP_Settings_Legacy_Stats_Main_Box_1_ID" class="DLP_VStack_6" style="background: rgba(var(--DLP-blue), 0.10); outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; padding: 16px; border-radius: 8px;">
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgb(var(--DLP-blue));">Legacy Mode Stats</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Lessons Solved:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                            <div style="display: flex; align-self: stretch; justify-content: space-between; align-items: center;">
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);">Questions Solved:</p>
                                <p class="DLP_Text_Style_1" style="color: rgba(var(--DLP-blue), 0.5);"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="DLP_HStack_8">
                    <div id="DLP_Settings_Save_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][37]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀁣</p>
                    </div>
                </div>
            </div>
        </div>


        <div clas="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_8_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][38]}</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <div class="DLP_VStack_4" style="padding: 16px; border-radius: 8px; outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); box-sizing: border-box;">
                    <div class="DLP_HStack_4">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀁝</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgb(var(--DLP-blue));">Need Support?</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgba(var(--DLP-blue), 0.5);">Get help from our <a href='https://www.duolingopro.net/faq' target='_blank' class='DLP_Link_Style_1'>FAQ page</a>, enhanced with AI, or join our <a href='https://www.duolingopro.net/discord' target='_blank' class='DLP_Link_Style_1'>Discord server</a> and talk with the devs.</p>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][39]}</p>
                <textarea id="DLP_Feedback_Text_Input_1_ID" class="DLP_Large_Input_Box_Style_1" style="height: 128px; max-height: 256px;" placeholder="${systemText[systemLanguage][40]}"/></textarea>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][41]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Type_Bug_Report_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_Feedback_Type_Button_Style_1_OFF" style="transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="transition: 0.4s;">􀌛</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="transition: 0.4s;">${systemText[systemLanguage][42]}</p>
                    </div>
                    <div id="DLP_Feedback_Type_Suggestion_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1 DLP_Feedback_Type_Button_Style_2_ON" style="transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="transition: 0.4s;">􁷙</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="transition: 0.4s;">${systemText[systemLanguage][43]}</p>
                    </div>
                </div>
                <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch;">${systemText[systemLanguage][44]}</p>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Attachment_Upload_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); transition: background 0.4s, outline 0.4s, filter 0.4s cubic-bezier(0.16, 1, 0.32, 1), transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue)); transition: 0.4s;">${systemText[systemLanguage][45]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">􀅼</p>
                    </div>
                </div>
                <input type="file" accept="image/png, image/jpg, image/jpeg, video/mp4, image/gif, video/mov, video/webm" id="DLP_Feedback_Attachment_Input_Hidden_1_ID" style="display: none;"/>
                <div class="DLP_HStack_8">
                    <div id="DLP_Feedback_Send_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">${systemText[systemLanguage][47]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀰫</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_9_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top">
                    <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: none;">${systemText[systemLanguage][48]}</p>
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][48]}</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Release_Notes_List_1_ID" style="height: 256px;"></div>
                <div class="DLP_HStack_8" id="DLP_Release_Notes_Controls_1_ID">
                    <div class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">􀯶</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">PREVIOUS</p>
                    </div>
                    <div class="DLP_Button_Style_2" id="DLP_Inset_Label_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px); flex: 0; padding: 0 16px;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue)); font-variant: tabular-nums;"></p>
                    </div>
                    <div class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="outline: rgba(0, 0, 0, 0.2) solid 2px; outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">NEXT</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀯻</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_10_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_VStack_8" style="padding: 8px 0; max-width: 312px; align-self: center;">
                    <div class="DLP_VStack_0">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][52]}</p>
                        <div class="DLP_HStack_4" style="align-self: auto;">
                            <p class="DLP_Text_Style_2 DLP_NoSelect">Duolingo</p>
                            <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">PRO 3.1</p>
                        </div>
                    </div>
                    <p class="DLP_Text_Style_1" style="align-self: stretch; text-align: center;">${systemText[systemLanguage][53]}</p>
                    <p class="DLP_Text_Style_1" style="align-self: stretch; text-align: center;">${systemText[systemLanguage][61]}</p>
                </div>
                <div class="DLP_HStack_8">
                    <div id="DLP_Onboarding_Start_Button_1_ID" class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" style="outline: 2px solid rgba(0, 0, 0, 0.20); outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">${systemText[systemLanguage][54]}</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀰫</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_11_ID" style="display: none;">
            <div class="DLP_VStack_8" style="height: 640px; max-height: 80vh;">
                <div class="DLP_HStack_Auto_Top">
                    <div id="DLP_Universal_Back_1_Button_1_ID" class="DLP_HStack_4 DLP_Hover_1">
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="font-size: 20px; background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀯶</p>
                        <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Support</p>
                    </div>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>

                <div class="DLP_VStack_8" style="height: 100%;">
                    <div id="DLP_Inset_Card_1" style="display: flex; padding: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; align-self: stretch; border-radius: 8px; outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                        <div class="DLP_HStack_6">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀅵</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); flex: 1 0 0;">Response Times</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀯻</p>
                        </div>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgba(var(--DLP-blue), 0.8); display: none; opacity: 0; filter: blur(4px); height: 0px; transition: 0.4s cubic-bezier(0.16, 1, 0.32, 1);">It may take a few hours for a developer to respond to you. You will be notified in Duolingo PRO when there's a reply.</p>
                    </div>

                    <div class="DLP_Chat_Box_1_ID_1" style="display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1 0 0; align-self: stretch; overflow-y: auto; margin: 0 -16px; padding: 0 16px; display: none;">

                    </div>

                    <div class="DLP_VStack_8" id="DLP_Inset_Group_3" style="padding: 0px 32px; flex: 1 0 0;">
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="background: url(https://www.duolingopro.net/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 24px;">􀘲</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; text-align: center;">Send a message to start talking with a support member.</p>
                    </div>

                    <div class="DLP_VStack_8" id="DLP_Inset_Group_2" style="display: none;">
                        <div id="DLP_Inset_Card_2" style="display: flex; padding: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; align-self: stretch; border-radius: 8px; outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: rgba(var(--DLP-blue), 0.10); overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.32, 1);">
                            <div class="DLP_HStack_6">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀿌</p>
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue)); flex: 1 0 0;">This chat was closed.</p>
                            </div>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="align-self: stretch; color: rgba(var(--DLP-blue), 0.5);">We hope to have solved your issue. If not, you can start a new chat.</p>
                        </div>

                        <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_3_ID" style="width: 100%;">
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
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1 DLP_Hide_Scrollbar" id="DLP_Inset_Button_1_ID" style="width: 48px; background: rgba(var(--DLP-blue), 0.10); outline-offset: -2px; outline: 2px solid rgba(var(--DLP-blue), 0.20);">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: rgb(var(--DLP-blue));">􀉢</p>
                                <input type="file" id="DLP_Attachment_Input_1" accept="image/*, video/*" multiple style="display: none;">
                            </div>
                            <div class="DLP_Input_Style_1_Active" style="padding: 0;">
                                <textarea type="text" placeholder="Type here..." id="DLP_Inset_Input_1_ID" class="DLP_Input_Style_1 DLP_Hide_Scrollbar" style="padding: 16px; box-sizing: content-box; overflow: scroll;"></textarea>
                            </div>
                            <div class="DLP_Input_Button_Style_1_Active DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="width: 48px;">
                                <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: #FFF;">􀰫</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div class="DLP_Main_Box_Divider" id="DLP_Main_Box_Divider_12_ID" style="display: none;">
            <div class="DLP_VStack_8">
                <div class="DLP_HStack_Auto_Top">
                    <p class="DLP_Text_Style_2 DLP_NoSelect" style="background: url(${serverURL}/static/images/flow/primary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${systemText[systemLanguage][32]}</p>
                    <p class="DLP_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
                </div>
                <div class="DLP_VStack_8" id="DLP_Onboarding_Setup_List_1_ID" style="height: 256px;">
                    <div id="setting-0" style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; align-self: stretch; transition: filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                        <div class="DLP_HStack_12">
                            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px; flex: 1 0 0;">
                                <img height="28" src="https://d35aaqx5ub95lt.cloudfront.net/images/max/928d0b52c29baf3b499d937c0ef85d06.svg" style="margin: 4px 0;" class="DLP_NoSelect">
                                <p class="DLP_Text_Style_2" style="align-self: stretch;">Duolingo Max</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(255, 255, 255);">􀁣</p>
                            </div>
                        </div>
                        <p class="DLP_Text_Style_1">Skip the worry of running out of hearts, get free entry to legendary challenges, access to personalized practice, and learn without ads. Do not turn on if you already have Super Duolingo or Max.</p>
                    </div>
                    <div id="setting-1" style="display: none; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; align-self: stretch; transition: filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                        <div class="DLP_HStack_12">
                            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px; flex: 1 0 0;">
                                <p class="DLP_Text_Style_2 DLP_NoSelect" style="font-size: 32px; background: url(https://www.duolingopro.net/static/images/flow/primary/512/light.png) lightgray 0% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">􀣉</p>
                                <p class="DLP_Text_Style_2" style="align-self: stretch;">Help Improve Duolingo PRO</p>
                            </div>
                            <div id="DLP_Inset_Toggle_1_ID" class="DLP_Toggle_Style_1 DLP_Hover_1" style="${alpha ? 'opacity: 0.5; pointer-events: none; cursor: not-allowed;' : ''}">
                                <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(255, 255, 255);">􀁣</p>
                            </div>
                        </div>
                        <p class="DLP_Text_Style_1">Allow Duolingo PRO to automatically send anonymous bug reports and usage data to help us improve the script.</p>
                    </div>
                </div>
                <div class="DLP_HStack_8" id="DLP_Onboarding_Setup_Controls_1_ID">
                    <div class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" id="DLP_Inset_Button_1_ID" style="outline: 2px solid rgba(var(--DLP-blue), 0.20); outline-offset: -2px; background: linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80); backdrop-filter: blur(16px);">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--DLP-blue));">􀯶</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--DLP-blue));">PREVIOUS</p>
                    </div>
                    <div class="DLP_Button_Style_2 DLP_Magnetic_Hover_1" id="DLP_Inset_Button_2_ID" style="outline: rgba(0, 0, 0, 0.2) solid 2px; outline-offset: -2px; background: rgb(var(--DLP-blue));">
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: #FFF;">NEXT</p>
                        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: #FFF;">􀯻</p>
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

    color: rgb(var(--color-wolf), 0.8);

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
.DLP_Link_Style_1 {
    font-family: "Duolingo PRO Rounded";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    text-decoration: underline;
    color: rgb(var(--DLP-blue));

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
.DLP_HStack_2 {
    display: flex;
    align-items: center;
    gap: 2px;
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
.DLP_HStack_12 {
    display: flex;
    align-items: center;
    gap: 12px;
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
.DLP_VStack_2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2px;
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
    padding: 0;
    margin: 0;
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
    height: 100%;
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
    color: rgb(var(--color-wolf));
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
    height: 32px;
    padding: 0px 6px;
    justify-content: center;
    align-items: center;

    border-radius: 16px;
    outline: 2px solid rgba(var(--color-black-white), 0.20);
    outline-offset: -2px;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);
}
.DLP_Toggle_Style_1 p {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.32, 1);
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
        <p class="DLP_Text_Style_1 DLP_Inset_Icon_1_ID DLP_NoSelect"></p>
        <p class="DLP_Text_Style_1 DLP_Inset_Text_1_ID" style="flex: 1 0 0;"></p>
        <p class="DLP_Text_Style_1 DLP_Inset_Icon_2_ID DLP_Magnetic_Hover_1 DLP_NoSelect" style="align-self: stretch;">􀆄</p>
    </div>
    <p class="DLP_Text_Style_1 DLP_Inset_Text_2_ID" style="color: rgb(var(--color-wolf), 0.4); align-self: stretch; overflow-wrap: break-word;"></p>
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
            <div style="display: flex; justify-content: center; align-items: center; gap: 6px; opacity: 0.5;">
                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID" style="color: rgb(var(--color-black-text));">Unavailable</p>
                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-black-text));">􀌔</p>
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
                <p class="DLP_AutoServer_Text_Style_1 DLP_NoSelect" style="font-size: 14px; background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${VERSION_NAME}</p>
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
<div id="DLP_TheBarThing_Box" style="display: inline-flex; justify-content: center; flex-direction: row-reverse; align-items: center; gap: 8px;">
    <div class="DLP_TheBarThing_Button_Style_1 DLP_Magnetic_Hover_1 DLP_Inset_Button_1_ID">
        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel)); display: none;">􀯠</p>
        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID"></p>
    </div>
    <div class="DLP_TheBarThing_Button_Style_1 DLP_Magnetic_Hover_1 DLP_Inset_Button_2_ID">
        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel));">􀊣</p>
        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Text_1_ID">Mute</p>
    </div>
    <div class="DLP_TheBarThing_Button_Style_1 DLP_Magnetic_Hover_1 DLP_Inset_Button_3_ID" style="width: 40px; padding: 0;">
        <p class="DLP_Text_Style_1 DLP_NoSelect DLP_Inset_Icon_1_ID" style="color: rgb(var(--color-eel)); transition: all 0.8s cubic-bezier(0.16, 1, 0.32, 1);">􀯸</p>
    </div>
</div>
`;
    CSS7 = `
.DLP_TheBarThing_Button_Style_1 {
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

    cursor: pointer;
}
.DLP_TheBarThing_Button_Style_1 p {
    white-space: nowrap;
}
.DLP_TheBarThing_Button_Style_1 svg {
    flex-shrink: 0;
}
`;
}

function One() {
    (function buildOrMigrateStorageLocal() {
        let tempRandom16 = Array.from({ length: 16 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
        let tempTimestamp = Date.now();

        const DEFAULTS = {
            versionNumber: VERSION_NUMBER,
            versionFull: VERSION_FULL,
            terms: "00",
            random16: tempRandom16,
            pins: {
                home: ["DLP_Get_XP_1_ID", "DLP_Get_GEM_1_ID"],
                legacy: ["DLP_Get_PATH_1_ID", "DLP_Get_PRACTICE_1_ID"]
            },
            settings: {
                autoUpdate: !greasyfork,
                showSolveButtons: true,
                showAutoServerButton: alpha,
                muteLessons: false,
                anonymousUsageData: alpha,
                reduceEffects: false,
                localSuper: false,
                randomSolveSpeed: false,
                randomSolveSpeedRange: [2.8, 12.4],
                showSuper: false
            },
            stats: {
                modern: {
                    xp: 0,
                    gem: 0,
                    streak: 0,
                    super: 0,
                    heart_refill: 0,
                    streak_freeze: 0,
                    double_xp_boost: 0,
                    quest: 0
                },
                legacy: {
                    path: {
                        lessons: 0,
                        questions: 0
                    },
                    practice: {
                        lessons: 0,
                        questions: 0
                    },
                    listen: {
                        lessons: 0,
                        questions: 0
                    },
                    lesson: {
                        lessons: 0,
                        questions: 0
                    }
                },
                tracking_since: tempTimestamp
            },
            chats: [],
            notifications: [{ id: "0000" }],
            tips: { seeMore1: false },
            languagePackVersion: "00",
            onboarding: false,
            storageVersion: STORAGE_LOCAL_VERSION
        };

        function isPlainObject(v) {
            return Object.prototype.toString.call(v) === "[object Object]";
        }
        function safeParse(json) {
            try {
                const v = JSON.parse(json);
                return isPlainObject(v) ? v : null;
            } catch {
                return null;
            }
        }

        function mergeWithPrune(existing, defaults) {
            const result = Array.isArray(defaults) ? [] : {};
            for (const key of Object.keys(defaults)) {
                const defVal = defaults[key];
                const hasExisting = existing && Object.prototype.hasOwnProperty.call(existing, key);
                const exVal = hasExisting ? existing[key] : undefined;

                if (isPlainObject(defVal)) {
                    if (isPlainObject(exVal)) {
                        result[key] = mergeWithPrune(exVal, defVal);
                    } else {
                        result[key] = mergeWithPrune({}, defVal); // take full default subtree
                    }
                } else if (Array.isArray(defVal)) {
                    result[key] = Array.isArray(exVal) ? exVal : defVal.slice();
                } else {
                    // primitives / everything else: keep existing if present, else default
                    result[key] = hasExisting ? exVal : defVal;
                }
            }
            // Unknown keys in `existing` are intentionally NOT copied (pruned)
            return result;
        }

        const raw = localStorage.getItem("DLP_Local_Storage");
        const existing = safeParse(raw);

        // Migrate: replace old "DLP_Get_GEMS_1_ID" pin with new "DLP_Get_GEM_1_ID"
        if (existing && existing.pins && Array.isArray(existing.pins.home)) {
            const legacyIndex = existing.pins.home.indexOf("DLP_Get_GEMS_1_ID");
            if (legacyIndex !== -1) {
                existing.pins.home[legacyIndex] = "DLP_Get_GEM_1_ID";
            }
        }

        // Fresh write if missing or unparsable
        if (!existing) {
            const fresh = { ...DEFAULTS, storageVersion: STORAGE_LOCAL_VERSION };
            localStorage.setItem("DLP_Local_Storage", JSON.stringify(fresh));
            storageLocal = fresh;
            return;
        }

        // Up-to-date -> just use it
        if (existing.storageVersion === STORAGE_LOCAL_VERSION) {
            storageLocal = existing;
            return;
        }

        // Migrate: keep existing values where keys match, add missing defaults, drop extras
        const migrated = mergeWithPrune(existing, DEFAULTS);

        // Ensure we actually bump the version so we don't re-migrate on next load
        migrated.storageVersion = STORAGE_LOCAL_VERSION;
        migrated.versionNumber = VERSION_NUMBER;
        migrated.versionFull = VERSION_FULL;
        recentUpdateDetected = true;

        localStorage.setItem("DLP_Local_Storage", JSON.stringify(migrated));
        storageLocal = migrated;
    })();
    function saveStorageLocal() {
        localStorage.setItem("DLP_Local_Storage", JSON.stringify(storageLocal));
    }

    if (sessionStorage.getItem("DLP_Session_Storage") == null || JSON.parse(sessionStorage.getItem("DLP_Session_Storage")).storageVersion !== STORAGE_SESSION_VERSION) {
        const DEFAULTS = {
            legacy: {
                page: 0,
                status: false,
                path: {
                    type: "lesson",
                    amount: 0
                },
                practice: {
                    type: "lesson",
                    amount: 0
                },
                listen: {
                    type: "lesson",
                    amount: 0
                },
                lesson: {
                    section: 1,
                    unit: 1,
                    level: 1,
                    type: "lesson",
                    amount: 0
                }
            },
            notifications: [
                {
                    id: "0001"
                }
            ],
            hidden: false,
            storageVersion: STORAGE_SESSION_VERSION,
            script: {
                ping: 4000,
                donate: null,
                boost: null,
                youtube: null,
                discord: null,
                github: null,
                support: {
                    enabled: null,
                    file_upload: {
                        enabled: null,
                        max_size: 8388608,
                        max_files: 3
                    }
                },
                settings: {
                    enabled: null,
                    show_solve: null,
                    show_autoserver: null,
                    random_legacy_solve_speed: null,
                    custom_random_legacy_solve_speed: null,
                    anonymous_analytics: false,
                    reduce_effects: null,
                    free_duolingo_max: null,
                    show_super_trial: null,
                    modern_statistics: null,
                    legacy_statistics: null
                },
                release_notes: null,
                modern: {
                    enabled: null,
                    xp: null,
                    gems: null,
                    streak: null,
                    streak_freeze: null,
                    badge: null,
                    double_xp_boost: null,
                    heart_refill: null,
                    quests: null
                },
                legacy: {
                    enabled: null,
                    lesson: null,
                    practice: null,
                    listen: null,
                    path: null
                }
            }
        };
        sessionStorage.setItem("DLP_Session_Storage", JSON.stringify(DEFAULTS));
        storageSession = DEFAULTS;
    } else {
        storageSession = JSON.parse(sessionStorage.getItem("DLP_Session_Storage"));
    }
    function saveStorageSession() {
        sessionStorage.setItem("DLP_Session_Storage", JSON.stringify(storageSession));
    }

    if (alpha) {
        apiURL = "https://api.duolingopro.net/alpha";
        if (!storageLocal.settings.anonymousUsageData) storageLocal.settings.anonymousUsageData = true;
        saveStorageLocal();
    }

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
                        document.querySelectorAll('.DPAutoServerElementsMenu').forEach(function (element) {
                            element.remove();
                        });
                    } else {
                        otherTargetDiv.classList.add('DPAutoServerButtonMainMenuLarge');
                    }
                }
            }
        } catch (error) { }
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

    window.onfocus = () => {
        windowBlurState = true;
    };
    window.onblur = () => {
        windowBlurState = false;
    };

    function DuolingoPROTheBarThing() {
        if ((window.location.pathname.includes('/lesson') || window.location.pathname.includes('/practice')) && storageSession.legacy.status) {
            let theBarThing = document.querySelector('#DLP_TheBarThing_Box');
            if (!theBarThing) {
                //const targetElement1 = document.querySelector('.I-Avc._1zcW8');
                const targetElement1 = document.querySelector('._1zcW8');
                const targetElement2 = document.querySelector('.mAxZF');
                if (targetElement1 || targetElement2) document.head.appendChild(Object.assign(document.createElement('style'), { type: 'text/css', textContent: CSS7 }));
                else {
                    if (debug) console.log('Element with class ._1zcW8 or .mAxZF not found');
                    return;
                }

                if (targetElement1) {
                    targetElement1.insertAdjacentHTML('beforeend', HTML7);
                    theBarThing = document.querySelector('#DLP_TheBarThing_Box');
                    targetElement1.style.display = "flex";
                    document.querySelector('[role="progressbar"]').style.width = "100%";
                } else if (targetElement2) {
                    targetElement2.insertAdjacentHTML('beforeend', HTML7);
                    theBarThing = document.querySelector('#DLP_TheBarThing_Box');
                    theBarThing.style.marginLeft = '24px';
                    document.querySelector('._15ch1').style.pointerEvents = 'all';
                }

                let muteButton = theBarThing.querySelector('.DLP_Inset_Button_2_ID');
                let expandButton = theBarThing.querySelector('.DLP_Inset_Button_3_ID');
                let expandButtonIcon = expandButton.querySelector('.DLP_Inset_Icon_1_ID');
                let theBarThingExtended = false;
                function theBarThingExtend(button, visibility, noAnimation) {
                    if (visibility) {
                        button.style.display = "";
                        button.style.transition = "";
                        button.style.width = "";
                        button.style.padding = "";
                        let remember0010 = button.offsetWidth;
                        button.style.width = "0px";
                        button.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.32, 1)";
                        void button.offsetWidth;
                        requestAnimationFrame(() => {
                            button.style.width = remember0010 + "px";
                            button.style.padding = "";
                            button.style.filter = "blur(0px)";
                            button.style.opacity = "1";
                            button.style.margin = "";
                            setTimeout(() => {
                                button.style.transition = "";
                            }, 400);
                        });
                    } else {
                        button.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.32, 1)";
                        button.style.width = button.offsetWidth + "px";
                        void button.offsetWidth;
                        requestAnimationFrame(() => {
                            button.style.width = "8px";
                            button.style.padding = "0";
                            button.style.filter = "blur(8px)";
                            button.style.margin = "0 -8px";
                            button.style.opacity = "0";
                            setTimeout(() => {
                                button.style.transition = "";
                            }, 400);
                        });
                        if (!noAnimation) {
                            setTimeout(function () {
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

                handleMuteTab(true);
                theBarThing.querySelector('.DLP_Inset_Button_2_ID').addEventListener('click', () => {
                    handleMuteTab();
                });
            }

            function updateCounter() {
                let button = theBarThing.querySelector('.DLP_Inset_Button_1_ID');
                let text = button.querySelector('.DLP_Inset_Text_1_ID');

                if (storageSession.legacy[storageSession.legacy.status].type === 'infinity' && text.textContent !== 'Infinity') {
                    setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: 'Infinity', icon: '􀯠' }, { text: '', icon: '' });
                } else if (storageSession.legacy[storageSession.legacy.status].type === 'xp' && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' XP Left')) {
                    setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: String(storageSession.legacy[storageSession.legacy.status].amount + ' XP Left'), icon: '' }, { text: '', icon: '' });
                } else if (window.location.pathname === '/practice') {
                    if (storageSession.legacy[storageSession.legacy.status].amount === 1 && text.textContent !== 'Last Practice') {
                        setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: 'Last Practice', icon: '' }, { text: '', icon: '' });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount === 0 && text.textContent !== 'Finishing Up') {
                        setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: 'Finishing Up', icon: '' }, { text: '', icon: '' });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount > 1 && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' Practices Left')) {
                        setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: String(storageSession.legacy[storageSession.legacy.status].amount + ' Practices Left'), icon: '' }, { text: '', icon: '' });
                    }
                } else if (storageSession.legacy[storageSession.legacy.status].type === 'lesson') {
                    if (storageSession.legacy[storageSession.legacy.status].amount === 1 && text.textContent !== 'Last Lesson') {
                        setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: 'Last Lesson', icon: '' }, { text: '', icon: '' });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount === 0 && text.textContent !== 'Finishing Up') {
                        setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: 'Finishing Up', icon: '' }, { text: '', icon: '' });
                    } else if (storageSession.legacy[storageSession.legacy.status].amount > 1 && text.textContent !== String(storageSession.legacy[storageSession.legacy.status].amount + ' Lessons Left')) {
                        setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: String(storageSession.legacy[storageSession.legacy.status].amount + ' Lessons Left'), icon: '' }, { text: '', icon: '' },);
                    }
                }
            }
            updateCounter();

            let isTheBarThingButtonBusy = false;
            function handleMuteTab(visualOnly = false) {
                if (!visualOnly) {
                    if (isTheBarThingButtonBusy) return;
                    isTheBarThingButtonBusy = true;
                    storageLocal.settings.muteLessons = !storageLocal.settings.muteLessons;
                    saveStorageLocal();
                    muteTab(storageLocal.settings.muteLessons);
                }
                let button = theBarThing.querySelector('.DLP_Inset_Button_2_ID');
                if (storageLocal.settings.muteLessons) {
                    setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: 'Muted', icon: '􀊣' }, { text: '', icon: ' ' }, () => {
                        setTimeout(() => {
                            if (!visualOnly) isTheBarThingButtonBusy = false;
                        }, 400);
                    });
                } else {
                    setButtonState(button, { button: 'rgb(var(--color-snow), 0.84)', outline: 'rgb(var(--color-swan))', text: 'rgb(var(--color-black-text))', icon: 'rgb(var(--color-black-text))' }, { text: 'Mute', icon: '􀊧' }, { text: '', icon: ' ' }, () => {
                        setTimeout(() => {
                            if (!visualOnly) isTheBarThingButtonBusy = false;
                        }, 400);
                    });
                }
            }

            let duolingoPROTheThingBarDisappearObserverTimeout = null;
            new MutationObserver((mutations, observer) => {
                if (duolingoPROTheThingBarDisappearObserverTimeout) return;
                if (!document.querySelector('.auto-solver-btn.solve-btn, .auto-solver-btn.solving-btn')) {
                    duolingoPROTheThingBarDisappearObserverTimeout = setTimeout(() => {
                        initDuolingoPROTheBarThingObserver();
                        duolingoPROTheThingBarDisappearObserverTimeout = null;
                        observer.disconnect();
                    }, 50);
                }
            }).observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }


    function addButtons() {
        if (!storageLocal.settings.showSolveButtons) return;
        if (window.location.pathname === '/learn' && document.querySelector('a[data-test="global-practice"]')) return;
        if (document.querySelector("#solveAllButton")) return;

        document.querySelector('[data-test="quit-button"]')?.addEventListener('click', function outerHandler() {
            let wasSolving = isAutoMode;
            if (wasSolving) solving("stop");

            setTimeout(() => {
                document.addEventListener('click', function handler2916(e) {
                    const el = document.querySelector('._3fmUm.c1Mv-._1ursp._7jW2t._3GC5C._2xxrg.vSCTx._27kss');
                    if (el && el.contains(e.target)) {
                        storageSession.legacy.status = false;
                        saveStorageSession();
                    } else {
                        if (wasSolving) solving("start");
                    }
                    document.removeEventListener('click', handler2916);
                });
            }, 200);
        });

        function createButton(id, text, styleClass, eventHandlers) {
            const button = document.createElement('button');
            button.id = id;
            button.innerText = text;
            button.className = styleClass;

            Object.keys(eventHandlers).forEach(event => {
                const handler = eventHandlers[event];
                button.addEventListener(event, (e) => {
                    handler();
                    // Or, if you still want access to the event, pass it as a named second arg:
                    // handler(undefined, e);
                });
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
        if (target) {
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

            const solveButtonCopy = createButton('solveAllButton', systemText[systemLanguage][101], 'auto-solver-btn solving-btn', { click: solving });
            const solveAllButtonCopy = createButton('', systemText[systemLanguage][100], 'auto-solver-btn solve-btn', { click: solve });

            target.parentElement.appendChild(solveAllButtonCopy);
            target.parentElement.appendChild(solveButtonCopy);

            if (storageSession.legacy.status) {
                if (!isAutoMode) solving("start");
                else updateSolveButtonText(systemText[systemLanguage][102]);
                muteTab(storageLocal.settings.muteLessons);
            }

            let duolingoPROSolveButtonsDisappearObserverTimeout = null;
            new MutationObserver((mutations, observer) => {
                if (duolingoPROSolveButtonsDisappearObserverTimeout) return;
                if (!document.querySelector('.auto-solver-btn, .solve-btn')) {
                    duolingoPROSolveButtonsDisappearObserverTimeout = setTimeout(() => {
                        initDuolingoPROSolveButtonsObserver();
                        duolingoPROSolveButtonsDisappearObserverTimeout = null;
                        observer.disconnect();
                    }, 50);
                }
            }).observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    let duolingoPROTheBarThingObserver = null;
    function initDuolingoPROTheBarThingObserver() {
        if (duolingoPROTheBarThingObserver) duolingoPROTheBarThingObserver.disconnect();
        let initDuolingoPROTheBarThingObserverTimeout = null;

        duolingoPROTheBarThingObserver = new MutationObserver((mutations) => {
            if (initDuolingoPROTheBarThingObserverTimeout) return;
            if (document.querySelector('._1zcW8, .mAxZF')) {
                initDuolingoPROTheBarThingObserverTimeout = setTimeout(() => {
                    DuolingoPROTheBarThing();
                    initDuolingoPROTheBarThingObserverTimeout = null;
                    duolingoPROTheBarThingObserver.disconnect();
                    duolingoPROTheBarThingObserver = null;
                }, 50);
            }
        });

        duolingoPROTheBarThingObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    initDuolingoPROTheBarThingObserver();

    let duolingoPROSolveButtonsObserver = null;
    function initDuolingoPROSolveButtonsObserver() {
        if (duolingoPROSolveButtonsObserver) duolingoPROSolveButtonsObserver.disconnect();
        let initDuolingoPROSolveButtonsObserverTimeout = null;

        if (document.querySelector('[data-test="player-next"], [data-test="stories-player-continue"], [data-test="stories-player-done"]')) {
            addButtons();
            return;
        }

        duolingoPROSolveButtonsObserver = new MutationObserver((mutations) => {
            if (initDuolingoPROSolveButtonsObserverTimeout) return;
            if (document.querySelector('[data-test="player-next"], [data-test="stories-player-continue"], [data-test="stories-player-done"]')) {
                initDuolingoPROSolveButtonsObserverTimeout = setTimeout(() => {
                    addButtons();
                    initDuolingoPROSolveButtonsObserverTimeout = null;
                    duolingoPROSolveButtonsObserver.disconnect();
                    duolingoPROSolveButtonsObserver = null;
                }, 50);
            }
        });

        duolingoPROSolveButtonsObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    initDuolingoPROSolveButtonsObserver();



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

    setTimeout(() => {
        if (document.querySelectorAll('.DLP_Main').length > 1) {
            multipleScriptsDetected = true;
            showNotification("error", "Multiple Scripts Detected", "Multiple Duolingo PRO scripts were detected. Please uninstall any extra copies from your userscript manager to continue using Duolingo PRO.", 0);
        }
    }, 10);

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

        //"DLP_Secondary_Feedback_1_Button_1_ID": [8],
        "DLP_Secondary_Feedback_1_Button_1_ID": [11],

        "DLP_Secondary_Whats_New_1_Button_1_ID": [9],
        "DLP_Secondary_See_More_1_Button_1_ID": [4],
        "DLP_Secondary_Terms_1_Button_1_ID": [5],

        "DLP_Terms_Back_Button_1_ID": [1],
        "DLP_Terms_Accept_Button_1_ID": [1],
        "DLP_Terms_Decline_Button_1_ID": [6],
        "DLP_Terms_Declined_Back_Button_1_ID": [5]
    };
    let goToPageBacklogList = [];
    async function goToPage(to, buttonID, backlog = false) {
        if (backlog && isBusySwitchingPages) {
            if (goToPageBacklogList.includes(to)) {
                return;
            } else {
                goToPageBacklogList.push(to);
            }
            while (isBusySwitchingPages) {
                await new Promise(r => setTimeout(r, 16));
            }
            goToPageBacklogList.splice(goToPageBacklogList.indexOf(to), 1);
        }

        if (isBusySwitchingPages) return;
        isBusySwitchingPages = true;

        let mainBox = document.querySelector(`.DLP_Main_Box`);
        let toNumber = to;
        let fromPage = document.querySelector(`#DLP_Main_Box_Divider_${pageHistory[pageHistory.length - 1]}_ID`);
        let toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);

        let mainBoxNewToBeWidth = mainBox.offsetWidth;
        console.log(pageHistory);

        if (buttonID === 'DLP_Terms_Back_Button_1_ID') {
            pageHistory.splice(pageHistory.length - 1, 1);
            toNumber = pageHistory[pageHistory.length - 1];
        } else if (buttonID === 'DLP_Universal_Back_1_Button_1_ID' || to === -1) {
            pageHistory.splice(pageHistory.length - 1, 1);
            toNumber = pageHistory[pageHistory.length - 1];
        } else if (buttonID === 'DLP_Switch_Legacy_Button_1_ID') {
            if (storageSession.legacy.page !== 0) {
                toNumber = 1;
            } else {
                toNumber = 3;
            }
        }
        if (toNumber === pageHistory[pageHistory.length - 1] && !buttonID === 'DLP_Switch_Legacy_Button_1_ID') {
            isBusySwitchingPages = false;
            return;
        }

        if (toNumber === 7) {
            if (storageSession.script.settings.enabled === false) {
                showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
                isBusySwitchingPages = false;
                return;
            }
        } else if (toNumber === 9) {
            if (storageSession.script.release_notes === false) {
                showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
                isBusySwitchingPages = false;
                return;
            }
        } else if (toNumber === 11) {
            if (storageSession.script.support.enabled === false) {
                showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
                isBusySwitchingPages = false;
                return;
            }
        }

        if (buttonID === 'DLP_Main_Terms_1_Button_1_ID' || buttonID === 'DLP_Secondary_Terms_1_Button_1_ID') {
            document.querySelector(`#DLP_Terms_1_Text_1_ID`).style.display = 'none';
            document.querySelector(`#DLP_Terms_1_Button_1_ID`).style.display = 'none';
            document.querySelector(`#DLP_Terms_1_Text_2_ID`).style.display = 'block';
            document.querySelector(`#DLP_Terms_1_Button_2_ID`).style.display = 'block';
        } else if (buttonID === 'DLP_Terms_Back_Button_1_ID') {
            toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
            setTimeout(() => {
                document.querySelector(`#DLP_Terms_1_Text_1_ID`).style.display = 'block';
                document.querySelector(`#DLP_Terms_1_Button_1_ID`).style.display = 'block';
                document.querySelector(`#DLP_Terms_1_Text_2_ID`).style.display = 'none';
                document.querySelector(`#DLP_Terms_1_Button_2_ID`).style.display = 'none';
            }, 400);
        } else if (buttonID === 'DLP_Universal_Back_1_Button_1_ID' || to === -1) {
            toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
        } else if (buttonID === 'DLP_Switch_Legacy_Button_1_ID') {
            let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
            if (storageSession.legacy.page !== 0) {
                toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
                setButtonState(button, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][106], icon: '􀱏' }, { text: '', icon: '' });
                storageSession.legacy.page = 0;
                saveStorageSession();
            } else {
                toPage = document.querySelector(`#DLP_Main_Box_Divider_${toNumber}_ID`);
                setButtonState(button, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][105], icon: '􀂑' }, { text: '', icon: '' });
                storageSession.legacy.page = 1;
                saveStorageSession();
            }
        } else if (buttonID === 'DLP_Terms_Accept_Button_1_ID') {
            storageLocal.terms = newTermID;
            saveStorageLocal();
            if (!storageLocal.onboarding) {
                isBusySwitchingPages = false;
                goToPage(12, null);
                return;
            } else if (recentUpdateDetected) {
                isBusySwitchingPages = false;
                goToPage(9, null);
                document.querySelector('#DLP_Main_Box_Divider_9_ID').querySelector('.DLP_HStack_Auto_Top').querySelector(':scope > .DLP_Text_Style_2').style.display = 'block';
                document.querySelector('#DLP_Main_Box_Divider_9_ID').querySelector('#DLP_Universal_Back_1_Button_1_ID').style.display = 'none';
                return;
            }
        } else if (buttonID === 'DLP_Main_Feedback_1_Button_1_ID') {
            setTimeout(() => {
                const chatBox = document.querySelector('#DLP_Main_Box_Divider_11_ID')?.querySelector('.DLP_Chat_Box_1_ID_1');
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 420);
        } else if (toNumber === 7) {
            const trackingSinceDateString = new Date(storageLocal.stats.tracking_since).toLocaleDateString(systemLanguage, { month: 'short', day: 'numeric', year: 'numeric' });

            let modernStatsBox = document.querySelector('#DLP_Main_Box_Divider_7_ID').querySelector('#DLP_Settings_Modern_Stats_Main_Box_1_ID');
            modernStatsBox.children[0].lastElementChild.innerHTML = "since " + trackingSinceDateString;
            modernStatsBox.children[1].lastElementChild.innerHTML = storageLocal.stats.modern.xp;
            modernStatsBox.children[2].lastElementChild.innerHTML = storageLocal.stats.modern.gem;
            modernStatsBox.children[3].lastElementChild.innerHTML = storageLocal.stats.modern.streak;
            modernStatsBox.children[4].lastElementChild.innerHTML = storageLocal.stats.modern.heart_refill;
            modernStatsBox.children[5].lastElementChild.innerHTML = storageLocal.stats.modern.streak_freeze;
            modernStatsBox.children[6].lastElementChild.innerHTML = storageLocal.stats.modern.double_xp_boost;
            modernStatsBox.children[7].lastElementChild.innerHTML = storageLocal.stats.modern.quest;

            let legacyStatsBox = document.querySelector('#DLP_Main_Box_Divider_7_ID').querySelector('#DLP_Settings_Legacy_Stats_Main_Box_1_ID');
            legacyStatsBox.children[0].lastElementChild.innerHTML = "since " + trackingSinceDateString;
            legacyStatsBox.children[1].lastElementChild.innerHTML = (storageLocal.stats.legacy.listen.lessons + storageLocal.stats.legacy.path.lessons + storageLocal.stats.legacy.practice.lessons + storageLocal.stats.legacy.lesson.lessons);
            legacyStatsBox.children[2].lastElementChild.innerHTML = (storageLocal.stats.legacy.listen.questions + storageLocal.stats.legacy.path.questions + storageLocal.stats.legacy.practice.questions + storageLocal.stats.legacy.lesson.questions);

            if (buttonID.startsWith("DLP_Get_Local_Duolingo_Max")) {
                setTimeout(() => {
                    document.querySelector("#DLP_Main_Box_Divider_7_ID").querySelector("#DLP_Settings_Free_Local_Super_Button_1_ID").scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                }, 420);
            }
        }

        if (toNumber === 11) {
            if (newReplyButtonActive) {
                newReplyButtonActive = false;
                updateConnetionButtonStyles(document.getElementById("DLP_Main_Feedback_1_Button_1_ID"), { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][5], icon: '􂄺' }, { text: '', icon: '' });
            }
        }

        if (toNumber === 2) mainBoxNewToBeWidth = "600";
        else if (toNumber === 5) mainBoxNewToBeWidth = "400";
        else if (toNumber === 7) mainBoxNewToBeWidth = "400";
        else if (toNumber === 8) mainBoxNewToBeWidth = "400";
        else if (toNumber === 9) mainBoxNewToBeWidth = "400";
        else if (toNumber === 10) mainBoxNewToBeWidth = "356";
        else if (toNumber === 11) mainBoxNewToBeWidth = "400";
        else if (toNumber === 12) mainBoxNewToBeWidth = "400";
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
        mainBox.style.transition = "";
        fromPage.style.display = "none";
        toPage.style.display = "block";
        mainBox.offsetHeight;
        mainBox.style.width = `${mainBoxNewToBeWidth}px`;
        let mainBoxNewWidth = mainBoxNewToBeWidth;
        let mainBoxNewHeight = mainBox.offsetHeight;
        let toBoxOldWidth = toPage.offsetWidth;
        let toBoxOldHeight = toPage.offsetHeight;
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

                if (pageHistory[pageHistory.length - 1] !== toNumber) pageHistory.push(toNumber);
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
            setButtonState(button, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][104], icon: '􀋮' }, { text: '', icon: '' });
            main.style.bottom = `-${mainBoxHeight - 8}px`;
            legacyButtonVisibility(false);
            mainBox.style.filter = "blur(8px)";
            mainBox.style.opacity = "0";
        } else {
            setButtonState(button, { button: 'rgb(var(--DLP-blue)', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: systemText[systemLanguage][103], icon: '􀋰' }, { text: '', icon: '' });
            main.style.bottom = "16px";
            if ([1, 3].includes(pageHistory[pageHistory.length - 1])) legacyButtonVisibility(true);
            mainBox.style.filter = "";
            mainBox.style.opacity = "";
        }
        storageSession.hidden = value;
        saveStorageSession();
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
    hidden = storageSession.hidden;
    hide(hidden);
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

            button.style.width = '';

            let previousText = textElement.textContent;
            let previousIcon = undefined;
            if (iconElement.style.display !== 'none') {
                previousIcon = iconElement.textContent;
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
                iconElement.textContent = previousIcon;
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

    [
        ['#DLP_Main_YouTube_Button_1_ID, #DLP_Secondary_YouTube_Button_1_ID', 'youtube'],
        ['#DLP_Main_Discord_Button_1_ID, #DLP_Secondary_Discord_Button_1_ID', 'discord'],
        ['#DLP_Main_GitHub_Button_1_ID, #DLP_Secondary_GitHub_Button_1_ID', 'github'],
        ['#DLP_Main_Donate_Button_1_ID, #DLP_Secondary_Donate_Button_1_ID', 'donate']
    ].forEach(([selectors, key]) => document.querySelectorAll(selectors).forEach(btn => btn.addEventListener('click', () => {
        if (storageSession.script[key] === false) {
            showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
            return;
        }
        window.open(`https://duolingopro.net/${key}`, '_blank');
    })));


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

            if (!storageSession.legacy.status && (storageSession.legacy[type].amount > 0 || storageSession.legacy[type].type === "infinity")) {
                setButtonState(buttonElement, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][107], icon: '􀊆' }, { text: '', icon: '' });
                storageSession.legacy.page = page;
                storageSession.legacy.status = type;
                saveStorageSession();
            } else if (storageSession.legacy.status === type || storageSession.legacy[type].type === "infinity") {
                setButtonState(buttonElement, { button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: systemText[systemLanguage][18], icon: '􀰫' }, { text: '', icon: '' });
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

                if (!storageSession.legacy.status && (storageSession.legacy[type].amount > 0) || storageSession.legacy[type].type === "infinity") {
                    setButtonState(buttonElement, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][107], icon: '􀊆' }, { text: '', icon: '' });
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
            const button1 = button2.parentElement.querySelector('#DLP_Inset_Button_1_ID');

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

            function syncGetButtonState(mode) {
                if (!button1) return;
                if (mode === 'infinity') {
                    button1.style.opacity = '';
                    button1.style.pointerEvents = '';
                } else {
                    const isEmpty = input && input.value.length === 0;
                    button1.style.opacity = isEmpty ? '0.5' : '';
                    button1.style.pointerEvents = isEmpty ? 'none' : '';
                }
            }

            if (storageSession.legacy[type].type === 'lesson') {
                let inputTo;
                button2.title = 'Switch to XP Mode';

                if (input.style.display === 'none') inputTo = 'show';

                syncGetButtonState('lesson');

                animateElement(icon, false);
                setTimeout(() => {
                    icon.textContent = '􀆃';
                    animateElement(icon, true);
                }, 400);
                if (inputTo === 'show') setTimeout(() => animateElement(input, true), 400);

            } else if (storageSession.legacy[type].type === 'xp') {
                let inputTo;
                button2.title = 'Switch to Infinity Mode';

                if (input.style.display === 'none') inputTo = 'show';

                syncGetButtonState('xp');

                animateElement(icon, false);
                setTimeout(() => {
                    icon.textContent = 'XP';
                    animateElement(icon, true);
                }, 400);
                if (inputTo === 'show') setTimeout(() => animateElement(input, true), 400);

            } else if (storageSession.legacy[type].type === 'infinity') {
                let inputTo;
                button2.title = 'Switch to Lesson Mode';

                if (input.style.display !== 'none') inputTo = 'hide';

                syncGetButtonState('infinity');

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

    if (storageSession.legacy.status && storageSession.legacy[storageSession.legacy.status] &&
        (
            storageSession.legacy[storageSession.legacy.status].amount > 0 ||
            storageSession.legacy[storageSession.legacy.status].type === 'infinity'
        )
    ) {
        if (storageSession.legacy.status === 'path') {
            setButtonState((storageSession.legacy.page === 1 ? DLP_Get_PATH_1_ID : DLP_Get_PATH_2_ID).querySelector('#DLP_Inset_Button_1_ID'), { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][107], icon: '􀊆' }, { text: '', icon: '' });
        } else if (storageSession.legacy.status === 'practice') {
            setButtonState((storageSession.legacy.page === 1 ? DLP_Get_PRACTICE_1_ID : DLP_Get_PRACTICE_2_ID).querySelector('#DLP_Inset_Button_1_ID'), { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][107], icon: '􀊆' }, { text: '', icon: '' });
        } else if (storageSession.legacy.status === 'listen') {
            setButtonState((storageSession.legacy.page === 1 ? DLP_Get_LISTEN_1_ID : DLP_Get_LISTEN_2_ID).querySelector('#DLP_Inset_Button_1_ID'), { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][107], icon: '􀊆' }, { text: '', icon: '' });
        } else if (storageSession.legacy.status === 'lesson') {
            setButtonState((storageSession.legacy.page === 1 ? DLP_Get_LESSON_1_ID : DLP_Get_LESSON_2_ID).querySelector('#DLP_Inset_Button_1_ID'), { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][107], icon: '􀊆' }, { text: '', icon: '' });
        }
    }

    let pageSwitching = false;
    function process1() {
        if (window.location.href.includes('/lesson') || window.location.href.includes('/practice') || window.location.href.includes('/practice-hub/listening-practice')) return;
        if (storageSession.legacy.status && (storageSession.legacy[storageSession.legacy.status].amount > 0 || storageSession.legacy[storageSession.legacy.status].type === 'infinity')) {
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
        if (storageSession.legacy.status && (storageSession.legacy[storageSession.legacy.status].amount > 0 || storageSession.legacy[storageSession.legacy.status].type === 'infinity')) {
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
        document.querySelector(`#DLP_Main_Box_Divider_${pageHistory[pageHistory.length - 1]}_ID`).style.display = 'none';
        document.querySelector(`#DLP_Main_Box_Divider_3_ID`).style.display = 'block';
        pageHistory = [3];
        let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
        setButtonState(button, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][105], icon: '􀂑' }, { text: '', icon: '' });
    } else if (storageSession.legacy.page === 2) {
        document.querySelector(`#DLP_Main_Box_Divider_${pageHistory[pageHistory.length - 1]}_ID`).style.display = 'none';
        document.querySelector(`#DLP_Main_Box_Divider_4_ID`).style.display = 'block';
        pageHistory = [3, 4];
        let button = document.querySelector('#DLP_Switch_Legacy_Button_1_ID');
        setButtonState(button, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][105], icon: '􀂑' }, { text: '', icon: '' });
    }







    function inputCheck1() {
        const ids = {
            "DLP_Get_XP_1_ID": ["xp"],
            "DLP_Get_XP_2_ID": ["xp"],
            "DLP_Get_GEM_1_ID": ["gem"],
            "DLP_Get_GEM_2_ID": ["gem"],
            "DLP_Get_SUPER_1_ID": ["super"],
            "DLP_Get_SUPER_2_ID": ["super"],
            "DLP_Get_DOUBLE_XP_BOOST_1_ID": ["double_xp_boost"],
            "DLP_Get_DOUBLE_XP_BOOST_2_ID": ["double_xp_boost"],
            "DLP_Get_Streak_Freeze_1_ID": ["streak_freeze"],
            "DLP_Get_Streak_Freeze_2_ID": ["streak_freeze"],
            "DLP_Get_Heart_Refill_1_ID": ["heart_refill"],
            "DLP_Get_Heart_Refill_2_ID": ["heart_refill"],
            "DLP_Get_Streak_1_ID": ["streak"],
            "DLP_Get_Streak_2_ID": ["streak"],
            "DLP_Get_Quest_1_ID": ["quest"],
            "DLP_Get_Quest_2_ID": ["quest"],
            "DLP_Get_Badge_1_ID": ["badge"],
            "DLP_Get_Badge_2_ID": ["badge"],
            "DLP_Get_Local_Duolingo_Max_1_ID": ["local_max"],
            "DLP_Get_Local_Duolingo_Max_2_ID": ["local_max"]
        };

        if (!storageLocal.settings.showSuper) document.querySelector('#DLP_Get_SUPER_2_ID').style.display = 'none';

        Object.keys(ids).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;

            const input1 = element.querySelector('#DLP_Inset_Input_1_ID');
            const input2 = element.querySelector('#DLP_Inset_Input_2_ID');
            const button = element.querySelector('#DLP_Inset_Button_1_ID');

            // Fix: check input1 instead of undefined 'input'
            if ((!input1 && !input2) || !button) return;

            function updateButtonState() {
                const isEmpty1 = !input1.value || input1.value.length === 0;
                const isEmpty2 = input2 ? (!input2.value || input2.value.length !== 4) : false;
                const isEmpty = isEmpty1 || isEmpty2; // disable if either input is empty (when input2 exists)

                button.style.opacity = isEmpty ? '0.5' : '';
                button.style.pointerEvents = isEmpty ? 'none' : '';
            };

            // For badge input1, when pressed '/', focus input2
            if (id.includes("DLP_Get_Badge")) {
                input1.addEventListener("beforeinput", function (e) {
                    if (e.data === "/") {
                        e.preventDefault(); // stops the slash from ever entering the field
                        input2.focus();
                    }
                });
            }

            // Input 1: numeric-only, no leading zero, max length 9
            input1.addEventListener("input", function () {
                this.value = this.value.replace(/[^0-9]/g, "");
                if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                if (this.value.length > 9) this.value = this.value.slice(0, 9);
                updateButtonState();
            });

            // Input 2 (if present): mirror input1 rules, then update state
            if (input2) {
                input2.addEventListener("input", function () {
                    this.value = this.value.replace(/[^0-9]/g, "");
                    if (this.value.length === 1 && this.value[0] === '0') this.value = this.value.slice(1);
                    if (this.value.length > 9) this.value = this.value.slice(0, 9);
                    updateButtonState();
                });
            }

            // Initialize state considering both inputs
            updateButtonState();
        });

        function updatePinnedItems() {
            const pinnedIds = storageLocal.pins.home || [];
            for (const id in ids) {
                if (id.endsWith("1_ID")) {
                    const element = document.getElementById(id);
                    if (element) {
                        if (pinnedIds.includes(id)) {
                            if (!storageLocal.settings.showSuper && id.includes("DLP_Get_SUPER")) continue;
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
    function initAndObserveMagneticHover() {
        const MARK = 'data-dlp-magnetic-hover-initialized';

        document.querySelectorAll('.DLP_Magnetic_Hover_1').forEach((el) => {
            if (!el.hasAttribute(MARK)) {
                initializeMagneticHover(el);
                el.setAttribute(MARK, 'true');
            }
        });

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;

                    if (node.classList.contains('DLP_Magnetic_Hover_1') && !node.hasAttribute(MARK)) {
                        initializeMagneticHover(node);
                        node.setAttribute(MARK, 'true');
                    }

                    node.querySelectorAll?.('.DLP_Magnetic_Hover_1').forEach((desc) => {
                        if (!desc.hasAttribute(MARK)) {
                            initializeMagneticHover(desc);
                            desc.setAttribute(MARK, 'true');
                        }
                    });
                });
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    initAndObserveMagneticHover();

    function initializeDefaultHover(element) {
        element.addEventListener('pointerup', (e) => {
            const rect = element.getBoundingClientRect();
            const isPointerWithinElement = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            if (isPointerWithinElement) {
                playHaptic();
            }
        });
    }
    function initAndObserveDefaultHover() {
        const MARK = 'data-dlp-default-hover-initialized';

        document.querySelectorAll('.DLP_Hover_1').forEach((el) => {
            if (!el.hasAttribute(MARK)) {
                initializeDefaultHover(el);
                el.setAttribute(MARK, 'true');
            }
        });

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;

                    if (node.classList.contains('DLP_Hover_1') && !node.hasAttribute(MARK)) {
                        initializeDefaultHover(node);
                        node.setAttribute(MARK, 'true');
                    }

                    node.querySelectorAll?.('.DLP_Hover_1').forEach((desc) => {
                        if (!desc.hasAttribute(MARK)) {
                            initializeDefaultHover(desc);
                            desc.setAttribute(MARK, 'true');
                        }
                    });
                });
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    initAndObserveDefaultHover();


    let DLP_Server_Connection_Button = document.getElementById("DLP_Main_1_Server_Connection_Button_1_ID");
    let DLP_Server_Connection_Button_2 = document.getElementById("DLP_Secondary_1_Server_Connection_Button_1_ID");
    DLP_Server_Connection_Button.addEventListener('click', () => {
        if (DLP_Server_Connection_Button.getAttribute("data-dlp-connection-status") === "outdated") {
            window.open("https://duolingopro.net/update/userscript", "_blank");
        } else if (DLP_Server_Connection_Button.getAttribute("data-dlp-connection-status") === "error") {
            window.open("https://status.duolingopro.net", "_blank");
        }
    });
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
    const pendingTempMessages = new Map();
    let chatMemoryFingerprints = [];
    let chatMessageLookup = new Map();

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
            message_id: message?.message_id ?? null,
            message: message?.message ?? '',
            profile_picture: message?.profile_picture ?? '',
            role: message?.role ?? '',
            send_time: message?.send_time ?? null,
            status: message?.status ?? '',
            reply_to: message?.reply_to ?? null
        };

        try {
            return JSON.stringify(normalizeMessageValue(relevantData));
        } catch (error) {
            console.error('Failed to compute message fingerprint', error);
            return JSON.stringify({
                message_id: message?.message_id ?? null,
                send_time: message?.send_time ?? null
            });
        }
    }

    function resolveMessageKey(msg) {
        if (!msg || typeof msg !== 'object') return null;
        if (msg?.message_id !== undefined && msg?.message_id !== null) {
            return String(msg.message_id);
        }
        if (msg?.send_time !== undefined && msg?.send_time !== null) {
            return String(msg.send_time);
        }
        return null;
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
    let onboardingProcessing = false;
    function connectToServer() {
        let mainInputsDiv1 = document.getElementById('DLP_Main_Inputs_1_Divider_1_ID');

        const chatKeyValue = storageLocal?.chatKey?.[0] ?? false;

        //fetch(apiURL + '/server', {
        fetch('https://api.duolingopro.net/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version: VERSION_FULL,
                key: storageLocal.random16,
                ...(chatKeyValue && { chat_key: chatKeyValue })
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.global || data.versions) {
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
                        if (chatParent?.querySelector('#DLP_Inset_Group_3')?.style.display !== 'none') chatParent.querySelector('#DLP_Inset_Group_3').style.display = 'none';
                        if (chatBox?.style.display === 'none') chatBox.style.display = 'flex';

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
                            const combinedMessages = [];
                            let sequenceCounter = 0;
                            const resolveTimestamp = (msg) => {
                                const rawTimestamp = msg?.send_time;
                                if (rawTimestamp === undefined || rawTimestamp === null) {
                                    return Number.MAX_SAFE_INTEGER;
                                }
                                const numericTimestamp = Number(rawTimestamp);
                                if (!Number.isFinite(numericTimestamp)) {
                                    return Number.MAX_SAFE_INTEGER;
                                }
                                return numericTimestamp < 1e12 ? numericTimestamp * 1000 : numericTimestamp;
                            };

                            incomingMessages.forEach(message => {
                                combinedMessages.push({
                                    message,
                                    tempId: false,
                                    sequence: sequenceCounter++
                                });
                            });
                            pendingTempMessages.forEach((tempMessage, tempId) => {
                                combinedMessages.push({
                                    message: tempMessage,
                                    tempId,
                                    sequence: sequenceCounter++
                                });
                            });

                            combinedMessages.sort((a, b) => {
                                const timeA = resolveTimestamp(a.message);
                                const timeB = resolveTimestamp(b.message);
                                if (timeA === timeB) {
                                    return a.sequence - b.sequence;
                                }
                                return timeA - timeB;
                            });

                            chatMessageLookup.clear();
                            incomingMessages.forEach(msg => {
                                const key = resolveMessageKey(msg);
                                if (key) {
                                    chatMessageLookup.set(key, msg);
                                }
                                if (msg?.send_time !== undefined && msg?.send_time !== null) {
                                    const sendKey = String(msg.send_time);
                                    if (sendKey && sendKey !== key) {
                                        chatMessageLookup.set(sendKey, msg);
                                    }
                                }
                            });

                            combinedMessages.forEach(({ message, tempId }) => {
                                createMessage(message, false, tempId || false);
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

                        const knownMessageIds = (storageLocal.chats ?? []).map(id => (id === null || id === undefined) ? id : String(id));

                        if (pageHistory[pageHistory.length - 1] === 11) {
                            const newMessageIds = chatMemory.map(resolveMessageKey);
                            if (!areArraysEqual(knownMessageIds, newMessageIds)) {
                                storageLocal.chats = newMessageIds;
                                saveStorageLocal();
                            }
                        } else {
                            incomingMessages.forEach(msg => {
                                const messageKey = resolveMessageKey(msg);
                                const sendTimeKey = (msg?.send_time !== undefined && msg?.send_time !== null) ? String(msg.send_time) : null;
                                const alreadyKnown = (messageKey && knownMessageIds.includes(messageKey)) || (sendTimeKey && knownMessageIds.includes(sendTimeKey));
                                if (!alreadyKnown && !newReplyButtonActive) {
                                    newReplyButtonActive = true;
                                    updateConnetionButtonStyles(document.getElementById("DLP_Main_Feedback_1_Button_1_ID"), { button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: 'New Reply', icon: '􀝗' }, { text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite' });
                                    showNotification({ icon: "􂄺", color: "rgb(var(--DLP-blue))" }, "Support Team Response", "You have a new message from our support team.", 30);
                                }
                            });
                        }
                    }


                    const globalData = data.global;
                    const versionData = data.versions[VERSION_FULL];
                    const warnings = versionData.warnings || [];
                    const scriptData = data.script;

                    const termsText = Object.entries(globalData.terms)[0][1];
                    newTermID = Object.entries(globalData.terms)[0][0];

                    //console.log('Global Warning:', globalData.warning);
                    //console.log('Notifications:', globalData.notifications);

                    document.querySelector(`#DLP_Terms_Main_Text_1_ID`).innerHTML = termsText;

                    if (versionData.status === 'latest') {
                        if (serverConnectedBefore !== 'yes') {
                            updateReleaseNotes(warnings);
                            mainInputsDiv1.style.opacity = '1';
                            mainInputsDiv1.style.pointerEvents = 'auto';
                            updateConnetionButtonStyles(DLP_Server_Connection_Button, { button: 'rgb(var(--DLP-green))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: systemText[systemLanguage][108], icon: '􀤆' }, { text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite' });
                            updateConnetionButtonStyles(DLP_Server_Connection_Button_2, { button: 'rgb(var(--DLP-green))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: systemText[systemLanguage][108], icon: '􀤆' }, { text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite' });
                            DLP_Server_Connection_Button.setAttribute("data-dlp-connection-status", "connected");
                            DLP_Server_Connection_Button_2.setAttribute("data-dlp-connection-status", "connected");
                            if (serverConnectedBefore === 'error' || serverConnectedBeforeNotification) {
                                serverConnectedBeforeNotification.close();
                                serverConnectedBeforeNotification = false;
                            }
                            serverConnectedBefore = 'yes';
                        }
                        if (!storageLocal.onboarding) {
                            if (!onboardingProcessing) {
                                onboardingProcessing = true;
                                goToPage(10, null, true);
                            }
                        } else if (storageLocal.terms === newTermID) {
                            if (recentUpdateDetected && pageHistory[pageHistory.length - 1] !== 9) {
                                document.querySelector('#DLP_Main_Box_Divider_9_ID').querySelector('.DLP_HStack_Auto_Top').querySelector(':scope > .DLP_Text_Style_2').style.display = 'block';
                                document.querySelector('#DLP_Main_Box_Divider_9_ID').querySelector('#DLP_Universal_Back_1_Button_1_ID').style.display = 'none';
                                goToPage(9, null, true);
                            }
                        } else {
                            if (![5, 6].includes(pageHistory[pageHistory.length - 1])) goToPage(5, null, true);
                            document.querySelector(`#DLP_Main_Box_Divider_5_ID`).querySelector(`#DLP_Terms_1_Text_1_ID`).innerHTML = "We have updated our Terms & Conditions. Please read them carefully and accept to continue using Duolingo PRO 3.1.";
                        }
                    } else if (serverConnectedBefore !== 'outdated') {
                        updateConnetionButtonStyles(DLP_Server_Connection_Button, { button: 'rgb(var(--DLP-orange))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: 'Outdated', icon: '􀁟' }, { text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite' });
                        updateConnetionButtonStyles(DLP_Server_Connection_Button_2, { button: 'rgb(var(--DLP-orange))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: 'Outdated', icon: '􀁟' }, { text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite' });
                        DLP_Server_Connection_Button.setAttribute("data-dlp-connection-status", "outdated");
                        DLP_Server_Connection_Button_2.setAttribute("data-dlp-connection-status", "outdated");
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

                    if (scriptData) {
                        if (scriptData.ping !== storageSession.script.ping) {
                            createConnectToServerInterval(scriptData.ping);
                        }
                        if (scriptData.donate === null) {
                            document.getElementById('DLP_Main_Donate_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Secondary_Donate_Button_1_ID').style.opacity = '';
                        } else if (scriptData.donate === false) {
                            document.getElementById('DLP_Main_Donate_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Secondary_Donate_Button_1_ID').style.opacity = '0.5';
                        }
                        if (scriptData.boost === null) {
                            document.getElementById('DLP_Secondary_Earn_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Main_Earn_Button_1_ID').style.opacity = '';
                        } else if (scriptData.boost === false) {
                            document.getElementById('DLP_Secondary_Earn_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Main_Earn_Button_1_ID').style.opacity = '0.5';
                        }
                        if (scriptData.youtube === null) {
                            document.getElementById('DLP_Main_YouTube_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Secondary_YouTube_Button_1_ID').style.opacity = '';
                        } else if (scriptData.youtube === false) {
                            document.getElementById('DLP_Main_YouTube_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Secondary_YouTube_Button_1_ID').style.opacity = '0.5';
                        }
                        if (scriptData.discord === null) {
                            document.getElementById('DLP_Main_Discord_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Secondary_Discord_Button_1_ID').style.opacity = '';
                        } else if (scriptData.discord === false) {
                            document.getElementById('DLP_Main_Discord_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Secondary_Discord_Button_1_ID').style.opacity = '0.5';
                        }
                        if (scriptData.github === null) {
                            document.getElementById('DLP_Main_GitHub_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Secondary_GitHub_Button_1_ID').style.opacity = '';
                        } else if (scriptData.github === false) {
                            document.getElementById('DLP_Main_GitHub_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Secondary_GitHub_Button_1_ID').style.opacity = '0.5';
                        }
                        if (scriptData.settings.enabled === null) {
                            document.getElementById('DLP_Main_Settings_1_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Secondary_Settings_1_Button_1_ID').style.opacity = '';
                        } else if (scriptData.settings.enabled === false) {
                            document.getElementById('DLP_Main_Settings_1_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Secondary_Settings_1_Button_1_ID').style.opacity = '0.5';
                            if (pageHistory[pageHistory.length - 1] === 7) {
                                goToPage(1, 'DLP_Universal_Back_1_Button_1_ID', true);
                            }
                        }
                        if (scriptData.support.enabled === null) {
                            document.getElementById('DLP_Main_Feedback_1_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Secondary_Feedback_1_Button_1_ID').style.opacity = '';
                        } else if (scriptData.support.enabled === false) {
                            document.getElementById('DLP_Main_Feedback_1_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Secondary_Feedback_1_Button_1_ID').style.opacity = '0.5';
                            if (pageHistory[pageHistory.length - 1] === 11) {
                                goToPage(1, 'DLP_Universal_Back_1_Button_1_ID', true);
                            }
                        }
                        if (scriptData.release_notes === null) {
                            document.getElementById('DLP_Main_Whats_New_1_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Secondary_Whats_New_1_Button_1_ID').style.opacity = '';
                        } else if (scriptData.release_notes === false) {
                            document.getElementById('DLP_Main_Whats_New_1_Button_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Secondary_Whats_New_1_Button_1_ID').style.opacity = '0.5';
                            if (pageHistory[pageHistory.length - 1] === 9) {
                                goToPage(1, 'DLP_Universal_Back_1_Button_1_ID', true);
                            }
                        }
                        if (scriptData.support.file_upload.enabled === null) {
                            if (document.getElementById("DLP_Main_Box_Divider_11_ID").querySelector('#DLP_Attachment_Preview_Parent').childElementCount - 1 < scriptData.support.file_upload.max_files) {
                                document.getElementById("DLP_Main_Box_Divider_11_ID").querySelector('#DLP_Inset_Button_1_ID').style.opacity = '';
                            }
                        } else if (scriptData.support.file_upload.enabled === false) {
                            document.getElementById("DLP_Main_Box_Divider_11_ID").querySelector('#DLP_Inset_Button_1_ID').style.opacity = '0.5';
                        }

                        if (scriptData.settings.show_solve === null) {
                            document.getElementById('DLP_Settings_Show_Solve_Buttons_1_ID').style.opacity = '';
                            document.getElementById('DLP_Settings_Show_Solve_Buttons_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').removeAttribute('data-dlp-server-disabled');
                            handleToggleClick(document.getElementById('DLP_Settings_Show_Solve_Buttons_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.showSolveButtons ? 1 : 0);
                        } else if (scriptData.settings.show_solve === false) {
                            document.getElementById('DLP_Settings_Show_Solve_Buttons_1_ID').style.opacity = '0.5';
                            handleToggleClick(document.getElementById('DLP_Settings_Show_Solve_Buttons_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), 1);
                            document.getElementById('DLP_Settings_Show_Solve_Buttons_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').setAttribute('data-dlp-server-disabled', '');
                        }
                        if (scriptData.settings.show_autoserver === null) {
                            document.getElementById('DLP_Settings_Show_AutoServer_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Settings_Show_AutoServer_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').removeAttribute('data-dlp-server-disabled');
                            handleToggleClick(document.getElementById('DLP_Settings_Show_AutoServer_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.showAutoServerButton ? 1 : 0);
                        } else if (scriptData.settings.show_autoserver === false) {
                            document.getElementById('DLP_Settings_Show_AutoServer_Button_1_ID').style.opacity = '0.5';
                            handleToggleClick(document.getElementById('DLP_Settings_Show_AutoServer_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), 0);
                            document.getElementById('DLP_Settings_Show_AutoServer_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').setAttribute('data-dlp-server-disabled', '');
                        }
                        if (scriptData.settings.random_legacy_solve_speed === null) {
                            document.getElementById('DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').removeAttribute('data-dlp-server-disabled');
                            handleToggleClick(document.getElementById('DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.randomSolveSpeed ? 1 : 0);
                        } else if (scriptData.settings.random_legacy_solve_speed === false) {
                            document.getElementById('DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID').style.opacity = '0.5';
                            handleToggleClick(document.getElementById('DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), 0);
                            document.getElementById('DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').setAttribute('data-dlp-server-disabled', '');
                        }
                        if (scriptData.settings.custom_random_legacy_solve_speed === null && scriptData.settings.random_legacy_solve_speed === null) {
                            if (DLP_Settings_Var.randomSolveSpeed) {
                                document.getElementById('DLP_Settings_Legacy_Solve_Speed_1_ID').style.opacity = '';
                            }
                        } else if (scriptData.settings.random_legacy_solve_speed === false) {
                            document.getElementById('DLP_Settings_Legacy_Solve_Speed_1_ID').style.display = 'none';
                        } else if (scriptData.settings.custom_random_legacy_solve_speed === false) {
                            document.getElementById('DLP_Settings_Legacy_Solve_Speed_1_ID').style.opacity = '0.5';
                            document.getElementById('DLP_Settings_Legacy_Solve_Speed_1_ID').querySelector('.DLP_Input_Style_1_Active').setAttribute('data-dlp-server-disabled', '');
                        }
                        if (scriptData.settings.anonymous_analytics === null) {
                            document.getElementById('DLP_Settings_Help_Us_Make_Better_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Settings_Help_Us_Make_Better_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').removeAttribute('data-dlp-server-disabled');
                            handleToggleClick(document.getElementById('DLP_Settings_Help_Us_Make_Better_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.anonymousUsageData ? 1 : 0);
                        } else if (scriptData.settings.anonymous_analytics === false) {
                            document.getElementById('DLP_Settings_Help_Us_Make_Better_Button_1_ID').style.opacity = '0.5';
                            handleToggleClick(document.getElementById('DLP_Settings_Help_Us_Make_Better_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), 0);
                            document.getElementById('DLP_Settings_Help_Us_Make_Better_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').setAttribute('data-dlp-server-disabled', '');
                        }
                        if (scriptData.settings.reduce_effects === null) {
                            document.getElementById('DLP_Settings_Reduce_Effects_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Settings_Reduce_Effects_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').removeAttribute('data-dlp-server-disabled');
                            handleToggleClick(document.getElementById('DLP_Settings_Reduce_Effects_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.reduceEffects ? 1 : 0);
                        } else if (scriptData.settings.reduce_effects === false) {
                            document.getElementById('DLP_Settings_Reduce_Effects_Button_1_ID').style.opacity = '0.5';
                            handleToggleClick(document.getElementById('DLP_Settings_Reduce_Effects_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), 0);
                            document.getElementById('DLP_Settings_Reduce_Effects_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').setAttribute('data-dlp-server-disabled', '');
                        }
                        if (scriptData.settings.free_duolingo_max === null) {
                            document.getElementById('DLP_Settings_Free_Local_Super_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Settings_Free_Local_Super_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').removeAttribute('data-dlp-server-disabled');
                            handleToggleClick(document.getElementById('DLP_Settings_Free_Local_Super_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.localSuper ? 1 : 0);
                        } else if (scriptData.settings.free_duolingo_max === false) {
                            document.getElementById('DLP_Settings_Free_Local_Super_Button_1_ID').style.opacity = '0.5';
                            handleToggleClick(document.getElementById('DLP_Settings_Free_Local_Super_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), 0);
                            document.getElementById('DLP_Settings_Free_Local_Super_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').setAttribute('data-dlp-server-disabled', '');
                        }
                        if (scriptData.settings.show_super_trial === null) {
                            document.getElementById('DLP_Settings_Show_Super_Trial_Button_1_ID').style.opacity = '';
                            document.getElementById('DLP_Settings_Show_Super_Trial_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').removeAttribute('data-dlp-server-disabled');
                            handleToggleClick(document.getElementById('DLP_Settings_Show_Super_Trial_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), DLP_Settings_Var.showSuper ? 1 : 0);
                        } else if (scriptData.settings.show_super_trial === false) {
                            document.getElementById('DLP_Settings_Show_Super_Trial_Button_1_ID').style.opacity = '0.5';
                            handleToggleClick(document.getElementById('DLP_Settings_Show_Super_Trial_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID'), 0);
                            document.getElementById('DLP_Settings_Show_Super_Trial_Button_1_ID').querySelector('#DLP_Inset_Toggle_1_ID').setAttribute('data-dlp-server-disabled', '');
                        }

                        storageSession.script = scriptData;
                        saveStorageSession();
                    }

                    //if (storageLocal.languagePackVersion !== versionData.languagePackVersion) {
                    //    fetch(serverURL + "/static/3.0/resources/language_pack.json")
                    //        .then(response => response.json())
                    //        .then(data => {
                    //            if (data[VERSION_FULL]) {
                    //                storageLocal.languagePack = data[VERSION_FULL];
                    //                console.log(data[VERSION_FULL]);
                    //                storageLocal.languagePackVersion = versionData.languagePackVersion;
                    //                saveStorageLocal();
                    //            }
                    //        })
                    //        .catch(error => console.error('Error fetching systemText:', error));
                    //}
                } else {
                    console.error(`Version ${VERSION_FULL} not found in the data`);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                if (serverConnectedBefore !== 'error') {
                    mainInputsDiv1.style.opacity = '0.5';
                    mainInputsDiv1.style.pointerEvents = 'none';
                    updateConnetionButtonStyles(DLP_Server_Connection_Button, { button: 'rgb(var(--DLP-pink))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: systemText[systemLanguage][109], icon: '􀇿' }, { text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite' });
                    updateConnetionButtonStyles(DLP_Server_Connection_Button_2, { button: 'rgb(var(--DLP-pink))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' }, { text: systemText[systemLanguage][109], icon: '􀇿' }, { text: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite', icon: 'DLP_Pulse_Opacity_Animation_1 6s ease-in-out infinite' });
                    DLP_Server_Connection_Button.setAttribute("data-dlp-connection-status", "error");
                    DLP_Server_Connection_Button_2.setAttribute("data-dlp-connection-status", "error");
                    serverConnectedBeforeNotification = showNotification("error", systemText[systemLanguage][231], systemText[systemLanguage][232], 0);
                    serverConnectedBefore = 'error';
                }
            });
    }
    connectToServer();
    let connectToServerInterval;
    function createConnectToServerInterval(ms) {
        clearInterval(connectToServerInterval);
        connectToServerInterval = setInterval(() => {
            //if (windowBlurState) connectToServer();
            if (document.visibilityState === "visible" || isAutoMode) connectToServer();
        }, ms);
    }
    createConnectToServerInterval(storageSession.script.ping);

    function updateOnboardingSetup() {
        const onboardingSetupContainer = document.getElementById('DLP_Main_Box_Divider_12_ID');
        const releaseNotesContainer = onboardingSetupContainer.querySelector('#DLP_Onboarding_Setup_List_1_ID');
        const controlsContainer = onboardingSetupContainer.querySelector('#DLP_Onboarding_Setup_Controls_1_ID');
        const prevButton = controlsContainer.querySelector('#DLP_Inset_Button_1_ID');
        const nextButton = controlsContainer.querySelector('#DLP_Inset_Button_2_ID');

        let currentWarningIndex = 0;
        const totalWarnings = releaseNotesContainer.children.length;

        function updateButtonOpacity(current, total, prevButton, nextButton) {
            if (current === 0) {
                prevButton.style.opacity = '0.5';
                prevButton.style.pointerEvents = 'none';
            } else {
                prevButton.style.opacity = '1';
                prevButton.style.pointerEvents = 'auto';
            }
        }

        updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);

        prevButton.addEventListener('click', () => {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            if (currentWarningIndex > 0) {
                const oldWarning = releaseNotesContainer.querySelector(`#setting-${currentWarningIndex}`);
                const newWarning = releaseNotesContainer.querySelector(`#setting-${currentWarningIndex - 1}`);

                if (flag04) {
                    // Animated transition
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
                        updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                        setTimeout(() => {
                            isBusySwitchingPages = false;
                        }, 400);
                    }, 400);
                } else {
                    // No animation: instant switch
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.style.filter = '';
                    newWarning.style.opacity = '';
                    currentWarningIndex--;
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                    isBusySwitchingPages = false;
                }
            } else {
                isBusySwitchingPages = false;
            }
        });

        nextButton.addEventListener('click', () => {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            if (currentWarningIndex < totalWarnings - 1) {
                const oldWarning = releaseNotesContainer.querySelector(`#setting-${currentWarningIndex}`);
                const newWarning = releaseNotesContainer.querySelector(`#setting-${currentWarningIndex + 1}`);

                if (flag04) {
                    // Animated transition
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
                        updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                        setTimeout(() => {
                            isBusySwitchingPages = false;
                        }, 400);
                    }, 400);
                } else {
                    // No animation: instant switch
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.style.filter = '';
                    newWarning.style.opacity = '';
                    currentWarningIndex++;
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                    isBusySwitchingPages = false;
                }
            } else {
                isBusySwitchingPages = false;
                storageLocal.onboarding = true;
                storageLocal.settings.anonymousUsageData = DLP_Settings_Var.anonymousUsageData;
                storageLocal.settings.localSuper = DLP_Settings_Var.localSuper;
                saveStorageLocal();
                goToPage(1);
                if (DLP_Settings_Var.anonymousUsageData || storageLocal.settings.localSuper) location.reload();
            }
        });
    }
    updateOnboardingSetup();

    let fetchingUserBioData = false;
    async function fetchUserBioData() {
        fetchingUserBioData = true;
        if (debug) console.log('Fetching user bio data');
        const userResponse = await fetch('https://www.duolingo.com/2017-06-30/users/' + JSON.parse(atob(document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1].split('.')[1])).sub + '?fields=name,username,picture', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='))?.split('=')[1]}`,
                Accept: 'application/json'
            },
        });
        if (!userResponse.ok) {
            fetchingUserBioData = false;
            return;
        }
        const userData = await userResponse.json();
        if (debug) console.log('Fetched user bio data');
        userBioData = {
            username: (userData.name && userData.name.trim().length > 0) ? userData.name : userData.username,
            profile_picture: "https:" + userData.picture + "/xlarge"
        };
        fetchingUserBioData = false;
    }

    function createMessage(message, isBefore = false, isTemp = false) {
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

        const messageKey = (() => {
            if (message?.message_id !== undefined && message?.message_id !== null) {
                return String(message.message_id);
            }
            if (message?.send_time !== undefined && message?.send_time !== null) {
                return String(message.send_time);
            }
            if (isTemp) {
                return `temp-${isTemp}`;
            }
            return '';
        })();

        let lastChatChild = chatBox.lastElementChild;
        if (isBefore) lastChatChild = isBefore.previousElementSibling;

        const tempState = isTemp ? pendingTempMessages.get(isTemp) : null;
        const failedTemp = Boolean(tempState?.sendFailed);

        function getReplyKey(message) {
            const rawReplyTo = message?.reply_to;
            if (typeof rawReplyTo === 'number' && Number.isFinite(rawReplyTo)) {
                return String(rawReplyTo);
            }
            if (typeof rawReplyTo === 'string') {
                const trimmed = rawReplyTo.trim();
                if (/^\d+$/.test(trimmed)) {
                    return trimmed;
                }
            }
            if (typeof rawReplyTo === 'bigint') {
                return rawReplyTo.toString();
            }
            return null;
        }

        function hasNumericReply(message) {
            return Boolean(getReplyKey(message));
        }

        function createReplyPreview(message) {
            const replyKey = getReplyKey(message);
            if (!replyKey) {
                return null;
            }

            function deriveTargetFromDom(key) {
                if (!chatBox) return null;

                const messageNodes = chatBox.querySelectorAll('[data-message-id]');
                let matchedNode = null;
                for (const node of messageNodes) {
                    if (node.getAttribute('data-message-id') === key) {
                        matchedNode = node;
                        break;
                    }
                }

                if (!matchedNode) {
                    const groupCandidate = chatBox.querySelector(`[data-group-id="${key}"]`);
                    if (groupCandidate) {
                        matchedNode = groupCandidate.querySelector('[data-message-id]');
                    }
                }

                if (!matchedNode) return null;

                const result = {
                    message_id: key,
                    message: (matchedNode.textContent || '').trim()
                };

                const sendAttr = matchedNode.getAttribute('data-message-sent');
                if (sendAttr && sendAttr !== '') {
                    const numericSend = Number(sendAttr);
                    result.send_time = Number.isFinite(numericSend) ? numericSend : sendAttr;
                }

                const groupNode = matchedNode.closest('[data-group-id]');
                if (groupNode) {
                    if (!result.message) {
                        const fallbackNode = groupNode.querySelector('[data-message-id]');
                        if (fallbackNode && fallbackNode !== matchedNode) {
                            const fallbackText = (fallbackNode.textContent || '').trim();
                            if (fallbackText) {
                                result.message = fallbackText;
                            }
                        }
                    }

                    const authorNameAttr = groupNode.getAttribute('data-author-name');
                    if (authorNameAttr) {
                        result.author = authorNameAttr;
                    }

                    const headerNode = groupNode.querySelector('[data-chat-header="true"]');
                    if (headerNode) {
                        const authorElement = headerNode.querySelector('.DLP_HStack_6 p.DLP_Text_Style_1');
                        if (authorElement) {
                            const authorText = authorElement.textContent || '';
                            if (authorText.trim()) {
                                result.author = authorText.trim();
                            }
                            let accentColor = authorElement.style?.color?.trim();
                            if ((!accentColor || accentColor === '') && typeof window !== 'undefined' && document.contains(authorElement)) {
                                try {
                                    accentColor = window.getComputedStyle(authorElement).color;
                                } catch (error) {
                                    console.error('Failed to compute accent color for reply preview', error);
                                }
                            }
                            if (accentColor) {
                                result.accent = accentColor;
                            }
                        }

                        const avatarElement = headerNode.querySelector('div[style*="background"]');
                        if (avatarElement) {
                            const styleAttr = avatarElement.getAttribute('style') || '';
                            const urlMatch = styleAttr.match(/url\((['"]?)(.*?)\1\)/);
                            if (urlMatch && urlMatch[2]) {
                                result.profile_picture = urlMatch[2];
                            }
                        }
                    }
                }

                if ((!result.message || result.message === '') && matchedNode.classList?.contains('DLP_Hide_Scrollbar')) {
                    result.message = 'Attachment';
                }

                return result;
            }

            let targetMessage = chatMessageLookup.get(replyKey);
            if (!targetMessage && chatMemory.length) {
                targetMessage = chatMemory.find(existing => resolveMessageKey(existing) === replyKey);
            }

            function isMeaningful(value, type) {
                if (value === undefined || value === null) return false;
                const trimmed = String(value).trim();
                if (!trimmed) return false;
                if (type === 'author' && trimmed === 'The User Who Was Replied') return false;
                if (type === 'message' && trimmed === 'Reply content') return false;
                return true;
            }

            const domMessage = deriveTargetFromDom(replyKey);
            if (domMessage) {
                const merged = targetMessage ? { ...targetMessage } : {};

                if (isMeaningful(domMessage.author, 'author')) {
                    merged.author = domMessage.author;
                }
                if (isMeaningful(domMessage.profile_picture)) {
                    merged.profile_picture = domMessage.profile_picture;
                }
                if (isMeaningful(domMessage.accent)) {
                    merged.accent = domMessage.accent;
                }

                if (isMeaningful(domMessage.message, 'message')) {
                    if (!isMeaningful(merged.message, 'message') || domMessage.message !== 'Attachment') {
                        merged.message = domMessage.message;
                    }
                } else if (!isMeaningful(merged.message, 'message') && domMessage.message) {
                    merged.message = domMessage.message;
                }

                if (domMessage.send_time !== undefined && domMessage.send_time !== null && (merged.send_time === undefined || merged.send_time === null || merged.send_time === '')) {
                    merged.send_time = domMessage.send_time;
                }
                if (!isMeaningful(merged.message_id)) {
                    merged.message_id = replyKey;
                }

                targetMessage = merged;
                chatMessageLookup.set(replyKey, targetMessage);
                const derivedSendKey = targetMessage?.send_time;
                if (derivedSendKey !== undefined && derivedSendKey !== null) {
                    const sendKey = String(derivedSendKey);
                    if (sendKey && sendKey !== replyKey) {
                        chatMessageLookup.set(sendKey, targetMessage);
                    }
                }
            }

            const previewWrapper = document.createElement('div');
            const targetKey = resolveMessageKey(targetMessage) ?? replyKey;
            const targetSendTime = targetMessage?.send_time ?? '';
            const previewAccent = targetMessage?.accent && targetMessage.accent !== '' ? targetMessage.accent : (message?.accent || 'rgb(var(--DLP-blue))');
            const previewAuthor = targetMessage?.author ?? message?.author ?? 'Unknown user';
            const previewAvatar = targetMessage?.profile_picture ?? message?.profile_picture ?? '';
            const avatarBackground = previewAvatar ? `background: url(${previewAvatar}) 50% center / cover no-repeat white;` : 'background: rgba(var(--color-snow), 1);';
            const previewMessage = (targetMessage?.message && targetMessage.message.trim() !== '') ? targetMessage.message : 'Original message unavailable';

            previewWrapper.innerHTML = `
                <div class="DLP_HStack_8" data-reply-preview="true" style="padding-left: 24px; position: relative;">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: 9px; top: 9px; z-index: -1;">
                        <path d="M17 1H11C5.47715 1 1 5.47715 1 11V17" stroke="rgb(var(--color-eel), 0.20)" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div class="DLP_HStack_6">
                        <div style="width: 20px; height: 20px; border-radius: 16px; outline: rgba(0, 0, 0, 0.2) solid 2px; outline-offset: -2px; ${avatarBackground}"></div>
                        <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: ${previewAccent}; white-space: pre;">${previewAuthor}</p>
                    </div>
                    <p class="DLP_Text_Style_1" data-message-id="${targetKey}" data-message-sent="${targetSendTime}" style="align-self: stretch; white-space: nowrap; overflow-wrap: anywhere; word-break: break-word; text-overflow: ellipsis; -webkit-line-clamp: 1; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical;">${previewMessage}</p>
                </div>
            `;

            return previewWrapper.firstElementChild;
        }

        function ensureReplyPreview(container, message) {
            if (!container) return;
            const replyKey = getReplyKey(message);
            const existingPreview = container.querySelector('[data-reply-preview="true"]');

            if (!replyKey) {
                if (existingPreview) existingPreview.remove();
                return;
            }

            const headerElement = container.querySelector('[data-chat-header="true"]');
            if (!headerElement) {
                if (existingPreview) existingPreview.remove();
                return;
            }

            if (existingPreview) {
                existingPreview.remove();
            }

            const previewElement = createReplyPreview(message);
            if (previewElement) {
                container.insertBefore(previewElement, headerElement);
            }
        }

        function createStartersMessage(message) {
            const temp = document.createElement('div');
            temp.innerHTML = `
                <div class="DLP_VStack_4" data-group-id="${messageKey}" data-group-sent="${message.send_time ?? ''}" data-author-name="${message.author}">
                    <div data-chat-header="true" style="display: flex; justify-content: space-between; align-items: center; align-self: stretch;">
                        <div class="DLP_HStack_6">
                            <div style="width: 20px; height: 20px; border-radius: 16px; outline: rgba(0, 0, 0, 0.2) solid 2px; outline-offset: -2px; background: url(${message.profile_picture}) 50% center / cover no-repeat white;"></div>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: ${message.accent};">${message.author}</p>
                        </div>
                        <div class="DLP_HStack_6">
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: ${message.accent};">${message.role}</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" style="color: ${message.accent}; font-size: 4px;">􀀁</p>
                            <p class="DLP_Text_Style_1 DLP_NoSelect" data-time-element="true" style="color: ${message.accent};">${formatTimeAgo(message.send_time)}</p>
                        </div>
                    </div>
                </div>
            `;
            const newElement = temp.firstElementChild;
            chatBox.appendChild(newElement);
            lastChatChild = newElement;

            ensureReplyPreview(lastChatChild, message);

            const timeElement = lastChatChild.querySelector('[data-time-element="true"]');
            if (timeElement) {
                updateTimeAgo(timeElement, message.send_time);
            }

            createContinuationMessage(message, true);
        }

        function createContinuationMessage(message, skipGroupChecks = false) {
            const firstMessageTimestampAttr = lastChatChild.getAttribute('data-group-sent') ?? lastChatChild.getAttribute('data-group-timestamp');
            const firstMessageTimestamp = firstMessageTimestampAttr ? parseInt(firstMessageTimestampAttr) : 0;
            const replyKey = getReplyKey(message);

            if (!skipGroupChecks) {
                if (replyKey) {
                    createStartersMessage(message);
                    return;
                }
                if (toMilliseconds(message.send_time) - toMilliseconds(firstMessageTimestamp) > 900000) { // 15 minutes, 900,000 milliseconds
                    createStartersMessage(message);
                    return;
                }
            }

            if (replyKey) {
                ensureReplyPreview(lastChatChild, message);
            }

            if (message.message !== "") {
                const continuationStyles = [
                    'align-self: stretch',
                    'white-space: pre-line',
                    'overflow-wrap: anywhere',
                    'word-break: break-word'
                ];
                if (isTemp && !failedTemp) {
                    continuationStyles.push('animation: DLP_Pulse_Opacity_Animation_2 2s ease-in-out infinite');
                }
                if (failedTemp) {
                    continuationStyles.push('color: rgba(var(--DLP-pink))');
                }
                const continuationStyleAttr = continuationStyles.join('; ') + ';';
                const temp = document.createElement('div');
                temp.innerHTML = `
                    <p class="DLP_Text_Style_1" data-message-id="${messageKey}" data-message-sent="${message.send_time ?? ''}"${isTemp ? ` data-is-temp="${isTemp}"` : ''} style="${continuationStyleAttr}">${message.message}</p>
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
                const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
                const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'm4v'];

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
                    <div data-message-id="${messageKey}" data-message-sent="${message.send_time ?? ''}"${isTemp ? ` data-is-temp="${isTemp}"` : ''} class="DLP_Hide_Scrollbar" style="display: flex; align-items: center; gap: 8px; align-self: stretch; width: 100%; overflow-y: scroll; opacity: 1; filter: blur(0px); margin-top: 0px; transition: 0.4s cubic-bezier(0.16, 1, 0.32, 1);${failedTemp ? ' color: rgba(var(--DLP-pink));' : ''}"></div>
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
                                    <p class="DLP_Text_Style_1 DLP_NoSelect">File</p>
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

        const sameAuthor = lastChatChild !== null && message.author === lastChatChild.getAttribute('data-author-name');
        const messageHasReply = hasNumericReply(message);

        if (sameAuthor && !messageHasReply) {
            createContinuationMessage(message);
        } else {
            createStartersMessage(message);
        }
    }

    async function intelligentLeaderboardBasedWarningLimit() {
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
                if (debug) console.log("Chosen leaderboard data is invalid or inactive.");
                return null;
            }

            const rankings = data.active.cohort.rankings;
            const topN = 5;
            const topScores = [...rankings].sort((a, b) => b.score - a.score).slice(0, topN).map(user => user.score);

            const userRanking = rankings.find(u => u.user_id === userId);
            const userScore = userRanking ? userRanking.score : 0;
            const avgTopScore = topScores.length ? Math.round(topScores.reduce((sum, val) => sum + val, 0) / topScores.length) : 0;

            const intelligentAmount = Math.max(0, avgTopScore - userScore);

            if (debug) {
                console.log(`Using leaderboard: ${data.active.contest.contest_id}`);
                console.log(`Average top ${topN} score:`, avgTopScore);
                console.log(`Your score:`, userScore);
                console.log(`Calculated intelligent warning limit:`, intelligentAmount);
            }

            return intelligentAmount;
        }

        const jwtToken = document.cookie.split('; ').find(cookie => cookie.startsWith('jwt_token='))?.split('=')[1];
        if (!jwtToken) {
            console.error("JWT token not found. Cannot proceed.");
            return null;
        }

        const userID = getDuolingoUserIdFromJwt(jwtToken);
        if (!userID) {
            console.error("Could not extract User ID from JWT.");
            return null;
        }

        const spedTimestamp = Date.now();
        const fetchOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        };

        try {
            const [tournamentResult, defaultResult] = await Promise.allSettled([
                fetch(`${baseUrl}${tournamentBoardId}/users/${userID}?_=${spedTimestamp}`, fetchOptions).then(res => res.json()),
                fetch(`${baseUrl}${defaultBoardId}/users/${userID}?_=${spedTimestamp}`, fetchOptions).then(res => res.json()),
            ]);

            let selectedData = null;

            if (tournamentResult.status === 'fulfilled' && tournamentResult.value.active) {
                if (debug) console.log("Tournament leaderboard is active. Using it for calculation.");
                selectedData = tournamentResult.value;
            } else if (defaultResult.status === 'fulfilled' && defaultResult.value.active) {
                if (debug) console.log("Default leaderboard is active. Using it for calculation.");
                selectedData = defaultResult.value;
            } else {
                if (debug) console.log("No active leaderboards found (neither tournament nor default).");
                if (tournamentResult.status === 'rejected') if (debug) console.error("Tournament fetch failed:", tournamentResult.reason);
                if (defaultResult.status === 'rejected') if (debug) console.error("Default fetch failed:", defaultResult.reason);
                return null;
            }

            const intelligentAmount = processLeaderboardData(selectedData, userID);
            // return intelligentAmount ?? null;
            return 20;
        } catch (error) {
            console.error("An unexpected error occurred during the fetch process:", error);
            return null;
        }
    }

    let updateReleaseNotesInitialized = false;
    function updateReleaseNotes(warnings) {
        if (updateReleaseNotesInitialized) return;
        updateReleaseNotesInitialized = true;

        const releaseNotesBox = document.getElementById('DLP_Main_Box_Divider_9_ID');
        const releaseNotesContainer = releaseNotesBox.querySelector('#DLP_Release_Notes_List_1_ID');
        const controlsContainer = releaseNotesBox.querySelector('#DLP_Release_Notes_Controls_1_ID');
        const warningCounterDisplay = controlsContainer.querySelector('#DLP_Inset_Label_1_ID');
        const prevButton = controlsContainer.querySelector('#DLP_Inset_Button_1_ID');
        const nextButton = controlsContainer.querySelector('#DLP_Inset_Button_2_ID');

        releaseNotesContainer.innerHTML = '';

        let currentWarningIndex = 0;
        const totalWarnings = warnings.length;

        function updateCounterDisplay(current, total, displayElement) {
            displayElement.querySelector('p').textContent = `${current}/${total}`;
        }

        function updateButtonOpacity(current, total, prevButton, nextButton, nextButtonEnabled = false) {
            if (current === 0) {
                prevButton.style.opacity = '0.5';
                prevButton.style.pointerEvents = 'none';
            } else {
                prevButton.style.opacity = '1';
                prevButton.style.pointerEvents = 'auto';
            }

            if (!nextButtonEnabled) {
                if (current === total - 1) {
                    nextButton.style.opacity = '0.5';
                    nextButton.style.pointerEvents = 'none';
                } else {
                    nextButton.style.opacity = '1';
                    nextButton.style.pointerEvents = 'auto';
                }
            }
        }

        warnings.forEach((warning, index) => {
            if (warning.head && warning.body && warning.icon) {
                const warningHTML = `
                <div id="warning-${index}" style="display: ${index === 0 ? 'flex' : 'none'}; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; align-self: stretch; transition: filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);">
                    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;">
                        ${warning.icon}
                        <p class="DLP_Text_Style_2">${warning.head}</p>
                        <p class="DLP_Text_Style_1" style="background: url(${serverURL}/static/images/flow/secondary/512/light.png) lightgray 50% / cover no-repeat; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: none;">${warning.tag}</p>
                    </div>
                    <p class="DLP_Text_Style_1">${warning.body}</p>
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
                const oldWarning = releaseNotesContainer.querySelector(`#warning-${currentWarningIndex}`);
                const newWarning = releaseNotesContainer.querySelector(`#warning-${currentWarningIndex - 1}`);

                if (flag04) {
                    // Animated transition
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
                } else {
                    // No animation: instant switch
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.style.filter = '';
                    newWarning.style.opacity = '';
                    currentWarningIndex--;
                    updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);
                    isBusySwitchingPages = false;
                }
            } else {
                isBusySwitchingPages = false;
            }
        });

        nextButton.addEventListener('click', () => {
            if (isBusySwitchingPages) return;
            isBusySwitchingPages = true;
            if (currentWarningIndex < totalWarnings - 1) {
                const oldWarning = releaseNotesContainer.querySelector(`#warning-${currentWarningIndex}`);
                const newWarning = releaseNotesContainer.querySelector(`#warning-${currentWarningIndex + 1}`);

                if (flag04) {
                    // Animated transition
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
                        updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton, recentUpdateDetected);
                        setTimeout(() => {
                            isBusySwitchingPages = false;
                        }, 400);
                    }, 400);
                } else {
                    // No animation: instant switch
                    oldWarning.style.display = 'none';
                    newWarning.style.display = 'flex';
                    newWarning.style.filter = '';
                    newWarning.style.opacity = '';
                    currentWarningIndex++;
                    updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
                    updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton, recentUpdateDetected);
                    isBusySwitchingPages = false;
                }
            } else {
                isBusySwitchingPages = false;
                if (recentUpdateDetected) {
                    recentUpdateDetected = false;
                    goToPage(1);
                    setTimeout(() => {
                        const oldWarning = releaseNotesContainer.querySelector(`#warning-${currentWarningIndex}`);
                        const newWarning = releaseNotesContainer.querySelector(`#warning-0`);
                        oldWarning.style.display = 'none';
                        newWarning.style.display = 'flex';
                        newWarning.style.filter = '';
                        newWarning.style.opacity = '';
                        currentWarningIndex = 0;
                        updateCounterDisplay(currentWarningIndex + 1, totalWarnings, warningCounterDisplay);
                        updateButtonOpacity(currentWarningIndex, totalWarnings, prevButton, nextButton);

                        document.querySelector('#DLP_Main_Box_Divider_9_ID').querySelector('.DLP_HStack_Auto_Top').querySelector(':scope > .DLP_Text_Style_2').style.display = 'none';
                        document.querySelector('#DLP_Main_Box_Divider_9_ID').querySelector('#DLP_Universal_Back_1_Button_1_ID').style.display = '';
                    }, 800);
                }
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

        setButtonState(DLP_Feedback_Send_Button_1_ID, { button: 'linear-gradient(0deg, rgba(var(--DLP-blue), 0.10) 0%, rgba(var(--DLP-blue), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' }, { text: systemText[systemLanguage][111], icon: '􀓞' }, { text: '', icon: 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite' }, () => {
            function f() {
                if (sendFeedbackStatus === 'sent') {
                    setButtonState(DLP_Feedback_Send_Button_1_ID, { button: 'linear-gradient(0deg, rgba(var(--DLP-green), 0.10) 0%, rgba(var(--DLP-green), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-green), 0.20)', text: 'rgb(var(--DLP-green))', icon: 'rgb(var(--DLP-green))' }, { text: systemText[systemLanguage][112], icon: '􀁣' }, { text: '', icon: ' ' }, () => {
                        if (!storageLocal.settings.reduceEffects) confetti();
                    });
                } else if (sendFeedbackStatus === 'error') {
                    setButtonState(DLP_Feedback_Send_Button_1_ID, { button: 'linear-gradient(0deg, rgba(var(--DLP-pink), 0.10) 0%, rgba(var(--DLP-pink), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-pink), 0.20)', text: 'rgb(var(--DLP-pink))', icon: 'rgb(var(--DLP-pink))' }, { text: systemText[systemLanguage][115], icon: '􀇿' }, { text: '', icon: ' ' }, () => {
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
                version: VERSION_FULL
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


    async function handleClick(button, id, amount) {
        const ANIM_MS = 820;
        let status = 'loading';

        const loadingStart = Date.now();
        setButtonState(
            button,
            { button: 'rgba(var(--DLP-blue), 0.10)', outline: 'rgba(var(--DLP-blue), 0.20)', text: 'rgb(var(--DLP-blue))', icon: 'rgb(var(--DLP-blue))' },
            { text: systemText[systemLanguage][113], icon: '􀓞' },
            { text: '', icon: 'DLP_Rotate_360_Animation_1 4s ease-in-out infinite' }
        );
        let nextAnimationEndsAt = loadingStart + ANIM_MS;

        setTimeout(() => { f(); }, Math.max(0, nextAnimationEndsAt - Date.now()));

        try {
            if (flag03) {
                const intelligentAmount = await intelligentLeaderboardBasedWarningLimit();
                console.log(`Intelligent amount: ${intelligentAmount}`);

                const overrideXp = button.dataset.overrideXp === 'true';
                if (id === 'xp' && amount > intelligentAmount && !overrideXp) {
                    button.dataset.overrideXp = 'true';

                    showNotification(
                        'warning',
                        'That is a lot of XP...',
                        `You're about to gain more XP than recommended. Click CONFIRM to continue.`,
                        10
                    );

                    const elapsed = Date.now() - loadingStart;
                    const delay = Math.max(0, ANIM_MS - elapsed);
                    setTimeout(() => {
                        setButtonState(
                            button,
                            { button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' },
                            { text: 'CONFIRM', icon: '􀰫' },
                            { text: '', icon: '' }
                        );
                        nextAnimationEndsAt = Date.now() + ANIM_MS;
                    }, delay);

                    // Keep status 'loading' so the poller waits until the user confirms or cancels
                    return;
                }

                // Reset the override flag when actually proceeding
                button.dataset.overrideXp = 'false';
            }

            const response = await fetch(apiURL + '/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                },
                body: JSON.stringify({
                    type: id,
                    amount: (Array.isArray(amount) && amount.length === 2 ? `${String(amount[0]).padStart(2, '0')}-${String(amount[1])}` : amount),
                    version: VERSION_FULL,
                    lang: 'en'
                })
            });

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
                    const ch = buffer[i];

                    if (ch === '{') {
                        openBraces++;
                    } else if (ch === '}') {
                        openBraces--;

                        if (openBraces === 0) {
                            const jsonStr = buffer.substring(start, i + 1).trim();

                            try {
                                const data = JSON.parse(jsonStr);

                                if (data.status === 'completed') {
                                    status = 'done';
                                    done = true;
                                    showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);

                                    if (storageLocal.stats.tracking_since === 0) storageLocal.stats.tracking_since = Date.now();
                                    storageLocal.stats.modern[id] += amount;
                                    saveStorageLocal();

                                    const input1 = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                                    const input2 = button.parentElement.querySelector('#DLP_Inset_Input_2_ID');
                                    if (input1) {
                                        input1.value = '';
                                        setTimeout(() => input1.dispatchEvent(new Event('input')), 2400);
                                    }
                                    [input1, input2].forEach((el) => {
                                        if (!el) return;
                                        el.value = '';
                                        setTimeout(() => el.dispatchEvent(new Event('input', { bubbles: true })), 2400);
                                    });
                                } else if (data.status === 'rejected' || (!data.status && data.max_amount)) {
                                    status = 'rejected';
                                    done = true;
                                    showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);

                                    const input1 = button.parentElement.querySelector('#DLP_Inset_Input_1_ID');
                                    const input2 = button.parentElement.querySelector('#DLP_Inset_Input_2_ID');
                                    [input1, input2].forEach((el) => {
                                        if (!data.max_amount || !el) return;
                                        el.value = data.max_amount;
                                        setTimeout(() => el.dispatchEvent(new Event('input', { bubbles: true })), 2400);
                                    });
                                } else if (data.status == 'failed' || !data.status) {
                                    status = 'error';
                                    done = true;
                                    showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                                } else {
                                    button.querySelector('.DLP_Inset_Text_1_ID').innerHTML = data.percentage + '%';
                                }

                                // Trim processed chunk and reset counters
                                buffer = buffer.substring(i + 1);
                                i = -1;
                                start = 0;
                                openBraces = 0;
                            } catch (e) {
                                // ignore and continue streaming
                            }
                        }
                    } else if (openBraces === 0 && buffer[i].trim() !== '') {
                        start = i;
                    }
                }
            }
        } catch (error) {
            console.error('Error during request:', error);
            status = 'error';
        }

        function f() {
            const now = Date.now();

            // If an animation is still running, wait precisely until it ends
            if (now < nextAnimationEndsAt) {
                setTimeout(() => { f(); }, nextAnimationEndsAt - now);
                return;
            }

            if (status === 'done') {
                setButtonState(
                    button,
                    { button: 'rgba(var(--DLP-green), 0.10)', outline: 'rgba(var(--DLP-green), 0.20)', text: 'rgb(var(--DLP-green))', icon: 'rgb(var(--DLP-green))' },
                    { text: systemText[systemLanguage][114], icon: '􀁣' },
                    { text: '', icon: '' }
                );
                nextAnimationEndsAt = Date.now() + ANIM_MS;

                if (!storageLocal.settings.reduceEffects) confetti();
                setTimeout(() => {
                    let buttonContentText = systemText[systemLanguage][9];
                    if (id === 'super' || id === 'double_xp_boost') buttonContentText = systemText[systemLanguage][13];
                    else if (id === 'heart_refill') buttonContentText = systemText[systemLanguage][229];
                    else if (id === 'quest') buttonContentText = systemText[systemLanguage][60];
                    setButtonState(
                        button,
                        { button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' },
                        { text: buttonContentText, icon: '􀰫' },
                        { text: '', icon: '' }
                    );
                    nextAnimationEndsAt = Date.now() + ANIM_MS;

                    setTimeout(() => { isGetButtonsBusy = false; }, ANIM_MS);
                }, (ANIM_MS * 2));

            } else if (status === 'error') {
                setButtonState(
                    button,
                    { button: 'rgb(var(--DLP-pink))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' },
                    { text: systemText[systemLanguage][115], icon: '􀇿' },
                    { text: '', icon: '' }
                );
                nextAnimationEndsAt = Date.now() + ANIM_MS;

                setTimeout(() => {
                    let buttonContentText = systemText[systemLanguage][9];
                    if (id === 'super' || id === 'double_xp_boost') buttonContentText = systemText[systemLanguage][13];
                    else if (id === 'heart_refill') buttonContentText = systemText[systemLanguage][229];
                    else if (id === 'quest') buttonContentText = systemText[systemLanguage][60];
                    setButtonState(
                        button,
                        { button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' },
                        { text: buttonContentText, icon: '􀰫' },
                        { text: '', icon: '' }
                    );
                    nextAnimationEndsAt = Date.now() + ANIM_MS;

                    setTimeout(() => { isGetButtonsBusy = false; }, ANIM_MS);
                }, (ANIM_MS * 2));

            } else if (status === 'rejected') {
                let buttonContentText = systemText[systemLanguage][9];
                if (id === 'super' || id === 'double_xp_boost') buttonContentText = systemText[systemLanguage][13];
                else if (id === 'heart_refill') buttonContentText = systemText[systemLanguage][229];
                else if (id === 'quest') buttonContentText = systemText[systemLanguage][60];
                setButtonState(
                    button,
                    { button: 'rgb(var(--DLP-blue))', outline: 'rgba(0, 0, 0, 0.20)', text: '#FFF', icon: '#FFF' },
                    { text: buttonContentText, icon: '􀰫' },
                    { text: '', icon: '' }
                );
                nextAnimationEndsAt = Date.now() + ANIM_MS;

                setTimeout(() => { isGetButtonsBusy = false; }, ANIM_MS);

            } else {
                // Still waiting for async work or user confirmation; check again after any new animation
                setTimeout(() => { f(); }, ANIM_MS);
            }
        }
    }

    const getButtonsList1 = [
        { base: 'DLP_Get_XP', type: 'xp', input: 1 },
        { base: 'DLP_Get_GEM', type: 'gem', input: 1 },
        { base: 'DLP_Get_Streak', type: 'streak', input: 1 },
        { base: 'DLP_Get_SUPER', type: 'super' },
        { base: 'DLP_Get_DOUBLE_XP_BOOST', type: 'double_xp_boost' },
        { base: 'DLP_Get_Streak_Freeze', type: 'streak_freeze', input: 1 },
        { base: 'DLP_Get_Heart_Refill', type: 'heart_refill' },
        { base: 'DLP_Get_Quest', type: 'quest' },
        { base: 'DLP_Get_Badge', type: 'badge', input: 2 },
        { base: 'DLP_Get_Local_Duolingo_Max', type: 'local_max' }
    ];
    function setupGetButtons(base, type, hasInput) {
        [1, 2].forEach(n => {
            const parent = document.getElementById(`${base}_${n}_ID`);
            if (!parent) return;

            const button = parent.querySelector('#DLP_Inset_Button_1_ID');
            const handler = () => {
                if (isGetButtonsBusy) return;
                //if (type === 'xp' && !button.dataset.overrideXp === 'true') return;
                if (type === 'local_max') {
                    goToPage(7, `${base}_${n}_ID`, true);
                    return;
                }
                if (hasInput > 0) {
                    if (parent.querySelector('#DLP_Inset_Input_1_ID').value.length === 0) return;
                    if (hasInput === 2 && parent.querySelector('#DLP_Inset_Input_2_ID').value.length !== 4) return;
                }
                isGetButtonsBusy = true;
                handleClick(button, type, hasInput ? (hasInput === 1 ? Number(parent.querySelector('#DLP_Inset_Input_1_ID')?.value) : (hasInput === 2 ? [Number(parent.querySelector('#DLP_Inset_Input_1_ID')?.value), Number(parent.querySelector('#DLP_Inset_Input_2_ID')?.value)] : 1)) : 1);
            };

            button.addEventListener('click', handler);

            if (hasInput > 0) {
                const input = parent.querySelector('#DLP_Inset_Input_1_ID');
                input.onkeyup = e => e.keyCode === 13 && handler();
                if (hasInput === 2) {
                    const input2 = parent.querySelector('#DLP_Inset_Input_2_ID');
                    input2.onkeyup = e => e.keyCode === 13 && handler();
                }
            }

            if (base === 'DLP_Get_Badge') {
                parent.querySelector('#DLP_Inset_Input_1_ID').placeholder = String(new Date().getMonth() + 1);
                parent.querySelector('#DLP_Inset_Input_2_ID').placeholder = String(new Date().getFullYear());

                function autosizeInput(input, autoSize = true, length) {
                    if (!input) return;

                    // Apply native maxlength for extra enforcement
                    if (length > 0) {
                        input.setAttribute('maxlength', String(length));
                    }

                    // Hidden measuring element (only created if autoSize is true)
                    const measure = autoSize ? document.createElement('span') : null;
                    if (measure) {
                        measure.style.position = 'absolute';
                        measure.style.visibility = 'hidden';
                        measure.style.whiteSpace = 'pre'; // measure spaces exactly
                        measure.style.padding = '0';
                        measure.style.border = '0';
                        measure.style.margin = '0';
                        document.body.appendChild(measure);
                    }

                    // Copy computed font-related styles from input to measure for accurate width
                    function syncMeasureStyles() {
                        if (!measure) return;
                        const cs = getComputedStyle(input);
                        measure.style.font = cs.font;
                        measure.style.fontSize = cs.fontSize;
                        measure.style.fontFamily = cs.fontFamily;
                        measure.style.fontWeight = cs.fontWeight;
                        measure.style.letterSpacing = cs.letterSpacing;
                        measure.style.textTransform = cs.textTransform;
                        measure.style.fontVariant = cs.fontVariant;
                        measure.style.fontFeatureSettings = cs.fontFeatureSettings;
                        measure.style.lineHeight = cs.lineHeight;
                    }

                    // Text to measure: input value, or placeholder when empty
                    function textToMeasure() {
                        const v = input.value;
                        if (v && v.length > 0) return v;
                        const ph = input.getAttribute('placeholder') || '';
                        return ph.length ? ph : ' ';
                    }

                    // Update input width to fit text plus horizontal paddings/borders
                    function updateWidth() {
                        if (!autoSize || !measure) return;

                        syncMeasureStyles();
                        measure.textContent = textToMeasure();

                        const textWidth = measure.getBoundingClientRect().width;
                        const cs = getComputedStyle(input);

                        const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
                        const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);

                        const widthPx = Math.ceil(textWidth + paddingX + borderX);

                        const minWidth = parseFloat(cs.minWidth) || 0;
                        const maxWidth = parseFloat(cs.maxWidth) || Infinity;

                        input.style.boxSizing = cs.boxSizing; // preserve existing box-sizing
                        input.style.width = Math.min(Math.max(widthPx, minWidth), maxWidth) + 'px';
                    }

                    // Enforce max length on input events
                    function enforceMaxLength() {
                        if (length > 0 && input.value.length > length) {
                            const pos = input.selectionStart;
                            input.value = input.value.slice(0, length);
                            if (typeof pos === 'number') {
                                const newPos = Math.min(pos, length);
                                input.setSelectionRange(newPos, newPos);
                            }
                        }
                        updateWidth();
                    }

                    // Initial sizing
                    updateWidth();

                    // Bind events
                    input.addEventListener('input', enforceMaxLength);

                    // Observe placeholder changes to keep width in sync when autoSize is true
                    const observer = autoSize ? new MutationObserver(updateWidth) : null;
                    if (observer) {
                        observer.observe(input, { attributes: true, attributeFilter: ['placeholder'] });
                    }

                    // Optional: update on resize and when fonts finish loading
                    function handleResize() { updateWidth(); }
                    if (autoSize) {
                        window.addEventListener('resize', handleResize);
                        if (document.fonts && document.fonts.addEventListener) {
                            document.fonts.addEventListener('loadingdone', updateWidth);
                        }
                    }

                    // Return a disposer for cleanup
                    return function dispose() {
                        input.removeEventListener('input', enforceMaxLength);
                        if (autoSize) {
                            window.removeEventListener('resize', handleResize);
                            if (document.fonts && document.fonts.removeEventListener) {
                                document.fonts.removeEventListener('loadingdone', updateWidth);
                            }
                            if (observer) observer.disconnect();
                            if (measure) measure.remove();
                        }
                    };
                }

                autosizeInput(parent.querySelector('#DLP_Inset_Input_1_ID'), false, 2);
                autosizeInput(parent.querySelector('#DLP_Inset_Input_2_ID'), true, 4);
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
        storageLocal.settings.reduceEffects = DLP_Settings_Var.reduceEffects;
        storageLocal.settings.localSuper = DLP_Settings_Var.localSuper;
        storageLocal.settings.showSuper = DLP_Settings_Var.showSuper;
        storageLocal.settings.randomSolveSpeed = DLP_Settings_Var.randomSolveSpeed;
        storageLocal.settings.randomSolveSpeedRange = settingsLegacySolveSpeedInputSanitizeValue(DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').value, DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_2_ID').value);
        saveStorageLocal();
        setButtonState(DLP_Settings_Save_Button_1_ID, { button: 'linear-gradient(0deg, rgba(var(--DLP-green), 0.10) 0%, rgba(var(--DLP-green), 0.10) 100%), rgba(var(--color-snow), 0.80)', outline: 'rgba(var(--DLP-green), 0.20)', text: 'rgb(var(--DLP-green))', icon: 'rgb(var(--DLP-green))' }, { text: systemText[systemLanguage][116], icon: '' }, { text: '', icon: ' ' }, () => {
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
        randomSolveSpeed: storageLocal.settings.randomSolveSpeed,
        randomSolveSpeedRange: storageLocal.settings.randomSolveSpeedRange,
        anonymousUsageData: storageLocal.settings.anonymousUsageData,
        reduceEffects: storageLocal.settings.reduceEffects,
        localSuper: storageLocal.settings.localSuper,
        showSuper: storageLocal.settings.showSuper,
    };
    let DLP_Settings_Toggle_Busy = false;

    let DLP_Settings_Legacy_Solve_Speed_1_ID = document.getElementById("DLP_Settings_Legacy_Solve_Speed_1_ID");
    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').value = DLP_Settings_Var.randomSolveSpeedRange[0];
    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_2_ID').value = DLP_Settings_Var.randomSolveSpeedRange[1];
    if (DLP_Settings_Var.randomSolveSpeed) DLP_Settings_Legacy_Solve_Speed_1_ID.style.display = '';
    else DLP_Settings_Legacy_Solve_Speed_1_ID.style.display = 'none';

    function solveSpeedInputSanitizeListener(el) {
        el.addEventListener('input', e => {
            let v = e.target.value.replace(/[^0-9.,]/g, '');

            // allow only one separator, prefer the first one typed
            const s = v.match(/[.,]/)?.[0];
            if (s) {
                const i = v.indexOf(s);
                // remove any extra separators and cap fractional to 1 digit
                v = v.slice(0, i + 1) + v.slice(i + 1).replace(/[.,]/g, '').replace(/[^0-9]/g, '').slice(0, 1);
                // sanitize integer part to digits only, cap to 3
                v = v.slice(0, i).replace(/[^0-9]/g, '').slice(0, 3) + s + v.slice(i + 1);
            } else {
                // no separator: just digits, cap integer length to 3
                v = v.replace(/[^0-9]/g, '').slice(0, 3);
            }

            // drop the leading zero if the user types a number after 0
            if (!/[.,]/.test(v) && /^0\d/.test(v)) v = v.replace(/^0+/, '');

            // collapse leading zeros unless it's "0." or "0,"
            if (/^0\d/.test(v) && /^0[.,]/.test(v) === false) v = v.replace(/^0+/, '0');

            // live cap: max 99.9
            const n = parseFloat(v.replace(',', '.'));
            if (!isNaN(n) && n > 99.9) v = '99.9';

            // ensure only one decimal digit live (already enforced above)
            e.target.value = v;
        });

        el.addEventListener('blur', e => {
            let v = e.target.value.replace(',', '.');

            // normalize by parsing to remove leading zeros
            let n = parseFloat(v);
            if (isNaN(n)) n = 0.4;

            // clamp range
            if (n < 0.4) n = 0.4;
            if (n > 99.9) n = 99.9;

            // allow only up to one decimal
            e.target.value = n.toFixed(1);
        });
    }
    solveSpeedInputSanitizeListener(DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID'));
    solveSpeedInputSanitizeListener(DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_2_ID'));

    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_1_ID').addEventListener('focus', e => {
        if (storageSession.script.settings.custom_random_legacy_solve_speed === false) e.target.blur();
        showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
    });
    DLP_Settings_Legacy_Solve_Speed_1_ID.querySelector('#DLP_Inset_Input_2_ID').addEventListener('focus', e => {
        if (storageSession.script.settings.custom_random_legacy_solve_speed === false) e.target.blur();
        showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
    });

    function settingsLegacySolveSpeedInputSanitizeValue(value1, value2) {
        let v1 = parseFloat(value1);
        let v2 = parseFloat(value2);

        return [Math.min(v1, v2), Math.max(v1, v2)];
    }


    function handleToggleClick(element, state) {
        if (element.hasAttribute('data-dlp-server-disabled')) return;
        if (state === 1) {
            element.style.background = "rgb(var(--DLP-green))";
            element.firstElementChild.style.transform = "translateX(8px)";
            element.firstElementChild.textContent = "􀁣";
            element.setAttribute("data-dlp-toggle", "on");
        } else if (state === 0.5) {
            element.firstElementChild.style.transform = "translateX(0px)";
        } else if (state === 0) {
            element.style.background = "rgb(var(--DLP-pink))";
            element.firstElementChild.style.transform = "translateX(-8px)";
            element.firstElementChild.textContent = "􀁡";
            element.setAttribute("data-dlp-toggle", "off");
        }
    }
    const toggleConfig = new Map([
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Auto_Update_Toggle_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.autoUpdate,
                setState: (v) => { DLP_Settings_Var.autoUpdate = v; },
                disabled: () => greasyfork
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Show_Solve_Buttons_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.showSolveButtons,
                setState: (v) => { DLP_Settings_Var.showSolveButtons = v; }
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Random_Legacy_Solve_Speed_Button_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.randomSolveSpeed,
                setState: (v) => { DLP_Settings_Var.randomSolveSpeed = v; },
                customEvent: () => 'randomSolveSpeed'
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Show_AutoServer_Button_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.showAutoServerButton,
                setState: (v) => { DLP_Settings_Var.showAutoServerButton = v; }
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Help_Us_Make_Better_Button_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.anonymousUsageData,
                setState: (v) => { DLP_Settings_Var.anonymousUsageData = v; },
                disabled: () => alpha
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Reduce_Effects_Button_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.reduceEffects,
                setState: (v) => { DLP_Settings_Var.reduceEffects = v; }
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Free_Local_Super_Button_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.localSuper,
                setState: (v) => { DLP_Settings_Var.localSuper = v; }
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_7_ID').querySelector("#DLP_Settings_Show_Super_Trial_Button_1_ID").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.showSuper,
                setState: (v) => { DLP_Settings_Var.showSuper = v; }
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_12_ID').querySelector("#setting-0").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.localSuper,
                setState: (v) => { DLP_Settings_Var.localSuper = v; }
            }
        ],
        [
            document.getElementById('DLP_Main_Box_Divider_12_ID').querySelector("#setting-1").querySelector('#DLP_Inset_Toggle_1_ID'),
            {
                getState: () => DLP_Settings_Var.anonymousUsageData,
                setState: (v) => { DLP_Settings_Var.anonymousUsageData = v; },
                disabled: () => alpha
            }
        ]
    ]);
    for (let element of document.querySelectorAll('.DLP_Toggle_Style_1')) {
        function syncAllToggles() {
            for (const [el, cfg] of toggleConfig.entries()) {
                if (!cfg || !cfg.getState) continue;
                const s = cfg.getState() ? 1 : 0;
                handleToggleClick(el, s);
            }
        }

        const cfg = toggleConfig.get(element) || null;

        let state = cfg ? (cfg.getState() ? 1 : 0) : 0;
        let isMouseDown = false;

        handleToggleClick(element, state);

        element.addEventListener("mousedown", () => {
            if (DLP_Settings_Toggle_Busy) return;
            if (cfg && cfg.disabled && cfg.disabled()) return;

            isMouseDown = true;
            handleToggleClick(element, 0.5);
        });

        document.addEventListener("mouseup", (event) => {
            if (!isMouseDown) return;
            isMouseDown = false;

            const committedState = cfg && cfg.getState ? (cfg.getState() ? 1 : 0) : state;

            if (!element.contains(event.target)) {
                handleToggleClick(element, committedState);
                return;
            }

            if (DLP_Settings_Toggle_Busy) {
                handleToggleClick(element, committedState);
                return;
            }
            if (cfg && cfg.disabled && cfg.disabled()) {
                handleToggleClick(element, committedState);
                return;
            }

            if (cfg && cfg.customEvent && cfg.customEvent()) {
                const eventName = cfg.customEvent();

                if (eventName === 'randomSolveSpeed') {
                    if (committedState) {
                        document.getElementById('DLP_Settings_Legacy_Solve_Speed_1_ID').style.display = 'none';
                    } else {
                        document.getElementById('DLP_Settings_Legacy_Solve_Speed_1_ID').style.display = '';
                    }
                }
            }

            state = (committedState === 1) ? 0 : 1;

            if (cfg && cfg.setState) {
                if (!element.hasAttribute('data-dlp-server-disabled')) {
                    cfg.setState(state === 1);
                } else {
                    showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
                }
            }

            DLP_Settings_Toggle_Busy = true;
            syncAllToggles();

            setTimeout(() => {
                DLP_Settings_Toggle_Busy = false;
            }, 100);
        });

        element.addEventListener("mouseleave", () => {
            if (isMouseDown) {
                handleToggleClick(element, state);
            }
        });

        element.addEventListener("mouseenter", () => {
            if (isMouseDown) {
                handleToggleClick(element, 0.5);
            }
        });
    }


    if (storageLocal.settings.localSuper) {
        const script = document.createElement("script");
        script.textContent = `
            (function() {
                function giveGoldSubscription() {
                    const TARGET_URL_REGEX = /https?:\\/\\/(?:[a-zA-Z0-9-]+\\.)?duolingo\\.[a-zA-Z]{2,6}(?:\\.[a-zA-Z]{2})?\\/\\d{4}-\\d{2}-\\d{2}\\/users\\/.+/;
                    const CUSTOM_SHOP_ITEMS = {
                        gold_subscription: {
                            itemName: "gold_subscription",
                            subscriptionInfo: {
                                vendor: "STRIPE",
                                renewing: true,
                                expectedExpiration: Date.now() + 31536000000
                            }
                        }
                    };

                    const originalFetch = window.fetch;
                    window.fetch = function (resource, options) {
                        const url = resource instanceof Request ? resource.url : resource;
                        if (TARGET_URL_REGEX.test(url)) {
                            return originalFetch.apply(this, arguments).then(async function (response) {
                                const resp = response.clone();
                                let raw = await resp.text();
                                try {
                                    let data = JSON.parse(raw);
                                    data.hasPlus = true;
                                    if (!data.trackingProperties || typeof data.trackingProperties !== 'object') data.trackingProperties = {};
                                    data.trackingProperties.has_item_gold_subscription = true;
                                    data.shopItems = CUSTOM_SHOP_ITEMS;
                                    raw = JSON.stringify(data);
                                } catch (e) { }
                                let hdrs = response.headers;
                                try { const obj = {}; response.headers.forEach((v, k) => obj[k] = v); hdrs = obj; } catch { }
                                return new Response(raw, { status: response.status, statusText: response.statusText, headers: hdrs });
                            });
                        }
                        return originalFetch.apply(this, arguments);
                    };

                    const origOpen = XMLHttpRequest.prototype.open;
                    const origSend = XMLHttpRequest.prototype.send;
                    XMLHttpRequest.prototype.open = function (method, url, ...args) {
                        this._intercept = TARGET_URL_REGEX.test(url);
                        this._url = url;
                        origOpen.call(this, method, url, ...args);
                    };
                    XMLHttpRequest.prototype.send = function () {
                        if (this._intercept) {
                            const origChange = this.onreadystatechange;
                            const xhr = this;
                            this.onreadystatechange = function () {
                                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                                    try {
                                        let raw = xhr.responseText;
                                        try {
                                            let data = JSON.parse(raw);
                                            data.hasPlus = true;
                                            if (!data.trackingProperties || typeof data.trackingProperties !== 'object') data.trackingProperties = {};
                                            data.trackingProperties.has_item_gold_subscription = true;
                                            data.shopItems = CUSTOM_SHOP_ITEMS;
                                            raw = JSON.stringify(data);
                                        } catch (e) { }
                                        Object.defineProperty(xhr, 'responseText', { writable: true, value: raw });
                                        Object.defineProperty(xhr, 'response', { writable: true, value: raw });
                                    } catch (e) { try { console.error("[API Intercept] XHR Modification Failed:", e); } catch { } }
                                }
                                if (origChange) origChange.apply(this, arguments);
                            };
                        }
                        origSend.apply(this, arguments);
                    };

                    function remove(root = document) {
                        const sections = root.querySelectorAll('section._3f-te');
                        for (let i = 0; i < sections.length; i++) {
                            const h2 = sections[i].querySelector('h2._203-l');
                            if (h2 && h2.textContent.trim() === 'Manage subscription') {
                                sections[i].remove();
                                break;
                            }
                        }
                    }
                    const observer = new MutationObserver(function () {
                        remove();
                    });
                    observer.observe(document.documentElement, { childList: true, subtree: true });
                    remove();
                }
                giveGoldSubscription();
            })();
        `;
        document.documentElement.appendChild(script);
    };

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
                if (debug) console.log("iOS haptic error");
            }
        }

        // Android/Browser Vibration API
        function androidHaptic(pattern) {
            try {
                if (navigator.vibrate) {
                    navigator.vibrate(pattern);
                }
            } catch {
                if (debug) console.log("Android haptic error");
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

    document.querySelectorAll("#DLP_Main_Earn_Button_1_ID, #DLP_Secondary_Earn_Button_1_ID").forEach(button => {
        button.addEventListener('click', () => {
            if (storageSession.script.boost === false) {
                showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
                return;
            }
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';

            generateEarnKey()
                .then(earnKey => {
                    window.open(serverURL + "/earn/connect/link/" + earnKey, "_blank");
                })
                .catch(error => {
                    showNotification("error", "Failed to Open Boost", "Failed to connect and open the boost page. Please try again later.", 15);
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
        let messageSendInProgress = false;

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

        function markTempMessageFailed(tempId) {
            const tempState = pendingTempMessages.get(tempId);
            if (tempState) {
                tempState.sendFailed = true;
            }
            const tempElements = chatBox.querySelectorAll(`[data-is-temp="${tempId}"]`);
            tempElements.forEach(element => {
                element.style.animation = '';
                element.style.color = 'rgba(var(--DLP-pink))';
            });
        }

        function setupSendButton() {
            sendButton.addEventListener('click', async () => {
                if (messageSendInProgress) return;
                if (!storageLocal.chatKey || storageLocal.chatKey.length === 0) {
                    if (container?.querySelector('#DLP_Inset_Group_3')?.style.display !== 'none') container.querySelector('#DLP_Inset_Group_3').style.display = 'none';
                    if (chatBox?.style.display === 'none') chatBox.style.display = 'flex';

                    try {
                        let response = await fetch(apiURL + "/chats/create", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${document.cookie.split(';').find(cookie => cookie.includes('jwt_token')).split('=')[1]}`
                            },
                            body: JSON.stringify({
                                "version": VERSION_FULL
                            })
                        });

                        let data = await response.json();
                        if (data?.status === false && data?.notification) {
                            showNotification(data.notification.icon, data.notification.head, data.notification.body, data.notification.duration);
                            return;
                        }
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
                    formData.append("files", file);
                    const url = URL.createObjectURL(file);
                    fileUrls.push(url);
                }

                let chatTempSendNumber = chatTempSendList.length ? chatTempSendList[chatTempSendList.length - 1] + 1 : 1;
                const tempMessageId = `temp-${chatTempSendNumber}`;
                let tempData = {
                    "accent": '#007AFF',
                    "author": userBioData.username,
                    "edited": false,
                    "files": fileUrls,
                    "message": messageInput.value,
                    "profile_picture": userBioData.profile_picture,
                    "role": "You",
                    "send_time": Number(Date.now()),
                    "message_id": tempMessageId
                };
                createMessage(tempData, false, chatTempSendNumber);
                pendingTempMessages.set(chatTempSendNumber, {
                    ...tempData,
                    files: [...tempData.files]
                });

                chatTempSendList.push(chatTempSendNumber);

                chatBox.scrollTop = chatBox.scrollHeight;
                allAttachments[currentChatId] = [];
                renderAttachmentsPreview();
                messageSendInProgress = true;
                checkSendButton();
                resetMessageInputState();

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

                    const isNewMessageFormat = response.ok && responseData && typeof responseData === 'object' && Object.prototype.hasOwnProperty.call(responseData, 'message_id');
                    if (isNewMessageFormat) {
                        const wasAtBottom = Math.abs(chatBox.scrollHeight - (chatBox.scrollTop + chatBox.clientHeight)) < 5;
                        chatBox.querySelectorAll(`[data-is-temp="${chatTempSendNumber}"]`).forEach(element => {
                            element.remove();
                        });
                        createMessage(responseData);
                        const tempIndex = chatTempSendList.indexOf(chatTempSendNumber);
                        if (tempIndex !== -1) {
                            chatTempSendList.splice(tempIndex, 1);
                        }
                        pendingTempMessages.delete(chatTempSendNumber);
                        if (wasAtBottom) {
                            chatBox.scrollTop = chatBox.scrollHeight;
                        }
                    } else {
                        if (responseData?.status === false && responseData?.notification) {
                            showNotification(responseData.notification.icon, responseData.notification.head, responseData.notification.body, responseData.notification.duration);
                        } else {
                            showNotification("error", "Send Failed", "We could not verify that your message was delivered. Please try again.", 8);
                        }
                        markTempMessageFailed(chatTempSendNumber);
                    }

                } catch (error) {
                    console.error("Fetch error:", error);
                    markTempMessageFailed(chatTempSendNumber);
                } finally {
                    messageSendInProgress = false;
                    checkSendButton();
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

                checkSendButton();
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

            attachmentVisualButton.addEventListener('click', () => {
                if (storageSession.script.support.file_upload.enabled === false) {
                    showNotification("warning", "Feature Disabled", "This feature has been temporarily disabled.", 15);
                    return;
                }
                attachmentInput.click();
            });

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
                if (file.size > storageSession.script.support.file_upload.max_size) {
                    showNotification("warning", "File Too Large", `${file.name} is over ${storageSession.script.support.file_upload.max_size / 1024 / 1024} MB, please choose a smaller file.`, 10);
                } else {
                    validFiles.push(file);
                }
            });

            const remainingSlots = storageSession.script.support.file_upload.max_files - allAttachments[currentChatId]?.length;
            if (validFiles.length > remainingSlots) {
                showNotification("warning", "Too Many Files", `You can only attach up to ${storageSession.script.support.file_upload.max_files} files at once.`, 10);
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
            if (allAttachments[currentChatId]?.length >= storageSession.script.support.file_upload.max_files) {
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
            if (messageSendInProgress) {
                sendButton.style.opacity = "0.5";
                sendButton.style.pointerEvents = "none";
                return;
            }
            if (messageInput.value.trim() !== "" || (allAttachments[currentChatId]?.length ?? 0) > 0) {
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

    let isSolveBusy = false;
    let isSolveAllBusy = false;
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            if (event.shiftKey) {
                solving();
            } else {
                solve();
            }
        }
    });

    let currentQuestionId = null;
    let hasLoggedForCurrent = 0;

    async function logOnce(flag, sol, dom) {
        // flag: 1 = solved, 2 = wrong, 3 = stuck
        if ((flag === 2 && hasLoggedForCurrent === 0) || (flag === 3 && hasLoggedForCurrent === 2)) {
            if (alpha) {
                console.log(flag);
                //console.log(sol);
                //console.log(dom);
                console.log(sol.challengeGeneratorIdentifier.generatorId);
            }
            hasLoggedForCurrent++;

            if (storageLocal.settings.anonymousUsageData && storageSession.script.anonymous_analytics !== false) {
                if (flag === 2) showNotification("error", "Legacy Solved Incorrectly", "Legacy has detected that it solved a question incorrectly. A report has been made under ID: " + sol.challengeGeneratorIdentifier.generatorId, 10);
                else if (flag === 3) showNotification("error", "Legacy is Stuck", "Legacy has detected that it is stuck on a question. A report has been made under ID: " + sol.challengeGeneratorIdentifier.generatorId, 10);

                const payload = {
                    version: VERSION_FULL,
                    random: storageLocal.random16,
                    flag: flag,
                    sol: sol,
                    dom: dom.outerHTML
                };

                console.log(sol);

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
        try {
            document.getElementById("solveAllButton").innerText = text;
        } catch (error) {
            console.log(error);
        }
    }

    async function solving(value) {
        if (value === "start") isAutoMode = true;
        else if (value === "stop") isAutoMode = false;
        else isAutoMode = !isAutoMode;

        updateSolveButtonText(isAutoMode ? systemText[systemLanguage][102] : systemText[systemLanguage][101]);

        // 2. Start the Async Loop (Only if not already running)
        if (isAutoMode && !solvingLoopRunning) {
            solvingLoopRunning = true;
            let initialUrl = window.location.href;

            // Fire-and-forget async loop
            (async function runLoop() {
                while (isAutoMode) {
                    // Safety: Stop if URL changes
                    if (window.location.href !== initialUrl) {
                        isAutoMode = false;
                        updateSolveButtonText(isAutoMode ? systemText[systemLanguage][102] : systemText[systemLanguage][101]);
                        break;
                    }

                    // A. Start Timer
                    const startTime = Date.now();
                    const targetDelay = storageLocal.settings.randomSolveSpeed
                        ? Math.floor((
                            storageLocal.settings.randomSolveSpeedRange[0] + (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295) *
                            (storageLocal.settings.randomSolveSpeedRange[1] - storageLocal.settings.randomSolveSpeedRange[0])
                        ) * 1000)
                        : 400;

                    // B. Run Logic (Wait for it to fully finish)
                    await solve(true, true);
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Check if stopped while solve() was running
                    if (!isAutoMode) break;

                    // C. Calculate Timing
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = targetDelay - elapsedTime;

                    // D. Wait the remainder (if solve() was faster than solveSpeed)
                    if (remainingTime > 0) {
                        await new Promise(resolve => setTimeout(resolve, remainingTime));
                    }
                }

                // Cleanup when loop breaks
                solvingLoopRunning = false;
            })();
        }
    }

    async function solve(check = true, skip = false) {
        if (isSolveBusy) return;
        isSolveBusy = true;

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
            if (type === 'lesson') {
                storageSession.legacy[status].amount -= 1;
                saveStorageSession();
                (((storageLocal.stats ??= {}).legacy ??= {})[status] ??= { lessons: 0 }).lessons++;
                saveStorageLocal();
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
                (((storageLocal.stats ??= {}).legacy ??= {})[status] ??= { lessons: 0 }).lessons++;
                saveStorageLocal();
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
                (((storageLocal.stats ??= {}).legacy ??= {})[status] ??= { lessons: 0 }).lessons++;
                saveStorageLocal();
                if (practiceAgain !== null) {
                    practiceAgain.click();
                    return;
                } else {
                    location.reload();
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
            hasLoggedForCurrent = 0;
        }

        if (challengeType === 'error') {
            await Promise.race([
                clickCheck(),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);
            isSolveBusy = false;
        } else if (challengeType) {
            if (debug) console.log("Challenge Type: " + challengeType);

            let playerFooter1 = document.getElementById("session/PlayerFooter");

            if ((playerFooter1 && playerFooter1.matches("._3rB4d._1VTif._2HXQ9")) || (!playerFooter1 && document.querySelector('._2i9lj'))) { // id="session/PlayerFooter", "._3rB4d._1VTif._2HXQ9" - Neutral
                await Promise.race([
                    handleChallenge(challengeType),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
                await new Promise(r => requestAnimationFrame(r));
            }

            let skipInsteadOfCheck = false;
            if (check && (playerFooter1 && playerFooter1.matches('._3rB4d._1VTif._2HXQ9')) || (!playerFooter1 && document.querySelector('._2i9lj'))) { // id="session/PlayerFooter" - Neutral
                await Promise.race([
                    clickCheck(),
                    new Promise(resolve => setTimeout(resolve, 500))
                ]);
                await new Promise(r => requestAnimationFrame(r));
            } else if (check && (playerFooter1 && !playerFooter1.matches('._3rB4d._1VTif._2HXQ9')) || ((!playerFooter1 && document.querySelector('._2i9lj')) && !document.querySelector('[data-test="stories-player-continue"]').disabled)) { // id="session/PlayerFooter" - NOT Neutral
                skipInsteadOfCheck = true;
            }

            if (skip || skipInsteadOfCheck) {
                await Promise.race([
                    clickNext(),
                    new Promise(resolve => setTimeout(resolve, 500))
                ]);
            }

            isSolveBusy = false;
        } else {
            await Promise.race([
                clickCheck(),
                new Promise(resolve => setTimeout(resolve, 500))
            ]);
            isSolveBusy = false;
        }
    }

    async function clickCheck() {
        try {
            let nextButtonNormal = document.querySelector('[data-test="player-next"]');
            let storiesContinueButton = document.querySelector('[data-test="stories-player-continue"]');
            let storiesDoneButton = document.querySelector('[data-test="stories-player-done"]');

            let nextButtonAriaValueNormal = nextButtonNormal ? nextButtonNormal.getAttribute('aria-disabled') : null;
            let nextButtonAriaValueStoriesContinue = storiesContinueButton ? storiesContinueButton.disabled : null;

            let nextButton = nextButtonNormal || storiesContinueButton || storiesDoneButton;
            let nextButtonAriaValue = nextButtonAriaValueNormal || nextButtonAriaValueStoriesContinue || storiesDoneButton;

            if (nextButton) {
                if (String(nextButtonAriaValue) === 'true') { // Case: Button is Disabled
                    logOnce(3, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                } else if (String(nextButtonAriaValue) === 'false' && (nextButton.classList.length === 7 && nextButton.matches('._1rcV8._1VYyp._1ursp._7jW2t._3DbUj._38g3s._2oGJR'))) { // Case: Button is Enabled (Click "Check")
                    nextButton.click();

                    await new Promise(r => requestAnimationFrame(r)); // Wait one tick for the UI to update with success/fail classes

                    if (nextButton && nextButton.classList.contains('_2oGJR')) { // Green / Correct
                        logOnce(1, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                        const status = storageSession.legacy.status;
                        (((storageLocal.stats ??= {}).legacy ??= {})[status] ??= { questions: 0 }).questions++;
                        saveStorageLocal();
                    } else if (nextButton && nextButton.classList.contains('_3S8jJ')) { // Red / Incorrect
                        logOnce(2, window.sol, document.querySelector('.RMEuZ._1GVfY'));
                    } else {
                        if (debug) console.log('The element does not have the class ._9C_ii or .NAidc or the element is not found.');
                    }
                } else {
                    if (debug) console.log('The aria-disabled attribute is not set or has an unexpected value.');
                    nextButton.click();
                }
            } else {
                if (debug) console.log('Element with data-test="player-next" or data-test="stories-player-continue" not found.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function clickNext() {
        // 1. Identify the element to watch BEFORE clicking
        const challengeElement = document.querySelector('[data-test~="challenge"]');

        let observer = null;
        let clicked = false;

        // 2. Create the promise that resolves only when the element is removed
        const removalPromise = challengeElement ? new Promise((resolve) => {
            // If it's already gone, resolve immediately
            if (!document.body.contains(challengeElement)) return resolve();

            observer = new MutationObserver(() => {
                if (!document.body.contains(challengeElement)) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }) : Promise.resolve();

        try {
            // 3. Find and Click the button
            let nextButton = document.querySelector('[data-test="player-next"]') ||
                document.querySelector('[data-test="stories-player-continue"]') ||
                document.querySelector('[data-test="stories-player-done"]');

            if (nextButton) {
                nextButton.click();
                clicked = true;
            } else {
                if (debug) console.log('Next button not found in clickNext.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            // 4. Wait logic
            if (clicked && challengeElement) {
                await removalPromise;
            } else if (observer) {
                // If we didn't click or something failed, clean up the observer
                observer.disconnect();
            }
        }
    }

    function getCleanButtonText(button) {
        // Check if button contains ruby elements
        const rubyElements = button.querySelectorAll('ruby');

        if (rubyElements.length > 0) {
            // Extract only the base text (not the rt annotations)
            let text = '';
            rubyElements.forEach(ruby => {
                const baseTextElements = ruby.querySelectorAll('span[lang]:not(rt)');
                baseTextElements.forEach(span => {
                    text += span.textContent;
                });
            });
            return text.trim();
        } else {
            // Fallback for non-ruby elements
            const textElement = button.querySelector('[data-test="challenge-tap-token-text"]');
            return textElement ? textElement.innerText.trim() : button.innerText.trim();
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
                    return 'Challenge Speak';
                } else if (window.sol.type === 'syllableTap') {
                    return 'Syllable Tap';
                } else if (window.sol.type === 'syllableListenTap') {
                    return 'Syllable Listen Tap';
                } else if (window.sol.type === 'tapCompleteTable') {
                    return 'Tap Complete Table';
                } else if (window.sol.type === 'typeCloze') {
                    return 'Type Cloze';
                } else if (window.sol.type === 'typeClozeTable') {
                    return 'Type Cloze Table';
                } else if (window.sol.type === 'tapClozeTable') {
                    return 'Tap Cloze Table';
                } else if (window.sol.type === 'typeCompleteTable') {
                    return 'Type Complete Table';
                } else if (window.sol.type === 'patternTapComplete') {
                    return 'Pattern Tap Complete';
                } else if (window.sol.type === 'completeReverseTranslation') {
                    return 'Complete Reverse Translation';
                } else if (document.querySelectorAll('[data-test*="challenge-name"]').length > 0 && document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                    return 'Challenge Name';
                } else if (window.sol.type === 'listenMatch') {
                    return 'Listen Match';
                } else if (document.querySelectorAll('[data-test="challenge challenge-characterWrite"]').length > 0) {
                    if (document.querySelector('g._25Ktp')) {
                        return 'Character Write Drag';
                    } else if (document.querySelectorAll('path._1e5Zt').length > 0) {
                        return 'Character Write Draw';
                    } else {
                        return 'Character Write Freehand';
                    }
                } else if (document.querySelectorAll('[data-test="challenge challenge-listenSpeak"]').length > 0) {
                    return 'Listen Speak';
                } else if (document.querySelectorAll('[data-test="challenge-choice"]').length > 0) {
                    if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                        return 'Challenge Choice with Text Input';
                    } else {
                        return 'Challenge Choice'
                    }
                } else if (document.querySelectorAll('[data-test$="challenge-tap-token"]').length > 0) {
                    if (window.sol.pairs !== undefined) {
                        return 'Pairs';
                    } else if (window.sol.correctTokens !== undefined) {
                        return 'Tokens Run';
                    } else if (window.sol.correctIndices !== undefined) {
                        return 'Indices Run';
                    }
                } else if (document.querySelectorAll('[data-test="challenge-tap-token-text"]').length > 0) {
                    return 'Fill in the Gap';
                } else if (document.querySelectorAll('[data-test="challenge-text-input"]').length > 0) {
                    return 'Challenge Text Input';
                } else if (document.querySelectorAll('[data-test*="challenge-partialReverseTranslate"]').length > 0) {
                    return 'Partial Reverse';
                } else if (document.querySelectorAll('textarea[data-test="challenge-translate-input"]').length > 0) {
                    return 'Challenge Translate Input';
                } else if (document.querySelectorAll('[data-test="session-complete-slide"]').length > 0) {
                    return 'Session Complete';
                } else if (document.querySelectorAll('[data-test="daily-quest-progress-slide"]').length > 0) {
                    return 'Daily Quest Progress';
                } else if (document.querySelectorAll('[data-test="streak-slide"]').length > 0) {
                    return 'Streak';
                } else if (document.querySelectorAll('[data-test="leaderboard-slide"]').length > 0) {
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

    async function handleChallenge(challengeType) {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms)); // Helper for awaiting UI updates/animations

        if (challengeType === 'Challenge Speak' || challengeType === 'Listen Match' || challengeType === 'Listen Speak') {
            const buttonSkip = document.querySelector('button[data-test="player-skip"]');
            buttonSkip?.click();

        } else if (challengeType === 'Challenge Choice' || challengeType === 'Challenge Choice with Text Input') {
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

            window.sol.pairs?.forEach((pair) => {
                for (let i = 0; i < nl.length; i++) {
                    if (nl[i].disabled) continue;

                    const buttonText = getCleanButtonText(nl[i]).toLowerCase();

                    try {
                        if (
                            buttonText === pair.transliteration.toLowerCase().trim() ||
                            buttonText === pair.character.toLowerCase().trim()
                        ) {
                            nl[i].click();
                        }
                    } catch (TypeError) {
                        if (
                            buttonText === pair.learningToken.toLowerCase().trim() ||
                            buttonText === pair.fromToken.toLowerCase().trim()
                        ) {
                            nl[i].click();
                        }
                    }
                }
            });

        } else if (challengeType === 'Story Pairs') {
            const nl = document.querySelectorAll('[data-test*="challenge-tap-token"]:not(span)');
            const textToElementMap = new Map();

            for (let i = 0; i < nl.length; i++) {
                const text = getCleanButtonText(nl[i]).toLowerCase();
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

        } else if (challengeType === 'Tap Complete Table') {
            const solutionRows = window.sol.displayTableTokens.slice(1);
            const tableRowElements = document.querySelectorAll('tbody tr');
            const wordBank = document.querySelector('div[data-test="word-bank"]');
            const wordBankButtons = wordBank ? wordBank.querySelectorAll('button[data-test*="-challenge-tap-token"]') : [];
            const usedWordBankIndexes = new Set();

            solutionRows.forEach((solutionRow, rowIndex) => {
                const answerCellData = solutionRow[1];
                const correctToken = answerCellData.find(token => token.isBlank);

                if (correctToken) {
                    const correctAnswerText = correctToken.text;
                    const currentRowElement = tableRowElements[rowIndex];
                    let buttons = currentRowElement.querySelectorAll('button[data-test*="-challenge-tap-token"]');
                    let clicked = false;

                    if (buttons.length > 0) {
                        for (let button of buttons) {
                            const buttonText = getCleanButtonText(button);
                            if (buttonText === correctAnswerText && !button.disabled) {
                                button.click();
                                clicked = true;
                                break;
                            }
                        }
                    }

                    if (!clicked && wordBankButtons.length > 0) {
                        for (let i = 0; i < wordBankButtons.length; i++) {
                            if (usedWordBankIndexes.has(i)) continue;

                            const button = wordBankButtons[i];
                            const buttonText = getCleanButtonText(button);
                            if (buttonText === correctAnswerText && !button.disabled) {
                                button.click();
                                usedWordBankIndexes.add(i);
                                break;
                            }
                        }
                    }
                }
            });

        } else if (challengeType === 'Tokens Run') {
            const all_tokens = document.querySelectorAll('[data-test$="challenge-tap-token"]');
            const correct_tokens = window.sol.correctTokens;
            const clicked_tokens = [];

            correct_tokens.forEach(correct_token => {
                const matching_elements = Array.from(all_tokens).filter(element => {
                    const elementText = getCleanButtonText(element);
                    return elementText === correct_token.trim();
                });

                if (matching_elements.length > 0) {
                    const match_index = clicked_tokens.filter(token => {
                        const tokenText = getCleanButtonText(token);
                        return tokenText === correct_token.trim();
                    }).length;

                    if (match_index < matching_elements.length) {
                        matching_elements[match_index].click();
                        clicked_tokens.push(matching_elements[match_index]);
                    } else {
                        clicked_tokens.push(matching_elements[0]);
                    }
                }
            });

        } else if (challengeType === 'Indices Run' || challengeType === 'Fill in the Gap') {
            if (window.sol.correctIndices) {
                window.sol.correctIndices?.forEach(index => {
                    document.querySelectorAll('div[data-test="word-bank"] [data-test*="challenge-tap-token"]:not(span)')[index].click();
                });
            }

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

        } else if (challengeType === 'Type Cloze') {
            const input = document.querySelector('input[type="text"].b4jqk');
            if (!input) return;

            let targetToken = window.sol.displayTokens.find(t => t.damageStart !== undefined);
            let correctWord = targetToken?.text || "";

            let correctEnding = "";
            if (typeof targetToken?.damageStart === "number") {
                correctEnding = correctWord.slice(targetToken.damageStart);
            }

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, correctEnding);

            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));

        } else if (challengeType === 'Type Cloze Table') {
            const tableRows = document.querySelectorAll('tbody tr');

            window.sol.displayTableTokens.slice(1).forEach((rowTokens, i) => {
                const answerCell = rowTokens[1]?.find(t => typeof t.damageStart === "number");

                if (answerCell && tableRows[i]) {
                    const input = tableRows[i].querySelector('input[type="text"].b4jqk');
                    if (!input) return;

                    const correctWord = answerCell.text;
                    const correctEnding = correctWord.slice(answerCell.damageStart);

                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, correctEnding);

                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });

        } else if (challengeType === 'Tap Cloze Table') {
            const tableRows = document.querySelectorAll('tbody tr');

            window.sol.displayTableTokens.slice(1).forEach((rowTokens, i) => {
                const answerCell = rowTokens[1]?.find(t => typeof t.damageStart === "number");
                if (!answerCell || !tableRows[i]) return;

                const wordBank = document.querySelector('[data-test="word-bank"], .eSgkc');
                const wordButtons = wordBank ? Array.from(wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]:not([aria-disabled="true"])')) : [];

                const correctWord = answerCell.text;
                const correctEnding = correctWord.slice(answerCell.damageStart);

                let endingMatched = "";
                let used = new Set();
                for (let btn of wordButtons) {
                    const btnText = getCleanButtonText(btn);
                    if (!correctEnding.startsWith(endingMatched + btnText)) continue;
                    btn.click();
                    endingMatched += btnText;
                    used.add(btn);
                    if (endingMatched === correctEnding) break;
                }
            });

        } else if (challengeType === 'Type Complete Table') {
            const tableRows = document.querySelectorAll('tbody tr');

            window.sol.displayTableTokens.slice(1).forEach((rowTokens, i) => {
                const answerCell = rowTokens[1]?.find(t => t.isBlank);
                if (!answerCell || !tableRows[i]) return;

                const input = tableRows[i].querySelector('input[type="text"].b4jqk');
                if (!input) return;

                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(input, answerCell.text);

                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
            });

        } else if (challengeType === 'Pattern Tap Complete') {
            const wordBank = document.querySelector('[data-test="word-bank"], .eSgkc');
            if (!wordBank) return;

            const choices = window.sol.choices;
            const correctIndex = window.sol.correctIndex ?? 0;
            const correctText = choices[correctIndex];

            const buttons = Array.from(wordBank.querySelectorAll('button[data-test*="challenge-tap-token"]:not([aria-disabled="true"])'));
            const targetButton = buttons.find(btn => {
                const btnText = getCleanButtonText(btn);
                return btnText === correctText;
            });

            if (targetButton) {
                targetButton.click();
            }

        } else if (challengeType === 'Complete Reverse Translation') {
            const blankTokens = window.sol.displayTokens.filter(t => t.isBlank);
            const inputFields = document.querySelectorAll('[data-test="challenge-text-input"]');

            inputFields.forEach((input, index) => {
                if (blankTokens[index]) {
                    const answer = blankTokens[index].text;

                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, answer);

                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

        } else if (challengeType === 'Character Write Drag') {
            const strokes = window.sol.strokes;
            const createEvent = (type, x, y, buttons) => new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, buttons, button: 0 });
            const normalize = (str) => str ? str.replace(/\s/g, '') : '';

            for (let i = 0; i < strokes.length; i++) {
                const targetPathData = normalize(strokes[i].path);
                let path, handle;

                // Poll for the correct stroke to appear
                while (!path || !handle) {
                    const candidates = document.querySelectorAll('path._1e5Zt');
                    path = Array.from(candidates).find(p => normalize(p.getAttribute('d')) === targetPathData);
                    handle = document.querySelector('g._25Ktp');
                    if (!path || !handle) await sleep(10);
                }

                const matrix = path.getScreenCTM();
                const len = path.getTotalLength();
                const start = path.getPointAtLength(0).matrixTransform(matrix);
                const end = path.getPointAtLength(len).matrixTransform(matrix);

                // Execute Stroke Instantly
                handle.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));

                // Fire all move events synchronously for maximum speed
                const steps = 10;
                for (let s = 1; s <= steps; s++) {
                    const p = path.getPointAtLength((s / steps) * len).matrixTransform(matrix);
                    const move = createEvent('mousemove', p.x, p.y, 1);
                    handle.dispatchEvent(move);
                    document.dispatchEvent(move);
                }

                // Anchor end and release
                const finalMove = createEvent('mousemove', end.x, end.y, 1);
                handle.dispatchEvent(finalMove);
                document.dispatchEvent(finalMove);

                // Tiny 5ms tick to ensure the app registers the cursor is at the end before lifting
                await sleep(5);

                handle.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                document.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
            }

        } else if (challengeType === 'Character Write Draw') {
            const strokes = window.sol.strokes;
            const createEvent = (type, x, y, buttons) => new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, buttons, button: 0 });
            const normalize = (str) => str ? str.replace(/\s/g, '') : '';

            for (let i = 0; i < strokes.length; i++) {
                const targetPathData = normalize(strokes[i].path);
                let path, cursor;

                while (!path || !cursor) {
                    const candidates = document.querySelectorAll('path._1e5Zt');
                    path = Array.from(candidates).find(p => normalize(p.getAttribute('d')) === targetPathData);
                    cursor = document.querySelector('g._1h31R:not(._25Ktp)');
                    if (!path || !cursor) await sleep(10);
                }

                const matrix = path.getScreenCTM();
                const len = path.getTotalLength();
                const start = path.getPointAtLength(0).matrixTransform(matrix);
                const end = path.getPointAtLength(len).matrixTransform(matrix);

                cursor.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));
                document.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));

                const steps = 10;
                for (let s = 1; s <= steps; s++) {
                    const p = path.getPointAtLength((s / steps) * len).matrixTransform(matrix);
                    const move = createEvent('mousemove', p.x, p.y, 1);
                    cursor.dispatchEvent(move);
                    document.dispatchEvent(move);
                }

                const finalMove = createEvent('mousemove', end.x, end.y, 1);
                cursor.dispatchEvent(finalMove);
                document.dispatchEvent(finalMove);

                await sleep(5);

                cursor.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                document.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
            }

        } else if (challengeType === 'Character Write Freehand') {
            const freehandStrokes = window.sol.strokes.filter(s => s.strokeDrawMode === 'FREEHAND');
            const createEvent = (type, x, y, buttons) => new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, buttons, button: 0 });
            const normalize = (str) => str ? str.replace(/\s/g, '') : '';

            for (let i = 0; i < freehandStrokes.length; i++) {
                const targetPathData = normalize(freehandStrokes[i].path);
                let path, svg;

                while (!path || !svg) {
                    const candidates = document.querySelectorAll('path._22UPm');
                    path = Array.from(candidates).find(p => normalize(p.getAttribute('d')) === targetPathData);
                    svg = document.querySelector('svg.o1rqi');
                    if (!path || !svg) await sleep(10);
                }

                const matrix = path.getScreenCTM();
                const len = path.getTotalLength();
                const start = path.getPointAtLength(0).matrixTransform(matrix);
                const end = path.getPointAtLength(len).matrixTransform(matrix);

                svg.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));
                document.dispatchEvent(createEvent('mousedown', start.x, start.y, 1));

                const steps = 10;
                for (let s = 1; s <= steps; s++) {
                    const p = path.getPointAtLength((s / steps) * len).matrixTransform(matrix);
                    const move = createEvent('mousemove', p.x, p.y, 1);
                    svg.dispatchEvent(move);
                    document.dispatchEvent(move);
                }

                const finalMove = createEvent('mousemove', end.x, end.y, 1);
                svg.dispatchEvent(finalMove);
                document.dispatchEvent(finalMove);

                await sleep(5);

                svg.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
                document.dispatchEvent(createEvent('mouseup', end.x, end.y, 0));
            }

        } else if (challengeType === 'Syllable Tap' || challengeType === 'Syllable Listen Tap') {
            const correctIndices = window.sol.correctIndices;
            const choicesData = window.sol.choices;

            const domButtons = Array.from(document.querySelectorAll('[data-test="word-bank"] [data-test$="challenge-tap-token"]'));

            correctIndices.forEach(index => {
                const correctChoiceData = choicesData[index];
                const correctText = correctChoiceData.text;

                const matchingButton = domButtons.find(btn => getCleanButtonText(btn) === correctText);

                if (matchingButton) {
                    matchingButton.click();
                }
            });


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
            setTimeout(() => { if (!duplicateCheck()) One(); }, 10);
        } else {
            systemLanguage = "en";
            setTimeout(() => { if (!duplicateCheck()) One(); }, 10);
        }
    } else {
        systemLanguage = "en";
        setTimeout(() => { if (!duplicateCheck()) One(); }, 10);
    }
} catch (error) {
    console.log(error);
    One();
}
