function Agent() {
  
  var body = null;
  var sprite = null;
  var physicsHelper = null;

  if(arguments.length === 3) {
    initRoundAgent(arguments);
  
  } else if(arguments.length == 4) {
    initRectAgent(arguments);
  }

  function initRoundAgent(arguments) {
    type =    arguments[0];
    radius =  arguments[1];
    color =   arguments[2];
    body =    Matter.Bodies.circle(0, 0, radius, {density: 1, friction:0, restitution:0.5, mass:1});
    
    sprite = new PIXI.Graphics();
    sprite.beginFill(color);
    sprite.drawCircle(0,0, radius);
    sprite.endFill();
  }

  function initRectAgent(arguments) {
    type =    arguments[0];
    width =   arguments[1];
    height =  arguments[2];
    color =   arguments[3];
    
    body =    Matter.Bodies.rectangle(0, 0, width, height, {density: 1, friction:0, restitution:0.5, mass:1});
    
    sprite = new PIXI.Graphics();
    sprite.beginFill(color);
    sprite.drawRect(-width/2,-height/2, width, height);
    sprite.endFill();
  }
  
  function setPhysicsHelper(helper) {
    physicsHelper = helper;
  }
  
  function getPhysicsHelper() {
    return physicsHelper;
  }

  function getBody() {
    return body;
  }

  function setPosition(position) {
      Matter.Body.setPosition(getBody(), position);
  }

  function getPosition() {
    return getBody().position;
  }

  function update (timestamp) {
    sprite.x = getBody().position.x;
    sprite.y = getBody().position.y;
  }

  function handleCollision(collided) {
  }

  function handlePerception(perceived) {
  }

  return extend(null, {
    type:   type,
    sprite: sprite,

    getBody: getBody,

    setPhysicsHelper: setPhysicsHelper,
    getPhysicsHelper: getPhysicsHelper,

    setPosition: setPosition,
    getPosition: getPosition,

    handleCollision: handleCollision,
    handlePerception: handlePerception,

    update: update
  });
}
