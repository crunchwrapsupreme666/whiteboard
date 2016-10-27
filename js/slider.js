function Slider(container, min, max, callback) {
  this.container = container;
  this.min = min;
  this.max = max;
  this.callback = callback;
  this.sliderBackground = this.container[0].className + "_slider_background";
  this.sliderForeground = this.container[0].className + "_slider_foreground";
  this.sliderValue = this.container[0].className + "_slider_value";
  this.value = (max + min) / 2;
  this.container.html(
    "<div id='" + this.sliderBackground + "' class='slider_background'>" +
      "<div id='" + this.sliderValue + "' class='slider_value'></div>" +
      "<div id='" + this.sliderForeground + "' class='slider_foreground'></div>" +
    "</div>"
  );
  var slider = this;
  $("#" + this.sliderValue).mousedown(function() {
    slider.isDragging = true;
    $(document)
    .mousemove(function(e) {
      var sliderLeftOffset = $("#" + slider.sliderBackground).offset().left;
      var sliderWidth = $("#" + slider.sliderBackground).width();
      if (slider.isDragging &&
        e.pageX >= sliderLeftOffset && e.pageX <= sliderLeftOffset + sliderWidth) {
        var percent = (e.pageX - sliderLeftOffset) / sliderWidth;
        $("#" + slider.sliderValue)
        .css("left", percent * 100 + "%");
        $("#" + slider.sliderForeground).css("width", percent * 100 + "%");
        slider.value = ((slider.max - slider.min) * percent) + slider.min;
        slider.callback(slider.value);
      }
    })
    .mouseup(function() {
      slider.isDragging = false;
    });
  });
}
