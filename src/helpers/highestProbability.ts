export function findHighestProbabilityPaths(data, topNodeId) {
  function findNodeById(id) {
    return data.nodes.find((node) => node.id === id);
  }

  function findChildren(node) {
    return node.children.map((id) => findNodeById(id));
  }

  function calculateProbability(node, probabilityMap, possibleMap) {
    if (
      probabilityMap[node.id] !== undefined &&
      possibleMap[node.id] !== undefined
    ) {
      return;
    }

    if (node.type === 'event') {
      const probability = parseFloat(node.data?.probability);
      const isPossible = node.data.isPossible;

      probabilityMap[node.id] = { probability, path: [node.id] };
      if (isPossible) {
        possibleMap[node.id] = { probability, path: [node.id] };
      } else {
        possibleMap[node.id] = { probability: -Infinity, path: [] };
      }
      return;
    }

    const children = findChildren(node);
    let maxProbability = -Infinity;
    let productProbability = 1;
    let possibleProbability = -Infinity;
    let totalPossibleProbability = 1;
    let path = [];
    let possiblePath = [];

    for (let child of children) {
      calculateProbability(child, probabilityMap, possibleMap);
      let childProbability = probabilityMap[child.id].probability;
      let childPossibleProbability = possibleMap[child.id].probability;

      if (node.data.gate === 'or') {
        if (childProbability > maxProbability) {
          maxProbability = childProbability;
          path = [child.id].concat(probabilityMap[child.id].path || []);
        }
        if (childPossibleProbability > possibleProbability) {
          possibleProbability = childPossibleProbability;
          possiblePath = [child.id].concat(possibleMap[child.id].path || []);
        }
      } else if (node.data.gate === 'and') {
        productProbability *= childProbability;
        path.push(child.id);
        path = path.concat(probabilityMap[child.id].path || []);

        totalPossibleProbability *= childPossibleProbability;
        possiblePath.push(child.id);
        possiblePath = possiblePath.concat(possibleMap[child.id].path || []);
      }
    }

    let probability =
      node.data.gate === 'or' ? maxProbability : productProbability;
    let possibleFinalProbability =
      node.data.gate === 'or' ? possibleProbability : totalPossibleProbability;

    probabilityMap[node.id] = { probability, path };
    possibleMap[node.id] = {
      probability: possibleFinalProbability,
      path: possiblePath,
    };
  }

  function findHighestProbabilityPath(startNode) {
    let probabilityMap = {};
    let possibleMap = {};

    calculateProbability(startNode, probabilityMap, possibleMap);

    return {
      probabilityMap,
      possibleMap,
    };
  }

  const topGateNode = findNodeById(topNodeId);
  const result = findHighestProbabilityPath(topGateNode);

  // Paths and probabilities
  let highestProbabilityPath = result.probabilityMap[topNodeId].path;
  let highestProbability = result.probabilityMap[topNodeId].probability;
  let highestPossibleProbabilityPath = result.possibleMap[topNodeId].path;
  let highestPossibleProbability = result.possibleMap[topNodeId].probability;

  // Adjust paths
  highestProbabilityPath = [topNodeId, ...highestProbabilityPath];
  highestPossibleProbabilityPath = [
    topNodeId,
    ...highestPossibleProbabilityPath,
  ];
  highestProbabilityPath.pop();

  return {
    highestProbabilityPath,
    highestProbability,
    highestPossibleProbabilityPath,
    highestPossibleProbability,
  };
}
