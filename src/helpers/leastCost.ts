export function findPaths(data, topNodeId) {
  function findNodeById(id) {
    return data.nodes.find((node) => node.id === id);
  }

  function findChildren(node) {
    return node.children.map((id) => findNodeById(id));
  }

  function calculateCost(node, costMap, possibleMap) {
    if (costMap[node.id] !== undefined && possibleMap[node.id] !== undefined) {
      return;
    }

    if (node.type === 'event') {
      const cost = parseInt(node.data.cost);
      const isPossible = node.data.isPossible;

      costMap[node.id] = { cost, path: [node.id] };
      if (isPossible) {
        possibleMap[node.id] = { cost, path: [node.id] };
      } else {
        possibleMap[node.id] = { cost: Infinity, path: [] };
      }
      return;
    }

    const children = findChildren(node);
    let minCost = Infinity;
    let totalCost = 0;
    let possibleCost = Infinity;
    let totalPossibleCost = 0;
    let path = [];
    let possiblePath = [];

    for (let child of children) {
      calculateCost(child, costMap, possibleMap);
      let childCost = costMap[child.id].cost;
      let childPossibleCost = possibleMap[child.id].cost;

      if (node.data.gate === 'or') {
        if (childCost < minCost) {
          minCost = childCost;
          path = [child.id].concat(costMap[child.id].path || []);
        }
        if (childPossibleCost < possibleCost) {
          possibleCost = childPossibleCost;
          possiblePath = [child.id].concat(possibleMap[child.id].path || []);
        }
      } else if (node.data.gate === 'and') {
        totalCost += childCost;
        path.push(child.id);
        path = path.concat(costMap[child.id].path || []);

        totalPossibleCost += childPossibleCost;
        possiblePath.push(child.id);
        possiblePath = possiblePath.concat(possibleMap[child.id].path || []);
      }
    }

    let cost = node.data.gate === 'or' ? minCost : totalCost;
    let possibleFinalCost =
      node.data.gate === 'or' ? possibleCost : totalPossibleCost;

    costMap[node.id] = { cost, path };
    possibleMap[node.id] = {
      cost: possibleFinalCost,
      path: possiblePath,
    };
  }

  function findLeastCostPath(startNode) {
    let costMap = {};
    let possibleMap = {};

    calculateCost(startNode, costMap, possibleMap);

    return {
      costMap,
      possibleMap,
    };
  }

  const topGateNode = findNodeById(topNodeId);
  const result = findLeastCostPath(topGateNode);

  // Paths and costs
  let leastCostPath = result.costMap[topNodeId].path;
  let leastCost = result.costMap[topNodeId].cost;
  let leastPossibleCostPath = result.possibleMap[topNodeId].path;
  let leastPossibleCost = result.possibleMap[topNodeId].cost;

  // Display the results
  leastCostPath = [topNodeId, ...leastCostPath];

  leastPossibleCostPath = [topNodeId, ...leastPossibleCostPath];
  leastCostPath.pop();
  return {
    leastCostPath,
    leastCost,
    leastPossibleCostPath,
    leastPossibleCost,
  };
}

export function createPath(
  nodeIdsInPath: Array<string>,
  edges: any,
  nodes: any,
) {
  let nodeIds = [...new Set(nodeIdsInPath)];
  const edgeMap = {};
  const edgesCopy = edges.map((edge) => ({ ...edge }));
  edgesCopy.forEach((edge: any) => {
    edgeMap[edge.id] = edge;
  });
  if (nodeIds?.length) {
    for (let i = 0; i < nodeIds?.length - 1; i++) {
      const foundNode = (nodes || []).find((n: any) => n.id === nodeIds[i]);
      if (foundNode && foundNode.children) {
        foundNode.children.forEach((c: string) => {
          if (nodeIds.includes(c)) {
            const edgeId = `${nodeIds[i]}-${c}`;
            if (edgeMap[edgeId]) {
              edgeMap[edgeId]['animated'] = true;
            }
          }
        });
      }
    }
  }
  return Object.values(edgeMap);
}
