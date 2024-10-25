import fs from "fs";
import pathfinding from "pathfinding";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'; // Import cors
import dotenv from "dotenv";
import gTTS from 'gtts';
import { promises as fss } from "fs";
import axios from 'axios';
import * as THREE from "three";

// MongoDB setup
const uri = "mongodb+srv://nagi:nagi@cluster0.ohv5gsc.mongodb.net/";
const client = new MongoClient(uri);
let db;
dotenv.config();

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    db = client.db("gameDatabase");
    console.log("Connected to MongoDB and loading world...");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

// Call this function to ensure DB connection on start
connectToDB();

// Setup express app
const app = express();
app.use(bodyParser.json()); // To parse incoming request bodies
app.use(cors()); // Enable CORS for all requests

const origin = process.env.CLIENT_URL || "http://localhost:5173";
const io = new Server({
  cors: {
    origin,
  },
});

io.listen(3000);
console.log("Server started on port 3000, allowed CORS origin: " + origin);

// PATHFINDING UTILS

const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true,
});

const findPath = (room, start, end) => {
  const gridClone = room.grid.clone();
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone);
  return path;
};

const updateGrid = (room) => {
  for (let x = 0; x < room.size[0] * room.gridDivision; x++) {
    for (let y = 0; y < room.size[1] * room.gridDivision; y++) {
      room.grid.setWalkableAt(x, y, true);
    }
  }

  room.items.forEach((item) => {
    if (item.walkable || item.wall) {
      return;
    }
    const width =
      item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height =
      item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        room.grid.setWalkableAt(
          item.gridPosition[0] + x,
          item.gridPosition[1] + y,
          false
        );
      }
    }
  });
};

// ROOMS MANAGEMENT
const rooms = [];

const loadRooms = async () => {
  let data;
  try {
    data = fs.readFileSync("rooms.json", "utf8");
  } catch (ex) {
    console.log("No rooms.json file found, using default file");
    try {
      data = fs.readFileSync("default.json", "utf8");
    } catch (ex) {
      console.log("No default.json file found, exiting");
      process.exit(1);
    }
  }
  data = JSON.parse(data);
  data.forEach((roomItem) => {
    const room = {
      ...roomItem,
      size: [7, 7], // HARDCODED FOR SIMPLICITY PURPOSES
      gridDivision: 2,
      characters: [],
    };
    room.grid = new pathfinding.Grid(
      room.size[0] * room.gridDivision,
      room.size[1] * room.gridDivision
    );
    updateGrid(room);
    rooms.push(room);
  });
};

loadRooms();

// UTILS

const generateRandomPosition = (room) => {
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * room.size[0] * room.gridDivision);
    const y = Math.floor(Math.random() * room.size[1] * room.gridDivision);
    if (room.grid.isWalkableAt(x, y)) {
      return [x, y];
    }
  }
};

// SOCKET MANAGEMENT

io.on("connection", (socket) => {
  try {
    let room = null;
    let character = null;

    socket.emit("welcome", {
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        nbCharacters: room.characters.length,
      })),
      items,
    });

    socket.on("joinRoom", (roomId, opts) => {
      room = rooms.find((room) => room.id === roomId);
      if (!room) {
        return;
      }
      socket.join(room.id);
      character = {
        id: socket.id,
        session: parseInt(Math.random() * 1000),
        position: generateRandomPosition(room),
        avatarUrl: opts.avatarUrl,
      };
      room.characters.push(character);

      socket.emit("roomJoined", {
        map: {
          gridDivision: room.gridDivision,
          size: room.size,
          items: room.items,
        },
        characters: room.characters,
        id: socket.id,
      });
      onRoomUpdate();
    });

    const onRoomUpdate = () => {
      io.to(room.id).emit("characters", room.characters);
      io.emit(
        "rooms",
        rooms.map((room) => ({
          id: room.id,
          name: room.name,
          nbCharacters: room.characters.length,
        }))
      );
    };

    socket.on("leaveRoom", () => {
      if (!room) {
        return;
      }
      socket.leave(room.id);
      room.characters.splice(
        room.characters.findIndex((character) => character.id === socket.id),
        1
      );
      onRoomUpdate();
      room = null;
    });

    socket.on("characterAvatarUpdate", (avatarUrl) => {
      character.avatarUrl = avatarUrl;
      io.to(room.id).emit("characters", room.characters);
    });

    socket.on("move", (from, to) => {
      const path = findPath(room, from, to);
      if (!path) {
        return;
      }
      character.position = from;
      character.path = path;
      io.to(room.id).emit("playerMove", character);
    });

    socket.on("dance", () => {
      io.to(room.id).emit("playerDance", {
        id: socket.id,
      });
    });

    socket.on("chatMessage", (message) => {
      io.to(room.id).emit("playerChatMessage", {
        id: socket.id,
        message,
      });
    });

    socket.on("passwordCheck", (password) => {
      if (password === room.password) {
        socket.emit("passwordCheckSuccess");
        character.canUpdateRoom = true;
      } else {
        socket.emit("passwordCheckFail");
      }
    });

    socket.on("itemsUpdate", async (items) => {
      if (!character.canUpdateRoom) {
        return;
      }
      if (!items || items.length === 0) {
        return; // security
      }
      room.items = items;
      updateGrid(room);
      room.characters.forEach((character) => {
        character.path = [];
        character.position = generateRandomPosition(room);
      });
      io.to(room.id).emit("mapUpdate", {
        map: {
          gridDivision: room.gridDivision,
          size: room.size,
          items: room.items,
        },
        characters: room.characters,
      });

      fs.writeFileSync("rooms.json", JSON.stringify(rooms, null, 2));
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      if (room) {
        room.characters.splice(
          room.characters.findIndex((character) => character.id === socket.id),
          1
        );
        onRoomUpdate();
        room = null;
      }
    });
  } catch (ex) {
    console.log(ex);
  }
});

