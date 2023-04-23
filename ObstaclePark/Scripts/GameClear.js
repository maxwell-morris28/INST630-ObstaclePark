const clientId = "c801ed81d22d414699983ae86e6677dc";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

/*if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const token = await getAccessToken(clientId, code);
    const profile = await fetchProfile(token);
    console.log(profile);
    //populateUI(profile);
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5173/GameClear.html/");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5173/GameClear.html/");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

//const token = 'BQDlJTy1bsCVjEWOqbOnv69CHxapqF4yesneaspv4dHpVMEAEC-FVVvM0QgahTc5Lzjr54dOoTzTMEn7mISqzDOz0cYM1gAYAaxrPIwxc0-DMkh3pxbt';
const token = await getAccessToken(clientId, code);
//console.log(token);
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

const profile = await fetchProfile(token);
const trackName = profile.name;
const artistName = profile.artists[0]["name"];
/*for (let element in profile.artists[0]) {
    console.log(element);
}*/
console.log(trackName);
console.log(artistName);