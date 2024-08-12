export function findLeastSkillPaths(data, topNodeId) {
  function findNodeById(id) {
    return data.nodes.find((node) => node.id === id);
  }

  function findChildren(node) {
    return node.children.map((id) => findNodeById(id));
  }

  function calculateSkill(node, skillMap, possibleMap) {
    if (skillMap[node.id] !== undefined && possibleMap[node.id] !== undefined) {
      return;
    }

    if (node.type === 'event') {
      const skill = parseInt(node.data?.skill);
      const isPossible = node.data.isPossible;

      skillMap[node.id] = { skill, path: [node.id] };
      if (isPossible) {
        possibleMap[node.id] = { skill, path: [node.id] };
      } else {
        possibleMap[node.id] = { skill: Infinity, path: [] };
      }
      return;
    }

    const children = findChildren(node);
    let minSkill = Infinity;
    let totalSkill = 0;
    let possibleSkill = Infinity;
    let totalPossibleSkill = 0;
    let path = [];
    let possiblePath = [];

    for (let child of children) {
      calculateSkill(child, skillMap, possibleMap);
      let childSkill = skillMap[child.id].skill;
      let childPossibleSkill = possibleMap[child.id].skill;

      if (node.data.gate === 'or') {
        if (childSkill < minSkill) {
          minSkill = childSkill;
          path = [child.id].concat(skillMap[child.id].path || []);
        }
        if (childPossibleSkill < possibleSkill) {
          possibleSkill = childPossibleSkill;
          possiblePath = [child.id].concat(possibleMap[child.id].path || []);
        }
      } else if (node.data.gate === 'and') {
        totalSkill += childSkill;
        path.push(child.id);
        path = path.concat(skillMap[child.id].path || []);

        totalPossibleSkill += childPossibleSkill;
        possiblePath.push(child.id);
        possiblePath = possiblePath.concat(possibleMap[child.id].path || []);
      }
    }

    let skill = node.data.gate === 'or' ? minSkill : totalSkill;
    let possibleFinalSkill =
      node.data.gate === 'or' ? possibleSkill : totalPossibleSkill;

    skillMap[node.id] = { skill, path };
    possibleMap[node.id] = {
      skill: possibleFinalSkill,
      path: possiblePath,
    };
  }

  function findLeastSkillPath(startNode) {
    let skillMap = {};
    let possibleMap = {};

    calculateSkill(startNode, skillMap, possibleMap);

    return {
      skillMap,
      possibleMap,
    };
  }

  const topGateNode = findNodeById(topNodeId);
  const result = findLeastSkillPath(topGateNode);

  // Paths and costs
  let leastSkillPath = result.skillMap[topNodeId].path;
  let leastSkill = result.skillMap[topNodeId].skill;
  let leastPossibleSkillPath = result.possibleMap[topNodeId].path;
  let leastPossibleSkill = result.possibleMap[topNodeId].skill;

  // Display the results
  leastSkillPath = [topNodeId, ...leastSkillPath];

  leastPossibleSkillPath = [topNodeId, ...leastPossibleSkillPath];
  leastSkillPath.pop();
  return {
    leastSkillPath,
    leastSkill,
    leastPossibleSkillPath,
    leastPossibleSkill,
  };
}
