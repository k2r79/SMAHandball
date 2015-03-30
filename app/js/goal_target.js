function GoalTarget(team, size, thickness) {

  var agent = new Agent("GoalTarget", thickness, size, 0xff0000);
  agent.getBody().isStatic = true;

  function getTeam() {
    return team;
  }

  return extend(agent, {
    getTeam: getTeam
  });
}
