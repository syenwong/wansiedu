/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/12/21.
 * Copyright 2021/12/21 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/12/21
 * @version */
const $ = (el) => {
    return document.querySelector(el);
};
export class Draw {
    constructor (el, params) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight, defaultColor, colors, defaultLineWith = 2, lineWidths } = params;
        this.el = el;
        this.canvas = $(el);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.beginPoint = null;
        this.points = [];
        this.clearing = 0;
        this.lineWidths = lineWidths;
        this.colors = colors;
        this.render(offsetLeft, offsetTop, offsetWidth, offsetHeight);
        this.eventDefined();
        this.ctx.lineCap = 'round';
        this.defaultColor = defaultColor;
        this.defaultLineWith = defaultLineWith;
        return this;
    }
    render (offsetLeft, offsetTop, offsetWidth, offsetHeight) {
        this.width = this.canvas.width = offsetWidth;
        this.height = this.canvas.height = offsetHeight;
        this.min_x = offsetLeft;
        this.min_y = offsetTop;
        this.max_x = this.min_x + offsetWidth;
        this.max_y = this.min_y + offsetHeight;
    }
    eventDefined () {
        const that = this;
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const e = event.changedTouches[0];
            // const e = event;
            if (e.force === 0.5) {
                return false;
            }
            that.isDrawing = true;
            const pageX = e.pageX;
            const pageY = e.pageY;
            that.points.push({ x: pageX, y: pageY });
            that.beginPoint = { x: pageX, y: pageY };
        });
        this.canvas.addEventListener('touchend', () => {
            that.isDrawing = false;
            that.ctx.closePath();
        });
        this.canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const e = event.changedTouches[0];
            // const e = event;
            if (e.force === 0.5) {
                return false;
            }
            const pageX = e.pageX;
            const pageY = e.pageY;
            if (!that.isDrawing || (pageX < that.min_x || pageX > that.max_x || pageY < that.min_y || pageY > that.max_y)) {
                that.isDrawing = false;
                return;
            }
            if (that.clearing) {
                that.ctx.clearRect(pageX - that.min_x - that.clearing / 2, pageY - that.min_y + 5 - that.clearing / 2, that.clearing, that.clearing);
            } else {
                that.points.push({ x: pageX, y: pageY });
                if (that.points.length > 3) {
                    const lastTwoPoints = that.points.slice(-2);
                    const controlPoint = lastTwoPoints[0];
                    const endPoint = {
                        x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                        y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
                    };
                    that.ctx.beginPath();
                    that.ctx.moveTo(that.beginPoint.x - that.min_x, that.beginPoint.y - that.min_y);
                    that.ctx.quadraticCurveTo(controlPoint.x - that.min_x, controlPoint.y - that.min_y, endPoint.x - that.min_x, endPoint.y - that.min_y);
                    that.ctx.lineWidth = that.defaultLineWith;
                    that.ctx.strokeStyle = that.defaultColor;
                    that.ctx.stroke();
                    that.ctx.closePath();
                    that.beginPoint = endPoint;
                }
            }
        });
    }
    clear () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawImage (url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            img.onload = (e) => {
                this.ctx.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
                resolve();
            };
            img.onerror = (e) => {
                reject();
            };
        });
    }
}
