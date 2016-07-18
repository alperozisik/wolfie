/* globals getDPI, util*/
(function() {

    function ButtonIcon(options) {
        if (!(this instanceof ButtonIcon))
            return new ButtonIcon(options);
        options = Object.assign({}, options);
        var imageOptions = {
            image: options.image,
            touchEnabled: false,
            height: "70%",
            top: "15%",
            imageFillType: SMF.UI.ImageFillType.ASPECTFIT
        };

        var containerOptions = {
            height: options.height,
            width: options.width,
            left: options.left,
            top: options.top,
            borderWidth: 0,
            backgroundTransparent: true
        };

        options.height = "100%";
        options.width = "100%";
        options.left = 0;
        options.top = 0;

        var icon = new SMF.UI.Image(
            imageOptions
        );

        var cnt = new SMF.UI.Container(containerOptions);
        var btn = util.uiFactory(SMF.UI.TextButton, options);

        cnt.add(btn);
        cnt.add(icon);
        cnt.image = icon;
        cnt.button = btn;

        icon.onShow = function(e) {
            this.left = this.top;
            this.width = this.height;
        };
        
        cnt.setEnabled = setEnabled;
        
        
        return cnt;
    }
    
    
    function setEnabled(value) {
        if(value) {
            this.lastColor && (this.button.fillColor = this.lastColor);
        } else {
            this.lastColor = this.button.fillColor;
            this.button.fillColor = "#CCCCCC";
        }
        this.image.visible = this.button.enabled = value;
        
        return value;
    }

    global.ButtonIcon = ButtonIcon;
})();