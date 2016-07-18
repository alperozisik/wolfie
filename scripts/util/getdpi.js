//bug
function getDPI(val) {
    var avg = (Device.screenHeight + Device.screenWidth) / 2;
    return (val * avg) / Device.screenDpi;
}