// SHOP ITEMS
const items = {
  washer: {
    name: "washer",
    size: [2, 2],
  },
  toiletSquare: {
    name: "toiletSquare",
    size: [2, 2],
  }
};

// Express API for storing avatar models into MongoDB

// Store avatar model for a player
app.post("/api/store-avatar", async (req, res) => {
  const { player_id, model_url } = req.body;

  if (!player_id || !model_url) {
    return res.status(400).json({ message: 'Missing player_id or model_url.' });
  }

  try {
    const collection = db.collection("avatars");

    // Store the model URL for the player
    await collection.updateOne(
      { player_id }, // Find by player_id
      { $set: { model_url, updatedAt: new Date() } }, // Update the model_url and timestamp
      { upsert: true } // If the document doesn't exist, create it
    );

    res.status(200).json({ message: "Model URL stored successfully." });
  } catch (err) {
    console.error("Error storing model URL:", err);
    res.status(500).json({ message: "Error storing model URL.", error: err });
  }
});

// Retrieve the last model URL by player_id
app.get("/api/get-avatar/:player_id", async (req, res) => {
  const player_id = req.params.player_id;

  try {
    const collection = db.collection("avatars");

    // Retrieve the most recent model URL for the player
    const playerData = await collection.findOne({ player_id });

    if (playerData) {
      res.status(200).json({ model_url: playerData.model_url });
    } else {
      res.status(404).json({ message: "No model found for the specified player_id." });
    }
  } catch (err) {
    console.error("Error retrieving model URL:", err);
    res.status(500).json({ message: "Error retrieving model URL.", error: err });
  }
});



// Virtual Girlfriend ///////////////////////////////////////////////////////////////////////////////

// Phoneme to Viseme mapping for morph target influences
const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

// Function to generate speech using gTTS and save it as an MP3 file
const generateSpeech = async (text, fileName) => {
  const gtts = new gTTS(text, 'en');
  return new Promise((resolve, reject) => {
    gtts.save(fileName, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// Function to generate random lip sync data
const generateRandomLipSync = () => {
  const phonemes = ["A", "B", "C", "D", "E", "F", "G", "H", "X"]; // Random phoneme placeholders
  const lipSyncData = [];
  const numEntries = Math.floor(Math.random() * 10) + 5; // Random number of entries between 5 and 15

  for (let i = 0; i < numEntries; i++) {
    lipSyncData.push({
      start: Math.random() * 3,  // Random start time within 3 seconds
      end: Math.random() * 3 + 1,  // Random end time within 4 seconds
      value: phonemes[Math.floor(Math.random() * phonemes.length)]
    });
  }

  return lipSyncData;
};

// Function to update morph targets based on lip sync data
const updateMorphTargets = (nodes, lipSyncData, currentTime, smoothMorphTarget, morphTargetSmoothing) => {
  Object.values(corresponding).forEach((value) => {
    if (!smoothMorphTarget) {
      nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
    } else {
      nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = THREE.MathUtils.lerp(
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]],
        0,
        morphTargetSmoothing
      );
      nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = THREE.MathUtils.lerp(
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]],
        0,
        morphTargetSmoothing
      );
    }
  });

  for (let i = 0; i < lipSyncData.length; i++) {
    const mouthCue = lipSyncData[i];
    if (currentTime >= mouthCue.start && currentTime <= mouthCue.end) {
      const viseme = corresponding[mouthCue.value];
      if (!smoothMorphTarget) {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[viseme]] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]] = 1;
      } else {
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[viseme]] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[viseme]],
          1,
          morphTargetSmoothing
        );
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[viseme]],
          1,
          morphTargetSmoothing
        );
      }
      break;
    }
  }
};

// POST route to handle chat messages and generate the virtual girlfriend's response
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hey dear... How was your day?",
          audio: await audioFileToBase64("audios/intro_0.mp3"), // Using MP3 file directly without conversion
          lipsync: generateRandomLipSync(), // Generating random lip sync data
          facialExpression: "smile",
          animation: "Talking_1",
        },
        {
          text: "I missed you so much... Please don't go for so long!",
          audio: await audioFileToBase64("audios/intro_1.mp3"),
          lipsync: generateRandomLipSync(),
          facialExpression: "sad",
          animation: "Crying",
        },
      ],
    });
    return;
  }

  try {
    // Call the local chatbot service
    const chatbotResponse = await axios.post('http://127.0.0.1:5000/chat', { message: userMessage });

    let messages = chatbotResponse.data;  // Expecting direct array of messages as per the example you provided

    // Loop through the messages and generate audio data
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const fileName = `audios/message_${i}.mp3`; // The name of the audio file to generate

      // Generate speech using gTTS
      await generateSpeech(message.text, fileName);

      // Convert the audio file to Base64 and attach it to the message
      message.audio = await audioFileToBase64(fileName);

      // Attach random lip sync data to each message
      message.lipsync = generateRandomLipSync();
    }

    // Send the response back to the client
    res.send({ messages });

  } catch (error) {
    console.error('Error calling the local chatbot service:', error);
    res.status(500).send({ error: 'Failed to process the request' });
  }
});

// Helper function to convert audio files to base64 format
const audioFileToBase64 = async (file) => {
  const data = await fss.readFile(file);
  return data.toString("base64");
};


////////////////////////////////////////////////////////////////////////////////////////////////////

// Start the Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server started on port ${PORT}`);
});
