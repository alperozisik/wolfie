/* globals util */
(function() {
  if (Device.deviceOS === "Android") { //bug
    Object.defineProperty(SMF.UI.Image.prototype, "dataField", {
      get: function() {
        switch (this.type) {
          case "TextBox":
          case "Label":
            return "text";
          case "Image":
            return "image";
        }
        return null;
      },
      configurable: true,
      enumerable: true
    });
  }

  !SMF.UI.TextBox.prototype.dataField && (SMF.UI.TextBox.prototype.dataField = "text");
  !SMF.UI.Label.prototype.dataField && (SMF.UI.Label.prototype.dataField = "text");
  !SMF.UI.Image.prototype.dataField && (SMF.UI.Image.prototype.dataField = "image");


  util.rboxDataRowRender = function rboxDataRowRender(e) {
    if (!(this instanceof SMF.UI.RepeatBox)) {
      throw Error("this function is for repeatbox row render");
    }
    var dataSource = this.dataSource,
      data = {};
    if (dataSource instanceof Array) {
      data = dataSource[e.rowIndex];
    }
    else if (dataSource instanceof Data.Dataset) {
      dataSource.seek(e.rowIndex);
      data = dataSource;
      if (data.value) {
        if (!data.value)
          data = {};
        else {
          data = JSON.parse(data.value);
        }
      }
    }
    else {
      throw Error("Not supported data type");
    }
    for (var i = 0; i < this.controls.length; i++) {
      var control = this.controls[i];
      if (!control.dataKey || (!control.dataField && !control.setData)) {
        continue;
      }
      if (!control.setData) {
        control[control.dataField] = getDataKeyValue(data, control.dataKey);
      }
      else {
        control.setData(getDataKeyValue(data, control.dataKey));
      }
    }
    if (typeof this.rowRenderCallback === "function") {
      this.rowRenderCallback.call(this, e);
    }
  };

  function getDataKeyValue(object, key) {
    var levels = key.split(".");
    var data = object;
    if (!data) return "";
    for (var i = 0; i < levels.length; i++) {
      data = data[levels[i]];
      if (!data) return "";
    }
    return data;
  }
})();