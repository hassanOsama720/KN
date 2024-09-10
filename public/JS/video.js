//let queryString = window.location.search;
//let urlParams = new URLSearchParams(queryString);
let watchCount = urlParams.get('watchCount') ?? 0;
let commentCount = urlParams.get('commentsCount') ?? 0;
let likeCount = urlParams.get('likes') ?? 0;
let shareCount = urlParams.get('sharesCount') ?? 0;
let encryptedID = urlParams.get('id');  // Assume the ID is encrypted in the URL

if (encryptedID) {
    fetch(`/video?id=${encryptedID}`) // Point to the backend
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the story');
            }
            return response.json();
        })
        .then(data => {
            // decode url
            let url = decodeURIComponent(data.url);
            // Update the video URL and other details
            let videoElement = document.getElementById('video');
            videoElement.src = url; // Ensure 'data.url' is the correct field name
            videoElement.load(); // Reload the video source

            watchCount = data.watchCount ?? 0;
            commentCount = data.commentsCount ?? 0;
            likeCount = data.likes ?? 0;
            shareCount = data.sharesCount ?? 0;


            document.getElementById('watchCount').innerText = watchCount;
            document.getElementById('commentCount').innerText = commentCount;
            document.getElementById('likeCount').innerText = likeCount;
            document.getElementById('shareCount').innerText = shareCount;
        })
        .catch(error => {
            console.error('Error fetching video details:', error);
        });
} else {
    console.error('No encrypted ID found in URL');
}

// Toggle fullscreen mode on video button click
document.querySelector('.video-button').addEventListener('click', function () {
    const wrapper = document.querySelector('.video');
    if (!document.fullscreenElement) {
        wrapper.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Handle forward and backward skip buttons
document.querySelector('#forward').addEventListener('click', function () {
    document.getElementById('video').currentTime += 10;
});

document.querySelector('#backward').addEventListener('click', function () {
    document.getElementById('video').currentTime -= 10;
});

// Play/Stop video toggle button
document.querySelector('#play-stop').addEventListener('click', function () {
    let video = document.getElementById('video');
    if (video.paused) {
        video.play();
        togglePlayStopIcons(true);
    } else {
        video.pause();
        togglePlayStopIcons(false);
    }
});

document.querySelector('#sound').addEventListener('click', function () {
    let video = document.getElementById('video');
    if (video.muted) {
        video.muted = false;
        toggleMuteButton(false);
    }else {
        video.muted = true;
        toggleMuteButton(true);
    }
});

// Function to toggle play and stop icons
function togglePlayStopIcons(isPlaying) {
    document.querySelector('#play').style.display = isPlaying ? 'none' : 'flex';
    document.querySelector('#stop').style.display = isPlaying ? 'flex' : 'none';
}

function toggleMuteButton(isMuted) {
    document.querySelector('#unmuted').style.display = isMuted ? 'none' : 'flex';
    document.querySelector('#muted').style.display = isMuted ? 'flex' : 'none';
}

// Show skip buttons when interacting with video
document.querySelector('.video').addEventListener('mousemove', handleSkipButtons);
document.querySelector('.video').addEventListener('touchstart', handleSkipButtons);

// Function to handle showing and hiding skip buttons
let timeout;
function handleSkipButtons() {
    document.querySelectorAll('.skip').forEach(item => item.style.display = 'flex');
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        document.querySelectorAll('.skip').forEach(item => item.style.display = 'none');
    }, 3000);
}
