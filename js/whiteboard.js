function Whiteboard(container) {
  this.container = container;
  this.width = this.container.width();
  this.height = this.container.height();
  this.color = "#000";
  this.brushMidSize = 5;
  this.brushStartSize = 5;
  this.brushEndSize = 5;
  this.isDrawing = false;
  this.shapeData = {};
  this.shapeIndex = 0;
  this.shapeRedoData = {};
  this.shapeRedoIndex = 0;
  this.setupWhiteboard();
}

Whiteboard.prototype.setColor = function(color) {
  this.color = color;
};

Whiteboard.prototype.setMidSize = function(size) {
  this.brushMidSize = size;
};

Whiteboard.prototype.setStartSize = function(size) {
  this.brushStartSize = size;
};

Whiteboard.prototype.setEndSize = function(size) {
  this.brushEndSize = size;
};

Whiteboard.prototype.undo = function() {
  if (Object.keys(this.shapeData).length > 0) {
    this.shapeIndex--;
    this.stage.removeChild(this.shapeData[this.shapeIndex].shape);
    this.stage.update();
    this.shapeRedoData[this.shapeRedoIndex] = this.shapeData[this.shapeIndex];
    this.shapeRedoIndex++;
    delete this.shapeData[this.shapeIndex];
  }
};

Whiteboard.prototype.redo = function() {
  if (Object.keys(this.shapeRedoData).length > 0) {
    this.shapeRedoIndex--;
    this.shapeData[this.shapeIndex] = this.shapeRedoData[this.shapeRedoIndex];
    delete this.shapeRedoData[this.shapeRedoIndex];
    this.stage.addChild(this.shapeData[this.shapeIndex].shape);
    this.stage.update();
    this.shapeIndex++;
  }
};

Whiteboard.prototype.clear = function() {
  if (Object.keys(this.shapeData).length > 0) {
    for (var i = 0; i < this.shapeIndex; i++) {
      this.stage.removeChild(this.shapeData[i].shape);
      delete this.shapeData[i];
    }
    for (var i = 0; i < this.shapeRedoIndex; i++) {
      delete this.shapeRedoData[this.shapeRedoIndex];
    }
    this.shapeIndex = 0;
    this.shapeRedoIndex = 0;
    this.stage.update();
  }
};

Whiteboard.prototype.handleMouseDown = function(event) {
  this.isDrawing = true;
  this.shapeData[this.shapeIndex] = {};
  this.shapeData[this.shapeIndex].shape = new createjs.Shape();
  this.shapeData[this.shapeIndex].movement = [];
  this.stage.addChild(this.shapeData[this.shapeIndex].shape);
  var top = this.container.position().top;
  var left = this.container.position().left;
  this.shapeData[this.shapeIndex].movement.push({
    x: event.stageX / this.width,
    y: event.stageY / this.height,
    time: Date.now()
  });
  this.shapeData[this.shapeIndex].shape.graphics.beginStroke(this.color).setStrokeStyle(this.brushStartSize, "round").moveTo(this.oldX, this.oldY).lineTo(event.stageX, event.stageY);
  this.stage.update();
};

Whiteboard.prototype.handleMouseUp = function(event) {
  var top = this.container.position().top;
  var left = this.container.position().left;
  this.shapeData[this.shapeIndex].movement.push({
    x: event.stageX / this.width,
    y: event.stageY / this.height,
    time: Date.now()
  });
  this.shapeData[this.shapeIndex].shape.graphics.beginStroke(this.color).setStrokeStyle(this.brushEndSize, "round").moveTo(this.oldX, this.oldY).lineTo(event.stageX, event.stageY);
  this.stage.update();
  this.isDrawing = false;
  this.shapeIndex++;
};

Whiteboard.prototype.handleMouseMove = function(event) {
  var top = this.container.position().top;
  var left = this.container.position().left;
  if (this.isDrawing) {
    this.shapeData[this.shapeIndex].movement.push({
      x: event.stageX / this.width,
      y: event.stageY / this.height,
      time: Date.now()
    });
    this.shapeData[this.shapeIndex].shape.graphics.beginStroke(this.color).setStrokeStyle(this.brushMidSize, "round").moveTo(this.oldX, this.oldY).lineTo(event.stageX, event.stageY);
    this.stage.update();
  }
  this.oldX = event.stageX;
  this.oldY = event.stageY;
};

Whiteboard.prototype.setupWhiteboard = function() {
  // Set canvas width and height
  this.container.append("<canvas id='whiteboard' " +
                        "width='" + this.width + "' " +
                        "height='" + this.height + "'>" +
                        "</canvas>");

  // Create stage element
  this.stage = new createjs.Stage(document.getElementById("whiteboard"));
  this.stage.enableDOMEvents(true);

  // Handle drawing events
  var whiteboard = this;

  // Mouse down
  this.stage.on("stagemousedown", function(event) {
    whiteboard.handleMouseDown(event);
  });

  // Mouse up
  this.stage.on("stagemouseup", function(event) {
    whiteboard.handleMouseUp(event);
  });

  // Mouse move
  this.stage.on("stagemousemove", function(event) {
    whiteboard.handleMouseMove(event);
  });
}
