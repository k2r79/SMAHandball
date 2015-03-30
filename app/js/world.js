function World(team1, team2) {

  var WIDTH = 800;
  var HEIGHT = 600;
  var WALL_THICKNESS = 30;

  var CENTER_X = WALL_THICKNESS + 0.5 * (WIDTH - WALL_THICKNESS*2);
  var CENTER_Y = WALL_THICKNESS + 0.5 * (HEIGHT - WALL_THICKNESS*2);
  var MIN_X = WALL_THICKNESS;
  var MAX_X = WIDTH - WALL_THICKNESS;
  var MIN_Y = WALL_THICKNESS;
  var MAX_Y = HEIGHT - WALL_THICKNESS;

  var GOAL_TARGET_SIZE = 80;
  var GOAL_POST_SIZE = 20;
  var GOAL_THICKNESS = 5;

  var agents = [];

  var botsContainer = new PIXI.DisplayObjectContainer();

  var ground    = Matter.Bodies.rectangle(WIDTH/2,
                                          HEIGHT-WALL_THICKNESS/2,
                                          WIDTH,
                                          WALL_THICKNESS,
                                          { isStatic: true });

  var leftWall  = Matter.Bodies.rectangle(WALL_THICKNESS/2,
                                          HEIGHT/2,
                                          WALL_THICKNESS,
                                          HEIGHT,
                                          { isStatic: true });

  var rightWall = Matter.Bodies.rectangle(WIDTH - WALL_THICKNESS/2,
                                          HEIGHT/2,
                                          WALL_THICKNESS,
                                          HEIGHT,
                                          { isStatic: true });

  var topWall   = Matter.Bodies.rectangle(WIDTH/2,
                                          WALL_THICKNESS/2,
                                          WIDTH,
                                          WALL_THICKNESS,
                                          { isStatic: true });



  var physics = new Physics(WIDTH, HEIGHT, WALL_THICKNESS);
  physics.addBody(ground);
  physics.addBody(leftWall);
  physics.addBody(rightWall);
  physics.addBody(topWall);

  var physicsHelper = {
    attachAgents: function (agentA, agentB, stiffness) {
      var constraint = Matter.Constraint.create({bodyA:agentA.getBody(), bodyB:agentB.getBody(), stiffness:stiffness});
      physics.addConstraint(constraint);

      return constraint;
    },
    detachAgents: function (constraint) {
      physics.removeConstraint(constraint);
    }
  };



  function add (agent) {
    agents.push(agent);
    botsContainer.addChild(agent.sprite);
    physics.addBody(agent.getBody());
    agent.getBody().agent = agent;
    agent.setPhysicsHelper(physicsHelper);
  }

  function addLeftGoal(team) {
    var target = new GoalTarget(team, GOAL_TARGET_SIZE, GOAL_THICKNESS);
    add(target);
    target.setPosition({x:MIN_X + GOAL_THICKNESS/2, y:CENTER_Y});

    var post = new GoalPost(team, GOAL_POST_SIZE, GOAL_THICKNESS);
    add(post);
    post.setPosition({x: MIN_X + GOAL_POST_SIZE/2, y: CENTER_Y - GOAL_TARGET_SIZE/2 });
    post = new GoalPost(team, GOAL_POST_SIZE, GOAL_THICKNESS);
    add(post);
    post.setPosition({x: MIN_X + GOAL_POST_SIZE/2, y: CENTER_Y + GOAL_TARGET_SIZE/2 });
  }

  function addRightGoal(team) {
    var target = new GoalTarget(team, GOAL_TARGET_SIZE, GOAL_THICKNESS);
    add(target);
    target.setPosition({x:MAX_X - GOAL_THICKNESS/2, y:CENTER_Y});
    
    var post = new GoalPost(team, GOAL_POST_SIZE, GOAL_THICKNESS);
    add(post);
    post.setPosition({x: MAX_X - GOAL_POST_SIZE/2, y: CENTER_Y - GOAL_TARGET_SIZE/2 });
    post = new GoalPost(team, GOAL_POST_SIZE, GOAL_THICKNESS);
    add(post);
    post.setPosition({x: MAX_X - GOAL_POST_SIZE/2, y: CENTER_Y + GOAL_TARGET_SIZE/2 });
  }

  addLeftGoal(team1);
  addRightGoal(team2);
  
  function setRandomPosition(agent) {
    agent.setPosition({x: WALL_THICKNESS + Math.random() * (WIDTH - WALL_THICKNESS*2),
                       y: WALL_THICKNESS + Math.random() * (HEIGHT - WALL_THICKNESS*2)});
  }

  function setCenteredX(agent) {
    agent.setPosition({x: WALL_THICKNESS + 0.5 * (WIDTH - WALL_THICKNESS*2),
                       y: agent.getPosition().y });
  }
  
  function setCenteredY(agent) {
    agent.setPosition({x: agent.getPosition().x,
                       y: WALL_THICKNESS + 0.5 * (HEIGHT - WALL_THICKNESS*2)});
  }
  
  function processPerceptions() {
    _.each(agents, function(agentA){
      _.each(agents, function(agentB) {
        if(perceives(agentA, agentB)) {
          agentA.handlePerception(agentB);
        }
      });
    }); 
  }

  function perceives(agentA, agentB) {
    var distX = agentA.getPosition().x - agentB.getPosition().x;
    var distY = agentA.getPosition().y - agentB.getPosition().y;
    
    var dist =  distX*distX + distY*distY;

    return dist < 100*100;
  }


  function processCollisions() {
    var collisions = physics.collisions();
    _.each(collisions, function(collision) {
      
      var agentA = collision.bodyA.agent;
      var agentB = collision.bodyB.agent;
      if( agentA && agentB) {
        agentA.handleCollision(agentB);
        agentB.handleCollision(agentA);
      }

    });
  }

  function render (deltaTime) {
    agents.forEach(function(agent) {
      agent.update(deltaTime);
    });

    physics.update(deltaTime);
    //physics.patchPositions();
    processCollisions();
    processPerceptions();
  }

  return extend(null, {
    add: add,
    render: render,
    sprite: botsContainer,
    agents: agents,

    setRandomPosition: setRandomPosition
  });
}
