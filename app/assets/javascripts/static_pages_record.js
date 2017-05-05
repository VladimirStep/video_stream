function PostBlob(videoBlob, fileName) {
    var formData = new FormData();
    formData.append('filename', fileName);
    formData.append('video_blob', videoBlob);
    xhr('upload', formData, function(ffmpeg_output) {
        document.querySelector('h1').innerHTML = ffmpeg_output.replace(/\\n/g, '<br />');
        preview.src = 'uploads/' + fileName + '-merged.webm';
        preview.play();
        preview.muted = false;
    });
}
var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var record = document.getElementById('record');
var stop = document.getElementById('stop');
var recordVideo = document.getElementById('record-video');
var preview = document.getElementById('preview');
var container = document.getElementById('container');
var recordVideo;
record.onclick = function() {
    record.disabled = true;
    !window.stream && navigator.getUserMedia({
        video: true
    }, function(stream) {
        window.stream = stream;
        onstream();
    }, function(error) {
        alert(JSON.stringify(error, null, '\t'));
    });
    window.stream && onstream();
    function onstream() {
        preview.src = window.URL.createObjectURL(stream);
        preview.play();
        preview.muted = true;

        var videoOnlyStream = new MediaStream();
        videoOnlyStream.addTrack(stream.getVideoTracks()[0]);
        recordVideo = RecordRTC(videoOnlyStream, {
            type: 'video'
        });
        recordVideo.startRecording();
        stop.disabled = false;
    }
};
var fileName;
stop.onclick = function() {
    document.querySelector('h1').innerHTML = 'Getting Blobs...';
    record.disabled = false;
    stop.disabled = true;
    preview.src = '';
    preview.poster = 'ajax-loader.gif';
    fileName = Math.round(Math.random() * 99999999) + 99999999;
    recordVideo.stopRecording(function() {
        document.querySelector('h1').innerHTML = 'Uploading to server...';
        PostBlob(recordVideo.getBlob(), fileName);
    });

};
function xhr(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
    request.open('POST', url);
    request.setRequestHeader('X-CSRF-Token', token);
    request.send(data);
}