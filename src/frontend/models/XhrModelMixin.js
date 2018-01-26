var XhrModelMixin = {
    load: function () {
        if (this.isLoading || this.isLoaded()) {
            return;
        }

        var absoluteUrl = this.makeRequestUrl();

        this.isLoading = true;
        this.xhr.open("GET", absoluteUrl);
        this.xhr.send();
    },

    initXhr: function (xhr) {
        this.xhr = xhr;
        this.isLoading = false;

        if (this.xhr) {
            this.bindXhrEvents();
        }
    },

    bindXhrEvents: function () {
        var model = this;
        var xhr = this.xhr;

        this.xhr.addEventListener("load", function (event) {
            model.handleLoad.call(model, xhr, event);
        });

        this.xhr.addEventListener("error", function (event) {
            model.handleLoadError.call(model, xhr, event);
        });

        this.xhr.addEventListener("abort", function (event) {
            model.handleLoadError.call(model, xhr, event);
        });
    },

    handleLoad: function (xhr, event) {
        var model = this;
        this.isLoading = false;

        try {
            var response = JSON.parse(xhr.responseText);
            if (this.afterLoad && this.afterLoad instanceof Function) {
                this.afterLoad.call(this, xhr, event, response);
            }
        }
        catch (exception) {
            model.handleLoadError.call(model, xhr, event);
        }

        this.dispatchModelEvent('load');
    },

    handleLoadError: function (xhr, event) {
        this.isLoading = false;
        this.dispatchModelEvent('loadError');
    }
};

module.exports = XhrModelMixin;