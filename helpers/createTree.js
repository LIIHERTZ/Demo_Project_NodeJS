let count = 1;
module.exports = (arr) => {
    function createTree(arr, parentId = "") { 
        const tree = []; 
        arr.forEach((item) => { 
            if (item.parent_id === parentId) { 
                const newItem = item; 
                newItem.index = count++;
                const children = createTree(arr, item.id); 
                if (children.length > 0) { 
                    newItem.children = children; 
                } 
                tree.push(newItem); 
            } 
        }); 
        return tree; 
    }
    count = 1;
    return createTree(arr,"");
}