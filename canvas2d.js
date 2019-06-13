/**
 * Creates a Canvas object.
 * @param canvas
 * @param options
 * @returns {{wrapper: Element, canvas: *, ctx: CanvasRenderingContext2D, rightToolbox: Element, leftToolbox: Element, width: number, height: number, changeWidth: changeWidth, changeHeight: changeHeight, selectTheme1: selectTheme1, showToolbox: showToolbox, hideToolbox: hideToolbox, openToolbox: openToolbox, closeToolbox: closeToolbox, drawSprite: drawSprite}}
 * @constructor
 */
function Canvas(canvas, options) {
    let w = 1080;
    let h = 720;

    if (typeof options !== "undefined") {
        if (typeof options.w !== "undefined") w = parseInt(options.w);
        if (typeof options.h !== "undefined") h = parseInt(options.h);
    }

    let previous = canvas.previousSibling;

    let wrapper = createElementFromHTML("<div class='canvas-wrapper'></div>");
    let rightToolbox = createElementFromHTML("<div class='canvas-right-toolbox'></div>");
    let leftToolbox = createElementFromHTML("<div class='canvas-left-toolbox'></div>");
    wrapper.appendChild(canvas);
    wrapper.appendChild(rightToolbox);
    wrapper.appendChild(leftToolbox);

    previous.parentNode.insertBefore(wrapper, previous.nextSibling);

    canvas.classList.add("theme1");
    let ctx = canvas.getContext("2d");

    let canvasStyle = getComputedStyle(canvas);
    let borderRight = canvasStyle.getPropertyValue('border-right-width');
    let borderLeft = canvasStyle.getPropertyValue('border-left-width');
    let borderTop = canvasStyle.getPropertyValue('border-top-width');
    let borderBottom = canvasStyle.getPropertyValue('border-bottom-width');

    canvas.style.width = (w - parseInt(borderRight) - parseInt(borderLeft)) + "px";
    canvas.style.height = (h - parseInt(borderTop) - parseInt(borderBottom)) + "px";

    wrapper.style.width = w + "px";
    wrapper.style.height = h + "px";

    function createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        return div.firstChild;
    }

    return {
        wrapper: wrapper,
        canvas: canvas,
        ctx: ctx,
        rightToolbox: rightToolbox,
        leftToolbox: leftToolbox,
        width: w,
        height: h,
        changeWidth: function(w) {
            w = parseInt(w);
            let canvasStyle = getComputedStyle(this.canvas);
            let borderRight = canvasStyle.getPropertyValue("border-right-width");
            let borderLeft = canvasStyle.getPropertyValue("border-left-width");
            this.canvas.style.width = (w - parseInt(borderRight) - parseInt(borderLeft)) + "px";
            this.wrapper.style.width = w + "px";
        },
        changeHeight: function(h) {
            h = parseInt(h);
            let canvasStyle = getComputedStyle(this.canvas);
            let borderTop = canvasStyle.getPropertyValue("border-top-width");
            let borderBottom = canvasStyle.getPropertyValue("border-bottom-width");
            this.canvas.style.height = (h - parseInt(borderTop) - parseInt(borderBottom)) + "px";
            this.wrapper.style.height = h + "px";
        },
        selectTheme1: function() {
            this.canvas.classList.add("theme1");
        },
        showToolbox: function(toolbox) {
            switch (toolbox) {
                case "right":
                case "Right":
                case "RIGHT":
                    this.rightToolbox.style.display = "inherit";
                    break;
                case "left":
                case "Left":
                case "LEFT":
                    this.leftToolbox.style.display = "inherit";
                    break;
            }
        },
        hideToolbox: function(toolbox) {
            switch (toolbox) {
                case "right":
                case "Right":
                case "RIGHT":
                    this.rightToolbox.style.display = "none";
                    break;
                case "left":
                case "Left":
                case "LEFT":
                    this.leftToolbox.style.display = "none";
                    break;
            }
        },
        openToolbox: function(toolbox) {
            switch (toolbox.toLowerCase()) {
                case "right":
                    this.rightToolbox.classList.remove("close");
                    this.rightToolbox.classList.add("open");
                    break;
                case "left":
                    this.leftToolbox.classList.remove("close");
                    this.leftToolbox.classList.add("open");
                    break;
            }
        },
        closeToolbox: function(toolbox) {
            switch (toolbox.toLowerCase()) {
                case "right":
                    this.rightToolbox.classList.remove("open");
                    this.rightToolbox.classList.add("close");
                    break;
                case "left":
                    this.leftToolbox.classList.remove("open");
                    this.leftToolbox.classList.add("close");
                    break;
            }
        },
        drawSprite: function(sprite) {
            if (sprite.loaded) {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.ctx.drawImage(
                    sprite.image,
                    sprite.frameX * sprite.width,
                    sprite.frameY * sprite.height,
                    sprite.width, sprite.height,
                    sprite.posX, sprite.posY,
                    sprite.width * sprite.scale, sprite.height * sprite.scale
                );
            }

            let self = this;

            requestAnimationFrame(function() {
                self.drawSprite(sprite);
            });
        }
    };
}

