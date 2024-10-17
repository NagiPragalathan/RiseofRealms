// ==========================================
// Server
//
// This file contains all of the code necessary for managing a
// WebCraft server on the Node.js platform.
// ==========================================

// Parameters
var WORLD_SX = 128;
var WORLD_SY = 128;
var WORLD_SZ = 32;
var WORLD_GROUNDHEIGHT = 16;
var SECONDS_BETWEEN_SAVES = 60;
var ADMIN_IP = "";
const WORLD_NAME = "world2"; // Name for world in MongoDB
const PLAYER_ID = "admin"; // Player ID for tracking in MongoDB

// Load modules
var modules = {};
modules.helpers = require( "./js/helpers.js" );
modules.blocks = require( "./js/blocks.js" );
modules.world = require( "./js/world.js" );
modules.network = require( "./js/network.js" );
modules.io = require( "socket.io" );
modules.fs = require( "fs" );
var log = require( "util" ).log;
const { MongoClient } = require('mongodb');

// Set-up evil globals
global.Vector = modules.helpers.Vector;
global.BLOCK = modules.blocks.BLOCK;

// MongoDB setup
const uri = "mongodb+srv://nagi:nagi@cluster0.ohv5gsc.mongodb.net/";
const client = new MongoClient(uri);
let db;

// Create new empty world or load one from MongoDB
(async () => {
    try {
        await client.connect();
        db = client.db("gameDatabase"); // Connect to your MongoDB database
        log("Connected to MongoDB and loading world...");

        var world = new modules.world.World(WORLD_SX, WORLD_SY, WORLD_SZ, db);
        const loaded = await world.loadFromMongoDB(WORLD_NAME, PLAYER_ID);

        if (loaded) {
            log("Loaded the world from MongoDB.");
        } else {
            log("Creating a new empty world...");
            world.createFlatWorld(WORLD_GROUNDHEIGHT);
            await world.saveToMongoDB(WORLD_NAME, PLAYER_ID); // Save new world to MongoDB
        }

        // Start server
        var server = new modules.network.Server(modules.io, 16);
        server.setWorld(world);
        server.setLogger(log);
        server.setOneUserPerIp(true);
        log("Waiting for clients...");

        // Chat commands
        server.on("chat", function (client, nickname, msg) {
            if (msg == "/spawn") {
                server.setPos(client, world.spawnPoint.x, world.spawnPoint.y, world.spawnPoint.z);
                return true;
            } else if (msg.substr(0, 3) == "/tp") {
                var target = msg.substr(4);
                target = server.findPlayerByName(target);

                if (target != null) {
                    server.setPos(client, target.x, target.y, target.z);
                    server.sendMessage(nickname + " was teleported to " + target.nick + ".");
                    return true;
                } else {
                    server.sendMessage("Couldn't find that player!", client);
                    return false;
                }
            } else if (msg.substr(0, 5) == "/kick" && client.handshake.address.address == ADMIN_IP) {
                var target = msg.substr(6);
                target = server.findPlayerByName(target);

                if (target != null) {
                    server.kick(target.socket, "Kicked by Overv");
                    return true;
                } else {
                    server.sendMessage("Couldn't find that player!", client);
                    return false;
                }
            } else if (msg == "/list") {
                var playerlist = "";
                for (var p in world.players) playerlist += p + ", ";
                playerlist = playerlist.substring(0, playerlist.length - 2);
                server.sendMessage("Players: " + playerlist, client);
                return true;
            } else if (msg.substr(0, 1) == "/") {
                server.sendMessage("Unknown command!", client);
                return false;
            }
        });

        // Send a welcome message to new clients
        server.on("join", function (client, nickname) {
            server.sendMessage("Welcome! Enjoy your stay, " + nickname + "!", client);
            server.broadcastMessage(nickname + " joined the game.", client);
        });

        // Let players know of a disconnecting user
        server.on("leave", function (nickname) {
            server.sendMessage(nickname + " left the game.");
        });

        // Periodical saves to MongoDB
        setInterval(async function () {
            await world.saveToMongoDB(WORLD_NAME, PLAYER_ID);
            log("Saved world to MongoDB.");
        }, SECONDS_BETWEEN_SAVES * 1000);

    } catch (e) {
        console.error("Error connecting to MongoDB or loading world:", e);
    }
})();
