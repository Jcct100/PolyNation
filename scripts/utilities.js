import { getUI } from './api';

let textNodes = {};

getUI()
    .then((res) => {
        textNodes = res.text_nodes_for_this_lang.literals;
    })
    .catch((error) => {
        console.log(error);
    });

export const getTextNode = (string) => {
    return Object.keys(textNodes).includes(string) ? textNodes[string] : string;
};

export const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toDateString();
};

export const formatTime = (date) => {
    const newTime = new Date(date);
    return newTime.toLocaleTimeString().slice(0, 5);
};

export const decodeString = (string) => {
    return string.replace(/&amp;/g, '&');
};

export const formatURL = (url) => {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
};

// Limit subtitles to first two items of a list
export const truncateSubtitle = (subtitle) => {
    if (subtitle.length > 15) {
        const firstIndex = subtitle.indexOf(',');
        const indexToSlice = subtitle.indexOf(',', firstIndex + 1);
        return subtitle.slice(0, indexToSlice);
    }
    return subtitle;
};

export const arrayEquals = (one, two) => {
    if (!one || !two) return false;

    // compare lengths - can save a lot of time
    if (one.length !== two.length) return false;

    for (let i = 0; i < one.length; i++) {
        // Check if we have nested arrays
        if (one[i] instanceof Array && two[i] instanceof Array) {
            // recurse into the nested arrays
            if (!one[i].equals(two[i])) return false;
        } else if (one[i] !== two[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

export const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncateSocialProfile = (string) => {
    if (string.includes('facebook')) {
        return `/${string.substring(string.lastIndexOf('/') + 1)}`;
    }
    return `@${string.substring(string.lastIndexOf('/') + 1)}`;
};

export const getCityFromAddress = (address) => {
    const lines = address.split(',');
    return lines[2];
};

export const formatGigTitle = (str) => {
    const strArr = str.split(' ');
    strArr.shift();
    return strArr.join(' ');
};