/**
 * Creates a Sprite2D object.
 * @param image
 * @param xFrames
 * @param yFrames
 * @param posX
 * @param posY
 * @param scale
 * @returns {{loaded: boolean, image: *, width: number, height: number, xFrames: *, yFrames: *, posX: number, posY: number, frameX: number, frameY: number, origin: {x: number, y: number}, scale: number, rect: sprite.rect, init: sprite.init}}
 * @constructor
 */
let Sprite2D = function(image, xFrames, yFrames, posX, posY, scale) {
    if ((parseInt(xFrames) || 0) < 1) xFrames = 1;
    if ((parseInt(yFrames) || 0) < 1) yFrames = 1;
    posX = (parseInt(posX) || 0);
    posY = (parseInt(posY) || 0);
    scale = (parseFloat(scale) || 1.0);

    let sprite = {
        loaded: false,
        image: new Image(),
        width: 0,
        height: 0,
        xFrames: xFrames,
        yFrames: yFrames,
        posX: posX,
        posY: posY,
        frameX: 0,
        frameY: 0,
        origin: {
            x: 0,
            y: 0
        },
        scale: scale,
        rect: function() {
            return {
                x: this.posX,
                y: this.posY,
                w: this.width,
                h: this.height
            }
        },
        init: function() {
            this.loaded = true;
            this.width = this.image.width / this.xFrames;
            this.height = this.image.height / this.yFrames;
        }
    };

    sprite.image.onload = function() {
        sprite.init();
    };

    sprite.image.src = image;

    return sprite;
};

(function() {
    let canvases = [];

    [].forEach.call(
        document.querySelectorAll("canvas[canvas2d]"),
        function(canvas) {
            let canvasName = canvas.getAttribute("canvas2d");

            if (canvasName === "") {
                console.warn("\"canvas2d\" attribute for canvas cannot be empty.");
                return;
            } else if (typeof canvases[canvasName] !== "undefined") {
                console.warn("Canvas with attribute \"canvas2d\" equal to " + canvasName + " already defined.\nOnly the first one defined will be considered.")
                return;
            }

            let newCanvas = new Canvas(canvas);
            canvases[canvasName] = newCanvas;

            if (canvas.getAttribute("open-right") !== null) {
                newCanvas.showToolbox("right");
                newCanvas.openToolbox("right");
            }

            if (canvas.getAttribute("open-left") !== null) {
                newCanvas.showToolbox("left");
                newCanvas.openToolbox("left");
            }
        }
    );

    [].forEach.call(
        document.querySelectorAll("img[sprite2d]"),
        function(img) {
            let canvasName = img.getAttribute("canvas");

            if (canvasName === null || canvasName === "") {
                console.warn("\"canvas\" attribute for image " + img.src + " not defined or empty.");
                return;
            } else if (typeof canvases[canvasName] === "undefined") {
                console.warn("Canvas with name \"" + canvasName + "\" does not exist (image: " + img.src + ").");
                return;
            }

            let sprite = new Sprite2D(
                img.src,
                img.getAttribute("x-frames"),
                img.getAttribute("y-frames"),
                img.getAttribute("x-pos"),
                img.getAttribute("y-pos"),
                img.getAttribute("scale")
            );

            let canvas = canvases[canvasName];

            canvas.drawSprite(sprite);
        }
    );
})();