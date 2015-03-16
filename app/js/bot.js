function Bot() {
    var BOT_RADIUS = 2;
    var BOT_COLOR = 0x000000;

    var agent = new Agent("Bot", BOT_RADIUS, BOT_COLOR);

    var delay = 0;
    var targetResource = null;
    var resourceConstraint = null;
    var collidedResource = null;
    var interesting = false;
    var targetAgent = null;

    var expertSystem = new ExpertSystem();
    expertSystem.addRule(["Time to move", "Saw resource", "20%"], "Move to resource");
    expertSystem.addRule(["Time to move"], "Move random");
    expertSystem.addRule(["No resource", "Touched resource"], "Grab resource");
    expertSystem.addRule(["Has resource", "Touched resource"], "Release resource");
    expertSystem.addRule(["Perceived agent is interesting", "No resource"], "Follow agent");

    function perceive() {
        var perceived = [];
        //if (delay <= 0) {
        perceived.push("Time to move");
        //}

        if (!resourceConstraint) {
            perceived.push("No resource");
        }
        if (resourceConstraint) {
            perceived.push("Has resource");
        }

        if (collidedResource) {
            perceived.push("Touched resource");
        }

        if (targetResource) {
            perceived.push("Saw resource");
        }

        if (targetAgent) {
            perceived.push("Perceived agent is interesting");
        }

        if (Math.random() > 0.2) {
            perceived.push("20%");
        }

        return perceived;
    }

    function analyze(facts) {
        expertSystem.resetFacts();
        _.each(facts, function (f) {
            expertSystem.setFactValue(f, true);
        });

        var infered = expertSystem.infer();
        if (infered.length > 0) {
            return infered[0];
        }
        return null;
    }

    function act(fact) {
        switch (fact) {
            case "Grab resource":
                grabResource(collidedResource);
                return;
            case "Release resource":
                releaseResource();
                return;
            case "Follow agent":
                goToAgent(targetAgent);
                return;
            case "Move random":
                addRandomVelocity();
                return;
            case "Move to resource":
                goToAgent(targetResource);
                return;
        }
    }

    function addRandomVelocity() {
        Matter.Body.setVelocity(agent.getBody(),
            {
                x: -2 + Math.random() * 4,
                y: -2 + Math.random() * 4
            });
    }

    function grabResource(resource) {
        resourceConstraint = agent.getPhysicsHelper().attachAgents(agent, resource, 1);
        interesting = true;
    }

    function releaseResource() {
        agent.getPhysicsHelper().detachAgents(resourceConstraint);
        resourceConstraint = null;
        interesting = false;
    }

    function handleCollision(collided) {
        if (collided.type === "Ball") {
            collidedResource = collided;
        }
    }

    function handlePerception(perceived) {
        if (perceived.type === "Ball") {
            if (perceived !== targetResource && !resourceConstraint) {
                targetResource = perceived;
                interesting = true;
            }
        } else if (perceived.type === "Bot") {
            if (perceived.interesting) {
                targetAgent = perceived;
            }
        }
    }

    function goToAgent(target) {
        Matter.Body.setVelocity(agent.getBody(),
            {
                x: (target.getPosition().x - agent.getPosition().x) > 0 ? 1 : -1,
                y: (target.getPosition().y - agent.getPosition().y) > 0 ? 1 : -1
            });
    }

    function updateTime(timestamp) {
        delay -= timestamp;
    }

    function update(timestamp) {
        if (!resourceConstraint) {
            interesting = false;
        }

        agent.update(timestamp);
        updateTime(timestamp);

        act(analyze(perceive()));

        postUpdate();
    }

    function postUpdate() {
        if (delay <= 0) {
            delay = Math.random() * 500 + 1000;
        }
        collidedResource = null;
    }

    return extend(agent, {
        update: update,
        handleCollision: handleCollision,
        handlePerception: handlePerception,
        interesting: interesting
    });
}
