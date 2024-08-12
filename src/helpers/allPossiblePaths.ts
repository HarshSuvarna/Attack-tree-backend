export function findPossiblePaths(data, topNodeId) {
  const nodes = data.nodes;
  const edges = data.edges;

  function findNodeById(id) {
    return nodes.find((node) => node.id === id);
  }

  function calculatePossibility(nodeId) {
    const node = findNodeById(nodeId);
    if (!node) return { isPossible: false, paths: [] };

    // If it's an event node, return its possibility
    if (node.type === 'event') {
      const isPossible = node.data.isPossible;
      return { isPossible, paths: isPossible ? [[nodeId]] : [] };
    }

    // If it's a gate node, calculate based on gate type
    const children = node.children || [];
    let allPaths = [];
    let isPossible = false;

    if (node.data.gate === 'or') {
      for (let childId of children) {
        const result = calculatePossibility(childId);
        if (result.isPossible) {
          isPossible = true;
          allPaths = allPaths.concat(
            result.paths.map((path) => [nodeId, ...path]),
          );
        }
      }
    } else if (node.data.gate === 'and') {
      let allChildPaths = [[]];
      isPossible = true;

      for (let childId of children) {
        const result = calculatePossibility(childId);
        if (!result.isPossible) {
          isPossible = false;
          allPaths = [];
          break;
        }

        let newPaths = [];
        for (let parentPath of allChildPaths) {
          for (let childPath of result.paths) {
            newPaths.push(parentPath.concat([nodeId, ...childPath]));
          }
        }
        allChildPaths = newPaths;
      }

      if (isPossible) {
        allPaths = allChildPaths;
      }
    }

    return { isPossible, paths: allPaths };
  }
  let possiblePaths = calculatePossibility(topNodeId);
  let allPossibleEdges = [];
  for (const paths of possiblePaths.paths) {
    allPossibleEdges = [...(allPossibleEdges || []), ...paths];
  }

  return { allPossibleEdges };
}
