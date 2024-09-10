const express = require("express");
const db = require("../firebaseConfig.js");
const { collection, query, where, getDocs } = require("firebase/firestore");
const simpleDecryptFun = require("../utility/encrptionDecrption.js");
const router = express.Router();

router.get("/", async (req, res) => {
    const encryptedID = req.query.id;
    
    if (!encryptedID) {
        return res.status(400).json({ error: "Missing 'id' parameter in the query" });
    }
    
    const videoId = simpleDecryptFun(encryptedID);

    if (!videoId) {
        return res.status(400).json({ error: `Invalid 'id' parameter in the query: ${encryptedID}` });
    }

    try {
        const storiesRef = collection(db, "stories");
        const q = query(storiesRef, where("id", "==", videoId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ error: `No story found with the ID: ${videoId}` });
        }

        let storyData = [];
        querySnapshot.forEach((doc) => {
            storyData.push(doc.data());
        });

        res.json(storyData[0]);

    } catch (error) {
        console.error("Error fetching story:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
