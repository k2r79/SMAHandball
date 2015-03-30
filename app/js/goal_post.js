function GoalPost(team, size, thickness) {

  var agent = new Agent("GoalPost", size, thickness, 0);
  agent.getBody().isStatic = true;

  function getTeam() {
    return team;
  }

  return extend(agent, {
    getTeam: getTeam
  });
}
