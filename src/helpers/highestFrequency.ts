export function findHighestFrequencyPaths(data, topNodeId) {
  function findNodeById(id) {
    return data.nodes.find((node) => node.id === id);
  }

  function findChildren(node) {
    return node.children.map((id) => findNodeById(id));
  }

  function calculateFrequency(node, frequencyMap, possibleMap) {
    if (
      frequencyMap[node.id] !== undefined &&
      possibleMap[node.id] !== undefined
    ) {
      return;
    }

    if (node.type === 'event') {
      const frequency = parseInt(node.data?.frequency);
      const isPossible = node.data.isPossible;

      frequencyMap[node.id] = { frequency, path: [node.id] };
      if (isPossible) {
        possibleMap[node.id] = { frequency, path: [node.id] };
      } else {
        possibleMap[node.id] = { frequency: Infinity, path: [] };
      }
      return;
    }

    const children = findChildren(node);
    let maxFrequency = 0;
    let productFrequency = 0;
    let possibleFrequency = Infinity;
    let totalPossibleFrequency = 0;
    let path = [];
    let possiblePath = [];

    for (let child of children) {
      calculateFrequency(child, frequencyMap, possibleMap);
      let childFrequency = frequencyMap[child.id].frequency;
      let childPossibleFrequency = possibleMap[child.id].frequency;

      if (node.data.gate === 'or') {
        if (childFrequency > maxFrequency) {
          maxFrequency = childFrequency;
          path = [child.id].concat(frequencyMap[child.id].path || []);
        }
        if (childPossibleFrequency < possibleFrequency) {
          possibleFrequency = childPossibleFrequency;
          possiblePath = [child.id].concat(possibleMap[child.id].path || []);
        }
      } else if (node.data.gate === 'and') {
        productFrequency *= childFrequency;
        path.push(child.id);
        path = path.concat(frequencyMap[child.id].path || []);

        totalPossibleFrequency *= childPossibleFrequency;
        possiblePath.push(child.id);
        possiblePath = possiblePath.concat(possibleMap[child.id].path || []);
      }
    }

    let frequency = node.data.gate === 'or' ? maxFrequency : productFrequency;
    let possibleFinalFrequency =
      node.data.gate === 'or' ? possibleFrequency : totalPossibleFrequency;

    frequencyMap[node.id] = { frequency, path };
    possibleMap[node.id] = {
      frequency: possibleFinalFrequency,
      path: possiblePath,
    };
  }

  function findHighestFrequencyPath(startNode) {
    let frequencyMap = {};
    let possibleMap = {};

    calculateFrequency(startNode, frequencyMap, possibleMap);

    return {
      frequencyMap,
      possibleMap,
    };
  }

  const topGateNode = findNodeById(topNodeId);
  const result = findHighestFrequencyPath(topGateNode);

  // Paths and costs
  let highestFrequencyPath = result.frequencyMap[topNodeId].path;
  let highestFrequency = result.frequencyMap[topNodeId].frequency;
  let highestPossibleFrequencyPath = result.possibleMap[topNodeId].path;
  let highestPossibleFrequency = result.possibleMap[topNodeId].frequency;

  // Display the results
  highestFrequencyPath = [topNodeId, ...highestFrequencyPath];

  highestPossibleFrequencyPath = [topNodeId, ...highestPossibleFrequencyPath];
  highestFrequencyPath.pop();
  return {
    highestFrequencyPath,
    highestFrequency,
    highestPossibleFrequencyPath,
    highestPossibleFrequency,
  };
}
