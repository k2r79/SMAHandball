function init () {
  var canvasElement = document.querySelector("#canvas");

  var stage = new PIXI.Stage(0xcccccc);
  var renderer = new PIXI.autoDetectRenderer(800,600, canvasElement);

  var world = new World("team 1", "team 2");

  _.times(80, function() {
    _.tap(new Bot(), function(bot) {
      world.add(bot);
      world.setRandomPosition(bot);
    });
  });

  _.tap(new Ball(), function(ball) {
    world.add(ball);
    world.setRandomPosition(ball);
  });

  stage.addChild(world.sprite);

  var prevTimestamp = 0;
  function animate(timestamp) {

    var deltaTime = timestamp - prevTimestamp;
    prevTimestamp += deltaTime;

    world.render(deltaTime);
    renderer.render(stage);

    requestAnimFrame(animate);
  }

  requestAnimFrame(animate);
}
