// Colors
var COLORS = {
  "black": "#000",
  "white": "#FFF",
  "grey": "#555",
  "green": "#2ecc71",
  "blue": "#2196F3",
  "purple": "#9b59b6",
  "brown": "#6d3c37",
  "yellow": "#fffc00",
  "orange": "#ff9800",
  "red": "#ff1800"
};

// DOM elements
var body = $("body");
var colorsPanel = $(".colors_panel");
var sidePanel = $(".side_panel");
var sidePanelStripe = $(".side_panel_stripe");
var otherTools = $(".other_tool");
var midSize = $(".mid_size");
var startSize = $(".start_size");
var endSize = $(".end_size");

// Whiteboard
var whiteboard;

// Initilization on document ready
$(document).ready(function() {
  // Load colors
  for (var color in COLORS) {
    colorsPanel.append("<div class='" + color + " color' onclick='setColor(this)'></div>");
  }

  // Create whiteboard
  whiteboard = new Whiteboard(body);

  sidePanel.mouseenter(function() {
    sidePanel.css("left", "0px");
    sidePanelStripe.css("opacity", "0");
  });

  sidePanel.mouseleave(function() {
    sidePanel.css("left", "-" + (sidePanel.width() - sidePanelStripe.width()) + "px");
    sidePanelStripe.css("opacity", "1");
  });

  // Size sliders
  var midSizeSlider = new Slider(midSize, 2, 50, function(value) {
    whiteboard.setMidSize(value);
  });
  var startSizeSlider = new Slider(startSize, 2, 50, function(value) {
    whiteboard.setStartSize(value);
  });
  var endSizeSlider = new Slider(endSize, 2, 50, function(value) {
    whiteboard.setEndSize(value);
  });
});

function setColor(e) {
  whiteboard.setColor(COLORS[e.classList[0]]);
}

otherTools.click(function(e) {
  var type = e.target.classList[0];
  if (type == "undo") {
    whiteboard.undo();
  } else if (type == "redo") {
    whiteboard.redo();
  } else if (type == "clear") {
    whiteboard.clear();
  }
});
