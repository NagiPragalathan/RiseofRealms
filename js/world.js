// ==========================================
// World container
//
// This class contains the elements that make up the game world.
// Other modules retrieve information from the world or alter it
// using this class.
// ==========================================

function World(sx, sy, sz, db) {
    this.blocks = new Array(sx);
    for (var x = 0; x < sx; x++) {
        this.blocks[x] = new Array(sy);
        for (var y = 0; y < sy; y++) {
            this.blocks[x][y] = new Array(sz);
        }
    }
    this.sx = sx;
    this.sy = sy;
    this.sz = sz;
    this.players = {};
    this.db = db; // MongoDB reference
}

// createFlatWorld()
World.prototype.createFlatWorld = function (height) {
    this.spawnPoint = new Vector(this.sx / 2 + 0.5, this.sy / 2 + 0.5, height);
    for (var x = 0; x < this.sx; x++) {
        for (var y = 0; y < this.sy; y++) {
            for (var z = 0; z < this.sz; z++) {
                this.blocks[x][y][z] = z < height ? BLOCK.DIRT : BLOCK.AIR;
            }
        }
    }
};

// saveToMongoDB( worldName, playerId )
//
// Saves the current world state to MongoDB.
World.prototype.saveToMongoDB = async function (worldName, playerId) {
    const worldData = {
        worldName: worldName,
        playerId: playerId,
        worldString: this.toNetworkString(),
        spawnPoint: {
            x: this.spawnPoint.x,
            y: this.spawnPoint.y,
            z: this.spawnPoint.z,
        },
    };

    await this.db.collection("worlds").updateOne(
        { worldName: worldName, playerId: playerId },
        { $set: worldData },
        { upsert: true }
    );

    console.log("World saved to MongoDB.");
};

// loadFromMongoDB( worldName, playerId )
//
// Loads a world from MongoDB based on world name and player ID.
World.prototype.loadFromMongoDB = async function (worldName, playerId) {
    const world = await this.db
        .collection("worlds")
        .findOne({ worldName: worldName, playerId: playerId });

    if (world) {
        this.createFromString(world.worldString);
        this.spawnPoint = new Vector(world.spawnPoint.x, world.spawnPoint.y, world.spawnPoint.z);
        return true;
    } else {
        return false;
    }
};

// createFromString( str )
World.prototype.createFromString = function (str) {
    var i = 0;
    for (var x = 0; x < this.sx; x++) {
        for (var y = 0; y < this.sy; y++) {
            for (var z = 0; z < this.sz; z++) {
                this.blocks[x][y][z] = BLOCK.fromId(str.charCodeAt(i) - 97);
                i++;
            }
        }
    }
};

// getBlock( x, y, z )
World.prototype.getBlock = function (x, y, z) {
    if (x < 0 || y < 0 || z < 0 || x >= this.sx || y >= this.sy || z >= this.sz) {
        return BLOCK.AIR; // If out of bounds, return air.
    }
    return this.blocks[x][y][z];
};

// setBlock( x, y, z )
World.prototype.setBlock = function (x, y, z, type) {
    if (x >= 0 && x < this.sx && y >= 0 && y < this.sy && z >= 0 && z < this.sz) {
        this.blocks[x][y][z] = type;
        if (this.renderer != null) {
            this.renderer.onBlockChanged(x, y, z); // Notify renderer if it exists.
        }
    }
};

// toNetworkString()
World.prototype.toNetworkString = function () {
    var blockArray = [];
    for (var x = 0; x < this.sx; x++) {
        for (var y = 0; y < this.sy; y++) {
            for (var z = 0; z < this.sz; z++) {
                blockArray.push(String.fromCharCode(97 + this.blocks[x][y][z].id));
            }
        }
    }
    return blockArray.join("");
};

// Export to node.js
if (typeof exports != "undefined") {
    // loadFromFile( filename )
    World.prototype.loadFromFile = function (filename) {
        var fs = require("fs");
        try {
            fs.lstatSync(filename);
            var data = fs.readFileSync(filename, "utf8").split(",");
            this.createFromString(data[3]);
            this.spawnPoint = new Vector(parseInt(data[0]), parseInt(data[1]), parseInt(data[2]));
            return true;
        } catch (e) {
            return false;
        }
    };

    // saveToFile( filename )
    World.prototype.saveToFile = function (filename) {
        var data = this.spawnPoint.x + "," + this.spawnPoint.y + "," + this.spawnPoint.z + "," + this.toNetworkString();
        require("fs").writeFileSync(filename, data);
    };

    exports.World = World;
}
