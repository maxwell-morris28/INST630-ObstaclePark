const token = 'BQDlJTy1bsCVjEWOqbOnv69CHxapqF4yesneaspv4dHpVMEAEC-FVVvM0QgahTc5Lzjr54dOoTzTMEn7mISqzDOz0cYM1gAYAaxrPIwxc0-DMkh3pxbt';
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
console.log(profile.name);
console.log(profile.artists[0]["name"]);