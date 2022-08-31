function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}



// MIGRATION

const getLinks = (result) => {
    const links = [];
    for (let i = 1; i <= 5; i++) {
        if (result[`link-${i}`]) {
            links.push({
                text: result[`text-${i}`] || "",
                link: result[`link-${i}`] || "",
            });
        }
    }
    return links;
}

export const attemptMigration = (result, setUserStorage, defaultOptions) => {
    console.log("Result", result)
    if ('use-celsius' in result) {
        console.log("Detected an older version of temperate, attempting migration");
        const newUserStorage = {
            global: {
                uiScale: 1,
                locationOverride: result['geolocation'] || "",
            },
            colors: {
                autoColor: result['auto-color'],
                cbg: result['color-background'] || "#ffffff",
                c1: result['color-temp'] || "#ffc7a8",
                c2: result['color-temp'] || "#ffffff",
                c3: result['color-background'] || "#ffffff",
            },
            background: {
                autoImage: result['daily-image'] !== "None",
                imgUrl: result['image-override'] || "",
                imgSource: ((result['daily-image'] !== "None") ? result['daily-image'] : ""),
            },
            temperature: {
                tempScale: result['size-adjust'] / 100 || 1,
                useFeelsLike: result['use-temp-feel'],
                useCelsius: result['use-celsius'],
            },
            links: getLinks(result),
        };
        // Merge new user storage with existing user storage
        window.chrome.storage.sync.clear(() => {
            const merged = mergeDeep(defaultOptions, newUserStorage);
            console.log("Merged user storage", merged);
            setUserStorage(merged);
        });
    } else {
        console.log("Couldn't find an older version, not attempting migration");
    }
    return false;
}

export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}