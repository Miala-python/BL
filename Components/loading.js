// V1.1 BL
// from V1.0 EDDG

var Loading = {
    init: () => {
        Loading.title = document.getElementById('loadingTitle');
        Loading.progress = document.getElementById('loadingProgress');
    },

    setProgressBar: (val, animated = true) => {
        // console.log('SetPrgss', val);
        if (!Loading.progress) {
            return;
        }
        if (Loading.progressInterval) {
            clearInterval(Loading.progressInterval);
        }
        if (!animated) {
            Loading.progress.value = val;
            return;
        }
        if (val == 0) {
            Loading.progress.value = 0;
        }
        let currentVal = Loading.progress.value;
        // let step = (val - currentVal) / 50; // Adjust the number of steps as needed
        let sens = val - currentVal;
        Loading.progressInterval = setInterval(() => {
            currentVal += (val - currentVal) / 50;
            Loading.progress.value = currentVal;
            Loading.progress.innerHTML = Math.round(currentVal) + "%";
            if ((sens > 0 && currentVal >= val - 1) || (sens < 0 && currentVal <= val + 1)) {
                clearInterval(Loading.progressInterval);
                Loading.progress.value = val;
                Loading.progress.innerHTML = val + "%";
            }
        }, 40); // Adjust the interval time as needed
    },

    setTitle: (title) => {
        if (!Loading.title) {
            return;
        }
        Loading.title.innerHTML = title;
    }
}











var LoadingJSLoaded = true;