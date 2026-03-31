const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/tt/Digital-Wardrobe-Enterprise/frontend/src/components');
files.filter(f => f.endsWith('.js')).forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace 'http://localhost:8080/api/...' with process.env.REACT_APP_API_URL
    let modified = content.replace(/'http:\/\/localhost:8080\/api([^']*)'/g, '`${process.env.REACT_APP_API_URL || \'http://localhost:8080/api\'}$1`');
    
    // Replace `http://localhost:8080/api/...` with process.env.REACT_APP_API_URL
    modified = modified.replace(/`http:\/\/localhost:8080\/api([^`]*)`/g, '`${process.env.REACT_APP_API_URL || \'http://localhost:8080/api\'}$1`');
    
    if (content !== modified) {
        fs.writeFileSync(f, modified, 'utf8');
        console.log('Updated', f);
    }
});
